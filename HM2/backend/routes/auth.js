const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// הרשמה
router.post('/register', async (req, res) => {
  const { name, email, password, userType, grade, class: className } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if (userType === 'student') {
      user = new Student({ name, email, password: hashedPassword, grade, class: className });
      await user.save();
    } else if (userType === 'teacher') {
      user = new Teacher({ name, email, password: hashedPassword });
      await user.save();
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// התחברות
router.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else if (userType === 'teacher') {
      user = await Teacher.findOne({ email });
    }
    if (!user) return res.status(400).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 