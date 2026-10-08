import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api'
import { useAuth } from '../AuthContext'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!phone.trim()) {
      setError('Please enter your WhatsApp number')
      return
    }

    setLoading(true)

    try {
      const data = await signup(
        name,
        email,
        password,
        phone,
        'patient'
      )

      loginUser(data.token, data.user)
      navigate('/detection')
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Sign up to start screening
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <label>Full Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>WhatsApp Number</label>

        <input
          type="tel"
          placeholder="91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <small className="auth-hint">
          Enter your WhatsApp number with country code
        </small>

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>

      </form>
    </div>
  )
}

export default Signup