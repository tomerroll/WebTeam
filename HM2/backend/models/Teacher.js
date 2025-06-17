/**
 * Teacher Model
 * Defines the schema for teacher users in the learning platform
 */

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Teacher', teacherSchema); 