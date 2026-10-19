const { getMarketPrices } = require('../services/marketPriceService');

/**
 * GET /api/market-prices
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
      message: 'An unexpected internal error occurred while fetching precious metal rates.',
      retrievedAt: new Date().toISOString(),
      gold: { available: false },
      silver: { available: false },
      diamonds: { available: false }
    });
  }
};

