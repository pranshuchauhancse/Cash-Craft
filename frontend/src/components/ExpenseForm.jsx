import React, { useState } from 'react';
import { categories } from '../utils/dummyData';

export default function ExpenseForm({ onAdd }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !amount) {
      setError('Please fill in both the expense name and amount.');
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: name.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().slice(0, 10),
    };

    onAdd(newExpense);
    setName('');
    setAmount('');
    setCategory(categories[0]);
    setError('');
  };

  return (
    <form
      className="card form-inline"
      onSubmit={handleSubmit}
      aria-label="Add Expense Form"
    >
      <input
        aria-label="Expense Name"
        placeholder="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        aria-label="Expense Amount"
        placeholder="Amount"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        aria-label="Expense Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button type="submit">Add</button>

      {error && <p style={{ color: 'red', marginTop: 5 }}>{error}</p>}
    </form>
  );
}
