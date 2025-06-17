// contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context
 * 
 * A React context that provides theme management functionality across the application.
 * It handles switching between light and dark themes, persists theme preference
 * in localStorage, and provides a custom hook for easy theme access.
 */

const ThemeContext = createContext();

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context with theme state and toggle function
 * @throws {Error} If used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme Provider Component
 * 
 * Provides theme context to child components. Manages theme state,
 * localStorage persistence, and DOM class manipulation for dark mode.
 * 
 * @param {React.ReactNode} children - Child components to wrap with theme context
 * @returns {JSX.Element} - Theme context provider
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    // קריאת הערך הראשוני מ-localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light'; // ברירת מחדל: light mode
  });

  // שמירה ב-localStorage כל פעם שה-theme משתנה
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // הוספה/הסרה של class לגוף הדף (אופציונלי)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Context value object
  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};