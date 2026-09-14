from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import tensorflow as tf
import numpy as np
import cv2

from database import init_db, get_db, User, Scan, Appointment, Medication
from auth import hash_password, verify_password, create_access_token, decode_access_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

model = tf.keras.models.load_model('dr_model.keras')


def preprocess_image(img):
    img = cv2.resize(img, (224, 224))
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    img = cv2.merge((l, a, b))
    img = cv2.cvtColor(img, cv2.COLOR_LAB2RGB)
    img = img.astype(np.float32)
    img = np.expand_dims(img, axis=0)
    return img


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == payload.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------- AUTH ----------

@app.post("/api/signup")
def signup(name: str, email: str, password: str, role: str = "patient", db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(name=name, email=email, hashed_password=hash_password(password), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"user_id": user.id, "role": user.role})
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}


@app.post("/api/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_access_token({"user_id": user.id, "role": user.role})
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}


@app.get("/api/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "role": current_user.role}


# ---------- SCAN / PREDICTION ----------

@app.post("/api/predict")
async def predict(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    processed = preprocess_image(img)
    prediction = model.predict(processed)[0][0]

    result = "DR_present" if prediction > 0.5 else "No_DR"
    confidence = float(prediction) if prediction > 0.5 else float(1 - prediction)
    confidence = round(confidence * 100, 2)

    scan = Scan(user_id=current_user.id, result=result, confidence=confidence)
    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {"result": result, "confidence": confidence, "scan_id": scan.id}


@app.get("/api/scans")
def get_scans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).order_by(Scan.created_at.desc()).all()
    return [{"id": s.id, "result": s.result, "confidence": s.confidence, "created_at": s.created_at} for s in scans]


# ---------- APPOINTMENTS ----------

@app.post("/api/appointments")
def create_appointment(doctor_name: str, appointment_date: str, notes: str = "", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    appt = Appointment(user_id=current_user.id, doctor_name=doctor_name, appointment_date=appointment_date, notes=notes)
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return {"id": appt.id, "doctor_name": appt.doctor_name, "appointment_date": appt.appointment_date, "status": appt.status}


@app.get("/api/appointments")
def get_appointments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    appts = db.query(Appointment).filter(Appointment.user_id == current_user.id).order_by(Appointment.created_at.desc()).all()
    return [{"id": a.id, "doctor_name": a.doctor_name, "appointment_date": a.appointment_date, "status": a.status, "notes": a.notes} for a in appts]


# ---------- MEDICATIONS ----------

@app.post("/api/medications")
def create_medication(name: str, dosage: str, time_of_day: str, notes: str = "", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    med = Medication(user_id=current_user.id, name=name, dosage=dosage, time_of_day=time_of_day, notes=notes)
    db.add(med)
    db.commit()
    db.refresh(med)
    return {"id": med.id, "name": med.name, "dosage": med.dosage, "time_of_day": med.time_of_day}


@app.get("/api/medications")
def get_medications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meds = db.query(Medication).filter(Medication.user_id == current_user.id).all()
    return [{"id": m.id, "name": m.name, "dosage": m.dosage, "time_of_day": m.time_of_day, "notes": m.notes} for m in meds]


# ---------- ADMIN ----------

@app.get("/api/admin/stats")
def admin_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    total_patients = db.query(User).filter(User.role == "patient").count()
    total_scans = db.query(Scan).count()
    dr_positive_scans = db.query(Scan).filter(Scan.result == "DR_present").count()
    total_appointments = db.query(Appointment).count()
    return {
        "total_patients": total_patients,
        "total_scans": total_scans,
        "dr_positive_scans": dr_positive_scans,
        "total_appointments": total_appointments,
    }