/**
 * API Routes Module for BharathShield Backend
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
const { handleGetFamily, handleAddFamily, handleRemoveFamily } = require('../controllers/familyController');
const { handleGetNotifications, handleMarkNotificationsRead } = require('../controllers/notificationController');
const { handleQuickScan } = require('../controllers/quickScanController');

// Health Check
router.get('/health', handleHealthCheck);

// SMS Analysis
router.post('/analyze', handleAnalyze);

// Quick Scan (6 Vectors)
router.post('/quick-scan', handleQuickScan);

// Scam Reporting
router.post('/report', handleReport);

// History Management
router.get('/history', handleGetHistory);
router.delete('/history/:id', handleDeleteHistoryItem);
router.delete('/history', handleClearHistory);

// Family Circle
router.get('/family', handleGetFamily);
router.post('/family', handleAddFamily);
router.delete('/family/:id', handleRemoveFamily);

// Notifications / Alerts Center
router.get('/notifications', handleGetNotifications);
router.post('/notifications/mark-read', handleMarkNotificationsRead);

// Analytics Statistics
router.get('/statistics', handleGetStatistics);

module.exports = router;
