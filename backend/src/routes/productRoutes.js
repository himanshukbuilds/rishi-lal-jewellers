const express = require('express');
const router = express.Router();
const {
  getProducts,
  getAdminProducts,
  getProductHighlights,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProductPrice
} = require('../controllers/productController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/highlights', getProductHighlights);
router.get('/admin', protect, requireAdmin, getAdminProducts);
router.get('/:identifier', getProduct);

// Protected Admin Routes
router.post('/', protect, requireAdmin, createProduct);
router.put('/:id', protect, requireAdmin, updateProduct);
router.patch('/:id/approve-price', protect, requireAdmin, approveProductPrice);
router.delete('/:id', protect, requireAdmin, deleteProduct);

module.exports = router;

