import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = localStorage.getItem('userType');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  console.log('AdminProtectedRoute check:', {
    hasToken: !!token,
    userData: userData,
    userType: userType,
    isAdmin: isAdmin,
    userRole: userData?.role
  });
  
  // Check if user is authenticated
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin role or userType
  const isAuthorizedAdmin = (
    userType === 'admin' ||
    isAdmin ||
    (userData && (userData.role === 'admin' || userData.role === 'superadmin'))
  );
  
  console.log('Admin authorization check:', isAuthorizedAdmin);
  
  if (!isAuthorizedAdmin) {
    console.log('User not authorized as admin, redirecting to dashboard');
    // Redirect unauthorized users to regular dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('Admin access granted');
  return children;
};

export default AdminProtectedRoute;
