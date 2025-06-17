// components/shared/DarkModeToggle.jsx

import React from 'react';

/**
 * DarkModeToggle Component
 * 
 * A simple toggle button component for switching between light and dark themes.
 * Displays the current theme state with appropriate icons and text in Hebrew.
 * Integrates with a settings system to manage theme preferences.
 * 
 * @param {Object} settings - Settings object containing darkMode boolean
 * @param {Function} handleChange - Function to handle setting changes
 * @returns {JSX.Element} - Theme toggle button
 */
const DarkModeToggle = ({ settings, handleChange }) => {
  /**
   * Toggles the dark mode setting
   */
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
