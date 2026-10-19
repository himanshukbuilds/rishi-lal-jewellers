const express = require('express');
const rateLimit = require('express-rate-limit');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Rate limiting for the AI chatbot endpoint: max 60 requests per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    reply: 'Our jewelry concierge has received high inquiry volume. Please pause for a moment and try again shortly.',
    products: []
  }
});

// POST /api/chat - Public customer conversation endpoint
router.post('/', chatLimiter, chatController.handleChatMessage);

module.exports = router;

