import React, { useState } from 'react';
import './adminLoginInfo.css';

const AdminLoginInfo = () => {
  const [showCredentials, setShowCredentials] = useState(false);

  return (
    <div className="admin-login-info">
      <div className="admin-info-card">
        <h3>🔐 Admin Access Required</h3>
        <p>This is a secure admin panel. Only authorized administrators can access this area.</p>
        
        <button 
          className="show-credentials-btn"
          onClick={() => setShowCredentials(!showCredentials)}
        >
          {showCredentials ? 'Hide' : 'Show'} Admin Credentials
        </button>

        {showCredentials && (
          <div className="credentials-display">
            <h4>🎯 Exact Admin Credentials:</h4>
            <div className="credential-item">
              <label>📧 Email:</label>
              <code>dhava.admin@reware-secure.com</code>
            </div>
            <div className="credential-item">
              <label>👤 Username:</label>
              <code>dhava_reware_admin_2025</code>
            </div>
            <div className="credential-item">
              <label>🔑 Password:</label>
              <code>ReWare#Admin$2025!Secure</code>
            </div>
            <div className="security-note">
              <p>⚠️ These are the ONLY credentials that will grant admin access.</p>
              <p>🛡️ Regular user accounts cannot access the admin panel.</p>
            </div>
          </div>
        )}

        <div className="access-instructions">
          <h4>📋 Access Instructions:</h4>
          <ol>
            <li>Use the exact credentials shown above</li>
            <li>Login will automatically redirect to admin panel</li>
            <li>Only these specific credentials will work</li>
            <li>Admin panel URL: <code>/admin</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginInfo;
