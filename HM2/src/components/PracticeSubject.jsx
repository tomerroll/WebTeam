import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const coin = "🪙";
const crown = "👑";

const PracticeSubject = () => {
  const { subject } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [points, setPoints] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [fullyCompleted, setFullyCompleted] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user._id) {
      console.warn("No user found");
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchExercises = fetch(`http://localhost:5000/api/exercises/subject/${encodeURIComponent(subject)}`).then(res => res.json());
    const fetchProgress = fetch(`http://localhost:5000/api/progress/${user._id}/${subject}`).then(res => res.json());
    const fetchStudent = fetch(`http://localhost:5000/api/students/${user._id}`).then(res => res.json());

    Promise.all([fetchExercises, fetchProgress, fetchStudent])
      .then(([exerciseData, progressData, studentData]) => {
        const answersFromProgress = progressData?.answers || [];
        const answeredIds = new Set(answersFromProgress.map(a => a.questionId?.toString()));
        const incorrectAnswers = answersFromProgress.filter(a => !a.isCorrect);
        const incorrectIds = new Set(incorrectAnswers.map(a => a.questionId?.toString()));

        let newExercises = [];

        // אם יש טעויות – תרגל רק אותן
        if (progressData?.completed && incorrectIds.size > 0) {
          newExercises = exerciseData.filter(ex => incorrectIds.has(ex._id.toString()));
        } else {
          // אחרת: תרגל רק שאלות חדשות שלא הופיעו קודם
          newExercises = exerciseData.filter(ex => !answeredIds.has(ex._id.toString()));
        }

        const fullyCompleted = progressData?.completed && newExercises.length === 0;
        setFullyCompleted(fullyCompleted);

        setExercises(newExercises);
        setCurrent(0);
        setCompleted(false);
        setPoints(studentData?.points || 0);
        setAnswers([]);
      })
      .catch(err => {
        console.error("Error loading data:", err);
      })
      .finally(() => setLoading(false));
  }, [subject]);

  const addPoints = (amount) => {
    setPoints(prev => prev + amount);
    fetch(`http://localhost:5000/api/students/addPoints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: user._id, points: amount })
    });
  };

  const addCrown = () => {
    fetch(`http://localhost:5000/api/students/addCrown`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: user._id })
    });
  };

  const updateProgress = (newIndex, isComplete = false) => {
    fetch('http://localhost:5000/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student: user._id,
        subject,
        currentIndex: newIndex,
        completed: isComplete,
        answers
      })
    });
  };

  const handleSelect = idx => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === exercises[current].correctOption;
    setIsCorrect(isCorrect);
    handleAnswer(current, exercises[current].options[idx], isCorrect);
    if (isCorrect) {
      addPoints(exercises[current].points);
    }
  };

  const handleNext = () => {
    const nextIndex = current + 1;
    const isFinished = nextIndex >= exercises.length;

    updateProgress(nextIndex, isFinished);
    setCurrent(nextIndex);
    setSelected(null);
    setIsCorrect(null);

    if (isFinished) {
      const correctCount = answers.filter(a => a.isCorrect).length;
      if (correctCount === exercises.length) {
        addCrown();
        setFullyCompleted(true);
      }
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
      const previousAnswer = answers[current - 1];
      if (previousAnswer) {
        const selectedIndex = exercises[current - 1].options.indexOf(previousAnswer.selectedAnswer);
        setSelected(selectedIndex);
        setIsCorrect(previousAnswer.isCorrect);
      } else {
        setSelected(null);
        setIsCorrect(null);
      }
    }
  };

  const handleAnswer = (questionIndex, answer, isCorrect) => {
    const questionId = exercises[questionIndex]._id;
    setAnswers(prev => [
      ...prev,
      { questionIndex, questionId, selectedAnswer: answer, isCorrect }
    ]);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">טוען תרגילים...</div>;
  }

  if (fullyCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">כל הכבוד! {crown}</h2>
          <p className="mb-4">סיימת את כל התרגילים בנושא: {subject}</p>
          <div className="text-xl font-bold mb-2">
            סה"כ ניקוד: {points} {coin}
          </div>
          <Link
            to="/practice"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            חזור לנושאים
          </Link>
        </div>
      </div>
    );
  }

  if (completed || current >= exercises.length) {
    const correctAnswersCount = answers.filter(answer => answer.isCorrect).length;
    const allCorrect = correctAnswersCount === exercises.length;

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          {allCorrect ? (
            <>
              <h2 className="text-2xl font-bold mb-4">כל הכבוד! {crown}</h2>
              <p className="mb-4">סיימת את כל התרגילים בנושא: {subject}</p>
              <div className="text-xl font-bold mb-2">
                סה"כ ניקוד: {points} {coin}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">הצלחת ב-{correctAnswersCount} מתוך {exercises.length} שאלות</h2>
              <p className="mb-4">נסה שוב את התרגילים בנושא: {subject}</p>
            </>
          )}
          <Link
            to="/practice"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            חזור לנושאים
          </Link>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">אין שאלות לתרגול כרגע.</div>;
  }

  const ex = exercises[current];
  if (!ex) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">לא ניתן לטעון את התרגיל.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold cursor-pointer" onClick={() => window.location.href = '/student-dashboard'}>MathDuo</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">{points} {coin}</span>
            <span className="text-lg font-bold">{user.crowns} {crown}</span>
            {completed && <span className="text-2xl">{crown}</span>}
            <Link to="/practice" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">חזור לנושאים</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto py-8 px-4">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div className="bg-blue-500 h-4 rounded-full transition-all duration-300" style={{ width: `${((current + 1) / exercises.length) * 100}%` }}></div>
        </div>
        <h2 className="text-2xl font-bold mb-8 text-center">תרגיל {current + 1} מתוך {exercises.length} בנושא: {subject}</h2>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold mb-2">{ex.title}</h3>
          <p className="mb-4">{ex.description}</p>
          <ul>
            {ex.options.map((opt, idx) => {
              let btnClass = "w-full text-right px-4 py-2 mb-2 rounded border transition-colors duration-200";
              if (selected !== null) {
                if (idx === selected) {
                  btnClass += isCorrect ? " bg-green-200 border-green-500" : " bg-red-200 border-red-500";
                } else if (idx === ex.correctOption) {
                  btnClass += " bg-green-100 border-green-400";
                } else {
                  btnClass += " bg-gray-100 border-gray-200";
                }
              } else {
                btnClass += " bg-gray-50 border-gray-200 hover:bg-blue-100";
              }

              return (
                <li key={idx}>
                  <button className={btnClass} disabled={selected !== null} onClick={() => handleSelect(idx)}>
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
          {selected !== null && (
            <div className="mt-4 flex justify-between items-center">
              <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {isCorrect ? "תשובה נכונה!" : "תשובה שגויה"}
              </span>
              <div className="flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleNext}>
                  {current < exercises.length - 1 ? "הבא" : "סיום"}
                </button>
                {current > 0 && (
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2" onClick={handlePrevious}>
                    חזור
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PracticeSubject;
