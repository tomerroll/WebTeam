import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTheoryContent } from '../../services/theoryService';

const TheorySubject = () => {
  const { subject } = useParams();
  const [loading, setLoading] = useState(true);
  const [filteredTheoryItems, setFilteredTheoryItems] = useState([]);

  useEffect(() => {
    const loadAndFilterTheory = async () => {
      setLoading(true);
      try {
        const allData = await fetchTheoryContent();
        const items = allData.filter(item => item.title === decodeURIComponent(subject));
        setFilteredTheoryItems(items);
      } catch (err) {
        console.error(`שגיאה בטעינת תוכן עבור: ${decodeURIComponent(subject)}`, err);
        setFilteredTheoryItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      loadAndFilterTheory();
    }
  }, [subject]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        טוען תוכן...
      </div>
    );
  }

  if (filteredTheoryItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800">
        <p className="text-lg mb-4">לא נמצא תוכן לנושא: "{decodeURIComponent(subject)}"</p>
        <Link
          to="/theory"
          className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          חזור לנושאי תיאוריה
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800 dark:text-white drop-shadow">
          תוכן תיאורטי: {decodeURIComponent(subject)}
        </h2>

        <div className="mb-8 text-center">
          <Link
            to="/theory"
            className="inline-block px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow transition"
          >
            ← חזור לנושאים
          </Link>
        </div>

        <div className="space-y-8">
          {filteredTheoryItems.map((item) => (
            <div
              key={item._id}
              className="bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-6 transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-blue-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base mb-4">
                {item.description}
              </p>
              <div className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheorySubject;
