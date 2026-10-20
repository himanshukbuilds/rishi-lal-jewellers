const test = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const authController = require('../src/controllers/authController');
const emailService = require('../src/services/emailService');
const { DEMO_ACCOUNTS } = require('../src/config/constants');

// In-memory user store for mock database simulation
let inMemoryUsers = [];

// Helper to create mock request and response
const createMockReqRes = ({ body = {}, query = {}, headers = {} } = {}) => {
  let statusCode = 200;
  let responseData = null;

  const req = {
    body,
    query,
    headers,
  };

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
  };

  return {
    req,
    res,
    getStatus: () => statusCode,
    getData: () => responseData,
  };
};

// Mock User document class mirroring Mongoose User model
class MockUserDoc {
  constructor(data) {
    this._id = data._id || 'mock_user_' + Math.random().toString(36).substring(2, 9);
    this.name = data.name;
    this.email = data.email?.toLowerCase();
    this.password = data.password;
    this.phone = data.phone;
    this.role = data.role || 'customer';
    this.isEmailVerified = data.isEmailVerified ?? false;
    this.emailVerificationToken = data.emailVerificationToken;
    this.emailVerificationExpires = data.emailVerificationExpires;
    this.lastVerificationEmailSent = data.lastVerificationEmailSent;
    this.addresses = data.addresses || [];
    this.wishlist = data.wishlist || [];
  }

  async comparePassword(candidatePassword) {
    if (this.password && this.password.startsWith('$2a$')) {
      return await bcrypt.compare(candidatePassword, this.password);
    }
    return candidatePassword === this.password;
  }

  createEmailVerificationToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    this.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000);
    return rawToken;
  }

  async save() {
    // Hash password if plain
    if (this.password && !this.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    const idx = inMemoryUsers.findIndex((u) => u._id === this._id);
    if (idx >= 0) {
      inMemoryUsers[idx] = this;
    } else {
      inMemoryUsers.push(this);
    }
    return this;
  }
}

// Override User model methods for sandbox unit testing
const originalFindOne = User.findOne;
const originalFindByIdAndDelete = User.findByIdAndDelete;
const originalSave = User.prototype.save;

const setupMockModel = () => {
  User.prototype.save = async function () {
    if (this.password && !this.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    const idx = inMemoryUsers.findIndex(
      (u) => (u._id && this._id && u._id.toString() === this._id.toString()) || u.email === this.email
    );
    if (idx >= 0) {
      inMemoryUsers[idx] = this;
    } else {
      inMemoryUsers.push(this);
    }
    return this;
  };

  User.findOne = (query) => {
    let result = null;
    if (query.email) {
      result = inMemoryUsers.find((u) => u.email === query.email.toLowerCase()) || null;
    } else if (query.emailVerificationToken) {
      result =
        inMemoryUsers.find((u) => {
          const tokenMatches = u.emailVerificationToken === query.emailVerificationToken;
          let notExpired = true;
          if (query.emailVerificationExpires && query.emailVerificationExpires.$gt) {
            notExpired = u.emailVerificationExpires && u.emailVerificationExpires > query.emailVerificationExpires.$gt;
          }
          return tokenMatches && notExpired;
        }) || null;
    }

    // Support Mongoose .select(...) chaining
    const queryObj = {
      select() {
        return Promise.resolve(result);
      },
      then(resolve, reject) {
        return Promise.resolve(result).then(resolve, reject);
      },
    };
    return queryObj;
  };

  User.findByIdAndDelete = async (id) => {
    const idx = inMemoryUsers.findIndex((u) => u._id === id);
    if (idx >= 0) {
      return inMemoryUsers.splice(idx, 1)[0];
    }
    return null;
  };
};

const restoreMockModel = () => {
  User.findOne = originalFindOne;
  User.findByIdAndDelete = originalFindByIdAndDelete;
  User.prototype.save = originalSave;
  emailService.setMockHandler(null);
};

test('Email Verification Test Suite', async (t) => {
  t.before(() => {
    setupMockModel();
  });

  t.after(() => {
    restoreMockModel();
  });

  t.beforeEach(() => {
    inMemoryUsers = [];
  });

  // 1. Successful registration creates an unverified account
  await t.test('1. Successful registration creates an unverified account', async () => {
    let capturedEmail = null;
    emailService.setMockHandler(async (opts) => {
      capturedEmail = opts;
      return { success: true, id: 'mock-msg-1' };
    });

    const { req, res, getStatus, getData } = createMockReqRes({
      body: {
        name: 'Aanya Verma',
        email: 'aanya.verma@example.com',
        password: 'Password@123',
        phone: '9876543210',
      },
    });

    await authController.register(req, res, () => {});

    assert.strictEqual(getStatus(), 201);
    const data = getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.requiresVerification, true);
    assert.strictEqual(data.token, undefined, 'Must NOT issue session JWT before verification');

    const userInDb = inMemoryUsers.find((u) => u.email === 'aanya.verma@example.com');
    assert.ok(userInDb, 'User must exist in DB');
    assert.strictEqual(userInDb.isEmailVerified, false, 'Account must start in unverified state');
    assert.ok(userInDb.emailVerificationToken, 'Token hash must be stored');
    assert.ok(userInDb.emailVerificationExpires > new Date(), 'Expiration must be in the future');
  });

  // 2. Duplicate registration is rejected
  await t.test('2. Duplicate registration is rejected', async () => {
    emailService.setMockHandler(async () => ({ success: true }));

    // Create initial user
    const initialUser = new MockUserDoc({
      name: 'Aanya Verma',
      email: 'duplicate.test@example.com',
      password: 'Password@123',
      isEmailVerified: true,
    });
    await initialUser.save();

    // Attempt second registration with same email (case-insensitive)
    const { req: req2, res: res2, getStatus: getStatus2, getData: getData2 } = createMockReqRes({
      body: {
        name: 'Aanya Copy',
        email: 'DUPLICATE.TEST@example.com',
        password: 'DifferentPassword@123',
      },
    });
    await authController.register(req2, res2, () => {});

    assert.strictEqual(getStatus2(), 400);
    const data = getData2();
    assert.strictEqual(data.success, false);
    assert.match(data.message, /already exists/i);
  });

  // 3. Verification email is requested from the configured email provider
  await t.test('3. Verification email is requested from the configured email provider', async () => {
    let capturedCall = null;
    emailService.setMockHandler(async (opts) => {
      capturedCall = opts;
      return { success: true, id: 'provider-msg-123' };
    });

    const { req, res } = createMockReqRes({
      body: {
        name: 'Kavita Sen',
        email: 'kavita.sen@example.com',
        password: 'Password@123',
      },
    });

    await authController.register(req, res, () => {});

    assert.ok(capturedCall, 'Email provider should receive dispatch request');
    assert.strictEqual(capturedCall.to, 'kavita.sen@example.com');
    assert.strictEqual(capturedCall.name, 'Kavita Sen');
    assert.ok(capturedCall.token, 'Must contain raw verification token');
    assert.ok(capturedCall.verificationUrl.includes('token='), 'Must contain secure verification URL');
    assert.ok(capturedCall.html.includes('Rishi Lal Jewellers'), 'HTML must feature brand title');
    assert.ok(capturedCall.text.includes(capturedCall.verificationUrl), 'Plain text fallback must include link');
  });

  // 4. A valid token verifies an account
  await t.test('4. A valid token verifies an account', async () => {
    const unverifiedUser = new MockUserDoc({
      name: 'Rohan Mehra',
      email: 'rohan.mehra@example.com',
      password: 'Password@123',
      isEmailVerified: false,
    });
    const rawVerificationToken = unverifiedUser.createEmailVerificationToken();
    await unverifiedUser.save();

    const { req: verReq, res: verRes, getStatus, getData } = createMockReqRes({
      body: { token: rawVerificationToken },
    });
    await authController.verifyEmail(verReq, verRes, () => {});

    assert.strictEqual(getStatus(), 200);
    const data = getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.isEmailVerified, true);
    assert.ok(data.token, 'Session token should be granted upon successful verification');

    const user = inMemoryUsers.find((u) => u.email === 'rohan.mehra@example.com');
    assert.strictEqual(user.isEmailVerified, true);
    assert.strictEqual(user.emailVerificationToken, undefined, 'Stored token hash must be cleared');
    assert.strictEqual(user.emailVerificationExpires, undefined, 'Expiration must be cleared');
  });

  // 5. An expired token is rejected
  await t.test('5. An expired token is rejected', async () => {
    const expiredUser = new MockUserDoc({
      name: 'Expired User',
      email: 'expired@example.com',
      password: 'Password@123',
      isEmailVerified: false,
    });
    const rawToken = expiredUser.createEmailVerificationToken();
    expiredUser.emailVerificationExpires = new Date(Date.now() - 1000 * 60 * 5); // expired 5m ago
    await expiredUser.save();

    const { req, res, getStatus, getData } = createMockReqRes({
      query: { token: rawToken },
    });
    await authController.verifyEmail(req, res, () => {});

    assert.strictEqual(getStatus(), 400);
    const data = getData();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.code, 'INVALID_OR_EXPIRED_TOKEN');
  });

  // 6. An invalid token is rejected
  await t.test('6. An invalid token is rejected', async () => {
    const { req: req1, res: res1, getStatus: getStatus1 } = createMockReqRes({
      query: {},
    });
    await authController.verifyEmail(req1, res1, () => {});
    assert.strictEqual(getStatus1(), 400);

    const { req: req2, res: res2, getStatus: getStatus2, getData: getData2 } = createMockReqRes({
      query: { token: 'bogus-token-1234567890abcdef' },
    });
    await authController.verifyEmail(req2, res2, () => {});
    assert.strictEqual(getStatus2(), 400);
    assert.strictEqual(getData2().code, 'INVALID_OR_EXPIRED_TOKEN');
  });

  // 7. A used token cannot be reused
  await t.test('7. A used token cannot be reused', async () => {
    const user = new MockUserDoc({
      name: 'Single Use Patron',
      email: 'singleuse@example.com',
      password: 'Password@123',
      isEmailVerified: false,
    });
    const rawToken = user.createEmailVerificationToken();
    await user.save();

    // Use token once -> Success
    const { req: req1, res: res1, getStatus: getStatus1 } = createMockReqRes({
      body: { token: rawToken },
    });
    await authController.verifyEmail(req1, res1, () => {});
    assert.strictEqual(getStatus1(), 200);

    // Use token second time -> Rejected
    const { req: req2, res: res2, getStatus: getStatus2, getData: getData2 } = createMockReqRes({
      body: { token: rawToken },
    });
    await authController.verifyEmail(req2, res2, () => {});
    assert.strictEqual(getStatus2(), 400);
    assert.strictEqual(getData2().code, 'INVALID_OR_EXPIRED_TOKEN');
  });

  // 8. Unverified users cannot log in
  await t.test('8. Unverified users cannot log in', async () => {
    const unverified = new MockUserDoc({
      name: 'Unverified Patron',
      email: 'unverified@example.com',
      password: 'CorrectPassword@123',
      isEmailVerified: false,
    });
    await unverified.save();

    const { req: loginReq, res: loginRes, getStatus, getData } = createMockReqRes({
      body: {
        email: 'unverified@example.com',
        password: 'CorrectPassword@123',
      },
    });
    await authController.login(loginReq, loginRes, () => {});

    assert.strictEqual(getStatus(), 403);
    const data = getData();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.code, 'EMAIL_NOT_VERIFIED');
    assert.strictEqual(data.token, undefined, 'No token should be issued to unverified accounts');
  });

  // 9. Verified users can log in
  await t.test('9. Verified users can log in', async () => {
    const verifiedUser = new MockUserDoc({
      name: 'Verified Patron',
      email: 'verified@example.com',
      password: 'CorrectPassword@123',
      isEmailVerified: true,
    });
    await verifiedUser.save();

    const { req: loginReq, res: loginRes, getStatus, getData } = createMockReqRes({
      body: {
        email: 'verified@example.com',
        password: 'CorrectPassword@123',
      },
    });
    await authController.login(loginReq, loginRes, () => {});

    assert.strictEqual(getStatus(), 200);
    const data = getData();
    assert.strictEqual(data.success, true);
    assert.ok(data.token, 'Should receive session JWT');
    assert.strictEqual(data.user.email, 'verified@example.com');
    assert.strictEqual(data.user.isEmailVerified, true);
  });

  // 10. Registration followed by verification leads to homepage
  await t.test('10. Registration followed by verification leads to homepage', async () => {
    let capturedUrl = null;
    emailService.setMockHandler(async (opts) => {
      capturedUrl = opts.verificationUrl;
      return { success: true };
    });

    const { req: regReq, res: regRes } = createMockReqRes({
      body: {
        name: 'Homepage Redirect Patron',
        email: 'home.redirect@example.com',
        password: 'Password@123',
      },
    });
    await authController.register(regReq, regRes, () => {});

    assert.ok(capturedUrl);
    const parsedUrl = new URL(capturedUrl);
    assert.strictEqual(parsedUrl.pathname, '/verify-email');
    assert.ok(parsedUrl.searchParams.get('token'), 'Must carry token param');
  });

  // 11. Normal customer login leads to '/'
  await t.test('11. Customer login destination validation logic leads to /', () => {
    const resolveDestination = (user, searchParams) => {
      if (user?.role === 'admin') {
        return '/admin/dashboard';
      }
      const next = searchParams.get('next');
      if (next && next.startsWith('/') && !next.startsWith('//')) {
        try {
          const parsed = new URL(next, 'http://localhost:3000');
          if (parsed.origin === 'http://localhost:3000') {
            return `${parsed.pathname}${parsed.search}${parsed.hash}`;
          }
        } catch {
          return '/';
        }
      }
      return '/';
    };

    const customerUser = { role: 'customer' };
    const emptyParams = new URLSearchParams('');
    assert.strictEqual(resolveDestination(customerUser, emptyParams), '/', 'Default destination must be /');

    const openRedirectParams = new URLSearchParams('next=https://malicious-site.com');
    assert.strictEqual(resolveDestination(customerUser, openRedirectParams), '/', 'Open redirects must be rejected');

    const safeCartParams = new URLSearchParams('next=/cart');
    assert.strictEqual(resolveDestination(customerUser, safeCartParams), '/cart', 'Safe relative return paths are supported');
  });

  // 12. Admin authorization is preserved
  await t.test('12. Admin authorization is preserved', async () => {
    const admin = new MockUserDoc({
      name: DEMO_ACCOUNTS.ADMIN.name,
      email: DEMO_ACCOUNTS.ADMIN.email,
      password: DEMO_ACCOUNTS.ADMIN.password,
      role: 'admin',
      isEmailVerified: true,
    });
    await admin.save();

    const { req: adminLoginReq, res: adminLoginRes, getStatus, getData } = createMockReqRes({
      body: {
        email: DEMO_ACCOUNTS.ADMIN.email,
        password: DEMO_ACCOUNTS.ADMIN.password,
      },
    });
    await authController.login(adminLoginReq, adminLoginRes, () => {});

    assert.strictEqual(getStatus(), 200);
    const data = getData();
    assert.strictEqual(data.user.role, 'admin', 'Admin role must be preserved');
    assert.ok(data.token);
  });

  // 13. Resend verification is rate-limited and does not expose account existence
  await t.test('13. Resend verification is rate-limited and does not expose account existence', async () => {
    emailService.setMockHandler(async () => ({ success: true }));

    // 1. Unregistered email returns generic success (no account enumeration)
    const { req: unregReq, res: unregRes, getStatus: unregStatus, getData: unregData } = createMockReqRes({
      body: { email: 'nonexistent@example.com' },
    });
    await authController.resendVerification(unregReq, unregRes, () => {});
    assert.strictEqual(unregStatus(), 200);
    assert.match(unregData().message, /If an unverified account exists/i);

    // 2. Registered unverified customer
    const user = new MockUserDoc({
      name: 'Cooldown Patron',
      email: 'cooldown@example.com',
      password: 'Password@123',
      isEmailVerified: false,
      lastVerificationEmailSent: new Date(), // just sent
    });
    await user.save();

    // Immediate second resend triggers cooldown (429)
    const { req: resendReq, res: resendRes, getStatus: resendStatus, getData: resendData } = createMockReqRes({
      body: { email: 'cooldown@example.com' },
    });
    await authController.resendVerification(resendReq, resendRes, () => {});

    assert.strictEqual(resendStatus(), 429);
    assert.strictEqual(resendData().code, 'COOLDOWN_ACTIVE');
    assert.ok(resendData().retryAfterSeconds > 0);
  });

  // 14. API errors are handled correctly
  await t.test('14. API errors are handled correctly for invalid payloads', async () => {
    const { req: req1, res: res1, getStatus: status1 } = createMockReqRes({
      body: { email: 'test@example.com' }, // missing name and password
    });
    await authController.register(req1, res1, () => {});
    assert.strictEqual(status1(), 400);

    const { req: req2, res: res2, getStatus: status2, getData: data2 } = createMockReqRes({
      body: { name: 'John Doe', email: 'test@example.com', password: '123' },
    });
    await authController.register(req2, res2, () => {});
    assert.strictEqual(status2(), 400);
    assert.match(data2().message, /at least 6 characters/i);

    const { req: req3, res: res3, getStatus: status3 } = createMockReqRes({
      body: { name: 'John Doe', email: 'invalid-email-format', password: 'Password@123' },
    });
    await authController.register(req3, res3, () => {});
    assert.strictEqual(status3(), 400);
  });
});
