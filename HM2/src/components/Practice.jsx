import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Practice = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/subjects');
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const fetchExercises = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/exercises?subject=${selectedSubject}`);
          const data = await res.json();
          setExercises(data);
        } catch (err) {
          console.error('Error fetching exercises:', err);
        }
      };

      fetchExercises();
    }
  }, [selectedSubject]);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedExercise(null);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    updateStudentProgress(answer === selectedExercise.correctAnswer);
  };

  const updateStudentProgress = async (success) => {
    try {
      await fetch('http://localhost:5000/api/student-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: 'student_id', // Replace with actual student ID
          exercise: selectedExercise._id,
          success,
        }),
      });
    } catch (err) {
      console.error('Error updating student progress:', err);
    }
  };

  const handleNextExercise = () => {
    setSelectedExercise(null);
    setSelectedAnswer('');
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* סרגל עליון */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* חזרה לדף הבית */}
            <Link
              to="/student-dashboard"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
               חזרה לדף הבית
            </Link>

            {/* שלום, שם המשתמש */}
            <Link
              to="/profile"
              className="text-gray-600 hover:text-primary-600 font-medium"
              title="עבור לפרופיל"
            >
              שלום, {userName}
            </Link>
          </div>
        </div>
      </nav>

      {/* תוכן */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">תרגול</h2>

          {!selectedSubject ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div key={subject._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                    <button
                      onClick={() => handleSubjectSelect(subject.name)}
                      className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                    >
                      בחר נושא
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : !selectedExercise ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exercises.map((exercise) => (
                <div key={exercise._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{exercise.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{exercise.description}</p>
                    <button
                      onClick={() => handleExerciseSelect(exercise)}
                      className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                    >
                      בחר תרגיל
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{selectedExercise.title}</h3>
              <p className="text-lg text-gray-700 mb-4">{selectedExercise.question}</p>

              <div className="space-y-4">
                {selectedExercise.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={`w-full text-right p-4 rounded-lg border ${
                      showResult
                        ? option === selectedExercise.correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : option === selectedAnswer
                          ? 'bg-red-100 border-red-500'
                          : 'bg-gray-50 border-gray-300'
                        : selectedAnswer === option
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className="mt-6">
                  <button
                    onClick={handleNextExercise}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    תרגיל הבא
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Practice;
