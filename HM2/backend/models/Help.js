/**
 * Help Model
 * Defines the schema for help requests from students and teacher responses
 */

const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentName: { type: String, required: true },
  answer: { type: String, default: '' },
  answeredBy: { type: String, default: '' }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Help', helpSchema);
