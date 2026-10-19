const express = require('express');
const router = express.Router();
const { getDashboardStats, getCustomers } = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/customers', getCustomers);

module.exports = router;

