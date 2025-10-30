import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const nav = useNavigate();

  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !pass) {
      alert('Please enter both email and password');
      return;
    }

    const user = { email };
    onLogin(user);
    nav('/');
  };

  return (
    <div className="auth-page">
      <form className="card auth" onSubmit={handleSubmit}>
        <h3>Login</h3>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button type="submit">Login</button>

        <p className="muted">
          No account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
