const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  toggleWishlist
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/toggle', protect, toggleWishlist);

module.exports = router;

