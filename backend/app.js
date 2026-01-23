import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import adminRoutes from './routes/admin.js';
import eventsRoutes from './routes/events.js';
import gamesRoutes from './routes/games.js';
import chatbotRoutes from './routes/chatbot.js';
import { publicRouter } from './routes/chatbot.js';
import chatbotAIRoutes from './routes/chatbot-ai.js';
import { publicRouter as publicAIRouter } from './routes/chatbot-ai.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chatbot-ai', chatbotAIRoutes);
app.use('/api/chatbot-public', publicRouter);
app.use('/api/ai', publicAIRouter);

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
