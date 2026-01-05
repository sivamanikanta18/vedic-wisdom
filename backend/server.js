import app from './app.js';
import { connectDb } from './db.js';

const PORT = process.env.PORT || 5000;

console.log('Connecting to MongoDB...');

async function startServer() {
  try {
    await connectDb();
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

startServer();
