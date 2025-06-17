/**
 * Gemini Routes
 * Defines API endpoints for AI chat functionality using Google's Gemini API
 */

const express = require('express');
const router = express.Router();
const { geminiChat } = require('../controllers/geminiController');

router.post('/chat', geminiChat);

module.exports = router;
