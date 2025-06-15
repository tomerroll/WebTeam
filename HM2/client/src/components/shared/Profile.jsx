import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /* ───────────────────── טעינת נתוני משתמש ───────────────────── */
  useEffect(() => {
    if (!token) return navigate('/login');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) return navigate('/login');
    setName(storedUser.name);
    setEmail(storedUser.email);
  }, [token, navigate]);

  /* ───────────────────── שליחת עדכון ───────────────────── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const data = await updateUserProfile(token, { name, email, password });
      if (data.success) {
        setMessage('✅ הפרטים עודכנו בהצלחה');
        localStorage.setItem('user', JSON.stringify(data.user));
        setPassword('');
      } else {
        setError(data.error || 'שגיאה בעדכון');
      }
    } catch {
      setError('שגיאה בשרת');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <main className="max-w-lg mx-auto bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 drop-shadow">
          פרופיל אישי
        </h2>

        {/* הודעות הצלחה / שגיאה */}
        {message && (
          <div className="mb-4 text-green-700 dark:text-green-300 text-center font-semibold">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-center font-semibold">
            {error}
          </div>
        )}

        {/* טופס עדכון */}
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* שם מלא */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              שם מלא
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
                         text-gray-900 dark:text-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* אימייל */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              אימייל
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
                         text-gray-900 dark:text-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* סיסמה חדשה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              סיסמה חדשה (אופציונלי)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="השאר ריק אם אינך רוצה לשנות"
              className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
                         text-gray-900 dark:text-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* כפתור שליחה */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow font-bold text-lg transition"
          >
            עדכן פרטים
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;
