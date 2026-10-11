
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminDataPage.css";

export default function AdminDataPage({
  title,
  description,
  endpoint,
  columns,
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://127.0.0.1:8001${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || `Request failed (${response.status})`
          );
        }

        const rows = Array.isArray(data)
          ? data
          : data.items || data.records || data.patients ||
            data.scans || data.appointments || data.medications || [];

        if (active) setRecords(rows);
      } catch (err) {
        if (active) setError(err.message || "Unable to load data.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [endpoint]);

  function formatValue(value) {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  return (
    <main className="admin-data-page">
      <div className="admin-data-top">
        <div>
          <Link to="/dashboard" className="admin-back-link">
            ← Back to Dashboard
          </Link>

          <p className="admin-eyebrow">DIAIRIS MANAGEMENT</p>
          <h1>{title}</h1>
          <p className="admin-data-description">{description}</p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>

      <section className="admin-data-summary">
        <div>
          <span>Total Records</span>
          <strong>{loading ? "…" : records.length}</strong>
        </div>
        <div>
          <span>Section</span>
          <strong>{title}</strong>
        </div>
      </section>

      <section className="admin-table-panel">
        <h2>{title} Records</h2>

        {loading && (
          <p className="admin-message">Loading {title.toLowerCase()}...</p>
        )}

        {!loading && error && (
          <div className="admin-error">
            <strong>Unable to load data</strong>
            <p>{error}</p>
            <p>
              Check that the backend is running and that this endpoint
              exists in your FastAPI application.
            </p>
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <p className="admin-message">No records found.</p>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="admin-table-scroll">
            <table className="admin-data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {records.map((record, index) => (
                  <tr key={record.id ?? record.scan_id ?? index}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {formatValue(record[column.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
