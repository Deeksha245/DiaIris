import { useState } from 'react'
import diairisLogo from '../assets/diairis-logo.png'


function About() {
  const [activeLayer, setActiveLayer] = useState('Retina')

  const layers = {
    Cornea:
      'The transparent front surface of the eye that helps focus incoming light.',
    Iris:
      'The colored part of the eye that controls the amount of light entering through the pupil.',
    Lens:
      'Focuses light onto the retina to produce a clear image.',
    Retina:
      'A light-sensitive layer at the back of the eye containing cells and blood vessels essential for vision.',
    OpticNerve:
      'Carries visual information from the retina to the brain.'
  }

  return (
    <main className="diairis-about">

      {/* =====================================================
          HERO
      ===================================================== */}

<section className="about-hero">
  <div className="about-hero-content">
    <span className="about-eyebrow">
      UNDERSTANDING DIABETIC RETINOPATHY
    </span>

    <h1>
      Know the disease.
      <br />
      <span>Protect your vision.</span>
    </h1>

    <p>
      Diabetic retinopathy is a diabetes-related eye condition
      that can damage the blood vessels of the retina and may
      lead to vision loss when it progresses.
    </p>

    <div className="about-hero-points">
      <span>Retinal health</span>
      <span>Early screening</span>
      <span>Prevention</span>
    </div>
  </div>

  <div className="about-hero-visual">
    <img
      src={diairisLogo}
      alt="DIAIRIS - Retinal Health"
      className="about-retinal-logo"
    />

    <div className="about-image-label">
      <span></span>
      RETINAL HEALTH
    </div>
  </div>
</section>




      {/* =====================================================
          WHAT IS DR?
      ===================================================== */}

      <section className="about-section about-intro-section">

        <div className="about-section-heading">
          <span className="about-label">01 — THE CONDITION</span>

          <h2>
            What is diabetic
            <br />
            <span>retinopathy?</span>
          </h2>
        </div>

        <div className="about-two-column">

          <div className="about-text-card">
            <p>
              Diabetic retinopathy is an eye complication associated
              with diabetes. Long-term high blood glucose can damage
              the small blood vessels supplying the retina.
            </p>

            <p>
              In early stages, a person may have few or no noticeable
              symptoms. As retinal damage progresses, abnormal vessels,
              bleeding, swelling and other changes can affect vision.
            </p>

            <p>
              This is why regular eye examinations and early detection
              are important for people living with diabetes.
            </p>
          </div>

          <div className="about-fact-card">
            <span>KEY IDEA</span>
            <strong>
              Retinal damage can develop before major vision changes
              become noticeable.
            </strong>

            <p>
              Early screening can help identify people who may need
              further clinical evaluation.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT OCCURS
      ===================================================== */}

      <section className="about-section about-process-section">

        <div className="about-section-heading centered">
          <span className="about-label">02 — HOW IT OCCURS</span>

          <h2>
            From high blood glucose
            <br />
            <span>to retinal damage.</span>
          </h2>
        </div>

        <div className="dr-development-grid">

          <div className="dr-development-card">
            <span>01</span>
            <div className="development-icon">GLU</div>
            <h3>Persistent high glucose</h3>
            <p>
              Long-term elevated blood glucose can affect small blood
              vessels throughout the body, including those supplying
              the retina.
            </p>
          </div>

          <div className="dr-development-card">
            <span>02</span>
            <div className="development-icon">RET</div>
            <h3>Blood vessel damage</h3>
            <p>
              Retinal vessels may become weakened, blocked or leaky,
              affecting the retinal tissue.
            </p>
          </div>

          <div className="dr-development-card">
            <span>03</span>
            <div className="development-icon">X</div>
            <h3>Retinal changes</h3>
            <p>
              Hemorrhages, fluid leakage and other retinal abnormalities
              may develop as the disease progresses.
            </p>
          </div>

          <div className="dr-development-card">
            <span>04</span>
            <div className="development-icon">EYE</div>
            <h3>Vision risk</h3>
            <p>
              Advanced disease can threaten vision and requires timely
              professional assessment and treatment.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          RISK FACTORS
      ===================================================== */}

      <section className="about-section">

        <div className="about-section-heading">
          <span className="about-label">03 — RISK FACTORS</span>

          <h2>
            What increases the
            <br />
            <span>risk?</span>
          </h2>
        </div>

        <div className="risk-grid">

          <div className="risk-card">
            <span>01</span>
            <h3>High blood glucose</h3>
            <p>
              Poorly controlled blood glucose over time increases the
              risk of diabetes-related complications.
            </p>
          </div>

          <div className="risk-card">
            <span>02</span>
            <h3>Longer duration of diabetes</h3>
            <p>
              The risk of diabetic complications can increase the longer
              a person lives with diabetes.
            </p>
          </div>

          <div className="risk-card">
            <span>03</span>
            <h3>High blood pressure</h3>
            <p>
              Managing blood pressure is important for reducing the
              risk of diabetes-related eye complications.
            </p>
          </div>

          <div className="risk-card">
            <span>04</span>
            <h3>High cholesterol</h3>
            <p>
              Abnormal blood lipid levels can contribute to vascular
              complications and should be managed clinically.
            </p>
          </div>

          <div className="risk-card">
            <span>05</span>
            <h3>Smoking</h3>
            <p>
              Tobacco use can worsen overall vascular health and is an
              important modifiable risk factor.
            </p>
          </div>

          <div className="risk-card">
            <span>06</span>
            <h3>Limited physical activity</h3>
            <p>
              Regular physical activity supports diabetes management
              and overall cardiovascular health.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          LIFESTYLE
      ===================================================== */}

      <section className="about-section lifestyle-section">

        <div className="about-section-heading centered">
          <span className="about-label">04 — LIFESTYLE</span>

          <h2>
            Protecting your eyes
            <br />
            <span>starts beyond the eye.</span>
          </h2>

          <p>
            Managing diabetes and cardiovascular risk factors is an
            important part of reducing the risk of diabetic retinopathy.
          </p>
        </div>

        <div className="lifestyle-grid">

          <div className="lifestyle-card">
            <div className="lifestyle-number">01</div>
            <h3>Balanced diet</h3>
            <p>
              Follow a balanced eating pattern recommended by your
              healthcare professional. Limit excess sugar and unhealthy
              fats while maintaining appropriate nutrition.
            </p>
          </div>

          <div className="lifestyle-card">
            <div className="lifestyle-number">02</div>
            <h3>Regular exercise</h3>
            <p>
              Regular physical activity can support blood glucose,
              weight and cardiovascular health. WHO recommends adults
              aim for at least 150 minutes of moderate activity per week.
            </p>
          </div>

          <div className="lifestyle-card">
            <div className="lifestyle-number">03</div>
            <h3>Blood glucose control</h3>
            <p>
              Follow your diabetes management plan and monitor glucose
              as recommended by your healthcare professional.
            </p>
          </div>

          <div className="lifestyle-card">
            <div className="lifestyle-number">04</div>
            <h3>Regular eye screening</h3>
            <p>
              Do not wait for major vision symptoms before having
              diabetes-related eye examinations.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          EYE ANATOMY
      ===================================================== */}

      <section className="about-section anatomy-section">

        <div className="about-section-heading centered">
          <span className="about-label">05 — EYE ANATOMY</span>

          <h2>
            Where does diabetic
            <br />
            <span>retinopathy occur?</span>
          </h2>
        </div>

        <div className="anatomy-layout">

          <div className="anatomy-visual">

            <div className="eye-circle">
              <div className="eye-inner">
                <div className="eye-retina"></div>
                <div className="eye-lens"></div>
                <div className="eye-pupil"></div>
              </div>
            </div>

          </div>

          <div className="anatomy-info">

            {Object.keys(layers).map((layer) => (
              <button
                key={layer}
                className={`anatomy-button ${
                  activeLayer === layer ? 'active' : ''
                }`}
                onClick={() => setActiveLayer(layer)}
              >
                <span>{layer}</span>
                <span>+</span>
              </button>
            ))}

            <div className="anatomy-description">
              <span>SELECTED STRUCTURE</span>
              <h3>{activeLayer}</h3>
              <p>{layers[activeLayer]}</p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SYMPTOMS
      ===================================================== */}

      <section className="about-section">

        <div className="about-section-heading">
          <span className="about-label">06 — WARNING SIGNS</span>

          <h2>
            Symptoms may appear
            <br />
            <span>late.</span>
          </h2>
        </div>

        <div className="symptoms-grid">

          <div>
            <strong>Blurred vision</strong>
            <p>Vision may become less clear.</p>
          </div>

          <div>
            <strong>Floaters</strong>
            <p>Dark spots or floating shapes may appear.</p>
          </div>

          <div>
            <strong>Dark areas</strong>
            <p>Some people may notice areas of reduced vision.</p>
          </div>

          <div>
            <strong>Vision loss</strong>
            <p>Advanced disease can cause serious vision impairment.</p>
          </div>

        </div>

        <div className="important-note">
          <strong>Important:</strong>
          Some people can have diabetic retinopathy without obvious
          symptoms. Regular professional eye examinations remain important.
        </div>

      </section>


      {/* =====================================================
          GLOBAL IMPACT
      ===================================================== */}

      <section className="about-section global-impact">

        <div className="about-section-heading centered">
          <span className="about-label">07 — GLOBAL HEALTH</span>

          <h2>
            Why early detection
            <br />
            <span>matters.</span>
          </h2>
        </div>

        <div className="impact-grid">

          <div className="impact-card">
            <strong>830M</strong>
            <h3>People living with diabetes</h3>
            <p>
              WHO reported around 830 million people living with diabetes
              in 2022.
            </p>
          </div>

          <div className="impact-card">
            <strong>VISION</strong>
            <h3>A preventable threat</h3>
            <p>
              Diabetes can damage blood vessels in the eye and contribute
              to permanent vision loss.
            </p>
          </div>

          <div className="impact-card">
            <strong>EARLY</strong>
            <h3>Action matters</h3>
            <p>
              Early detection and timely treatment can help prevent or
              reduce serious vision loss.
            </p>
          </div>

        </div>

        <p className="source-note">
          Statistics and medical information should be interpreted with
          their source, year and methodology.
        </p>

      </section>


      {/* =====================================================
          HISTORY
      ===================================================== */}

      <section className="about-section history-section">

        <div className="about-section-heading">
          <span className="about-label">08 — HISTORY</span>

          <h2>
            How diabetic retinopathy
            <br />
            <span>became visible to medicine.</span>
          </h2>
        </div>

        <div className="timeline">

          <div className="timeline-item">
            <span>1850s</span>
            <div>
              <h3>Early retinal observations</h3>
              <p>
                Eduard Jäger documented retinal and macular changes in
                patients with diabetes using the ophthalmoscope.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <span>1870s</span>
            <div>
              <h3>Pathological evidence</h3>
              <p>
                Researchers including Edward Nettleship and Wilhelm Manz
                contributed important descriptions of diabetes-related
                retinal changes.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <span>20th century</span>
            <div>
              <h3>Retinal vascular research</h3>
              <p>
                Research increasingly established diabetic retinopathy
                as a vascular complication of diabetes.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <span>Today</span>
            <div>
              <h3>Digital retinal screening</h3>
              <p>
                Retinal photography, machine learning and AI-assisted
                screening are being explored to support earlier detection.
              </p>
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          SCREENING
      ===================================================== */}

      <section className="about-section screening-section">

        <div className="about-section-heading centered">
          <span className="about-label">09 — SCREENING</span>

          <h2>
            From eye examination
            <br />
            <span>to AI-assisted screening.</span>
          </h2>
        </div>

        <div className="screening-flow">

          <div>
            <span>01</span>
            <h3>Retinal image</h3>
            <p>
              A suitable fundus image is captured.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>Image analysis</h3>
            <p>
              Retinal features are processed using computational methods.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>AI screening</h3>
            <p>
              DIAIRIS generates a screening result and confidence value.
            </p>
          </div>

          <div>
            <span>04</span>
            <h3>Clinical review</h3>
            <p>
              Results should be interpreted by an appropriate healthcare
              professional.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          TREATMENT
      ===================================================== */}

      <section className="about-section treatment-section">

        <div className="about-section-heading">
          <span className="about-label">10 — TREATMENT</span>

          <h2>
            Treatment depends on
            <br />
            <span>the stage and condition.</span>
          </h2>

          <p>
            DIAIRIS does not prescribe medication. Treatment decisions
            belong to qualified healthcare professionals.
          </p>
        </div>

        <div className="treatment-grid">

          <div className="treatment-card">
            <span>01</span>
            <h3>Monitoring</h3>
            <p>
              Early disease may be monitored with regular eye examinations
              and diabetes management.
            </p>
          </div>

          <div className="treatment-card">
            <span>02</span>
            <h3>Anti-VEGF medicines</h3>
            <p>
              Anti-VEGF injections may be used for certain retinal
              conditions, including diabetic macular edema.
            </p>
          </div>

          <div className="treatment-card">
            <span>03</span>
            <h3>Laser treatment</h3>
            <p>
              Laser treatment may be recommended for specific forms of
              advanced retinal disease.
            </p>
          </div>

          <div className="treatment-card">
            <span>04</span>
            <h3>Surgery</h3>
            <p>
              Some advanced complications may require surgical treatment.
            </p>
          </div>

        </div>

        <div className="treatment-warning">
          <strong>Medication safety</strong>
          <p>
            Medicines and procedures can have risks, contraindications and
            side effects. Treatment must be selected and monitored by a
            qualified clinician.
          </p>
        </div>

      </section>


      {/* =====================================================
          PROBLEM → SOLUTION
      ===================================================== */}

      <section className="about-section solution-section">

        <div className="about-section-heading centered">
          <span className="about-label">11 — THE DIAIRIS APPROACH</span>

          <h2>
            From screening challenge
            <br />
            <span>to proposed solution.</span>
          </h2>
        </div>

        <div className="solution-grid">

          <div className="problem-panel">
            <span>THE CHALLENGE</span>

            <h3>Why screening needs support</h3>

            <ul>
              <li>Early disease may have few noticeable symptoms.</li>
              <li>Retinal screening requires appropriate imaging.</li>
              <li>Specialist access may not always be immediate.</li>
              <li>Manual assessment can require significant expertise.</li>
              <li>Patients may not understand technical results easily.</li>
            </ul>
          </div>

          <div className="solution-panel">
            <span>OUR PROPOSED SOLUTION</span>

            <h3>DIAIRIS</h3>

            <ul>
              <li>Upload a retinal fundus image.</li>
              <li>Process the image using a trained ML model.</li>
              <li>Generate an AI-assisted screening result.</li>
              <li>Display confidence and visual explanation when available.</li>
              <li>Store screening history for the authenticated patient.</li>
              <li>Provide a structured report for review.</li>
            </ul>
          </div>

        </div>

      </section>


      {/* =====================================================
          WHY DIAIRIS
      ===================================================== */}

      <section className="about-section why-diairis">

        <div className="about-section-heading centered">
          <span className="about-label">12 — WHY DIAIRIS</span>

          <h2>
            Built around
            <br />
            <span>understandable screening.</span>
          </h2>
        </div>

        <div className="diairis-feature-grid">

          <div>
            <strong>AI</strong>
            <h3>AI-assisted analysis</h3>
            <p>
              Machine learning is used to analyze retinal images as part
              of a screening workflow.
            </p>
          </div>

          <div>
            <strong>XAI</strong>
            <h3>Explainable results</h3>
            <p>
              Visual explanations can help users understand where the model
              is focusing its attention.
            </p>
          </div>

          <div>
            <strong>HIS</strong>
            <h3>Screening history</h3>
            <p>
              Authenticated users can review their previous screening
              records.
            </p>
          </div>

          <div>
            <strong>CARE</strong>
            <h3>Patient-centered workflow</h3>
            <p>
              Screening, reports, appointments and medication reminders
              are brought into one platform.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          EXTERNAL RESOURCES
      ===================================================== */}

      <section className="about-section resources-section">

        <div className="about-section-heading centered">
          <span className="about-label">13 — EXPLORE MORE</span>

          <h2>
            Reliable sources for
            <br />
            <span>further reading.</span>
          </h2>
        </div>

        <div className="resource-grid">

          <a
            href="https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/diabetic-retinopathy"
            target="_blank"
            rel="noreferrer"
          >
            <span>NEI</span>
            <h3>Diabetic Retinopathy</h3>
            <p>
              Disease information, prevention and treatment guidance.
            </p>
            <strong>Explore →</strong>
          </a>

          <a
            href="https://www.who.int/news-room/fact-sheets/detail/diabetes"
            target="_blank"
            rel="noreferrer"
          >
            <span>WHO</span>
            <h3>Diabetes</h3>
            <p>
              Global information about diabetes, prevention and management.
            </p>
            <strong>Explore →</strong>
          </a>

          <a
            href="https://pubmed.ncbi.nlm.nih.gov/15487691/"
            target="_blank"
            rel="noreferrer"
          >
            <span>PUBMED</span>
            <h3>History of DR</h3>
            <p>
              Published historical research on diabetic retinopathy.
            </p>
            <strong>Explore →</strong>
          </a>

        </div>

      </section>


      {/* =====================================================
          DISCLAIMER
      ===================================================== */}

      <section className="about-disclaimer">

        <span>MEDICAL INFORMATION</span>

        <h3>
          DIAIRIS is a screening support system, not a diagnostic tool.
        </h3>

        <p>
          DIAIRIS does not replace an ophthalmologist, physician or
          qualified healthcare professional. AI-generated screening results
          should be interpreted together with appropriate clinical
          examination and medical history.
        </p>

      </section>

    </main>
  )
}

export default About