const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentName: { type: String, required: true },
  answer: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Help', helpSchema);
