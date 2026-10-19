const { extractSearchCriteria, searchProducts, getCatalogSummary } = require('../services/productSearchService');
const { generateGeminiReply } = require('../services/geminiService');

/**
 * Predefined verified responses for store policies and frequent jewelry queries
 */
const POLICY_KNOWLEDGE = {
  hallmark: {
    patterns: ['hallmark', 'bis', 'purity', 'certified', 'huid', 'genuine', 'authentic', 'igi', 'gia'],
    reply: 'Every single gold creation at Rishi Lal Jewellers is 100% BIS Hallmarked with authentic 6-digit HUID laser engraving. All natural solitaire diamonds are accompanied by tamper-proof IGI or GIA laboratory certificates verifying 4Cs grading, cut quality, and natural origin.'
  },
  returnPolicy: {
    patterns: ['return', 'refund', 'exchange', '15 days', 'money back', 'buyback'],
    reply: 'We offer a hassle-free 15-day return and exchange policy on all unworn jewelry in its original luxury packaging with certificates intact. We also provide lifetime exchange and buyback privileges based on prevailing daily gold and diamond market rates.'
  },
  shipping: {
    patterns: ['shipping', 'delivery', 'delivery time', 'courier', 'track', 'cod', 'cash on delivery'],
    reply: 'We provide complimentary, 100% insured delivery across India. Orders are dispatched in tamper-evident security packaging via specialized armored logistics partners within 2 to 5 business days.'
  },
  storeLocation: {
    patterns: ['store', 'showroom', 'visit', 'address', 'location', 'phone', 'contact', 'hours'],
    reply: 'You are warmly invited to visit our flagship boutique at 124 Heritage Lane, Karol Bagh, New Delhi (Open Mon-Sun 10:30 AM – 8:30 PM). You can also reach our jewelry concierge directly at +91 98765 43210 or care@rishilaljewellers.com.'
  },
  silverIdols: {
    patterns: ['silver idol', 'silver idols', 'ganesh', 'ganesha', 'lakshmi idol', 'silver murti'],
    reply: 'Our Divine Silver Idols collection features pure 999 solid sterling silver sacred murtis of Lord Ganesha and Goddess Lakshmi, sculpted with intricate Nakshi filigree work and protected with an anti-tarnish fine luster.'
  },
  goldCoins: {
    patterns: ['gold coin', 'gold coins', 'bullion', '24k coin', '24kt coin'],
    reply: 'Our 24KT 999 pure gold bullion coins feature embossed auspicious motifs of Goddess Lakshmi and Lord Ganesha. Each coin has precision reeded edges and arrives sealed in tamper-proof certicards with official BIS hallmarks.'
  }
};

/**
 * Intelligent Concierge fallback when Gemini is not configured or temporarily unreachable
 */
function generateConciergeFallback({ message, criteria, products, summary }) {
  const text = message.toLowerCase();

  // Check policy questions
  for (const [key, item] of Object.entries(POLICY_KNOWLEDGE)) {
    if (item.patterns.some((pattern) => text.includes(pattern))) {
      return {
        reply: item.reply,
        suggestedActions: ['Bridal Collection', 'Under ₹50K', 'Silver Idols', 'Gold Coins']
      };
    }
  }

  // If products were found from database
  if (products && products.length > 0) {
    const count = products.length;
    let categoryName = criteria.categorySlug
      ? criteria.categorySlug.charAt(0).toUpperCase() + criteria.categorySlug.slice(1)
      : 'handcrafted';

    let intro = `Here are ${count} exquisite ${categoryName} creations from our showroom`;
    if (criteria.maxPrice) {
      intro += ` within your budget of ₹${criteria.maxPrice.toLocaleString('en-IN')}:`;
    } else {
      intro += ' curated for your consideration:';
    }

    const highlights = products
      .slice(0, 3)
      .map((p) => `• **${p.name}** — ₹${p.price.toLocaleString('en-IN')} (${p.purity || p.metal})`)
      .join('\n');

    const reply = `${intro}\n\n${highlights}\n\nEvery piece is 100% BIS Hallmarked and backed by our lifetime authenticity guarantee. Would you like to inspect any of these in detail?`;

    return {
      reply,
      suggestedActions: [
        'Under ₹50K',
        'Bridal Collection',
        'Natural Diamonds',
        '22K Heritage Gold'
      ]
    };
  }

  // When no matching products exist with current filters
  if (criteria.maxPrice) {
    return {
      reply: `We currently do not have matching creations under ₹${criteria.maxPrice.toLocaleString('en-IN')} in that specific category. Would you like to explore our popular lightweight gold chains and diamond studs starting from ₹42,000, or view our Under ₹50K collection?`,
      suggestedActions: ['Shop Under ₹50K', 'Diamond Studs', 'Gold Chains', 'Contact Stylist']
    };
  }

  // General conversational greeting / assistance
  if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('namaste')) {
    return {
      reply: "Hi! I'm Halku, your jewellery shopping assistant at Rishi Lal Jewellers. ✨ How can I help you today? Whether you are curating a grand bridal trousseau, choosing a milestone gift, or exploring certified solitaires, I am delighted to guide you.",
      suggestedActions: ['Find Jewelry', 'Bridal Collection', 'Shop Under ₹50K', 'Silver Idols', 'Gold Coins']
    };
  }

  return {
    reply: "I'm Halku, your jewellery shopping assistant at Rishi Lal Jewellers. We offer an exquisite array of 100% BIS Hallmarked 22KT gold, IGI certified natural diamonds, and heritage wedding jewelry. Tell me your preferred style, occasion, or budget, and I will be delighted to present our finest creations.",
    suggestedActions: ['Bridal Collection', 'Solitaire Diamonds', 'Shop Under ₹50K', 'Gold Coins', 'Help & Policies']
  };
}

/**
 * POST /api/chat - Main chatbot interaction endpoint
 */
exports.handleChatMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    // 1. Validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A message string is required.'
      });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 500 characters.'
      });
    }

    const cleanHistory = Array.isArray(history)
      ? history.slice(-10).map((turn) => ({
          role: turn.role === 'user' ? 'user' : 'model',
          text: String(turn.text || turn.content || '').slice(0, 500)
        }))
      : [];

    // 2. Extract structured criteria and query MongoDB for real products
    const criteria = extractSearchCriteria(cleanMessage, cleanHistory);
    const [matchingProducts, catalogSummary] = await Promise.all([
      searchProducts(criteria, 4),
      getCatalogSummary()
    ]);

    // 3. Attempt Gemini generation
    const geminiResult = await generateGeminiReply({
      message: cleanMessage,
      history: cleanHistory,
      relevantProducts: matchingProducts,
      catalogSummary
    });

    let finalReply = '';
    let suggestedActions = ['Bridal Collection', 'Shop Under ₹50K', 'Silver Idols', 'Gold Coins', 'Help & Support'];

    if (geminiResult.success && geminiResult.reply) {
      finalReply = geminiResult.reply;

      // Dynamic suggested actions based on context
      if (criteria.categorySlug === 'bridal') {
        suggestedActions = ['Chokers & Haars', 'Polki Sets', 'Under ₹50K', 'Book Appointment'];
      } else if (criteria.maxPrice) {
        suggestedActions = ['Under ₹50K', 'Diamond Studs', 'Gold Rope Chain', 'View All'];
      }
    } else {
      // 4. Graceful fallback to verified Concierge Knowledge Engine
      const fallback = generateConciergeFallback({
        message: cleanMessage,
        criteria,
        products: matchingProducts,
        summary: catalogSummary
      });
      finalReply = fallback.reply;
      suggestedActions = fallback.suggestedActions || suggestedActions;
    }

    // 5. Send clean response with real products
    return res.status(200).json({
      success: true,
      reply: finalReply,
      products: matchingProducts,
      suggestedActions,
      criteria: {
        category: criteria.categorySlug,
        maxPrice: criteria.maxPrice,
        occasion: criteria.occasion
      }
    });
  } catch (error) {
    console.error('[ChatController] Error processing chat message:', error);
    return res.status(500).json({
      success: false,
      reply: "I'm having trouble assisting you right now. Please try again shortly or contact our concierge team at +91 98765 43210.",
      products: [],
      suggestedActions: ['Find Jewelry', 'Bridal Collection', 'Shop Under ₹50K', 'Help & Support']
    });
  }
};

