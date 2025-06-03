const express = require('express');
const router = express.Router();
const {
  getAllTheories,
  createTheory,
  deleteTheory
} = require('../controllers/theoryController');

router.get('/', getAllTheories);
router.post('/', createTheory);
router.delete('/:id', deleteTheory);

module.exports = router;
