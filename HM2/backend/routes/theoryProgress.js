/**
 * Theory Progress Routes
 * Defines API endpoints for tracking student progress in theoretical content
 */

const express = require('express');
const router = express.Router();
const {
  getStudentTheoryProgress,
  getTheoryProgressById,
  updateTheoryStatus,
  updateReadingProgress,
  updateInteractiveProgress,
  addNotesAndRating,
  completeTheory,
  resetTheoryProgress,
  getTheoryStats
} = require('../controllers/theoryProgressController');

router.get('/student/:studentId', getStudentTheoryProgress);
router.get('/:studentId/:theoryId', getTheoryProgressById);
router.put('/status', updateTheoryStatus);
router.put('/reading', updateReadingProgress);
router.put('/interactive', updateInteractiveProgress);
router.put('/feedback', addNotesAndRating);
router.put('/complete', completeTheory);
router.put('/reset', resetTheoryProgress);
router.get('/stats/:studentId', getTheoryStats);

module.exports = router;