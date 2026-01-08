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

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
      console.error('Close the other backend process (Ctrl+C) or set a different PORT and retry.');
      process.exit(0);
    }
    console.error('❌ Server error:', err);
    process.exit(1);
  });
}

startServer();
