// client/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/adminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      {/* Add more protected routes here */}
    </Routes>
  );
}

export default App;
