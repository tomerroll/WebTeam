import React, { useState } from 'react';
import { addExercise } from '../../services/exerciseService';

const AddExercise = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [difficulty, setDifficulty] = useState('קל');
  const [points, setPoints] = useState(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newExercise = await addExercise({
        title,
        description,
        options,
        correctOption,
        subject,
        grade,
        difficulty,
        points,
        teacherId: '66493cfa2e4f0b9bfb32a3a8',
      });
      onAdd(newExercise);
      onClose();
    } catch (err) {
      setError(err.message || 'שגיאה בשרת');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-cyan-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">✨ הוספת תרגיל חדש</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* שדות טקסט בסיסיים */}
        {[
          { label: 'כותרת התרגיל', value: title, setValue: setTitle },
          { label: 'תיאור', value: description, setValue: setDescription, type: 'textarea' },
          { label: 'נושא', value: subject, setValue: setSubject },
          { label: 'כיתה', value: grade, setValue: setGrade }
        ].map((field, idx) => (
          <div key={idx}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
              />
            ) : (
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
              />
            )}
          </div>
        ))}

        {/* רמת קושי */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">רמת קושי</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 transition"
          >
            <option value="קל">קל</option>
            <option value="בינוני">בינוני</option>
            <option value="קשה">קשה</option>
          </select>
        </div>

        {/* נקודות */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">נקודות</label>
          <input
            type="number"
            value={points}
            min={1}
            onChange={(e) => setPoints(Number(e.target.value))}
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>

        {/* אופציות */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">אופציות</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                required
                placeholder={`אופציה ${index + 1}`}
                className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 transition"
              />
            ))}
          </div>
        </div>

        {/* תשובה נכונה */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">תשובה נכונה</label>
          <select
            value={correctOption}
            onChange={(e) => setCorrectOption(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 transition"
          >
            {options.map((_, i) => (
              <option key={i} value={i}>{`אופציה ${i + 1}`}</option>
            ))}
          </select>
        </div>

        {/* שגיאה */}
        {error && <div className="text-red-600 text-sm">{error}</div>}

        {/* כפתורים */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-5 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300"
          >
            הוסף
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExercise;
