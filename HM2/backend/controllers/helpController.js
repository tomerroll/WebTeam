/**
 * Help Controller
 * Handles help requests from students and teacher responses
 */

const Help = require('../models/Help');
const Student = require('../models/Student');

/**
 * Get all help requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllHelps = async (req, res) => {
  try {
    const allHelps = await Help.find().sort({ createdAt: -1 });
    res.json(allHelps);
  } catch (err) {
    console.error('Error fetching help requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Create a new help request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createHelp = async (req, res) => {
  const { subject, message, studentEmail } = req.body;

  if (!subject || !message || !studentEmail) {
    return res.status(400).json({ error: 'Subject, message, and student email are required' });
  }

  try {
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ error: 'Student not found in database' });
    }

    const newHelp = new Help({
      subject,
      message,
      studentEmail,
      studentName: student.name,
    });

    await newHelp.save();
    res.status(201).json({ message: 'Help request sent successfully' });
  } catch (err) {
    console.error('Error saving help request:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update teacher's answer to a help request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.answerHelp = async (req, res) => {
  const { id } = req.params;
  const { answer, answeredBy } = req.body;

  if (typeof answer !== 'string' || answer.trim() === '') {
    return res.status(400).json({ error: 'Valid answer is required' });
  }

  if (typeof answeredBy !== 'string' || answeredBy.trim() === '') {
    return res.status(400).json({ error: 'Teacher name is required' });
  }

  try {
    const help = await Help.findById(id);
    if (!help) {
      return res.status(404).json({ error: 'Help request not found' });
    }

    help.answer = answer;
    help.answeredBy = answeredBy;
    await help.save();

    res.json({ message: 'Answer updated successfully', help });
  } catch (err) {
    console.error('Error updating answer:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete only the answer from a help request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteHelpAnswer = async (req, res) => {
  try {
    const help = await Help.findById(req.params.id);
    if (!help) return res.status(404).json({ error: 'Help request not found' });

    help.answer = '';
    help.answeredBy = '';
    await help.save();

    res.json({ message: 'Answer deleted successfully' });
  } catch (err) {
    console.error('Error deleting answer:', err);
    res.status(500).json({ error: 'Error deleting answer' });
  }
};

/**
 * Delete entire help request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteHelp = async (req, res) => {
  try {
    const help = await Help.findById(req.params.id);
    if (!help) return res.status(404).json({ error: 'Help request not found for deletion' });

    await Help.findByIdAndDelete(req.params.id);
    res.json({ message: 'Help request deleted successfully' });
  } catch (err) {
    console.error('Error deleting help request:', err);
    res.status(500).json({ error: 'Error deleting help request' });
  }
};
