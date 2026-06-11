'use client';

import React, { useEffect, useState } from 'react';
import './themeToggle.css';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read from DOM (already set by the anti-flash script in layout.tsx)
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <label htmlFor="theme-toggle" className="theme" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <span className="theme__toggle-wrap">
        <input
          id="theme-toggle"
          className="theme__toggle"
          type="checkbox"
          role="switch"
          name="theme"
          checked={isDark}
          onChange={toggle}
          aria-label="Toggle dark mode"
        />
        <span className="theme__icon">
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
          <span className="theme__icon-part"></span>
        </span>
      </span>
    </label>
  );
};
