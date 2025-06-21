import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { fetchStudentById } from '../../services/studentService';
import logo from '../../assets/logo.png';

/**
 * Navbar Component
 * 
 * A navigation bar component that displays at the top of the application.
 * It includes user authentication status, theme toggle, student statistics (points/crowns),
 * and navigation functionality. The component adapts its display based on user type
 * (student or teacher) and supports dark/light theme switching.
 * 
 * @param {string} userType - The type of user ('student' or 'teacher')
 * @returns {JSX.Element} - Navigation bar with user controls and branding
 */
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

  /**
   * Handles user logout by clearing localStorage and redirecting to login
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  /**
   * Handles logo click navigation based on user type
   */
  const handleLogoClick = () => {
    if (userType === 'student') {
      navigate('/student-dashboard');
    } else if (userType === 'teacher') {
      navigate('/teacher-dashboard');
    }
  };

 return (
  <nav className={`w-full h-22 px-6 py-2 shadow-lg transition-colors duration-300 fixed top-0 z-50 ${
    isDarkMode 
      ? 'bg-gray-800 text-white' 
      : 'bg-blue-200 text-gray-800'
  }`}>
    <div className="max-w-7xl mx-auto flex items-center justify-between flex-row-reverse relative">
      
      {/* Right side: Logout, Dark Mode Toggle, Coins/Crowns */}
      <div className="flex items-center gap-4 flex-row-reverse">
        <button
          onClick={handleLogout}
          className={`px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base md:px-7 md:py-3 md:text-lg rounded-xl font-semibold transition-all duration-300 shadow 
            ${
              isDarkMode
                ? 'bg-red-600 hover:bg-red-700 hover:shadow-lg text-white'
                : 'bg-red-500 hover:bg-red-600 hover:shadow-xl text-white'
            }`}
        >
          התנתק
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-colors duration-300 border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white shadow hover:scale-110"
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

        {userType === 'student' && studentData && (
          <div className="flex items-center gap-2 mr-1 sm:gap-3 sm:mr-2 md:gap-4 md:mr-2">
            <span className="flex items-center gap-1 px-2 py-0.5 text-sm sm:px-3 sm:py-1 sm:text-base border-2 border-yellow-400 bg-yellow-100 text-yellow-700 font-bold rounded-full shadow-sm">
              {studentData.crowns || 0} <span role="img" aria-label="crowns" className="text-lg sm:text-xl align-middle">👑</span>
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 text-sm sm:px-3 sm:py-1 sm:text-base border-2 border-yellow-400 bg-yellow-100 text-yellow-700 font-bold rounded-full shadow-sm">
              {studentData.points || 0} <span role="img" aria-label="coins" className="text-base sm:text-lg align-middle">🪙</span>
            </span>
          </div>
        )}
      </div>

      {/* Left: Logo */}
      <div 
        onClick={handleLogoClick}
        className="text-xl font-bold text-primary-600 cursor-pointer transition-all duration-300 hover:text-white hover:bg-primary-300 hover:shadow-lg hover:px-3 hover:rounded-full"
      >
        <div className="transform scale-125 origin-left">
          <img src={logo} alt="MathDuo logo" className="h-12 sm:h-16 md:h-20 w-auto max-w-full" />
        </div>
      </div>

    </div>
  </nav>
);

}
export default Navbar;
