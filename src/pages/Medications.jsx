import { useEffect, useState } from 'react'
import { createMedication, getMedications } from '../api'

function Medications() {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadMedications()
  }, [])

  const loadMedications = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getMedications()

      if (Array.isArray(data)) {
        setMedications(data)
      } else if (Array.isArray(data.medications)) {
        setMedications(data.medications)
      } else {
        setMedications([])
      }
    } catch (err) {
      setError(err.message || 'Failed to load medications')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!name.trim() || !dosage.trim() || !timeOfDay) {
      setError('Please fill in medication name, dosage and time.')
      return
    }

    try {
      setSaving(true)

      await createMedication(
        name.trim(),
        dosage.trim(),
        timeOfDay,
        notes.trim()
      )

      setName('')
      setDosage('')
      setTimeOfDay('')
      setNotes('')

      setSuccess('Medication reminder added successfully.')

      await loadMedications()
    } catch (err) {
      setError(err.message || 'Failed to add medication')
    } finally {
      setSaving(false)
    }
  }

  const formatTime = (time) => {
    if (!time) {
      return 'Not specified'
    }

    const parts = time.split(':')

    if (parts.length < 2) {
      return time
    }

    const hours = Number(parts[0])
    const minutes = Number(parts[1])

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return time
    }

    const date = new Date()

    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="medications-page">

      {/* HEADER */}
      <div className="medications-header">
        <div>
          <p className="medications-label">DIAIRIS</p>

          <h1>Medication Reminders</h1>

          <p className="medications-description">
            Keep track of your prescribed medications and
            scheduled doses in one place.
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="medication-message medication-error">
          <strong>Error</strong>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="medication-message medication-success">
          <strong>Success</strong>
          <span>{success}</span>
        </div>
      )}

      {/* STATS */}
      <div className="medication-stats">

        <div className="medication-stat-card">
          <div className="medication-stat-icon">
            MED
          </div>

          <div>
            <span>Total Medications</span>
            <strong>{medications.length}</strong>
          </div>
        </div>

        <div className="medication-stat-card">
          <div className="medication-stat-icon">
            TIME
          </div>

          <div>
            <span>Scheduled Doses</span>
            <strong>{medications.length}</strong>
          </div>
        </div>

        <div className="medication-stat-card">
          <div className="medication-stat-icon">
            SAFE
          </div>

          <div>
            <span>Reminder Status</span>
            <strong>Active</strong>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="medications-layout">

        {/* ADD MEDICATION */}
        <div className="medication-card">

          <div className="medication-card-header">

            <div>
              <span className="medication-section-label">
                NEW REMINDER
              </span>

              <h2>Add Medication</h2>

              <p>
                Add a medication schedule provided by
                your healthcare professional.
              </p>
            </div>

            <div className="medication-header-icon">
              +
            </div>

          </div>

          <form
            className="medication-form"
            onSubmit={handleSubmit}
          >

            <div className="medication-field">
              <label>Medication Name</label>

              <input
                type="text"
                placeholder="Example: Prescribed eye drops"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="medication-field">
              <label>Dosage</label>

              <input
                type="text"
                placeholder="Example: 1 drop"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
            </div>

            <div className="medication-field">
              <label>Scheduled Time</label>

              <input
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
              <label>Notes</label>

              <textarea
                rows="4"
                placeholder="Optional instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="medication-submit"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Add Medication Reminder'}
            </button>

          </form>
        </div>

        {/* MEDICATION LIST */}
        <div className="medication-card">

          <div className="medication-card-header">

            <div>
              <span className="medication-section-label">
                YOUR SCHEDULE
              </span>

              <h2>My Medications</h2>

              <p>
                Your saved medication schedules.
              </p>
            </div>

            <div className="medication-count">
              {medications.length}
            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="medication-loading">
              <div className="medication-spinner"></div>

              <p>Loading medications...</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && medications.length === 0 && (
            <div className="medication-empty">

              <div className="medication-empty-icon">
                +
              </div>

              <h3>No medications added</h3>

              <p>
                Add your first medication schedule
                using the form.
              </p>

            </div>
          )}

          {/* LIST */}
          {!loading && medications.length > 0 && (
            <div className="medication-list">

              {medications.map((medication, index) => {

                const id =
                  medication.id ||
                  medication.medication_id ||
                  index

                return (
                  <div
                    className="medication-item"
                    key={id}
                  >

                    <div className="medication-icon">
                      MED
                    </div>

                    <div className="medication-info">

                      <div className="medication-title-row">

                        <h3>
                          {medication.name || 'Medication'}
                        </h3>

                        <span className="medication-status">
                          Scheduled
                        </span>

                      </div>

                      <div className="medication-details">

                        <div className="medication-detail">
                          <span>Dosage</span>
                          <strong>
                            {medication.dosage ||
                              'Not specified'}
                          </strong>
                        </div>

                        <div className="medication-detail">
                          <span>Time</span>
                          <strong>
                            {formatTime(
                              medication.time_of_day
                            )}
                          </strong>
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
                )
              })}

            </div>
          )}

        </div>

      </div>

      {/* DISCLAIMER */}
      <div className="medication-disclaimer">

        <strong>Medication Reminder</strong>

        <p>
          DIAIRIS only helps you organize medication
          reminders. Always follow the medication,
          dosage, and schedule provided by your qualified
          healthcare professional.
        </p>

      </div>

    </div>
  )
}

export default Medications