const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN, DEMO_ACCOUNTS } = require('../config/constants');
const emailService = require('../services/emailService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// @desc    Register a new customer with email verification
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name (at least 2 characters).'
      });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check for existing account
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please sign in.'
        });
      }
      return res.status(400).json({
        success: false,
        code: 'EMAIL_UNVERIFIED',
        message: 'An unverified account with this email address already exists. Please check your inbox or request a new verification email.'
      });
    }

    // Role strictly defaults to 'customer'
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone ? phone.trim() : undefined,
      role: 'customer',
      isEmailVerified: false
    });

    // Generate single-use crypto random verification token and store SHA-256 hash
    const rawToken = user.createEmailVerificationToken();
    user.lastVerificationEmailSent = new Date();
    await user.save();

    // Send actual branded verification email
    try {
      await emailService.sendVerificationEmail({
        to: user.email,
        name: user.name,
        token: rawToken
      });
    } catch (emailErr) {
      // Rollback user creation if email sending fails so customer can retry cleanly
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: emailErr.message || 'Unable to deliver verification email. Please verify your email address or try again.'
      });
    }

    res.status(201).json({
      success: true,
      requiresVerification: true,
      message: 'Account created successfully. A verification link has been sent to your email address. Please verify to activate your account.',
      email: user.email
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify customer email address via single-use token
// @route   GET /api/auth/verify-email or POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const rawToken = req.query.token || req.body?.token;

    if (!rawToken || typeof rawToken !== 'string' || rawToken.trim().length === 0) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_TOKEN',
        message: 'A valid email verification token is required.'
      });
    }

    // Hash the candidate token using SHA-256 to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken.trim())
      .digest('hex');

    // Find account with unexpired, matching token hash
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() }
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'This email verification link is invalid, has expired, or has already been used. Please request a new verification email.'
      });
    }

    // Mark as verified and clear single-use token fields
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Issue authentic session token upon successful email verification
    const sessionToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email address verified successfully. Welcome to Rishi Lal Jewellers.',
      token: sessionToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isEmailVerified: true
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resend email verification link with rate limiting and privacy protection
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+emailVerificationToken +emailVerificationExpires');

    // Generic privacy-preserving response if user does not exist or is already verified
    if (!user || user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: 'If an unverified account exists for this email address, a new verification link has been sent.'
      });
    }

    // Cooldown check (60 seconds minimum between email dispatches)
    if (user.lastVerificationEmailSent) {
      const elapsedMs = Date.now() - new Date(user.lastVerificationEmailSent).getTime();
      const cooldownMs = 60 * 1000;
      if (elapsedMs < cooldownMs) {
        const waitSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000);
        return res.status(429).json({
          success: false,
          code: 'COOLDOWN_ACTIVE',
          message: `Please wait ${waitSeconds} second${waitSeconds === 1 ? '' : 's'} before requesting another verification email.`,
          retryAfterSeconds: waitSeconds
        });
      }
    }

    // Generate fresh single-use verification token
    const rawToken = user.createEmailVerificationToken();
    user.lastVerificationEmailSent = new Date();
    await user.save();

    try {
      await emailService.sendVerificationEmail({
        to: user.email,
        name: user.name,
        token: rawToken
      });
    } catch (emailErr) {
      return res.status(500).json({
        success: false,
        message: emailErr.message || 'Unable to deliver verification email. Please try again later.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'If an unverified account exists for this email address, a new verification link has been sent.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user / customer or admin (Enforces Email Verification)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    // Check email verification status
    // Explicit, secure exception: configured demo accounts bypass email verification for evaluation
    const isDemoAccount = (
      user.email === DEMO_ACCOUNTS.ADMIN.email.toLowerCase() ||
      user.email === DEMO_ACCOUNTS.CUSTOMER.email.toLowerCase()
    );

    if (!user.isEmailVerified && !isDemoAccount) {
      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email address before signing in. Check your inbox for the verification link.',
        email: user.email
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add shipping address
// @route   POST /api/auth/address
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { fullName, phone, street, apartment, city, state, postalCode, country, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      fullName,
      phone,
      street,
      apartment,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address saved to your address book',
      addresses: user.addresses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address removed successfully',
      addresses: user.addresses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/auth/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(productId);
    let action = 'added';

    if (index > -1) {
      user.wishlist.splice(index, 1);
      action = 'removed';
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Product ${action} to wishlist`,
      wishlist: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};

