import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentStudent } from '../../services/studentService';

/**
 * StudentDashboard Component
 * 
 * The main dashboard interface for students, providing navigation to different
 * learning activities and features. Displays a grid of interactive tiles for
 * accessing practice exercises, theory materials, progress tracking, help forum,
 * leaderboard, and profile management. Includes learning tips and responsive design.
 * 
 * @returns {JSX.Element} - Student dashboard with navigation tiles and learning tips
 */
const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [user, setUser] = useState(null);

  // Navigation tiles configuration with routes, titles, descriptions, colors, and icons
  const tiles = [
    {
      to: '/practice',
      title: 'תרגול',
      description: 'התחל לתרגל חומר חדש',
      color: 'bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-700 dark:to-cyan-600',
      icon: '🏆'
    },
    {
      to: '/theory',
      title: 'תיאוריה',
      description: 'למד חומר חדש',
      color: 'bg-gradient-to-r from-green-400 to-lime-400 dark:from-green-700 dark:to-lime-600',
      icon: '📚'
    },
    {
      to: '/theory-progress',
      title: 'התקדמות תיאוריה',
      description: 'צפה בהתקדמות הלמידה שלך',
      color: 'bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-700 dark:to-pink-600',
      icon: '📊'
    },
    {
      to: '/help',
      title: 'פורום',
      description: 'קבל עזרה מהמורה',
      color: 'bg-gradient-to-r from-orange-400 to-red-400 dark:from-orange-600 dark:to-red-500',
      icon: '💬'
    },
    {
      to: '/leaderboard',
      title: 'הישגים',
      description: 'צפה בטבלת ההישגים של כל התלמידים',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-600 dark:to-orange-500',
      icon: '🏅'
    },
    {
      to: '/profile',
      title: 'פרופיל אישי',
      description: 'צפייה ועריכת פרטים אישיים',
      color: 'bg-gradient-to-r from-indigo-400 to-violet-400 dark:from-indigo-700 dark:to-violet-600',
      icon: '👤'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-800 dark:text-white drop-shadow">
          מה תרצה לעשות היום?
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map(({ to, title, description, color, icon }, idx) => (
            <Link
              key={idx}
              to={to}
              className="transform transition duration-300 hover:scale-105"
            >
              <div
                className={`relative rounded-2xl shadow-lg ${color} p-6 text-white hover:shadow-2xl flex flex-col justify-center items-center text-center h-36 overflow-hidden`}
              >
                <div className="text-4xl mb-2 drop-shadow-sm z-10">
                  {icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 drop-shadow-sm z-10">
                  {title}
                </h3>
                <p className="text-base drop-shadow-sm z-10">{description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* מידע נוסף על למידה יעילה */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            טיפים ללמידה יעילה
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">קרא תיאוריה</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                התחל עם קריאת החומר התיאורטי כדי להבין את המושגים הבסיסיים
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">תרגל דוגמאות</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ענה על הדוגמאות האינטראקטיביות כדי לבדוק את ההבנה שלך
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">תרגל עם שאלות</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                עבור לתרגול מלא כדי לחזק את הידע ולצבור נקודות
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
