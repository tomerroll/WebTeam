/**
 * Teacher Routes
 * Defines API endpoints for teacher management and administration
 */

const express = require('express');
const router = express.Router();
const {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');

router.get('/', getAllTeachers);
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router;
