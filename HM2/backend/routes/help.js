const express = require('express');
const router = express.Router();
const Help = require('../models/Help');
const Student = require('../models/student');

// קבלת כל ההודעות
router.get('/', async (req, res) => {
  try {
    const allHelps = await Help.find().sort({ createdAt: -1 });
    res.json(allHelps);
  } catch (err) {
    console.error('שגיאה בשליפת הפניות:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});
// שליחת פנייה
router.post('/', async (req, res) => {
  const { subject, message, studentEmail } = req.body;

  if (!subject || !message || !studentEmail) {
    return res.status(400).json({ error: 'חובה להזין נושא, הודעה ומייל תלמיד' });
  }

  try {
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ error: 'תלמיד לא נמצא במסד הנתונים' });
    }

    const newHelp = new Help({
      subject,
      message,
      studentEmail,
      studentName: student.name,
      // אין צורך לציין answer – ייקח כברירת מחדל מהסכימה
    });

    await newHelp.save();
    res.status(201).json({ message: 'הפנייה נשלחה בהצלחה' });
  } catch (err) {
    console.error('שגיאה בשמירת פנייה:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});


// עדכון תשובת מורה לפנייה
router.put('/:id/answer', async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (typeof answer !== 'string') {
    return res.status(400).json({ error: 'חובה לספק תשובה תקינה' });
  }

  try {
    const help = await Help.findById(id);
    if (!help) {
      return res.status(404).json({ error: 'פנייה לא נמצאה' });
    }

    help.answer = answer;
    await help.save();

    res.json({ message: 'התשובה עודכנה בהצלחה', help });
  } catch (err) {
    console.error('שגיאה בעדכון התשובה:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

module.exports = router;
