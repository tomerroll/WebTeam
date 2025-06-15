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
        setUser(null);
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

  const tiles = [
    {
      path: '/manage-students',
      title: 'ניהול תלמידים',
      description: 'הוסף, ערוך ומחק תלמידים',
      color: 'bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-700 dark:to-cyan-600',
    },
    {
      path: '/manage-exercises',
      title: 'ניהול תרגילים',
      description: 'הוסף, ערוך ומחק תרגילים',
      color: 'bg-gradient-to-r from-green-400 to-lime-400 dark:from-green-700 dark:to-lime-600',
    },
    {
      path: '/manage-theory',
      title: 'ניהול תיאוריה',
      description: 'הוסף, ערוך ומחק תוכן תיאורטי',
      color: 'bg-gradient-to-r from-indigo-400 to-blue-500 dark:from-indigo-700 dark:to-blue-600',
    },
    {
      path: '/reports',
      title: 'דוחות',
      description: 'צפה בדוחות התקדמות התלמידים',
      color: 'bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-700 dark:to-pink-600',
    },
    {
      path: '/leaderboard',
      title: 'מערכת תגמולים',
      description: 'נהל תגמולים והתקדמות תלמידים',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-600 dark:to-orange-500',
    },
    {
      path: '/teacher-help-forum',
      title: 'פורום',
      description: 'צפה בבקשות עזרה וענה עליהן',
      color: 'bg-gradient-to-r from-red-400 to-pink-400 dark:from-red-700 dark:to-pink-600',
    },
    {
      path: '/profile',
      title: 'פרופיל אישי',
      description: 'צפייה ועריכת פרטים אישיים',
      color: 'bg-gradient-to-r from-teal-400 to-emerald-400 dark:from-teal-700 dark:to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <main className="max-w-6xl mx-auto">
    
          <h1 className="text-3xl font-bold text-center mb-10 text-blue-800 dark:text-white drop-shadow">
            מה תרצה לעשות היום?
          </h1> 
      

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map(({ path, title, description, color }, idx) => (
            <Link
              key={idx}
              to={path}
              className="transform transition duration-300 hover:scale-105"
            >
              <div
                className={`relative rounded-2xl shadow-lg ${color} p-6 text-white hover:shadow-2xl flex flex-col justify-center items-center text-center h-36 overflow-hidden`}
              >
                <h3 className="text-2xl font-bold mb-2 drop-shadow-sm z-10">
                  {title}
                </h3>
                <p className="text-base drop-shadow-sm z-10">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
