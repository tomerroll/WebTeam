const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Class = require('../models/Class');

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת פרטי משתמש',
      error: err.message
    });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, email, phone, settings } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'משתמש לא נמצא'
      });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (settings) user.settings = { ...user.settings, ...settings };
    
    await user.save();
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        settings: user.settings
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון פרטי משתמש',
      error: err.message
    });
  }
});

// Get all students (teacher only)
router.get('/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאה לצפייה בתלמידים'
      });
    }
    
    const students = await User.find({ role: 'student' })
      .select('-password')
      .populate('class', 'name');
      
    res.json({
      success: true,
      students
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת רשימת תלמידים',
      error: err.message
    });
  }
});

// Get student by ID (teacher only)
router.get('/students/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאה לצפייה בפרטי תלמיד'
      });
    }
    
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student'
    })
    .select('-password')
    .populate('class', 'name');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'תלמיד לא נמצא'
      });
    }
    
    res.json({
      success: true,
      student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת פרטי תלמיד',
      error: err.message
    });
  }
});

// Update student (teacher only)
router.put('/students/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאה לעדכון פרטי תלמיד'
      });
    }
    
    const { name, email, phone, classId, level } = req.body;
    
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student'
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'תלמיד לא נמצא'
      });
    }
    
    // Update fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (classId) student.class = classId;
    if (level) student.level = level;
    
    await student.save();
    
    res.json({
      success: true,
      student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון פרטי תלמיד',
      error: err.message
    });
  }
});

// Delete student (teacher only)
router.delete('/students/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאה למחיקת תלמיד'
      });
    }
    
    const student = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'student'
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'תלמיד לא נמצא'
      });
    }
    
    res.json({
      success: true,
      message: 'תלמיד נמחק בהצלחה'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'שגיאה במחיקת תלמיד',
      error: err.message
    });
  }
});

module.exports = router; 