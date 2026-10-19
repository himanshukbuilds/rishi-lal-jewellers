module.exports = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rishi_lal_jewellers',
  JWT_SECRET: process.env.JWT_SECRET || 'rishilal_luxury_secret_jwt_key_2026_int252_int257',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  // Precious Metal Market Price Providers
  IBJA_ACCESS_TOKEN: process.env.IBJA_ACCESS_TOKEN,
  IBJA_ENV: process.env.IBJA_ENV || 'production', // 'production' | 'uat'
  GOLDAPI_KEY: process.env.GOLDAPI_KEY,
  RAPAPORT_CLIENT_ID: process.env.RAPAPORT_CLIENT_ID,
  RAPAPORT_CLIENT_SECRET: process.env.RAPAPORT_CLIENT_SECRET,
  DEMO_ACCOUNTS: {
    ADMIN: {
      email: 'admin@rishilaljewellers.demo',
      password: 'Admin@123',
      name: 'Rishi Lal Head Curator',
      role: 'admin'
    },
    CUSTOMER: {
      email: 'customer@rishilaljewellers.demo',
      password: 'Customer@123',
      name: 'Priya Sharma',
      role: 'customer'
    }
  }
};

