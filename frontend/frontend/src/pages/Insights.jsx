import React from 'react';
import InsightsCard from '../components/InsightsCard';

export default function Insights() {
  const expenses = JSON.parse(localStorage.getItem('cc_expenses') || '[]');
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  return (
    <div className="page">
      <h2>Insights</h2>

      <div className="grid-3">
        <InsightsCard title="Spending Snapshot">
          <p><strong>Total Spent:</strong> ₹{total.toFixed(2)}</p>
          {Object.entries(categoryTotals).map(([category, amount]) => {
            const percentage = total ? Math.round((amount / total) * 100) : 0;
            return (
              <p key={category}>
                <strong>{category}:</strong> ₹{amount.toFixed(2)} ({percentage}%)
              </p>
            );
          })}
        </InsightsCard>

        <InsightsCard title="Recommendations">
          {Object.entries(categoryTotals).map(([category, amount]) => {
            const percentage = total ? Math.round((amount / total) * 100) : 0;
            return (
              <p key={category}>
                {percentage > 30
                  ? `Your spending on ${category.toLowerCase()} is quite high. Try to reduce unnecessary costs.`
                  : `Your ${category.toLowerCase()} spending looks well managed.`}
              </p>
            );
          })}
        </InsightsCard>

        <InsightsCard title="Motivation">
          <p>💡 Small savings build big results!</p>
          <p>Saving ₹50 every day = ₹1,500 a month. Stay consistent and watch your budget grow.</p>
        </InsightsCard>
      </div>
    </div>
  );
}
