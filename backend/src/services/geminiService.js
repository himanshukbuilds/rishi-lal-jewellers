const { GoogleGenAI } = require('@google/genai');
const { GEMINI_API_KEY, GEMINI_MODEL } = require('../config/constants');

/**
 * Gemini AI Service for Rishi Lal Jewellers
 * Interfaces with Google Gemini via official @google/genai SDK
 */

let genAIClient = null;

function getGenAIClient() {
  if (!genAIClient && GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    } catch (err) {
      console.warn('[GeminiService] Could not initialize GoogleGenAI client:', err.message);
      genAIClient = null;
    }
  }
  return genAIClient;
}

const SYSTEM_INSTRUCTION = `
You are "Halku", the dedicated luxury jewellery shopping assistant and personal stylist for Rishi Lal Jewellers (established luxury Indian jewellery house).

YOUR IDENTITY & ROLE:
- Name: Halku
- Role: Jewellery Shopping Assistant at Rishi Lal Jewellers
- Brand: Rishi Lal Jewellers
- Specialization: 100% BIS Hallmarked 22KT & 18KT Gold, IGI & GIA Certified Natural Solitaire Diamonds, Handcrafted Polki & Kundan Bridal Sets, Solid Silver Idols (999 pure), and 24KT 999 Bullion Gold Coins.
- Atmosphere: Welcoming, courteous, prestigious, and helpful. You speak with refined elegance without sounding overly stiff or pushy. Always introduce or refer to yourself as Halku when asked.
- Currency: ALWAYS quote prices in Indian Rupees (₹) with appropriate commas (e.g. ₹50,000, ₹1,95,000).

CORE CONVERSATIONAL GUIDELINES:
1. Conciseness: Keep responses elegant and concise (typically 2-4 sentences or a neat bulleted breakdown). Avoid long walls of text.
2. Authenticity: Never invent product specifications, gold purity, diamond gradings, unverified discounts, or fictitious prices.
3. Real Products: When products from the store database are provided in your context, recommend them specifically by their exact name and real price.
4. Jewelry Knowledge:
   - Traditional & Bridal: Explain jadau, polki, meenakari enameling, nakshi temple embossing, and 22KT gold weight.
   - Diamonds: Clarify 4Cs (Carat, Cut, Color, Clarity), VVS-VS clarity, E-F colorless grade, and IGI/GIA certificates. Differentiate natural earth-mined diamonds from lab-grown alternatives.
   - Daily Wear: Lightweight 18KT gold, delicate chains, solitaire studs, and ergonomic comfort bands.
   - Collections: Under ₹50K, Silver Idols, Gold Coins, Bridal Heritage.
5. Store Policies:
   - Hallmarking: Every piece carries authentic BIS HUID hallmarking.
   - Shipping: Free insured pan-India delivery in tamper-evident luxury caskets.
   - Returns: 15-day return policy for fine jewelry (terms apply).
   - Lifetime Exchange: Transparent buyback and exchange at prevailing gold/diamond rates.
6. Tone: Warm, respectful, and helpful. Use subtle emojis like ✨ or 💎 sparingly (max 1-2 per message).
`;

/**
 * Generates a response using Gemini API
 * @param {Object} params
 * @param {string} params.message - Latest customer prompt
 * @param {Array} params.history - Recent chat turns [{ role: 'user'|'model', text: string }]
 * @param {Array} params.relevantProducts - Matching database products
 * @param {Object} params.catalogSummary - Store summary
 */
async function generateGeminiReply({ message, history = [], relevantProducts = [], catalogSummary = {} }) {
  const client = getGenAIClient();

  if (!client || !GEMINI_API_KEY) {
    return {
      success: false,
      reason: 'MISSING_OR_UNCONFIGURED_KEY',
      fallbackRequired: true
    };
  }

  try {
    // Build contextual prompt including real products
    let productContextText = 'No specific products filtered yet.';
    if (relevantProducts && relevantProducts.length > 0) {
      productContextText = 'MATCHING PRODUCTS FROM RISHI LAL JEWELLERS DATABASE:\n' +
        relevantProducts.map((p, i) =>
          `${i + 1}. "${p.name}" | Price: ₹${p.price.toLocaleString('en-IN')} | Category: ${p.category} | Metal: ${p.metal} (${p.purity}) | In Stock: ${p.stock > 0 ? 'Yes' : 'No'}`
        ).join('\n');
    }

    // Format chat history into contents array for Gemini
    const contents = [];

    // Include recent history (up to last 6 turns)
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const turn of recentHistory) {
        const role = turn.role === 'user' ? 'user' : 'model';
        const text = turn.text || turn.content || '';
        if (text) {
          contents.push({
            role,
            parts: [{ text }]
          });
        }
      }
    }

    // Append current user turn with embedded catalog context
    const currentTurnContent = `
[STORE INVENTORY CONTEXT]
${productContextText}

[CUSTOMER QUERY]
${message}
`.trim();

    contents.push({
      role: 'user',
      parts: [{ text: currentTurnContent }]
    });

    const modelName = GEMINI_MODEL || 'gemini-2.5-flash';

    // Call official Gemini SDK
    const response = await client.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.65,
        maxOutputTokens: 600
      }
    });

    const replyText = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('Empty response received from Gemini model');
    }

    return {
      success: true,
      reply: replyText.trim(),
      modelUsed: modelName
    };
  } catch (err) {
    console.warn('[GeminiService] API execution notice:', err.message || err);
    return {
      success: false,
      reason: err.message || 'API_CALL_FAILED',
      fallbackRequired: true
    };
  }
}

module.exports = {
  generateGeminiReply,
  getGenAIClient
};

