import React, { useState, useEffect } from 'react';
import { updateTheory } from '../../services/theoryService';

const EditTheory = ({ theory, onClose, onUpdate }) => {
  const [title, setTitle] = useState(theory.title);
  const [description, setDescription] = useState(theory.description);
  const [content, setContent] = useState(theory.content);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(theory.title);
    setDescription(theory.description);
    setContent(theory.content);
    setError('');
  }, [theory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!title || !description || !content) {
        throw new Error('אנא מלא את כל השדות.');
      }
      const updatedTheory = await updateTheory(theory._id, { title, description, content });
      onUpdate(updatedTheory);
      onClose();
    } catch (err) {
      console.error('Error updating theory:', err);
      setError(err.message || 'שגיאה בעדכון תיאוריה.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-cyan-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">✏️ עריכת תיאוריה</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            כותרת
          </label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 shadow focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>

        <div>
          <label htmlFor="edit-description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            תיאור קצר
          </label>
          <input
            id="edit-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 shadow focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>

        <div>
          <label htmlFor="edit-content" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            תוכן מלא
          </label>
          <textarea
            id="edit-content"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 shadow focus:ring-2 focus:ring-sky-400 transition"
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
            {loading ? 'מעדכן...' : 'עדכן תיאוריה'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTheory;
