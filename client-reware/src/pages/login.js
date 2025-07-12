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
      console.log('Attempting unified login with:', form);
      
      // Determine if input is email or username
      const isEmail = form.usernameOrEmail.includes('@');
      const loginData = {
        password: form.password,
        ...(isEmail ? { email: form.usernameOrEmail } : { username: form.usernameOrEmail })
      };

      console.log('Login data being sent:', loginData);
      
      // Use unified login endpoint
      const response = await authService.login(loginData);
      
      if (response.success) {
        console.log('Login successful:', response);
        console.log('Response userType:', response.userType);
        console.log('Response redirectTo:', response.redirectTo);
        
        // Store token and user data consistently
        localStorage.setItem('token', response.token);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', response.userType);
        
        // Set admin flag if admin login
        if (response.userType === 'admin') {
          localStorage.setItem('isAdmin', 'true');
          console.log('Set isAdmin flag to true');
        } else {
          localStorage.removeItem('isAdmin');
          console.log('Removed isAdmin flag');
        }
        
        // Verify localStorage data
        console.log('Stored localStorage data:', {
          token: !!localStorage.getItem('token'),
          userType: localStorage.getItem('userType'),
          isAdmin: localStorage.getItem('isAdmin'),
          user: JSON.parse(localStorage.getItem('user') || '{}')
        });
        
        // Redirect based on response redirectTo or user role
        const redirectPath = response.redirectTo || 
          (response.userType === 'admin' ? '/admin' : '/dashboard');
        
        console.log(`Redirecting ${response.userType} to:`, redirectPath);
        
        // Force a small delay to ensure localStorage is set
        setTimeout(() => {
          navigate(redirectPath);
        }, 100);
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
