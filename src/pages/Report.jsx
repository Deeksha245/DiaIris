
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getScans } from '../api'
import './Report.css'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString('en-IN', {
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
    let cancelled = false

    async function loadReport() {
      try {
        setLoading(true)
        setError('')

        const data = await getScans()
        const scans = Array.isArray(data) ? data : []
        const found = scans.find(
          (item) => String(item.id) === String(id)
        )

        if (cancelled) return

        if (!found) {
          setScan(null)
          setError('Screening report not found.')
          return
        }

        setScan(found)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load the report.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadReport()

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <main className="report-page">
        <div className="report-container report-state">
          <div className="report-loader" />
          <h2>Preparing Your Report</h2>
          <p>Please wait while your screening details load.</p>
        </div>
      </main>
    )
  }

  if (error || !scan) {
    return (
      <main className="report-page">
        <div className="report-container">
          <section className="report-error">
            <div className="report-error-icon">!</div>
            <span className="report-eyebrow">DIAIRIS REPORT</span>
            <h1>Report Unavailable</h1>
            <p>{error || 'The requested report could not be found.'}</p>
            <Link to="/history" className="report-primary-btn">
              ← Back to History
            </Link>
          </section>
        </div>
      </main>
    )
  }

  const isPositive = scan.result === 'DR_present'

  const rawConfidence = Number(scan.confidence ?? 0)
  const confidence = rawConfidence <= 1
    ? rawConfidence * 100
    : rawConfidence

  const safeConfidence = Math.min(
    100,
    Math.max(0, Number.isFinite(confidence) ? confidence : 0)
  )

  // These categories are application-defined, not clinical severity grades.
  let riskLevel = 'Screening Negative'

  if (isPositive) {
    riskLevel = 'Clinical Review Needed'
  }

  const screeningDate = formatDate(
    scan.created_at || scan.timestamp || scan.date
  )

  return (
    <main className="report-page">
      <div className="report-container">

        <header className="report-header">
          <div className="report-brand">
            <div className="report-brand-icon">D</div>
            <span>DIAIRIS <small>AI RETINAL SCREENING</small></span>
          </div>

          <Link to="/history" className="report-back-btn">
            ← Screening History
          </Link>

          <div className="report-heading">
            <span className="report-eyebrow">
              SCREENING REPORT / DR-{scan.id}
            </span>
            <h1>Eye Screening Report</h1>
            <p>
              A summary of the AI-assisted analysis of your retinal image.
            </p>
          </div>
        </header>

        <section className="report-meta-card">
          <div className="report-meta-item">
            <span>REPORT NUMBER</span>
            <strong>DR-{scan.id}</strong>
          </div>
          <div className="report-meta-item">
            <span>SCREENING DATE</span>
            <strong>{screeningDate}</strong>
          </div>
          <div className="report-meta-item">
            <span>SCREENING TYPE</span>
            <strong>AI Retinal Screening</strong>
          </div>
        </section>

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
              AI SCREENING RESULT
            </span>
            <h2>
              {isPositive
                ? 'Possible Diabetic Retinopathy Detected'
                : 'No DR Pattern Detected'}
            </h2>
            <p>
              {isPositive
                ? 'The model identified image patterns that may be associated with diabetic retinopathy. Arrange a review with an eye-care professional.'
                : 'The model did not identify patterns associated with diabetic retinopathy in this image. This does not rule out eye disease.'}
            </p>
          </div>

          <span className="report-result-badge">
            {isPositive ? 'Review Recommended' : 'Screening Result'}
          </span>
        </section>

        <section className="report-section">
          <div className="report-section-heading">
            <span className="report-section-number">01</span>
            <div>
              <h2>Screening Summary</h2>
              <p>Your key screening information at a glance.</p>
            </div>
          </div>

          <div className="report-summary-grid">
            <article className="report-info-card">
              <span>RESULT</span>
              <strong className={isPositive ? 'report-value-warning' : 'report-value-success'}>
                {isPositive ? 'DR Pattern Detected' : 'No DR Pattern Detected'}
              </strong>
              <small>AI model output</small>
            </article>

            <article className="report-info-card">
              <span>MODEL CONFIDENCE</span>
              <strong>{safeConfidence.toFixed(1)}%</strong>
              <small>Model-reported confidence</small>
            </article>

            <article className="report-info-card">
              <span>NEXT STEP</span>
              <strong>{isPositive ? 'Eye-care review' : 'Routine eye care'}</strong>
              <small>General guidance</small>
            </article>

            <article className="report-info-card">
              <span>REPORT ID</span>
              <strong>DR-{scan.id}</strong>
              <small>Screening record</small>
            </article>
          </div>
        </section>

        <section className="report-section">
          <div className="report-section-heading">
            <span className="report-section-number">02</span>
            <div>
              <h2>AI Confidence</h2>
              <p>Confidence returned by the screening model.</p>
            </div>
          </div>

          <div className="report-confidence-card">
            <div className="report-confidence-top">
              <div>
                <span>Model confidence</span>
                <p>For this screening result</p>
              </div>
              <strong>{safeConfidence.toFixed(1)}%</strong>
            </div>

            <div
              className="report-progress"
              role="progressbar"
              aria-label="Model confidence"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(safeConfidence)}
            >
              <div
                className={`report-progress-fill ${
                  isPositive ? 'positive' : 'negative'
                }`}
                style={{ width: `${safeConfidence}%` }}
              />
            </div>

            <p className="report-note">
              Model confidence is not the same as diagnostic accuracy,
              disease severity, or the probability that you have a disease.
            </p>
          </div>
        </section>

        <section className="report-section">
          <div className="report-section-heading">
            <span className="report-section-number">03</span>
            <div>
              <h2>Result Interpretation</h2>
              <p>Understanding the model output.</p>
            </div>
          </div>

          <article className="report-text-card">
            <div className="report-card-accent" />
            <h3>
              {isPositive
                ? 'Patterns requiring professional review'
                : 'No DR-associated pattern identified by the model'}
            </h3>
            <p>
              {isPositive
                ? 'The model returned a positive screening result. An ophthalmologist should examine your retina and determine whether further tests or treatment are needed.'
                : 'The model returned a negative screening result for the analyzed image. Early eye disease may still be present, so regular comprehensive eye examinations remain important.'}
            </p>
          </article>
        </section>

        <section className="report-section">
          <div className="report-section-heading">
            <span className="report-section-number">04</span>
            <div>
              <h2>Recommended Next Step</h2>
              <p>General guidance based on the screening output.</p>
            </div>
          </div>

          <article className={`report-recommendation ${isPositive ? 'warning' : 'normal'}`}>
            <div className="report-recommendation-icon">
              {isPositive ? '!' : '✓'}
            </div>
            <div>
              <h3>
                {isPositive
                  ? 'Arrange a professional eye examination'
                  : 'Continue regular diabetic eye screening'}
              </h3>
              <p>
                {isPositive
                  ? 'Contact an ophthalmologist or qualified eye-care professional for a comprehensive examination. Seek prompt care if you experience sudden vision changes.'
                  : 'Continue regular eye examinations as advised by your healthcare professional. A negative AI screening does not replace a comprehensive eye examination.'}
              </p>
            </div>
          </article>
        </section>

        <section className="report-actions">
          <Link to="/history" className="report-secondary-btn">
            ← Back to History
          </Link>
          <Link to="/detection" className="report-primary-btn">
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

        <footer className="report-disclaimer">
          <span className="report-disclaimer-icon">i</span>
          <p>
            <strong>Medical disclaimer</strong>
            <br />
            DiaIris is an AI-assisted screening support project. This
            report is not a medical diagnosis and must not replace advice,
            examination, or treatment from a qualified healthcare professional.
          </p>
        </footer>

      </div>
    </main>
  )
}

export default Report
