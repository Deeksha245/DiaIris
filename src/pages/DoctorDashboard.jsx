
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getScans,
  getAppointments,
  getPatients,
  assignMedication
} from '../api'

function DoctorDashboard() {
  const [scans, setScans] = useState([])
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])

  const [loading, setLoading] = useState(true)
  const [medicationSaving, setMedicationSaving] = useState(false)

  const [error, setError] = useState('')
  const [medicationMessage, setMedicationMessage] = useState('')

  // Medication form
  const [patientId, setPatientId] = useState('')
  const [medicationName, setMedicationName] = useState('')
  const [dosage, setDosage] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadDoctorData()
  }, [])

  const loadDoctorData = async () => {
    try {
      setLoading(true)
      setError('')

      const [scanData, appointmentData, patientData] =
        await Promise.all([
          getScans(),
          getAppointments(),
          getPatients()
        ])

      if (Array.isArray(scanData)) {
        setScans(scanData)
      } else if (Array.isArray(scanData.scans)) {
        setScans(scanData.scans)
      }

      if (Array.isArray(appointmentData)) {
        setAppointments(appointmentData)
      } else if (Array.isArray(appointmentData.appointments)) {
        setAppointments(appointmentData.appointments)
      }

      if (Array.isArray(patientData)) {
        setPatients(patientData)
      } else if (Array.isArray(patientData.patients)) {
        setPatients(patientData.patients)
      }
    } catch (err) {
      setError(
        err.message || 'Failed to load doctor dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleMedicationSubmit = async (event) => {
    event.preventDefault()

    setMedicationMessage('')
    setError('')

    if (!patientId) {
      setError('Please select a patient.')
      return
    }

    if (!medicationName.trim()) {
      setError('Please enter the medication name.')
      return
    }

    if (!dosage.trim()) {
      setError('Please enter the dosage.')
      return
    }

    if (!timeOfDay) {
      setError('Please select the medication time.')
      return
    }

    try {
      setMedicationSaving(true)

      const result = await assignMedication(
        patientId,
        medicationName.trim(),
        dosage.trim(),
        timeOfDay,
        notes.trim()
      )

      setMedicationMessage(
        result.message ||
        'Medication assigned successfully. Patient notification sent.'
      )

      setPatientId('')
      setMedicationName('')
      setDosage('')
      setTimeOfDay('')
      setNotes('')
    } catch (err) {
      setError(
        err.message || 'Failed to assign medication'
      )
    } finally {
      setMedicationSaving(false)
    }
  }

  const getResult = (scan) => {
    return String(
      scan.result ||
      scan.prediction ||
      scan.classification ||
      ''
    )
  }

  const isDRDetected = (scan) => {
    return getResult(scan)
      .toLowerCase()
      .includes('dr_present')
  }

  const getConfidence = (scan) => {
    let value = Number(
      scan.confidence ??
      scan.probability ??
      0
    )

    if (value > 0 && value <= 1) {
      value *= 100
    }

    return Math.min(100, Math.max(0, value))
  }

  const getDate = (value) => {
    if (!value) return 'Date unavailable'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return String(value)
    }

    return date.toLocaleString()
  }

  const drCount = scans.filter(
    (scan) => isDRDetected(scan)
  ).length

  const normalCount = scans.length - drCount

  if (loading) {
    return (
      <div className="doctor-page">
        <div className="doctor-loading">
          Loading doctor dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="doctor-page">

      {/* HEADER */}

      <div className="doctor-header">
        <div>
          <p className="doctor-label">
            DIAIRIS
          </p>

          <h1>Doctor Dashboard</h1>

          <p>
            Review AI-assisted retinal screening results
            and manage patient consultations.
          </p>
        </div>

        <button
          className="doctor-refresh-btn"
          onClick={loadDoctorData}
        >
          Refresh Data
        </button>
      </div>


      {/* ERROR */}

      {error && (
        <div className="doctor-error">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {medicationMessage && (
        <div className="doctor-success">
          {medicationMessage}
        </div>
      )}


      {/* STAT CARDS */}

      <div className="doctor-stats">

        <div className="doctor-stat-card">
          <span>Total Screenings</span>
          <strong>{scans.length}</strong>
          <small>Available screening records</small>
        </div>

        <div className="doctor-stat-card">
          <span>DR Detected</span>
          <strong>{drCount}</strong>
          <small>Screenings requiring review</small>
        </div>

        <div className="doctor-stat-card">
          <span>No DR Detected</span>
          <strong>{normalCount}</strong>
          <small>Screenings without detected DR</small>
        </div>

        <div className="doctor-stat-card">
          <span>Appointments</span>
          <strong>{appointments.length}</strong>
          <small>Scheduled consultations</small>
        </div>

      </div>


      {/* MEDICATION ASSIGNMENT */}

      <div className="doctor-card doctor-medication-card">

        <div className="doctor-card-header">
          <div>
            <h2>Assign Medication</h2>

            <p>
              Add medication instructions prescribed
              for a registered patient.
            </p>
          </div>
        </div>

        <form
          className="doctor-medication-form"
          onSubmit={handleMedicationSubmit}
        >

          <div className="doctor-form-group">
            <label>
              Select Patient
            </label>

            <select
              value={patientId}
              onChange={(e) =>
                setPatientId(e.target.value)
              }
            >
              <option value="">
                Select a patient
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
          </div>


          <div className="doctor-form-row">

            <div className="doctor-form-group">
              <label>
                Medication Name
              </label>

              <input
                type="text"
                placeholder="Enter prescribed medication"
                value={medicationName}
                onChange={(e) =>
                  setMedicationName(e.target.value)
                }
              />
            </div>


            <div className="doctor-form-group">
              <label>
                Dosage
              </label>

              <input
                type="text"
                placeholder="Example: 1 tablet"
                value={dosage}
                onChange={(e) =>
                  setDosage(e.target.value)
                }
              />
            </div>

          </div>


          <div className="doctor-form-row">

            <div className="doctor-form-group">
              <label>
                Scheduled Time
              </label>

              <input
                type="time"
                value={timeOfDay}
                onChange={(e) =>
                  setTimeOfDay(e.target.value)
                }
              />
            </div>


            <div className="doctor-form-group">
              <label>
                Notes / Instructions
              </label>

              <input
                type="text"
                placeholder="Example: Take after food"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
              />
            </div>

          </div>


          <button
            type="submit"
            className="doctor-medication-btn"
            disabled={medicationSaving}
          >
            {medicationSaving
              ? 'Assigning...'
              : 'Assign Medication'}
          </button>

        </form>

        <div className="doctor-medication-note">
          Medication information should be entered according
          to the prescription or instructions provided by a
          qualified healthcare professional. DIAIRIS does not
          prescribe medication.
        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="doctor-grid">

        {/* SCREENINGS */}

        <div className="doctor-card doctor-screenings">

          <div className="doctor-card-header">

            <div>
              <h2>Recent Screenings</h2>

              <p>
                AI-assisted retinal screening results.
              </p>
            </div>

            <Link to="/history">
              View History
            </Link>

          </div>


          {scans.length === 0 ? (

            <div className="doctor-empty">
              No screening records available.
            </div>

          ) : (

            <div className="doctor-table-wrapper">

              <table className="doctor-table">

                <thead>
                  <tr>
                    <th>Result</th>
                    <th>Confidence</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {scans.slice(0, 8).map(
                    (scan, index) => {

                      const detected =
                        isDRDetected(scan)

                      const confidence =
                        getConfidence(scan)

                      const scanId =
                        scan.id ||
                        scan.scan_id ||
                        scan._id

                      return (
                        <tr
                          key={scanId || index}
                        >

                          <td>

                            <span
                              className={
                                detected
                                  ? 'doctor-result danger'
                                  : 'doctor-result safe'
                              }
                            >
                              {detected
                                ? 'DR Detected'
                                : 'No DR Detected'}
                            </span>

                          </td>

                          <td>
                            {confidence.toFixed(1)}%
                          </td>

                          <td>
                            {getDate(
                              scan.created_at ||
                              scan.date ||
                              scan.timestamp
                            )}
                          </td>

                          <td>

                            {scanId ? (

                              <Link
                                to={`/report/${scanId}`}
                                className="doctor-view-btn"
                              >
                                View Report
                              </Link>

                            ) : (
                              '—'
                            )}

                          </td>

                        </tr>
                      )
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* APPOINTMENTS */}

        <div className="doctor-card">

          <div className="doctor-card-header">

            <div>
              <h2>Appointments</h2>

              <p>
                Scheduled patient consultations.
              </p>
            </div>

            <Link to="/appointments">
              Manage
            </Link>

          </div>


          {appointments.length === 0 ? (

            <div className="doctor-empty">
              No appointments scheduled.
            </div>

          ) : (

            <div className="doctor-appointments">

              {appointments.slice(0, 6).map(
                (appointment, index) => {

                  const id =
                    appointment.id ||
                    appointment.appointment_id ||
                    index

                  return (

                    <div
                      className="doctor-appointment"
                      key={id}
                    >

                      <div className="doctor-patient-icon">
                        P
                      </div>

                      <div className="doctor-appointment-info">

                        <strong>
                          {appointment.doctor_name ||
                            'Patient Consultation'}
                        </strong>

                        <span>
                          {getDate(
                            appointment.appointment_date
                          )}
                        </span>

                      </div>

                      <span className="doctor-appointment-status">
                        {appointment.status ||
                          'Pending'}
                      </span>

                    </div>

                  )
                }
              )}

            </div>

          )}

        </div>

      </div>


      {/* MEDICAL NOTICE */}

      <div className="doctor-notice">

        <strong>Clinical Review Notice</strong>

        <p>
          DIAIRIS screening results are AI-assisted and are
          intended to support clinical review. They should not
          be treated as a standalone medical diagnosis.
          Qualified healthcare professionals should make
          clinical decisions using appropriate examination
          and patient information.
        </p>

      </div>

    </div>
  )
}

export default DoctorDashboard

