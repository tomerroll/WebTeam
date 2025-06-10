// src/components/teacher/EditTheory.jsx
import React, { useState, useEffect } from 'react';
import { updateTheory } from '../../services/theoryService';

const EditTheory = ({ theory, onClose, onUpdate }) => {
  const [title, setTitle] = useState(theory.title);
  const [description, setDescription] = useState(theory.description);
  const [content, setContent] = useState(theory.content);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update state if the 'theory' prop changes (e.g., if a different exercise is selected for editing)
  useEffect(() => {
    setTitle(theory.title);
    setDescription(theory.description);
    setContent(theory.content);
    setError(''); // Clear error on new exercise load
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
      onUpdate(updatedTheory); // Pass the updated theory back to the parent
      onClose(); // Close the form
    } catch (err) {
      console.error('Error updating theory:', err);
      setError(err.message || 'שגיאה בעדכון תיאוריה.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ערוך תוכן תיאורטי</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            כותרת הנושא (Title)
          </label>
          <input
            type="text"
            id="edit-title"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            תיאור קצר
          </label>
          <input
            type="text"
            id="edit-description"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            תוכן מלא
          </label>
          <textarea
            id="edit-content"
            rows="6"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700"
            disabled={loading}
          >
            בטל
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            disabled={loading}
          >
            {loading ? 'מעדכן...' : 'עדכן תיאוריה'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTheory;