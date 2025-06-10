// contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
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

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

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