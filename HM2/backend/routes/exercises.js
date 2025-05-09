const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise'); // שימוש במודל החיצוני

// קבלת כל התרגילים
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// הוספת תרגיל (קצר – ללא בדיקות)
router.post('/', async (req, res) => {
  try {
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// הוספת תרגיל עם ולידציה
router.post('/add', async (req, res) => {
const {
  title,
  description,
  options,
  correctOption,
  subject,
  grade,
  difficulty,
  points,
  teacherId
} = req.body;

  if (!title || !description || !options || correctOption === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!Array.isArray(options) || options.length !== 4) {
    return res.status(400).json({ error: 'You must provide exactly 4 options' });
  }

  if (correctOption < 0 || correctOption > 3) {
    return res.status(400).json({ error: 'Correct option must be between 0 and 3' });
  }

  try {
      const exercise = new Exercise({
        title,
        description,
        options,
        correctOption,
        subject,
        grade,
        difficulty,
        points,
        createdBy: teacherId,
    });


    await exercise.save();
    res.status(201).json({ success: true, exercise });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// עדכון תרגיל לפי ID
router.put('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// מחיקת תרגיל לפי ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Exercise.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Exercise not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
