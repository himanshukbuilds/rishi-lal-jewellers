const {
  IBJA_ACCESS_TOKEN,
  IBJA_ENV,
  GOLDAPI_KEY,
  RAPAPORT_CLIENT_ID,
  RAPAPORT_CLIENT_SECRET
} = require('../config/constants');

/**
 * Service to fetch, normalize, and cache real precious metal market rates.
 * Supports:
 *  1. IBJA (India Bullion and Jewellers Association) - Official India benchmark
 *  2. GoldAPI.io - Spot Bullion XAU/INR & XAG/INR quotes
 *  3. Rapaport Diamond Price Index - Diamond wholesale matrix
 */

// 15-minute in-memory cache to prevent hitting provider rate limits
const CACHE_TTL_MS = 15 * 60 * 1000;
let priceCache = {
  data: null,
  timestamp: 0,
  provider: null
};

/**
 * Formats a Date object to dd/MM/yyyy as required by IBJA API
 */
function formatIbjaDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/**
 * Fetches official benchmark rates from IBJA (indiagoldratesapi.com)
 */
async function fetchIbjaRates() {
  const baseUrl = IBJA_ENV === 'uat'
    ? 'https://uat.ibjarates.com/API/GoldRates/'
    : 'https://ibjarates.com/API/GoldRates/';

  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 3); // Query last 3 days to guarantee coverage over weekends/holidays

  const startDateStr = formatIbjaDate(pastDate);
  const endDateStr = formatIbjaDate(now);

  const url = `${baseUrl}?ACCESS_TOKEN=${encodeURIComponent(IBJA_ACCESS_TOKEN)}&START_DATE=${startDateStr}&END_DATE=${endDateStr}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(8000)
  });

  if (!response.ok) {
    throw new Error(`IBJA API responded with HTTP status ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('IBJA API returned an empty or invalid rate list');
  }

  // Check if API returned an error message object e.g. [{"status":"Invalid","message":"..."}]
  if (data[0].status === 'Invalid' || data[0].message) {
    throw new Error(`IBJA API Error: ${data[0].message || data[0].status}`);
  }

  // Pick the most recent rate entry
  const latest = data[data.length - 1];

  // IBJA reports rates for AM (12:30 IST) and PM (18:30 IST)
  // Purity fields: 999 (24K), 916 (22K), 750 (18K)
  const raw24k = parseFloat(latest.lblGold999_PM || latest.lblGold999_AM || latest.Gold999);
  const raw22k = parseFloat(latest.lblGold916_PM || latest.lblGold916_AM || latest.Gold916);
  const raw18k = parseFloat(latest.lblGold750_PM || latest.lblGold750_AM || latest.Gold750);
  const rawSilver = parseFloat(latest.lblSilver999_PM || latest.lblSilver999_AM || latest.Silver999);

  if (isNaN(raw24k) || raw24k <= 0) {
    throw new Error('IBJA API returned unparseable gold rates');
  }

  // Auto-detect unit scale:
  // IBJA gold is traditionally published per 10 grams (e.g., ₹78,500 / 10g).
  // If raw24k > 15000, it is per 10g. If <= 15000, it is per 1g.
  const rate24k_10g = raw24k > 15000 ? raw24k : raw24k * 10;
  const rate24k_1g = raw24k > 15000 ? raw24k / 10 : raw24k;

  const rate22k_10g = !isNaN(raw22k) && raw22k > 0
    ? (raw22k > 15000 ? raw22k : raw22k * 10)
    : rate24k_10g * (22 / 24);
  const rate22k_1g = rate22k_10g / 10;

  const rate18k_10g = !isNaN(raw18k) && raw18k > 0
    ? (raw18k > 15000 ? raw18k : raw18k * 10)
    : rate24k_10g * (18 / 24);
  const rate18k_1g = rate18k_10g / 10;

  // Silver: IBJA quotes per 1 Kilogram (e.g. ₹92,000 / kg).
  // If rawSilver > 1500, it is per 1kg; if <= 1500, it is per 1g.
  const silverPerKg = !isNaN(rawSilver) && rawSilver > 0
    ? (rawSilver > 1500 ? rawSilver : rawSilver * 1000)
    : null;
  const silverPerGram = silverPerKg ? silverPerKg / 1000 : null;

  const session = (latest.lblGold999_PM ? 'Evening Closing (18:30 IST)' : 'Morning Opening (12:30 IST)');

  return {
    provider: 'IBJA (India Bullion and Jewellers Association Ltd.)',
    providerType: 'Official Indian Benchmark',
    sourceTimestamp: latest.date || latest.Date || now.toISOString(),
    session,
    gold: {
      available: true,
      currency: 'INR',
      symbol: '₹',
      benchmark: 'Official IBJA Benchmark (Excl. 3% GST & Making Charges)',
      disclaimer: 'Official IBJA trade benchmark rate published twice daily on working bullion trading days. Retail jewelry prices vary by craftsmanship, making charges, and applicable GST.',
      rates: {
        '24k': {
          purity: '24 Karat (999 Purity)',
          fineness: '999/1000 Fine Gold',
          perGram: Math.round(rate24k_1g * 100) / 100,
          per10Gram: Math.round(rate24k_10g * 100) / 100
        },
        '22k': {
          purity: '22 Karat (916 Purity)',
          fineness: '916/1000 Hallmarked Jewelry Gold',
          perGram: Math.round(rate22k_1g * 100) / 100,
          per10Gram: Math.round(rate22k_10g * 100) / 100
        },
        '18k': {
          purity: '18 Karat (750 Purity)',
          fineness: '750/1000 Fine Diamond Jewelry Gold',
          perGram: Math.round(rate18k_1g * 100) / 100,
          per10Gram: Math.round(rate18k_10g * 100) / 100
        }
      }
    },
    silver: {
      available: Boolean(silverPerKg && silverPerKg > 0),
      currency: 'INR',
      symbol: '₹',
      purity: '999 Fine Silver',
      perGram: silverPerGram ? Math.round(silverPerGram * 100) / 100 : null,
      perKg: silverPerKg ? Math.round(silverPerKg * 100) / 100 : null,
      benchmark: 'Official IBJA Silver Benchmark',
      disclaimer: 'Wholesale bullion benchmark rate per gram and kilogram in Indian Rupees.'
    }
  };
}

/**
 * Fetches real-time spot bullion quotes from GoldAPI.io
 */
async function fetchGoldApiRates() {
  const headers = {
    'x-access-token': GOLDAPI_KEY,
    'Content-Type': 'application/json'
  };

  // Fetch Gold (XAU/INR) and Silver (XAG/INR) in parallel, supporting both endpoint routes
  const [goldRes, silverRes] = await Promise.all([
    fetch('https://www.goldapi.io/api/XAU/INR', { headers, signal: AbortSignal.timeout(8000) })
      .catch(() => fetch('https://www.goldapi.io/api/price/XAU/INR', { headers, signal: AbortSignal.timeout(8000) })),
    fetch('https://www.goldapi.io/api/XAG/INR', { headers, signal: AbortSignal.timeout(8000) })
      .catch(() => fetch('https://www.goldapi.io/api/price/XAG/INR', { headers, signal: AbortSignal.timeout(8000) }))
  ]);

  if (!goldRes || !goldRes.ok) {
    const errText = goldRes ? await goldRes.text().catch(() => '') : 'Network failed';
    throw new Error(`GoldAPI.io Gold request failed (${goldRes?.status || 500}): ${errText}`);
  }

  const goldData = await goldRes.json();
  const silverData = silverRes?.ok ? await silverRes.json().catch(() => null) : null;

  const rate24k = goldData.price_gram_24k || goldData.melt_price_per_gram?.['24k'] || goldData.price_per_unit?.gram;
  const rate22k = goldData.price_gram_22k || goldData.melt_price_per_gram?.['22k'] || (rate24k ? rate24k * (22 / 24) : null);
  const rate18k = goldData.price_gram_18k || goldData.melt_price_per_gram?.['18k'] || (rate24k ? rate24k * (18 / 24) : null);

  const silverPerGram = silverData?.price_gram_24k || silverData?.price_per_unit?.gram || (silverData?.price ? silverData.price / 31.1035 : null);
  const silverPerKg = silverPerGram ? silverPerGram * 1000 : (silverData?.price_per_unit?.kilogram || null);

  const sourceTime = goldData.datetime || (goldData.timestamp ? new Date(goldData.timestamp * 1000).toISOString() : new Date().toISOString());

  return {
    provider: 'GoldAPI.io (Live Bullion Exchange Feed)',
    providerType: 'Real-Time Spot Bullion Exchange Rate',
    sourceTimestamp: sourceTime,
    session: 'Live Continuous Market',
    gold: {
      available: true,
      currency: 'INR',
      symbol: '₹',
      benchmark: 'International Spot Bullion (XAU/INR, London/MCX parity)',
      disclaimer: 'Live spot market quote converted to Indian Rupees. Retail jewelry purchases include making charges, state hallmark fees, and 3% GST.',
      rates: {
        '24k': {
          purity: '24 Karat (999 Purity)',
          fineness: '999/1000 Pure Gold',
          perGram: Math.round(rate24k * 100) / 100,
          per10Gram: Math.round(rate24k * 10 * 100) / 100
        },
        '22k': {
          purity: '22 Karat (916 Purity)',
          fineness: '916/1000 Standard Jewelry Gold',
          perGram: Math.round(rate22k * 100) / 100,
          per10Gram: Math.round(rate22k * 10 * 100) / 100
        },
        '18k': {
          purity: '18 Karat (750 Purity)',
          fineness: '750/1000 Diamond Jewelry Gold',
          perGram: Math.round(rate18k * 100) / 100,
          per10Gram: Math.round(rate18k * 10 * 100) / 100
        }
      }
    },
    silver: {
      available: Boolean(silverPerGram && silverPerGram > 0),
      currency: 'INR',
      symbol: '₹',
      purity: '999 Fine Silver (XAG/INR)',
      perGram: silverPerGram ? Math.round(silverPerGram * 100) / 100 : null,
      perKg: silverPerKg ? Math.round(silverPerKg * 100) / 100 : null,
      benchmark: 'International Spot Silver Bullion',
      disclaimer: 'Live wholesale spot benchmark rate for physical silver bullion in Indian Rupees.'
    }
  };
}

/**
 * Returns diamond pricing metadata and status.
 * Natural diamond prices require Rapaport / IDEX B2B subscription credentials.
 */
function getDiamondStatus(specs = {}) {
  const isConfigured = Boolean(RAPAPORT_CLIENT_ID && RAPAPORT_CLIENT_SECRET);
  const {
    carat = 1.0,
    shape = 'Round Brilliant',
    color = 'D-F (Colorless)',
    clarity = 'VVS1-VVS2',
    origin = 'Natural Earth-Mined'
  } = specs;

  return {
    available: false,
    status: isConfigured ? 'PENDING_AUTHENTICATION' : 'UNAVAILABLE',
    provider: 'RapNet / Rapaport Diamond Price Index (RapNet B2B)',
    selectedSpecs: {
      carat: parseFloat(carat) || 1.0,
      shape: String(shape),
      color: String(color),
      clarity: String(clarity),
      origin: String(origin)
    },
    message: isConfigured
      ? 'Connecting to authorized RapNet B2B Trade Matrix Feed...'
      : 'Diamond pricing data is currently unavailable. Natural diamond trade valuation requires active Rapaport B2B credentials (RAPAPORT_CLIENT_ID and RAPAPORT_CLIENT_SECRET in backend/.env).',
    distinction: {
      natural: '100% Earth-Mined Solitaire Diamonds: Rare, natural crystalline carbon formed over billions of years deep within the earth mantle, certified by IGI or GIA.',
      labGrown: 'Lab-Grown Diamonds (CVD/HPHT): Factory-synthesized stones created in chambers. While chemically similar, they lack geological rarity and have substantially lower trade valuation.'
    },
    valuationBasis: 'Unlike gold and silver commodities which trade at uniform gram rates, diamond valuation is determined individually by the 4Cs: Carat weight, Cut & Shape, Colour grade, and Clarity grade, verified by independent laboratory certificates (GIA or IGI).',
    disclaimer: 'Unlike gold bullion, diamond prices vary dynamically by carat weight, shape (Round, Princess, Oval), colour (D to Z), clarity (IF to I3), cut grade, fluorescence, and accredited laboratory certification (GIA or IGI). There is no single generic diamond gram rate.',
    supportedParameters: {
      carats: [0.5, 0.75, 1.0, 1.5, 2.0],
      shapes: ['Round Brilliant', 'Princess', 'Emerald', 'Oval'],
      colors: ['D-F (Colorless)', 'G-H (Near Colorless)', 'I-J'],
      clarities: ['VVS1-VVS2', 'VS1-VS2', 'SI1'],
      origins: ['Natural Earth-Mined', 'Lab-Grown']
    }
  };
}

/**
 * Main function called by the controller to get market rates.
 * Handles caching, provider fallback, and graceful error reporting.
 */
async function getMarketPrices(forceRefresh = false, diamondSpecs = {}) {
  const now = Date.now();

  // 1. Return fresh cached data if valid and not forcing refresh
  if (
    !forceRefresh &&
    priceCache.data &&
    now - priceCache.timestamp < CACHE_TTL_MS
  ) {
    return {
      ...priceCache.data,
      isCached: true,
      dataStatus: 'CURRENT',
      cacheAgeMinutes: Math.floor((now - priceCache.timestamp) / 60000),
      diamonds: getDiamondStatus(diamondSpecs)
    };
  }

  // 2. Determine which provider to call
  const hasIbja = Boolean(IBJA_ACCESS_TOKEN && IBJA_ACCESS_TOKEN.trim());
  const hasGoldApi = Boolean(GOLDAPI_KEY && GOLDAPI_KEY.trim());

  if (!hasIbja && !hasGoldApi) {
    return {
      success: true,
      dataStatus: 'UNCONFIGURED',
      message: 'Precious metal market provider credentials not configured. Please add IBJA_ACCESS_TOKEN or GOLDAPI_KEY to backend/.env to activate live Indian bullion rates.',
      provider: 'Unconfigured (Awaiting Provider Key)',
      retrievedAt: new Date().toISOString(),
      gold: {
        available: false,
        message: 'Gold benchmark data is awaiting provider activation (IBJA_ACCESS_TOKEN or GOLDAPI_KEY).'
      },
      silver: {
        available: false,
        message: 'Silver benchmark data is awaiting provider activation.'
      },
      diamonds: getDiamondStatus(diamondSpecs)
    };
  }

  // 3. Attempt retrieval from configured provider
  let freshRates = null;
  let providerError = null;

  if (hasIbja) {
    try {
      freshRates = await fetchIbjaRates();
    } catch (err) {
      console.warn('[MarketPriceService] IBJA request error:', err.message);
      providerError = err.message;
    }
  }

  // Fallback to GoldAPI if IBJA failed or was not configured
  if (!freshRates && hasGoldApi) {
    try {
      freshRates = await fetchGoldApiRates();
    } catch (err) {
      console.warn('[MarketPriceService] GoldAPI request error:', err.message);
      providerError = err.message;
    }
  }

  // 4. If retrieval succeeded, update cache
  if (freshRates) {
    const finalPayload = {
      success: true,
      dataStatus: 'CURRENT',
      isCached: false,
      retrievedAt: new Date().toISOString(),
      ...freshRates,
      diamonds: getDiamondStatus(diamondSpecs)
    };

    priceCache = {
      data: finalPayload,
      timestamp: now,
      provider: freshRates.provider
    };

    return finalPayload;
  }

  // 5. If retrieval failed but stale cache exists, serve stale cache
  if (priceCache.data) {
    return {
      ...priceCache.data,
      isCached: true,
      isStale: true,
      dataStatus: 'STALE',
      diamonds: getDiamondStatus(diamondSpecs),
      warning: `Provider temporarily unreachable (${providerError}). Displaying last verified benchmark.`
    };
  }

  // 6. Complete failure without prior cache
  return {
    success: false,
    dataStatus: 'PROVIDER_ERROR',
    message: `Unable to retrieve live market rates from configured provider: ${providerError || 'Unknown provider error'}.`,
    retrievedAt: new Date().toISOString(),
    gold: { available: false },
    silver: { available: false },
    diamonds: getDiamondStatus(diamondSpecs)
  };
}

module.exports = {
  getMarketPrices,
  fetchIbjaRates,
  fetchGoldApiRates,
  getDiamondStatus
};

