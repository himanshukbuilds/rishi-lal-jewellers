const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: true
    },
    minOrderValue: {
      type: Number,
      default: 0
    },
    maxDiscountAmount: {
      type: Number
    },
    isActive: {
      type: Boolean,
      default: true
    },
    validUntil: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Coupon', couponSchema);

