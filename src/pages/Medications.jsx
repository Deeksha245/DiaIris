import { useCallback, useEffect, useState } from "react";
import { createMedication, getMedications } from "../api";

function Medications() {
const [medications, setMedications] = useState([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [name, setName] = useState("");
const [dosage, setDosage] = useState("");
const [timeOfDay, setTimeOfDay] = useState("");
const [notes, setNotes] = useState("");

const loadMedications = useCallback(async () => {
try {
setLoading(true);
setError("");

  const data = await getMedications();

  if (Array.isArray(data)) {
    setMedications(data);
  } else if (Array.isArray(data?.medications)) {
    setMedications(data.medications);
  } else {
    setMedications([]);
  }
} catch (err) {
  setError(err.message || "Failed to load medications.");
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
loadMedications();
}, [loadMedications]);

const formatTime = (time) => {
if (!time) return "Not specified";


const [hours, minutes] = time.split(":").map(Number);

if (
  !Number.isFinite(hours) ||
  !Number.isFinite(minutes) ||
  hours < 0 ||
  hours > 23 ||
  minutes < 0 ||
  minutes > 59
) {
  return time;
}

const date = new Date();
date.setHours(hours, minutes, 0, 0);

return date.toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});


};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setSuccess("");

if (!name.trim() || !dosage.trim() || !timeOfDay) {
  setError("Please enter the medication name, dosage, and scheduled time.");
  return;
}

try {
  setSaving(true);

  await createMedication(
    name.trim(),
    dosage.trim(),
    timeOfDay,
    notes.trim()
  );

  setName("");
  setDosage("");
  setTimeOfDay("");
  setNotes("");

  setSuccess("Medication reminder added successfully.");
  await loadMedications();
} catch (err) {
  setError(err.message || "Failed to add medication.");
} finally {
  setSaving(false);
}


};

return ( <div className="medications-page"> <div className="medications-header"> <div> <p className="medications-label">DIAIRIS</p> <h1>Medication Reminders</h1> <p className="medications-description">
Organize your prescribed medications and scheduled doses in one place. </p> </div> </div>

```
  {error && (
    <div className="medication-message medication-error" role="alert">
      <strong>Error</strong>
      <span>{error}</span>
    </div>
  )}

  {success && (
    <div className="medication-message medication-success" role="status">
      <strong>Success</strong>
      <span>{success}</span>
    </div>
  )}

  <div className="medication-stats">
    <div className="medication-stat-card">
      <div className="medication-stat-icon">MED</div>
      <div>
        <span>Total Medications</span>
        <strong>{medications.length}</strong>
      </div>
    </div>

    <div className="medication-stat-card">
      <div className="medication-stat-icon">TIME</div>
      <div>
        <span>Scheduled Entries</span>
        <strong>{medications.length}</strong>
      </div>
    </div>

    <div className="medication-stat-card">
      <div className="medication-stat-icon">INFO</div>
      <div>
        <span>Reminder Schedules</span>
        <strong>Organized</strong>
      </div>
    </div>
  </div>

  <div className="medications-layout">
    <section className="medication-card">
      <div className="medication-card-header">
        <div>
          <span className="medication-section-label">NEW REMINDER</span>
          <h2>Add Medication</h2>
          <p>Enter the medication schedule recommended by your healthcare professional.</p>
        </div>
        <div className="medication-header-icon">+</div>
      </div>

      <form className="medication-form" onSubmit={handleSubmit}>
        <div className="medication-field">
          <label htmlFor="medication-name">Medication Name</label>
          <input
            id="medication-name"
            type="text"
            placeholder="Example: Prescribed eye drops"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
            required
          />
        </div>

        <div className="medication-field">
          <label htmlFor="medication-dosage">Dosage</label>
          <input
            id="medication-dosage"
            type="text"
            placeholder="Example: 1 drop"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="medication-field">
          <label htmlFor="medication-time">Scheduled Time</label>
          <input
            id="medication-time"
            type="time"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            required
          />

          {timeOfDay && (
            <small className="time-preview">
              Scheduled for {formatTime(timeOfDay)}
            </small>
          )}
        </div>

        <div className="medication-field">
          <label htmlFor="medication-notes">Notes (Optional)</label>
          <textarea
            id="medication-notes"
            rows={4}
            placeholder="Additional instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
          />
        </div>

        <button
          type="submit"
          className="medication-submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Add Medication Reminder"}
        </button>
      </form>
    </section>

    <section className="medication-card">
      <div className="medication-card-header">
        <div>
          <span className="medication-section-label">YOUR SCHEDULE</span>
          <h2>My Medications</h2>
          <p>Your saved medication schedules.</p>
        </div>

        <div className="medication-count">{medications.length}</div>
      </div>

      {!loading && (
        <button
          type="button"
          className="medication-submit"
          onClick={loadMedications}
        >
          Refresh Medication List
        </button>
      )}

      {loading && (
        <div className="medication-loading">
          <div className="medication-spinner" />
          <p>Loading medications...</p>
        </div>
      )}

      {!loading && medications.length === 0 && !error && (
        <div className="medication-empty">
          <div className="medication-empty-icon">+</div>
          <h3>No medications added</h3>
          <p>Add your first medication schedule using the form.</p>
        </div>
      )}

      {!loading && medications.length > 0 && (
        <div className="medication-list">
          {medications.map((medication, index) => (
            <div
              className="medication-item"
              key={medication.id ?? medication.medication_id ?? index}
            >
              <div className="medication-icon">MED</div>

              <div className="medication-info">
                <div className="medication-title-row">
                  <h3>{medication.name || "Medication"}</h3>
                  <span className="medication-status">Scheduled</span>
                </div>

                <div className="medication-details">
                  <div className="medication-detail">
                    <span>Dosage</span>
                    <strong>{medication.dosage || "Not specified"}</strong>
                  </div>

                  <div className="medication-detail">
                    <span>Time</span>
                    <strong>{formatTime(medication.time_of_day)}</strong>
                  </div>
                </div>

                {medication.notes && (
                  <div className="medication-notes">
                    <span>Notes</span>
                    <p>{medication.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </div>

  <div className="medication-disclaimer">
    <strong>Medication Reminder</strong>
    <p>
      DIAIRIS helps you organize medication schedules. Follow the
      prescription and dosage provided by your qualified healthcare
      professional. This page does not itself send alarms or notifications.
    </p>
  </div>
</div>


);
}

export default Medications;
