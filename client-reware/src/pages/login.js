// client/src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center"
      >
        {/* Logo at the top */}
        <img
          src="/logo.png"
          alt="ReWear Logo"
          className="w-20 h-20 mb-6"
        />

        <h2 className="text-xl font-semibold mb-6 text-gray-700">Login to ReWear</h2>

        {/* Username */}
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
