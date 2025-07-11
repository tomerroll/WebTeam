// ✅ AddTheory.jsx – גרסה מותאמת למודל החדש

import React, { useState } from 'react';
import { addTheory } from '../../services/theoryService';

/**
 * AddTheory Component
 * 
 * A comprehensive form component for teachers to create new theoretical content.
 * Features include rich content creation with interactive examples, visual examples,
 * prerequisites, tags, difficulty levels, and estimated time. The component provides
 * dynamic form management for complex nested data structures and validation for
 * all required fields.
 * 
 * @param {Function} onClose - Callback function to close the form
 * @param {Function} onAdd - Callback function called when theory is successfully added
 * @returns {JSX.Element} - Theory creation form with multiple sections
 */
const AddTheory = ({ onClose, onAdd }) => {
  // Main form state management
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    difficulty: 'בינוני',
    estimatedTime: 10,
    youtubeLink: '',
    tags: [],
    prerequisites: [],
    interactiveExamples: []
  });

  // Interactive example form state
  const [newExample, setNewExample] = useState({
    title: '',
    description: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 1,
    explanation: '',
    difficulty: 'קל'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Updates form data for a specific field
   * @param {string} field - Field name to update
   * @param {any} value - New value for the field
   */
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handles array input fields (tags, prerequisites) by splitting comma-separated values
   * @param {string} field - Field name to update
   * @param {string} value - Comma-separated string to convert to array
   */
  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    updateFormData(field, array);
  };

  /**
   * Updates option text for interactive examples
   * @param {number} index - Option index
   * @param {string} value - New option text
   */
  const handleOptionChange = (index, value) => {
    const newOptions = [...newExample.options];
    newOptions[index] = value;
    setNewExample({ ...newExample, options: newOptions });
  };

  /**
   * Resets the new example form to default values
   */
  const resetNewExample = () => {
    setNewExample({
      title: '',
      description: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 1,
      explanation: '',
      difficulty: 'קל'
    });
  };

  /**
   * Adds a new interactive example to the theory
   */
  const handleAddExample = () => {
    if (!newExample.title || !newExample.question) {
      setError('אנא מלא את כותרת הדוגמה והשאלה');
      return;
    }

    if (newExample.options.some(opt => !opt.trim())) {
      setError('אנא מלא את כל אפשרויות התשובה');
      return;
    }

    // Convert user input (1-4) to array index (0-3) before saving
    const exampleToAdd = {
      ...newExample,
      correctAnswer: newExample.correctAnswer - 1
    };

    setFormData(prev => ({
      ...prev,
      interactiveExamples: [...prev.interactiveExamples, exampleToAdd]
    }));
    resetNewExample();
    setError('');
  };

  /**
   * Removes an interactive example from the theory
   * @param {number} index - Index of example to remove
   */
  const handleRemoveExample = (index) => {
    setFormData(prev => ({
      ...prev,
      interactiveExamples: prev.interactiveExamples.filter((_, i) => i !== index)
    }));
  };

  /**
   * Handles form submission to create a new theory
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) throw new Error('אנא הכנס כותרת');
      if (!formData.description.trim()) throw new Error('אנא הכנס תיאור');
      if (!formData.content.trim()) throw new Error('אנא הכנס תוכן');
      if (formData.estimatedTime <= 0) throw new Error('זמן מוערך חייב להיות חיובי');

      const newTheory = await addTheory(formData);
      onAdd(newTheory);
      onClose();
    } catch (err) {
      setError(err.message || 'שגיאה בהוספת תיאוריה');
    } finally {
      setLoading(false);
    }
  };

  // Tailwind input classes for consistent styling
  const inputClasses = "w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200";
  const selectClasses = "w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200";

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🧠 הוספת תיאוריה חדשה</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">📝 מידע בסיסי</h3>
          <div className="space-y-4">
            <input
              placeholder="כותרת התיאוריה"
              value={formData.title}
              onChange={e => updateFormData('title', e.target.value)}
              className={inputClasses}
              required
            />
            <input
              placeholder="תיאור קצר"
              value={formData.description}
              onChange={e => updateFormData('description', e.target.value)}
              className={inputClasses}
              required
            />
            <textarea
              placeholder="תוכן התיאוריה"
              value={formData.content}
              onChange={e => updateFormData('content', e.target.value)}
              className={`${inputClasses} h-32 resize-none`}
              required
            />
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">⚙️ הגדרות</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.difficulty}
              onChange={e => updateFormData('difficulty', e.target.value)}
              className={selectClasses}
            >
              <option value="קל">קל</option>
              <option value="בינוני">בינוני</option>
              <option value="קשה">קשה</option>
            </select>
            <input
              type="number"
              placeholder="זמן מוערך (דקות)"
              value={formData.estimatedTime}
              onChange={e => updateFormData('estimatedTime', +e.target.value)}
              className={inputClasses}
              min="1"
            />
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">🔗 מידע נוסף</h3>
          <div className="space-y-4">
            <input
              type="url"
              placeholder="קישור ליוטיוב (אופציונלי)"
              value={formData.youtubeLink}
              onChange={e => updateFormData('youtubeLink', e.target.value)}
              className={inputClasses}
            />
            <input
              placeholder="תגיות (מופרדות בפסיקים)"
              value={formData.tags.join(', ')}
              onChange={e => handleArrayInput('tags', e.target.value)}
              className={inputClasses}
            />
            <input
              placeholder="דרישות מוקדמות (מופרדות בפסיקים)"
              value={formData.prerequisites.join(', ')}
              onChange={e => handleArrayInput('prerequisites', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Interactive Examples Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">🎯 דוגמאות אינטראקטיביות</h3>
          
          {/* Help Message */}
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-600">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>טיפ:</strong> הוסף דוגמאות אינטראקטיביות כדי שהתלמידים יוכלו לתרגל את החומר. 
              כל דוגמה צריכה כותרת, שאלה, 4 אפשרויות תשובה והסבר לתשובה הנכונה.
            </p>
          </div>
          
          {/* Existing Examples */}
          {formData.interactiveExamples.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                דוגמאות שנוספו ({formData.interactiveExamples.length}):
              </h4>
              {formData.interactiveExamples.map((example, index) => (
                <div key={index} className="bg-white dark:bg-gray-600 p-3 rounded border border-gray-200 dark:border-gray-500 mb-2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 dark:text-white text-sm">
                        {example.title || 'דוגמה ללא כותרת'}
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {example.question || 'שאלה לא מוגדרת'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExample(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2"
                    >
                      מחק
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-3">תשובה נכונה: {example.correctAnswer + 1}</span>
                    <span>רמה: {example.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Example Form */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              {formData.interactiveExamples.length > 0 ? 'הוסף דוגמה נוספת:' : 'הוסף דוגמה ראשונה:'}
            </h4>
            <input
              placeholder="כותרת הדוגמה (חובה)"
              value={newExample.title}
              onChange={e => setNewExample({ ...newExample, title: e.target.value })}
              className={inputClasses}
            />
            <input
              placeholder="תיאור הדוגמה (אופציונלי)"
              value={newExample.description}
              onChange={e => setNewExample({ ...newExample, description: e.target.value })}
              className={inputClasses}
            />
            <input
              placeholder="שאלה (חובה)"
              value={newExample.question}
              onChange={e => setNewExample({ ...newExample, question: e.target.value })}
              className={inputClasses}
            />
            
            <div className="grid grid-cols-2 gap-2">
              {newExample.options.map((opt, i) => (
                <input
                  key={i}
                  placeholder={`אפשרות ${i + 1} (חובה)`}
                  value={opt}
                  onChange={e => handleOptionChange(i, e.target.value)}
                  className={inputClasses}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="תשובה נכונה (1-4)"
                value={newExample.correctAnswer}
                onChange={e => setNewExample({ ...newExample, correctAnswer: +e.target.value })}
                className={inputClasses}
                min="1"
                max="4"
              />
              <select
                value={newExample.difficulty}
                onChange={e => setNewExample({ ...newExample, difficulty: e.target.value })}
                className={selectClasses}
              >
                <option value="קל">קל</option>
                <option value="בינוני">בינוני</option>
                <option value="קשה">קשה</option>
              </select>
            </div>
            
            <textarea
              placeholder="הסבר לתשובה הנכונה (חובה)"
              value={newExample.explanation}
              onChange={e => setNewExample({ ...newExample, explanation: e.target.value })}
              className={`${inputClasses} h-20 resize-none`}
            />
            
            <button
              type="button"
              onClick={handleAddExample}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              ➕ הוסף דוגמה
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-3 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 disabled:bg-green-300 dark:disabled:bg-green-800 text-white rounded-lg transition-colors font-medium"
          >
            {loading ? 'מוסיף...' : 'הוסף תיאוריה'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTheory;
