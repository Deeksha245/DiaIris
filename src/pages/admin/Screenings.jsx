
import { useEffect, useState } from "react";
import { getAdminScreenings } from "../../api";

function Screenings() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadScreenings();
  }, []);

  async function loadScreenings() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminScreenings();

      setScans(data);
    } catch (err) {
      setError(
        err.message || "Failed to load screening records"
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

            <h1>Screenings</h1>

            <p>
              View all patient retinal screening records
              and AI results.
            </p>
          </div>
        </div>


        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {loading ? (
          <p>Loading screening records...</p>
        ) : scans.length === 0 ? (

          <div className="admin-table-wrapper">
            <p style={{ padding: "20px" }}>
              No screening records found.
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
                  <th>Result</th>
                  <th>Confidence</th>
                  <th>Date</th>
                </tr>
              </thead>


              <tbody>

                {scans.map((scan) => (

                  <tr key={scan.id}>

                    <td>
                      {scan.id}
                    </td>

                    <td>
                      {scan.patient_name ||
                        `Patient #${scan.user_id}`}
                    </td>

                    <td>
                      {scan.email || "N/A"}
                    </td>

                    <td>
                      {scan.result || "N/A"}
                    </td>

                    <td>
                      {scan.confidence !== null &&
                      scan.confidence !== undefined
                        ? `${scan.confidence}%`
                        : "N/A"}
                    </td>

                    <td>
                      {scan.created_at
                        ? new Date(
                            scan.created_at
                          ).toLocaleString()
                        : "N/A"}
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

export default Screenings;

