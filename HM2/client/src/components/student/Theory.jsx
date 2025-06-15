import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTheoryContent } from '../../services/theoryService';

const Theory = () => {
  const [uniqueTitles, setUniqueTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllTheory = async () => {
      try {
        const data = await fetchTheoryContent();
        const titles = [...new Set(data.map(item => item.title))];
        setUniqueTitles(titles);
      } catch (err) {
        console.error('שגיאה בטעינת נושאי תיאוריה:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllTheory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <main className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-blue-800 dark:text-white drop-shadow">
          בחר נושא לתיאוריה
        </h2>

        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-700 dark:text-gray-200">
            טוען נושאים...
          </div>
        ) : uniqueTitles.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            לא נמצאו נושאים לתיאוריה
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {uniqueTitles.map(title => (
              <Link
                to={`/theory/${encodeURIComponent(title)}`}
                key={title}
                className="bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-700 dark:to-cyan-600
                           text-white h-36 rounded-2xl shadow-lg text-2xl font-bold text-center
                           flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {title}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Theory;
