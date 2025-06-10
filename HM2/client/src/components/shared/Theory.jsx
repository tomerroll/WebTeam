// src/components/shared/Theory.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// נשתמש רק בפונקציה ששולפת הכל
import { fetchTheoryContent } from '../../services/theoryService';

const Theory = () => {
  const [uniqueTitles, setUniqueTitles] = useState([]); // לשמירת ה-titles הייחודיים
  const [allTheoryContent, setAllTheoryContent] = useState([]); // לשמירת כל התוכן שנשלף
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllTheory = async () => {
      try {
        const data = await fetchTheoryContent(); // שולפים את כל התיאוריה
        setAllTheoryContent(data); // שומרים את כל המידע
        
        // מחלצים את ה-titles הייחודיים
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">בחר נושא לתיאוריה</h2>

          {loading ? (
            <div className="text-center text-lg font-semibold text-gray-700 dark:text-gray-200">טוען נושאים...</div>
          ) : uniqueTitles.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">לא נמצאו נושאים לתיאוריה</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {uniqueTitles.map(title => (
                <Link
                  // הנושא בנתיב הוא ה-title
                  to={`/theory/${encodeURIComponent(title)}`} 
                  key={title}
                  className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-2xl transition-all duration-300 transform text-center
                             hover:shadow-xl hover:scale-105 hover:ring-2 hover:ring-primary-500"
                >
                  <div className="px-4 py-8 sm:p-8 w-full text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Theory;