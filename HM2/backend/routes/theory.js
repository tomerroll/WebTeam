const express = require('express');
const router = express.Router();
const {
  getAllTheories,
  createTheory,
  deleteTheory,
  updateTheory
} = require('../controllers/theoryController');

router.get('/', getAllTheories);
router.post('/', createTheory);
router.delete('/:id', deleteTheory);
router.put('/:id', updateTheory);

module.exports = router;
