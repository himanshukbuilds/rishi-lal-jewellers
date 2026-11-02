const express = require('express');
const router = express.Router();
const {
  createOrder,
  createRazorpayOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, requireAdmin } = require('../middleware/auth');

// Create Razorpay order for online checkout
router.post('/razorpay-order', protect, createRazorpayOrder);

// Create order (authenticated customer or guest)
router.post('/', protect, createOrder);

// Customer specific
router.get('/my-orders', protect, getMyOrders);

// Admin specific order management
router.get('/admin/all', protect, requireAdmin, getAllOrders);
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);

// Get single order
router.get('/:id', protect, getOrder);

module.exports = router;

