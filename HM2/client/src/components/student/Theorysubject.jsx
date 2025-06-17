import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchTheoryContent } from '../../services/theoryService';
import { theoryProgressService } from '../../services/theoryProgressService';
import { fetchExercisesBySubject } from '../../services/exerciseService';

/**
 * TheorySubject Component
 * 
 * A comprehensive theory learning interface that displays detailed theoretical content
 * for a specific subject. Features include interactive examples, visual examples,
 * progress tracking, reading time monitoring, YouTube video integration, and
 * adaptive learning flow. The component manages student progress through different
 * stages: reading, interactive examples, and completion.
 * 
 * @returns {JSX.Element} - Interactive theory learning interface with progress tracking
 */
const TheorySubject = () => {
  const { subject } = useParams();
  const [loading, setLoading] = useState(true);
  const [filteredTheoryItems, setFilteredTheoryItems] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedExamples, setCompletedExamples] = useState([]);
  const [progress, setProgress] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [hasExercises, setHasExercises] = useState(false);
  const [exercisesLoading, setExercisesLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  // Load theory content and initialize progress tracking
  useEffect(() => {
    const loadAndFilterTheory = async () => {
      setLoading(true);
      try {
        const allData = await fetchTheoryContent();
        console.log('All theory data from API:', allData);
        const items = allData.filter(item => item.title === decodeURIComponent(subject));
        console.log('Filtered theory items for current subject:', items);
        setFilteredTheoryItems(items);
        
        if (items.length > 0 && user._id) {
          // Load student progress
          try {
            const progressData = await theoryProgressService.getTheoryProgress(user._id, items[0]._id);
            setProgress(progressData);
            
            // Update status to "reading" if not started
            if (progressData.status === 'לא התחיל') {
              await theoryProgressService.updateTheoryStatus(user._id, items[0]._id, 'בקריאה');
              setProgress(prev => ({ ...prev, status: 'בקריאה' }));
            }
          } catch (error) {
            console.error('Error loading progress:', error);
          }
        }
        
        setStartTime(new Date());
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
  }, [subject, user._id]);

  // Update reading time when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (startTime && progress && user._id && filteredTheoryItems.length > 0) {
        const timeSpent = Math.round((new Date() - startTime) / 1000 / 60); // in minutes
        try {
          await theoryProgressService.updateReadingProgress(user._id, filteredTheoryItems[0]._id, {
            timeSpent: (progress.readingProgress?.timeSpent || 0) + timeSpent
          });
        } catch (error) {
          console.error('Error updating reading time:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [startTime, progress, user._id, filteredTheoryItems]);

  // Check if exercises exist for this subject
  useEffect(() => {
    const checkExercises = async () => {
      if (!subject) return;
      
      setExercisesLoading(true);
      try {
        const exercises = await fetchExercisesBySubject(subject);
        setHasExercises(exercises && exercises.length > 0);
      } catch (error) {
        console.error('Error checking exercises:', error);
        setHasExercises(false);
      } finally {
        setExercisesLoading(false);
      }
    };

    checkExercises();
  }, [subject]);

  /**
   * Handles interactive example answer selection and progress updates
   * @param {number} answerIndex - Index of selected answer
   */
  const handleExampleAnswer = async (answerIndex) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const currentTheory = filteredTheoryItems[0];
    const currentExample = currentTheory?.interactiveExamples?.[currentExampleIndex];
    
    if (currentExample && user._id) {
      const isCorrect = answerIndex === currentExample.correctAnswer;
      
      if (isCorrect) {
        setCompletedExamples(prev => [...prev, currentExampleIndex]);
      } else {
        // If failed the question - reset all progress
        try {
          await theoryProgressService.resetTheoryProgress(user._id, currentTheory._id);
          setProgress(prev => ({ 
            ...prev, 
            status: 'לא התחיל',
            readingProgress: {
              startedAt: null,
              completedAt: null,
              timeSpent: 0,
              sectionsRead: []
            },
            interactiveProgress: {
              examplesCompleted: [],
              totalCorrect: 0,
              totalAttempts: 0
            }
          }));
          setCompletedExamples([]);
          setCurrentExampleIndex(0);
          
          // Show feedback to user
          setFeedbackMessage('❌ טעית בשאלה! ההתקדמות אופסה. התחל מחדש מההתחלה.');
          setShowOverlay(true);
          setTimeout(() => {
            setShowOverlay(false);
            setSelectedAnswer(null);
            setShowExplanation(false);
          }, 3000);
          return;
        } catch (error) {
          console.error('Error resetting progress:', error);
        }
      }
      
      // Update example progress only if answer is correct
      if (isCorrect) {
        try {
          await theoryProgressService.updateInteractiveProgress(user._id, currentTheory._id, {
            exampleIndex: currentExampleIndex,
            isCorrect,
            timeSpent: 1, // one minute
            attempts: 1
          });
          
          // Update status to "examples" if currently reading
          if (progress?.status === 'בקריאה') {
            await theoryProgressService.updateTheoryStatus(user._id, currentTheory._id, 'בדוגמאות');
            setProgress(prev => ({ ...prev, status: 'בדוגמאות' }));
          }
        } catch (error) {
          console.error('Error updating interactive progress:', error);
        }
      }
    }
  };

  /**
   * Handles navigation to next interactive example or completion
   */
  const handleNextExample = async () => {
    const currentTheory = filteredTheoryItems[0];
    const examples = currentTheory?.interactiveExamples || [];
    
    console.log('handleNextExample called');
    console.log('currentExampleIndex:', currentExampleIndex);
    console.log('examples.length:', examples.length);
    console.log('completedExamples:', completedExamples);
    
    if (currentExampleIndex < examples.length - 1) {
      console.log('Moving to next example (not last example)');
      setCurrentExampleIndex(currentExampleIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      console.log('Attempting to complete theory (last example)');
      
      // Check that all interactive questions are completed
      const allExamplesCompleted = examples.length > 0 && completedExamples.length === examples.length;
      
      if (!allExamplesCompleted) {
        setFeedbackMessage('עליך לענות על כל השאלות האינטראקטיביות לפני שתוכל לסיים את התיאוריה!');
        setShowOverlay(true);
        setTimeout(() => {
          setShowOverlay(false);
        }, 3000);
        return;
      }
      
      if (user._id && currentTheory) {
        try {
          console.log('Calling completeTheory API for student:', user._id, 'theory:', currentTheory._id);
          await theoryProgressService.completeTheory(user._id, currentTheory._id);
          console.log('Theory completed successfully!');
          setProgress(prev => ({ ...prev, status: 'הושלם' }));
          
          setFeedbackMessage('🎉 כל הכבוד! סיימת את נושא התיאוריה בהצלחה! 🎉');
          console.log('Feedback message set to:', '🎉 כל הכבוד! סיימת את נושא התיאוריה בהצלחה! 🎉');
          setShowOverlay(true);
          setTimeout(() => {
            setShowOverlay(false);
            navigate('/theory-progress');
          }, 4000);
        } catch (error) {
          console.error('Error completing theory:', error);
          setFeedbackMessage('❌ אירעה שגיאה בעת סיום התיאוריה.');
          console.log('Feedback message set to (error):', '❌ אירעה שגיאה בעת סיום התיאוריה.');
          setShowOverlay(true);
          setTimeout(() => {
            setShowOverlay(false);
          }, 3000);
        }
      } else {
        console.log('Missing user ID or current theory object for completion', { user_id: user._id, currentTheory: currentTheory });
      }
    }
  };

  const handlePreviousExample = () => {
    if (currentExampleIndex > 0) {
      setCurrentExampleIndex(currentExampleIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const formatContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={index}>{line.slice(2, -2)}</strong>;
      }
      return <span key={index}>{line}<br /></span>;
    });
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?/;
    const match = url.match(regExp);
    return (match && match[1]) ? `https://www.youtube.com/embed/${match[1]}` : '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'לא התחיל': return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      case 'בקריאה': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'בדוגמאות': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'הושלם': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

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

  const theoryItem = filteredTheoryItems[0];
  const examples = theoryItem.interactiveExamples || [];
  const currentExample = examples[currentExampleIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-2xl font-bold px-8 py-6 rounded-2xl shadow-2xl z-50 animate-bounce text-center max-w-md mx-4">
            <div className="mb-4 text-4xl">
              {feedbackMessage.includes('🎉') ? '🎉' : feedbackMessage.includes('❌') ? '❌' : 'ℹ️'}
            </div>
            <div className="text-lg">
              {feedbackMessage}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800 dark:text-white drop-shadow">
          {theoryItem.title}
        </h2>

        {/* סטטוס התקדמות */}
        {progress && (
          <div className="mb-6 text-center">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(progress.status)}`}>
              סטטוס: {progress.status}
            </span>
            {progress.readingProgress?.timeSpent > 0 && (
              <span className="ml-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                זמן קריאה: {Math.round(progress.readingProgress.timeSpent)} דקות
              </span>
            )}
          </div>
        )}

        <div className="mb-8 text-center">
          <Link
            to="/theory"
            className="inline-block px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow transition"
          >
            ← חזור לנושאים
          </Link>
        </div>

        {/* מידע על הנושא */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              רמה: {theoryItem.difficulty}
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              זמן משוער: {theoryItem.estimatedTime} דקות
            </span>
            {theoryItem.prerequisites?.length > 0 && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                דורש: {theoryItem.prerequisites.join(', ')}
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {theoryItem.description}
          </h3>
          
          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
            {formatContent(theoryItem.content)}
          </div>

          {theoryItem.youtubeLink && theoryItem.youtubeLink.trim() !== '' && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-blue-900 dark:text-white mb-4">
                סרטון הסבר
              </h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(theoryItem.youtubeLink)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

        </div>

        {/* דוגמאות אינטראקטיביות */}
        {examples && examples.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-2xl font-semibold text-blue-900 dark:text-white mb-4">
              תרגול אינטראקטיבי ({currentExampleIndex + 1} מתוך {examples.length})
            </h3>
            
            {currentExample && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    {currentExample.title}
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 mb-4">
                    {currentExample.description}
                  </p>
                  <p className="text-lg font-medium text-gray-800 dark:text-white">
                    {currentExample.question}
                  </p>
                </div>

                <div className="grid gap-3">
                  {currentExample.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentExample.correctAnswer;
                    const isCompleted = selectedAnswer !== null;
                    
                    let buttonClasses = "w-full text-right px-4 py-3 rounded-xl transition-all duration-200 shadow-sm border font-medium";
                    
                    if (isCompleted) {
                      if (isCorrect) {
                        buttonClasses += " bg-green-200 dark:bg-green-700 border-green-500 dark:border-green-400 text-green-900 dark:text-green-200 font-bold";
                      } else if (isSelected) {
                        buttonClasses += " bg-red-200 dark:bg-red-700 border-red-500 dark:border-red-400 text-red-900 dark:text-red-200 font-bold";
                      } else {
                        buttonClasses += " bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";
                      }
                    } else {
                      buttonClasses += " bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:ring-2 hover:ring-blue-300 dark:hover:ring-cyan-500";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleExampleAnswer(index)}
                        disabled={isCompleted}
                        className={buttonClasses}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                      הסבר:
                    </h4>
                    <p className="text-yellow-800 dark:text-yellow-200">
                      {currentExample.explanation}
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousExample}
                    disabled={currentExampleIndex === 0}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    קודם
                  </button>
                  
                  <div className="flex gap-2">
                    {examples.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          completedExamples.includes(index)
                            ? 'bg-green-500'
                            : index === currentExampleIndex
                            ? 'bg-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => {
                      console.log('Finish/Next button clicked');
                      console.log('selectedAnswer on click:', selectedAnswer);
                      console.log('currentExampleIndex on click:', currentExampleIndex);
                      console.log('examples.length on click:', examples.length);
                      handleNextExample();
                    }}
                    disabled={selectedAnswer === null}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentExampleIndex === examples.length - 1 ? 'סיים' : 'הבא'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl shadow-xl p-6 mb-8 text-center">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">
              אין דוגמאות אינטראקטיביות זמינות
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              עבור לסעיף התרגול כדי לתרגל את החומר שלמדת
            </p>
          </div>
        )}

        {/* קישור לתרגול */}
        {!exercisesLoading && (
          hasExercises ? (
            <div className="bg-gradient-to-r from-green-400 to-blue-400 dark:from-green-600 dark:to-blue-600 rounded-2xl shadow-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 drop-shadow">
                מוכן לתרגול?
              </h3>
              <p className="text-white/90 mb-6 text-lg">
                עכשיו תוכל לתרגל את החומר שלמדת עם שאלות מותאמות אישית
              </p>
              <Link
                to={`/practice/${encodeURIComponent(theoryItem.title)}`}
                className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                התחל לתרגל עכשיו →
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-600 dark:to-orange-600 rounded-2xl shadow-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 drop-shadow">
                אין עדיין תרגילים זמינים
              </h3>
              <p className="text-white/90 mb-6 text-lg">
                בנושא <span className="font-semibold">{theoryItem.title}</span> עדיין לא נוספו תרגילים למערכת
              </p>
              <p className="text-white/80 mb-6 text-base">
                המורה יוסיף תרגילים בקרוב. בינתיים תוכל לתרגל נושאים אחרים!
              </p>
              <Link
                to="/practice"
                className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                עבור לנושאים אחרים →
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TheorySubject;
