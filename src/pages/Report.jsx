import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getScans } from '../api'

function formatDate(value) {
  if (!value) return '—'

  return new Date(value).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function Report() {
  const { id } = useParams()

  const [scan, setScan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReport()
  }, [id])

  async function loadReport() {
    try {
      setLoading(true)
      setError('')

      const data = await getScans()

      const scans = Array.isArray(data) ? data : []

      const found = scans.find(
        (item) => String(item.id) === String(id)
      )

      if (!found) {
        setError('Screening report not found.')
        return
      }

      setScan(found)
    } catch (err) {
      setError(
        err.message || 'Unable to load the screening report.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="report-page">
        <div className="report-container">
          <div className="report-loading">
            <div className="report-loader"></div>
            <h2>Loading Screening Report</h2>
            <p>Please wait while your report is being prepared.</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !scan) {
    return (
      <main className="report-page">
        <div className="report-container">
          <div className="report-error">
            <div className="report-error-icon">!</div>

            <h2>Report Unavailable</h2>

            <p>
              {error || 'The requested screening report could not be found.'}
            </p>

            <Link to="/history" className="report-primary-btn">
              ← Back to History
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const isPositive = scan.result === 'DR_present'

  const rawConfidence =
    scan.confidence !== undefined
      ? Number(scan.confidence)
      : 0

  const confidence =
    rawConfidence <= 1
      ? rawConfidence * 100
      : rawConfidence

  const safeConfidence = Math.min(
    Math.max(confidence, 0),
    100
  )

  let riskLevel = 'Low Risk'

  if (isPositive) {
    if (safeConfidence >= 85) {
      riskLevel = 'High Risk'
    } else if (safeConfidence >= 60) {
      riskLevel = 'Moderate Risk'
    } else {
      riskLevel = 'Needs Review'
    }
  }

  return (
    <main className="report-page">

      <div className="report-container">

        {/* HEADER */}

        <div className="report-header">

          <div>
            <span className="report-eyebrow">
              DIAIRIS • SCREENING REPORT
            </span>

            <h1>Eye Screening Report</h1>

            <p>
              AI-assisted analysis of your retinal image.
            </p>
          </div>

          <Link
            to="/history"
            className="report-back-btn"
          >
            ← Screening History
          </Link>

        </div>

        {/* REPORT META */}

        <section className="report-meta-card">

          <div>
            <span>REPORT ID</span>
            <strong>DR-{scan.id}</strong>
          </div>

          <div>
            <span>SCREENING DATE</span>
            <strong>
              {formatDate(
                scan.created_at ||
                scan.timestamp ||
                scan.date
              )}
            </strong>
          </div>

          <div>
            <span>SCREENING TYPE</span>
            <strong>AI Retinal Screening</strong>
          </div>

        </section>

        {/* RESULT */}

        <section
          className={`report-result-card ${
            isPositive ? 'report-positive' : 'report-negative'
          }`}
        >

          <div className="report-result-icon">
            {isPositive ? '!' : '✓'}
          </div>

          <div className="report-result-content">

            <span className="report-result-label">
              SCREENING RESULT
            </span>

            <h2>
              {isPositive
                ? 'Diabetic Retinopathy Detected'
                : 'No Diabetic Retinopathy Detected'}
            </h2>

            <p>
              {isPositive
                ? 'The AI screening system identified retinal patterns that may be associated with diabetic retinopathy.'
                : 'The AI screening system did not identify retinal patterns associated with diabetic retinopathy in this screening.'}
            </p>

          </div>

          <div className="report-risk-badge">
            {riskLevel}
          </div>

        </section>

        {/* SUMMARY */}

        <section className="report-section">

          <div className="report-section-heading">
            <span className="report-section-number">01</span>

            <div>
              <h2>Screening Summary</h2>
              <p>Key information from this screening.</p>
            </div>
          </div>

          <div className="report-summary-grid">

            <div className="report-info-card">
              <span>RESULT</span>

              <strong
                className={
                  isPositive
                    ? 'report-value-warning'
                    : 'report-value-success'
                }
              >
                {isPositive
                  ? 'DR Detected'
                  : 'No DR Detected'}
              </strong>
            </div>

            <div className="report-info-card">
              <span>AI CONFIDENCE</span>

              <strong>
                {safeConfidence.toFixed(1)}%
              </strong>
            </div>

            <div className="report-info-card">
              <span>RISK CATEGORY</span>

              <strong>{riskLevel}</strong>
            </div>

            <div className="report-info-card">
              <span>REPORT NUMBER</span>

              <strong>DR-{scan.id}</strong>
            </div>

          </div>

        </section>

        {/* CONFIDENCE */}

        <section className="report-section">

          <div className="report-section-heading">
            <span className="report-section-number">02</span>

            <div>
              <h2>AI Confidence</h2>
              <p>
                Confidence associated with the screening result.
              </p>
            </div>
          </div>

          <div className="report-confidence-card">

            <div className="report-confidence-top">
              <span>Model Confidence</span>

              <strong>
                {safeConfidence.toFixed(1)}%
              </strong>
            </div>

            <div className="report-progress">
              <div
                className={`report-progress-fill ${
                  isPositive ? 'positive' : 'negative'
                }`}
                style={{
                  width: `${safeConfidence}%`,
                }}
              />
            </div>

            <p>
              Confidence represents how strongly the AI model
              supports the screening result. It is not a medical
              certainty.
            </p>

          </div>

        </section>

        {/* INTERPRETATION */}

        <section className="report-section">

          <div className="report-section-heading">
            <span className="report-section-number">03</span>

            <div>
              <h2>Interpretation</h2>
              <p>What this screening result means.</p>
            </div>
          </div>

          <div className="report-text-card">

            {isPositive ? (
              <>
                <h3>Retinal changes were identified</h3>

                <p>
                  The screening model detected image patterns
                  that may be associated with diabetic
                  retinopathy. This result should be reviewed
                  by a qualified eye-care professional.
                </p>
              </>
            ) : (
              <>
                <h3>No significant DR pattern detected</h3>

                <p>
                  The screening model did not identify
                  patterns associated with diabetic
                  retinopathy in the analyzed image. Regular
                  eye examinations are still important,
                  especially for people with diabetes.
                </p>
              </>
            )}

          </div>

        </section>

        {/* RECOMMENDATION */}

        <section className="report-section">

          <div className="report-section-heading">
            <span className="report-section-number">04</span>

            <div>
              <h2>Recommended Next Step</h2>
              <p>Suggested action based on the screening result.</p>
            </div>
          </div>

          <div
            className={`report-recommendation ${
              isPositive ? 'warning' : 'normal'
            }`}
          >

            <div className="report-recommendation-icon">
              {isPositive ? '!' : '✓'}
            </div>

            <div>
              <h3>
                {isPositive
                  ? 'Professional eye examination recommended'
                  : 'Continue routine eye care'}
              </h3>

              <p>
                {isPositive
                  ? 'Please consult an ophthalmologist or qualified eye-care professional for a comprehensive examination and clinical interpretation.'
                  : 'Continue regular diabetic eye examinations and follow the schedule recommended by your healthcare professional.'}
              </p>
            </div>

          </div>

        </section>

        {/* ACTIONS */}

        <section className="report-actions">

          <Link
            to="/history"
            className="report-secondary-btn"
          >
            ← Back to History
          </Link>

          <Link
            to="/detection"
            className="report-primary-btn"
          >
            + New Screening
          </Link>

          <button
            type="button"
            className="report-print-btn"
            onClick={() => window.print()}
          >
            Print Report
          </button>

        </section>

        {/* DISCLAIMER */}

        <div className="report-disclaimer">

          <span>ⓘ</span>

          <p>
            <strong>Clinical Disclaimer:</strong> DIAIRIS is
            an AI-based screening support system. This report
            is not a medical diagnosis and should not replace
            examination, diagnosis, or treatment by a
            qualified healthcare professional.
          </p>

        </div>

      </div>

    </main>
  )
}

export default Report