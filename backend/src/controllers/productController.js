const Product = require('../models/Product');

// @desc    Get all products with dynamic search, filters, sorting & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      categorySlug,
      gender,
      metal,
      purity,
      minPrice,
      maxPrice,
      search,
      isBestseller,
      isNewArrival,
      isFeatured,
      isBridal,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Category filter
    if (categorySlug && categorySlug !== 'all') {
      const slugs = categorySlug.split(',').map((slug) => slug.trim().toLowerCase()).filter(Boolean);
      query.categorySlug = slugs.length > 1 ? { $in: slugs } : slugs[0];
    } else if (category && category !== 'all') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    // Metal filter
    if (metal && metal !== 'all') {
      query.metal = { $regex: new RegExp(metal, 'i') };
    }

    // Purity filter
    if (purity && purity !== 'all') {
      query.purity = { $regex: new RegExp(purity, 'i') };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Special tags
    if (isBestseller === 'true') query.isBestseller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isFeatured === 'true') query.isFeatured = true;
    if (isBridal === 'true') query.isBridal = true;

    // Gender filter & Search query
    if (gender && gender !== 'all') {
      const g = gender.trim().toLowerCase();
      const targetGender = (g === 'kids' || g === 'children') ? 'kids' : g;
      const andConditions = [
        {
          $or: [
            { gender: targetGender },
            { gender: 'unisex' },
            { tags: targetGender }
          ]
        }
      ];

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        andConditions.push({
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
            { sku: searchRegex },
            { tags: searchRegex }
          ]
        });
      }

      query.$and = andConditions;
    } else if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { sku: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'bestseller') sortOption = { isBestseller: -1, rating: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured products and bestsellers for homepage
// @route   GET /api/products/highlights
// @access  Public
exports.getProductHighlights = async (req, res, next) => {
  try {
    const bestsellers = await Product.find({ isBestseller: true }).limit(8);
    const newArrivals = await Product.find({ isNewArrival: true }).limit(8);
    const bridalCollection = await Product.find({ isBridal: true }).limit(8);
    const featured = await Product.find({ isFeatured: true }).limit(8);

    res.status(200).json({
      success: true,
      bestsellers,
      newArrivals,
      bridalCollection,
      featured
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:identifier
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    // Check if it's a valid ObjectId, otherwise query by slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Jewelry piece not found'
      });
    }

    // Also fetch 4 related products in same category
    const relatedProducts = await Product.find({
      categorySlug: product.categorySlug,
      _id: { $ne: product._id }
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      categorySlug,
      price,
      originalPrice,
      description,
      metal,
      purity,
      grossWeight,
      netGoldWeight,
      stock,
      images,
      availableSizes,
      isBestseller,
      isNewArrival,
      isFeatured,
      isBridal,
      tags
    } = req.body;

    // Auto-generate slug and SKU if not provided
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const skuPrefix = (categorySlug || 'JW').substring(0, 3).toUpperCase();
    const sku = req.body.sku || `AUR-${skuPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const product = await Product.create({
      ...req.body,
      slug,
      sku,
      discountPercentage: originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0
    });

    res.status(201).json({
      success: true,
      message: 'Luxury jewelry creation successfully added to catalog',
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Recalculate discount if price or originalPrice changed
    if (req.body.price || req.body.originalPrice) {
      const p = req.body.price || product.price;
      const op = req.body.originalPrice || product.originalPrice;
      if (op && op > p) {
        req.body.discountPercentage = Math.round(((op - p) / op) * 100);
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product successfully removed from catalog'
    });
  } catch (err) {
    next(err);
  }
};

