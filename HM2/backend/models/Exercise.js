/**
 * Exercise Model
 * Defines the schema for mathematical exercises in the learning platform
 */

const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  options: { type: [String], required: true },
  correctOption: { type: Number, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  difficulty: { type: String, required: true },
  points: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
