import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
const podiumColors = [
  'bg-yellow-300', // מקום ראשון
  'bg-gray-300',   // מקום שני
  'bg-orange-300', // מקום שלישי
];

const Leaderboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/students');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };
    fetchAllStudents();

    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // דירוג: קודם לפי כתרים, אח"כ לפי מטבעות
  const sorted = [...students].sort((a, b) => {
    if (b.crowns !== a.crowns) return b.crowns - a.crowns;
    return b.points - a.points;
  }).slice(0, 10);

  // פרגוד לשלושת הראשונים
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <nav className="bg-white shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-primary-600 cursor-pointer" onClick={() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.grade) {
    window.location.href = '/student-dashboard';
  } else {
    window.location.href = '/teacher-dashboard';
  }
}}>MathDuo</h1>
          <div className="flex items-center gap-4">
            {/* ...existing code... */}
          </div>
        </div>
      </nav>
      {showConfetti && <Confetti />}
      <div className="max-w-2xl w-full mt-8 mb-4 bg-white rounded-lg shadow p-4">
        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="trophy">🏆</span> טבלת הישגים
        </h2>

        {/* פרגוד לשלושת הראשונים */}
        <div className="flex justify-center items-end gap-4 mb-8">
          {podium.map((s, idx) => (
            <div
              key={s._id}
              className={`flex flex-col items-center rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 ${podiumColors[idx]} ${idx === 0 ? 'h-48 w-32' : 'h-40 w-28'}`}
              style={{ zIndex: 3 - idx, marginTop: idx === 1 ? '24px' : '0' }}
            >
              <div className="text-4xl mt-4">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
              <div className="font-bold text-lg mt-2">{s.name}</div>
              <div className="flex gap-2 mt-2">
                <span className="text-yellow-700 font-bold">👑 {s.crowns || 0}</span>
                <span className="text-yellow-600 font-bold">🪙 {s.points || 0}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2 mb-4">מקום {idx + 1}</div>
            </div>
          ))}
        </div>

        {/* שאר המקומות */}
        <div className="grid grid-cols-1 gap-2">
          {rest.map((s, idx) => (
            <div
              key={s._id}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 shadow hover:bg-blue-100 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-blue-700">{idx + 4}</span>
                <span className="font-semibold">{s.name}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-yellow-700 font-bold">👑 {s.crowns || 0}</span>
                <span className="text-yellow-600 font-bold">🪙 {s.points || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;