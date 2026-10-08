import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getScans } from '../api'

function History() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadScans()
  }, [])

  const loadScans = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getScans()

      if (Array.isArray(data)) {
        setScans(data)
      } else if (Array.isArray(data.scans)) {
        setScans(data.scans)
      } else {
        setScans([])
      }
    } catch (err) {
      setError(err.message || 'Failed to load screening history')
    } finally {
      setLoading(false)
    }
  }

  const getResult = (scan) =>
    String(
      scan.result ||
      scan.prediction ||
      scan.classification ||
      ''
    )

  const isDRDetected = (scan) =>
    getResult(scan).toLowerCase().includes('dr_present')

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

  const getRiskLevel = (scan) => {
    const dr = isDRDetected(scan)
    const confidence = getConfidence(scan)

    if (dr && confidence >= 80) return 'High Risk'
    if (dr) return 'Moderate Risk'
    return 'Low Risk'
  }

  const getDate = (scan) => {
  if (!scan.created_at) {
    return "Date unavailable"
  }

  let value = scan.created_at

  // Backend UTC timestamp may not contain Z
  if (!value.endsWith("Z")) {
    value += "Z"
  }

  const date = new Date(value)

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })
}
  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const result = getResult(scan).toLowerCase()
      const date = getDate(scan).toLowerCase()
      const searchText = search.toLowerCase().trim()

      const matchesSearch =
        !searchText ||
        result.includes(searchText) ||
        date.includes(searchText)

      let matchesFilter = true

      if (filter === 'dr') {
        matchesFilter = isDRDetected(scan)
      }

      if (filter === 'normal') {
        matchesFilter = !isDRDetected(scan)
      }

      return matchesSearch && matchesFilter
    })
  }, [scans, search, filter])

  const totalScans = scans.length
  const drScans = scans.filter(isDRDetected).length
  const normalScans = totalScans - drScans

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-loading">
          <div className="history-spinner"></div>
          <p>Loading screening history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-page">

      {/* PAGE HEADER */}
      <div className="history-header">
        <div>
          <span className="history-label">DIAIRIS</span>
          <h1>Screening History</h1>
          <p>
            View and manage your previous AI-based retinal screenings.
          </p>
        </div>

        <Link to="/detection" className="new-screening-btn">
          + New Screening
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="history-error">
          <div>
            <strong>Unable to load history</strong>
            <p>{error}</p>
          </div>
          <button onClick={loadScans}>Try Again</button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="history-stats">

        <div className="history-stat-card">
          <div className="stat-icon">◉</div>
          <div>
            <span>Total Screenings</span>
            <strong>{totalScans}</strong>
          </div>
        </div>

        <div className="history-stat-card danger">
          <div className="stat-icon">!</div>
          <div>
            <span>DR Detected</span>
            <strong>{drScans}</strong>
          </div>
        </div>

        <div className="history-stat-card success">
          <div className="stat-icon">✓</div>
          <div>
            <span>No DR Detected</span>
            <strong>{normalScans}</strong>
          </div>
        </div>

      </div>

      {/* FILTER SECTION */}
      <div className="history-toolbar">

        <div className="history-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search by result or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="history-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={filter === 'normal' ? 'active' : ''}
            onClick={() => setFilter('normal')}
          >
            No DR
          </button>

          <button
            className={filter === 'dr' ? 'active' : ''}
            onClick={() => setFilter('dr')}
          >
            DR Detected
          </button>
        </div>

      </div>

      {/* RESULTS */}
      <div className="history-section-title">
        <div>
          <h2>Previous Screenings</h2>
          <p>{filteredScans.length} screening(s) found</p>
        </div>
      </div>

      {filteredScans.length === 0 ? (

        <div className="history-empty">
          <div className="empty-icon">◌</div>

          <h2>
            {scans.length === 0
              ? 'No Screenings Yet'
              : 'No Matching Screenings'}
          </h2>

          <p>
            {scans.length === 0
              ? 'Upload a retinal image to perform your first AI screening.'
              : 'Try changing your search or filter.'}
          </p>

          {scans.length === 0 && (
            <Link
              to="/detection"
              className="new-screening-btn"
            >
              Start First Screening
            </Link>
          )}
        </div>

      ) : (

        <div className="history-list">

          {filteredScans.map((scan, index) => {

            const drDetected = isDRDetected(scan)
            const confidence = getConfidence(scan)
            const risk = getRiskLevel(scan)

            const scanId =
              scan.id ||
              scan.scan_id ||
              scan._id ||
              index

            return (
              <div className="history-card" key={scanId}>

                {/* CARD TOP */}
                <div className="history-card-top">

                  <div className="history-status-area">
                    <span
                      className={`status-dot ${
                        drDetected ? 'danger-dot' : 'success-dot'
                      }`}
                    ></span>

                    <span
                      className={
                        drDetected
                          ? 'status-danger'
                          : 'status-success'
                      }
                    >
                      {drDetected
                        ? 'DR Detected'
                        : 'No DR Detected'}
                    </span>
                  </div>

                  <span className="history-date">
                    {getDate(scan)}
                  </span>

                </div>

                {/* CARD BODY */}
                <div className="history-card-body">

                  <div className="history-main-info">
                    <h3>
                      {drDetected
                        ? 'Signs of Diabetic Retinopathy Detected'
                        : 'No Signs of Diabetic Retinopathy'}
                    </h3>

                    <p>
                      AI-assisted retinal image screening result
                    </p>
                  </div>

                  <div className="history-metrics">

                    <div className="history-metric">
                      <span>Confidence</span>
                      <strong>{confidence.toFixed(1)}%</strong>
                    </div>

                    <div className="history-metric">
                      <span>Risk Level</span>
                      <strong
                        className={
                          drDetected
                            ? 'risk-danger'
                            : 'risk-success'
                        }
                      >
                        {risk}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* CONFIDENCE */}
                <div className="history-confidence">

                  <div className="confidence-label">
                    <span>AI Confidence</span>
                    <strong>{confidence.toFixed(1)}%</strong>
                  </div>

                  <div className="history-progress">
                    <div
                      className={
                        `history-progress-fill ${
                          drDetected
                            ? 'progress-danger'
                            : 'progress-success'
                        }`
                      }
                      style={{ width: `${confidence}%` }}
                    ></div>
                  </div>

                </div>

                {/* FOOTER */}
                <div className="history-card-footer">

                  <span>
                    Screening ID:{' '}
                    {scan.id ||
                      scan.scan_id ||
                      scan._id ||
                      'N/A'}
                  </span>

                  {scanId !== index && (
                    <Link
                      to={`/report/${scanId}`}
                      className="view-report-btn"
                    >
                      View Report →
                    </Link>
                  )}

                </div>

              </div>
            )
          })}

        </div>
      )}

      {/* DISCLAIMER */}
      <div className="history-disclaimer">
        <strong>Medical Disclaimer</strong>
        <p>
          DIAIRIS provides AI-assisted screening and does not
          replace professional medical diagnosis. Please consult
          a qualified ophthalmologist for clinical evaluation
          and confirmation.
        </p>
      </div>

    </div>
  )
}

export default History