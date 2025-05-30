import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddExercise from './AddExercise';
import EditExercise from './EditExercise';

const ManageExercises = () => {
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editExercise, setEditExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleEditExercise = (exercise) => {
    setEditExercise(exercise);
    setShowEditForm(true);
  };

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
            <div className="flex space-x-4">
              <Link to="/teacher-dashboard" className="text-primary-600 hover:text-primary-700">
                חזרה לדף הבית
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">ניהול תרגילים</h2>
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
                {exercises.map((exercise) => (
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
