/**
 * BharathShield Backend Server Entry Point
 * Enterprise Express.js app featuring security hardening (Helmet, CORS, Rate Limiting, Body limits)
 * and dual storage initialization (MongoDB with zero-config memory fallback).
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const apiRoutes = require('./routes/apiRoutes');
const storageService = require('./services/storageService');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Hardening Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allows inline scripts & dynamic styles for production SPA
}));
app.use(cors({
  origin: '*', // Allows development and mobile cross-origin access
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing Security Limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate Limiting Protection (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

app.use('/api', apiLimiter);

// Mount API Routes
app.use('/api', apiRoutes);

// Serve Static Frontend Build in Production (Single-Service Cloud Deployment)
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`[Production] Serving frontend static assets from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Root Route when running standalone backend
  app.get('/', (req, res) => {
    res.json({
      app: 'BharathShield Backend Server',
      tagline: 'Understand. Detect. Stay Safe.',
      version: '2.0.0-Enhanced',
      status: 'online',
      documentation: '/api/health'
    });
  });
}

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal error occurred on the BharathShield server.'
  });
});

// Initialize MongoDB Connection or Fallback to Memory Mode
async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log('✅ Connected to MongoDB Database');
      storageService.setMongoAvailable(true);
    } catch (mongoErr) {
      console.warn('⚠️ Could not connect to MongoDB. Operating in standalone ZERO-CONFIG MEMORY MODE.');
      storageService.setMongoAvailable(false);
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided. Operating in standalone ZERO-CONFIG MEMORY MODE.');
    storageService.setMongoAvailable(false);
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🛡️ BharathShield API Backend Server running on port ${PORT}`);
    console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

startServer();
