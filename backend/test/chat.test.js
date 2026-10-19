const test = require('node:test');
const assert = require('node:assert');
const { extractSearchCriteria } = require('../src/services/productSearchService');

test('extractSearchCriteria parses budget constraints correctly', () => {
  const criteria1 = extractSearchCriteria('Suggest bridal jewelry under ₹50,000');
  assert.strictEqual(criteria1.maxPrice, 50000);
  assert.strictEqual(criteria1.categorySlug, 'bridal');
  assert.strictEqual(criteria1.isBridal, true);

  const criteria2 = extractSearchCriteria('Show me rings under 25k');
  assert.strictEqual(criteria2.maxPrice, 25000);
  assert.strictEqual(criteria2.categorySlug, 'rings');

  const criteria3 = extractSearchCriteria('Gold necklaces below 1 lakh');
  assert.strictEqual(criteria3.maxPrice, 100000);
  assert.strictEqual(criteria3.categorySlug, 'necklaces');
});

test('extractSearchCriteria detects jewelry categories and metals', () => {
  const criteria1 = extractSearchCriteria('Show me daily wear 22k gold chains');
  assert.strictEqual(criteria1.metal, '22K Yellow Gold');
  assert.strictEqual(criteria1.occasion, 'Daily Wear');

  const criteria2 = extractSearchCriteria('Looking for natural diamond solitaires');
  assert.strictEqual(criteria2.categorySlug, 'diamond');

  const criteria3 = extractSearchCriteria('Do you have silver idols for puja?');
  assert.strictEqual(criteria3.categorySlug, 'silver-idols');

  const criteria4 = extractSearchCriteria('24kt gold coins for investment');
  assert.strictEqual(criteria4.categorySlug, 'gold-coins');
});

test('extractSearchCriteria handles multi-turn context', () => {
  const history = [
    { role: 'user', text: 'I am shopping for natural diamond solitaires' },
    { role: 'model', text: 'We have lovely natural diamond solitaires.' }
  ];
  const criteria = extractSearchCriteria('Show me something cheaper', history);
  assert.strictEqual(criteria.categorySlug, 'diamond');
});

test('handleChatMessage controller rejects empty and overlength messages with 400', async () => {
  const { handleChatMessage } = require('../src/controllers/chatController');

  // 1. Empty message test
  let emptyStatus = null;
  let emptyBody = null;
  const mockReq1 = { body: { message: '' } };
  const mockRes1 = {
    status: (code) => {
      emptyStatus = code;
      return {
        json: (data) => {
          emptyBody = data;
        }
      };
    }
  };
  await handleChatMessage(mockReq1, mockRes1);
  assert.strictEqual(emptyStatus, 400);
  assert.strictEqual(emptyBody.success, false);

  // 2. Overlength message test
  let longStatus = null;
  let longBody = null;
  const mockReq2 = { body: { message: 'X'.repeat(501) } };
  const mockRes2 = {
    status: (code) => {
      longStatus = code;
      return {
        json: (data) => {
          longBody = data;
        }
      };
    }
  };
  await handleChatMessage(mockReq2, mockRes2);
  assert.strictEqual(longStatus, 400);
  assert.strictEqual(longBody.success, false);
});

test('handleChatMessage introduces Halku identity on greeting query', async () => {
  const { handleChatMessage } = require('../src/controllers/chatController');

  let statusCode = null;
  let responseData = null;
  const mockReq = { body: { message: 'Hello!' } };
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

  await handleChatMessage(mockReq, mockRes);
  assert.strictEqual(statusCode, 200);
  assert.strictEqual(responseData.success, true);
  assert.ok(responseData.reply.includes('Halku'));
});
