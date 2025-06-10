// src/components/teacher/ManageTheory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTheory from './AddTheory';
import EditTheory from './EditTheory';
import { fetchTheoryContent, deleteTheory } from '../../services/theoryService';

const ManageTheory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Assuming user is needed for permissions/display
  const [theoryList, setTheoryList] = useState([]); // Renamed for clarity vs. 'exercises'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTheory, setEditTheory] = useState(null); // Holds the theory item being edited
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters (based on 'title' as the subject for now)
  const [filterTitle, setFilterTitle] = useState('');

  // Load user from localStorage
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

  // Fetch all theory content
  useEffect(() => {
    const loadTheory = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchTheoryContent();
        setTheoryList(data);
      } catch (err) {
        console.error('Error fetching theory content:', err);
        setError('שגיאה בטעינת תוכן התיאוריה');
      } finally {
        setLoading(false);
      }
    };

    loadTheory();
  }, []);

  const handleDeleteTheory = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק תוכן תיאורטי זה?')) {
      return;
    }
    setError('');
    setLoading(true);
    try {
      await deleteTheory(id);
      setTheoryList(theoryList.filter(item => item._id !== id));
    } catch (err) {
      setError('שגיאה במחיקת תיאוריה');
    }
    setLoading(false);
  };

  // Filter theory items by title (used as subject)
  const filteredTheory = theoryList.filter(item => {
    return (
      filterTitle === '' || item.title === filterTitle
    );
  });

  // Get unique titles for filter dropdown
  const uniqueTitles = [...new Set(theoryList.map(item => item.title))].sort();

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ניהול תיאוריה</h2>
              {/* Filter by Title (acting as subject) */}
              <select
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="">כל הנושאים</option>
                {uniqueTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>

              {/* Clear Filter Button */}
              <button
                onClick={() => setFilterTitle('')}
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
              >
                נקה סינון
              </button>
            </div>

            {/* Add Theory Button */}
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditTheory(null); // Close edit form if open
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              הוסף תיאוריה
            </button>
          </div>

          {error && <div className="text-red-600 text-center mb-4">{error}</div>}
          {loading && <div className="text-center">טוען...</div>}

          {showAddForm && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <AddTheory
                onClose={() => setShowAddForm(false)}
                onAdd={(newTheory) => {
                  setTheoryList([...theoryList, newTheory]);
                  setShowAddForm(false); // Close form after add
                }}
              />
            </div>
          )}

          {editTheory && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <EditTheory
                theory={editTheory}
                onClose={() => setEditTheory(null)}
                onUpdate={(updated) => {
                  setTheoryList(theoryList.map(item => item._id === updated._id ? updated : item));
                  setEditTheory(null); // Close form after update
                }}
              />
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    כותרת (נושא)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    תיאור
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    תוכן
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTheory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                      לא נמצאו פריטי תיאוריה תואמים.
                    </td>
                  </tr>
                ) : (
                  filteredTheory.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white align-top">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 align-top max-w-xs overflow-hidden" style={{ wordBreak: 'break-word' }}>
                        {/* Show full description, allow wrapping */}
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 align-top max-w-sm" style={{ wordBreak: 'break-word', maxHeight: '150px', overflowY: 'auto' }}>
                        {/* Allow content to wrap, and add internal scroll if too long */}
                        {item.content}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 align-top">
                        <button
                          onClick={() => {
                            setEditTheory(item);
                            setShowAddForm(false); // Close add form if open
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 ml-2"
                          disabled={loading}
                        >
                          ערוך
                        </button>
                        <button
                          onClick={() => handleDeleteTheory(item._id)}
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
        </div>
      </main>
    </div>
  );
};

export default ManageTheory;