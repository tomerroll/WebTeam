import React, { createContext, useState, useEffect } from 'react';

/**
 * Theme Context
 * 
 * A React context that provides theme management functionality across the application.
 * It handles switching between light and dark themes, persists theme preference
 * in localStorage, and applies theme classes to the document root element.
 * This is the main theme context used throughout the application.
 */

export const ThemeContext = createContext();

/**
 * Theme Provider Component
 * 
 * Provides theme context to child components. Manages theme state,
 * localStorage persistence, and DOM class manipulation for dark mode.
 * This provider wraps the entire application to provide theme functionality.
 * 
 * @param {React.ReactNode} children - Child components to wrap with theme context
 * @returns {JSX.Element} - Theme context provider
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or default to light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Save theme to localStorage and update DOM classes when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 