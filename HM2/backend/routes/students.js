const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// קבלת כל התלמידים
router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
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

module.exports = router; 