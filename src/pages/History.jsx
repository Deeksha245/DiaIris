
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getScans } from "../api";

function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadScans() {
      try {
        const data = await getScans();
        setScans(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Unable to load screening history.");
      } finally {
        setLoading(false);
      }
    }

    loadScans();
  }, []);

  const filteredScans = scans.filter((scan) => {
    const text = [
      scan.prediction,
      scan.result,
      scan.created_at,
      scan.date,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="history-page">
      <div className="history-header">
        <div>
          <h1>Screening History</h1>
          <p>View your previous retinal screening results.</p>
        </div>

        <Link to="/detection" className="new-screening-btn">
          New Screening
        </Link>
      </div>

      <div className="history-stats">
        <div className="history-stat-card">
          <h3>Total Screenings</h3>
          <h2>{scans.length}</h2>
        </div>

        <div className="history-stat-card">
          <h3>DR Positive Results</h3>
          <h2>
            {
              scans.filter((scan) =>
                String(scan.prediction || scan.result || "")
                  .toLowerCase()
                  .includes("dr_present")
              ).length
            }
          </h2>
        </div>

        <div className="history-stat-card">
          <h3>Other Results</h3>
          <h2>
            {
              scans.filter((scan) =>
                String(scan.prediction || scan.result || "")
                  .toLowerCase()
                  .includes("no_dr")
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="history-toolbar">
        <input
          className="history-search"
          type="text"
          placeholder="Search screening results..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2 className="history-section-title">Previous Screenings</h2>

      {loading && (
        <div className="history-loading">
          Loading screening history...
        </div>
      )}

      {error && <p className="history-error">{error}</p>}

      {!loading && !error && filteredScans.length === 0 && (
        <div className="history-empty">
          <h3>No screenings found</h3>
          <p>Your completed screenings will appear here.</p>

          <Link to="/detection" className="new-screening-btn">
            Start Screening
          </Link>
        </div>
      )}

      {!loading && !error && filteredScans.length > 0 && (
        <div className="history-list">
          {filteredScans.map((scan) => {
            const result =
              scan.prediction || scan.result || "Result unavailable";

            const isPositive = String(result)
              .toLowerCase()
              .includes("dr_present");

            const confidence = Number(
              scan.confidence ?? scan.confidence_score ?? 0
            );

            const date = scan.created_at || scan.date;

            return (
              <article
                className="history-card"
                key={scan.id}
              >
                <div className="history-card-top">
                  <div>
                    <h3>Retinal Screening</h3>
                    <p className="history-date">
                      {date
                        ? new Date(date).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span
                    className={
                      isPositive
                        ? "history-status status-danger"
                        : "history-status status-success"
                    }
                  >
                    {result}
                  </span>
                </div>

                <div className="history-card-body">
                  <div className="history-metric">
                    <span>Prediction</span>
                    <strong>{result}</strong>
                  </div>

                  <div className="history-metric">
                    <span>Confidence</span>
                    <strong>
                      {confidence > 0
                        ? `${confidence}%`
                        : "Not available"}
                    </strong>
                  </div>
                </div>

                <div className="history-card-footer">
                  <Link
                    to={`/report/${scan.id}`}
                    className="view-report-btn"
                  >
                    View Report
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="history-disclaimer">
        AI screening results are for informational purposes only and
        should not replace examination by a qualified eye-care professional.
      </p>
    </main>
  );
}

export default History;
