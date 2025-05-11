const express = require('express');
const router = express.Router();
const Help = require('../models/Help'); // ייבוא המודל


// GET /api/help – מביא את כל הפניות שנשלחו למסד
router.get('/', async (req, res) => {
  try {
    const allHelps = await Help.find().sort({ createdAt: -1 }); // מהחדש לישן
    res.json(allHelps);
  } catch (err) {
    console.error('שגיאה בשליפת הפניות:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

// POST /api/help – מקבל פנייה ושומר למסד
router.post('/', async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'חובה להזין נושא והודעה' });
  }

  try {
    const newHelp = new Help({ subject, message });
    await newHelp.save();
    res.status(201).json({ message: 'הפנייה נשלחה בהצלחה' });
  } catch (err) {
    console.error('שגיאה בשמירת פנייה:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

module.exports = router;
