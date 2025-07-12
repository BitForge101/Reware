// client/src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login check
    if (form.username === 'admin' && form.password === 'admin123') {
      // Save dummy token or flag
      localStorage.setItem('isLoggedIn', true);
      navigate('/dashboard'); // redirect after login
    } else {
      setError('Invalid username or password');
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

        {/* Username */}
        <div className="form-group">
          <label className="form-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
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
          className="submit-button"
        >
          Sign In
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
