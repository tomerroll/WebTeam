/**
 * Exercise Routes
 * Defines API endpoints for exercise management and retrieval
 */

const express = require('express');
const router = express.Router();

const {
  getAllExercises,
  getExercisesBySubject,
  addExercise,
  updateExercise,
  deleteExercise
} = require('../controllers/exerciseController');

router.get('/', getAllExercises);
router.get('/subject/:subject', getExercisesBySubject);
router.post('/add', addExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

module.exports = router;
