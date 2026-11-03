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

// GET /api/metal-prices (or /api/market-prices) - All Precious Metals
router.get('/', priceLimiter, marketPriceController.getPreciousMetalPrices);

// GET /api/metal-prices/gold - Gold only (24K, 22K, 18K per gram & 10g)
router.get('/gold', priceLimiter, marketPriceController.getGoldPrices);

// GET /api/metal-prices/silver - Silver only (per gram & per kg)
router.get('/silver', priceLimiter, marketPriceController.getSilverPrices);

module.exports = router;

