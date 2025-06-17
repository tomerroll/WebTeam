import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchExercisesByGrade,
  fetchCompletedSubjects
} from '../../services/exerciseService';
import { fetchStudentById } from '../../services/studentService';

/**
 * Practice Component
 * 
 * A subject selection interface for students to choose which topics they want to practice.
 * Displays available subjects based on the student's grade level, shows completion status
 * for each subject, and tracks student progress with points and crowns. Completed subjects
 * are visually marked and disabled from further practice.
 * 
 * @returns {JSX.Element} - Subject selection grid with completion status
 */

// Star emoji for completed subjects
const star = "⭐";

const Practice = () => {
  const [subjects, setSubjects] = useState([]);
  const [completedSubjects, setCompletedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [crowns, setCrowns] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Load subjects, student data, and completion status
  useEffect(() => {
    if (!user || !user._id) return;

    const loadData = async () => {
      try {
        // Fetch exercises, student data, and completion status in parallel
        const [exerciseData, studentData, completionData] = await Promise.all([
          fetchExercisesByGrade(user.grade),
          fetchStudentById(user._id),
          fetchCompletedSubjects(user._id)
        ]);

        // Extract unique subjects from exercises
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
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <main className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-blue-800 dark:text-white drop-shadow">
          איזה נושא תרצה לתרגל?
        </h2>

        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-700 dark:text-gray-200">
            טוען נושאים...
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            לא נמצאו נושאים לתרגול
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => {
              const completedObj = completedSubjects.find(s => s.subject === subject);
              const isCompleted = completedObj?.completed;

              const bg = isCompleted
                ? 'bg-yellow-400 dark:bg-yellow-500'
                : 'bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-700 dark:to-cyan-600';

              const cardClasses = `relative rounded-2xl text-white text-center p-6 h-36 flex flex-col justify-center items-center shadow-lg transition duration-300 transform ${bg} ${
                isCompleted
                  ? 'cursor-not-allowed opacity-80 ring-2 ring-red-500'
                  : 'hover:scale-105 hover:shadow-2xl'
              }`;

              const content = (
                <>
                  <h3 className="text-2xl font-bold z-10">{subject}</h3>
                  {isCompleted && (
                    <p className="mt-1 text-base z-10">{star} הושלם</p>
                  )}
                </>
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
      </main>
    </div>
  );
};

export default Practice;
