import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <main className="diairis-home">

      {/* HERO */}
      <section className="diairis-hero">

        <img
          src="/src/assets/hero.png"
          alt="Retinal fundus image used for AI screening"
          className="hero-bg"
        />

        <div className="hero-overlay"></div>

        {/* Decorative scanning elements */}
        <div className="hero-grid"></div>

        <div className="hero-scan-line"></div>

        <div className="hero-content-box">

          <div className="hero-status">
            <span className="status-dot"></span>
            AI-POWERED RETINAL SCREENING
          </div>

          <h1>
            Better vision
            <br />
            <span>starts with insight.</span>
          </h1>

          <p>
            DIAIRIS combines retinal image analysis,
            machine learning and explainable AI to
            support diabetic retinopathy screening.
          </p>

          <div className="hero-actions">

            {user ? (
              <Link
                to="/detection"
                className="hero-primary-btn"
              >
                Start Screening
                <span>→</span>
              </Link>
            ) : (
              <Link
                to="/signup"
                className="hero-primary-btn"
              >
                Get Started
                <span>→</span>
              </Link>
            )}

            <Link
              to="/about"
              className="hero-outline-btn"
            >
              Explore DIAIRIS
            </Link>

          </div>

          <div className="hero-note">
            <span>●</span>
            AI-assisted screening • Explainable results • Secure history
          </div>

        </div>


        {/* AI ANALYSIS CARD */}
        <div className="ai-analysis-card">

          <div className="analysis-card-header">
            <div>
              <span className="analysis-live"></span>
              LIVE ANALYSIS
            </div>

            <span>DIAIRIS AI</span>
          </div>

          <div className="analysis-image">

            <img
              src="/src/assets/hero.png"
              alt=""
            />

            <div className="analysis-crosshair"></div>

            <div className="analysis-scan"></div>

            <div className="analysis-point point-one"></div>
            <div className="analysis-point point-two"></div>
            <div className="analysis-point point-three"></div>

          </div>

          <div className="analysis-result">

            <div>
              <small>SCREENING STATUS</small>
              <strong>IMAGE READY</strong>
            </div>

            <div className="analysis-check">
              ✓
            </div>

          </div>

        </div>


        {/* FEATURE CARDS */}
        <div className="hero-feature-cards">

          <Link to="/detection" className="hero-feature-card">

            <span className="feature-number">
              01
            </span>

            <div className="feature-icon">
              AI
            </div>

            <div>
              <h3>AI Screening</h3>
              <p>
                Retinal image analysis
                using machine learning.
              </p>
            </div>

            <span className="feature-arrow">
              →
            </span>

          </Link>


          <div className="hero-feature-card">

            <span className="feature-number">
              02
            </span>

            <div className="feature-icon">
              XAI
            </div>

            <div>
              <h3>Explainable AI</h3>
              <p>
                Visual attention maps
                for model interpretation.
              </p>
            </div>

            <span className="feature-arrow">
              →
            </span>

          </div>


          <Link to="/history" className="hero-feature-card">

            <span className="feature-number">
              03
            </span>

            <div className="feature-icon">
              HIS
            </div>

            <div>
              <h3>Screening History</h3>
              <p>
                Access previous screening
                results in one place.
              </p>
            </div>

            <span className="feature-arrow">
              →
            </span>

          </Link>


          <Link to="/appointments" className="hero-feature-card">

            <span className="feature-number">
              04
            </span>

            <div className="feature-icon">
              CARE
            </div>

            <div>
              <h3>Patient Care</h3>
              <p>
                Manage appointments and
                health information.
              </p>
            </div>

            <span className="feature-arrow">
              →
            </span>

          </Link>

        </div>

      </section>


      {/* INTRODUCTION */}
      <section className="diairis-intro">

        <div className="reveal">

          <span className="section-label">
            DESIGNED FOR SIMPLICITY
          </span>

          <h2>
            Technology that makes
            <br />
            <span>screening easier to understand.</span>
          </h2>

          <p>
            From uploading a retinal image to reviewing
            your screening history, DIAIRIS brings the
            complete experience into one simple platform.
          </p>

        </div>


        <div className="intro-stats">

          <div>
            <strong>01</strong>
            <span>Upload</span>
          </div>

          <div>
            <strong>02</strong>
            <span>Analyze</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Understand</span>
          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="diairis-process">

        <div className="process-heading reveal">

          <span className="section-label">
            HOW DIAIRIS WORKS
          </span>

          <h2>
            From retinal image
            <br />
            to meaningful insight.
          </h2>

        </div>


        <div className="process-grid">

          <div className="process-card reveal">

            <div className="process-top">
              <span>01</span>
              <div className="process-icon">
                ↑
              </div>
            </div>

            <h3>Upload</h3>

            <p>
              Upload a suitable retinal fundus
              image through the screening page.
            </p>

          </div>


          <div className="process-connector"></div>


          <div className="process-card reveal">

            <div className="process-top">
              <span>02</span>
              <div className="process-icon">
                AI
              </div>
            </div>

            <h3>Analyze</h3>

            <p>
              The trained model processes the
              image and generates a screening result.
            </p>

          </div>


          <div className="process-connector"></div>


          <div className="process-card reveal">

            <div className="process-top">
              <span>03</span>
              <div className="process-icon">
                ✓
              </div>
            </div>

            <h3>Understand</h3>

            <p>
              Review the result, confidence and
              available visual explanation.
            </p>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="diairis-final-cta">

        <div className="cta-glow"></div>

        <div className="cta-content reveal">

          <span className="section-label">
            START WITH DIAIRIS
          </span>

          <h2>
            Your eyes deserve
            <br />
            better technology.
          </h2>

          <p>
            Explore AI-assisted retinal screening
            with a simple, user-friendly experience.
          </p>

          {user ? (
            <Link
              to="/detection"
              className="cta-button"
            >
              Start Screening →
            </Link>
          ) : (
            <Link
              to="/signup"
              className="cta-button"
            >
              Create Account →
            </Link>
          )}

        </div>

      </section>


      {/* DISCLAIMER */}
      <section className="diairis-disclaimer">

        <span>IMPORTANT INFORMATION</span>

        <p>
          DIAIRIS is an AI-assisted screening tool and
          does not replace professional medical diagnosis.
          Screening results should be reviewed by a qualified
          healthcare professional.
        </p>

      </section>

    </main>
  )
}

export default Home