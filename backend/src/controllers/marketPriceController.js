const {
  getMarketPrices,
  getGoldPrices,
  getSilverPrices
} = require('../services/marketPriceService');

/**
 * GET /api/metal-prices (or /api/market-prices)
 * Returns current verified gold, silver, and diamond market rates.
 */
exports.getPreciousMetalPrices = async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const prices = await getMarketPrices(forceRefresh, req.query);

    return res.status(200).json(prices);
  } catch (error) {
    console.error('[MarketPriceController] Error retrieving market prices:', error);
    return res.status(500).json({
      success: false,
      dataStatus: 'SERVER_ERROR',
      message: 'Live rates temporarily unavailable',
      retrievedAt: new Date().toISOString(),
      gold: { available: false, message: 'Live rates temporarily unavailable' },
      silver: { available: false, message: 'Live rates temporarily unavailable' },
      diamonds: { available: false }
    });
  }
};

/**
 * GET /api/metal-prices/gold
 * Returns structured gold bullion rates (24K, 22K, 18K per gram and 10g).
 */
exports.getGoldPrices = async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const goldData = await getGoldPrices(forceRefresh);

    return res.status(goldData.success ? 200 : 503).json(goldData);
  } catch (error) {
    console.error('[MarketPriceController] Error retrieving gold prices:', error);
    return res.status(500).json({
      success: false,
      metal: 'Gold',
      currency: 'INR',
      dataStatus: 'SERVER_ERROR',
      message: 'Live rates temporarily unavailable'
    });
  }
};

/**
 * GET /api/metal-prices/silver
 * Returns structured silver bullion rates (per gram and per kg).
 */
exports.getSilverPrices = async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const silverData = await getSilverPrices(forceRefresh);

    return res.status(silverData.success ? 200 : 503).json(silverData);
  } catch (error) {
    console.error('[MarketPriceController] Error retrieving silver prices:', error);
    return res.status(500).json({
      success: false,
      metal: 'Silver',
      currency: 'INR',
      dataStatus: 'SERVER_ERROR',
      message: 'Live rates temporarily unavailable'
    });
  }
};

