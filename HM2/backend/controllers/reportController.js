/**
 * Report Controller
 * Handles generation and retrieval of student progress reports
 */

const StudentProgress = require('../models/StudentProgress');
const Student = require('../models/Student');

/**
 * Get all student progress reports
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllReports = async (req, res) => {
  try {
    const reports = await StudentProgress.find()
      .populate('student', 'name') // Show only student name
      .lean();

    const formatted = reports.map(r => ({
      _id: r._id,  // Add id to use as key in React
      studentName: r.student?.name || 'Unknown',
      subject: r.subject,
      completed: r.completed,
      currentIndex: r.currentIndex,
      totalAnswered: r.answers.length,
      correctAnswers: r.answers.filter(a => a.isCorrect).length,
      lastAttempt: r.lastAttempt
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
