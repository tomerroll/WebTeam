const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// שליפת כל התלמידים
exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

// שליפת תלמיד לפי ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// יצירת תלמיד חדש
exports.createStudent = async (req, res) => {
  try {
    const { name, grade, class: className, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, grade, class: className, email, password: hashedPassword });
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// עדכון תלמיד קיים
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// מחיקת תלמיד
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// הוספת או עדכון ניקוד
exports.addPoints = async (req, res) => {
  const { studentId, points } = req.body;
  if (!studentId || typeof points !== 'number') {
    return res.status(400).json({ error: 'Missing studentId or points' });
  }
  try {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $inc: { points } },
      { new: true }
    );
    res.json({ points: student.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// הוספת כתר
exports.addCrown = async (req, res) => {
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ error: 'Missing studentId' });
  try {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $inc: { crowns: 1 } },
      { new: true }
    );
    res.json({ crowns: student.crowns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// סימון תרגיל כפתור
exports.markExerciseSolved = async (req, res) => {
  const { studentId, exerciseId } = req.body;
  try {
    await Student.findByIdAndUpdate(
      studentId,
      { $addToSet: { solvedExercises: exerciseId } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// שליפת התלמיד המחובר
exports.getCurrentStudent = async (req, res) => {
  try {
    // בהנחה ש-req.user קיים וכולל את ה-ID של המשתמש לאחר אימות
    const student = await Student.findById(req.user.id).select('-password'); // נמנע משליפת הסיסמה
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


