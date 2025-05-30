import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('student');
  const [grade, setGrade] = useState('ז');
  const [className, setClassName] = useState('א');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      // התחברות
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: username,
            password,
          }),
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('userType', data.userType); // שמירת userType
          navigate(data.userType === 'student' ? '/student-dashboard' : '/teacher-dashboard');
        } else {
          setError(data.error || 'שגיאה בהתחברות');
        }
      } catch (err) {
        setError('שגיאה בשרת');
      }
    } else {
      // הרשמה
      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            email: username,
            password,
            userType,
            ...(userType === 'student' && { grade, class: className }),
          }),
        });
        const data = await res.json();
        if (data.success) {
          alert('נרשמת בהצלחה! כעת תוכל להתחבר');
          setIsLogin(true);
        } else {
          setError(data.error || 'שגיאה בהרשמה');
        }
      } catch (err) {
        setError('שגיאה בשרת');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'התחברות למערכת' : 'הרשמה למערכת'}
        </h2>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md ${isLogin ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            התחברות
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md ${!isLogin ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            הרשמה
          </button>
        </div>

        {error && <div className="text-red-600 text-center">{error}</div>}
        {loading && <div className="text-center">טוען...</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium">שם מלא</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`px-4 py-2 rounded-md ${userType === 'student' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  תלמיד
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('teacher')}
                  className={`px-4 py-2 rounded-md ${userType === 'teacher' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  מורה
                </button>
              </div>

              {userType === 'student' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>כיתה</label>
                    <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                      <option value="ז">ז</option>
                      <option value="ח">ח</option>
                    </select>
                  </div>
                  <div>
                    <label>קבוצה</label>
                    <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                      <option value="א">א</option>
                      <option value="ב">ב</option>
                      <option value="ג">ג</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <input
              type="text"
              placeholder="אימייל"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md mt-2"
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md mt-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            {isLogin ? 'התחבר' : 'הירשם'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
