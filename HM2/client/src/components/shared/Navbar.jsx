import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { fetchStudentById } from '../../services/studentService';

const Navbar = ({ userType }) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [studentData, setStudentData] = useState(null);

  // Fetch student data on mount and when userType changes
  useEffect(() => {
    if (userType === 'student') {
      const loadStudentData = async () => {
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user._id) {
            const data = await fetchStudentById(user._id);
            setStudentData(data);
          }
        } catch (err) {
          console.error('Error loading student data:', err);
        }
      };
      loadStudentData();
    }
  }, [userType]);

  // Listen for localStorage changes (other tabs)
  useEffect(() => {
    const handleStorage = (e) => {
      if (userType === 'student' && (e.key === 'user' || e.key === 'token')) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user._id) {
          fetchStudentById(user._id).then(setStudentData);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [userType]);

  // Listen for custom point/crown updates (same tab)
  useEffect(() => {
    const handlePointsUpdate = (e) => {
      setStudentData(prev => ({
        ...prev,
        points: e.detail.points
      }));
    };

    const handleCrownsUpdate = (e) => {
      setStudentData(prev => ({
        ...prev,
        crowns: e.detail.crowns
      }));
    };

    window.addEventListener('pointsUpdated', handlePointsUpdate);
    window.addEventListener('crownsUpdated', handleCrownsUpdate);

    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdate);
      window.removeEventListener('crownsUpdated', handleCrownsUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (userType === 'student') {
      navigate('/student-dashboard');
    } else if (userType === 'teacher') {
      navigate('/teacher-dashboard');
    }
  };

  return (
    <nav className={`w-full px-6 py-4 shadow-lg transition-colors duration-300 fixed top-0 z-50 ${
      isDarkMode 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-row-reverse">
        {/* Right side: Logout, Dark Mode Toggle, Coins/Crowns */}
        <div className="flex items-center gap-4 flex-row-reverse">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            התנתק
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-300 border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow hover:scale-110"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" fill="#FBBF24" />
                <g stroke="#FBBF24" strokeWidth="2">
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                </g>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="#FBBF24" />
              </svg>
            )}
          </button>

          {/* Student Stats */}
          {userType === 'student' && studentData && (
            <div className="flex items-center gap-4 mr-2">
              <span className="flex items-center gap-1 text-yellow-600 font-bold text-lg align-middle">
                {studentData.crowns || 0} <span role="img" aria-label="crowns" className="text-xl align-middle">👑</span>
              </span>
              <span className="flex items-center gap-1 text-yellow-500 font-bold text-lg align-middle">
                {studentData.points || 0} <span role="img" aria-label="coins" className="text-lg align-middle">🪙</span>
              </span>
            </div>
          )}
        </div>
        {/* Logo */}
        <div 
          onClick={handleLogoClick}
          className="text-xl font-bold text-primary-600 cursor-pointer transition-all duration-300 hover:text-white hover:bg-primary-600 hover:shadow-lg hover:px-3 hover:rounded-full"
        >
          MathDuo 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
