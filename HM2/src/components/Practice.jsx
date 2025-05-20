import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const coin = "🪙";
const crown = "👑";

const Practice = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [crowns, setCrowns] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetch('http://localhost:5000/api/exercises')
      .then(res => res.json())
      .then(data => {
        const uniqueSubjects = [...new Set(data.map(ex => ex.subject))];
        setSubjects(uniqueSubjects);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // טען ניקוד וכתרים
    if (user && user._id) {
      fetch(`http://localhost:5000/api/students/${user._id}`)
        .then(res => res.json())
        .then(student => {
          setPoints(student.points || 0);
          setCrowns(student.crowns || 0);
        });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary-600">MathDuo</h1>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-lg font-bold">{points} {coin}</span>
              <span className="text-lg font-bold">{crowns} {crown}</span>
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
          <h2 className="text-2xl font-bold mb-8 text-center">בחר נושא לתרגול</h2>
          {loading ? (
            <div className="text-center text-lg font-semibold">טוען נושאים...</div>
          ) : subjects.length === 0 ? (
            <div className="text-center text-gray-500">לא נמצאו נושאים לתרגול</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {subjects.map(subject => (
                <Link
                  to={`/practice/${encodeURIComponent(subject)}`}
                  key={subject}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 flex items-center justify-center"
                >
                  <div className="px-4 py-8 sm:p-8 w-full text-center">
                    <h3 className="text-lg font-medium text-gray-900">{subject}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Practice;