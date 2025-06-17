const mongoose = require('mongoose');

const theoryProgressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  theory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theory',
    required: true
  },
  
  // סטטוס התקדמות
  status: {
    type: String,
    enum: ['לא התחיל', 'בקריאה', 'בדוגמאות', 'הושלם'],
    default: 'לא התחיל'
  },
  
  // מעקב אחר קריאה
  readingProgress: {
    startedAt: Date,
    completedAt: Date,
    timeSpent: Number, // בדקות
    sectionsRead: [String]
  },
  
  // מעקב אחר דוגמאות אינטראקטיביות
  interactiveProgress: {
    examplesCompleted: [{
      exampleIndex: Number,
      isCorrect: Boolean,
      timeSpent: Number,
      attempts: Number
    }],
    totalCorrect: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 }
  },
  
  // הערות ודירוג
  notes: String,
  rating: { type: Number, min: 1, max: 5 },
  
  // זמנים
  startedAt: { type: Date, default: Date.now },
  lastAccessedAt: { type: Date, default: Date.now },
  completedAt: Date
});

// אינדקסים לביצועים טובים יותר
theoryProgressSchema.index({ student: 1, theory: 1 }, { unique: true });
theoryProgressSchema.index({ student: 1, status: 1 });
theoryProgressSchema.index({ student: 1, completedAt: 1 });

module.exports = mongoose.model('TheoryProgress', theoryProgressSchema); 