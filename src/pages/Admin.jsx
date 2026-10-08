import { useState, useEffect } from 'react'
import { getAdminStats } from '../api'

function Admin() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const cardStyle = {
    background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14,
    padding: '24px 20px', textAlign: 'left'
  }

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      <p className="page-subtitle">Overview of system-wide activity</p>

      {loading && <p>Loading...</p>}
      {error && <div className="result-box dr-present">{error}</div>}

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Total Patients</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#22d3ee' }}>{stats.total_patients}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Total Scans</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#22d3ee' }}>{stats.total_scans}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>DR Positive Scans</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#dc2626' }}>{stats.dr_positive_scans}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Total Appointments</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#22d3ee' }}>{stats.total_appointments}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
