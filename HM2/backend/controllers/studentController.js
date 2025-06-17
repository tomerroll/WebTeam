/**
 * Student Controller
 * Handles CRUD operations for students and manages student-related functionality
 */

const Student = require('../models/Student');
const TheoryProgress = require('../models/TheoryProgress');
const Theory = require('../models/Theory');
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
    const savedStudent = await student.save();
    
    // Create theory progress entries for all existing theories
    try {
      const theories = await Theory.find();
      
      const progressEntries = theories.map(theory => ({
        studentId: savedStudent._id,
        theoryId: theory._id,
        status: 'לא התחיל',
        readingProgress: {
          startedAt: null,
          completedAt: null,
          timeSpent: 0,
          sectionsRead: []
        },
        interactiveProgress: {
          examplesCompleted: [],
          totalCorrect: 0,
          totalAttempts: 0
        },
        completedAt: null
      }));
      
      await TheoryProgress.insertMany(progressEntries);
      console.log(`Created theory progress entries for student ${savedStudent.name} for ${theories.length} theories`);
    } catch (progressError) {
      console.error('Error creating theory progress entries for new student:', progressError);
      // Don't fail the student creation if progress creation fails
    }
    
    res.json(savedStudent);
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
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Delete all theory progress entries for this student
    try {
      await TheoryProgress.deleteMany({ studentId: req.params.id });
      console.log(`Deleted theory progress entries for student: ${deletedStudent.name}`);
    } catch (progressError) {
      console.error('Error deleting theory progress entries for student:', progressError);
      // Don't fail the student deletion if progress deletion fails
    }
    
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


