import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddExercise from './AddExercise';
import EditExercise from './EditExercise';
import { fetchAllExercises, deleteExercise } from '../../services/exerciseService';

const ManageExercises = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editExercise, setEditExercise] = useState(null); // Renamed from showEditForm to directly hold the exercise
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
      setLoading(true); // Start loading when fetching
      setError('');
      try {
        const data = await fetchAllExercises();
        setExercises(data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('שגיאה בטעינת התרגילים');
      } finally {
        setLoading(false); // Stop loading regardless of success/failure
      }
    };

    fetchExercises();
  }, []);

  const handleDeleteExercise = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק תרגיל זה?')) {
      return;
    }
    setError('');
    setLoading(true);
    try {
      await deleteExercise(id);
      setExercises(exercises.filter(ex => ex._id !== id));
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap"> {/* Added flex-wrap for filters */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ניהול תרגילים</h2>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
              onClick={() => {
                setShowAddForm(true);
                setEditExercise(null); // Close edit form if open
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              הוסף תרגיל
            </button>
          </div>

          {error && <div className="text-red-600 text-center mb-4">{error}</div>}
          {loading && <div className="text-center">טוען...</div>}

          {showAddForm && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <AddExercise
                onClose={() => setShowAddForm(false)}
                onAdd={(newExercise) => {
                  setExercises([...exercises, newExercise]);
                  setShowAddForm(false); // Close form after add
                }}
              />
            </div>
          )}

          {editExercise && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6"> {/* Added a div wrapper for styling */}
              <EditExercise
                exercise={editExercise}
                onClose={() => setEditExercise(null)}
                onUpdate={(updated) => {
                  setExercises(exercises.map(ex => ex._id === updated._id ? updated : ex));
                  setEditExercise(null); // Close form after update
                }}
              />
            </div>
          )}

          {/* Table for larger screens (md and up) */}
          <div className="hidden md:block bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    כותרת
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    נושא
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    כיתה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    רמת קושי
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    נקודות
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredExercises.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                      לא נמצאו תרגילים תואמים.
                    </td>
                  </tr>
                ) : (
                  filteredExercises.map((exercise) => (
                    <tr key={exercise._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {exercise.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {exercise.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {exercise.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {exercise.difficulty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {exercise.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <button
                          onClick={() => {
                            setEditExercise(exercise);
                            setShowAddForm(false); // Close add form if open
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 ml-2"
                          disabled={loading}
                        >
                          ערוך
                        </button>
                        <button
                          onClick={() => handleDeleteExercise(exercise._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          disabled={loading}
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card layout for small screens (below md) */}
          <div className="md:hidden">
            {filteredExercises.length === 0 ? (
              <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 shadow rounded-lg">
                לא נמצאו תרגילים תואמים.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredExercises.map((exercise) => (
                  <div key={exercise._id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {exercise.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditExercise(exercise);
                            setShowAddForm(false);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                          disabled={loading}
                        >
                          ערוך
                        </button>
                        <button
                          onClick={() => handleDeleteExercise(exercise._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                          disabled={loading}
                        >
                          מחק
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">נושא:</span> {exercise.subject}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">כיתה:</span> {exercise.grade}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">רמת קושי:</span> {exercise.difficulty}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">נקודות:</span> {exercise.points}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageExercises;