/**
 * History & Stats Controllers for BharathShield API
 */

const storageService = require('../services/storageService');

async function handleGetHistory(req, res) {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'user-101';
    const history = await storageService.getHistory(userId);
    return res.status(200).json({ history });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve history' });
  }
}

async function handleDeleteHistoryItem(req, res) {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'user-101';
    const { id } = req.params;
    await storageService.deleteHistoryItem(id, userId);
    return res.status(200).json({ success: true, message: `History item ${id} deleted.` });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete history item' });
  }
}

async function handleClearHistory(req, res) {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'user-101';
    await storageService.clearAllHistory(userId);
    return res.status(200).json({ success: true, message: 'All analysis history cleared successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to clear history' });
  }
}

async function handleGetStatistics(req, res) {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'user-101';
    const stats = await storageService.getStatistics(userId);
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load statistics' });
  }
}

module.exports = {
  handleGetHistory,
  handleDeleteHistoryItem,
  handleClearHistory,
  handleGetStatistics
};
