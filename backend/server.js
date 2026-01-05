import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import adminRoutes from './routes/admin.js';
import chatbotRoutes from './routes/chatbot.js';
import { publicRouter } from './routes/chatbot.js';
import chatbotAIRoutes from './routes/chatbot-ai.js';
import { publicRouter as publicAIRouter } from './routes/chatbot-ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedic-spiritual-tracker';
const MONGODB_URI_FALLBACK = process.env.MONGODB_URI_FALLBACK || 'mongodb://localhost:27017/vedic-spiritual-tracker';
console.log('Connecting to MongoDB...');
console.log('URI:', MONGODB_URI ? MONGODB_URI.replace(/:[^:@]+@/, ':****@') : 'NOT SET');

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Full error:', err);

    const shouldTryFallback =
      err?.code === 'ENOTFOUND' &&
      typeof MONGODB_URI === 'string' &&
      MONGODB_URI.startsWith('mongodb+srv://') &&
      typeof MONGODB_URI_FALLBACK === 'string' &&
      MONGODB_URI_FALLBACK.length > 0 &&
      MONGODB_URI_FALLBACK !== MONGODB_URI;

    if (shouldTryFallback) {
      console.error('MongoDB Atlas DNS lookup failed (mongodb+srv).');
      console.error('Attempting fallback MongoDB connection...');
      console.log('Fallback URI:', MONGODB_URI_FALLBACK.replace(/:[^:@]+@/, ':****@'));

      try {
        await mongoose.connect(MONGODB_URI_FALLBACK, { serverSelectionTimeoutMS: 10000 });
        console.log('✅ Connected to MongoDB (fallback)');
      } catch (fallbackErr) {
        console.error('❌ Fallback MongoDB connection error:', fallbackErr.message);
        console.error('Full fallback error:', fallbackErr);
        process.exit(1);
      }
    } else {
      if (err?.code === 'ENOTFOUND' && typeof MONGODB_URI === 'string' && MONGODB_URI.startsWith('mongodb+srv://')) {
        console.error('MongoDB Atlas DNS lookup failed (mongodb+srv).');
        console.error('Try one of these:');
        console.error('1) Switch network / fix DNS (try mobile hotspot).');
        console.error('2) Use the Atlas "Standard connection string" (mongodb://...) instead of mongodb+srv://');
        console.error('3) Use local MongoDB via fallback: set MONGODB_URI_FALLBACK=mongodb://localhost:27017/vedic-spiritual-tracker');
      }
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes); // Rule-based fallback
app.use('/api/chatbot-ai', chatbotAIRoutes); // AI-powered (like ChatGPT)
app.use('/api/chatbot-public', publicRouter); // Public unauthenticated chat for testing
app.use('/api/ai', publicAIRouter); // Public AI Q&A for quiz/general questions

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: {
      status: dbStates[dbStatus],
      connected: dbStatus === 1
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

startServer();
