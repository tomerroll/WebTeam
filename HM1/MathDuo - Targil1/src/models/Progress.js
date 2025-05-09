const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true,
    enum: ['order-of-operations', 'fractions', 'equations']
  },
  currentLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  completedExercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  streak: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String,
    enum: ['first-exercise', 'level-up', 'perfect-score', 'streak-5', 'streak-10']
  }],
  stats: {
    averageTimePerExercise: {
      type: Number,
      default: 0
    },
    bestStreak: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
progressSchema.index({ user: 1, topic: 1 }, { unique: true });

// Method to calculate success rate
progressSchema.methods.getSuccessRate = function() {
  return this.totalAttempts > 0 
    ? Math.round((this.correctAnswers / this.totalAttempts) * 100) 
    : 0;
};

// Method to check if level up is possible
progressSchema.methods.canLevelUp = function() {
  const successRate = this.getSuccessRate();
  return successRate >= 80 && this.completedExercises.length >= 5;
};

// Method to update streak
progressSchema.methods.updateStreak = function(isCorrect) {
  if (isCorrect) {
    this.streak += 1;
    if (this.streak > this.stats.bestStreak) {
      this.stats.bestStreak = this.streak;
    }
    
    // Check for streak achievements
    if (this.streak === 5 && !this.achievements.includes('streak-5')) {
      this.achievements.push('streak-5');
    }
    if (this.streak === 10 && !this.achievements.includes('streak-10')) {
      this.achievements.push('streak-10');
    }
  } else {
    this.streak = 0;
  }
};

// Method to update time statistics
progressSchema.methods.updateTimeStats = function(timeSpent) {
  this.stats.totalTimeSpent += timeSpent;
  const totalExercises = this.completedExercises.length;
  this.stats.averageTimePerExercise = totalExercises > 0
    ? Math.round(this.stats.totalTimeSpent / totalExercises)
    : 0;
};

// Pre-save middleware to update last activity
progressSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 