const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['order-of-operations', 'fractions', 'equations'],
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: {
    type: String,
    required: true
  },
  hints: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    timesAttempted: {
      type: Number,
      default: 0
    },
    timesCompleted: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to update exercise statistics
exerciseSchema.methods.updateStats = async function(score) {
  this.stats.timesAttempted += 1;
  if (score === 100) {
    this.stats.timesCompleted += 1;
  }
  
  // Update average score
  const oldTotal = this.stats.averageScore * (this.stats.timesAttempted - 1);
  this.stats.averageScore = (oldTotal + score) / this.stats.timesAttempted;
  
  await this.save();
};

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise; 