const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignments: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    dueDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  settings: {
    allowSelfRegistration: {
      type: Boolean,
      default: false
    },
    sendWeeklyReports: {
      type: Boolean,
      default: true
    },
    notifyNewExercises: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    activeStudents: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to update class statistics
classSchema.methods.updateStats = async function() {
  const students = await mongoose.model('User').find({
    _id: { $in: this.students }
  }).select('progress');
  
  let totalScore = 0;
  let totalCompleted = 0;
  let activeCount = 0;
  
  students.forEach(student => {
    if (student.progress && student.progress.size > 0) {
      let studentScore = 0;
      let exercises = 0;
      
      for (let [, data] of student.progress) {
        studentScore += data.score;
        exercises += data.completedExercises;
        
        // Check if student was active in the last week
        if (data.lastActivity && 
            data.lastActivity > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
          activeCount++;
          break;
        }
      }
      
      if (exercises > 0) {
        totalScore += studentScore / exercises;
        totalCompleted += exercises;
      }
    }
  });
  
  this.statistics.averageScore = students.length > 0 ? totalScore / students.length : 0;
  this.statistics.completionRate = this.assignments.length > 0 ? 
    (totalCompleted / (this.assignments.length * students.length)) * 100 : 0;
  this.statistics.activeStudents = activeCount;
  
  await this.save();
};

const Class = mongoose.model('Class', classSchema);

module.exports = Class; 