const StudentProgress = require('../models/StudentProgress');
const Student = require('../models/Student');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await StudentProgress.find()
      .populate('student', 'name') // מציג רק את שם התלמיד
      .lean();

    const formatted = reports.map(r => ({
      _id: r._id,  // הוסף את ה-id כדי להשתמש כמפתח ב-React
      studentName: r.student?.name || 'לא ידוע',
      subject: r.subject,
      completed: r.completed,
      currentIndex: r.currentIndex,
      totalAnswered: r.answers.length,
      correctAnswers: r.answers.filter(a => a.isCorrect).length,
      lastAttempt: r.lastAttempt
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
