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
        <form onSubmit={handleLogin} className="login-form">
          
          {/* Logo and Header */}
          <div className="logo-container">
            <img src={logo} alt="ReWear Logo" className="logo-image" />
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
