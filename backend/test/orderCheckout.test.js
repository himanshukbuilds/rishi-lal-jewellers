const test = require('node:test');
const assert = require('node:assert');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');
const { createRazorpayOrder, createOrder } = require('../src/controllers/orderController');

test('Direct Checkout Suite', async (t) => {
  const sampleProduct = {
    _id: '6ad7a67243ba858a5a69472e',
    name: 'Imperial Royal Elephant 22K Gold Kadas (Pair)',
    sku: 'RLJ-BGL-001',
    category: 'Bangles',
    price: 45000,
    stock: 10,
    isPublished: true,
    priceStatus: 'approved',
    pricingType: 'business-set',
    isOrderable: true,
    availability: 'in-stock',
    images: ['/images/bangles/gold-traditional-bangles.png'],
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 22.5,
  };

  const originalProductFindOne = Product.findOne;
  const originalProductUpdateOne = Product.updateOne;
  const originalOrderCreate = Order.create;
  const originalOrderFindOne = Order.findOne;

  t.after(() => {
    Product.findOne = originalProductFindOne;
    Product.updateOne = originalProductUpdateOne;
    Order.create = originalOrderCreate;
    Order.findOne = originalOrderFindOne;
  });

  Product.findOne = async () => sampleProduct;
  Product.updateOne = async () => ({ modifiedCount: 1 });

  await t.test('createRazorpayOrder calculates verified price, 3% GST, and returns razorpay order ID', async () => {
    let statusCode = null;
    let jsonResult = null;

    const mockReq = {
      body: {
        items: [
          {
            productId: sampleProduct._id,
            quantity: 2,
            selectedSize: '2.6',
          },
        ],
      },
    };

    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResult = data;
        return this;
      },
    };

    await createRazorpayOrder(mockReq, mockRes, (err) => {
      throw err;
    });

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonResult.success, true);
    // 45000 * 2 = 90000; 3% GST = 2700; total = 92700; paise = 9270000
    assert.strictEqual(jsonResult.amount, 92700);
    assert.strictEqual(jsonResult.amountInPaise, 9270000);
    assert.strictEqual(jsonResult.currency, 'INR');
    assert.ok(jsonResult.razorpayOrderId);
  });

  await t.test('createOrder records direct order with verified prices and payment details', async () => {
    let statusCode = null;
    let jsonResult = null;
    let createdPayload = null;

    Order.findOne = async () => null;
    Order.create = async (doc) => {
      createdPayload = doc;
      return {
        ...doc,
        _id: 'order_mock_123',
      };
    };

    const mockReq = {
      user: null,
      body: {
        customerDetails: {
          name: 'Ananya Singhania',
          email: 'ananya@example.com',
          phone: '9820123456',
        },
        shippingAddress: {
          fullName: 'Ananya Singhania',
          phone: '9820123456',
          street: '14 Altamount Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400026',
        },
        items: [
          {
            productId: sampleProduct._id,
            quantity: 1,
            selectedSize: '2.6',
          },
        ],
        paymentMethod: 'card',
        razorpayOrderId: 'order_test_998877',
        razorpayPaymentId: 'pay_test_112233',
        razorpaySignature: 'sig_test_445566',
      },
    };

    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResult = data;
        return this;
      },
    };

    await createOrder(mockReq, mockRes, (err) => {
      throw err;
    });

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(jsonResult.success, true);
    assert.ok(jsonResult.order.orderNumber.startsWith('RLJ-'));
    assert.strictEqual(jsonResult.order.subtotal, 45000);
    assert.strictEqual(jsonResult.order.tax, 1350); // 3% of 45000
    assert.strictEqual(jsonResult.order.totalAmount, 46350);
    assert.strictEqual(jsonResult.order.paymentStatus, 'completed');
    assert.strictEqual(jsonResult.order.razorpayPaymentId, 'pay_test_112233');
    assert.strictEqual(createdPayload.razorpayOrderId, 'order_test_998877');
  });

  await t.test('duplicate payment callback returns existing order safely', async () => {
    let statusCode = null;
    let jsonResult = null;

    Order.findOne = async () => ({
      orderNumber: 'RLJ-20261102-12345',
      razorpayPaymentId: 'pay_test_112233',
      totalAmount: 46350,
    });

    const mockReq = {
      user: null,
      body: {
        customerDetails: {
          name: 'Ananya Singhania',
          email: 'ananya@example.com',
          phone: '9820123456',
        },
        shippingAddress: {
          street: '14 Altamount Road',
          city: 'Mumbai',
          postalCode: '400026',
        },
        items: [
          {
            productId: sampleProduct._id,
            quantity: 1,
          },
        ],
        paymentMethod: 'card',
        razorpayOrderId: 'order_test_998877',
        razorpayPaymentId: 'pay_test_112233',
      },
    };

    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResult = data;
        return this;
      },
    };

    await createOrder(mockReq, mockRes, (err) => {
      throw err;
    });

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonResult.message, 'Order already recorded.');
    assert.strictEqual(jsonResult.order.razorpayPaymentId, 'pay_test_112233');
  });
});
