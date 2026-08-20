/**
 * API Routes Module for BharathShield Backend
 */

const express = require('express');
const router = express.Router();

const { handleAnalyze, handleHealthCheck } = require('../controllers/analysisController');
const { handleReport, handleGetAllReports, handleUpdateReportStatus, handleDeleteReport } = require('../controllers/reportController');
const {
  handleGetHistory,
  handleDeleteHistoryItem,
  handleClearHistory,
  handleGetStatistics
} = require('../controllers/historyController');
const { handleGetNotifications, handleMarkNotificationsRead } = require('../controllers/notificationController');
const { handleQuickScan } = require('../controllers/quickScanController');
const { handleLogin, handleRegister } = require('../controllers/authController');

// Health Check
router.get('/health', handleHealthCheck);

// Authentication (User & Admin Login & Registration)
router.post('/auth/login', handleLogin);
router.post('/auth/register', handleRegister);

// SMS Analysis & Quick Vector Scan
router.post('/analyze', handleAnalyze);
router.post('/quick-scan', handleQuickScan);

// Scam Reporting (User submits)
router.post('/report', handleReport);

// Admin Report Management (Admin receives & manages reports)
router.get('/admin/reports', handleGetAllReports);
router.put('/admin/reports/:id', handleUpdateReportStatus);
router.delete('/admin/reports/:id', handleDeleteReport);

// History Management
router.get('/history', handleGetHistory);
router.delete('/history/:id', handleDeleteHistoryItem);
router.delete('/history', handleClearHistory);

// Notifications / Alerts Center
router.get('/notifications', handleGetNotifications);
router.post('/notifications/mark-read', handleMarkNotificationsRead);

// Analytics Statistics
router.get('/statistics', handleGetStatistics);

module.exports = router;
