const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  addPoints,
  addCrown,
  markExerciseSolved,
  getCurrentStudent
} = require('../controllers/studentController');

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/addPoints', addPoints);
router.post('/addCrown', addCrown);
router.post('/markSolved', markExerciseSolved);
router.get('/me', getCurrentStudent);

module.exports = router;
