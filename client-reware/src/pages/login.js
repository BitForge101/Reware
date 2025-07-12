// client/src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './login.css';

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

    if (!form.usernameOrEmail || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Prepare login data
      const loginData = {
        password: form.password
      };

      // Check if input is email or username
      const isEmail = form.usernameOrEmail.includes('@');
      if (isEmail) {
        loginData.email = form.usernameOrEmail.trim().toLowerCase();
      } else {
        loginData.username = form.usernameOrEmail.trim();
      }

      // Call API
      const response = await authService.login(loginData);
      
      if (response.success) {
        // Redirect to dashboard or home page
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form
          onSubmit={handleLogin}
          className="login-form"
        >
          {/* Logo and Header */}
          <div className="logo-container">
            <div className="logo-icon">
              <svg className="user-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="title">Welcome Back</h2>
            <p className="subtitle">Sign in to your ReWear account</p>
          </div>

        {/* Username or Email */}
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
          <label className="form-label">
            Password
          </label>
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

        {/* Error message */}
        {error && <p className="error-text">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`submit-button ${isLoading ? 'loading' : ''}`}
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
