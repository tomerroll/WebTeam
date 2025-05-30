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
  const { email, password } = req.body;
  try {
    let user = await Student.findOne({ email });
    let userType = 'student';

    if (!user) {
      user = await Teacher.findOne({ email });
      userType = 'teacher';
    }

    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        ...(userType === 'student' && { grade: user.grade, class: user.class }),
      },
      userType,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
