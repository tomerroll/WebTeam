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

// חיבור הנתיבים
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);

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
