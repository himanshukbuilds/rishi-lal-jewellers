const test = require('node:test');
const assert = require('node:assert');
const { getMarketPrices, getDiamondStatus } = require('../src/services/marketPriceService');

test('getDiamondStatus returns unavailable with authentic disclaimer when unconfigured', () => {
  const diamondStatus = getDiamondStatus();
  assert.strictEqual(diamondStatus.available, false);
  assert.strictEqual(diamondStatus.status, 'UNAVAILABLE');
  assert.ok(diamondStatus.message.includes('Diamond pricing data is currently unavailable'));
  assert.ok(diamondStatus.disclaimer.includes('carat weight, shape'));
});

test('getMarketPrices returns structured response without fabricating fake numbers', async () => {
  const res = await getMarketPrices();
  assert.strictEqual(typeof res, 'object');
  assert.ok(res.retrievedAt);
  assert.ok(res.gold);
  assert.ok(res.silver);
  assert.ok(res.diamonds);
  // When unconfigured, it must not invent random prices
  if (res.dataStatus === 'UNCONFIGURED') {
    assert.strictEqual(res.gold.available, false);
    assert.strictEqual(res.silver.available, false);
    assert.strictEqual(res.diamonds.available, false);
  }
});

test('marketPriceController returns 200 with structured JSON payload', async () => {
  const { getPreciousMetalPrices } = require('../src/controllers/marketPriceController');

  let statusCode = null;
  let responseData = null;

  const mockReq = { query: {} };
  const mockRes = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
        }
      };
    }
  };

  await getPreciousMetalPrices(mockReq, mockRes);
  assert.strictEqual(statusCode, 200);
  assert.strictEqual(typeof responseData, 'object');
  assert.ok(responseData.retrievedAt);
});

test('getDiamondStatus accurately reflects 4Cs specifications and natural vs lab distinction', () => {
  const customSpecs = {
    carat: 1.5,
    shape: 'Princess',
    color: 'G-H (Near Colorless)',
    clarity: 'VS1-VS2',
    origin: 'Natural Earth-Mined'
  };

  const status = getDiamondStatus(customSpecs);
  assert.strictEqual(status.selectedSpecs.carat, 1.5);
  assert.strictEqual(status.selectedSpecs.shape, 'Princess');
  assert.strictEqual(status.selectedSpecs.color, 'G-H (Near Colorless)');
  assert.strictEqual(status.selectedSpecs.clarity, 'VS1-VS2');
  assert.strictEqual(status.selectedSpecs.origin, 'Natural Earth-Mined');
  assert.ok(status.distinction.natural.includes('Earth-Mined'));
  assert.ok(status.distinction.labGrown.includes('CVD/HPHT'));
});

test('getMarketPrices accepts diamond 4Cs query parameters', async () => {
  const res = await getMarketPrices(true, { carat: 2.0, shape: 'Oval' });
  assert.strictEqual(res.diamonds.selectedSpecs.carat, 2.0);
  assert.strictEqual(res.diamonds.selectedSpecs.shape, 'Oval');
});

test('getGoldPrices and getSilverPrices return dedicated metal payloads', async () => {
  const { getGoldPrices, getSilverPrices } = require('../src/services/marketPriceService');

  const goldData = await getGoldPrices();
  assert.strictEqual(goldData.metal, 'Gold');
  assert.strictEqual(goldData.currency, 'INR');

  if (goldData.success) {
    assert.ok(goldData.rates['24k']);
    assert.ok(goldData.rates['22k']);
    assert.ok(goldData.rates['18k']);
    assert.ok(goldData.rates['24k'].perGram > 0);
    assert.ok(goldData.rates['24k'].per10Gram === goldData.rates['24k'].perGram * 10);
  }

  const silverData = await getSilverPrices();
  assert.strictEqual(silverData.metal, 'Silver');
  assert.strictEqual(silverData.currency, 'INR');

  if (silverData.success) {
    assert.ok(silverData.perGram > 0);
    assert.ok(silverData.perKg > silverData.perGram);
    assert.strictEqual(Math.round(silverData.perKg), Math.round(silverData.perGram * 1000));
  }
});

