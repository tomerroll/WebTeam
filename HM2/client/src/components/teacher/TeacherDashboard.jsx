import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentTeacher } from '../../services/teacherService';

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null); // Fallback if JSON parsing fails
      }
    }

    const fetchTeacherData = async () => {
      try {
        const data = await fetchCurrentTeacher();
        setTeacherData(data);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
      }
    };

    fetchTeacherData();
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
    // --- NEW: Link for Manage Theory ---
    {
      title: 'ניהול תיאוריה',
      description: 'הוסף, ערוך ומחק תוכן תיאורטי',
      icon: '📚', // A book icon is suitable for theory
      path: '/manage-theory', // This path points to the new ManageTheory component
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
          {/* Optional: Display teacher's name if available */}
          {teacherData && (
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              ברוך הבא, {teacherData.fullName || user.email}!
            </h2>
          )}

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
                    <div className="mr-4"> {/* Changed ml-4 to mr-4 for RTL */}
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