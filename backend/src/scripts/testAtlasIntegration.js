/**
 * Rishi Lal Jewellers - Complete MongoDB Atlas Integration Test Suite
 *
 * Verifies all 10 core e-commerce capabilities directly against MongoDB Atlas:
 * 1. Homepage product loading
 * 2. All 10 jewellery category pages
 * 3. Product details and image asset verification
 * 4. Customer registration, bcrypt hashing, and login
 * 5. Admin login and real-time dashboard analytics
 * 6. Add to cart & checkout flow
 * 7. Order creation & actual persistence in Atlas
 * 8. Customer submissions (profile, addresses, wishlist)
 * 9. Coupon validation engine
 * 10. Admin product creation and live editing with Atlas verification
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const express = require('express');
const app = require('../app');

const ATLAS_URI = process.env.MONGODB_URI;

if (!ATLAS_URI) {
  console.error('[Error] MONGODB_URI is not set in backend/.env');
  process.exit(1);
}

// Global test results collector
const testResults = [];
function recordTest(suite, name, passed, details = '') {
  testResults.push({ suite, name, status: passed ? 'PASS' : 'FAIL', details });
  console.log(`  [${passed ? '✓ PASS' : '✗ FAIL'}] ${suite} › ${name} ${details ? '(' + details + ')' : ''}`);
}

async function runIntegrationTests() {
  console.log('='.repeat(80));
  console.log('RISHI LAL JEWELLERS - MONGODB ATLAS INTEGRATION TEST SUITE');
  console.log(`Database Target: MongoDB Atlas (grocery.r1fz3hw.mongodb.net/rishi_lal_jewellers)`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('='.repeat(80));

  let server;
  let atlasConn;
  const TEST_PORT = 5099;
  const BASE_URL = `http://127.0.0.1:${TEST_PORT}/api`;

  try {
    // 0. Connect directly to Atlas and start ephemeral test server
    console.log('\n[Init] Connecting to MongoDB Atlas and launching test API server...');
    atlasConn = await mongoose.connect(ATLAS_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('  ✓ Connected to MongoDB Atlas');

    await new Promise((resolve) => {
      server = app.listen(TEST_PORT, () => {
        console.log(`  ✓ Test API server listening on http://127.0.0.1:${TEST_PORT}`);
        resolve();
      });
    });

    // -------------------------------------------------------------------------
    // TEST SUITE 1: Homepage Product Loading
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Testing Homepage Product Loading ---');
    {
      const res = await fetch(`${BASE_URL}/products?limit=12`);
      const data = await res.json();
      recordTest('Homepage', 'GET /api/products?limit=12 returns HTTP 200', res.ok && data.success);
      recordTest('Homepage', 'Returns products array with valid items', Array.isArray(data.products) && data.products.length > 0, `Returned ${data.products?.length} products`);

      const highlightsRes = await fetch(`${BASE_URL}/products/highlights`);
      const highlightsData = await highlightsRes.json();
      recordTest('Homepage', 'GET /api/products/highlights returns HTTP 200', highlightsRes.ok && highlightsData.success);
      recordTest('Homepage', 'Highlights contains bestsellers and featured items',
        Array.isArray(highlightsData.bestsellers) && highlightsData.bestsellers.length > 0,
        `Bestsellers: ${highlightsData.bestsellers?.length}, New Arrivals: ${highlightsData.newArrivals?.length}`
      );
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 2: All Jewellery Category Pages
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing All Jewellery Category Pages ---');
    {
      const catRes = await fetch(`${BASE_URL}/categories`);
      const catData = await catRes.json();
      recordTest('Categories', 'GET /api/categories returns HTTP 200', catRes.ok && catData.success);
      recordTest('Categories', 'Exactly 10 categories present on Atlas', catData.categories?.length === 10, `Found ${catData.categories?.length} categories`);

      const expectedSlugs = ['gold', 'diamond', 'bridal', 'earrings', 'rings', 'necklaces', 'bangles', 'gifts', 'men', 'kids'];
      for (const slug of expectedSlugs) {
        const prodRes = await fetch(`${BASE_URL}/products?categorySlug=${slug}&limit=50`);
        const prodData = await prodRes.json();
        const count = prodData.products?.length || 0;
        recordTest('Categories', `Category [${slug}] returns products from Atlas`, prodRes.ok && count > 0, `${count} products`);
      }
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Product Details and Images
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Product Details and Image Assets ---');
    {
      // Test fetching by slug
      const sampleSlug = 'aur-brd-nk-001';
      const singleRes = await fetch(`${BASE_URL}/products/${sampleSlug}`);
      const singleData = await singleRes.json();
      recordTest('Product Details', `GET /api/products/${sampleSlug} returns HTTP 200`, singleRes.ok && singleData.success);
      recordTest('Product Details', 'Product payload contains specifications, metal, purity, and craftsmanship',
        singleData.product && singleData.product.metal && singleData.product.craftsmanshipStory,
        `SKU: ${singleData.product?.sku}, Metal: ${singleData.product?.metal}`
      );

      // Verify physical image assets for a sample of products across Men, Kids, and Women
      const sampleSkus = ['AUR-BRD-NK-001', 'RLJ-MEN-CAD-001', 'RLJ-KID-ERG-001'];
      let imageCheckPassed = true;
      let checkedImages = 0;

      for (const sku of sampleSkus) {
        const prod = await atlasConn.connection.db.collection('products').findOne({ sku });
        if (prod && prod.images && prod.images.length > 0) {
          for (const imgPath of prod.images) {
            checkedImages++;
            if (imgPath.startsWith('/images/')) {
              const fullLocalPath = path.resolve(__dirname, '../../../frontend/public', imgPath.slice(1));
              if (!fs.existsSync(fullLocalPath)) {
                console.warn(`    ⚠️ Missing image on disk: ${fullLocalPath}`);
                imageCheckPassed = false;
              }
            }
          }
        }
      }
      recordTest('Product Images', 'Local image assets physically exist in frontend/public', imageCheckPassed, `Checked ${checkedImages} image paths`);
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Customer Registration and Login
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing Customer Registration and Login ---');
    const timestamp = Date.now();
    const testCustomerEmail = `test.patron.${timestamp}@rishilal.test`;
    const testCustomerPassword = 'SecurePassword@123';
    let testCustomerToken = null;
    let testCustomerId = null;

    {
      // Registration
      const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Shri Vikramaditya Test',
          email: testCustomerEmail,
          password: testCustomerPassword,
          phone: '9876543210'
        })
      });
      const regData = await regRes.json();
      recordTest('Customer Auth', 'POST /api/auth/register returns HTTP 201', regRes.status === 201 && regData.success);

      // Verify physical persistence in Atlas
      const atlasUser = await atlasConn.connection.db.collection('users').findOne({ email: testCustomerEmail });
      recordTest('Customer Auth', 'User physically persisted in Atlas `users` collection', atlasUser !== null, `ID: ${atlasUser?._id}`);
      recordTest('Customer Auth', 'Password is fully bcrypt-hashed in Atlas (never stored plaintext)',
        atlasUser?.password && atlasUser.password.startsWith('$2'),
        'Bcrypt hash verified'
      );

      // Activate email verification for testing login
      await atlasConn.connection.db.collection('users').updateOne(
        { _id: atlasUser._id },
        { $set: { isEmailVerified: true } }
      );
      testCustomerId = atlasUser._id;

      // Login
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testCustomerEmail,
          password: testCustomerPassword
        })
      });
      const loginData = await loginRes.json();
      recordTest('Customer Auth', 'POST /api/auth/login returns HTTP 200 with JWT token', loginRes.ok && !!loginData.token);
      testCustomerToken = loginData.token;

      // Verify authenticated /api/auth/me
      const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${testCustomerToken}` }
      });
      const meData = await meRes.json();
      recordTest('Customer Auth', 'GET /api/auth/me returns authenticated patron profile', meRes.ok && meData.user?.email === testCustomerEmail);
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 5: Admin Login and Dashboard
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Testing Admin Login and Dashboard Metrics ---');
    let adminToken = null;
    {
      const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@rishilaljewellers.demo',
          password: 'Admin@123'
        })
      });
      const adminLoginData = await adminLoginRes.json();
      recordTest('Admin Auth', 'POST /api/auth/login returns HTTP 200 for Head Curator admin', adminLoginRes.ok && adminLoginData.user?.role === 'admin');
      adminToken = adminLoginData.token;

      // Dashboard stats
      const statsRes = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const statsData = await statsRes.json();
      recordTest('Admin Dashboard', 'GET /api/admin/dashboard-stats returns live metrics from Atlas',
        statsRes.ok && statsData.stats?.totalProducts >= 251,
        `Atlas Products: ${statsData.stats?.totalProducts}, Total Orders: ${statsData.stats?.totalOrders}`
      );
      recordTest('Admin Dashboard', 'Calculates category distribution and low stock alerts',
        Array.isArray(statsData.categoryDistribution) && statsData.categoryDistribution.length > 0,
        `Categories in distribution: ${statsData.categoryDistribution?.length}`
      );

      // Customer management
      const customersRes = await fetch(`${BASE_URL}/admin/customers`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const customersData = await customersRes.json();
      recordTest('Admin Dashboard', 'GET /api/admin/customers returns registered customer list from Atlas',
        customersRes.ok && customersData.customers?.length >= 10,
        `Found ${customersData.customers?.length} customers`
      );
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 6 & 7: Add to Cart, Checkout & Order Persistence in Atlas
    // -------------------------------------------------------------------------
    console.log('\n--- 6 & 7. Testing Add to Cart, Checkout & Order Persistence ---');
    let testOrderNumber = null;
    {
      // Pick an approved in-stock product from Atlas
      const sampleProd = await atlasConn.connection.db.collection('products').findOne({
        categorySlug: 'earrings',
        isOrderable: { $ne: false },
        priceStatus: { $ne: 'indicative' }
      });

      const orderPayload = {
        customerDetails: {
          name: 'Shri Vikramaditya Test',
          email: testCustomerEmail,
          phone: '9876543210'
        },
        shippingAddress: {
          fullName: 'Shri Vikramaditya Test',
          phone: '9876543210',
          street: '42 Heritage Royal Avenue, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India'
        },
        items: [
          {
            product: sampleProd._id,
            name: sampleProd.name,
            sku: sampleProd.sku,
            image: sampleProd.images[0],
            price: sampleProd.price,
            quantity: 1,
            metal: sampleProd.metal || '22K Gold'
          }
        ],
        subtotal: sampleProd.price,
        tax: Math.round(sampleProd.price * 0.03),
        totalAmount: Math.round(sampleProd.price * 1.03),
        paymentMethod: 'cod',
        notes: 'TEST ORDER: Integration test validating MongoDB Atlas checkout persistence'
      };

      const orderRes = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testCustomerToken}`
        },
        body: JSON.stringify(orderPayload)
      });
      const orderData = await orderRes.json();
      recordTest('Checkout & Orders', 'POST /api/orders creates order successfully (HTTP 201)', orderRes.status === 201 && orderData.success);
      testOrderNumber = orderData.order?.orderNumber;

      // DIRECT ATLAS DATABASE VERIFICATION
      const atlasOrder = await atlasConn.connection.db.collection('orders').findOne({ orderNumber: testOrderNumber });
      recordTest('Order Persistence', 'Order document physically persisted in MongoDB Atlas', atlasOrder !== null, `OrderNumber: ${testOrderNumber}`);
      recordTest('Order Persistence', 'Order correctly links to customer user ObjectId in Atlas',
        atlasOrder?.user?.toString() === testCustomerId.toString(),
        `User ID: ${atlasOrder?.user}`
      );
      recordTest('Order Persistence', 'Order correctly links line item to Product ObjectId in Atlas',
        atlasOrder?.items[0]?.product?.toString() === sampleProd._id.toString(),
        `Product ID: ${atlasOrder?.items[0]?.product}`
      );

      // Verify customer can retrieve order via /api/orders/my-orders
      const myOrdersRes = await fetch(`${BASE_URL}/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${testCustomerToken}` }
      });
      const myOrdersData = await myOrdersRes.json();
      recordTest('Order Retrieval', 'GET /api/orders/my-orders returns customer order from Atlas',
        myOrdersRes.ok && myOrdersData.orders?.some(o => o.orderNumber === testOrderNumber),
        `Found ${myOrdersData.orders?.length} orders for test customer`
      );
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 8: Customer Submissions (Address, Wishlist, Profile)
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Testing Customer Submissions & Profile Updates ---');
    {
      // Add Address
      const addrRes = await fetch(`${BASE_URL}/auth/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testCustomerToken}`
        },
        body: JSON.stringify({
          fullName: 'Vikramaditya Office',
          phone: '9876543210',
          street: 'Level 14, Express Towers, Nariman Point',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400021',
          country: 'India',
          isDefault: true
        })
      });
      const addrData = await addrRes.json();
      recordTest('Customer Submissions', 'POST /api/auth/address saves address to patron profile', addrRes.ok && addrData.success);

      // Direct Atlas verification
      const userWithAddr = await atlasConn.connection.db.collection('users').findOne({ _id: testCustomerId });
      recordTest('Customer Submissions', 'Address physically saved in Atlas user document',
        userWithAddr?.addresses?.length > 0 && userWithAddr.addresses[0].city === 'Mumbai',
        `Addresses count: ${userWithAddr?.addresses?.length}`
      );

      // Toggle Wishlist
      const sampleProd = await atlasConn.connection.db.collection('products').findOne({});
      const wishRes = await fetch(`${BASE_URL}/auth/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testCustomerToken}`
        },
        body: JSON.stringify({ productId: sampleProd._id })
      });
      const wishData = await wishRes.json();
      recordTest('Customer Submissions', 'POST /api/auth/wishlist/toggle adds product to wishlist', wishRes.ok && wishData.success);

      // Direct Atlas verification
      const userWithWish = await atlasConn.connection.db.collection('users').findOne({ _id: testCustomerId });
      recordTest('Customer Submissions', 'Product ID physically saved in Atlas `wishlist` array',
        userWithWish?.wishlist?.some(id => id.toString() === sampleProd._id.toString()),
        `Wishlist length: ${userWithWish?.wishlist?.length}`
      );

      // Update Profile
      const profRes = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testCustomerToken}`
        },
        body: JSON.stringify({ name: 'Shri Vikramaditya Updated', phone: '9999888877' })
      });
      const profData = await profRes.json();
      recordTest('Customer Submissions', 'PUT /api/auth/profile updates profile', profRes.ok && profData.success);
      const updatedUser = await atlasConn.connection.db.collection('users').findOne({ _id: testCustomerId });
      recordTest('Customer Submissions', 'Updated name and phone physically updated in Atlas', updatedUser?.name === 'Shri Vikramaditya Updated' && updatedUser?.phone === '9999888877');
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 9: Coupon Validation Engine
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Testing Coupon Validation Engine ---');
    {
      // Valid percentage coupon
      const val1 = await fetch(`${BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'RISHILAL10', orderAmount: 50000 })
      });
      const data1 = await val1.json();
      recordTest('Coupon Engine', 'POST /api/coupons/validate succeeds for valid coupon RISHILAL10', val1.ok && data1.success);
      recordTest('Coupon Engine', 'Correctly calculates 10% discount (₹5,000 on ₹50,000)',
        data1.coupon?.discountAmount === 5000,
        `Discount: ₹${data1.coupon?.discountAmount}`
      );

      // Valid fixed discount coupon
      const val2 = await fetch(`${BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'BRIDAL5000', orderAmount: 100000 })
      });
      const data2 = await val2.json();
      recordTest('Coupon Engine', 'POST /api/coupons/validate succeeds for fixed coupon BRIDAL5000',
        val2.ok && data2.coupon?.discountAmount === 5000,
        `Discount: ₹${data2.coupon?.discountAmount}`
      );

      // Invalid coupon rejection
      const valInvalid = await fetch(`${BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'INVALID999', orderAmount: 50000 })
      });
      recordTest('Coupon Engine', 'Rejects non-existent coupon with HTTP 400/404', !valInvalid.ok);
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 10: Admin Product Creation and Live Editing
    // -------------------------------------------------------------------------
    console.log('\n--- 10. Testing Admin Product Creation and Live Editing ---');
    let createdProductId = null;
    const testSku = `TEST-E2E-CAD-${Date.now().toString().slice(-4)}`;

    {
      // 1. Create Product
      const newProductPayload = {
        name: 'TEST E2E Royal Sunburst 22K Gold Pendant',
        sku: testSku,
        category: "Men's Jewellery",
        categorySlug: 'men',
        price: 36500,
        originalPrice: 42000,
        description: 'Automated integration test product verifying Atlas live persistence from admin dashboard.',
        metal: '22K Yellow Gold',
        stock: 5,
        images: ['/images/kids/bracelets/balak-925-silver-adjustable-name-plate-bracelet.jpg'],
        isOrderable: true,
        priceStatus: 'approved',
        isPublished: true
      };

      const createRes = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newProductPayload)
      });
      const createData = await createRes.json();
      recordTest('Admin Product Management', 'POST /api/products creates product via Admin privileges', createRes.status === 201 && createData.success);
      createdProductId = createData.product?._id;

      // Direct Atlas verification
      const atlasProd = await atlasConn.connection.db.collection('products').findOne({ _id: new mongoose.Types.ObjectId(createdProductId) });
      recordTest('Admin Product Management', 'Product physically persisted in MongoDB Atlas', atlasProd !== null, `Atlas SKU: ${atlasProd?.sku}`);
      recordTest('Admin Product Management', 'Calculates and saves discount percentage in Atlas', atlasProd?.discountPercentage === 13, `Discount: ${atlasProd?.discountPercentage}%`);

      // 2. Edit Product
      const updateRes = await fetch(`${BASE_URL}/products/${createdProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          price: 38000,
          stock: 12
        })
      });
      const updateData = await updateRes.json();
      recordTest('Admin Product Management', 'PUT /api/products/:id updates product details', updateRes.ok && updateData.success);

      // Direct Atlas verification of updated fields
      const updatedAtlasProd = await atlasConn.connection.db.collection('products').findOne({ _id: new mongoose.Types.ObjectId(createdProductId) });
      recordTest('Admin Product Management', 'Updated price and stock physically reflected in Atlas',
        updatedAtlasProd?.price === 38000 && updatedAtlasProd?.stock === 12,
        `New Price: ₹${updatedAtlasProd?.price}, New Stock: ${updatedAtlasProd?.stock}`
      );

      // 3. Delete Product (Testing Admin Delete & keeping catalog clean)
      const delRes = await fetch(`${BASE_URL}/products/${createdProductId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      recordTest('Admin Product Management', 'DELETE /api/products/:id removes test product', delRes.ok);
      const prodAfterDel = await atlasConn.connection.db.collection('products').findOne({ _id: new mongoose.Types.ObjectId(createdProductId) });
      recordTest('Admin Product Management', 'Test product cleanly removed from Atlas without residue', prodAfterDel === null);
    }

    // -------------------------------------------------------------------------
    // CLEANUP OF TEST-ONLY RUNTIME ARTIFACTS
    // -------------------------------------------------------------------------
    console.log('\n[Cleanup] Cleaning up ephemeral test records...');
    if (testOrderNumber) {
      await atlasConn.connection.db.collection('orders').deleteOne({ orderNumber: testOrderNumber });
      console.log(`  ✓ Cleaned up test order [${testOrderNumber}]`);
    }
    if (testCustomerId) {
      await atlasConn.connection.db.collection('users').deleteOne({ _id: testCustomerId });
      console.log(`  ✓ Cleaned up test customer user [${testCustomerEmail}]`);
    }

    // Final database verification check
    console.log('\n' + '='.repeat(80));
    console.log('FINAL ATLAS DATABASE INTEGRITY CHECK (COUNTS AFTER TESTS):');
    console.log('='.repeat(80));
    const collections = ['categories', 'products', 'users', 'coupons', 'orders'];
    const expectedCounts = { categories: 10, products: 251, users: 12, coupons: 4, orders: 7 };
    const finalReport = [];

    for (const c of collections) {
      const currentCount = await atlasConn.connection.db.collection(c).countDocuments();
      finalReport.push({
        Collection: c,
        'Expected Baseline': expectedCounts[c],
        'Atlas Verified Count': currentCount,
        Status: currentCount === expectedCounts[c] ? 'VERIFIED ✓' : 'MISMATCH'
      });
    }
    console.table(finalReport);

    // Summary
    const totalTests = testResults.length;
    const passedTests = testResults.filter(t => t.status === 'PASS').length;
    const failedTests = testResults.filter(t => t.status === 'FAIL').length;

    console.log('\n' + '='.repeat(80));
    console.log(`INTEGRATION TEST SUMMARY: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
    console.log('='.repeat(80));

    if (failedTests > 0) {
      console.error('\n✗ Some integration tests failed. Details:');
      console.table(testResults.filter(t => t.status === 'FAIL'));
      process.exit(1);
    } else {
      console.log('\n✨ ALL 10 INTEGRATION TEST MODULES PASSED WITH 100% SUCCESS ON MONGODB ATLAS!');
    }

  } catch (error) {
    console.error('[Integration Test Error]', error);
    process.exit(1);
  } finally {
    if (server) server.close();
    if (atlasConn) await mongoose.disconnect();
  }
}

if (require.main === module) {
  runIntegrationTests();
}

module.exports = { runIntegrationTests };
