/**
 * Student Progress Model
 * Defines the schema for tracking student progress in exercises and subjects
 */

const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  currentIndex: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastAttempt: { type: Date, default: Date.now },
  answers: [
    {
      questionIndex: { type: Number, required: true },
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
      selectedAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ]
});

module.exports = mongoose.model('StudentProgress', studentProgressSchema);
