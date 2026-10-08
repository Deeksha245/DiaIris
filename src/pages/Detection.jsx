
import { useState, useRef } from 'react'
import { predict } from '../api'

function Detection() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef(null)

  const processFile = (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB.')
      return
    }

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError('')
  }

  const handleFileChange = (e) => {
    processFile(e.target.files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first.')
      return
    }

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const data = await predict(selectedFile)
      setResult(data)
    } catch (err) {
      setError(
        err.message ||
        'Prediction failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError('')
    setIsDragging(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isDR = result?.result === 'DR_present'

  const rawConfidence =
    result?.confidence !== undefined
      ? Number(result.confidence)
      : 0

  const confidence =
    rawConfidence <= 1
      ? rawConfidence * 100
      : rawConfidence

  const safeConfidence = Math.min(
    Math.max(confidence, 0),
    100
  )

  const getRiskLevel = () => {
    if (!result) return ''

    if (!isDR) return 'Low Risk'

    if (confidence >= 85) {
      return 'High Risk'
    }

    if (confidence >= 60) {
      return 'Moderate Risk'
    }

    return 'Needs Review'
  }

  const getRecommendation = () => {
    if (!result) return ''

    if (!isDR) {
      return 'The screening model did not detect signs associated with diabetic retinopathy. Continue regular eye and diabetes-related check-ups as recommended by your healthcare professional.'
    }

    return 'The screening model detected patterns that may be associated with diabetic retinopathy. Please consult a qualified ophthalmologist for professional examination and confirmation.'
  }

  return (
    <div className="screening-page">

      {/* PAGE HEADER */}
      <section className="screening-header">

        <div>

          <div className="screening-badge">
            <span></span>
            AI-POWERED SCREENING
          </div>

          <h1>
            Diabetic Retinopathy
            <span> Screening</span>
          </h1>

          <p>
            Upload a retinal fundus image and
            DIAIRIS will analyze it using an
            AI-based screening model.
          </p>

        </div>

        <div className="screening-header-info">
          <strong>AI SCREENING</strong>
          <span>Image analysis system</span>
        </div>

      </section>


      {/* MAIN CONTENT */}
      <section className="screening-layout">

        {/* LEFT — UPLOAD */}
        <div className="screening-card upload-card">

          <div className="card-heading">

            <div>
              <span>STEP 01</span>

              <h2>
                Upload Retinal Image
              </h2>

              <p>
                Select a clear retinal fundus
                image for analysis.
              </p>
            </div>

            <div className="step-number">
              01
            </div>

          </div>


          {/* DROPZONE */}
          <div
            className={`screening-dropzone ${
              isDragging ? 'dragging' : ''
            } ${
              preview ? 'has-preview' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!preview) {
                fileInputRef.current?.click()
              }
            }}
          >

            {preview ? (

              <div className="preview-container">

                <img
                  src={preview}
                  alt="Selected retinal image"
                  className="screening-preview"
                />

                <div className="preview-overlay">

                  <div>
                    <strong>
                      Image selected
                    </strong>

                    <span>
                      {selectedFile?.name}
                    </span>
                  </div>

                  <span className="preview-check">
                    ✓
                  </span>

                </div>

              </div>

            ) : (

              <div className="upload-placeholder">

                <div className="upload-circle">
                  ↑
                </div>

                <h3>
                  Drop retinal image here
                </h3>

                <p>
                  or click to browse from your
                  computer
                </p>

                <small>
                  JPG, JPEG or PNG · Maximum 10MB
                </small>

              </div>

            )}

          </div>


          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
            hidden
          />


          {/* ACTIONS */}
          <div className="screening-buttons">

            <button
              className="secondary-btn"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              Choose Image
            </button>

            <button
              className="primary-btn"
              onClick={handlePredict}
              disabled={!selectedFile || loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Image
                  <span>→</span>
                </>
              )}

            </button>

            {(preview || result) && (
              <button
                className="reset-screening-btn"
                onClick={handleReset}
              >
                Reset
              </button>
            )}

          </div>


          {/* ANALYSIS STATUS */}
          {loading && (

            <div className="analysis-status">

              <div className="analysis-spinner"></div>

              <div>
                <strong>
                  AI analysis in progress
                </strong>

                <p>
                  Processing the retinal image
                  and generating your screening
                  result...
                </p>
              </div>

            </div>

          )}


          {/* ERROR */}
          {error && (

            <div className="screening-error">

              <strong>
                Analysis Error
              </strong>

              <p>
                {error}
              </p>

            </div>

          )}

        </div>


        {/* RIGHT — RESULT */}
        <div className="result-panel">

          {!result && !loading && (

            <div className="result-empty">

              <div className="result-icon">
                AI
              </div>

              <span className="result-empty-label">
                STEP 02 · AI ANALYSIS
              </span>

              <h2>
                Your result will appear here
              </h2>

              <p>
                Upload a retinal image and start
                the analysis to see the screening
                result, confidence and AI attention
                map.
              </p>


              <div className="result-steps">

                <div>
                  <span>01</span>
                  <p>Upload</p>
                </div>

                <div>
                  <span>02</span>
                  <p>Analyze</p>
                </div>

                <div>
                  <span>03</span>
                  <p>Review</p>
                </div>

              </div>

            </div>

          )}


          {/* LOADING */}
          {loading && (

            <div className="result-analyzing">

              <div className="ai-loader">

                <div className="ai-loader-ring"></div>

                <span>
                  AI
                </span>

              </div>

              <span>
                ANALYZING RETINAL IMAGE
              </span>

              <h2>
                Please wait...
              </h2>

              <p>
                DIAIRIS is processing the selected
                image.
              </p>

            </div>

          )}


          {/* RESULT */}
          {result && !loading && (

            <div className="result-content">

              {/* RESULT HEADER */}
              <div className="result-top">

                <div>

                  <span className="result-label">
                    SCREENING RESULT
                  </span>

                  <h2>
                    {isDR
                      ? 'Signs Detected'
                      : 'No Signs Detected'}
                  </h2>

                  <p>
                    {isDR
                      ? 'The model detected patterns associated with diabetic retinopathy.'
                      : 'The model did not detect patterns associated with diabetic retinopathy.'}
                  </p>

                </div>

                <div
                  className={`result-status ${
                    isDR
                      ? 'status-warning'
                      : 'status-safe'
                  }`}
                >
                  {isDR
                    ? 'Review Required'
                    : 'Screening Clear'}
                </div>

              </div>


              {/* RESULT STATS */}
              <div className="result-stats">

                <div className="result-stat-card">

                  <span>
                    PREDICTION
                  </span>

                  <strong>
                    {isDR
                      ? 'DR Present'
                      : 'No DR'}
                  </strong>

                </div>


                <div className="result-stat-card">

                  <span>
                    CONFIDENCE
                  </span>

                  <strong>
                    {safeConfidence.toFixed(1)}%
                  </strong>

                </div>


                <div className="result-stat-card">

                  <span>
                    RISK LEVEL
                  </span>

                  <strong>
                    {getRiskLevel()}
                  </strong>

                </div>

              </div>


              {/* CONFIDENCE */}
              <div className="confidence-section">

                <div className="section-title-row">

                  <div>
                    <span>
                      MODEL METRIC
                    </span>

                    <h3>
                      Model Confidence
                    </h3>
                  </div>

                  <strong>
                    {safeConfidence.toFixed(1)}%
                  </strong>

                </div>


                <div className="confidence-track">

                  <div
                    className={`confidence-fill ${
                      isDR
                        ? 'confidence-warning'
                        : 'confidence-safe'
                    }`}
                    style={{
                      width: `${safeConfidence}%`
                    }}
                  />

                </div>


                <p>
                  This percentage represents how
                  strongly the model supports its
                  predicted screening category.
                </p>

              </div>


              {/* RECOMMENDATION */}
              <div className="recommendation-card">

                <div className="recommendation-icon">
                  ✓
                </div>

                <div>

                  <span>
                    RECOMMENDED NEXT STEP
                  </span>

                  <h3>
                    What you should do
                  </h3>

                  <p>
                    {getRecommendation()}
                  </p>

                </div>

              </div>


              {/* HEATMAP */}
              {result.heatmap && (

                <div className="heatmap-section">

                  <div className="section-title-row">

                    <div>

                      <span>
                        EXPLAINABLE AI
                      </span>

                      <h3>
                        AI Attention Map
                      </h3>

                      <p>
                        Areas highlighted by the
                        model during prediction.
                      </p>

                    </div>

                  </div>


                  <div className="heatmap-container">

                    <img
                      src={result.heatmap}
                      alt="AI attention heatmap"
                      className="heatmap-image"
                    />

                  </div>


                  <small className="heatmap-note">
                    The attention map provides
                    visual insight into the model's
                    prediction and should not be
                    interpreted as a clinical
                    diagnostic image.
                  </small>

                </div>

              )}


              {/* DISCLAIMER */}
              <div className="medical-disclaimer">

                <strong>
                  Important
                </strong>

                <p>
                  DIAIRIS provides preliminary
                  AI-based screening information.
                  This result is not a medical
                  diagnosis and should not replace
                  examination by a qualified
                  healthcare professional.
                </p>

              </div>


              {/* NEW SCREENING */}
              <button
                className="new-screening-btn"
                onClick={handleReset}
              >
                Start New Screening →
              </button>

            </div>

          )}

        </div>

      </section>

    </div>
  )
}

export default Detection

