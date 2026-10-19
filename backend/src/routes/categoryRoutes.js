const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/', getCategories);
router.post('/', protect, requireAdmin, createCategory);

module.exports = router;

