const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

// קבלת כל המורים
router.get('/', async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

// הוספת מורה
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ name, email, password: hashedPassword });
    await teacher.save();
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// עדכון מורה
router.put('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// מחיקת מורה
router.delete('/:id', async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 