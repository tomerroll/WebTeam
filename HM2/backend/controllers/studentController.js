/**
 * Student Controller
 * Handles CRUD operations for students and manages student-related functionality
 */

const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

/**
 * Get all students
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

/**
 * Get student by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Create a new student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createStudent = async (req, res) => {
  try {
    const { name, grade, class: className, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, grade, class: className, email, password: hashedPassword });
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Update existing student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Add or update points for a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addPoints = async (req, res) => {
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
};

/**
 * Add crown to student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addCrown = async (req, res) => {
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
};

/**
 * Mark exercise as solved for a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markExerciseSolved = async (req, res) => {
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
};

/**
 * Get current logged-in student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCurrentStudent = async (req, res) => {
  try {
    // Assuming req.user exists and contains the user ID after authentication
    const student = await Student.findById(req.user.id).select('-password'); // Avoid returning password
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


