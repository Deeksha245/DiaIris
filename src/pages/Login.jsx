import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)

      loginUser(data.token, data.user)

      navigate('/detection')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Log in to continue your screening
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <div className="forgot-password-row">
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup">Sign up</Link>
        </p>

      </form>
    </div>
  )
}

export default Login