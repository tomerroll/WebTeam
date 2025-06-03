import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentTeacher } from '../../services/teacherService';
const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary-600 cursor-pointer transition-all duration-300 hover:text-white hover:bg-primary-600 hover:shadow-lg hover:px-3 hover:rounded-full">
                MathDuo - לוח בקרה למורה
              </h1>
            </div>

            <div>
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                התנתק
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
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
