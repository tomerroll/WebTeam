/**
 * Theory Progress Controller
 * Handles student progress tracking for theoretical content and manages theory learning progress
 */

const TheoryProgress = require('../models/TheoryProgress');
const Theory = require('../models/Theory');
const mongoose = require('mongoose');

/**
 * Get student's theory progress for all theories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStudentTheoryProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const progress = await TheoryProgress.find({ student: studentId })
      .populate('theory')
      .sort({ lastAccessedAt: -1 });
    res.json(progress);
  } catch (error) {
    console.error('Error fetching student theory progress:', error);
    res.status(500).json({ message: 'Error fetching student theory progress' });
  }
};

/**
 * Get theory progress by specific theory ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTheoryProgressById = async (req, res) => {
  try {
    const { studentId, theoryId } = req.params;
    let progress = await TheoryProgress.findOne({ student: studentId, theory: theoryId }).populate('theory');
    if (!progress) {
      progress = new TheoryProgress({ student: studentId, theory: theoryId, status: 'Not Started' });
      await progress.save();
      await progress.populate('theory');
    }
    res.json(progress);
  } catch (error) {
    console.error('Error fetching theory progress:', error);
    res.status(500).json({ message: 'Error fetching theory progress' });
  }
};

/**
 * Update theory status for a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTheoryStatus = async (req, res) => {
  try {
    const { studentId, theoryId, status } = req.body;
    const progress = await TheoryProgress.findOneAndUpdate(
      { student: studentId, theory: theoryId },
      { status, lastAccessedAt: new Date(), $setOnInsert: { startedAt: new Date() } },
      { upsert: true, new: true }
    ).populate('theory');
    res.json(progress);
  } catch (error) {
    console.error('Error updating theory status:', error);
    res.status(500).json({ message: 'Error updating theory status' });
  }
};

/**
 * Update reading progress for a theory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateReadingProgress = async (req, res) => {
  try {
    const { studentId, theoryId, timeSpent, sectionsRead } = req.body;
    const updateData = {
      'readingProgress.lastAccessedAt': new Date(),
      'readingProgress.timeSpent': timeSpent || 0
    };
    if (sectionsRead) updateData['readingProgress.sectionsRead'] = sectionsRead;
    if (!req.body.readingProgress?.startedAt) updateData['readingProgress.startedAt'] = new Date();

    const progress = await TheoryProgress.findOneAndUpdate(
      { student: studentId, theory: theoryId },
      updateData,
      { upsert: true, new: true }
    ).populate('theory');

    res.json(progress);
  } catch (error) {
    console.error('Error updating reading progress:', error);
    res.status(500).json({ message: 'Error updating reading progress' });
  }
};

/**
 * Update interactive progress for theory examples
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateInteractiveProgress = async (req, res) => {
  try {
    const { studentId, theoryId, exampleIndex, isCorrect, timeSpent, attempts } = req.body;
    let progress = await TheoryProgress.findOne({ student: studentId, theory: theoryId });

    if (!progress) {
      progress = new TheoryProgress({ student: studentId, theory: theoryId, status: 'In Examples' });
    }

    const existingIndex = progress.interactiveProgress.examplesCompleted.findIndex(ex => ex.exampleIndex === exampleIndex);
    const example = { exampleIndex, isCorrect, timeSpent: timeSpent || 0, attempts: attempts || 1 };

    if (existingIndex >= 0) {
      progress.interactiveProgress.examplesCompleted[existingIndex] = example;
    } else {
      progress.interactiveProgress.examplesCompleted.push(example);
    }

    progress.interactiveProgress.totalCorrect = progress.interactiveProgress.examplesCompleted.filter(ex => ex.isCorrect).length;
    progress.interactiveProgress.totalAttempts = progress.interactiveProgress.examplesCompleted.reduce((sum, ex) => sum + ex.attempts, 0);
    progress.lastAccessedAt = new Date();

    await progress.save();
    await progress.populate('theory');
    res.json(progress);
  } catch (error) {
    console.error('Error updating interactive progress:', error);
    res.status(500).json({ message: 'Error updating examples progress' });
  }
};

/**
 * Add notes and rating for a theory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addNotesAndRating = async (req, res) => {
  try {
    const { studentId, theoryId, notes, rating } = req.body;
    const progress = await TheoryProgress.findOneAndUpdate(
      { student: studentId, theory: theoryId },
      { notes, rating, lastAccessedAt: new Date() },
      { upsert: true, new: true }
    ).populate('theory');
    res.json(progress);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Error adding feedback' });
  }
};

/**
 * Mark theory as completed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.completeTheory = async (req, res) => {
  try {
    const { studentId, theoryId } = req.body;
    const progress = await TheoryProgress.findOneAndUpdate(
      { student: studentId, theory: theoryId },
      { status: 'Completed', completedAt: new Date(), lastAccessedAt: new Date() },
      { upsert: true, new: true }
    ).populate('theory');
    res.json(progress);
  } catch (error) {
    console.error('Error completing theory:', error);
    res.status(500).json({ message: 'Error marking theory as completed' });
  }
};

/**
 * Reset theory progress for a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.resetTheoryProgress = async (req, res) => {
  try {
    const { studentId, theoryId } = req.body;
    const progress = await TheoryProgress.findOneAndUpdate(
      { student: studentId, theory: theoryId },
      {
        status: 'Not Started',
        readingProgress: { startedAt: null, completedAt: null, timeSpent: 0, sectionsRead: [] },
        interactiveProgress: { examplesCompleted: [], totalCorrect: 0, totalAttempts: 0 },
        notes: '',
        rating: null,
        completedAt: null,
        lastAccessedAt: new Date()
      },
      { upsert: true, new: true }
    ).populate('theory');
    res.json(progress);
  } catch (error) {
    console.error('Error resetting theory progress:', error);
    res.status(500).json({ message: 'Error resetting theory progress' });
  }
};

/**
 * Get theory progress statistics for a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTheoryStats = async (req, res) => {
  try {
    const { studentId } = req.params;
    const totalTheories = await Theory.countDocuments();
    const completedTheories = await TheoryProgress.countDocuments({ student: studentId, status: 'Completed' });
    const progressData = await TheoryProgress.aggregate([
      { $match: { student: new mongoose.Types.ObjectId(studentId) } },
      { $lookup: {
          from: 'theories',
          localField: 'theory',
          foreignField: '_id',
          as: 'theoryDetails'
      }},
      { $unwind: '$theoryDetails' },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]);
    res.json({ totalTheories, completedTheories, progressData });
  } catch (error) {
    console.error('Error fetching progress statistics:', error);
    res.status(500).json({ message: 'Error fetching progress statistics' });
  }
};