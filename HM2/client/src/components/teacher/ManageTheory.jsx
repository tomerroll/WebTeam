import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTheory from './AddTheory';
import EditTheory from './EditTheory';
import { fetchTheoryContent, deleteTheory } from '../../services/theoryService';

/**
 * ManageTheory Component
 * 
 * A comprehensive theory content management interface for teachers to view, add, edit, and delete
 * theoretical content. Features include filtering by title, expandable content preview,
 * responsive design with table view for desktop and card view for mobile, and integration
 * with AddTheory and EditTheory components for CRUD operations.
 * 
 * @returns {JSX.Element} - Theory content management interface with filtering and CRUD operations
 */
const ManageTheory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [theoryList, setTheoryList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTheory, setEditTheory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedContent, setExpandedContent] = useState({});

  const [filterTitle, setFilterTitle] = useState('');

  // Load user data from localStorage
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

  // Load all theory content
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

  /**
   * Handles deleting a theory from the system
   * @param {string} id - Theory ID to delete
   */
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

  // Filter theories based on selected title
  const filteredTheory = theoryList.filter(item => {
    return (
      filterTitle === '' || item.title === filterTitle
    );
  });

  // Extract unique titles for filter dropdown
  const uniqueTitles = [...new Set(theoryList.map(item => item.title))].sort();

  /**
   * Truncates text to specified length with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} - Truncated text
   */
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  /**
   * Toggles content expansion for a specific theory
   * @param {string} id - Theory ID to toggle
   */
  const toggleExpand = (id) => {
    setExpandedContent(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>טוען משתמש...</p>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800">
  <main className="max-w-7xl mx-auto py-8 px-4">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">ניהול תיאוריה</h2>
        <select value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)}
          className="rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600">
          <option value="">כל הנושאים</option>
          {uniqueTitles.map(title => <option key={title} value={title}>{title}</option>)}
        </select>
        <button onClick={() => setFilterTitle('')}
          className="bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md px-3 py-2 hover:bg-gray-400 text-sm transition-all duration-300">
          נקה סינון
        </button>
      </div>

      <button onClick={() => { setShowAddForm(true); setEditTheory(null); }}
        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105">
        הוסף תיאוריה
      </button>
    </div>

    {error && <div className="text-red-600 text-center mb-4">{error}</div>}
    {loading && <div className="text-center">טוען...</div>}

    {showAddForm && (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-6">
        <AddTheory onClose={() => setShowAddForm(false)} onAdd={(newTheory) => {
          setTheoryList([...theoryList, newTheory]); setShowAddForm(false);
        }} />
      </div>
    )}

    {editTheory && (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-6">
        <EditTheory theory={editTheory} onClose={() => setEditTheory(null)} onUpdate={(updated) => {
          setTheoryList(theoryList.map(item => item._id === updated._id ? updated : item)); setEditTheory(null);
        }} />
      </div>
    )}

    {/* טבלה למסך רחב */}
    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead className="bg-blue-100 dark:bg-gray-900">
          <tr className="text-gray-600 dark:text-gray-300 text-sm font-semibold text-right">
            <th className="px-6 py-3">כותרת</th>
            <th className="px-6 py-3">תיאור</th>
            <th className="px-6 py-3">תוכן</th>
            <th className="px-6 py-3">פעולות</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTheory.length === 0 ? (
            <tr><td colSpan="4" className="text-center py-4 text-gray-600 dark:text-gray-300">לא נמצאו פריטי תיאוריה תואמים.</td></tr>
          ) : (
            filteredTheory.map(item => (
              <tr key={item._id} className="text-sm text-gray-700 dark:text-gray-200 text-right hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300">
                <td className="px-6 py-4">{item.title}</td>
                <td className="px-6 py-4">{truncateText(item.description, 100)}</td>
                <td className="px-6 py-4">
                  {expandedContent[item._id] ? item.content : truncateText(item.content, 150)}
                  {item.content && item.content.length > 150 && (
                    <button onClick={() => toggleExpand(item._id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline mr-1">
                      {expandedContent[item._id] ? 'קרא פחות' : 'קרא עוד'}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => { setEditTheory(item); setShowAddForm(false); }}
                    className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-2 py-1 rounded-md text-sm transition-all duration-200 ml-2"
                    disabled={loading}>ערוך</button>
                  <button onClick={() => handleDeleteTheory(item._id)}
                    className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-2 py-1 rounded-md text-sm transition-all duration-200"
                    disabled={loading}>מחק</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* כרטיסים למסך צר */}
    <div className="md:hidden grid gap-4 mt-6">
      {filteredTheory.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center text-gray-600 dark:text-gray-300">
          לא נמצאו פריטי תיאוריה תואמים.
        </div>
      ) : (
        filteredTheory.map(item => (
          <div key={item._id} className="bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => { setEditTheory(item); setShowAddForm(false); }}
                  className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-2 py-1 rounded-md text-xs transition-all duration-200"
                  disabled={loading}>ערוך</button>
                <button onClick={() => handleDeleteTheory(item._id)}
                  className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-2 py-1 rounded-md text-xs transition-all duration-200"
                  disabled={loading}>מחק</button>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">תיאור:</span> {item.description}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">תוכן:</span> {expandedContent[item._id] ? item.content : truncateText(item.content, 150)}
              {item.content && item.content.length > 150 && (
                <button onClick={() => toggleExpand(item._id)}
                  className="text-blue-600 dark:text-blue-400 hover:underline mr-1">
                  {expandedContent[item._id] ? 'קרא פחות' : 'קרא עוד'}
                </button>
              )}
            </p>
          </div>
        ))
      )}
    </div>
  </main>
</div>

  );
};

export default ManageTheory;