/**
 * Analysis Controller for PhishGuard API
 */

const { analyzeSMS } = require('../detection/phishingDetector');
const storageService = require('../services/storageService');

async function handleAnalyze(req, res) {
  try {
    const { message, sender, language } = req.body || {};

    // API Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Request payload must include a non-empty "message" string.'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        error: 'EMPTY_INPUT',
        message: 'SMS message text cannot be blank.'
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: 'PAYLOAD_TOO_LARGE',
        message: 'SMS message text exceeds maximum length of 4000 characters.'
      });
    }

    // Run multi-stage phishing detection
    const result = await analyzeSMS({ message, sender, language });

    // Save anonymized record
    await storageService.saveAnalysis(result, message);

    return res.status(200).json(result);
  } catch (error) {
    console.error('[Analyze API Error]:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred while analyzing the SMS message.'
    });
  }
}

async function handleHealthCheck(req, res) {
  return res.status(200).json({
    status: 'ok',
    service: 'PhishGuard Detection API',
    version: '2.0.0-Enhanced',
    database: storageService.useMemory ? 'memory' : 'mongodb',
    ml: 'unavailable (Rule-based fallback active)',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  handleAnalyze,
  handleHealthCheck
};
