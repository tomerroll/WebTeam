/**
 * Progress Routes
 * Defines API endpoints for student progress tracking and management
 */

const express = require('express');
const router = express.Router();
const {
  getSubjectsStatus,
  getProgressForSubject,
  saveOrUpdateProgress
} = require('../controllers/progressController');

router.get('/completed/:studentId', getSubjectsStatus);
router.get('/:studentId/:subject', getProgressForSubject);
router.post('/', saveOrUpdateProgress);

module.exports = router;
