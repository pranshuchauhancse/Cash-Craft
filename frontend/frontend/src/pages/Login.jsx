import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('Please fill in both fields to continue.');
      return;
    }

    // Call backend login endpoint
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Login failed');
        }
        // Save tokens and inform parent
        if (data.data && data.data.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
        }
        if (data.data && data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        const user = data.data ? data.data.user : { email };
        onLogin(user);
        navigate('/');
      })
      .catch((err) => {
        alert(err.message || 'Login error');
      });
  };

  return (
    <div className="auth-page">
      <form className="card auth" onSubmit={handleLogin}>
        <h2 className="title">Welcome Back 👋</h2>
        <p className="muted small">Log in to continue managing your finances effortlessly</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" className="btn-primary">Login</button>

        <p className="muted small">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
