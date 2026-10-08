from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import tensorflow as tf
import numpy as np
import cv2
import requests
import os
import base64

from database import (
    init_db,
    get_db,
    User,
    Scan,
    Appointment,
    Medication
)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

from dotenv import load_dotenv
from whatsapp_service import send_whatsapp_message


# =========================================================
# APP SETUP
# =========================================================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

init_db()

model = tf.keras.models.load_model("dr_model.keras")


# =========================================================
# IMAGE PREPROCESSING
# =========================================================

def preprocess_image(img):

    img = cv2.resize(img, (224, 224))

    lab = cv2.cvtColor(
        img,
        cv2.COLOR_RGB2LAB
    )

    l, a, b = cv2.split(lab)

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    l = clahe.apply(l)

    img = cv2.merge(
        (l, a, b)
    )

    img = cv2.cvtColor(
        img,
        cv2.COLOR_LAB2RGB
    )

    img = img.astype(np.float32)

    img = np.expand_dims(
        img,
        axis=0
    )

    return img


# =========================================================
# GRAD-CAM
# =========================================================

def generate_gradcam_overlay(
    original_img,
    processed_img
):

    try:

        last_conv_layer = None

        for layer in reversed(model.layers):

            if isinstance(
                layer,
                tf.keras.layers.Conv2D
            ):
                last_conv_layer = layer
                break

        if last_conv_layer is None:

            print(
                "Grad-CAM: No convolutional layer found"
            )

            return None

        grad_model = tf.keras.models.Model(
            inputs=model.inputs,
            outputs=[
                last_conv_layer.output,
                model.output
            ]
        )

        with tf.GradientTape() as tape:

            conv_outputs, predictions = grad_model(
                processed_img
            )

            prediction = predictions[:, 0]

        gradients = tape.gradient(
            prediction,
            conv_outputs
        )

        if gradients is None:

            print(
                "Grad-CAM: Gradients are None"
            )

            return None

        pooled_gradients = tf.reduce_mean(
            gradients,
            axis=(1, 2)
        )

        conv_outputs = conv_outputs[0]

        pooled_gradients = pooled_gradients[0]

        heatmap = tf.reduce_sum(
            conv_outputs * pooled_gradients,
            axis=-1
        )

        heatmap = tf.maximum(
            heatmap,
            0
        )

        max_value = tf.reduce_max(
            heatmap
        )

        if float(max_value.numpy()) > 0:

            heatmap = (
                heatmap / max_value
            )

        heatmap = heatmap.numpy()

        heatmap = cv2.resize(
            heatmap,
            (
                original_img.shape[1],
                original_img.shape[0]
            )
        )

        heatmap = np.uint8(
            255 * heatmap
        )

        heatmap_color = cv2.applyColorMap(
            heatmap,
            cv2.COLORMAP_JET
        )

        original_bgr = cv2.cvtColor(
            original_img,
            cv2.COLOR_RGB2BGR
        )

        overlay = cv2.addWeighted(
            original_bgr,
            0.6,
            heatmap_color,
            0.4,
            0
        )

        success, buffer = cv2.imencode(
            ".jpg",
            overlay
        )

        if not success:

            print(
                "Grad-CAM: Failed to encode image"
            )

            return None

        heatmap_base64 = base64.b64encode(
            buffer
        ).decode("utf-8")

        return (
            "data:image/jpeg;base64,"
            + heatmap_base64
        )

    except Exception as e:

        print(
            "Grad-CAM error:",
            e
        )

        return None


# =========================================================
# AUTHENTICATION
# =========================================================

def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):

    if (
        not authorization
        or not authorization.startswith("Bearer ")
    ):

        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = decode_access_token(
        token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(
        User.id == payload.get("user_id")
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


# =========================================================
# AUTH
# =========================================================

@app.post("/api/signup")
def signup(
    name: str,
    email: str,
    password: str,
    phone: str = "",
    role: str = "patient",
    db: Session = Depends(get_db)
):

    existing = db.query(User).filter(
        User.email == email
    ).first()

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password),
        role=role,
        phone=phone
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role
        }
    }


@app.post("/api/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user or not verify_password(
        password,
        user.hashed_password
    ):

        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role
        }
    }


# =========================================================
# FORGOT PASSWORD
# =========================================================

@app.post("/api/forgot-password")
def forgot_password(
    email: str,
    new_password: str,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="No account found with this email"
        )

    if len(new_password) < 6:

        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    user.hashed_password = hash_password(
        new_password
    )

    db.commit()

    return {
        "message": "Password reset successfully"
    }


# =========================================================
# CURRENT USER
# =========================================================

@app.get("/api/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role
    }


# =========================================================
# PROFILE PHONE
# =========================================================

@app.put("/api/profile/phone")
def update_phone(
    phone: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    current_user.phone = phone

    db.commit()

    db.refresh(current_user)

    return {
        "message": "Phone number updated successfully",
        "phone": current_user.phone
    }


# =========================================================
# SCAN / PREDICTION
# =========================================================

@app.post("/api/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    contents = await file.read()

    nparr = np.frombuffer(
        contents,
        np.uint8
    )

    img = cv2.imdecode(
        nparr,
        cv2.IMREAD_COLOR
    )

    if img is None:

        raise HTTPException(
            status_code=400,
            detail="Invalid image file"
        )

    img = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2RGB
    )

    processed = preprocess_image(
        img
    )

    prediction = model.predict(
        processed,
        verbose=0
    )[0][0]

    result = (
        "DR_present"
        if prediction > 0.5
        else "No_DR"
    )

    confidence = (
        float(prediction)
        if prediction > 0.5
        else float(1 - prediction)
    )

    confidence = round(
        confidence * 100,
        2
    )

    heatmap_image = generate_gradcam_overlay(
        img,
        processed
    )

    scan = Scan(
        user_id=current_user.id,
        result=result,
        confidence=confidence
    )

    db.add(scan)

    db.commit()

    db.refresh(scan)

    return {
        "result": result,
        "confidence": confidence,
        "scan_id": scan.id,
        "heatmap": heatmap_image
    }


@app.get("/api/scans")
def get_scans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    scans = db.query(Scan).filter(
        Scan.user_id == current_user.id
    ).order_by(
        Scan.created_at.desc()
    ).all()

    return [
        {
            "id": s.id,
            "result": s.result,
            "confidence": s.confidence,
            "created_at": s.created_at
        }
        for s in scans
    ]


# =========================================================
# APPOINTMENTS
# =========================================================

@app.post("/api/appointments")
def create_appointment(
    doctor_name: str,
    appointment_date: str,
    notes: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    appt = Appointment(
        user_id=current_user.id,
        doctor_name=doctor_name,
        appointment_date=appointment_date,
        notes=notes
    )

    db.add(appt)

    db.commit()

    db.refresh(appt)

    if current_user.phone:

        message = f"""DIAIRIS APPOINTMENT CONFIRMATION

Hello {current_user.name},

Your appointment has been successfully booked.

Doctor: {appt.doctor_name}

Date & Time: {appt.appointment_date}

Thank you for using DIAIRIS.

Please arrive on time for your appointment.

- DIAIRIS Team"""

        try:

            send_whatsapp_message(
                current_user.phone,
                message
            )

            print(
                "WhatsApp confirmation sent successfully."
            )

        except Exception as e:

            print(
                "WhatsApp notification failed:",
                e
            )

    else:

        print(
            "No phone number found for this user."
        )

    return {
        "id": appt.id,
        "doctor_name": appt.doctor_name,
        "appointment_date": appt.appointment_date,
        "status": appt.status
    }


@app.get("/api/appointments")
def get_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    appts = db.query(Appointment).filter(
        Appointment.user_id == current_user.id
    ).order_by(
        Appointment.created_at.desc()
    ).all()

    return [
        {
            "id": a.id,
            "doctor_name": a.doctor_name,
            "appointment_date": a.appointment_date,
            "status": a.status,
            "notes": a.notes
        }
        for a in appts
    ]


# =========================================================
# MEDICATIONS - PATIENT
# =========================================================

@app.post("/api/medications")
def create_medication(
    name: str,
    dosage: str,
    time_of_day: str,
    notes: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    med = Medication(
        user_id=current_user.id,
        name=name,
        dosage=dosage,
        time_of_day=time_of_day,
        notes=notes,
        prescribed_by=current_user.name,
        active=1
    )

    db.add(med)

    db.commit()

    db.refresh(med)

    return {
        "id": med.id,
        "name": med.name,
        "dosage": med.dosage,
        "time_of_day": med.time_of_day,
        "notes": med.notes,
        "prescribed_by": med.prescribed_by,
        "active": med.active
    }


@app.get("/api/medications")
def get_medications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    meds = db.query(Medication).filter(
        Medication.user_id == current_user.id,
        Medication.active == 1
    ).order_by(
        Medication.created_at.desc()
    ).all()

    return [
        {
            "id": m.id,
            "name": m.name,
            "dosage": m.dosage,
            "time_of_day": m.time_of_day,
            "notes": m.notes,
            "prescribed_by": m.prescribed_by,
            "active": m.active,
            "created_at": m.created_at
        }
        for m in meds
    ]


# =========================================================
# MEDICATIONS - DOCTOR / ADMIN
# =========================================================

@app.get("/api/admin/patients")
def get_patients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role not in ["admin", "doctor"]:

        raise HTTPException(
            status_code=403,
            detail="Doctor/Admin access only"
        )

    patients = db.query(User).filter(
        User.role == "patient"
    ).order_by(
        User.name.asc()
    ).all()

    return [
        {
            "id": p.id,
            "name": p.name,
            "email": p.email,
            "phone": p.phone
        }
        for p in patients
    ]


@app.post("/api/admin/medications")
def assign_medication(
    patient_id: int,
    name: str,
    dosage: str,
    time_of_day: str,
    notes: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role not in ["admin", "doctor"]:

        raise HTTPException(
            status_code=403,
            detail="Doctor/Admin access only"
        )

    patient = db.query(User).filter(
        User.id == patient_id,
        User.role == "patient"
    ).first()

    if not patient:

        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    med = Medication(
        user_id=patient.id,
        name=name,
        dosage=dosage,
        time_of_day=time_of_day,
        notes=notes,
        prescribed_by=current_user.name,
        active=1
    )

    db.add(med)

    db.commit()

    db.refresh(med)

    # -----------------------------------------------------
    # Send immediate WhatsApp information
    # -----------------------------------------------------

    if patient.phone:

        message = f"""DIAIRIS MEDICATION INFORMATION

Hello {patient.name},

A medication has been added to your DIAIRIS account.

Medication: {med.name}
Dosage: {med.dosage}
Scheduled Time: {med.time_of_day}

Instructions/Notes:
{med.notes if med.notes else "Please follow the instructions provided by your doctor."}

Assigned by: {current_user.name}

Please take the medication only as prescribed by your qualified healthcare professional.

- DIAIRIS Team"""

        try:

            send_whatsapp_message(
                patient.phone,
                message
            )

            print(
                "Medication WhatsApp message sent successfully."
            )

        except Exception as e:

            print(
                "Medication WhatsApp notification failed:",
                e
            )

    else:

        print(
            "Patient does not have a phone number."
        )

    return {
        "message": "Medication assigned successfully",
        "id": med.id,
        "patient_id": patient.id,
        "patient_name": patient.name,
        "name": med.name,
        "dosage": med.dosage,
        "time_of_day": med.time_of_day,
        "notes": med.notes,
        "prescribed_by": med.prescribed_by,
        "active": med.active
    }


# =========================================================
# ADMIN STATS
# =========================================================

@app.get("/api/admin/stats")
def admin_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access only"
        )

    total_patients = db.query(User).filter(
        User.role == "patient"
    ).count()

    total_scans = db.query(
        Scan
    ).count()

    dr_positive_scans = db.query(
        Scan
    ).filter(
        Scan.result == "DR_present"
    ).count()

    total_appointments = db.query(
        Appointment
    ).count()

    total_medications = db.query(
        Medication
    ).filter(
        Medication.active == 1
    ).count()

    return {
        "total_patients": total_patients,
        "total_scans": total_scans,
        "dr_positive_scans": dr_positive_scans,
        "total_appointments": total_appointments,
        "total_medications": total_medications
    }


# =========================================================
# CHATBOT
# =========================================================

@app.post("/api/chat")
def chat(
    message: str,
    current_user: User = Depends(get_current_user)
):

    api_key = os.getenv(
        "GROQ_API_KEY"
    )

    system_context = (
        "You are DiaIris Assistant, a helpful AI assistant for a "
        "diabetic retinopathy screening application. "
        "Answer questions about diabetic retinopathy, eye health, "
        "symptoms, prevention, screening, and general eye-care guidance. "
        "Do not diagnose the user or claim that the user has a disease. "
        "Do not prescribe or recommend specific prescription medicines. "
        "Always remind users that you are not a substitute for a "
        "qualified eye-care professional when discussing medical concerns. "
        "If the user describes serious or sudden vision problems, "
        "recommend prompt medical attention. "
        "Keep responses clear, helpful, and concise."
    )

    try:

        url = (
            "https://api.groq.com/openai/v1/chat/completions"
        )

        payload = {

            "model": "llama-3.3-70b-versatile",

            "messages": [

                {
                    "role": "system",
                    "content": system_context
                },

                {
                    "role": "user",
                    "content": message
                }

            ],

            "temperature": 0.3,

            "max_tokens": 300
        }

        r = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=30
        )

        data = r.json()

        if r.status_code != 200:

            return {
                "reply": (
                    "Sorry, I could not process that right now."
                ),
                "error": data
            }

        reply = data[
            "choices"
        ][0][
            "message"
        ][
            "content"
        ]

        return {
            "reply": reply
        }

    except Exception as e:

        return {
            "reply": (
                "Sorry, I could not connect to the AI assistant."
            ),
            "error": str(e)
        }