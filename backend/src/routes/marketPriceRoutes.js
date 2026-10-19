const express = require('express');
const rateLimit = require('express-rate-limit');
const marketPriceController = require('../controllers/marketPriceController');

const router = express.Router();

// Rate limiting: max 120 requests per 15 minutes per IP
const priceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many price inquiries. Please wait a moment.'
  }
});

// GET /api/market-prices
router.get('/', priceLimiter, marketPriceController.getPreciousMetalPrices);

module.exports = router;

