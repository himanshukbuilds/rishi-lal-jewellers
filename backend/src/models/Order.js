const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String },
  metal: { type: String },
  purity: { type: String },
  grossWeight: { type: Number }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    couponApplied: {
      type: String,
      default: null
    },
    shippingCharges: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'cod'],
      default: 'card'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'crafting', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed'
    },
    estimatedDelivery: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);

