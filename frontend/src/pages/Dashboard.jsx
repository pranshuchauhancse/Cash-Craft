import React, { useEffect, useState } from 'react';
import { sampleExpenses, categories } from '../utils/dummyData';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import InsightsCard from '../components/InsightsCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a28', '#888'];

export default function Dashboard() {
  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc_expenses')) || sampleExpenses;
    } catch {
      return sampleExpenses;
    }
  });

  useEffect(() => {
    localStorage.setItem('cc_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const byCategory = categories
    .map((category) => {
      const total = expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return { name: category, value: total };
    })
    .filter((item) => item.value > 0);

  const trend = [
    { month: 'Aug', amt: 0 },
    { month: 'Sep', amt: 0 },
    { month: 'Oct', amt: 0 },
    { month: 'Nov', amt: expenses.reduce((sum, expense) => sum + expense.amount, 0) },
  ];

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const topCategory = byCategory.sort((a, b) => b.value - a.value)[0]?.name || '—';
  const activeGoals = JSON.parse(localStorage.getItem('cc_goals') || '[]').length;

  return (
    <div className="page">
      <h2>Overview</h2>

      <div className="grid-3">
        <div className="card">
          <h3>Total Spent</h3>
          <p className="big">₹{totalSpent.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Top Category</h3>
          <p className="big">{topCategory}</p>
        </div>

        <div className="card">
          <h3>Active Goals</h3>
          <p className="big">{activeGoals}</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card chart-wrap">
          <h4>Spending by Category</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {byCategory.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-wrap">
          <h4>Monthly Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amt" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <InsightsCard title="Quick Tip">
        <p>
          If food spending is high, try cooking three times a week — small changes make a big
          difference over time.
        </p>
      </InsightsCard>
    </div>
  );
}
