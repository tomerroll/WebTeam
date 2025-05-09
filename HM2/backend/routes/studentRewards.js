const express = require('express');
const router = express.Router();
const StudentReward = require('../models/StudentReward');

// קבלת כל התגמולים של תלמיד
router.get('/:studentId', async (req, res) => {
  const rewards = await StudentReward.find({ studentId: req.params.studentId }).populate('rewardId');
  res.json(rewards);
});

// הוספת תגמול לתלמיד
router.post('/', async (req, res) => {
  try {
    const studentReward = new StudentReward(req.body);
    await studentReward.save();
    res.json(studentReward);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// מחיקת תגמול של תלמיד
router.delete('/:id', async (req, res) => {
  await StudentReward.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 