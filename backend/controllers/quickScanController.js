/**
 * Quick Scan Controller for BharathShield
 */

const { processQuickScan } = require('../detection/quickScanDetector');
const storageService = require('../services/storageService');

async function handleQuickScan(req, res) {
  try {
    const userId = req.body.userId || req.headers['x-user-id'] || 'user-101';
    const payload = req.body || {};

    if (!payload.inputData && !payload.ocrText) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Scan payload must include inputData or ocrText.'
      });
    }

    const result = await processQuickScan(payload);

    // Save record scoped to user
    await storageService.saveAnalysis(result, payload.inputData || payload.ocrText || '', userId);

    return res.status(200).json(result);
  } catch (error) {
    console.error('[QuickScan API Error]:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to complete quick scan analysis.'
    });
  }
}

module.exports = {
  handleQuickScan
};
