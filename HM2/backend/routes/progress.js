const express = require('express');
const router = express.Router();
const StudentProgress = require('../models/StudentProgress');

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

    // חישוב מחדש של completed: כל השאלות שנענו הן נכונות
    const allCorrect = answers.length > 0 && answers.every(a => a.isCorrect);

    if (!existingProgress) {
      // יצירה ראשונית של התקדמות
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

    // עדכון של existing progress
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
    existingProgress.completed = updatedAnswers.length > 0 && updatedAnswers.every(a => a.isCorrect);
    existingProgress.lastAttempt = new Date();
    existingProgress.answers = updatedAnswers;

    await existingProgress.save();
    res.json(existingProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
