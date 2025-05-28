const express = require('express');
const router = express.Router();
const StudentProgress = require('../models/StudentProgress');

// קבלת התקדמות של תלמיד בנושא מסוים
router.get('/:studentId/:subject', async (req, res) => {
  const { studentId, subject } = req.params;
  const progress = await StudentProgress.findOne({ student: studentId, subject });
  res.json(progress || {});
});

// עדכון/שמירת התקדמות
router.post('/', async (req, res) => {
  const { student, subject, currentIndex, completed, answers } = req.body;
  const progress = await StudentProgress.findOneAndUpdate(
    { student, subject },
    { currentIndex, completed, lastAttempt: new Date(), answers },
    { upsert: true, new: true }
  );
  res.json(progress);
});

module.exports = router;