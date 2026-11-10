require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { PORT } = require('./src/config/constants');
const Product = require('./src/models/Product');
const seedDatabase = require('./src/seeds/seed');

const server = http.createServer(app);

const startServer = async () => {
  try {
    // 1. Connect to Database (Live Mongo or in-memory fallback)
    await connectDB();

    // 2. Database verification (Auto-seeding is strictly disabled in production & cloud Atlas environments)
    const productCount = await Product.countDocuments();
    const isProduction = process.env.NODE_ENV === 'production';
    const isCloudDb = Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv'));
    const allowAutoSeed = process.env.AUTO_SEED === 'true';

    if (productCount === 0) {
      if (!isProduction && !isCloudDb && allowAutoSeed) {
        console.log('[Server] Local development database is empty and AUTO_SEED=true. Auto-seeding initial catalog...');
        await seedDatabase();
      } else {
        console.log('[Server] Database has 0 products. Automatic demo seeding is DISABLED to protect cloud/production data.');
        console.log('[Server] To populate products, run the dedicated migration script or add products via Admin Dashboard.');
      }
    } else {
      console.log(`[Server] Database verified: ${productCount} jewelry creations loaded.`);
    }

    // 3. Start listening on designated port
    server.listen(PORT, () => {
      console.log('====================================================');
      console.log(`✨ RISHI LAL JEWELLERS REST API running on http://localhost:${PORT}`);
      console.log(`✨ Health Check: http://localhost:${PORT}/api/health`);
      console.log(`✨ Products:     http://localhost:${PORT}/api/products`);
      console.log(`✨ Categories:   http://localhost:${PORT}/api/categories`);
      console.log('====================================================');
    });
  } catch (err) {
    console.error('[Server] Critical error during startup:', err);
    process.exit(1);
  }
};

startServer();

// Graceful termination
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Gracefully shutting down.');
  server.close(() => {
    console.log('[Server] Process terminated.');
  });
});

