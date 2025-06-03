const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

// שליפת כל המורים
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// יצירת מורה חדש
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ name, email, password: hashedPassword });
    await teacher.save();
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// עדכון מורה לפי ID
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// מחיקת מורה לפי ID
exports.deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
