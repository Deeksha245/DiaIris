import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminStats,
  getPatients,
  assignMedication,
} from "../api";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    name: "",
    dosage: "",
    time_of_day: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsData, patientsData] = await Promise.all([
        getAdminStats(),
        getPatients(),
      ]);

      setStats(statsData);
      setPatients(patientsData);
    } catch (err) {
      console.error(err);
      setError("Unable to load admin dashboard.");
    }
  }

  async function handleMedication(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.patient_id || !form.name || !form.dosage || !form.time_of_day) {
      setError("Please fill all required medication fields.");
      return;
    }

    try {
      await assignMedication({
        patient_id: Number(form.patient_id),
        name: form.name,
        dosage: form.dosage,
        time_of_day: form.time_of_day,
        notes: form.notes,
      });

      setMessage("Medication assigned successfully.");

      setForm({
        patient_id: "",
        name: "",
        dosage: "",
        time_of_day: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to assign medication.");
    }
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <header className="admin-topbar">
        <div>
          <div className="admin-kicker">DIAIRIS ADMIN</div>
          <h1>Admin Dashboard</h1>
          <p>Manage patients, screenings, appointments and medications.</p>
        </div>

        <Link to="/" className="admin-home-btn">
          Back to Website
        </Link>
      </header>

      {/* STATS */}
      <section className="admin-stat-grid">

        <div className="admin-stat">
          <span>Total Patients</span>
          <strong>{stats.total_patients ?? 0}</strong>
        </div>

        <div className="admin-stat">
          <span>Total Screenings</span>
          <strong>{stats.total_scans ?? 0}</strong>
        </div>

        <div className="admin-stat">
          <span>DR Positive</span>
          <strong>{stats.dr_positive_scans ?? 0}</strong>
        </div>

        <div className="admin-stat">
          <span>Appointments</span>
          <strong>{stats.total_appointments ?? 0}</strong>
        </div>

        <div className="admin-stat">
          <span>Medications</span>
          <strong>{stats.total_medications ?? 0}</strong>
        </div>

      </section>

      {/* MANAGEMENT */}
      <section className="admin-section">

        <div className="admin-section-title">
          <h2>Management</h2>
          <p>Open an area to manage DIAIRIS data.</p>
        </div>

        <div className="admin-management-grid">

          <Link to="/admin/patients" className="admin-management-card">
            <div className="admin-card-number">01</div>
            <h3>Patients</h3>
            <p>View registered patients and their details.</p>
          </Link>

          <Link to="/admin/screenings" className="admin-management-card">
            <div className="admin-card-number">02</div>
            <h3>Screenings</h3>
            <p>View retinal screening results and confidence.</p>
          </Link>

          <Link to="/admin/appointments" className="admin-management-card">
            <div className="admin-card-number">03</div>
            <h3>Appointments</h3>
            <p>View and manage patient appointments.</p>
          </Link>

          <Link to="/admin/medications" className="admin-management-card">
            <div className="admin-card-number">04</div>
            <h3>Medications</h3>
            <p>Assign medication and send patient information.</p>
          </Link>

        </div>

      </section>

      {/* PATIENTS */}
      <section className="admin-section">

        <div className="admin-section-title">
          <h2>Registered Patients</h2>
          <p>Recently available patient accounts.</p>
        </div>

        {patients.length === 0 ? (
          <div className="admin-empty">
            No patients found.
          </div>
        ) : (
          <div className="admin-table-container">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.email}</td>
                    <td>{patient.phone || "Not provided"}</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* MEDICATION */}
      <section className="admin-section">

        <div className="admin-section-title">
          <h2>Quick Medication Assignment</h2>
          <p>Assign medication directly from the dashboard.</p>
        </div>

        {message && (
          <div className="admin-message success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-message error">
            {error}
          </div>
        )}

        <form
          className="admin-medication-form"
          onSubmit={handleMedication}
        >

          <div className="admin-field">
            <label>Patient</label>

            <select
              value={form.patient_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  patient_id: e.target.value,
                })
              }
            >
              <option value="">Select patient</option>

              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} — {patient.email}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label>Medication Name</label>

            <input
              type="text"
              placeholder="Medication name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="admin-field">
            <label>Dosage</label>

            <input
              type="text"
              placeholder="Example: 1 tablet"
              value={form.dosage}
              onChange={(e) =>
                setForm({
                  ...form,
                  dosage: e.target.value,
                })
              }
            />
          </div>

          <div className="admin-field">
            <label>Time</label>

            <input
              type="time"
              value={form.time_of_day}
              onChange={(e) =>
                setForm({
                  ...form,
                  time_of_day: e.target.value,
                })
              }
            />
          </div>

          <div className="admin-field admin-full">
            <label>Notes</label>

            <textarea
              placeholder="Instructions or notes"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
            />
          </div>

          <div className="admin-full">
            <button type="submit" className="admin-submit">
              Assign Medication
            </button>
          </div>

        </form>

      </section>

    </div>
  );
}

export default AdminDashboard;