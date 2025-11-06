import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onLogout }) {
  return (
    <header className="navbar-top">
      <div className="brand">Cash Craft</div>
      <div className="nav-actions">
        <ThemeToggle className="btn-theme" />
        <button className="btn-ghost btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
