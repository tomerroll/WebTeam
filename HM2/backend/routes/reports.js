const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// קבלת כל הדוחות
router.get('/', async (req, res) => {
  const reports = await Report.find().populate('studentId');
  res.json(reports);
});

// הוספת דוח
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// עדכון דוח
router.put('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// מחיקת דוח
router.delete('/:id', async (req, res) => {
  await Report.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 