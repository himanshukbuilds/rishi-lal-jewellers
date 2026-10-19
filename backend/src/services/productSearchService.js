const Product = require('../models/Product');

/**
 * Service to search and retrieve real products from MongoDB for the AI Jewelry Concierge.
 */

// Heuristic keyword mapping for intelligent intent detection (specific items before generic materials)
const CATEGORY_KEYWORDS = {
  'gold-coins': ['gold coin', 'gold coins', 'bullion', '24k coin', '24kt coin', 'lakshmi coin', 'coin', 'coins'],
  'silver-idols': ['silver idol', 'silver idols', 'ganesha', 'ganesh', 'murti', 'silver coin', 'silver'],
  bridal: ['bridal', 'wedding', 'dulhan', 'shaadi', 'marriage', 'choker set', 'jadau', 'polki', 'trousseau'],
  necklaces: ['necklace', 'necklaces', 'haar', 'choker', 'collar', 'mangalsutra', 'pendant', 'chain', 'rope chain'],
  earrings: ['earring', 'earrings', 'jhumka', 'jhumkas', 'studs', 'chandbali', 'hoops', 'drops'],
  rings: ['ring', 'rings', 'angooti', 'engagement', 'band', 'solitaire ring', 'signet ring', 'cocktail ring'],
  bangles: ['bangle', 'bangles', 'kada', 'kadas', 'bracelet', 'bracelets', 'chooda', 'wrist'],
  gifts: ['gift', 'gifts', 'gifting', 'anniversary', 'birthday', 'keepsake', 'token'],
  diamond: ['diamond', 'solitaire', 'sparkle', 'carat', 'vvs', 'igi', 'gia', 'tennis bracelet'],
  gold: ['22k', '22kt', '916', 'temple', 'yellow gold', 'antique gold', 'hallmarked', 'gold']
};

/**
 * Extracts structured search criteria from a natural language customer query.
 */
function extractSearchCriteria(message = '', history = []) {
  const text = message.toLowerCase();
  const criteria = {
    categorySlug: null,
    maxPrice: null,
    minPrice: null,
    metal: null,
    keywords: [],
    isBridal: false,
    occasion: null
  };

  // 1. Budget extraction
  // Handles formats like: "under 50k", "under 50000", "below 1 lakh", "under ₹50,000", "budget 30000", "between 20k and 50k"
  const underMatch = text.match(/(?:under|below|less than|max|within|budget of?)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|thousand|lakh|lac)?/i);
  if (underMatch) {
    let value = parseFloat(underMatch[1].replace(/,/g, ''));
    const unit = (underMatch[2] || '').toLowerCase();
    if (unit === 'k' || unit === 'thousand') value *= 1000;
    if (unit === 'lakh' || unit === 'lac') value *= 100000;
    criteria.maxPrice = value;
  }

  // Also check "50k" or "50000 budget"
  if (!criteria.maxPrice) {
    const directKMatch = text.match(/(\d+)\s*k\s*(?:budget|range|max|under)?/i);
    if (directKMatch) {
      criteria.maxPrice = parseFloat(directKMatch[1]) * 1000;
    }
  }

  // Minimum price (e.g. "above 1 lakh", "more than 50k")
  const aboveMatch = text.match(/(?:above|more than|starting from|minimum|min)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|thousand|lakh|lac)?/i);
  if (aboveMatch) {
    let value = parseFloat(aboveMatch[1].replace(/,/g, ''));
    const unit = (aboveMatch[2] || '').toLowerCase();
    if (unit === 'k' || unit === 'thousand') value *= 1000;
    if (unit === 'lakh' || unit === 'lac') value *= 100000;
    criteria.minPrice = value;
  }

  // 2. Category extraction
  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      criteria.categorySlug = slug;
      if (slug === 'bridal') criteria.isBridal = true;
      break;
    }
  }

  // 3. Fallback to conversation history if user says "cheaper", "more options", "in gold", etc.
  if (!criteria.categorySlug && history && history.length > 0) {
    const recentCustomerTexts = history
      .filter((h) => h.role === 'user')
      .slice(-3)
      .map((h) => (h.text || h.content || '').toLowerCase())
      .reverse();

    for (const prevText of recentCustomerTexts) {
      for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some((kw) => prevText.includes(kw))) {
          criteria.categorySlug = slug;
          break;
        }
      }
      if (criteria.categorySlug) break;
    }
  }

  // 4. Metal & Occasion
  if (text.includes('white gold')) criteria.metal = 'White Gold';
  else if (text.includes('rose gold')) criteria.metal = 'Rose Gold';
  else if (text.includes('22k') || text.includes('22kt') || text.includes('yellow gold')) criteria.metal = '22K Yellow Gold';
  else if (text.includes('platinum')) criteria.metal = 'Platinum';

  if (text.includes('wedding') || text.includes('bridal') || text.includes('shaadi')) criteria.occasion = 'Wedding & Bridal';
  else if (text.includes('daily') || text.includes('everyday') || text.includes('casual') || text.includes('office')) criteria.occasion = 'Daily Wear';
  else if (text.includes('festive') || text.includes('diwali') || text.includes('puja')) criteria.occasion = 'Festive';
  else if (text.includes('gift') || text.includes('anniversary') || text.includes('birthday')) criteria.occasion = 'Gifting';

  return criteria;
}

/**
 * Searches the MongoDB product database with the given filters.
 */
async function searchProducts(filters = {}, limit = 4) {
  try {
    const query = { stock: { $gt: 0 } };

    // Price filtering
    if (filters.maxPrice || filters.minPrice) {
      query.price = {};
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
      if (filters.minPrice) query.price.$gte = filters.minPrice;
    }

    // Category / Collection filtering
    if (filters.categorySlug) {
      if (filters.categorySlug === 'bridal') {
        query.$or = [
          { categorySlug: 'bridal' },
          { isBridal: true },
          { tags: { $in: ['bridal', 'wedding'] } }
        ];
      } else if (filters.categorySlug === 'silver-idols') {
        query.$or = [
          { categorySlug: 'gifts' },
          { tags: { $in: ['silver', 'idols', 'ganesha', 'gifts'] } },
          { name: { $regex: /silver|ganesha|idol/i } }
        ];
      } else if (filters.categorySlug === 'gold-coins') {
        query.$or = [
          { categorySlug: 'gold' },
          { tags: { $in: ['coin', 'coins', 'bullion', 'gold'] } },
          { name: { $regex: /coin|bullion/i } }
        ];
      } else {
        query.categorySlug = filters.categorySlug;
      }
    }

    // Metal filter
    if (filters.metal) {
      query.metal = { $regex: new RegExp(filters.metal, 'i') };
    }

    // Keyword / Text match if provided
    if (filters.keywords && filters.keywords.length > 0) {
      const regexTerms = filters.keywords.map((k) => new RegExp(k, 'i'));
      query.$or = [
        ...(query.$or || []),
        { name: { $in: regexTerms } },
        { tags: { $in: regexTerms } }
      ];
    }

    // Execute query
    let products = await Product.find(query)
      .select('_id name slug sku price originalPrice discountPercentage category categorySlug metal purity grossWeight images stock rating reviewsCount certification tags isBridal isBestseller')
      .sort({ isBestseller: -1, isFeatured: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    // If no products match strict filters, relax category or metal
    if (products.length === 0 && (filters.metal || query.$or)) {
      const fallbackQuery = { stock: { $gt: 0 } };
      if (filters.maxPrice) fallbackQuery.price = { $lte: filters.maxPrice };
      if (filters.categorySlug) fallbackQuery.categorySlug = filters.categorySlug;

      products = await Product.find(fallbackQuery)
        .select('_id name slug sku price originalPrice discountPercentage category categorySlug metal purity grossWeight images stock rating reviewsCount certification tags isBridal isBestseller')
        .sort({ rating: -1, isBestseller: -1 })
        .limit(limit)
        .lean();
    }

    // Format fields for frontend consumption
    return products.map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      discountPercentage: p.discountPercentage || 0,
      category: p.category,
      categorySlug: p.categorySlug,
      metal: p.metal,
      purity: p.purity,
      grossWeight: p.grossWeight,
      imageUrl: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
      images: p.images || [],
      stock: p.stock,
      rating: p.rating || 4.9,
      reviewsCount: p.reviewsCount || 12,
      certification: p.certification || '100% BIS Hallmarked',
      productUrl: `/products/${p.slug}`,
      isBridal: p.isBridal,
      isBestseller: p.isBestseller
    }));
  } catch (error) {
    console.error('[ProductSearchService] Database search error:', error.message);
    return [];
  }
}

/**
 * Returns a high-level catalog summary for prompt context.
 */
async function getCatalogSummary() {
  try {
    const totalCount = await Product.countDocuments({ stock: { $gt: 0 } });
    return {
      storeName: 'Rishi Lal Jewellers',
      hallmark: '100% BIS Hallmarked & IGI / GIA Certified Diamonds',
      collections: [
        'Bridal & Wedding Ensembles (Polki, Kundan & 22KT Gold)',
        'Natural Solitaire Diamonds (VVS-VS Clarity, E-F Color)',
        '22KT Heritage Temple Gold & Nakshi Masterpieces',
        'Royal Earrings & Jhumkas',
        'Engagement & Statement Solitaire Rings',
        'Haars, Chokers & Contemporary Mangalsutras',
        'Solid Gold Kadas & Diamond Tennis Bracelets',
        'Curated Jewels Under ₹50,000',
        '999 Pure Solid Silver Idols (Lord Ganesha & Lakshmi)',
        '24KT 999 Auspicious Bullion Gold Coins'
      ],
      totalInStock: totalCount
    };
  } catch (err) {
    return { storeName: 'Rishi Lal Jewellers' };
  }
}

module.exports = {
  extractSearchCriteria,
  searchProducts,
  getCatalogSummary
};
