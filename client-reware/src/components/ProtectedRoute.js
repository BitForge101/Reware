import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isTokenExpired = authService.isTokenExpired();

  if (!isAuthenticated || isTokenExpired) {
    // Clear expired token
    if (isTokenExpired) {
      authService.logout();
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
