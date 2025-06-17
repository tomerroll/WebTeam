const Theory = require('../models/Theory');
const mongoose = require('mongoose'); // צריך לייבא את Mongoose כדי להשתמש ב-isValidObjectId

// --- פונקציות עבור ניהול תיאוריה (Theory) ---

/**
 * @desc קבלת כל התכנים התיאורטיים
 * @route GET /api/theory
 * @access Public
 */
exports.getAllTheories = async (req, res) => {
  try {
    const theories = await Theory.find();
    res.json(theories);
  } catch (err) {
    console.error('Error fetching all theories:', err);
    res.status(500).json({ error: err.message || 'שגיאה בשרת בעת קבלת כל התכנים' });
  }
};

/**
 * @desc יצירת תוכן תיאורטי חדש
 * @route POST /api/theory
 * @access Private (לדוגמה, רק למורים)
 */
exports.createTheory = async (req, res) => {
  const { title, description, content, difficulty, estimatedTime, youtubeLink, tags, prerequisites, interactiveExamples, visualExamples } = req.body;

  // ולידציה בסיסית של קלט
  if (!title || !description || !content) {
    return res.status(400).json({ error: 'אנא מלא את כל השדות הנדרשים (כותרת, תיאור, ותוכן).' });
  }

  try {
    const newTheory = new Theory({ 
      title, 
      description, 
      content, 
      difficulty, 
      estimatedTime, 
      youtubeLink, 
      tags, 
      prerequisites, 
      interactiveExamples, 
      visualExamples 
    });
    const savedTheory = await newTheory.save();
    res.status(201).json(savedTheory); // החזרת התיאוריה שנוצרה עם סטטוס 201 (Created)
  } catch (err) {
    console.error('Error creating theory:', err);
    res.status(500).json({ error: err.message || 'שגיאה בשרת בעת יצירת תיאוריה.' });
  }
};

/**
 * @desc עדכון תוכן תיאורטי קיים לפי ID
 * @route PUT /api/theory/:id
 * @access Private (לדוגמה, רק למורים)
 */
exports.updateTheory = async (req, res) => {
  const { id } = req.params; // קבלת ה-ID מפרמטרי ה-URL
  const { title, description, content, difficulty, estimatedTime, youtubeLink, tags, prerequisites, interactiveExamples, visualExamples } = req.body; // קבלת הנתונים המעודכנים מגוף הבקשה

  // ודא שה-ID חוקי של מונגו DB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'מזהה תיאוריה לא חוקי.' });
  }

  // ודא שכל השדות הנדרשים לעדכון קיימים (במידה ואתה דורש את כולם)
  // הערה: ניתן להחליט אילו שדות חייבים להיות קיימים בעדכון.
  // אם שדה מסוים לא נשלח, הוא לא יעודכן.
  if (!title && !description && !content && !difficulty && !estimatedTime && !youtubeLink && !tags && !prerequisites && !interactiveExamples && !visualExamples) { // אם אף אחד מהשדות לא נשלח
    return res.status(400).json({ error: 'יש לספק לפחות שדה אחד לעדכון.' });
  }

  try {
    // מצא ועדכן את התיאוריה
    const updatedTheory = await Theory.findByIdAndUpdate(
      id,
      { title, description, content, difficulty, estimatedTime, youtubeLink, tags, prerequisites, interactiveExamples, visualExamples }, // הנתונים לעדכון
      { new: true, runValidators: true } // { new: true } מחזיר את המסמך המעודכן אחרי השינוי
                                         // { runValidators: true } מפעיל ולידציה של הסכימה בעת העדכון
    );

    // אם התיאוריה לא נמצאה
    if (!updatedTheory) {
      return res.status(404).json({ error: 'תיאוריה עם המזהה הנבחר לא נמצאה.' });
    }

    res.status(200).json(updatedTheory); // החזרת התיאוריה המעודכנת
  } catch (err) {
    console.error('Error updating theory:', err); // לוג של השגיאה המלאה בשרת
    res.status(500).json({ error: err.message || 'שגיאה בשרת בעת עדכון תיאוריה.' });
  }
};

/**
 * @desc מחיקת תוכן תיאורטי לפי ID
 * @route DELETE /api/theory/:id
 * @access Private (לדוגמה, רק למורים)
 */
exports.deleteTheory = async (req, res) => {
  try {
    const deletedTheory = await Theory.findByIdAndDelete(req.params.id);

    if (!deletedTheory) {
      return res.status(404).json({ error: 'תיאוריה עם המזהה הנבחר לא נמצאה.' });
    }

    res.json({ message: 'התיאוריה נמחקה בהצלחה!' }); // הודעת הצלחה
  } catch (err) {
    console.error('Error deleting theory:', err);
    res.status(500).json({ error: err.message || 'שגיאה בשרת בעת מחיקת תיאוריה.' });
  }
};