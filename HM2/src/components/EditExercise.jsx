import React, { useState } from 'react';

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
      const res = await fetch(`http://localhost:5000/api/exercises/${exercise._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          options,
          correctOption,
          subject,
          grade,
          difficulty,
          points,
        }),
      });

      const data = await res.json();
      if (data._id) {
        onUpdate(data);
        onClose();
      } else {
        setError(data.error || 'שגיאה בעדכון תרגיל');
      }
    } catch (err) {
      setError('שגיאת שרת');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">עריכת תרגיל</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">כותרת התרגיל</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">תיאור</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">נושא</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">כיתה</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">רמת קושי</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
          >
            <option value="קל">קל</option>
            <option value="בינוני">בינוני</option>
            <option value="קשה">קשה</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">נקודות</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            required
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">אופציות</label>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
            />
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">תשובה נכונה</label>
          <select
            value={correctOption}
            onChange={(e) => setCorrectOption(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option value={0}>אופציה 1</option>
            <option value={1}>אופציה 2</option>
            <option value={2}>אופציה 3</option>
            <option value={3}>אופציה 4</option>
          </select>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            ביטול
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            שמור
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExercise;