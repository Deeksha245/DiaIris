
import diairisLogo from "../assets/diairis-logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <main className="diairis-home">
      {/* HERO */}
      <section className="diairis-hero">
        <div className="hero-overlay" />
        <div className="hero-grid" />

        {/* HERO CONTENT */}
        <div className="hero-content-box">
          <div className="hero-status">
            <span className="status-dot" />
            AI-POWERED RETINAL SCREENING
          </div>

          <h1>
            Better vision
            <br />
            <span>starts with insight.</span>
          </h1>

          <p>
            DIAIRIS combines retinal image analysis, machine learning
            and explainable AI to support diabetic retinopathy screening.
          </p>

          <div className="hero-actions">
            <Link
              to={user ? "/detection" : "/signup"}
              className="hero-primary-btn"
            >
              {user ? "Start Screening" : "Get Started"}
              <span>→</span>
            </Link>

            <Link to="/about" className="hero-outline-btn">
              Explore DIAIRIS
            </Link>
          </div>

          <div className="hero-note">
            <span>●</span>
            AI-assisted screening · Explainable results · Screening history
          </div>
        </div>

        {/* DIAIRIS LOGO PANEL */}
        <div className="ai-analysis-card">
          <div className="analysis-card-header">
            <div>
              <span className="analysis-live" />
              DIAIRIS PLATFORM
            </div>
            <span>AI SCREENING</span>
          </div>

          <div className="analysis-image logo-analysis-image">
            <img
              src={diairisLogo}
              alt="DIAIRIS Logo"
              className="diairis-hero-logo"
            />
          </div>

          <p className="analysis-caption">
            Upload a retinal image to begin AI-assisted screening.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="hero-feature-cards">
          <Link to="/detection" className="hero-feature-card">
            <span className="feature-number">01</span>
            <div className="feature-icon">AI</div>
            <div>
              <h3>AI Screening</h3>
              <p>Retinal image analysis using machine learning.</p>
            </div>
            <span className="feature-arrow">→</span>
          </Link>

          <Link to="/about" className="hero-feature-card">
            <span className="feature-number">02</span>
            <div className="feature-icon">XAI</div>
            <div>
              <h3>Explainable AI</h3>
              <p>Explore available visual explanations of predictions.</p>
            </div>
            <span className="feature-arrow">→</span>
          </Link>

          <Link to="/history" className="hero-feature-card">
            <span className="feature-number">03</span>
            <div className="feature-icon">HIS</div>
            <div>
              <h3>Screening History</h3>
              <p>Review your previous screening records.</p>
            </div>
            <span className="feature-arrow">→</span>
          </Link>

          <Link to="/appointments" className="hero-feature-card">
            <span className="feature-number">04</span>
            <div className="feature-icon">CARE</div>
            <div>
              <h3>Patient Care</h3>
              <p>Manage appointments and health information.</p>
            </div>
            <span className="feature-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="diairis-intro">
        <div className="reveal">
          <span className="section-label">DESIGNED FOR SIMPLICITY</span>

          <h2>
            Technology that makes
            <br />
            <span>screening easier to understand.</span>
          </h2>

          <p>
            From uploading a retinal image to reviewing your screening
            history, DIAIRIS brings the screening experience into one
            organized platform. Review predictions and available visual
            explanations through a clear, user-friendly interface.
          </p>

          <div className="intro-link">
            <Link to="/about">Learn more about DIAIRIS →</Link>
          </div>
        </div>

        <div className="intro-stats">
          <div>
            <strong>01</strong>
            <span>Upload a retinal image</span>
          </div>
          <div>
            <strong>02</strong>
            <span>AI-assisted analysis</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Review the result</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="diairis-process">
        <div className="process-heading reveal">
          <span className="section-label">HOW DIAIRIS WORKS</span>

          <h2>
            From retinal image
            <br />
            to meaningful insight.
          </h2>

          <p>
            A simple workflow for AI-assisted diabetic retinopathy screening.
          </p>
        </div>

        <div className="process-grid">
          <article className="process-card reveal">
            <div className="process-top">
              <span>STEP 01</span>
              <div className="process-icon">↑</div>
            </div>

            <h3>Upload</h3>
            <p>
              Upload a suitable retinal fundus image through the screening
              page.
            </p>

            <Link to="/detection" className="process-link">
              Open screening →
            </Link>
          </article>

          <div className="process-connector" />

          <article className="process-card reveal">
            <div className="process-top">
              <span>STEP 02</span>
              <div className="process-icon">AI</div>
            </div>

            <h3>Analyze</h3>
            <p>
              The trained model processes the image and generates a
              screening prediction.
            </p>
          </article>

          <div className="process-connector" />

          <article className="process-card reveal">
            <div className="process-top">
              <span>STEP 03</span>
              <div className="process-icon">✓</div>
            </div>

            <h3>Understand</h3>
            <p>
              Review the prediction, confidence score and available visual
              explanation.
            </p>

            <Link to="/history" className="process-link">
              View history →
            </Link>
          </article>
        </div>
      </section>

      {/* DIAIRIS BENEFITS */}
      <section className="diairis-benefits">
        <div className="benefits-heading">
          <span className="section-label">THE DIAIRIS EXPERIENCE</span>
          <h2>Everything organized in one place.</h2>
          <p>
            Access screening tools and supported patient features through
            a consistent interface.
          </p>
        </div>

        <div className="benefits-grid">
          <article className="benefit-card">
            <div className="benefit-icon">01</div>
            <h3>Simple Screening</h3>
            <p>
              Upload retinal images and access the screening workflow from
              one page.
            </p>
          </article>

          <article className="benefit-card">
            <div className="benefit-icon">02</div>
            <h3>Visual Explanations</h3>
            <p>
              Review available model-generated visual explanations
              alongside screening results.
            </p>
          </article>

          <article className="benefit-card">
            <div className="benefit-icon">03</div>
            <h3>Organized Records</h3>
            <p>
              Access previous screenings, appointments and supported
              patient features.
            </p>
          </article>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="diairis-final-cta">
        <div className="cta-glow" />

        <div className="cta-content reveal">
          <img src={diairisLogo} alt="DIAIRIS" className="cta-logo" />

          <span className="section-label">START WITH DIAIRIS</span>

          <h2>
            Your eyes deserve
            <br />
            better technology.
          </h2>

          <p>
            Explore AI-assisted retinal screening with a simple,
            user-friendly experience.
          </p>

          <Link
            to={user ? "/detection" : "/signup"}
            className="cta-button"
          >
            {user ? "Start Screening →" : "Create Account →"}
          </Link>
        </div>
      </section>

      {/* MEDICAL DISCLAIMER */}
      <section className="diairis-disclaimer">
        <span>IMPORTANT INFORMATION</span>
        <p>
          DIAIRIS is an AI-assisted screening project and does not replace
          professional medical diagnosis. Predictions may be incorrect.
          Consult a qualified healthcare professional for diagnosis and
          treatment.
        </p>
      </section>
    </main>
  );
}

export default Home;
