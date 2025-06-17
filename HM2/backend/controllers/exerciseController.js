/**
 * Exercise Controller
 * Handles CRUD operations for math exercises and manages exercise-related functionality
 */

const Exercise = require('../models/Exercise');
const StudentProgress = require('../models/StudentProgress');

// Difficulty level mapping for sorting
const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };

/**
 * Get all exercises, optionally filtered by grade
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllExercises = async (req, res) => {
  try {
    const { grade } = req.query;
    const query = grade ? { grade } : {};
    const exercises = await Exercise.find(query).lean();
    exercises.sort((a, b) => (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99));
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get exercises by specific subject
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getExercisesBySubject = async (req, res) => {
  try {
    const subject = req.params.subject;
    const exercises = await Exercise.find({ subject }).lean();
    exercises.sort((a, b) => (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99));
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Add a new exercise
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addExercise = async (req, res) => {
  const {
    title, description, options, correctOption,
    subject, grade, difficulty, points, teacherId
  } = req.body;

  if (!title || !description || !options || correctOption === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!Array.isArray(options) || options.length !== 4) {
    return res.status(400).json({ error: 'You must provide exactly 4 options' });
  }

  if (correctOption < 0 || correctOption > 3) {
    return res.status(400).json({ error: 'Correct option must be between 0 and 3' });
  }

  try {
    const exercise = new Exercise({
      title,
      description,
      options,
      correctOption,
      subject,
      grade,
      difficulty,
      points,
      createdBy: teacherId,
    });

    await exercise.save();

    // Reset progress for all students when new exercise is added
    await StudentProgress.updateMany(
      { subject, completed: true },
      { $set: { completed: false } }
    );

    res.status(201).json({ success: true, exercise });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update an existing exercise
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete an exercise
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteExercise = async (req, res) => {
  try {
    const result = await Exercise.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Exercise not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
