import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!email || !pass) return alert('Provide email and password');
    const user = { email };
    onSignup(user);
    nav('/');
  };

  return (
    <div className="auth-page">
      <form className="card auth" onSubmit={submit}>
        <h3>Signup</h3>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={pass} onChange={(e)=>setPass(e.target.value)} />
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
