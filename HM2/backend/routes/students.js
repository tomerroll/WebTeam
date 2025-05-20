const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // ודא שזה הנתיב הנכון
const bcrypt = require('bcryptjs');

// קבלת כל התלמידים
router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// קבל סטודנט לפי ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// הוספת תלמיד
router.post('/', async (req, res) => {
  try {
    const { name, grade, class: className, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, grade, class: className, email, password: hashedPassword });
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// עדכון תלמיד
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// מחיקת תלמיד
router.delete('/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// הוספת/עדכון ניקוד לתלמיד
router.post('/addPoints', async (req, res) => {
  const { studentId, points } = req.body;
  if (!studentId || typeof points !== 'number') {
    return res.status(400).json({ error: 'Missing studentId or points' });
  }
  try {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $inc: { points } },
      { new: true }
    );
    res.json({ points: student.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// הוספת כתר לתלמיד
router.post('/addCrown', async (req, res) => {
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ error: 'Missing studentId' });
  try {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $inc: { crowns: 1 } },
      { new: true }
    );
    res.json({ crowns: student.crowns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// הוספת תרגיל לרשימת התרגילים שהתלמיד פתר
router.post('/markSolved', async (req, res) => {
  const { studentId, exerciseId } = req.body;
  try {
    await Student.findByIdAndUpdate(
      studentId,
      { $addToSet: { solvedExercises: exerciseId } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;