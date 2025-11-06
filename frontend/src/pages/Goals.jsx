import React, { useEffect, useState } from 'react';
import GoalCard from '../components/GoalCard';

export default function Goals() {
  const [goals, setGoals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc_goals')) || [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  useEffect(() => {
    localStorage.setItem('cc_goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!name || !target) return;

    const newGoal = {
      id: Date.now(),
      name,
      target: parseFloat(target),
      saved: 0,
    };

    setGoals([newGoal, ...goals]);
    setName('');
    setTarget('');
  };

  const handleResetGoals = () => {
    if (window.confirm('Reset all goals? This action cannot be undone.')) {
      setGoals([]);
      localStorage.removeItem('cc_goals');
    }
  };

  return (
    <div className="page">
      <h2>Goals</h2>

      <form className="card form-inline" onSubmit={handleAddGoal}>
        <input
          placeholder="Goal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Target amount"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <button type="submit">Add Goal</button>
        <button type="button" onClick={handleResetGoals} className="btn-del">
          Reset
        </button>
      </form>

      <div className="grid-2">
        {goals.length === 0 ? (
          <p className="muted">No goals yet — start planning your savings.</p>
        ) : (
          goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
        )}
      </div>
    </div>
  );
}
