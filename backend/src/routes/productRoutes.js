const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductHighlights,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/highlights', getProductHighlights);
router.get('/:identifier', getProduct);

// Protected Admin Routes
router.post('/', protect, requireAdmin, createProduct);
router.put('/:id', protect, requireAdmin, updateProduct);
router.delete('/:id', protect, requireAdmin, deleteProduct);

module.exports = router;

