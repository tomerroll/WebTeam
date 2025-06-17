import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { fetchAllStudents } from '../../services/studentService';

/**
 * Leaderboard Component
 * 
 * Displays a competitive leaderboard showing student rankings based on crowns and points.
 * Features a podium display for the top 3 students with special styling and medals,
 * followed by a list of remaining students in the top 10. Includes confetti animation
 * for celebration effect and responsive design for different screen sizes.
 * 
 * @returns {JSX.Element} - Leaderboard with podium and rankings
 */

// Color gradients for podium positions (gold, silver, bronze)
const podiumColors = [
  'from-yellow-300 to-yellow-400',
  'from-gray-300 to-gray-400',
  'from-orange-300 to-orange-400',
];

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [showConfetti, setShowConfetti] = useState(true);

  // Load students data and set confetti timer
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchAllStudents();
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    loadStudents();
    // Hide confetti after 10 seconds
    const timer = setTimeout(() => setShowConfetti(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Sort students by crowns first, then by points, and get top 10
  const sorted = [...students].sort((a, b) => b.crowns - a.crowns || b.points - a.points).slice(0, 10);
  const podium = sorted.slice(0, 3); // Top 3 for podium
  const rest = sorted.slice(3); // Remaining students

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4 flex flex-col items-center">
      {showConfetti && <Confetti />}
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-yellow-300 flex items-center justify-center gap-2">
          <span role="img" aria-label="trophy">🏆</span> טבלת ההישגים🏆
        </h2>

        {/* Podium */}
        <div className="flex justify-center items-end gap-4 mb-10">
          {podium.map((s, idx) => (
            <div
              key={s._id}
              className={`flex flex-col items-center text-white rounded-2xl shadow-lg bg-gradient-to-br ${podiumColors[idx]} 
                          ${idx === 0 ? 'h-48 w-32' : 'h-40 w-28'} transition-all duration-300 hover:scale-105`}
              style={{ zIndex: 3 - idx, marginTop: idx === 1 ? '24px' : '0' }}
            >
              <div className="text-4xl mt-4">{['🥇', '🥈', '🥉'][idx]}</div>
              <div className="font-bold text-lg mt-2">{s.name}</div>
              <div className="flex gap-2 mt-2">
                <span>👑 {s.crowns || 0}</span>
                <span>🪙 {s.points || 0}</span>
              </div>
              <div className="text-sm mt-2 mb-4">מקום {idx + 1}</div>
            </div>
          ))}
        </div>

        {/* Others */}
        <div className="grid grid-cols-1 gap-3">
          {rest.map((s, idx) => (
            <div
              key={s._id}
              className="flex items-center justify-between bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-800 
                         rounded-xl px-4 py-3 shadow hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">{idx + 4}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{s.name}</span>
              </div>
              <div className="flex gap-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                <span>👑 {s.crowns || 0}</span>
                <span>🪙 {s.points || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
