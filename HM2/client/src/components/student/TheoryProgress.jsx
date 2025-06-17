import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { theoryProgressService } from '../../services/theoryProgressService';
import { fetchTheoryContent } from '../../services/theoryService';

const TheoryProgress = () => {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allTheories, setAllTheories] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadProgressData = useCallback(async () => {
    if (!user._id) {
      console.warn('User ID not found in localStorage, cannot load theory progress.');
      setLoading(false);
      return;
    }
    console.log('User ID from localStorage:', user._id);
    
    try {
      // טעינת כל תכני התיאוריה
      const theoriesData = await fetchTheoryContent();
      setAllTheories(theoriesData);
      
      // טעינת התקדמות התלמיד
      const progressData = await theoryProgressService.getAllTheoryProgress(user._id);
      setProgress(progressData);
      
      // חישוב סטטיסטיקות
      const completedCount = progressData.filter(p => p.status === 'הושלם').length;
      const totalCount = theoriesData.length;
      const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      
      setStats({
        totalTheories: totalCount,
        completedTheories: completedCount,
        completionRate,
      });
      
    } catch (error) {
      console.error('Error loading theory progress:', error);
      // אם יש שגיאה, נציג רק את תכני התיאוריה
      try {
        const theoriesData = await fetchTheoryContent();
        setAllTheories(theoriesData);
        setStats({
          totalTheories: theoriesData.length,
          completedTheories: 0,
          completionRate: 0,
        });
      } catch (theoryError) {
        console.error('Error loading theories:', theoryError);
      }
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'לא התחיל': return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      case 'בקריאה': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'בדוגמאות': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'הושלם': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'לא התחיל': return '⭕';
      case 'בקריאה': return '📖';
      case 'בדוגמאות': return '🎯';
      case 'הושלם': return '✅';
      default: return '⭕';
    }
  };

  const getCompletionBadge = (status) => {
    if (status === 'הושלם') {
      return (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg animate-pulse">
            ✓
          </div>
        </div>
      );
    }
    return null;
  };

  const getTheoryProgress = (theoryId) => {
    return progress.find(p => p.theory && p.theory._id === theoryId) || null;
  };
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          טוען התקדמות תיאוריה...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-blue-800 dark:text-white drop-shadow">
          התקדמות תיאוריה
        </h2>

        {/* סטטיסטיקות כלליות */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              סטטיסטיקות כלליות
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {Math.round(stats.completionRate)}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">אחוז השלמה</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stats.completedTheories}
                </div>
                <div className="text-gray-600 dark:text-gray-400">הושלמו</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.totalTheories}
                </div>
                <div className="text-gray-600 dark:text-gray-400">סה"כ נושאים</div>
              </div>
            </div>
          </div>
        )}

        {/* רשימת התקדמות */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            התקדמות לפי נושא
          </h3>
          
          {allTheories.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-lg mb-4">לא נמצאו תכני תיאוריה</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allTheories.map((theory) => {
                const theoryProgress = getTheoryProgress(theory._id);
                const status = theoryProgress?.status || 'לא התחיל';
                
                return (
                  <div
                    key={theory._id}
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow relative ${
                      status === 'הושלם' ? 'ring-2 ring-green-500 dark:ring-green-400 bg-green-50 dark:bg-green-900/10' : ''
                    }`}
                  >
                    {/* סמל השלמה */}
                    {getCompletionBadge(status)}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {theory.title}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                            {getStatusIcon(status)} {status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>📚 {theory.difficulty}</span>
                          <span>⏱️ {theory.estimatedTime} דקות</span>
                          {theoryProgress?.readingProgress?.timeSpent > 0 && (
                            <span>📖 {Math.round(theoryProgress.readingProgress.timeSpent)} דקות קריאה</span>
                          )}
                          {theoryProgress?.interactiveProgress?.totalCorrect > 0 && (
                            <span>🎯 {theoryProgress.interactiveProgress.totalCorrect} דוגמאות נכונות</span>
                          )}
                          {theoryProgress?.rating && (
                            <span>⭐ {theoryProgress.rating}/5</span>
                          )}
                          {theoryProgress?.lastAccessedAt && (
                            <span>🕒 {new Date(theoryProgress.lastAccessedAt).toLocaleDateString('he-IL')}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/theory/${encodeURIComponent(theory.title)}`}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            status === 'הושלם' 
                              ? 'bg-green-500 hover:bg-green-600 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {status === 'הושלם' ? 'צפה שוב' : 'התחל'}
                        </Link>
                      </div>
                    </div>
                    
                    {theoryProgress?.notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>הערות:</strong> {theoryProgress.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* כפתור חזרה */}
        <div className="mt-8 text-center">
          <Link
            to="/student-dashboard"
            className="inline-block px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition"
          >
            חזור לדשבורד
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TheoryProgress; 