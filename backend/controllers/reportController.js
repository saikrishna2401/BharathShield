/**
 * Report Controller for PhishGuard API
 */

const storageService = require('../services/storageService');

async function handleReport(req, res) {
  try {
    const { message, sender, category, description, hasScreenshot } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Report submission must include message content.'
      });
    }

    const reportRecord = await storageService.saveReport({
      message,
      sender,
      category: category || 'Other Scam',
      description,
      hasScreenshot
    });

    return res.status(201).json({
      success: true,
      message: 'Report recorded successfully in PhishGuard local database. Thank you for contributing to community threat intelligence.',
      report: reportRecord
    });
  } catch (error) {
    console.error('[Report API Error]:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to record report.'
    });
  }
}

module.exports = {
  handleReport
};
