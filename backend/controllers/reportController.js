/**
 * Scam Report Controller for BharathShield
 * Supports User submissions & Admin report management
 */

const storageService = require('../services/storageService');

async function handleReport(req, res) {
  try {
    const userId = req.body.userId || req.headers['x-user-id'] || 'user';
    const { categoryKey, sender, message, description } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Report payload must include non-empty "message" content.'
      });
    }

    const reportRecord = await storageService.saveReport({
      categoryKey,
      sender,
      message,
      description
    }, userId);

    return res.status(201).json({
      success: true,
      messageKey: 'reportRecorded',
      report: reportRecord
    });
  } catch (error) {
    console.error('[Report API Error]:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to record scam report.'
    });
  }
}

async function handleGetAllReports(req, res) {
  try {
    const reports = await storageService.getAllReports();
    return res.status(200).json({
      success: true,
      reports,
      count: reports.length,
      newCount: reports.filter(r => r.status === 'NEW').length
    });
  } catch (error) {
    console.error('[Get Reports Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch reports for admin.' });
  }
}

async function handleUpdateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!status) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'New status is required.' });
    }

    const updated = await storageService.updateReportStatus(id, status);
    if (updated) {
      return res.status(200).json({ success: true, report: updated });
    }
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Report not found.' });
  } catch (error) {
    console.error('[Update Report Status Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to update report status.' });
  }
}

async function handleDeleteReport(req, res) {
  try {
    const { id } = req.params;
    await storageService.deleteReport(id);
    return res.status(200).json({ success: true, message: `Report ${id} deleted.` });
  } catch (error) {
    console.error('[Delete Report Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete report.' });
  }
}

module.exports = {
  handleReport,
  handleGetAllReports,
  handleUpdateReportStatus,
  handleDeleteReport
};
