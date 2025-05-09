const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  completed: { type: Boolean, default: false },
  lastAttempt: { type: Date, default: Date.now },
  success: { type: Boolean, default: false }
});

module.exports = mongoose.model('StudentProgress', studentProgressSchema); 