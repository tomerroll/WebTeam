/**
 * Authentication Controller
 * Handles user registration, login, and profile updates for students and teachers
 */

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Register a new user (student or teacher)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  const { name, email, password, userType, grade, class: className, teacherKey } = req.body;

  try {
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });

    if (existingStudent || existingTeacher) {
      return res.status(400).json({ error: 'Cannot register - this email is already registered in the system.' });
    }

    // Validate teacher key
    if (userType === 'teacher') {
      if (!teacherKey || teacherKey !== process.env.TEACHER_SECRET_KEY) {
        return res.status(400).json({ error: 'Invalid or missing teacher key.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;

    if (userType === 'student') {
      user = new Student({ name, email, password: hashedPassword, grade, class: className });
    } else if (userType === 'teacher') {
      user = new Teacher({ name, email, password: hashedPassword });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during registration. Please try again later.' });
  }
};

/**
 * Login user (student or teacher)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
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

    const token = jwt.sign(
      { id: user._id, userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

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
};

/**
 * Update user profile information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, userType } = decoded;

    const Model = userType === 'student' ? Student : Teacher;
    const user = await Model.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        ...(userType === 'student' && { grade: user.grade, class: user.class }),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
