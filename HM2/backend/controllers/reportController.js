const Report = require('../models/Report');

// קבלת כל הדוחות
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('studentId');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// יצירת דוח חדש
exports.createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// עדכון דוח לפי ID
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// מחיקת דוח לפי ID
exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
