/**
 * API Routes Module for PhishGuard Backend
 */

const express = require('express');
const router = express.Router();

const { handleAnalyze, handleHealthCheck } = require('../controllers/analysisController');
const { handleReport } = require('../controllers/reportController');
const {
  handleGetHistory,
  handleDeleteHistoryItem,
  handleClearHistory,
  handleGetStatistics
} = require('../controllers/historyController');

// Health Check
router.get('/health', handleHealthCheck);

// SMS Analysis
router.post('/analyze', handleAnalyze);

// Scam Reporting
router.post('/report', handleReport);

// History Management
router.get('/history', handleGetHistory);
router.delete('/history/:id', handleDeleteHistoryItem);
router.delete('/history', handleClearHistory);

// Analytics Statistics
router.get('/statistics', handleGetStatistics);

module.exports = router;
