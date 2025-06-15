// גרסה עם עיצוב משופר ו-Hover Effects
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllStudents, addStudent, deleteStudent } from '../../services/studentService';

const ManageStudents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', grade: 'ז', class: 'א', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
    }
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllStudents();
        setStudents(data);
      } catch (err) {
        setError('שגיאה בטעינת רשימת התלמידים');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await addStudent(newStudent);
      setStudents([...students, data]);
      setShowAddForm(false);
      setNewStudent({ name: '', grade: 'ז', class: 'א', email: '', password: '' });
    } catch (err) {
      setError(err.message || 'שגיאה בהוספת תלמיד');
    }
    setLoading(false);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק תלמיד זה?')) return;
    setLoading(true);
    try {
      await deleteStudent(id);
      setStudents(students.filter(s => s._id !== id));
    } catch (err) {
      setError(err.message || 'שגיאה במחיקת תלמיד');
    }
    setLoading(false);
  };

  const filteredStudents = students.filter(s =>
    (filterGrade === '' || s.grade === filterGrade) &&
    (filterClass === '' || s.class === filterClass)
  );

  if (!user) return <div className="min-h-screen flex items-center justify-center text-xl">טוען משתמש...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">ניהול תלמידים</h2>
            <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}
              className="rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600">
              <option value="">כל השכבות</option>
              <option value="ז">ז</option>
              <option value="ח">ח</option>
            </select>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
              className="rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600">
              <option value="">כל הקבוצות</option>
              <option value="א">א</option>
              <option value="ב">ב</option>
              <option value="ג">ג</option>
            </select>
            <button onClick={() => { setFilterGrade(''); setFilterClass(''); }}
              className="bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md px-3 py-2 hover:bg-gray-400 text-sm transition-all duration-300">
              נקה סינון
            </button>
          </div>

          <button onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105">
            הוסף תלמיד
          </button>
        </div>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {loading && <div className="text-center">טוען...</div>}

        {/* הטבלה (למחשב) */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-blue-100 dark:bg-gray-900">
              <tr className="text-gray-600 dark:text-gray-300 text-sm font-semibold text-right">
                <th className="px-6 py-3">שם</th>
                <th className="px-6 py-3">כיתה</th>
                <th className="px-6 py-3">קבוצה</th>
                <th className="px-6 py-3">ניקוד</th>
                <th className="px-6 py-3">אימייל</th>
                <th className="px-6 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-600 dark:text-gray-300">לא נמצאו תלמידים תואמים.</td></tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student._id} className="text-sm text-gray-700 dark:text-gray-200 text-right hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300">
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.grade}</td>
                    <td className="px-6 py-4">{student.class}</td>
                    <td className="px-6 py-4">{student.points ?? 0}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDeleteStudent(student._id)}
                        className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-2 py-1 rounded-md text-sm transition-all duration-200"
                        disabled={loading}>
                        מחק
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* כרטיסים לנייד */}
        <div className="md:hidden grid gap-4 mt-6">
          {filteredStudents.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center text-gray-600 dark:text-gray-300">
              לא נמצאו תלמידים תואמים.
            </div>
          ) : (
            filteredStudents.map(student => (
              <div key={student._id}
                className="bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                  <button onClick={() => handleDeleteStudent(student._id)}
                    className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-2 py-1 rounded-md text-xs transition-all duration-200"
                    disabled={loading}>
                    מחק
                  </button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">כיתה: {student.grade}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">קבוצה: {student.class}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">ניקוד: {student.points ?? 0}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">אימייל: {student.email}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageStudents;
