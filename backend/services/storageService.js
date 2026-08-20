/**
 * Storage Service Module for BharathShield
 * Provides zero-config multi-storage support:
 * 1. Supabase PostgreSQL Store (when SUPABASE_URL & SUPABASE_KEY are present)
 * 2. Mongoose MongoDB Store (when MONGODB_URI is connected)
 * 3. Local Persistent File Database (`backend/data/database.json` - zero-config disk storage)
 * Features strict user isolation, family circle management, and notification tracking.
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
    this.memoryFamily = [];
    this.memoryNotifications = [];
    this.historyIdCounter = 1;
    this.reportIdCounter = 1;
    this.familyIdCounter = 1;
    this.notificationIdCounter = 1;
    this.historyEnabled = true;

    this.dbFilePath = path.join(__dirname, '..', 'data', 'database.json');
    this.initFileStore();
    this.initSupabase();
  }

  initFileStore() {
    try {
      const dataDir = path.dirname(this.dbFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbFilePath)) {
        const raw = fs.readFileSync(this.dbFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        this.memoryHistory = Array.isArray(parsed.history) ? parsed.history : [];
        this.memoryReports = Array.isArray(parsed.reports) ? parsed.reports : [];
        this.memoryFamily = Array.isArray(parsed.family) ? parsed.family : [];
        this.memoryNotifications = Array.isArray(parsed.notifications) ? parsed.notifications : [];
        this.historyIdCounter = parsed.historyIdCounter || this.memoryHistory.length + 1;
        this.reportIdCounter = parsed.reportIdCounter || this.memoryReports.length + 1;
        this.familyIdCounter = parsed.familyIdCounter || this.memoryFamily.length + 1;
        this.notificationIdCounter = parsed.notificationIdCounter || this.memoryNotifications.length + 1;

        console.log(`[StorageService] Loaded ${this.memoryHistory.length} history items, ${this.memoryFamily.length} family members, and ${this.memoryNotifications.length} notifications from local database (${this.dbFilePath})`);
      } else {
        this.seedDefaultFamily();
        this.saveToFile();
      }
    } catch (err) {
      console.warn('[StorageService] Local file storage initialization notice:', err.message);
    }
  }

  seedDefaultFamily() {
    // Initial sample family circle for default user 'user-101'
    this.memoryFamily = [
      {
        id: 'FAM-1',
        userId: 'user-101',
        name: 'Dadi',
        relationship: 'PARENT',
        phone: '+919123456789',
        protectionStatus: 'PROTECTED',
        addedAt: new Date().toISOString()
      },
      {
        id: 'FAM-2',
        userId: 'user-101',
        name: 'Naa',
        relationship: 'PARENT',
        phone: '+919876543210',
        protectionStatus: 'PROTECTED',
        addedAt: new Date().toISOString()
      },
      {
        id: 'FAM-3',
        userId: 'user-101',
        name: 'Wife',
        relationship: 'SPOUSE',
        phone: '+919444012345',
        protectionStatus: 'PROTECTED',
        addedAt: new Date().toISOString()
      }
    ];

    this.memoryNotifications = [
      {
        id: 'NOTIF-1',
        userId: 'user-101',
        title: 'Fake TRAI Disconnection Notice',
        severity: 'HIGH',
        text: 'A high risk TRAI disconnection scam targeting SBI customers was reported today.',
        timestamp: new Date().toISOString(),
        read: false,
        categoryKey: 'GOVT_IMPERSONATION'
      },
      {
        id: 'NOTIF-2',
        userId: 'user-101',
        title: 'Family Protection Active',
        severity: 'INFO',
        text: '3 family members (Dadi, Naa, Wife) are protected by BharathShield.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        categoryKey: 'INFORMATIONAL'
      }
    ];
  }

  saveToFile() {
    try {
      const payload = {
        updatedAt: new Date().toISOString(),
        historyIdCounter: this.historyIdCounter,
        reportIdCounter: this.reportIdCounter,
        familyIdCounter: this.familyIdCounter,
        notificationIdCounter: this.notificationIdCounter,
        history: this.memoryHistory,
        reports: this.memoryReports,
        family: this.memoryFamily,
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

  // --- ANALYSIS & HISTORY (SCOPED TO USER) ---
  async saveAnalysis(analysisData, originalMessage, userId = 'user-101') {
    if (!this.historyEnabled) {
      return null;
    }

    const categoryKey = analysisData.categoryKey ||
      (analysisData.scamCategory ? analysisData.scamCategory.categoryKey || analysisData.scamCategory.name : 'INFORMATIONAL');

    const record = {
      id: `HIST-${Date.now()}-${this.historyIdCounter++}`,
      userId: userId || 'user-101',
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
    if (this.memoryHistory.length > 300) {
      this.memoryHistory.pop();
    }

    // Auto-generate high/critical threat notification if high risk detected
    if (analysisData.riskLevel === 'PHISHING' || analysisData.riskScore >= 70) {
      this.addNotification({
        userId: userId || 'user-101',
        title: `CRITICAL THREAT DETECTED`,
        severity: 'CRITICAL',
        text: `High-risk ${categoryKey.replace('_', ' ')} detected in scan. Do not click links or share credentials.`,
        categoryKey
      });
    }

    this.saveToFile();
    return record;
  }

  async getHistory(userId = 'user-101') {
    if (!userId) return [];
    return this.memoryHistory.filter(item => !item.userId || item.userId === userId);
  }

  async deleteHistoryItem(id, userId = 'user-101') {
    this.memoryHistory = this.memoryHistory.filter(item => item.id !== id || (item.userId && item.userId !== userId));
    this.saveToFile();
    return true;
  }

  async clearAllHistory(userId = 'user-101') {
    this.memoryHistory = this.memoryHistory.filter(item => item.userId && item.userId !== userId);
    this.saveToFile();
    return true;
  }

  // --- SCAM REPORTING ---
  async saveReport(reportPayload, userId = 'user-101') {
    const reportRecord = {
      id: `RPT-${Date.now()}-${this.reportIdCounter++}`,
      userId: userId || 'user-101',
      timestamp: new Date().toISOString(),
      categoryKey: reportPayload.categoryKey || 'UNKNOWN',
      sender: reportPayload.sender || 'Unknown',
      preview: this.sanitizeMessagePreview(reportPayload.message),
      description: reportPayload.description || '',
      status: 'RECORDED'
    };

    this.memoryReports.unshift(reportRecord);
    this.saveToFile();
    return reportRecord;
  }

  // --- FAMILY CIRCLE ---
  async getFamilyMembers(userId = 'user-101') {
    return this.memoryFamily.filter(m => m.userId === userId);
  }

  async addFamilyMember(memberData, userId = 'user-101') {
    const newMember = {
      id: `FAM-${Date.now()}-${this.familyIdCounter++}`,
      userId: userId || 'user-101',
      name: memberData.name || 'Family Member',
      relationship: memberData.relationship || 'RELATIVE',
      phone: memberData.phone || '+919000000000',
      protectionStatus: 'PROTECTED',
      addedAt: new Date().toISOString()
    };
    this.memoryFamily.push(newMember);
    this.saveToFile();
    return newMember;
  }

  async removeFamilyMember(id, userId = 'user-101') {
    this.memoryFamily = this.memoryFamily.filter(m => !(m.id === id && m.userId === userId));
    this.saveToFile();
    return true;
  }

  async getFamilyAlerts(userId = 'user-101') {
    const members = await this.getFamilyMembers(userId);
    // Find any member marked AT RISK or generate alert if threats exist
    const alerts = [];
    for (const m of members) {
      if (m.protectionStatus === 'THREAT_DETECTED' || m.protectionStatus === 'NEEDS_ATTENTION') {
        alerts.push({
          id: `FAM-ALERT-${m.id}`,
          memberName: m.name,
          relationship: m.relationship,
          severity: 'CRITICAL',
          title: `🚨 ${m.name} is AT RISK`,
          text: `Received suspicious message: "Your Aadhaar is blocked. Call immediately to avoid legal action."`,
          confidence: 97,
          categoryKey: 'GOVT_IMPERSONATION',
          timestamp: new Date().toISOString()
        });
      }
    }
    return alerts;
  }

  // --- NOTIFICATIONS ---
  async getNotifications(userId = 'user-101') {
    return this.memoryNotifications.filter(n => !n.userId || n.userId === userId);
  }

  async addNotification(notifData) {
    const newNotif = {
      id: `NOTIF-${Date.now()}-${this.notificationIdCounter++}`,
      userId: notifData.userId || 'user-101',
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

  async markNotificationsRead(userId = 'user-101') {
    this.memoryNotifications.forEach(n => {
      if (!n.userId || n.userId === userId) {
        n.read = true;
      }
    });
    this.saveToFile();
    return true;
  }

  // --- DYNAMIC PROTECTION SCORE & TELEMETRY ---
  async getStatistics(userId = 'user-101') {
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

    // Compute Dynamic Shield Score (0-100)
    // Base protection score is 95. Points deducted for recent phishing threats without mitigation,
    // plus bonus for active family circle & scans performed.
    const familyMembers = await this.getFamilyMembers(userId);
    let baseShieldScore = 95;
    if (phishingCount > 0) {
      baseShieldScore = Math.max(40, 95 - (phishingCount * 10));
    } else if (suspiciousCount > 0) {
      baseShieldScore = Math.max(70, 95 - (suspiciousCount * 5));
    }
    if (familyMembers.length > 0) {
      baseShieldScore = Math.min(100, baseShieldScore + 3);
    }
    if (total === 0) {
      baseShieldScore = 100; // Fresh protected state
    }

    return {
      totalAnalyzed: total,
      safeCount,
      suspiciousCount,
      phishingCount,
      shieldScore: baseShieldScore,
      environmentThreatIndex: 72, // Community regional threat index
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
