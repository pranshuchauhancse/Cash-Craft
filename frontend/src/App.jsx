import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Global Styles
import './styles/main.css';

export default function App() {
  // Get user data from localStorage (if available)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc_user')) || null;
    } catch {
      return null;
    }
  });

  // Store user data whenever it changes
  useEffect(() => {
    localStorage.setItem('cc_user', JSON.stringify(user));
  }, [user]);

  // If user not logged in, show login/signup pages
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup onSignup={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // Main app layout after login
  return (
    <Router>
      <div className="app-shell">
        {/* Navbar with logout option */}
        <Navbar onLogout={() => setUser(null)} />

        <div className="main-area">
          {/* Sidebar navigation */}
          <Sidebar />

          {/* Page content area */}
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
