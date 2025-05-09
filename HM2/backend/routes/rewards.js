const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');

// קבלת כל התגמולים
router.get('/', async (req, res) => {
  const rewards = await Reward.find();
  res.json(rewards);
});

// הוספת תגמול
router.post('/', async (req, res) => {
  try {
    const reward = new Reward(req.body);
    await reward.save();
    res.json(reward);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// עדכון תגמול
router.put('/:id', async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reward);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// מחיקת תגמול
router.delete('/:id', async (req, res) => {
  await Reward.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 