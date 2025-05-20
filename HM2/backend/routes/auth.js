const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware לאימות טוקן
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, userType }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

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

// ✅ עדכון פרופיל (שם, אימייל, סיסמה)
router.put('/profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const userType = req.user.userType;
  const { name, email, password } = req.body;

  try {
    const updatedFields = { name, email };
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    let updatedUser;

    if (userType === 'student') {
      updatedUser = await Student.findByIdAndUpdate(userId, updatedFields, { new: true });
    } else if (userType === 'teacher') {
      updatedUser = await Teacher.findByIdAndUpdate(userId, updatedFields, { new: true });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בעדכון פרופיל' });
  }
});

module.exports = router;
