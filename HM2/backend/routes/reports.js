/**
 * Reports Routes
 * Defines API endpoints for student progress reports and analytics
 */

const express = require('express');
const router = express.Router();
const { getAllReports } = require('../controllers/reportController');

router.get('/reports', getAllReports);

module.exports = router;
