const mongoose = require('mongoose');

const studentRewardSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  earnedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentReward', studentRewardSchema); 