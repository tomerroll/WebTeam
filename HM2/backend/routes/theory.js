const express = require('express');
const router = express.Router();
const Theory = require('../models/Theory');

// קבלת כל תכני התיאוריה
router.get('/', async (req, res) => {
  try {
    const theories = await Theory.find();
    res.json(theories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// הוספת תוכן תיאוריה חדש
router.post('/', async (req, res) => {
  const { title, description, content } = req.body;
  if (!title || !description || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newTheory = new Theory({ title, description, content });
    const savedTheory = await newTheory.save();
    res.status(201).json(savedTheory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// מחיקת תוכן תיאוריה לפי ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedTheory = await Theory.findByIdAndDelete(req.params.id);
    if (!deletedTheory) {
      return res.status(404).json({ error: 'Theory not found' });
    }
    res.json({ message: 'Theory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;