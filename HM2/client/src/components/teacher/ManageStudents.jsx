// קובץ עם עיצוב תואם לגרסת ניהול התרגילים (רקע תכלת-שמים כהה, כפתורים, פילטרים וכו')
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllStudents, addStudent, deleteStudent } from '../../services/studentService';

/**
 * ManageStudents Component
 * 
 * A comprehensive student management interface for teachers to view, add, and delete students.
 * Features include filtering by grade and class, responsive design with table view for desktop
 * and card view for mobile, form validation, and confirmation dialogs for destructive actions.
 * The component provides real-time updates and error handling for all student operations.
 * 
 * @returns {JSX.Element} - Student management interface with CRUD operations
 */
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

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
    }
  }, []);

  // Load all students data
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

  /**
   * Handles adding a new student to the system
   * @param {Event} e - Form submission event
   */
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

  /**
   * Handles deleting a student from the system
   * @param {string} id - Student ID to delete
   */
  const handleDeleteStudent = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק תלמיד זה?')) return;
    setError('');
    setLoading(true);
    try {
      await deleteStudent(id);
      setStudents(students.filter(s => s._id !== id));
    } catch (err) {
      setError(err.message || 'שגיאה במחיקת תלמיד');
    }
    setLoading(false);
  };

  // Filter students based on selected grade and class
  const filteredStudents = students.filter(s => (
    (filterGrade === '' || s.grade === filterGrade) &&
    (filterClass === '' || s.class === filterClass)
  ));

  if (!user) return <div className="min-h-screen flex items-center justify-center text-xl">טוען משתמש...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">ניהול תלמידים</h2>
            <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}
              className="rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600">
              <option value="">כל השכבות</option>
              <option value="ז">ז</option>
              <option value="ח">ח</option>
            </select>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
              className="rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600">
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
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105">
            הוסף תלמיד
          </button>
        </div>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {loading && <div className="text-center">טוען...</div>}

        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">הוספת תלמיד חדש</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input type="text" required value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="שם" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow" />
              <input type="email" required value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="אימייל" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow" />
              <input type="password" required value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                placeholder="סיסמה" className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={newStudent.grade} onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                  className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow">
                  <option value="ז">ז</option>
                  <option value="ח">ח</option>
                </select>
                <select value={newStudent.class} onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                  className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow">
                  <option value="א">א</option>
                  <option value="ב">ב</option>
                  <option value="ג">ג</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setShowAddForm(false)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                  ביטול
                </button>
                <button type="submit" disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
                  הוסף
                </button>
              </div>
            </form>
          </div>
        )}

       {/* טבלה למסכים גדולים */}
<div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
    <thead className="bg-blue-100 dark:bg-gray-900">
      <tr className="text-gray-600 dark:text-gray-300 text-sm font-semibold text-right">
        <th className="px-6 py-3">שם התלמיד</th>
        <th className="px-6 py-3">כיתה</th>
        <th className="px-6 py-3">קבוצה</th>
        <th className="px-6 py-3">אימייל</th>
        <th className="px-6 py-3">ניקוד</th>
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
            <td className="px-6 py-4">{student.email}</td>
            <td className="px-6 py-4">{student.points ?? 0}</td>
            <td className="px-6 py-4">
              <button onClick={() => handleDeleteStudent(student._id)}
                className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-2 py-1 rounded-md text-sm transition-all duration-200"
                disabled={loading}>מחק</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{/* כרטיסיות לנייד */}
<div className="md:hidden grid gap-4 mt-6">
  {filteredStudents.length === 0 ? (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center text-gray-600 dark:text-gray-300">
      לא נמצאו תלמידים תואמים.
    </div>
  ) : (
    filteredStudents.map(student => (
      <div key={student._id} className="bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</h3>
          <button onClick={() => handleDeleteStudent(student._id)}
            className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-2 py-1 rounded-md text-xs transition-all duration-200"
            disabled={loading}>מחק</button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">כיתה:</span> {student.grade}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">קבוצה:</span> {student.class}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">אימייל:</span> {student.email}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">ניקוד:</span> {student.points ?? 0}</p>
      </div>
    ))
  )}
</div>

      </main>
    </div>
  );
};

export default ManageStudents;
