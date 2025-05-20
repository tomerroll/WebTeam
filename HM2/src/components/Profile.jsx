import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType'); // לקיחת סוג המשתמש

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }

    setName(storedUser.name);
    setEmail(storedUser.email);
  }, [token, navigate]); // בלי storedUser בתלות

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('הפרטים עודכנו בהצלחה');
        localStorage.setItem('user', JSON.stringify(data.user));
        setPassword('');
      } else {
        setError(data.error || 'שגיאה בעדכון');
      }
    } catch (err) {
      setError('שגיאה בשרת');
    }
  };

  const handleBackClick = () => {
    if (userType === 'teacher') {
      navigate('/teacher-dashboard');
    } else if (userType === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/'); // ברירת מחדל
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      {/* כפתור חזרה בדשבורד */}
      <button
        onClick={handleBackClick}
        className="mb-6 text-primary-600 hover:text-primary-700 font-medium"
      >
        חזרה לדף הבית
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">פרופיל אישי</h2>

      {message && <div className="text-green-600 text-center mb-2">{message}</div>}
      {error && <div className="text-red-600 text-center mb-2">{error}</div>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">שם מלא</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">אימייל</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">סיסמה חדשה (אופציונלי)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            placeholder="השאר ריק אם אינך רוצה לשנות"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
        >
          עדכן פרטים
        </button>
      </form>
    </div>
  );
};

export default Profile;
