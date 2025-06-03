const Theory = require('../models/Theory');

// קבלת כל התכנים
exports.getAllTheories = async (req, res) => {
  try {
    const theories = await Theory.find();
    res.json(theories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// יצירת תוכן תיאורטי חדש
exports.createTheory = async (req, res) => {
  const { title, description, content } = req.body;
  if (!title || !description || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newTheory = new Theory({ title, description, content });
    const savedTheory = await newTheory.save();
    res.status(201).json(savedTheory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// מחיקת תוכן לפי ID
exports.deleteTheory = async (req, res) => {
  try {
    const deletedTheory = await Theory.findByIdAndDelete(req.params.id);
    if (!deletedTheory) {
      return res.status(404).json({ error: 'Theory not found' });
    }
    res.json({ message: 'Theory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
