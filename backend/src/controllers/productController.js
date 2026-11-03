const Product = require('../models/Product');

exports.getAdminProducts = async (req, res, next) => {
  try {
    const { search, category, limit = 100 } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = { $regex: new RegExp(String(category).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') };
    if (search && String(search).trim()) {
      const escaped = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [{ name: new RegExp(escaped, 'i') }, { sku: new RegExp(escaped, 'i') }];
    }
    const limitNum = Math.max(1, Math.min(200, Number.parseInt(limit, 10) || 100));
    const products = await Product.find(query).sort({ updatedAt: -1 }).limit(limitNum);
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) { next(err); }
};

// @desc    Get all products with dynamic search, filters, sorting & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      categorySlug,
      subcategory,
      weightClass,
      gender,
      metal,
      purity,
      minPrice,
      maxPrice,
      maxPriceExclusive,
      search,
      isBestseller,
      isNewArrival,
      isFeatured,
      isBridal,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isPublished: { $ne: false } };

    for (const [label, value] of [['minPrice', minPrice], ['maxPrice', maxPrice], ['maxPriceExclusive', maxPriceExclusive]]) {
      if (value !== undefined && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
        return res.status(400).json({ success: false, message: `Invalid ${label} filter.` });
      }
    }

    // Category filter
    if (categorySlug && categorySlug !== 'all') {
      const slugs = categorySlug.split(',').map((slug) => slug.trim().toLowerCase()).filter(Boolean);
      if (slugs.length === 1 && slugs[0] === 'necklaces') {
        query.$or = [
          { categorySlug: 'necklaces' },
          { category: /necklace/i },
          { tags: { $in: ['necklace', 'choker', 'haar', 'mangalsutra'] } }
        ];
      } else if (slugs.length === 1 && slugs[0] === 'gold') {
        query.$or = [
          { categorySlug: 'gold' },
          { category: /gold/i },
          { metal: /gold/i },
          { tags: { $in: ['gold', 'temple', '22k', '18k'] } }
        ];
      } else if (slugs.length === 1 && (slugs[0] === 'diamond' || slugs[0] === 'diamonds')) {
        query.$or = [
          { categorySlug: 'diamond' },
          { category: /diamond/i },
          { tags: { $in: ['diamond', 'solitaire', 'polki'] } },
          { 'gemstones.type': /diamond/i }
        ];
      } else if (slugs.length === 1 && (slugs[0] === 'earrings' || slugs[0] === 'earring')) {
        query.$or = [
          { categorySlug: 'earrings' },
          { category: /earring/i },
          { tags: { $in: ['earring', 'earrings', 'jhumka', 'jhumkas', 'stud', 'studs'] } }
        ];
      } else if (slugs.length === 1 && (slugs[0] === 'rings' || slugs[0] === 'ring')) {
        query.$or = [
          { categorySlug: 'rings' },
          { category: /\brings?\b/i },
          { tags: { $in: ['ring', 'rings', 'band', 'signet', 'cocktail ring'] } }
        ];
      } else if (slugs.length === 1 && (slugs[0] === 'bangles' || slugs[0] === 'bangle')) {
        query.$or = [
          { categorySlug: 'bangles' },
          { category: /bangle|kada|bracelet/i },
          { tags: { $in: ['bangle', 'bangles', 'kada', 'kadas', 'bracelet', 'meenakari', 'nazariya'] } }
        ];
      } else {
        query.categorySlug = slugs.length > 1 ? { $in: slugs } : slugs[0];
      }
    } else if (category && category !== 'all') {
      if (/necklace/i.test(category)) {
        query.$or = [
          { categorySlug: 'necklaces' },
          { category: /necklace/i },
          { tags: { $in: ['necklace', 'choker', 'haar', 'mangalsutra'] } }
        ];
      } else if (/^gold$/i.test(category)) {
        query.$or = [
          { categorySlug: 'gold' },
          { category: /gold/i },
          { metal: /gold/i },
          { tags: { $in: ['gold', 'temple', '22k', '18k'] } }
        ];
      } else if (/^diamond/i.test(category)) {
        query.$or = [
          { categorySlug: 'diamond' },
          { category: /diamond/i },
          { tags: { $in: ['diamond', 'solitaire', 'polki'] } },
          { 'gemstones.type': /diamond/i }
        ];
      } else if (/^earring/i.test(category)) {
        query.$or = [
          { categorySlug: 'earrings' },
          { category: /earring/i },
          { tags: { $in: ['earring', 'earrings', 'jhumka', 'jhumkas', 'stud', 'studs'] } }
        ];
      } else if (/^ring/i.test(category)) {
        query.$or = [
          { categorySlug: 'rings' },
          { category: /\brings?\b/i },
          { tags: { $in: ['ring', 'rings', 'band', 'signet', 'cocktail ring'] } }
        ];
      } else if (/^bangle/i.test(category) || /^kada/i.test(category)) {
        query.$or = [
          { categorySlug: 'bangles' },
          { category: /bangle|kada|bracelet/i },
          { tags: { $in: ['bangle', 'bangles', 'kada', 'kadas', 'bracelet', 'meenakari', 'nazariya'] } }
        ];
      } else {
        query.category = { $regex: new RegExp(category, 'i') };
      }
    }

    // Metal filter
    if (metal && metal !== 'all') {
      const normalizedMetal = metal.trim();
      if (/^diamond$/i.test(normalizedMetal)) {
        query.$and = [...(query.$and || []), { $or: [{ metalType: 'Diamond' }, { 'gemstones.type': /diamond/i }, { tags: 'diamond' }] }];
      } else {
        query.$and = [...(query.$and || []), { $or: [{ metalType: new RegExp(`^${normalizedMetal}$`, 'i') }, { metal: new RegExp(normalizedMetal, 'i') }] }];
      }
    }

    if (subcategory && subcategory !== 'all') {
      const styleRegex = new RegExp(subcategory.trim(), 'i');
      query.$and = [...(query.$and || []), { $or: [
        { subcategory: styleRegex },
        { category: styleRegex },
        { name: styleRegex },
        { tags: styleRegex }
      ] }];
    }
    if (weightClass && weightClass !== 'all') query.weightClass = weightClass;

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
    if (maxPriceExclusive) {
      query.price = { ...(query.price || {}), $lt: Number(maxPriceExclusive) };
    }
    if (minPrice || maxPrice || maxPriceExclusive) query.pricingType = { $ne: 'price-on-request' };

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
      const searchClause = { $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { sku: searchRegex },
        { tags: searchRegex }
      ] };
      query.$and = [...(query.$and || []), searchClause];
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
    const bestsellers = await Product.find({ isBestseller: true, isPublished: { $ne: false } }).limit(8);
    const newArrivals = await Product.find({ isNewArrival: true, isPublished: { $ne: false } }).limit(8);
    const bridalCollection = await Product.find({ isBridal: true, isPublished: { $ne: false } }).limit(8);
    const featured = await Product.find({ isFeatured: true, isPublished: { $ne: false } }).limit(8);

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
      product = await Product.findOne({ sku: identifier.toUpperCase() });
    }

    if (!product) {
      const match = identifier.match(/^prod-?(\d+)$/i);
      if (match) {
        const num = match[1].padStart(3, '0');
        product = await Product.findOne({
          $or: [
            { sku: new RegExp(`-${num}$`, 'i') },
            { sku: new RegExp(`-${match[1]}$`, 'i') }
          ]
        });
      }
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Jewelry piece not found'
      });
    }

    if (product.isPublished === false) {
      return res.status(404).json({ success: false, message: 'Jewelry piece not found' });
    }

    // Also fetch 4 related products in same category
    const relatedProducts = await Product.find({
      categorySlug: product.categorySlug,
      _id: { $ne: product._id },
      isPublished: { $ne: false }
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

// @desc    Approve indicative price and enable orderability (Admin only)
// @route   PATCH /api/products/:id/approve-price
// @access  Private/Admin
exports.approveProductPrice = async (req, res, next) => {
  try {
    const { approvedPrice, stock = 5 } = req.body || {};
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const price = approvedPrice !== undefined && Number(approvedPrice) > 0 ? Number(approvedPrice) : product.price;

    product.price = price;
    product.priceStatus = 'approved';
    product.pricingType = 'business-set';
    product.isOrderable = true;
    product.availability = 'in-stock';
    if (stock) product.stock = Math.max(1, Number(stock));

    await product.save();

    res.status(200).json({
      success: true,
      message: `Selling price for "${product.name}" approved at ₹${Number(product.price).toLocaleString('en-IN')}. Product is now orderable.`,
      product
    });
  } catch (err) {
    next(err);
  }
};


