// client/src/App.jsx

import { Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup'; // optional
// import Dashboard from './pages/Dashboard'; // after login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Add more routes like home, item page, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
