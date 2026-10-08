import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients, assignMedication } from "../../api";

function AdminMedications() {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.patient_id ||
      !form.name ||
      !form.dosage ||
      !form.time_of_day
    ) {
      setError("Please fill all required fields.");
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

      setMessage(
        "Medication assigned successfully. Patient notification was sent if a phone number is available."
      );

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
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <div className="admin-label">DIAIRIS ADMIN</div>
            <h1>Medication Management</h1>
            <p>
              Assign medication information to registered patients.
            </p>
          </div>

          <Link to="/admin" className="admin-back-btn">
            ← Admin Dashboard
          </Link>
        </div>

        {message && (
          <div className="admin-success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <section className="admin-section">

          <h2>Assign Medication</h2>

          {loading ? (
            <p>Loading patients...</p>
          ) : patients.length === 0 ? (
            <p>No registered patients found.</p>
          ) : (
            <form
              className="admin-medication-form"
              onSubmit={handleSubmit}
            >

              <label>
                Patient
              </label>

              <select
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.name} — {patient.email}
                  </option>
                ))}
              </select>


              <label>
                Medication Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Example: Medication name"
                value={form.name}
                onChange={handleChange}
              />


              <label>
                Dosage
              </label>

              <input
                type="text"
                name="dosage"
                placeholder="Example: 1 tablet"
                value={form.dosage}
                onChange={handleChange}
              />


              <label>
                Time
              </label>

              <input
                type="time"
                name="time_of_day"
                value={form.time_of_day}
                onChange={handleChange}
              />


              <label>
                Notes
              </label>

              <textarea
                name="notes"
                placeholder="Instructions or additional information"
                value={form.notes}
                onChange={handleChange}
                rows="4"
              />


              <button type="submit">
                Assign Medication
              </button>

            </form>
          )}

        </section>

        <section className="admin-section">

          <h2>What happens after assignment?</h2>

          <div className="admin-management">

            <div className="admin-management-card">
              <h3>Patient Medication</h3>
              <p>
                The medication appears in the patient's
                Medications section.
              </p>
            </div>

            <div className="admin-management-card">
              <h3>Patient Information</h3>
              <p>
                The patient can see dosage, timing and notes.
              </p>
            </div>

            <div className="admin-management-card">
              <h3>WhatsApp Notification</h3>
              <p>
                If the patient has a phone number,
                DIAIRIS sends the medication information
                through WhatsApp.
              </p>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default AdminMedications;