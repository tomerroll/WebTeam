import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentTeacher } from '../../services/teacherService';
const TeacherDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const menuItems = [
    {
      title: 'ניהול תלמידים',
      description: 'הוסף, ערוך ומחק תלמידים',
      icon: '👥',
      path: '/manage-students',
    },
    {
      title: 'ניהול תרגילים',
      description: 'הוסף, ערוך ומחק תרגילים',
      icon: '📝',
      path: '/manage-exercises',
    },
    {
      title: 'דוחות',
      description: 'צפה בדוחות התקדמות התלמידים',
      icon: '📊',
      path: '/reports',
    },
    {
      title: 'מערכת תגמולים',
      description: 'נהל תגמולים והתקדמות תלמידים',
      icon: '🏆',
      path: '/leaderboard',
    },
    {
      title: 'פורום',
      description: 'צפה בבקשות עזרה וענה עליהן',
      icon: '💬',
      path: '/teacher-help-forum',
    },
    {
      title: 'פרופיל אישי',
      description: 'צפייה ועריכת פרטים אישיים',
      icon: '👤',
      path: '/profile',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 dark:hover:bg-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
