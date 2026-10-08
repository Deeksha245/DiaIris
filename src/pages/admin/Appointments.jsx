
import { useEffect, useState } from "react";
import { getAdminAppointments } from "../../api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminAppointments();

      setAppointments(data);
    } catch (err) {
      setError(
        err.message || "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <p className="admin-label">
              DIAIRIS ADMIN
            </p>

            <h1>Appointments</h1>

            <p>
              View patient appointments and doctor details.
            </p>
          </div>
        </div>


        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (

          <div className="admin-table-wrapper">
            <p style={{ padding: "20px" }}>
              No appointments found.
            </p>
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Notes</th>
                </tr>
              </thead>


              <tbody>

                {appointments.map((appointment) => (

                  <tr key={appointment.id}>

                    <td>
                      {appointment.id}
                    </td>

                    <td>
                      {appointment.patient_name ||
                        `Patient #${appointment.user_id}`}
                    </td>

                    <td>
                      {appointment.email || "N/A"}
                    </td>

                    <td>
                      {appointment.phone || "Not provided"}
                    </td>

                    <td>
                      {appointment.doctor_name || "N/A"}
                    </td>

                    <td>
                      {appointment.appointment_date
                        ? new Date(
                            appointment.appointment_date
                          ).toLocaleString()
                        : "N/A"}
                    </td>

                    <td>
                      {appointment.notes || "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </div>
  );
}

export default Appointments;

