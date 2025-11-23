import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/expenses">Expenses</NavLink>
        <NavLink to="/budget">Budget</NavLink>
        <NavLink to="/goals">Goals</NavLink>
        <NavLink to="/insights">Insights</NavLink>
      </nav>
    </aside>
  );
}
