import React from 'react';

export default function InsightsCard({ title, children }) {
  return (
    <div className="card insights">
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}
