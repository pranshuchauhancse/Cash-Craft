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
  const removeExpense = (id) => setExpenses((prev) => prev.filter((item) => item.id !== id));

  return (
    <div className="page">
      <h2>Expenses</h2>

      <ExpenseForm onAdd={addExpense} />

      <div className="list">
        {expenses.length === 0 ? (
          <p className="muted">No expenses yet — start tracking now.</p>
        ) : (
          expenses.map((expense) => (
            <div className="card list-item" key={expense.id}>
              <div>
                <strong>{expense.name}</strong>
                <div className="muted">
                  {expense.category} • {expense.date}
                </div>
              </div>

              <div className="row">
                <div className="amount">₹{expense.amount.toFixed(2)}</div>
                <button className="btn-del" onClick={() => removeExpense(expense.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
