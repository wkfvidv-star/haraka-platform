import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';
import hceRoutes from './routes/hce.js';
import accessRoutes from './routes/access.js';
import activityRoutes from './routes/activity.js';
import profileRoutes from './routes/profile.js';
import analysisRoutes from './routes/analysis.js';
import gamificationRoutes from './routes/gamification.js';
import healthRoutes from './routes/health.js';
import paymentRoutes from './routes/payments.js';
import aiRoutes from './routes/ai.js';
import sessionRoutes from './routes/session.js';
import adminRoutes from './routes/admin.js';
import coachRoutes from './routes/coach.js';
import analyticsRoutes from './routes/analytics.js';
import prisma from './prisma/client.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'http://localhost:8080', 'http://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(compression());

// --- Body Parsing ---
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Request Logging ---
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, { ip: req.ip });
  next();
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/hce', hceRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mode: 'production'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Resource not found' });
});

// Error Handler
app.use(errorHandler);

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// --- Server Start ---
const server = app.listen(PORT, () => {
  logger.info(`✅ Haraka Production Server running on port ${PORT}`);
  logger.info(`🌐 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  logger.error('❌ Server failed to start:', err);
  process.exit(1);
});

// Graceful Shutdown
const shutdown = async (signal) => {
  logger.info(`🔄 Shutting down (Signal: ${signal})...`);
  server.close(() => {
    logger.info('👋 Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
