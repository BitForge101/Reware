import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './login.css';
import logo from '../images/logo.jpg'

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Determine if input is email or username
      const isEmail = form.usernameOrEmail.includes('@');
      const loginData = {
        password: form.password,
        ...(isEmail ? { email: form.usernameOrEmail } : { username: form.usernameOrEmail })
      };

      const response = await authService.login(loginData);

      if (response.success) {
        // Store token and redirect
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleLogin} className="login-form">

          {/* Logo and Header */}
          <div className="logo-container">
            <img src={logo} alt="ReWear Logo" className="logo-image" />
            <h2 className="title">Welcome Back</h2>
            <p className="subtitle">Sign in to your ReWear account</p>
          </div>

          {/* Username/Email */}
          <div className="form-group">
            <label className="form-label">
              Username or Email
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={handleChange}
              placeholder="Enter your username or email"
              className="form-input"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="form-input"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-text">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Signup Link */}
          <div className="signup-link-container">
            <p className="signup-text">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">
                Create one here
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
