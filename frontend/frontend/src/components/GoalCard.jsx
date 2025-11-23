import React from 'react';

export default function GoalCard({ goal }) {
  const progress = Math.min(100, Math.round((goal.saved / goal.target) * 100));

  return (
    <div className="card goal-card">
      <h4>{goal.name}</h4>
      <p>Target: ₹{goal.target.toFixed(2)}</p>
      <p>
        Saved: ₹{goal.saved.toFixed(2)} ({progress}%)
      </p>
      <div className="progress">
        <div style={{ width: `₹{progress}%` }} />
      </div>
    </div>
  );
}
