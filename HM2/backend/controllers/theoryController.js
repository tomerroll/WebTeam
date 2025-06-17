/**
 * Theory Controller
 * Handles CRUD operations for theoretical content and manages theory-related functionality
 */

const Theory = require('../models/Theory');
const TheoryProgress = require('../models/TheoryProgress');
const mongoose = require('mongoose'); // Import Mongoose to use isValidObjectId

/**
 * Get all theoretical content
 * @route GET /api/theory
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllTheories = async (req, res) => {
  try {
    const theories = await Theory.find();
    res.json(theories);
  } catch (err) {
    console.error('Error fetching all theories:', err);
    res.status(500).json({ error: err.message || 'Server error while fetching all content' });
  }
};

/**
 * Create new theoretical content
 * @route POST /api/theory
 * @access Private (e.g., teachers only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createTheory = async (req, res) => {
  const { title, description, content, difficulty, estimatedTime, youtubeLink, tags, prerequisites, interactiveExamples } = req.body;

  // Basic input validation
  if (!title || !description || !content) {
    return res.status(400).json({ error: 'Please fill in all required fields (title, description, and content).' });
  }

  try {
    const newTheory = new Theory({ 
      title, 
      description, 
      content, 
      difficulty, 
      estimatedTime, 
      youtubeLink, 
      tags, 
      prerequisites, 
      interactiveExamples
    });
    const savedTheory = await newTheory.save();
    
    // Create theory progress entries for all students
    try {
      const Student = require('../models/Student');
      const students = await Student.find();
      
      const progressEntries = students.map(student => ({
        studentId: student._id,
        theoryId: savedTheory._id,
        status: 'לא התחיל',
        readingProgress: {
          startedAt: null,
          completedAt: null,
          timeSpent: 0,
          sectionsRead: []
        },
        interactiveProgress: {
          examplesCompleted: [],
          totalCorrect: 0,
          totalAttempts: 0
        },
        completedAt: null
      }));
      
      await TheoryProgress.insertMany(progressEntries);
      console.log(`Created theory progress entries for ${students.length} students for theory: ${savedTheory.title}`);
    } catch (progressError) {
      console.error('Error creating theory progress entries:', progressError);
      // Don't fail the theory creation if progress creation fails
    }
    
    res.status(201).json(savedTheory); // Return created theory with status 201 (Created)
  } catch (err) {
    console.error('Error creating theory:', err);
    res.status(500).json({ error: err.message || 'Server error while creating theory.' });
  }
};

/**
 * Update existing theoretical content by ID
 * @route PUT /api/theory/:id
 * @access Private (e.g., teachers only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTheory = async (req, res) => {
  const { id } = req.params; // Get ID from URL parameters
  const { title, description, content, difficulty, estimatedTime, youtubeLink, tags, prerequisites, interactiveExamples } = req.body; // Get updated data from request body

  // Ensure the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid theory identifier.' });
  }

  // Ensure at least one field is provided for update
  if (!title && !description && !content && !difficulty && !estimatedTime && !youtubeLink && !tags && !prerequisites && !interactiveExamples) {
    return res.status(400).json({ error: 'Please provide at least one field to update.' });
  }

  try {
    // Find and update the theory
    const updatedTheory = await Theory.findByIdAndUpdate(
      id,
      { title, description, content, difficulty, estimatedTime, youtubeLink, tags, prerequisites, interactiveExamples }, // Data to update
      { new: true, runValidators: true } // { new: true } returns the updated document after the change
                                         // { runValidators: true } runs schema validation during update
    );

    // If theory not found
    if (!updatedTheory) {
      return res.status(404).json({ error: 'Theory with the selected identifier was not found.' });
    }

    res.status(200).json(updatedTheory); // Return updated theory
  } catch (err) {
    console.error('Error updating theory:', err); // Log full error on server
    res.status(500).json({ error: err.message || 'Server error while updating theory.' });
  }
};

/**
 * Delete theoretical content by ID
 * @route DELETE /api/theory/:id
 * @access Private (e.g., teachers only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteTheory = async (req, res) => {
  try {
    const deletedTheory = await Theory.findByIdAndDelete(req.params.id);

    if (!deletedTheory) {
      return res.status(404).json({ error: 'Theory with the selected identifier was not found.' });
    }

    // Delete all theory progress entries for this theory
    try {
      await TheoryProgress.deleteMany({ theoryId: req.params.id });
      console.log(`Deleted theory progress entries for theory: ${deletedTheory.title}`);
    } catch (progressError) {
      console.error('Error deleting theory progress entries:', progressError);
      // Don't fail the theory deletion if progress deletion fails
    }

    res.json({ message: 'Theory deleted successfully!' }); // Success message
  } catch (err) {
    console.error('Error deleting theory:', err);
    res.status(500).json({ error: err.message || 'Server error while deleting theory.' });
  }
};