const express = require('express');
const router = express.Router();
const StudentProgress = require('../models/StudentProgress');
const Exercise = require('../models/Exercise'); // נדרש כדי לבדוק כמה שאלות יש בנושא

// קבלת רשימת נושאים וסטטוס completed עבור סטודנט
router.get('/completed/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const progresses = await StudentProgress.find({ student: studentId });

    const subjectStatus = progresses.map(p => ({
      subject: p.subject,
      completed: p.completed
    }));

    res.json(subjectStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// קבלת התקדמות של תלמיד בנושא מסוים
router.get('/:studentId/:subject', async (req, res) => {
  try {
    const { studentId, subject } = req.params;
    const progress = await StudentProgress.findOne({ student: studentId, subject });
    res.json(progress || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// עדכון/שמירת התקדמות
router.post('/', async (req, res) => {
  try {
    const { student, subject, currentIndex, answers } = req.body;

    const existingProgress = await StudentProgress.findOne({ student, subject });

    // שלב 1: שלוף את כל מזהי השאלות של הנושא הזה
    const allExercises = await Exercise.find({ subject }, '_id');
    const totalQuestions = allExercises.length;
    const allQuestionIds = allExercises.map(q => q._id.toString());

    // שלב 2: האם כל השאלות נענו?
    const answeredIds = answers.map(a => a.questionId?.toString());
    const hasAnsweredAll = allQuestionIds.every(qid => answeredIds.includes(qid));

    // שלב 3: האם כולן נכונות?
    const answeredCorrectly = answers.length > 0 && answers.every(a => a.isCorrect);

    // תנאי הסיום התקין
    const allCorrect = answeredCorrectly && hasAnsweredAll;

    if (!existingProgress) {
      // יצירת התקדמות חדשה
      const newProgress = new StudentProgress({
        student,
        subject,
        currentIndex,
        completed: allCorrect,
        lastAttempt: new Date(),
        answers,
      });
      await newProgress.save();
      return res.status(201).json(newProgress);
    }

    // עדכון תשובות קיימות
    const updatedAnswers = [...existingProgress.answers];

    for (const newAns of answers) {
      const index = updatedAnswers.findIndex(a => a.questionId.toString() === newAns.questionId);
      if (index >= 0) {
        updatedAnswers[index] = newAns; // עדכון תשובה קיימת
      } else {
        updatedAnswers.push(newAns); // הוספת תשובה חדשה
      }
    }

    existingProgress.currentIndex = currentIndex;
    existingProgress.completed = updatedAnswers.length > 0 &&
      allQuestionIds.every(qid => updatedAnswers.some(a => a.questionId?.toString() === qid && a.isCorrect));
    existingProgress.lastAttempt = new Date();
    existingProgress.answers = updatedAnswers;

    await existingProgress.save();
    res.json(existingProgress);
  } catch (err) {
    console.error('Progress Update Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
