const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Helper to generate luxury order tracking number
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `RLJ-${dateStr}-${randomSuffix}`;
};

// @desc    Create new order with server-side price & inventory validation
// @route   POST /api/orders
// @access  Public / Optional Auth (Supports guest or customer checkout)
exports.createOrder = async (req, res, next) => {
  try {
    const {
      customerDetails,
      shippingAddress,
      items,
      couponCode,
      paymentMethod = 'card',
      notes
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping bag is empty. Please add items before checkout.'
      });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full customer contact details (name, email, phone).'
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete shipping address.'
      });
    }

    // Server-side inventory & price verification: DO NOT TRUST CLIENT TOTALS!
    const validatedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId || item._id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.name || 'Unknown'}" is no longer available in our collection.`
        });
      }

      const qty = parseInt(item.quantity, 10) || 1;
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for "${product.name}". Only ${product.stock} units currently available.`
        });
      }

      // Snapshot the historical item data
      validatedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        image: product.images && product.images[0] ? product.images[0] : item.image,
        price: product.price, // Live server price
        quantity: qty,
        selectedSize: item.selectedSize || 'Standard',
        metal: product.metal,
        purity: product.purity,
        grossWeight: product.grossWeight
      });

      calculatedSubtotal += product.price * qty;

      // Deduct inventory stock
      product.stock -= qty;
      await product.save();
    }

    // Calculate 3% standard Indian GST on jewellery
    const calculatedTax = Math.round(calculatedSubtotal * 0.03);

    // Validate Coupon if provided
    let calculatedDiscount = 0;
    let appliedCouponCode = null;

    if (couponCode && couponCode.trim()) {
      const codeClean = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: codeClean, isActive: true });

      if (coupon && calculatedSubtotal >= (coupon.minOrderValue || 0)) {
        if (coupon.discountType === 'percentage') {
          calculatedDiscount = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount) {
            calculatedDiscount = Math.min(calculatedDiscount, coupon.maxDiscountAmount);
          }
        } else {
          calculatedDiscount = coupon.discountValue;
        }
        appliedCouponCode = coupon.code;
      }
    }

    // Free insured shipping on all orders
    const shippingCharges = 0;
    const calculatedTotal = Math.max(0, calculatedSubtotal + calculatedTax - calculatedDiscount + shippingCharges);

    const orderNumber = generateOrderNumber();
    const trackingNumber = `IND-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user._id : null,
      customerDetails,
      shippingAddress,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      discount: calculatedDiscount,
      couponApplied: appliedCouponCode,
      shippingCharges,
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      orderStatus: 'confirmed',
      estimatedDelivery: '3 to 5 Business Days (Insured Armored Express)',
      trackingNumber,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Your order has been placed with Rishi Lal Jewellers.',
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Public / Protected (If logged in or with matching order number)
exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not authorized to view this order.' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { orderNumber: new RegExp(s, 'i') },
        { 'customerDetails.name': new RegExp(s, 'i') },
        { 'customerDetails.email': new RegExp(s, 'i') },
        { 'customerDetails.phone': new RegExp(s, 'i') }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNum),
      currentPage: pageNum,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status (Admin only)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'delivered') {
        order.paymentStatus = 'completed';
      }
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status successfully updated to "${order.orderStatus}"`,
      order
    });
  } catch (err) {
    next(err);
  }
};

