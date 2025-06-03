import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { fetchAllStudents, addStudent, deleteStudent } from '../../services/studentService';

const ManageStudents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: 'ז',
    class: 'א',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // פילטרים
  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchAllStudents();
        setStudents(data);
      } catch (err) {
        console.error('שגיאה בשליפת תלמידים:', err);
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
    setError('');
    setLoading(true);
    try {
      await deleteStudent(id);
      setStudents(students.filter(student => student._id !== id));
    } catch (err) {
      setError(err.message || 'שגיאה במחיקת תלמיד');
    }
    setLoading(false);
  };
  
  

  // סינון התלמידים לפי פילטרים
  const filteredStudents = students.filter(student => {
    return (
      (filterGrade === '' || student.grade === filterGrade) &&
      (filterClass === '' || student.class === filterClass)
    );
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>טוען משתמש...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1
                className="text-xl font-bold text-primary-600 cursor-pointer transition-all duration-300 hover:text-white hover:bg-primary-600 hover:shadow-lg hover:px-3 hover:rounded-full"
                onClick={() => window.location.href = '/teacher-dashboard'}
              >
                MathDuo
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">ניהול תלמידים</h2>

              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">כל השכבות</option>
                <option value="ז">ז</option>
                <option value="ח">ח</option>
              </select>

              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">כל הקבוצות</option>
                <option value="א">א</option>
                <option value="ב">ב</option>
                <option value="ג">ג</option>
              </select>

              <button
                onClick={() => {
                  setFilterGrade('');
                  setFilterClass('');
                }}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 text-sm"
              >
                נקה סינון
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              הוסף תלמיד
            </button>
          </div>

          {error && <div className="text-red-600 text-center mb-4">{error}</div>}
          {loading && <div className="text-center">טוען...</div>}

          {showAddForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">הוספת תלמיד חדש</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">שם התלמיד</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">כיתה</label>
                    <select
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="ז">ז</option>
                      <option value="ח">ח</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">קבוצה</label>
                    <select
                      value={newStudent.class}
                      onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="א">א</option>
                      <option value="ב">ב</option>
                      <option value="ג">ג</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">אימייל</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">סיסמה</label>
                  <input
                    type="password"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                    disabled={loading}
                  >
                    הוסף
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    שם התלמיד
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    כיתה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    קבוצה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ניקוד
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    אימייל
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.points ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      לא נמצאו תלמידים לפי הקריטריונים שנבחרו.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ManageStudents;
