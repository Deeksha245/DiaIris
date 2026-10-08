import { useEffect, useState } from 'react'
import { createAppointment, getAppointments } from '../api'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [doctorName, setDoctorName] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getAppointments()

      if (Array.isArray(data)) {
        setAppointments(data)
      } else if (Array.isArray(data.appointments)) {
        setAppointments(data.appointments)
      } else {
        setAppointments([])
      }
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!doctorName || !appointmentDate) {
      setError('Please select a doctor and appointment date.')
      return
    }

    try {
      setBooking(true)

      await createAppointment(
        doctorName,
        appointmentDate,
        notes.trim()
      )

      setDoctorName('')
      setAppointmentDate('')
      setNotes('')

      setSuccess('Appointment booked successfully.')

      await loadAppointments()
    } catch (err) {
      setError(err.message || 'Failed to book appointment')
    } finally {
      setBooking(false)
    }
  }

  const formatDate = (value) => {
    if (!value) return 'Date not available'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatus = (appointment) => {
    return appointment.status || 'Pending'
  }

  return (
    <div className="appointments-page">

      {/* HEADER */}
      <div className="appointments-header">
        <div>
          <p className="appointments-label">DIAIRIS</p>

          <h1>Doctor Appointments</h1>

          <p className="appointments-description">
            Organize your eye-care consultations and follow-up visits.
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="appointment-message appointment-error">
          {error}
        </div>
      )}

      {success && (
        <div className="appointment-message appointment-success">
          {success}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="appointments-layout">

        {/* BOOK APPOINTMENT */}
        <div className="appointment-card">

          <div className="appointment-card-header">
            <div>
              <span className="appointment-section-label">
                NEW APPOINTMENT
              </span>

              <h2>Book a Consultation</h2>

              <p>
                Schedule a consultation with an eye-care specialist.
              </p>
            </div>

            <div className="appointment-header-icon">
              +
            </div>
          </div>

          <form
            className="appointment-form"
            onSubmit={handleBooking}
          >

            <div className="appointment-field">
              <label>Select Doctor</label>

              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                required
              >
                <option value="">
                  Choose a doctor
                </option>

                <option value="Dr. Ananya Rao">
                  Dr. Ananya Rao — Ophthalmologist
                </option>

                <option value="Dr. Rahul Shetty">
                  Dr. Rahul Shetty — Retina Specialist
                </option>

                <option value="Dr. Priya Nair">
                  Dr. Priya Nair — Ophthalmologist
                </option>
              </select>
            </div>

            <div className="appointment-field">
              <label>Appointment Date & Time</label>

              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>

            <div className="appointment-field">
              <label>Notes</label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes for your consultation..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="book-appointment-btn"
              disabled={booking}
            >
              {booking
                ? 'Booking...'
                : 'Book Appointment'}
            </button>

          </form>
        </div>

        {/* APPOINTMENT LIST */}
        <div className="appointment-card">

          <div className="appointment-card-header">
            <div>
              <span className="appointment-section-label">
                YOUR SCHEDULE
              </span>

              <h2>My Appointments</h2>

              <p>
                Your scheduled consultations.
              </p>
            </div>

            <div className="appointment-count">
              {appointments.length}
            </div>
          </div>

          {loading && (
            <div className="appointment-loading">
              <div className="appointment-spinner"></div>
              <p>Loading appointments...</p>
            </div>
          )}

          {!loading && appointments.length === 0 && (
            <div className="appointment-empty">

              <div className="appointment-empty-icon">
                +
              </div>

              <h3>No appointments yet</h3>

              <p>
                Book your first consultation using the form.
              </p>

            </div>
          )}

          {!loading && appointments.length > 0 && (
            <div className="appointment-list">

              {appointments.map((appointment, index) => {

                const id =
                  appointment.id ||
                  appointment.appointment_id ||
                  index

                const status = getStatus(appointment)

                return (
                  <div
                    className="appointment-item"
                    key={id}
                  >

                    <div className="appointment-doctor">

                      <div className="doctor-avatar">
                        {String(
                          appointment.doctor_name || 'D'
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3>
                          {appointment.doctor_name || 'Doctor'}
                        </h3>

                        <p>
                          Eye Care Consultation
                        </p>
                      </div>

                    </div>

                    <div className="appointment-details">

                      <div>
                        <span>Date & Time</span>

                        <strong>
                          {formatDate(
                            appointment.appointment_date
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Status</span>

                        <strong
                          className={`appointment-status ${String(
                            status
                          ).toLowerCase()}`}
                        >
                          {status}
                        </strong>
                      </div>

                    </div>

                    {appointment.notes && (
                      <div className="appointment-notes">

                        <span>Notes</span>

                        <p>
                          {appointment.notes}
                        </p>

                      </div>
                    )}

                  </div>
                )
              })}

            </div>
          )}

        </div>

      </div>

      {/* DISCLAIMER */}
      <div className="appointment-disclaimer">

        <strong>Important</strong>

        <p>
          DIAIRIS appointment scheduling helps organize
          consultations. It does not replace emergency
          medical care. For urgent eye problems, contact
          a qualified healthcare professional directly.
        </p>

      </div>

    </div>
  )
}

export default Appointments