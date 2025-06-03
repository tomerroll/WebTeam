const express = require('express');
const router = express.Router();
const {
  getAllReports,
  createReport,
  updateReport,
  deleteReport
} = require('../controllers/reportController');

router.get('/', getAllReports);
router.post('/', createReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = router;
