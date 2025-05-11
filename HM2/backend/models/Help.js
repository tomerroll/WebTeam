const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Help', helpSchema);
