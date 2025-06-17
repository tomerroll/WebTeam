/**
 * Report Model
 * Defines the schema for student progress reports and analytics
 */

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  class: { type: String, required: true },
  completedExercises: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  lastActivity: { type: Date }
});

module.exports = mongoose.model('Report', reportSchema); 