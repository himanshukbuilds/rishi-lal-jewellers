const { Resend } = require('resend');
const { RESEND_API_KEY, EMAIL_FROM, CLIENT_URL, APP_BASE_URL } = require('../config/constants');

let mockHandler = null;

/**
 * Set a custom mock handler for testing
 * @param {Function|null} fn - Mock function receiving { to, subject, html, text, verificationUrl }
 */
const setMockHandler = (fn) => {
  mockHandler = fn;
};

/**
 * Generates the luxury branded HTML email for Rishi Lal Jewellers
 */
const buildVerificationEmailHtml = ({ name, verificationUrl, expiresMinutes = 30 }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email — Rishi Lal Jewellers</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF8F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2C2C2C;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #FAF8F5;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid #E8D7AD;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(42, 8, 14, 0.06);
    }
    .header {
      background-color: #2A080E;
      background-image: linear-gradient(135deg, #2A080E 0%, #4A0B13 100%);
      padding: 36px 24px;
      text-align: center;
      border-bottom: 2px solid #C2AA6A;
    }
    .brand-title {
      color: #FFFFFF;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      margin: 0;
      font-weight: 500;
    }
    .brand-subtitle {
      color: #C2AA6A;
      font-size: 10px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      margin-top: 8px;
      font-weight: 600;
    }
    .content {
      padding: 40px 32px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      color: #2A080E;
      margin-bottom: 16px;
    }
    .heading {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      color: #2A080E;
      margin-top: 0;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .message {
      font-size: 14px;
      color: #4A4A4A;
      margin-bottom: 28px;
    }
    .btn-container {
      text-align: center;
      margin: 36px 0;
    }
    .btn-verify {
      display: inline-block;
      background-color: #8B1E2D;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 2px;
      font-size: 13px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 600;
      border: 1px solid #C2AA6A;
      box-shadow: 0 4px 12px rgba(139, 30, 45, 0.25);
    }
    .expiry-note {
      font-size: 12px;
      color: #7A7A7A;
      text-align: center;
      margin-top: -12px;
      margin-bottom: 28px;
      font-style: italic;
    }
    .fallback-box {
      background-color: #FAF8F5;
      border: 1px solid #E8E5DF;
      border-radius: 4px;
      padding: 16px;
      font-size: 12px;
      color: #555555;
      word-break: break-all;
      margin-bottom: 28px;
    }
    .fallback-box a {
      color: #8B1E2D;
      text-decoration: underline;
    }
    .security-note {
      font-size: 12px;
      color: #888888;
      border-top: 1px solid #F0EEE9;
      padding-top: 20px;
      margin-top: 24px;
    }
    .footer {
      background-color: #F8F5EF;
      border-top: 1px solid #E8D7AD;
      padding: 24px;
      text-align: center;
      font-size: 11px;
      color: #7A7A7A;
      line-height: 1.6;
    }
    .footer strong {
      color: #2A080E;
    }
    .gold-divider {
      width: 48px;
      height: 2px;
      background-color: #C2AA6A;
      margin: 16px auto;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-title">Rishi Lal Jewellers</h1>
        <div class="brand-subtitle">Haute Indian Jewellery • Est. 1974</div>
      </div>
      <div class="content">
        <h2 class="heading">Verify Your Email Address</h2>
        <div class="greeting">Dear ${name || 'Valued Patron'},</div>
        <p class="message">
          Welcome to Rishi Lal Jewellers. To complete your registration and activate your patron account privileges — including bespoke bridal curation, insured order tracking, and private collection previews — please verify that you can receive communications at this address.
        </p>
        
        <div class="btn-container">
          <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer" class="btn-verify">
            Verify Email Address
          </a>
        </div>
        
        <div class="expiry-note">
          This verification link is secure and valid for ${expiresMinutes} minutes.
        </div>

        <div class="fallback-box">
          <strong>Button not working?</strong> Copy and paste this secure link directly into your browser:<br>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </div>

        <div class="security-note">
          If you did not create an account with Rishi Lal Jewellers, no further action is required. You can safely ignore this email.
        </div>
      </div>
      <div class="footer">
        <strong>RISHI LAL JEWELLERS</strong><br>
        100% BIS Hallmarked Gold • IGI Certified Natural Diamonds<br>
        Mumbai • New Delhi • India<br>
        <div class="gold-divider"></div>
        This is an automated transactional message regarding your account registration.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Plain-text fallback for email clients that do not render HTML
 */
const buildVerificationEmailText = ({ name, verificationUrl, expiresMinutes = 30 }) => {
  return `
RISHI LAL JEWELLERS
Haute Indian Jewellery • Est. 1974

Verify Your Email Address

Dear ${name || 'Valued Patron'},

Welcome to Rishi Lal Jewellers. To complete your registration and activate your patron privileges, please verify your email address by opening the following link in your browser:

${verificationUrl}

This link is valid for ${expiresMinutes} minutes.

If you did not register for an account with Rishi Lal Jewellers, please disregard this email.

---
Rishi Lal Jewellers
100% BIS Hallmarked Gold • IGI Certified Natural Diamonds
Mumbai • New Delhi
  `.trim();
};

/**
 * Send Email Verification link to customer
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.name - Customer's full name
 * @param {string} options.token - Raw cryptographically secure verification token
 * @returns {Promise<{ success: boolean, id?: string }>}
 */
const sendVerificationEmail = async ({ to, name, token }) => {
  const baseUrl = APP_BASE_URL || CLIENT_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const expiresMinutes = 30;

  const html = buildVerificationEmailHtml({ name, verificationUrl, expiresMinutes });
  const text = buildVerificationEmailText({ name, verificationUrl, expiresMinutes });
  const subject = 'Verify Your Email Address — Rishi Lal Jewellers';

  // 1. Allow custom mock handler (for automated tests and local test suites)
  if (mockHandler) {
    return await mockHandler({ to, name, token, verificationUrl, subject, html, text });
  }

  // 2. Automated test environment without mockHandler
  if (process.env.NODE_ENV === 'test') {
    return {
      success: true,
      id: 'mock-test-id',
      message: 'Email delivered to mock transport in test mode'
    };
  }

  // 3. Check for API key - in development without key, log verification URL to console
  if (!RESEND_API_KEY) {
    console.log('\n================================================================================');
    console.log('📧 [EMAIL VERIFICATION - LOCAL DEVELOPMENT]');
    console.log(`To: ${to} (${name})`);
    console.log(`Subject: ${subject}`);
    console.log(`🔗 Verification URL: ${verificationUrl}`);
    console.log('================================================================================\n');
    return {
      success: true,
      id: 'dev-local-id',
      verificationUrl,
      isDevMode: true,
      message: 'Email simulated in local development. Check terminal output for verification URL.'
    };
  }

  // 4. Send via official Resend SDK
  const resend = new Resend(RESEND_API_KEY);
  const sender = EMAIL_FROM || 'Rishi Lal Jewellers <onboarding@resend.dev>';

  try {
    const response = await resend.emails.send({
      from: sender,
      to,
      subject,
      html,
      text
    });

    if (response.error) {
      console.error('[EmailService] Resend API error:', response.error);
      throw new Error(response.error.message || 'Failed to send verification email via provider.');
    }

    return {
      success: true,
      id: response.data?.id
    };
  } catch (err) {
    console.error('[EmailService] Error sending email:', err.message);
    throw err;
  }
};

module.exports = {
  sendVerificationEmail,
  setMockHandler,
  buildVerificationEmailHtml,
  buildVerificationEmailText
};

