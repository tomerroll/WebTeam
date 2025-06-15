import React, { useState } from 'react';
import { updateExercise } from '../../services/exerciseService';

const EditExercise = ({ exercise, onClose, onUpdate }) => {
  const [title, setTitle] = useState(exercise.title);
  const [description, setDescription] = useState(exercise.description);
  const [options, setOptions] = useState([...exercise.options]);
  const [correctOption, setCorrectOption] = useState(exercise.correctOption);
  const [subject, setSubject] = useState(exercise.subject);
  const [grade, setGrade] = useState(exercise.grade);
  const [difficulty, setDifficulty] = useState(exercise.difficulty);
  const [points, setPoints] = useState(exercise.points);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const updated = await updateExercise(exercise._id, {
        title,
        description,
        options,
        correctOption,
        subject,
        grade,
        difficulty,
        points,
      });
      onUpdate(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'שגיאת שרת');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-cyan-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">📝 עריכת תרגיל</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* שדות בסיסיים */}
        {[
          { label: 'כותרת התרגיל', value: title, set: setTitle },
          { label: 'תיאור',        value: description, set: setDescription, type: 'textarea' },
          { label: 'נושא',          value: subject, set: setSubject },
          { label: 'כיתה',          value: grade,   set: setGrade },
        ].map(({ label, value, set, type }, i) => (
          <div key={i}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            {type === 'textarea' ? (
              <textarea
                value={value}
                onChange={(e) => set(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 transition"
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => set(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-sky-400 transition"
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
            {options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                value={opt}
                onChange={(e) => {
                  const clone = [...options];
                  clone[idx] = e.target.value;
                  setOptions(clone);
                }}
                placeholder={`אופציה ${idx + 1}`}
                required
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

        {/* הודעת שגיאה */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* כפתורים */}
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
            {loading ? 'שומר...' : 'שמור'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExercise;
