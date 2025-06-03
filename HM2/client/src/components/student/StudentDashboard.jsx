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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary-600 cursor-pointer transition-all duration-300 hover:text-white hover:bg-primary-600 hover:shadow-lg hover:px-3 hover:rounded-full">MathDuo</h1>
              <h1>   </h1>
            </div>

            <div>
              <Link
                to="/"
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/practice"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">תרגול📝</h3>
                <p className="mt-1 text-sm text-gray-500">התחל לתרגל חומר חדש</p>
              </div>
            </Link>

            <Link
              to="/theory"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">תיאוריה📚</h3>
                <p className="mt-1 text-sm text-gray-500">למד חומר חדש</p>
              </div>
            </Link>

            <Link
              to="/help"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">פורום 🧑‍🏫</h3>
                <p className="mt-1 text-sm text-gray-500">קבל עזרה מהמורה</p>
              </div>
            </Link>

            <Link
              to="/leaderboard"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">הישגים🏆</h3>
                <p className="mt-1 text-sm text-gray-500">צפה בטבלת ההישגים של כל התלמידים</p>
              </div>
            </Link>

            {/* ריבוע פרופיל אישי */}
            <Link
              to="/profile"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">פרופיל אישי👤</h3>
                <p className="mt-1 text-sm text-gray-500">צפייה ועריכת פרטים אישיים</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
