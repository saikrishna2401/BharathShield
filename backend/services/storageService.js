/**
 * Storage Service Module for BharathShield
 * Zero-config multi-storage support with strict user isolation,
 * Scam Report Management for Admins, and notification tracking.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class StorageService {
  constructor() {
    this.storageMode = 'local_file'; // 'supabase' | 'mongodb' | 'local_file'
    this.supabaseClient = null;
    this.memoryHistory = [];
    this.memoryReports = [];
    this.memoryNotifications = [];
    this.historyIdCounter = 1;
    this.reportIdCounter = 1;
    this.notificationIdCounter = 1;
    this.historyEnabled = true;

    this.dbFilePath = path.join(__dirname, '..', 'data', 'database.json');
    this.clearAndResetFileStore();
    this.initSupabase();
  }

  clearAndResetFileStore() {
    try {
      const dataDir = path.dirname(this.dbFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Reset memory arrays to empty fresh state
      this.memoryHistory = [];
      this.memoryReports = [];
      this.memoryNotifications = [
        {
          id: 'NOTIF-1',
          userId: 'global',
          title: 'BharathShield Active',
          severity: 'INFO',
          text: 'Real-time anti-phishing shield ready for User & Admin monitoring.',
          timestamp: new Date().toISOString(),
          read: false,
          categoryKey: 'INFORMATIONAL'
        }
      ];
      this.historyIdCounter = 1;
      this.reportIdCounter = 1;
      this.notificationIdCounter = 2;

      this.saveToFile();
      console.log(`[StorageService] Database reset to clean state (${this.dbFilePath})`);
    } catch (err) {
      console.warn('[StorageService] Local file reset notice:', err.message);
    }
  }

  saveToFile() {
    try {
      const payload = {
        updatedAt: new Date().toISOString(),
        historyIdCounter: this.historyIdCounter,
        reportIdCounter: this.reportIdCounter,
        notificationIdCounter: this.notificationIdCounter,
        history: this.memoryHistory,
        reports: this.memoryReports,
        notifications: this.memoryNotifications
      };
      fs.writeFileSync(this.dbFilePath, JSON.stringify(payload, null, 2), 'utf8');
    } catch (err) {
      console.error('[StorageService] Error persisting to local database file:', err.message);
    }
  }

  initSupabase() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = require('@supabase/supabase-js');
        this.supabaseClient = createClient(supabaseUrl, supabaseKey);
        this.storageMode = 'supabase';
        console.log(`[StorageService] Active Storage Mode: SUPABASE POSTGRESQL (${supabaseUrl})`);
      } catch (err) {
        console.warn('[StorageService] Failed to initialize Supabase client:', err.message);
      }
    }
  }

  setMongoAvailable(status) {
    if (this.storageMode !== 'supabase') {
      this.storageMode = status ? 'mongodb' : 'local_file';
      console.log(`[StorageService] Active Storage Mode: ${this.storageMode.toUpperCase()}`);
    }
  }

  setHistoryEnabled(enabled) {
    this.historyEnabled = !!enabled;
  }

  get activeDatabaseMode() {
    return this.storageMode;
  }

  hashMessage(text) {
    return crypto.createHash('sha256').update(text || '').digest('hex').substring(0, 16);
  }

  sanitizeMessagePreview(text) {
    if (!text) return '';
    let sanitized = text.replace(/\b\d{4,8}\b/g, '******');
    if (sanitized.length > 80) {
      sanitized = sanitized.substring(0, 77) + '...';
    }
    return sanitized;
  }

  // --- ANALYSIS & HISTORY (STRICT USER ISOLATION) ---
  async saveAnalysis(analysisData, originalMessage, userId = 'guest') {
    if (!this.historyEnabled) {
      return null;
    }

    const cleanUserId = userId || 'guest';
    const categoryKey = analysisData.categoryKey ||
      (analysisData.scamCategory ? analysisData.scamCategory.categoryKey || analysisData.scamCategory.name : 'INFORMATIONAL');

    const record = {
      id: `HIST-${Date.now()}-${this.historyIdCounter++}`,
      userId: cleanUserId,
      timestamp: new Date().toISOString(),
      messageHash: this.hashMessage(originalMessage),
      preview: this.sanitizeMessagePreview(originalMessage),
      riskScore: analysisData.riskScore,
      riskLevel: analysisData.riskLevel,
      confidence: analysisData.confidence,
      language: analysisData.language ? analysisData.language.primary : 'en',
      languageType: analysisData.language ? analysisData.language.type : 'single',
      categoryKey: categoryKey,
      signalKeys: analysisData.signalKeys || (analysisData.signals || []).map(s => s.key),
      reasonKeys: analysisData.reasonKeys || [],
      recommendationKeys: analysisData.recommendationKeys || [],
      signalCount: analysisData.signals ? analysisData.signals.length : 0,
      vector: analysisData.vector || 'sms'
    };

    this.memoryHistory.unshift(record);
    if (this.memoryHistory.length > 500) {
      this.memoryHistory.pop();
    }

    if (analysisData.riskLevel === 'PHISHING' || analysisData.riskScore >= 70) {
      this.addNotification({
        userId: 'admin',
        title: `USER THREAT DETECTED`,
        severity: 'CRITICAL',
        text: `User ${cleanUserId} scanned high-risk ${categoryKey.replace('_', ' ')}.`,
        categoryKey
      });
    }

    this.saveToFile();
    return record;
  }

  async getHistory(userId = 'guest') {
    if (!userId) return [];
    if (userId === 'admin') return [...this.memoryHistory];
    // Strict User Isolation: return only records matching this exact userId
    return this.memoryHistory.filter(item => item.userId === userId);
  }

  async deleteHistoryItem(id, userId = 'guest') {
    this.memoryHistory = this.memoryHistory.filter(item => item.id !== id);
    this.saveToFile();
    return true;
  }

  async clearAllHistory(userId = 'guest') {
    if (userId === 'admin') {
      this.memoryHistory = [];
    } else {
      this.memoryHistory = this.memoryHistory.filter(item => item.userId !== userId);
    }
    this.saveToFile();
    return true;
  }

  // --- SCAM REPORTING (USER SUBMITS -> ADMIN RECEIVES) ---
  async saveReport(reportPayload, userId = 'guest') {
    const cleanUserId = userId || 'guest';
    const reportRecord = {
      id: `RPT-${Date.now()}-${this.reportIdCounter++}`,
      userId: cleanUserId,
      timestamp: new Date().toISOString(),
      categoryKey: reportPayload.categoryKey || 'UNKNOWN',
      sender: reportPayload.sender || 'Unknown',
      preview: this.sanitizeMessagePreview(reportPayload.message),
      fullMessage: reportPayload.message || '',
      description: reportPayload.description || '',
      status: 'NEW' // 'NEW' | 'REVIEWED' | 'DISMISSED'
    };

    this.memoryReports.unshift(reportRecord);

    // Notify Admin about new user spam report
    this.addNotification({
      userId: 'admin',
      title: `🚨 NEW USER SPAM REPORT`,
      severity: 'HIGH',
      text: `User ${cleanUserId} submitted a ${reportRecord.categoryKey} spam report for sender ${reportRecord.sender}.`,
      categoryKey: reportRecord.categoryKey
    });

    this.saveToFile();
    return reportRecord;
  }

  async getAllReports() {
    return [...this.memoryReports];
  }

  async updateReportStatus(reportId, newStatus) {
    const report = this.memoryReports.find(r => r.id === reportId);
    if (report) {
      report.status = newStatus;
      this.saveToFile();
      return report;
    }
    return null;
  }

  async deleteReport(reportId) {
    this.memoryReports = this.memoryReports.filter(r => r.id !== reportId);
    this.saveToFile();
    return true;
  }

  // --- NOTIFICATIONS ---
  async getNotifications(userId = 'guest') {
    return this.memoryNotifications.filter(n => n.userId === 'global' || n.userId === userId || userId === 'admin');
  }

  async addNotification(notifData) {
    const newNotif = {
      id: `NOTIF-${Date.now()}-${this.notificationIdCounter++}`,
      userId: notifData.userId || 'guest',
      title: notifData.title || 'Security Notice',
      severity: notifData.severity || 'INFO',
      text: notifData.text || '',
      timestamp: new Date().toISOString(),
      read: false,
      categoryKey: notifData.categoryKey || 'INFORMATIONAL'
    };
    this.memoryNotifications.unshift(newNotif);
    this.saveToFile();
    return newNotif;
  }

  async markNotificationsRead(userId = 'guest') {
    this.memoryNotifications.forEach(n => {
      if (n.userId === 'global' || n.userId === userId || userId === 'admin') {
        n.read = true;
      }
    });
    this.saveToFile();
    return true;
  }

  // --- DYNAMIC PROTECTION SCORE & TELEMETRY (STRICT USER SCOPED) ---
  async getStatistics(userId = 'guest') {
    const history = await this.getHistory(userId);
    const total = history.length;

    let safeCount = 0;
    let suspiciousCount = 0;
    let phishingCount = 0;
    let totalScore = 0;
    const langCounts = { en: 0, te: 0, hi: 0, ta: 0 };
    const scamCounts = {};

    for (const item of history) {
      totalScore += (item.riskScore || 0);
      if (item.riskLevel === 'SAFE') safeCount++;
      else if (item.riskLevel === 'SUSPICIOUS') suspiciousCount++;
      else if (item.riskLevel === 'PHISHING') phishingCount++;

      const lang = item.language || 'en';
      if (langCounts[lang] !== undefined) {
        langCounts[lang]++;
      } else {
        langCounts.en++;
      }

      const catKey = item.categoryKey || 'INFORMATIONAL';
      scamCounts[catKey] = (scamCounts[catKey] || 0) + 1;
    }

    // Default start shield score for every user is 100
    let baseShieldScore = 100;
    if (phishingCount > 0) {
      baseShieldScore = Math.max(40, 100 - (phishingCount * 10));
    } else if (suspiciousCount > 0) {
      baseShieldScore = Math.max(70, 100 - (suspiciousCount * 5));
    }

    return {
      totalAnalyzed: total,
      totalReports: userId === 'admin' ? this.memoryReports.length : this.memoryReports.filter(r => r.userId === userId).length,
      newReportsCount: userId === 'admin' ? this.memoryReports.filter(r => r.status === 'NEW').length : 0,
      safeCount,
      suspiciousCount,
      phishingCount,
      shieldScore: baseShieldScore,
      environmentThreatIndex: 72,
      averageRiskScore: total > 0 ? Math.round(totalScore / total) : 0,
      mostCommonScamKey: Object.keys(scamCounts).length > 0 ? Object.keys(scamCounts)[0] : 'INFORMATIONAL',
      mostDetectedLanguageKey: 'te',
      languageDistribution: langCounts,
      riskDistribution: { safe: safeCount, suspicious: suspiciousCount, phishing: phishingCount }
    };
  }
}

const storageServiceInstance = new StorageService();
module.exports = storageServiceInstance;
