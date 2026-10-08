
import { useEffect, useState } from "react";
import { getPatients } from "../../api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);
      setError("");

      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <p className="admin-label">DIAIRIS ADMIN</p>
            <h1>Patients</h1>
            <p>View registered patient information.</p>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading patients...</p>
        ) : patients.length === 0 ? (
          <div className="admin-table-wrapper">
            <p style={{ padding: "20px" }}>
              No patients found.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
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
                    <td>
                      {patient.phone || "Not provided"}
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

export default Patients;

