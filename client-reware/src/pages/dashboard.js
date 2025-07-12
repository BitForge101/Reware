import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get current user data
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <h1 className="dashboard-title">ReWear Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome back, {user.firstName}!</h2>
          <p className="welcome-subtitle">Ready to explore sustainable fashion?</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Your Points</h3>
            <p className="stat-number">{user.points || 10}</p>
            <p className="stat-description">Reward points earned</p>
          </div>

          <div className="stat-card">
            <h3>Items Listed</h3>
            <p className="stat-number">0</p>
            <p className="stat-description">Clothing items shared</p>
          </div>

          <div className="stat-card">
            <h3>Swaps Made</h3>
            <p className="stat-number">0</p>
            <p className="stat-description">Successful exchanges</p>
          </div>

          <div className="stat-card">
            <h3>Member Since</h3>
            <p className="stat-number">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
            <p className="stat-description">Join date</p>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-button primary">
              <span className="action-icon">👕</span>
              Add Clothing Item
            </button>
            <button className="action-button">
              <span className="action-icon">🔍</span>
              Browse Items
            </button>
            <button className="action-button">
              <span className="action-icon">💱</span>
              View Swaps
            </button>
            <button className="action-button">
              <span className="action-icon">⚙️</span>
              Settings
            </button>
          </div>
        </div>

        <div className="user-info-card">
          <h3>Profile Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name:</label>
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Username:</label>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{user.phoneNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
