import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentStudent } from '../../services/studentService';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const loadData = async () => {
      try {
        const data = await fetchCurrentStudent();
        setStudentData(data);
      } catch (err) {
        console.error('Error fetching student data:', err);
      }
    };

    loadData();
  }, []);

  const tiles = [
    {
      to: '/practice',
      title: 'תרגול',
      description: 'התחל לתרגל חומר חדש',
      color: 'bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-700 dark:to-cyan-600',
    },
    {
      to: '/theory',
      title: 'תיאוריה',
      description: 'למד חומר חדש',
      color: 'bg-gradient-to-r from-green-400 to-lime-400 dark:from-green-700 dark:to-lime-600',
    },
    {
      to: '/help',
      title: 'פורום',
      description: 'קבל עזרה מהמורה',
      color: 'bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-700 dark:to-pink-600',
    },
    {
      to: '/leaderboard',
      title: 'הישגים',
      description: 'צפה בטבלת ההישגים של כל התלמידים',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-600 dark:to-orange-500',
    },
    {
      to: '/profile',
      title: 'פרופיל אישי',
      description: 'צפייה ועריכת פרטים אישיים',
      color: 'bg-gradient-to-r from-indigo-400 to-violet-400 dark:from-indigo-700 dark:to-violet-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-800 dark:text-white drop-shadow">
          מה תרצה לעשות היום?
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map(({ to, title, description, color }, idx) => (
            <Link
              key={idx}
              to={to}
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

export default StudentDashboard;
