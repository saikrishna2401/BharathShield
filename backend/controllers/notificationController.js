/**
 * Notification Controller for BharathShield
 */

const storageService = require('../services/storageService');

async function handleGetNotifications(req, res) {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'user-101';
    const notifications = await storageService.getNotifications(userId);
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('[Notification API Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch notifications.' });
  }
}

async function handleMarkNotificationsRead(req, res) {
  try {
    const userId = req.body.userId || req.headers['x-user-id'] || 'user-101';
    await storageService.markNotificationsRead(userId);
    return res.status(200).json({ success: true, message: 'Notifications marked as read.' });
  } catch (error) {
    console.error('[Mark Notification API Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to update notifications.' });
  }
}

module.exports = {
  handleGetNotifications,
  handleMarkNotificationsRead
};
