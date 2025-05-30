import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddExercise from './AddExercise';
import EditExercise from './EditExercise';

const ManageExercises = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editExercise, setEditExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // פילטרים
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  // טען את המשתמש מה-localStorage בפעם הראשונה
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
    const fetchExercises = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/exercises');
        const data = await res.json();
        console.log('Fetched exercises:', data);
        setExercises(data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };

    fetchExercises();
  }, []);

  const handleDeleteExercise = async (id) => {
    setError('');
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/exercises/${id}`, { method: 'DELETE' });
      setExercises(exercises.filter(exercise => exercise._id !== id));
    } catch (err) {
      setError('שגיאה במחיקת תרגיל');
    }
    setLoading(false);
  };

  // סינון התרגילים לפי הפילטרים
  const filteredExercises = exercises.filter(exercise => {
    return (
      (filterSubject === '' || exercise.subject === filterSubject) &&
      (filterGrade === '' || exercise.grade === filterGrade) &&
      (filterDifficulty === '' || exercise.difficulty === filterDifficulty)
    );
  });

  // מציאת ערכים ייחודיים לפילטרים מתוך התרגילים
  const uniqueSubjects = [...new Set(exercises.map(ex => ex.subject))].sort();
  const uniqueGrades = [...new Set(exercises.map(ex => ex.grade))].sort();
  const uniqueDifficulties = [...new Set(exercises.map(ex => ex.difficulty))].sort();

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
                className="text-xl font-bold text-primary-600 cursor-pointer"
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
            <h2 className="text-2xl font-bold text-gray-900">ניהול תרגילים</h2>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="">כל הנושאים</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              {/* פילטר כיתה */}
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="">כל הכיתות</option>
                {uniqueGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>

              {/* פילטר רמת קושי */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="">כל רמות הקושי</option>
                {uniqueDifficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>

              {/* כפתור ניקוי סינון */}
              <button
                onClick={() => {
                  setFilterSubject('');
                  setFilterGrade('');
                  setFilterDifficulty('');
                }}
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
              >
                נקה סינון
              </button>
              </div>

              {/* כפתור הוספה */}
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                הוסף תרגיל
              </button>
          </div>

          {error && <div className="text-red-600 text-center mb-4">{error}</div>}
          {loading && <div className="text-center">טוען...</div>}

          {showAddForm && (
            <AddExercise
              onClose={() => setShowAddForm(false)}
              onAdd={(newExercise) => setExercises([...exercises, newExercise])}
            />
          )}

          {editExercise && (
            <EditExercise
              exercise={editExercise}
              onClose={() => setEditExercise(null)}
              onUpdate={(updated) => {
                setExercises(exercises.map(ex => ex._id === updated._id ? updated : ex));
              }}
            />
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    כותרת
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    נושא
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    כיתה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    רמת קושי
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    נקודות
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExercises.map((exercise) => (
                  <tr key={exercise._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exercise.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.difficulty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setEditExercise(exercise)}
                        className="text-blue-600 hover:text-blue-900 ml-2"
                        disabled={loading}
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(exercise._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageExercises;
