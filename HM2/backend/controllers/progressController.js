/**
 * Progress Controller
 * Handles student progress tracking and management for exercises and subjects
 */

const StudentProgress = require('../models/StudentProgress');
const Exercise = require('../models/Exercise');

/**
 * Get list of subjects with completion status for a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSubjectsStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const progresses = await StudentProgress.find({ student: studentId });

    const subjectStatus = progresses.map(p => ({
      subject: p.subject,
      completed: p.completed
    }));

    res.json(subjectStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get student progress for a specific subject
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProgressForSubject = async (req, res) => {
  try {
    const { studentId, subject } = req.params;
    const progress = await StudentProgress.findOne({ student: studentId, subject });
    res.json(progress || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Save or update student progress for a subject
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.saveOrUpdateProgress = async (req, res) => {
  try {
    const { student, subject, currentIndex, answers } = req.body;

    const existingProgress = await StudentProgress.findOne({ student, subject });
    const allExercises = await Exercise.find({ subject }, '_id');
    const totalQuestions = allExercises.length;
    const allQuestionIds = allExercises.map(q => q._id.toString());
    const answeredIds = answers.map(a => a.questionId?.toString());
    const hasAnsweredAll = allQuestionIds.every(qid => answeredIds.includes(qid));
    const answeredCorrectly = answers.length > 0 && answers.every(a => a.isCorrect);
    const allCorrect = answeredCorrectly && hasAnsweredAll;

    if (!existingProgress) {
      const newProgress = new StudentProgress({
        student,
        subject,
        currentIndex,
        completed: allCorrect,
        lastAttempt: new Date(),
        answers,
      });
      await newProgress.save();
      return res.status(201).json(newProgress);
    }

    const updatedAnswers = [...existingProgress.answers];

    for (const newAns of answers) {
      const index = updatedAnswers.findIndex(a => a.questionId.toString() === newAns.questionId);
      if (index >= 0) {
        updatedAnswers[index] = newAns;
      } else {
        updatedAnswers.push(newAns);
      }
    }

    existingProgress.currentIndex = currentIndex;
    existingProgress.completed = updatedAnswers.length > 0 &&
      allQuestionIds.every(qid => updatedAnswers.some(a => a.questionId?.toString() === qid && a.isCorrect));
    existingProgress.lastAttempt = new Date();
    existingProgress.answers = updatedAnswers;

    await existingProgress.save();
    res.json(existingProgress);
  } catch (err) {
    console.error('Progress Update Error:', err);
    res.status(500).json({ error: err.message });
  }
};
