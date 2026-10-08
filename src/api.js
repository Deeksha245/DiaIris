const API_BASE = "http://127.0.0.1:8001"

function getToken() {
return localStorage.getItem("token")
}

// ==================== AUTH ====================

export async function signup(
name,
email,
password,
phone,
role = "patient"
) {
const params = new URLSearchParams({
name,
email,
password,
phone,
role
})

const res = await fetch(`${API_BASE}/api/signup?${params}`, {
method: "POST"
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Signup failed")
}

return data
}

export async function login(email, password) {
const params = new URLSearchParams({
email,
password
})

const res = await fetch(`${API_BASE}/api/login?${params}`, {
method: "POST"
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Login failed")
}

return data
}

export async function getMe() {
const token = getToken()

const res = await fetch(`${API_BASE}/api/me`, {
headers: {
Authorization: `Bearer ${token}`
}
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Not authenticated")
}

return data
}

// ==================== DIABETIC RETINOPATHY ====================

export async function predict(file) {
const token = getToken()

if (!token) {
throw new Error("Please log in again")
}

const formData = new FormData()
formData.append("file", file)

const res = await fetch(`${API_BASE}/api/predict`, {
method: "POST",
headers: {
Authorization: `Bearer ${token}`
},
body: formData
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Prediction failed")
}

return data
}

// ==================== SCREENING HISTORY ====================

export async function getScans() {
const token = getToken()

const res = await fetch(`${API_BASE}/api/scans`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`
}
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to fetch scans")
}

return data
}

// ==================== APPOINTMENTS ====================

export async function createAppointment(
doctor_name,
appointment_date,
notes = ""
) {
const token = getToken()

const params = new URLSearchParams({
doctor_name,
appointment_date,
notes
})

const res = await fetch(
`${API_BASE}/api/appointments?${params}`,
{
method: "POST",
headers: {
Authorization: `Bearer ${token}`
}
}
)

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to create appointment")
}

return data
}

export async function getAppointments() {
const token = getToken()

const res = await fetch(`${API_BASE}/api/appointments`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`
}
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to fetch appointments")
}

return data
}

// ==================== MEDICATIONS ====================

export async function createMedication(
name,
dosage,
time_of_day,
notes = ""
) {
const token = getToken()

const params = new URLSearchParams({
name,
dosage,
time_of_day,
notes
})

const res = await fetch(
`${API_BASE}/api/medications?${params}`,
{
method: "POST",
headers: {
Authorization: `Bearer ${token}`
}
}
)

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to create medication")
}

return data
}

export async function getMedications() {
const token = getToken()

const res = await fetch(`${API_BASE}/api/medications`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`
}
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to fetch medications")
}

return data
}

// ==================== ADMIN ====================

export async function getAdminStats() {
const token = getToken()

const res = await fetch(`${API_BASE}/api/admin/stats`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`
}
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to fetch admin stats")
}

return data
}

export async function getPatients() {
const token = getToken()

const res = await fetch(`${API_BASE}/api/admin/patients`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`
}
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to fetch patients")
}

return data
}

export async function assignMedication(
patient_id,
name,
dosage,
time_of_day,
notes = ""
) {
const token = getToken()

const params = new URLSearchParams({
patient_id: String(patient_id),
name,
dosage,
time_of_day,
notes
})

const res = await fetch(
`${API_BASE}/api/admin/medications?${params}`,
{
method: "POST",
headers: {
Authorization: `Bearer ${token}`
}
}
)

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to assign medication")
}

return data
}

export async function getAdminScreenings() {
const token = getToken()

const res = await fetch(`${API_BASE}/api/admin/screenings`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`
}
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to fetch screenings")
}

return data
}

export async function getAdminAppointments() {
const token = getToken()

const res = await fetch(`${API_BASE}/api/admin/appointments`, {
method: "GET",
headers: {
Authorization: `Bearer ${token}`
}
})

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to fetch appointments")
}

return data
}

// ==================== PROFILE ====================

export async function updatePhone(phone) {
const token = getToken()

const params = new URLSearchParams({
phone
})

const res = await fetch(
`${API_BASE}/api/profile/phone?${params}`,
{
method: "PUT",
headers: {
Authorization: `Bearer ${token}`
}
}
)

const data = await res.json()

if (!res.ok) {
throw new Error(data.detail || "Failed to update phone")
}

return data
}
