// src/components/shared/TheorySubject.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// נשתמש רק בפונקציה ששולפת הכל
import { fetchTheoryContent } from '../../services/theoryService';

const TheorySubject = () => {
  const { subject } = useParams(); // ה-subject הזה הוא למעשה ה-title מה-DB
  const [loading, setLoading] = useState(true);
  const [filteredTheoryItems, setFilteredTheoryItems] = useState([]); // לשמירת הפריטים המסוננים

  // Removed expandedItems state and toggleContent function

  useEffect(() => {
    const loadAndFilterTheory = async () => {
      setLoading(true);
      try {
        const allData = await fetchTheoryContent(); // שולפים את כל התיאוריה
        // מסננים לפי ה-title שהגיע ב-URL
        const items = allData.filter(item => item.title === decodeURIComponent(subject));
        setFilteredTheoryItems(items);
      } catch (err) {
        console.error(`שגיאה בטעינת או סינון תיאוריה עבור: ${decodeURIComponent(subject)}`, err);
        setFilteredTheoryItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      loadAndFilterTheory();
    }
  }, [subject]); // תלוי ב-subject שב-URL

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        טוען תוכן...
      </div>
    );
  }

  if (filteredTheoryItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <p className="text-lg mb-4">לא נמצא תוכן תיאורטי לנושא: "{decodeURIComponent(subject)}".</p>
        <Link
          to="/theory"
          className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 text-white transition duration-200"
        >
          חזור לנושאי תיאוריה
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="w-full max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
          תוכן תיאורטי: {decodeURIComponent(subject)}
        </h2>

        <Link
          to="/theory"
          className="inline-flex items-center px-4 py-2 mb-6 border border-transparent text-sm font-medium rounded-md text-primary-700 dark:text-primary-200 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          &larr; חזור לנושאי תיאוריה
        </Link>

        <div className="space-y-6">
          {filteredTheoryItems.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-5 sm:p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                  {item.description}
                </p>

                {/* Directly display the content */}
                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                    {item.content}
                  </p>
                </div>

                {/* Removed the "read more" button */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheorySubject;