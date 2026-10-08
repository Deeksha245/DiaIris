import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:8001'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_BASE}/api/forgot-password?email=${encodeURIComponent(
          email
        )}&new_password=${encodeURIComponent(newPassword)}`,
        {
          method: 'POST'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to reset password'
        )
      }

      setSuccess('Password reset successfully. Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">

      <form
        className="auth-box"
        onSubmit={handleSubmit}
      >

        <h1>Forgot Password?</h1>

        <p className="auth-subtitle">
          Reset your DIAIRIS account password
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          required
        />

        <label>New Password</label>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          minLength={6}
          required
        />

        <label>Confirm Password</label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <p className="auth-switch">
          Remember your password?{' '}
          <Link to="/login">
            Back to Login
          </Link>
        </p>

      </form>

    </div>
  )
}

export default ForgotPassword