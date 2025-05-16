// TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/teachers/me');
        const data = await res.json();
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
      path: '/rewards',
    },
    {
      title: 'פורום',
      description: 'צפה בבקשות עזרה וענה עליהן',
      icon: '💬',
      path: '/teacher-help-forum', // נתיב חדש לפורום מורה
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">MathDuo - לוח בקרה למורה</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900"
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
