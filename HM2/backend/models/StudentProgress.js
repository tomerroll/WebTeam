const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true }, // חדש: שמירה לפי נושא
  currentIndex: { type: Number, default: 0 }, // חדש: אינדקס השאלה האחרונה
  completed: { type: Boolean, default: false },
  lastAttempt: { type: Date, default: Date.now },
  answers: [
    {
      questionIndex: { type: Number, required: true },
      selectedAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ]
});

module.exports = mongoose.model('StudentProgress', studentProgressSchema);