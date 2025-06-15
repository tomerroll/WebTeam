// גרסה עם עיצוב מודרני תואם לשאר המסכים (רקע תכלת-שמים כהה)
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
  const [editExercise, setEditExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
    }
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllExercises();
        setExercises(data);
      } catch (err) {
        setError('שגיאה בטעינת התרגילים');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const handleDeleteExercise = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק תרגיל זה?')) return;
    setLoading(true);
    try {
      await deleteExercise(id);
      setExercises(exercises.filter(ex => ex._id !== id));
    } catch (err) {
      setError('שגיאה במחיקת תרגיל');
    }
    setLoading(false);
  };

  const filteredExercises = exercises.filter(exercise => (
    (filterSubject === '' || exercise.subject === filterSubject) &&
    (filterGrade === '' || exercise.grade === filterGrade) &&
    (filterDifficulty === '' || exercise.difficulty === filterDifficulty)
  ));

  const uniqueSubjects = [...new Set(exercises.map(ex => ex.subject))].sort();
  const uniqueGrades = [...new Set(exercises.map(ex => ex.grade))].sort();
  const uniqueDifficulties = [...new Set(exercises.map(ex => ex.difficulty))].sort();

  if (!user) return <div className="min-h-screen flex items-center justify-center text-xl">טוען משתמש...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">ניהול תרגילים</h2>
            <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}
              className="rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600">
              <option value="">כל הנושאים</option>
              {uniqueSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
            </select>
            <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}
              className="rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600">
              <option value="">כל הכיתות</option>
              {uniqueGrades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
            </select>
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}
              className="rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600">
              <option value="">כל רמות הקושי</option>
              {uniqueDifficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
            </select>
            <button onClick={() => { setFilterSubject(''); setFilterGrade(''); setFilterDifficulty(''); }}
              className="bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md px-3 py-2 hover:bg-gray-400 text-sm transition-all duration-300">
              נקה סינון
            </button>
          </div>

          <button onClick={() => { setShowAddForm(true); setEditExercise(null); }}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105">
            הוסף תרגיל
          </button>
        </div>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {loading && <div className="text-center">טוען...</div>}

        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-6">
            <AddExercise onClose={() => setShowAddForm(false)} onAdd={(newExercise) => {
              setExercises([...exercises, newExercise]); setShowAddForm(false);
            }} />
          </div>
        )}

        {editExercise && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-6">
            <EditExercise exercise={editExercise} onClose={() => setEditExercise(null)} onUpdate={(updated) => {
              setExercises(exercises.map(ex => ex._id === updated._id ? updated : ex)); setEditExercise(null);
            }} />
          </div>
        )}

        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-blue-100 dark:bg-gray-900">
              <tr className="text-gray-600 dark:text-gray-300 text-sm font-semibold text-right">
                <th className="px-6 py-3">כותרת</th>
                <th className="px-6 py-3">נושא</th>
                <th className="px-6 py-3">כיתה</th>
                <th className="px-6 py-3">רמת קושי</th>
                <th className="px-6 py-3">נקודות</th>
                <th className="px-6 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredExercises.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-600 dark:text-gray-300">לא נמצאו תרגילים תואמים.</td></tr>
              ) : (
                filteredExercises.map(ex => (
                  <tr key={ex._id} className="text-sm text-gray-700 dark:text-gray-200 text-right hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300">
                    <td className="px-6 py-4">{ex.title}</td>
                    <td className="px-6 py-4">{ex.subject}</td>
                    <td className="px-6 py-4">{ex.grade}</td>
                    <td className="px-6 py-4">{ex.difficulty}</td>
                    <td className="px-6 py-4">{ex.points}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => { setEditExercise(ex); setShowAddForm(false); }}
                        className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-2 py-1 rounded-md text-sm transition-all duration-200 ml-2"
                        disabled={loading}>ערוך</button>
                      <button onClick={() => handleDeleteExercise(ex._id)}
                        className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-2 py-1 rounded-md text-sm transition-all duration-200"
                        disabled={loading}>מחק</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden grid gap-4 mt-6">
          {filteredExercises.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center text-gray-600 dark:text-gray-300">
              לא נמצאו תרגילים תואמים.
            </div>
          ) : (
            filteredExercises.map(ex => (
              <div key={ex._id} className="bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ex.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditExercise(ex); setShowAddForm(false); }}
                      className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-2 py-1 rounded-md text-xs transition-all duration-200"
                      disabled={loading}>ערוך</button>
                    <button onClick={() => handleDeleteExercise(ex._id)}
                      className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-2 py-1 rounded-md text-xs transition-all duration-200"
                      disabled={loading}>מחק</button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">נושא:</span> {ex.subject}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">כיתה:</span> {ex.grade}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">רמת קושי:</span> {ex.difficulty}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">נקודות:</span> {ex.points}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageExercises;
