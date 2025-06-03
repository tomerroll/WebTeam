const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ייבוא הנתיבים
const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercises');
const studentsRoutes = require('./routes/students');
const theoryRoutes = require('./routes/theory'); 
const helpRoutes = require('./routes/help');
const progressRoutes = require('./routes/progress');


// חיבור הנתיבים
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/progress', progressRoutes);

// חיבור למסד נתונים
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.error('MongoDB connection error:', err));

// ברירת מחדל
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
