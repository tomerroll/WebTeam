const mongoose = require('mongoose');

const theorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  
  // תוכן אינטראקטיבי חדש
  interactiveExamples: [{
    title: String,
    description: String,
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    difficulty: { type: String, enum: ['קל', 'בינוני', 'קשה'], default: 'קל' }
  }],
  
  // קישורים לתרגול
  relatedExercises: [{
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    difficulty: String,
    description: String
  }],
  
  // מידע נוסף
  difficulty: { type: String, enum: ['קל', 'בינוני', 'קשה'], default: 'בינוני' },
  estimatedTime: { type: Number, default: 10 }, // בדקות
  prerequisites: [String], // נושאים שצריך לדעת קודם
  tags: [String], // תגיות לחיפוש
  
  // קישור לסרטון יוטיוב
  youtubeLink: { type: String },
  
  // סטטיסטיקות
  viewCount: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 }, // אחוז השלמה
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// עדכון זמן שינוי
theorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Theory', theorySchema);