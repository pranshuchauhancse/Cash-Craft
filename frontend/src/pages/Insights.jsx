import React from 'react';
import InsightsCard from '../components/InsightsCard';

export default function Insights() {
  // Retrieve expenses from localStorage
  const expenses = JSON.parse(localStorage.getItem('cc_expenses') || '[]');

  // Calculate totals
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const food = expenses
    .filter((e) => e.category === 'Food')
    .reduce((sum, item) => sum + item.amount, 0);
  const foodPct = total ? Math.round((food / total) * 100) : 0;

  
  return (
    <div className="page">
      <h2>Insights</h2>

      <div className="grid-3">
        {/* Spending Snapshot Card */}
        <InsightsCard title="Spending Snapshot">
          <p>Total spent: ${total.toFixed(2)}</p>
          <p>
            Food: ${food.toFixed(2)} ({foodPct}%)
          </p>
        </InsightsCard>

        {/* Recommendation Card */}
        <InsightsCard title="Recommendation">
          <p>
            {foodPct > 30
              ? 'Your food spending is high. Consider meal prepping.'
              : 'Food spending looks fine.'}
          </p>
        </InsightsCard>

        {/* Motivation Card */}
        <InsightsCard title="Motivation">
          <p>Small habits: Save ₹50 a day = ₹1500 a month. Start small!</p>
        </InsightsCard>
      </div>
    </div>
  );
}
