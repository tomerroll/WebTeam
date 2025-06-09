import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchExercisesByGrade,
  fetchCompletedSubjects
} from '../../services/exerciseService';
import { fetchStudentById } from '../../services/studentService';

const coin = "🪙";
const crown = "👑";
const star = "⭐";

const Practice = () => {
  const [subjects, setSubjects] = useState([]);
  const [completedSubjects, setCompletedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [crowns, setCrowns] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user || !user._id) return;

    const loadData = async () => {
      try {
        const [exerciseData, studentData, completionData] = await Promise.all([
          fetchExercisesByGrade(user.grade),
          fetchStudentById(user._id),
          fetchCompletedSubjects(user._id)
        ]);

        const uniqueSubjects = [...new Set(exerciseData.map(ex => ex.subject))];
        setSubjects(uniqueSubjects);
        setPoints(studentData.points || 0);
        setCrowns(studentData.crowns || 0);
        setCompletedSubjects(completionData || []);
      } catch (err) {
        console.error("Error loading practice data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">בחר נושא לתרגול</h2>

          {loading ? (
            <div className="text-center text-lg font-semibold text-gray-700 dark:text-gray-200">טוען נושאים...</div>
          ) : subjects.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">לא נמצאו נושאים לתרגול</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {subjects.map(subject => {
                const completedObj = completedSubjects.find(s => s.subject === subject);
                const isCompleted = completedObj?.completed;

                const cardClasses = `overflow-hidden shadow rounded-2xl transition-all duration-300 transform text-center ${
                  isCompleted
                    ? 'bg-yellow-100 dark:bg-yellow-900 cursor-not-allowed opacity-80'
                    : 'bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-105 hover:ring-2 hover:ring-primary-500'
                }`;

                const content = (
                  <div className="px-4 py-8 sm:p-8 w-full text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {subject} {isCompleted && <span title="הושלם">{star}</span>}
                    </h3>
                  </div>
                );

                return isCompleted ? (
                  <div key={subject} className={cardClasses}>
                    {content}
                  </div>
                ) : (
                  <Link
                    to={`/practice/${encodeURIComponent(subject)}`}
                    key={subject}
                    className={cardClasses}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Practice;
