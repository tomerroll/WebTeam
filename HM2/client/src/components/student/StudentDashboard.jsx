import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// StudentDashboard.jsx
import { fetchCurrentStudent } from '../../services/studentService';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  
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
  

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/practice"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 dark:hover:bg-gray-700"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">תרגול📝</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">התחל לתרגל חומר חדש</p>
              </div>
            </Link>

            <Link
              to="/theory"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 dark:hover:bg-gray-700"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">תיאוריה📚</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">למד חומר חדש</p>
              </div>
            </Link>

            <Link
              to="/help"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 dark:hover:bg-gray-700"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">פורום 🧑‍🏫</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">קבל עזרה מהמורה</p>
              </div>
            </Link>

            <Link
              to="/leaderboard"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 dark:hover:bg-gray-700"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">הישגים🏆</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">צפה בטבלת ההישגים של כל התלמידים</p>
              </div>
            </Link>

            {/* ריבוע פרופיל אישי */}
            <Link
              to="/profile"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 dark:hover:bg-gray-700"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">פרופיל אישי👤</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">צפייה ועריכת פרטים אישיים</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
