const express = require('express');
const router = express.Router();
const StudentProgress = require('../models/StudentProgress');

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
    const { student, subject, currentIndex, completed, answers } = req.body;

    const existingProgress = await StudentProgress.findOne({ student, subject });

    if (!existingProgress) {
      // יצירה ראשונית של התקדמות
      const newProgress = new StudentProgress({
        student,
        subject,
        currentIndex,
        completed,
        lastAttempt: new Date(),
        answers,
      });
      await newProgress.save();
      return res.status(201).json(newProgress);
    }

    // עדכון של existing progress
    // 1. שילוב של תשובות חדשות עם קיימות תוך מניעת כפילויות לפי questionId
    const updatedAnswers = [...existingProgress.answers];

    for (const newAns of answers) {
      const index = updatedAnswers.findIndex(a => a.questionId.toString() === newAns.questionId);
      if (index >= 0) {
        updatedAnswers[index] = newAns; // עדכון תשובה קיימת
      } else {
        updatedAnswers.push(newAns); // הוספת תשובה חדשה
      }
    }

    // 2. עדכון הנתונים במסד
    existingProgress.currentIndex = currentIndex;
    existingProgress.completed = completed;
    existingProgress.lastAttempt = new Date();
    existingProgress.answers = updatedAnswers;

    await existingProgress.save();
    res.json(existingProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
