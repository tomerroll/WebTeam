// components/shared/DarkModeToggle.jsx

import React from 'react';

const DarkModeToggle = ({ settings, handleChange }) => {
  const toggleDarkMode = () => {
    handleChange('darkMode', !settings.darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      מצב {settings.darkMode ? 'אור ☀️' : 'לילה 🌙'}
    </button>
  );
};

export default DarkModeToggle;
