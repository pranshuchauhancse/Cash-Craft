import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('Please fill in both fields to continue.');
      return;
    }

    // Call backend register endpoint
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: email.split('@')[0], email, password }),
      credentials: 'include'
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Signup failed');
        }
        if (data.data && data.data.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
        }
        if (data.data && data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        const user = data.data ? data.data.user : { email };
        onSignup(user);
        navigate('/');
      })
      .catch((err) => {
        alert(err.message || 'Signup error');
      });
  };

  return (
    <div className="auth-page">
      <form className="card auth" onSubmit={handleSignup}>
        <h2 className="title">Create Your Account ✨</h2>
        <p className="muted small">Join and take control of your spending journey</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Choose a secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <button type="submit" className="btn-primary">Sign Up</button>

        <p className="muted small">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}
