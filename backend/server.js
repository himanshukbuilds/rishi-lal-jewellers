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

    // 2. Check if database needs auto-seeding
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding initial luxury catalog...');
      await seedDatabase();
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

