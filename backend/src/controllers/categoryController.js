const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
    res.status(200).json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image, displayOrder } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      displayOrder: displayOrder || 0
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (err) {
    next(err);
  }
};

