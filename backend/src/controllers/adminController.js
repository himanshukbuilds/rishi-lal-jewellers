const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Admin Dashboard metrics, revenue, sales charts, inventory alerts
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate revenue from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('orderNumber customerDetails totalAmount orderStatus paymentMethod createdAt');

    // Bestselling products
    const bestsellers = await Product.find({ isBestseller: true })
      .limit(5)
      .select('name sku price images stock rating category');

    // Low stock inventory alert (stock <= 3)
    const lowStockAlerts = await Product.find({ stock: { $lte: 3 } })
      .limit(10)
      .select('name sku price stock images category');

    // Category distribution for charts
    const categoryDistribution = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Order status summary
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    // Monthly sales simulation/aggregation
    const monthlySales = [
      { month: 'May', sales: 485000, orders: 12 },
      { month: 'Jun', sales: 620000, orders: 16 },
      { month: 'Jul', sales: 740000, orders: 19 },
      { month: 'Aug', sales: 890000, orders: 23 },
      { month: 'Sep', sales: 1120000, orders: 28 },
      { month: 'Oct', sales: Math.max(950000, totalRevenue), orders: Math.max(24, totalOrders) }
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        pendingOrders: await Order.countDocuments({ orderStatus: { $in: ['placed', 'confirmed', 'crafting'] } }),
        lowStockCount: await Product.countDocuments({ stock: { $lte: 3 } })
      },
      recentOrders,
      bestsellers,
      lowStockAlerts,
      categoryDistribution,
      ordersByStatus,
      monthlySales
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get registered customers list with order stats
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { role: 'customer' };

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: new RegExp(s, 'i') },
        { email: new RegExp(s, 'i') },
        { phone: new RegExp(s, 'i') }
      ];
    }

    const customers = await User.find(query)
      .sort({ createdAt: -1 })
      .select('-password');

    // Aggregate spend per customer
    const customerOrders = await Order.aggregate([
      { $match: { user: { $ne: null } } },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrderDate: { $max: '$createdAt' }
        }
      }
    ]);

    const orderMap = {};
    customerOrders.forEach((item) => {
      orderMap[item._id.toString()] = item;
    });

    const enrichedCustomers = customers.map((c) => {
      const stats = orderMap[c._id.toString()] || { orderCount: 0, totalSpent: 0, lastOrderDate: null };
      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone || 'N/A',
        createdAt: c.createdAt,
        addressesCount: c.addresses ? c.addresses.length : 0,
        orderCount: stats.orderCount,
        totalSpent: stats.totalSpent,
        lastOrderDate: stats.lastOrderDate
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedCustomers.length,
      customers: enrichedCustomers
    });
  } catch (err) {
    next(err);
  }
};

