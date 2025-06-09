import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchExercisesBySubject,
  fetchProgressBySubject,
  updateProgress
} from '../../services/exerciseService';
import {
  fetchStudentById,
  addPoints,
  addCrown
} from '../../services/studentService';


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
  const [crowns, setCrowns] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [fullyCompleted, setFullyCompleted] = useState(false);
  const [previousAnswers, setPreviousAnswers] = useState([]);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user._id) {
      console.warn("No user found");
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchExercises = fetchExercisesBySubject(subject);
    const fetchProgress = fetchProgressBySubject(user._id, subject);
    const fetchStudent = fetchStudentById(user._id);
    

    Promise.all([fetchExercises, fetchProgress, fetchStudent])
      .then(([exerciseData, progressData, studentData]) => {
        const answersFromProgress = progressData?.answers || [];
        const answeredIds = new Set(answersFromProgress.map(a => a.questionId?.toString()));
        const incorrectAnswers = answersFromProgress.filter(a => !a.isCorrect);
        const incorrectIds = new Set(incorrectAnswers.map(a => a.questionId?.toString()));

        let newExercises = exerciseData.filter(ex => incorrectIds.has(ex._id.toString()) || !answeredIds.has(ex._id.toString()));
        newExercises.sort((a, b) => a.difficulty - b.difficulty);

        const fullyCompleted = progressData?.completed && newExercises.length === 0;
        setFullyCompleted(fullyCompleted);

        setExercises(newExercises);
        setCurrent(0);
        setCompleted(false);
        setPoints(studentData?.points || 0);
        setCrowns(studentData?.crowns || 0);
        setAnswers([]);
        setPreviousAnswers(answersFromProgress);
      })
      .catch(err => {
        console.error("Error loading data:", err);
      })
      .finally(() => setLoading(false));
  }, [subject, user._id]);


  const handleSelect = async idx => {
    if (selected !== null) return;
    setSelected(idx);

    const correct = idx === exercises[current].correctOption;
    setIsCorrect(correct);

    const selectedAnswer = exercises[current].options[idx];
    const questionId = exercises[current]._id.toString();

    const alreadyAnsweredBefore = previousAnswers.some(a => a.questionId?.toString() === questionId);
    const questionPoints = exercises[current].points;

    try {
      if (correct) {
        let pointsToAdd;
        if (!alreadyAnsweredBefore) {
          pointsToAdd = questionPoints;
        } else {
          pointsToAdd = Math.floor(questionPoints / 2);
        }
        
        const response = await addPoints(user._id, pointsToAdd);
        setPoints(response.points);
        setEarnedPoints(pointsToAdd);
        window.dispatchEvent(new CustomEvent('pointsUpdated', {
          detail: { points: response.points }
        }));
      } else {
        setEarnedPoints(0);
      }

      const updatedAnswers = [
        ...answers.filter(a => a.questionId !== questionId),
        { questionIndex: current, questionId, selectedAnswer, isCorrect: correct }
      ];
      setAnswers(updatedAnswers);

      await updateProgress({
        student: user._id,
        subject,
        currentIndex: current + 1,
        completed: false,
        answers: updatedAnswers
      });
    } catch (err) {
      console.error('Error updating points or progress:', err);
    }
  };

  const handleNext = async () => {
    const nextIndex = current + 1;
    const isFinished = nextIndex >= exercises.length;

    setCurrent(nextIndex);

    const nextAnswer = answers.find(a => a.questionIndex === nextIndex);
    if (nextAnswer) {
      const selectedIdx = exercises[nextIndex]?.options.indexOf(nextAnswer.selectedAnswer);
      setSelected(selectedIdx);
      setIsCorrect(nextAnswer.isCorrect);
      setEarnedPoints(0);
    } else {
      setSelected(null);
      setIsCorrect(null);
      setEarnedPoints(0);
    }

    if (isFinished) {
      const correctCount = answers.filter(a => a.isCorrect).length;
      if (correctCount === exercises.length) {
        try {
          const response = await addCrown(user._id);
          setCrowns(response.crowns);
          setFullyCompleted(true);
          window.dispatchEvent(new CustomEvent('crownsUpdated', {
            detail: { crowns: response.crowns }
          }));
        } catch (err) {
          console.error('Error adding crown:', err);
        }
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
        setEarnedPoints(0);
      } else {
        setSelected(null);
        setIsCorrect(null);
        setEarnedPoints(0);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">טוען תרגילים...</div>;
  }

  if (fullyCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-yellow-300">כל הכבוד! {crown}</h2>
          <p className="mb-4 text-gray-800 dark:text-gray-200">סיימת את כל התרגילים בנושא: {subject}</p>
          <div className="text-xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">
            סה\"כ ניקוד: {points} {coin}
          </div>
          <Link to="/practice" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          {allCorrect ? (
            <>
              <h2 className="text-2xl font-bold mb-4">כל הכבוד! {crown}</h2>
              <p className="mb-4">סיימת את כל התרגילים בנושא: {subject}</p>
              <div className="text-xl font-bold mb-2">
                סה\"כ ניקוד: {points} {coin}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">הצלחת ב-{correctAnswersCount} מתוך {exercises.length} שאלות</h2>
              <p className="mb-4">נסה שוב את התרגילים בנושא: {subject}</p>
            </>
          )}
          <Link to="/practice" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-8">
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div className="bg-blue-500 h-4 rounded-full transition-all duration-300" style={{ width: `${((current + 1) / exercises.length) * 100}%` }}></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
            תרגיל {current + 1} מתוך {exercises.length} בנושא: {subject}
          </h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 text-right">
              {ex.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-right">
              {ex.description}
            </p>
          </div>
          <div className="grid gap-4 mb-6">
            {ex.options.map((option, idx) => {
              const isSelected = selected === idx;
              const isCorrectAnswer = isCorrect && isSelected;
              const isWrongAnswer = isSelected && isCorrect === false;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`w-full text-right px-4 py-3 rounded-lg border transition-colors duration-200
                    bg-gray-100 dark:bg-gray-700
                    text-gray-900 dark:text-white
                    border-gray-300 dark:border-gray-600
                    shadow-sm
                    ${isCorrectAnswer ? 'bg-green-200 dark:bg-green-700 border-green-500 dark:border-green-400 text-green-900 dark:text-green-200 font-bold' : ''}
                    ${isWrongAnswer ? 'bg-red-200 dark:bg-red-700 border-red-500 dark:border-red-400 text-red-900 dark:text-red-200 font-bold' : ''}
                    ${isSelected && !isCorrectAnswer && !isWrongAnswer ? 'ring-2 ring-primary-500' : ''}
                    hover:bg-primary-100 dark:hover:bg-primary-800
                    disabled:opacity-70
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className={`mb-4 text-center text-lg font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isCorrect ? 'נכון!' : 'לא נכון'} {earnedPoints > 0 && `+${earnedPoints} ${coin}`}
            </div>
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={current === 0}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            >
              קודם
            </button>
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50"
            >
              {current === exercises.length - 1 ? 'סיים' : 'הבא'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSubject;
