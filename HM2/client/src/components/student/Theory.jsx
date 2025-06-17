import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTheoryContent } from '../../services/theoryService';
import { theoryProgressService } from '../../services/theoryProgressService';

/**
 * Theory Component
 * 
 * A theory content selection interface that displays available theoretical topics
 * for students to learn. Features include difficulty levels, progress tracking,
 * completion status, estimated time, interactive examples, and prerequisites.
 * The component shows theory cards with visual indicators for completion status
 * and provides navigation to detailed theory content.
 * 
 * @returns {JSX.Element} - Theory topic selection interface
 */
const Theory = () => {
  const [theoryData, setTheoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Load theory content and progress data
  useEffect(() => {
    const loadAllTheory = async () => {
      try {
        const data = await fetchTheoryContent();
        setTheoryData(data);
        
        // Load progress data if user is logged in
        if (user._id) {
          try {
            let progress = await theoryProgressService.getAllTheoryProgress(user._id);
            // Normalize status: change 'Completed' to 'הושלם'
            progress = progress.map(p => ({
              ...p,
              status: p.status === 'Completed' ? 'הושלם' : p.status
            }));
            setProgressData(progress);
          } catch (error) {
            console.error('Error loading progress:', error);
          }
        }
      } catch (err) {
        console.error('שגיאה בטעינת נושאי תיאוריה:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllTheory();
  }, [user._id]);

  /**
   * Returns color classes based on difficulty level
   * @param {string} difficulty - Difficulty level ('קל', 'בינוני', 'קשה')
   * @returns {string} - Tailwind CSS classes for styling
   */
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'קל': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'בינוני': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'קשה': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  /**
   * Returns emoji icon based on difficulty level
   * @param {string} difficulty - Difficulty level
   * @returns {string} - Emoji icon
   */
  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'קל': return '🟢';
      case 'בינוני': return '🟡';
      case 'קשה': return '🔴';
      default: return '⚪';
    }
  };

  /**
   * Gets progress data for a specific theory
   * @param {string} theoryId - Theory ID
   * @returns {Object|null} - Progress data or null if not found
   */
  const getTheoryProgress = (theoryId) => {
    return progressData.find(p => p.theory?._id === theoryId) || null;
  };

  /**
   * Determines completion status and styling for a theory
   * @param {Object} theory - Theory object
   * @returns {Object} - Status object with status, icon, and color
   */
  const getCompletionStatus = (theory) => {
    const progress = getTheoryProgress(theory._id);
    if (!progress) return { status: 'לא התחיל', icon: '⭕', color: 'text-gray-400' };
    
    switch (progress.status) {
      case 'לא התחיל': return { status: 'לא התחיל', icon: '⭕', color: 'text-gray-400' };
      case 'בקריאה': return { status: 'בקריאה', icon: '📖', color: 'text-blue-500' };
      case 'בדוגמאות': return { status: 'בדוגמאות', icon: '🎯', color: 'text-yellow-500' };
      case 'הושלם': return { status: 'הושלם', icon: '✅', color: 'text-green-500' };
      default: return { status: 'לא התחיל', icon: '⭕', color: 'text-gray-400' };
    }
  };

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
        ) : theoryData.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            לא נמצאו נושאים לתיאוריה
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theoryData.map((theory) => {
              const completionStatus = getCompletionStatus(theory);
              
              return (
                <Link
                  to={`/theory/${encodeURIComponent(theory.title)}`}
                  key={theory._id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden relative ${ 
                    completionStatus.status === 'הושלם' 
                      ? 'ring-2 ring-green-500 dark:ring-green-400 bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-600' 
                      : ''
                  }`}
                >
                  {/* סמל השלמה */}
                  {completionStatus.status === 'הושלם' && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg animate-pulse">
                        ✓
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* כותרת ורמה */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-xl font-bold ${
                        completionStatus.status === 'הושלם' 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-gray-800 dark:text-white'
                      }`}>
                        {theory.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(theory.difficulty)}`}>
                        {getDifficultyIcon(theory.difficulty)} {theory.difficulty}
                      </span>
                    </div>

                    {/* סטטוס התקדמות */}
                    <div className="mb-4">
                      <div className={`flex items-center gap-2 text-sm font-medium ${completionStatus.color}`}>
                        <span className="text-lg">{completionStatus.icon}</span>
                        <span>{completionStatus.status}</span>
                      </div>
                    </div>

                    {/* תיאור */}
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      completionStatus.status === 'הושלם' 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {theory.description}
                    </p>

                    {/* מידע נוסף */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-2">⏱️</span>
                        <span>{theory.estimatedTime || 10} דקות</span>
                      </div>
                      
                      {theory.interactiveExamples?.length > 0 && (
                        <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                          <span className="mr-2">🎯</span>
                          <span>{theory.interactiveExamples.length} דוגמאות אינטראקטיביות</span>
                        </div>
                      )}
                      
                      {theory.visualExamples?.length > 0 && (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <span className="mr-2">🖼️</span>
                          <span>{theory.visualExamples.length} המחשות ויזואליות</span>
                        </div>
                      )}
                    </div>

                    {/* תגיות */}
                    {theory.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {theory.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {theory.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{theory.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* דרישות קדם */}
                    {theory.prerequisites?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">דרישות קדם:</p>
                        <div className="flex flex-wrap gap-1">
                          {theory.prerequisites.map((prereq, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full"
                            >
                              {prereq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* כפתור התחלה */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className={`text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        completionStatus.status === 'הושלם' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      }`}>
                        {completionStatus.status === 'הושלם' ? 'צפה שוב' : 'התחל ללמוד'} →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* מידע נוסף */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            איך ללמוד ביעילות?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">קרא את התיאוריה</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                התחל בקריאת החומר התיאורטי כדי להבין את המושגים הבסיסיים
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">תרגל עם דוגמאות</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ענה על הדוגמאות האינטראקטיביות כדי לבדוק את ההבנה שלך
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">תרגל עם שאלות</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                עבור לתרגול מלא כדי לחזק את הידע ולצבור נקודות
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Theory;
