const express = require('express');
const router = express.Router();
const {
  getAllHelps,
  createHelp,
  answerHelp,
  deleteHelpAnswer,
  deleteHelp
} = require('../controllers/helpController');

router.get('/', getAllHelps);
router.post('/', createHelp);
router.put('/:id/answer', answerHelp);
router.delete('/:id/answer', deleteHelpAnswer);
router.delete('/:id', deleteHelp);

module.exports = router;
