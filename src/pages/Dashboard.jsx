import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const pages = [
    {
      icon: "◉",
      title: "Detection",
      text: "Upload a retinal image and receive an AI-assisted screening result.",
      link: "/detection",
    },
    {
      icon: "◷",
      title: "History",
      text: "View previous retinal screening results and activity.",
      link: "/history",
    },
    {
      icon: "▤",
      title: "Reports",
      text: "Review screening information and generated reports.",
      link: "/report",
    },
    {
      icon: "□",
      title: "Appointments",
      text: "Manage eye-care appointments and consultation schedules.",
      link: "/appointments",
    },
    {
      icon: "+",
      title: "Medications",
      text: "Keep medication information organized in one place.",
      link: "/medications",
    },
    {
      icon: "○",
      title: "Profile",
      text: "View and manage your personal account information.",
      link: "/profile",
    },
  ];

  const steps = [
    ["01", "Upload", "Select a retinal fundus image."],
    ["02", "Preprocess", "The image is prepared for analysis."],
    ["03", "AI Analysis", "The trained model analyzes retinal features."],
    ["04", "Prediction", "The system generates a screening result."],
    ["05", "Report", "Result and confidence are presented."],
  ];

  return (
    <main className="diairis-dashboard">

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="hero-left">
          <span className="dashboard-kicker">
            DIAIRIS • AI-ASSISTED RETINAL SCREENING
          </span>

          <h1>
            Welcome back,{" "}
            <span>{user?.name || "Deeksha"}</span>
          </h1>

          <p className="hero-description">
            Your central workspace for retinal screening, AI-assisted
            analysis, reports and eye-care information.
          </p>

          <div className="hero-buttons">
            <Link to="/detection" className="hero-primary">
              Start Screening <span>→</span>
            </Link>

            <Link to="/about" className="hero-secondary">
              Learn About DIAIRIS
            </Link>
          </div>

          <div className="hero-date">
            <span>Today</span>
            <strong>{today}</strong>
          </div>
        </div>

        <div className="hero-retina">
          <div className="retina-visual">
            <div className="retina-glow"></div>
            <div className="retina-core"></div>
            <div className="retina-vessel vessel-one"></div>
            <div className="retina-vessel vessel-two"></div>
            <div className="retina-vessel vessel-three"></div>

            <div className="retina-scan">
              AI ANALYSIS
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="dashboard-section">
        <div className="section-title">
          <span>DIAIRIS OVERVIEW</span>

          <h2>
            Your complete retinal{" "}
            <strong>screening workspace.</strong>
          </h2>

          <p>
            DIAIRIS is a web-based AI-assisted platform designed to
            support diabetic retinopathy screening through retinal
            image analysis.
          </p>
        </div>

        <div className="overview-grid">
          <div className="overview-card">
            <span>01</span>
            <h3>AI Retinal Analysis</h3>
            <p>
              Analyze retinal fundus images using the trained
              machine-learning model.
            </p>
          </div>

          <div className="overview-card">
            <span>02</span>
            <h3>Screening Records</h3>
            <p>
              Keep previous screening results and reports organized.
            </p>
          </div>

          <div className="overview-card">
            <span>03</span>
            <h3>Healthcare Management</h3>
            <p>
              Manage appointments and medication information.
            </p>
          </div>

          <div className="overview-card">
            <span>04</span>
            <h3>Eye-Care Information</h3>
            <p>
              Learn about diabetic retinopathy and retinal health.
            </p>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="dashboard-section">
        <div className="section-title">
          <span>HOW DIAIRIS WORKS</span>

          <h2>
            From retinal image{" "}
            <strong>to screening result.</strong>
          </h2>

          <p>
            DIAIRIS follows a simple five-stage AI screening workflow.
          </p>
        </div>

        <div className="workflow-grid">
          {steps.map((step) => (
            <div className="workflow-card" key={step[0]}>
              <span className="workflow-number">{step[0]}</span>

              <h3>{step[1]}</h3>

              <p>{step[2]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI */}
      <section className="ai-overview">
        <div className="ai-visual">
          <div className="ai-ring">
            <div className="ai-center">
              <strong>AI</strong>
              <small>MODEL</small>
            </div>
          </div>
        </div>

        <div className="ai-content">
          <span>AI SCREENING</span>

          <h2>
            What happens after{" "}
            <strong>you upload an image?</strong>
          </h2>

          <p>
            The retinal image is prepared and passed through the
            trained machine-learning model. The model evaluates
            visual patterns and generates an AI-assisted screening
            prediction with confidence information.
          </p>

          <div className="ai-points">
            <div>
              <b>01</b>
              <span>Image preprocessing</span>
            </div>

            <div>
              <b>02</b>
              <span>Retinal feature analysis</span>
            </div>

            <div>
              <b>03</b>
              <span>Model prediction</span>
            </div>

            <div>
              <b>04</b>
              <span>Result and confidence</span>
            </div>
          </div>

          <Link to="/detection" className="dashboard-link">
            Try retinal screening →
          </Link>
        </div>
      </section>

      {/* PAGES */}
      <section className="dashboard-section">
        <div className="section-title">
          <span>EXPLORE DIAIRIS</span>

          <h2>
            Everything you can do{" "}
            <strong>from here.</strong>
          </h2>

          <p>
            Each module has a specific role in your screening and
            healthcare journey.
          </p>
        </div>

        <div className="pages-grid">
          {pages.map((page, index) => (
            <Link
              to={page.link}
              className="page-card"
              key={page.title}
            >
              <div className="page-top">
                <span>0{index + 1}</span>
                <b>{page.icon}</b>
              </div>

              <h3>{page.title}</h3>

              <p>{page.text}</p>

              <strong>
                Open {page.title} →
              </strong>
            </Link>
          ))}
        </div>
      </section>

      {/* PURPOSE */}
      <section className="purpose-section">
        <div>
          <span>WHY DIAIRIS?</span>

          <h2>
            Technology supporting{" "}
            <strong>early screening.</strong>
          </h2>
        </div>

        <p>
          DIAIRIS brings retinal image screening, AI analysis,
          patient records and healthcare support features together
          in one platform.
        </p>

        <Link to="/about">
          Explore project information →
        </Link>
      </section>

      {/* FINAL CTA */}
      <section className="dashboard-final">
        <div>
          <span>READY TO BEGIN?</span>

          <h2>
            Start your retinal{" "}
            <strong>screening.</strong>
          </h2>

          <p>
            Upload a retinal image and explore the AI-assisted
            screening workflow of DIAIRIS.
          </p>
        </div>

        <Link to="/detection" className="final-screen-btn">
          Start Screening →
        </Link>
      </section>

      {/* DISCLAIMER */}
      <section className="dashboard-disclaimer">
        <strong>Important medical information</strong>

        <p>
          DIAIRIS provides AI-assisted screening support and does
          not replace professional medical diagnosis, treatment or
          medical advice. Results should be reviewed by a qualified
          healthcare professional.
        </p>
      </section>

    </main>
  );
}

export default Dashboard;