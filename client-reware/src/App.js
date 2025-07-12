// client/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
// import Dashboard from './pages/Dashboard'; // after login

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* Add more routes like home, item page, etc. */}
    </Routes>
  );
}

export default App;
