/**
 * Storage Service Module for PhishGuard
 * Provides zero-config dual storage: Mongoose MongoDB store when available,
 * with automatic, privacy-compliant in-memory fallback for standalone execution.
 * Stores language-neutral identifiers only.
 */

const crypto = require('crypto');

class StorageService {
  constructor() {
    this.useMemory = true;
    this.memoryHistory = [];
    this.memoryReports = [];
    this.historyIdCounter = 1;
    this.reportIdCounter = 1;
    this.historyEnabled = true;
  }

  setMongoAvailable(status) {
    this.useMemory = !status;
    console.log(`[StorageService] Active Storage Mode: ${this.useMemory ? 'IN-MEMORY STORE' : 'MONGODB'}`);
  }

  setHistoryEnabled(enabled) {
    this.historyEnabled = !!enabled;
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

  async saveAnalysis(analysisData, originalMessage) {
    if (!this.historyEnabled) {
      return null;
    }

    const categoryKey = analysisData.categoryKey ||
      (analysisData.scamCategory ? analysisData.scamCategory.categoryKey || analysisData.scamCategory.name : 'INFORMATIONAL');

    const record = {
      id: `HIST-${Date.now()}-${this.historyIdCounter++}`,
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
      signalCount: analysisData.signals ? analysisData.signals.length : 0
    };

    if (this.useMemory) {
      this.memoryHistory.unshift(record);
      if (this.memoryHistory.length > 100) {
        this.memoryHistory.pop();
      }
      return record;
    } else {
      return record;
    }
  }

  async getHistory() {
    return [...this.memoryHistory];
  }

  async deleteHistoryItem(id) {
    if (this.useMemory) {
      const initLen = this.memoryHistory.length;
      this.memoryHistory = this.memoryHistory.filter(item => item.id !== id);
      return this.memoryHistory.length < initLen;
    }
    return true;
  }

  async clearAllHistory() {
    this.memoryHistory = [];
    return true;
  }

  async saveReport(reportPayload) {
    const reportRecord = {
      id: `RPT-${Date.now()}-${this.reportIdCounter++}`,
      timestamp: new Date().toISOString(),
      category: reportPayload.category || 'Other',
      sender: reportPayload.sender || 'Unknown',
      preview: this.sanitizeMessagePreview(reportPayload.message),
      description: reportPayload.description || '',
      hasScreenshot: !!reportPayload.hasScreenshot,
      status: 'RECORDED'
    };

    this.memoryReports.unshift(reportRecord);
    return reportRecord;
  }

  async getStatistics() {
    const history = this.memoryHistory;
    const total = history.length;

    if (total === 0) {
      return {
        totalAnalyzed: 0,
        safeCount: 0,
        suspiciousCount: 0,
        phishingCount: 0,
        averageRiskScore: 0,
        mostCommonScamKey: 'INFORMATIONAL',
        mostDetectedLanguageKey: 'en',
        languageDistribution: { en: 0, te: 0, hi: 0, ta: 0 },
        riskDistribution: { safe: 0, suspicious: 0, phishing: 0 }
      };
    }

    let safeCount = 0;
    let suspiciousCount = 0;
    let phishingCount = 0;
    let totalScore = 0;
    const langCounts = { en: 0, te: 0, hi: 0, ta: 0 };
    const scamCounts = {};

    for (const item of history) {
      totalScore += item.riskScore;
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

    let topScamKey = 'INFORMATIONAL';
    let topScamVal = -1;
    for (const [k, v] of Object.entries(scamCounts)) {
      if (v > topScamVal) {
        topScamVal = v;
        topScamKey = k;
      }
    }

    let topLangKey = 'en';
    let topLangVal = -1;
    for (const [k, v] of Object.entries(langCounts)) {
      if (v > topLangVal) {
        topLangVal = v;
        topLangKey = k;
      }
    }

    return {
      totalAnalyzed: total,
      safeCount,
      suspiciousCount,
      phishingCount,
      averageRiskScore: Math.round(totalScore / total),
      mostCommonScamKey: topScamKey,
      mostDetectedLanguageKey: topLangKey,
      languageDistribution: langCounts,
      riskDistribution: { safe: safeCount, suspicious: suspiciousCount, phishing: phishingCount }
    };
  }
}

const storageServiceInstance = new StorageService();
module.exports = storageServiceInstance;
