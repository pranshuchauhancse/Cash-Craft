import React, { useEffect, useState } from 'react';

export default function Budget() {
  const [budget, setBudget] = useState(() =>
    parseFloat(localStorage.getItem('cc_budget')) || 0
  );
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('cc_budget', budget);
  }, [budget]);

  const handleSave = (event) => {
    event.preventDefault();
    const value = parseFloat(input);
    if (!isNaN(value)) setBudget(value);
    setInput('');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your budget?')) {
      setBudget(0);
      localStorage.removeItem('cc_budget');
    }
  };

  const expenses = JSON.parse(localStorage.getItem('cc_expenses') || '[]');
  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget - spent;

  const percentage =
    budget > 0
      ? Math.max(0, Math.min(100, Math.round((spent / budget) * 100)))
      : 0;

  return (
    <div className="page">
      <h2>Budget Planner</h2>

      <div className="grid-2">
        <div className="card">
          <h4>Set Monthly Budget</h4>
          <form className="form-inline" onSubmit={handleSave}>
            <input
              type="number"
              placeholder="Monthly budget"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Save</button>
            <button type="button" className="btn-del" onClick={handleClear}>
              Clear Budget
            </button>
          </form>
        </div>

        <div className="card">
          <h4>Overview</h4>
          <p>Budget: ₹{budget.toFixed(2)}</p>
          <p>Spent: ₹{spent.toFixed(2)}</p>
          <p>Remaining: ₹{remaining.toFixed(2)}</p>

          <div className="progress small">
            <div
              style={{
                width: `${percentage}%`,
                backgroundColor: spent > budget ? 'red' : 'green',
                height: '8px',
                borderRadius: '4px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {spent === budget && budget > 0 && (
            <p className="warning">You’ve reached your budget limit — no balance left!</p>
          )}

          {spent > budget && (
            <p className="warning" style={{ color: 'red' }}>
              You’ve crossed your budget limit!
            </p>
          )}

          {remaining <= budget * 0.2 && remaining > 0 && (
            <p className="warning">You’re close to exceeding your budget limit!</p>
          )}
        </div>
      </div>
    </div>
  );
}
