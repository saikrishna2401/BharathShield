/**
 * Family Circle Controller for BharathShield
 */

const storageService = require('../services/storageService');

async function handleGetFamily(req, res) {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'user-101';
    const members = await storageService.getFamilyMembers(userId);
    const alerts = await storageService.getFamilyAlerts(userId);

    return res.status(200).json({
      success: true,
      members,
      alerts,
      protectedCount: members.filter(m => m.protectionStatus === 'PROTECTED').length,
      totalCount: members.length
    });
  } catch (error) {
    console.error('[Family API Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch family members.' });
  }
}

async function handleAddFamily(req, res) {
  try {
    const userId = req.body.userId || req.headers['x-user-id'] || 'user-101';
    const { name, relationship, phone } = req.body || {};

    if (!name) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Family member name is required.' });
    }

    const member = await storageService.addFamilyMember({ name, relationship, phone }, userId);
    return res.status(201).json({ success: true, member });
  } catch (error) {
    console.error('[Add Family API Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to add family member.' });
  }
}

async function handleRemoveFamily(req, res) {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'user-101';
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Family member ID is required.' });
    }

    await storageService.removeFamilyMember(id, userId);
    return res.status(200).json({ success: true, message: 'Family member removed.' });
  } catch (error) {
    console.error('[Remove Family API Error]:', error);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove family member.' });
  }
}

module.exports = {
  handleGetFamily,
  handleAddFamily,
  handleRemoveFamily
};
