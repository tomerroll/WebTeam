import React, { useState } from 'react';
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
            userType
          })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('userType', userType);
          if (userType === 'student') {
            navigate('/student-dashboard');
          } else {
            navigate('/teacher-dashboard');
          }
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
            ...(userType === 'student' && { grade, class: className })
          })
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
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'התחברות למערכת' : 'הרשמה למערכת'}
          </h2>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md ${
              isLogin ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            התחברות
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md ${
              !isLogin ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            הרשמה
          </button>
        </div>

        {error && <div className="text-red-600 text-center">{error}</div>}
        {loading && <div className="text-center">טוען...</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">שם מלא</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  placeholder="הכנס את שמך המלא"
                  required
                />
              </div>
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`px-4 py-2 rounded-md ${
                    userType === 'student'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  הרשמה כתלמיד
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('teacher')}
                  className={`px-4 py-2 rounded-md ${
                    userType === 'teacher'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  הרשמה כמורה
                </button>
              </div>
              {userType === 'student' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">כיתה</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      required
                    >
                      <option value="ז">ז</option>
                      <option value="ח">ח</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">קבוצה</label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      required
                    >
                      <option value="א">א</option>
                      <option value="ב">ב</option>
                      <option value="ג">ג</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">שם משתמש</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="שם משתמש או אימייל"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">סיסמה</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              {isLogin ? 'התחבר' : 'הירשם'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
