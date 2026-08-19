/**
 * Storage Service Module for BharathShield
 * Provides zero-config multi-storage support:
 * 1. Supabase PostgreSQL Store (when SUPABASE_URL & SUPABASE_KEY environment variables are present)
 * 2. Mongoose MongoDB Store (when MONGODB_URI is connected)
 * 3. Local Persistent File Database (`backend/data/database.json` - zero-config disk storage)
 * Stores language-neutral identifiers only.
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
    this.historyIdCounter = 1;
    this.reportIdCounter = 1;
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
        this.historyIdCounter = parsed.historyIdCounter || this.memoryHistory.length + 1;
        this.reportIdCounter = parsed.reportIdCounter || this.memoryReports.length + 1;
        console.log(`[StorageService] Loaded ${this.memoryHistory.length} history items and ${this.memoryReports.length} reports from local database (${this.dbFilePath})`);
      } else {
        this.saveToFile();
      }
    } catch (err) {
      console.warn('[StorageService] Local file storage initialization notice:', err.message);
    }
  }

  saveToFile() {
    try {
      const payload = {
        updatedAt: new Date().toISOString(),
        historyIdCounter: this.historyIdCounter,
        reportIdCounter: this.reportIdCounter,
        history: this.memoryHistory,
        reports: this.memoryReports
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

    if (this.storageMode === 'supabase' && this.supabaseClient) {
      try {
        const { error } = await this.supabaseClient
          .from('bharathshield_history')
          .insert([record]);
        if (error) {
          console.warn('[Supabase Insert Error]:', error.message);
          this.memoryHistory.unshift(record);
          this.saveToFile();
        }
      } catch (e) {
        this.memoryHistory.unshift(record);
        this.saveToFile();
      }
    } else {
      this.memoryHistory.unshift(record);
      if (this.memoryHistory.length > 200) {
        this.memoryHistory.pop();
      }
      this.saveToFile();
    }

    return record;
  }

  async getHistory() {
    if (this.storageMode === 'supabase' && this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient
          .from('bharathshield_history')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);
        if (!error && Array.isArray(data)) {
          return data;
        }
      } catch (e) {
        // Fallback to local history
      }
    }
    return [...this.memoryHistory];
  }

  async deleteHistoryItem(id) {
    if (this.storageMode === 'supabase' && this.supabaseClient) {
      try {
        await this.supabaseClient
          .from('bharathshield_history')
          .delete()
          .eq('id', id);
      } catch (e) {}
    }
    this.memoryHistory = this.memoryHistory.filter(item => item.id !== id);
    this.saveToFile();
    return true;
  }

  async clearAllHistory() {
    if (this.storageMode === 'supabase' && this.supabaseClient) {
      try {
        await this.supabaseClient
          .from('bharathshield_history')
          .delete()
          .neq('id', '');
      } catch (e) {}
    }
    this.memoryHistory = [];
    this.saveToFile();
    return true;
  }

  async saveReport(reportPayload) {
    const reportRecord = {
      id: `RPT-${Date.now()}-${this.reportIdCounter++}`,
      timestamp: new Date().toISOString(),
      categoryKey: reportPayload.categoryKey || 'UNKNOWN',
      sender: reportPayload.sender || 'Unknown',
      preview: this.sanitizeMessagePreview(reportPayload.message),
      description: reportPayload.description || '',
      status: 'RECORDED'
    };

    if (this.storageMode === 'supabase' && this.supabaseClient) {
      try {
        await this.supabaseClient
          .from('bharathshield_reports')
          .insert([reportRecord]);
      } catch (e) {}
    }

    this.memoryReports.unshift(reportRecord);
    this.saveToFile();
    return reportRecord;
  }

  async getStatistics() {
    const history = await this.getHistory();
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
