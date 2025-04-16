const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Exercise = require('../models/Exercise');
const Progress = require('../models/Progress');

// Get exercises by topic
router.get('/topic/:topic', auth, async (req, res) => {
  try {
    const { topic } = req.params;
    const { level, limit = 10 } = req.query;
    
    const query = { topic };
    if (level) query.level = level;
    
    const exercises = await Exercise.find(query)
      .limit(parseInt(limit))
      .sort({ level: 1, createdAt: -1 });
      
    res.json({
      success: true,
      exercises
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת תרגילים',
      error: err.message
    });
  }
});

// Get next exercise for student
router.get('/next', auth, async (req, res) => {
  try {
    const { topic } = req.query;
    
    // Get student's progress
    const progress = await Progress.findOne({
      user: req.user.id,
      topic
    });
    
    const level = progress ? progress.currentLevel : 1;
    
    // Find exercises not completed by the student
    const completedExercises = progress ? progress.completedExercises : [];
    
    const exercise = await Exercise.findOne({
      topic,
      level,
      _id: { $nin: completedExercises }
    });
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'לא נמצאו תרגילים נוספים בנושא זה'
      });
    }
    
    res.json({
      success: true,
      exercise
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת התרגיל הבא',
      error: err.message
    });
  }
});

// Submit exercise answer
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answer } = req.body;
    
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'תרגיל לא נמצא'
      });
    }
    
    const isCorrect = exercise.correctAnswer === answer;
    
    // Update progress
    let progress = await Progress.findOne({
      user: req.user.id,
      topic: exercise.topic
    });
    
    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        topic: exercise.topic,
        currentLevel: 1,
        completedExercises: [],
        correctAnswers: 0,
        totalAttempts: 0
      });
    }
    
    progress.completedExercises.push(exercise._id);
    progress.totalAttempts += 1;
    if (isCorrect) {
      progress.correctAnswers += 1;
    }
    
    // Level up if needed
    const successRate = progress.correctAnswers / progress.totalAttempts;
    if (successRate >= 0.8 && progress.completedExercises.length >= 5) {
      progress.currentLevel += 1;
      progress.completedExercises = []; // Reset completed exercises for new level
    }
    
    await progress.save();
    
    res.json({
      success: true,
      isCorrect,
      explanation: exercise.explanation,
      progress: {
        level: progress.currentLevel,
        successRate: Math.round(successRate * 100),
        totalExercises: progress.totalAttempts
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בשליחת התשובה',
      error: err.message
    });
  }
});

// Create new exercise (teacher only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאה ליצירת תרגילים'
      });
    }
    
    const {
      topic,
      question,
      options,
      correctAnswer,
      explanation,
      level
    } = req.body;
    
    const exercise = new Exercise({
      topic,
      question,
      options,
      correctAnswer,
      explanation,
      level,
      createdBy: req.user.id
    });
    
    await exercise.save();
    
    res.json({
      success: true,
      exercise
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה ביצירת תרגיל',
      error: err.message
    });
  }
});

// Update exercise (teacher only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאה לעדכון תרגילים'
      });
    }
    
    const {
      topic,
      question,
      options,
      correctAnswer,
      explanation,
      level
    } = req.body;
    
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'תרגיל לא נמצא'
      });
    }
    
    // Update fields
    if (topic) exercise.topic = topic;
    if (question) exercise.question = question;
    if (options) exercise.options = options;
    if (correctAnswer) exercise.correctAnswer = correctAnswer;
    if (explanation) exercise.explanation = explanation;
    if (level) exercise.level = level;
    
    await exercise.save();
    
    res.json({
      success: true,
      exercise
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון תרגיל',
      error: err.message
    });
  }
});

// Delete exercise (teacher only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאה למחיקת תרגילים'
      });
    }
    
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'תרגיל לא נמצא'
      });
    }
    
    res.json({
      success: true,
      message: 'תרגיל נמחק בהצלחה'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה במחיקת תרגיל',
      error: err.message
    });
  }
});

module.exports = router; 