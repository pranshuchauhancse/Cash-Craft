import React, { useEffect, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';

export default function Expenses() {
  
  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc_expenses')) || [];
    } catch {
      return [];
    }
  });

  
  useEffect(() => {
    localStorage.setItem('cc_expenses', JSON.stringify(expenses));
  }, [expenses]);

  
  const addExpense = (expense) => setExpenses((prev) => [expense, ...prev]);

  
  const removeExpense = (id) =>
    setExpenses((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="page">
      <h2>Expenses</h2>

      {/* Expense Form */}
      <ExpenseForm onAdd={addExpense} />

      {/* Expenses List */}
      <div className="list">
        {expenses.length === 0 && (
          <p className="muted">No expenses yet — add your first one.</p>
        )}

        {expenses.map((exp) => (
          <div className="card list-item" key={exp.id}>
            <div>
              <strong>{exp.name}</strong>
              <div className="muted">
                {exp.category} • {exp.date}
              </div>
            </div>

            <div className="row">
              <div className="amount">${exp.amount.toFixed(2)}</div>
              <button
                className="btn-del"
                onClick={() => removeExpense(exp.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
