import React, { useState } from 'react';
import { addTheory } from '../../services/theoryService';

const AddTheory = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!title || !description || !content) {
        throw new Error('אנא מלא את כל השדות.');
      }
      const newTheory = await addTheory({ title, description, content });
      onAdd(newTheory);
      onClose();
    } catch (err) {
      console.error('Error adding theory:', err);
      setError(err.message || 'שגיאה בהוספת תיאוריה.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-cyan-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">🧠 הוספת תיאוריה חדשה</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">כותרת</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">תיאור קצר</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">תוכן מלא</label>
          <textarea
            id="content"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-5 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300"
          >
            {loading ? 'מוסיף...' : 'הוסף תיאוריה'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTheory;
