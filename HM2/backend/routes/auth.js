/**
 * Authentication Routes
 * Defines API endpoints for user authentication and profile management
 */

const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', updateProfile); // Add profile update route

module.exports = router;
