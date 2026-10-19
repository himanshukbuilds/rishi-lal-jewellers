const Coupon = require('../models/Coupon');

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a coupon code'
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promotional code'
      });
    }

    const subtotal = Number(orderAmount) || 0;
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum cart value of ₹${coupon.minOrderValue.toLocaleString('en-IN')}`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" applied! You save ₹${discountAmount.toLocaleString('en-IN')}`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (err) {
    next(err);
  }
};

