/**
 * Student Model
 * Defines the schema for student users in the learning platform
 */

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  class: { type: String, required: true },
  progress: { type: Number, default: 0 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  crowns: { type: Number, default: 0 },
});

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
