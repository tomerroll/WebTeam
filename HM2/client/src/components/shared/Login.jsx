import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../services/authService';
import { ThemeContext } from '../../contexts/ThemeContext';
import backgroundImage from '../../assets/login-bg.png';


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('student');
  const [grade, setGrade] = useState('ז');
  const [className, setClassName] = useState('א');
  const [teacherKey, setTeacherKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      try {
        const data = await loginUser(username, password);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('userType', data.userType);
          navigate(data.userType === 'student' ? '/student-dashboard' : '/teacher-dashboard');
        } else {
          setError(data.error || 'שגיאה בהתחברות');
        }
      } catch {
        setError('שגיאה בשרת');
      }
    } else {
      try {
        const data = await registerUser({
          name: fullName,
          email: username,
          password,
          userType,
          ...(userType === 'student' && { grade, class: className }),
          ...(userType === 'teacher' && { teacherKey }),
        });

        if (data.success) {
          alert('נרשמת בהצלחה! כעת תוכל להתחבר');
          setIsLogin(true);
        } else {
          setError(data.error || 'שגיאה בהרשמה');
        }
      } catch {
        setError('שגיאה בשרת');
      }
    }

    setLoading(false);
  };

  return (
<div
  className="min-h-screen flex items-center justify-center"
style={{
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center'
}}
>

      {/* כפתור מצב כהה/בהיר */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 p-2 rounded-full bg-white shadow hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        aria-label="החלף מצב כהה/בהיר"
      >
        {isDarkMode ? (
          <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.343 17.657l-1.414 1.414M17.657 17.657l-1.414-1.414M6.343 6.343L4.929 4.929M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        )}
      </button>

        {/* כרטיס התחברות מעוצב */}
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl border-[3px] border-primary-400 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.3)] space-y-6">

        <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white">
          {isLogin ? 'התחברות למערכת' : 'הרשמה למערכת'}
        </h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-full py-2 rounded-xl font-bold transition-all duration-300 ${
              isLogin
                ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            התחברות
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-full py-2 rounded-xl font-bold transition-all duration-300 ${
              !isLogin
                ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            הרשמה
          </button>
        </div>

        {error && <div className="text-center text-red-600 dark:text-red-400">{error}</div>}
        {loading && (
          <div className="text-center">
            <svg className="animate-spin h-5 w-5 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="שם מלא"
                required
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
                    userType === 'student' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  תלמיד
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('teacher')}
                  className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
                    userType === 'teacher' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  מורה
                </button>
              </div>

              {userType === 'student' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gradeSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">כיתה:</label>
                    <select
                      id="gradeSelect"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      <option value="ז">ז</option>
                      <option value="ח">ח</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="classSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">הקבצה:</label>
                    <select
                      id="classSelect"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      <option value="א">א</option>
                      <option value="ב">ב</option>
                      <option value="ג">ג</option>
                    </select>
                  </div>
                </div>
              )}

              {userType === 'teacher' && (
                <input
                  type="text"
                  value={teacherKey}
                  onChange={(e) => setTeacherKey(e.target.value)}
                  maxLength={6}
                  placeholder="קוד מורה (6 ספרות)"
                  required
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
              )}
            </>
          )}

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="אימייל"
            required
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה"
            required
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-teal-400 to-yellow-300 hover:from-teal-500 hover:to-yellow-400 text-white font-bold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {isLogin ? 'התחבר' : 'הירשם'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;