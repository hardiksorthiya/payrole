import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import '../css/Login.css'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData)
      // Here you would make an actual API call
      setLoading(false)
      // Navigate to dashboard on successful login (dummy for now)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="sorath-login-page">
      <Container className="sorath-login-container">
        <div className="sorath-login-wrapper">
          {/* Logo */}
          <div className="sorath-logo-container">
            <div className="sorath-logo">
              <i className="bi bi-wallet2"></i>
            </div>
            <h1 className="sorath-logo-text">Payroll System</h1>
          </div>

          {/* Login Card */}
            <div className="sorath-login-card">
              <Card.Body className="p-4">
              <div className="text-center mb-3">
                <h2 className="sorath-login-title">Welcome Back</h2>
                <p className="sorath-login-subtitle">Sign in to your account</p>
              </div>

                {error && (
                  <Alert variant="danger" className="sorath-alert-danger mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="sorath-form-label">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="sorath-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="sorath-form-label">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="sorath-form-control"
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me"
                      className="sorath-form-check-input"
                    />
                    <a href="#" className="sorath-forgot-password-link">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="sorath-btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="sorath-signup-text">
                    Don't have an account?{' '}
                    <a href="#" className="sorath-signup-link">
                      Sign up
                    </a>
                  </p>
                </div>
              </Card.Body>
            </div>
          </div>
        </Container>
      </div>
  )
}

export default Login

