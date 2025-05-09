import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/students/me');
        const data = await res.json();
        setStudentData(data);
      } catch (err) {
        console.error('Error fetching student data:', err);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">MathDuo</h1>
              </div>
            </div>
            <div className="flex items-center">
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
                <h3 className="text-lg font-medium text-gray-900">תרגול</h3>
                <p className="mt-1 text-sm text-gray-500">
                  התחל לתרגל חומר חדש
                </p>
              </div>
            </Link>

            <Link
              to="/theory"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">תיאוריה</h3>
                <p className="mt-1 text-sm text-gray-500">
                  למד חומר חדש
                </p>
              </div>
            </Link>

            <Link
              to="/help"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">עזרה</h3>
                <p className="mt-1 text-sm text-gray-500">
                  קבל עזרה מהמורה
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard; 