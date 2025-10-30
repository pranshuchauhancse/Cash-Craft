import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc_dark')) || false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('cc_dark', JSON.stringify(dark));
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <button className="btn-ghost" onClick={toggleTheme}>
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
