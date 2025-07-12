// client/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
<<<<<<< Updated upstream
      <Route path="/dashboard" element={<Dashboard />} />
      <Route 
        path="/userDashboard" 
        element={
            <UserDashboard />
          // <ProtectedRoute>
          // </ProtectedRoute>
        } 
      />
      {/* Add more routes here */}
=======
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      {/* Add more protected routes here */}
>>>>>>> Stashed changes
    </Routes>
  );
}

export default App;
