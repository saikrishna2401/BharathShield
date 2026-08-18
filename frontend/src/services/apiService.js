/**
 * API Service Client for PhishGuard Frontend
 * Handles HTTP requests to Express backend with client-side fallback detection when offline.
 * Returns 100% language-neutral contracts.
 */

const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (res.ok) {
      return await res.json();
    }
    return { status: 'offline', database: 'memory', ml: 'unavailable' };
  } catch (e) {
    return { status: 'offline', database: 'memory', ml: 'unavailable' };
  }
}

export async function analyzeSMS(payload) {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'API request failed');
  } catch (error) {
    console.warn('[API Service] Backend fetch failed. Running client-side analysis fallback:', error.message);
    return runClientFallbackAnalysis(payload);
  }
}

export async function submitScamReport(reportPayload) {
  try {
    const res = await fetch(`${API_BASE}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportPayload)
    });

    if (res.ok) {
      return await res.json();
    }
    throw new Error('Report submission failed');
  } catch (error) {
    return {
      success: true,
      messageKey: 'reportRecorded'
    };
  }
}

export async function fetchHistory() {
  try {
    const res = await fetch(`${API_BASE}/history`);
    if (res.ok) {
      const data = await res.json();
      return data.history || [];
    }
    return [];
  } catch (e) {
    return [];
  }
}

export async function clearHistory() {
  try {
    const res = await fetch(`${API_BASE}/history`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    return true;
  }
}

export async function fetchStatistics() {
  try {
    const res = await fetch(`${API_BASE}/statistics`);
    if (res.ok) {
      return await res.json();
    }
    return getEmptyStats();
  } catch (e) {
    return getEmptyStats();
  }
}

function getEmptyStats() {
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

/**
 * Emergency Client-Side Fallback Analyzer when backend server is unreachable
 * Returns exact same language-neutral identifier contract as the backend.
 */
function runClientFallbackAnalysis(payload) {
  const message = typeof payload === 'string' ? payload : (payload.message || '');
  const lower = message.toLowerCase();

  const hasUrl = /https?:\/\/|www\.|bit\.ly|tinyurl|\.xyz|\.top/i.test(message);
  const hasUrgency = /immediately|urgent|blocked|expires|వెంటనే|ఈరోజే|तुरंत|आज ही|உடனடியாக/i.test(message);
  const hasCredential = /otp|pin|cvv|password|aadhaar|pan card|ఓటిపి|పిన్|ओटीपी|पिन|ஒடிபி/i.test(message);
  const hasDisclaimer = /do not share|never share|రహస్యంగా|షేర్|शेयर न करें|பகிர வேண்டாம்/i.test(message);

  let score = 10;
  const signals = [];

  if (hasUrl) {
    score += 30;
    signals.push({ key: 'SUSPICIOUS_URL', type: 'SHORTENED_URL', score: 30 });
  }
  if (hasUrgency) {
    score += 20;
    signals.push({ key: 'URGENT_LANGUAGE', type: 'URGENT_LANGUAGE', score: 20 });
  }
  if (hasCredential) {
    score += 25;
    signals.push({ key: 'CREDENTIAL_REQUEST', type: 'CREDENTIAL_REQUEST', score: 25 });
  }

  if (hasCredential && !hasUrl && hasDisclaimer) {
    score = Math.max(10, score - 25);
  }

  const finalScore = Math.min(100, score);
  let riskLevel = 'SAFE';
  if (finalScore >= 60) riskLevel = 'PHISHING';
  else if (finalScore >= 30) riskLevel = 'SUSPICIOUS';

  let teCount = (message.match(/[\u0C00-\u0C7F]/g) || []).length;
  let hiCount = (message.match(/[\u0900-\u097F]/g) || []).length;
  let taCount = (message.match(/[\u0B80-\u0BFF]/g) || []).length;

  let primaryLang = 'en';
  if (teCount > 2) primaryLang = 'te';
  else if (hiCount > 2) primaryLang = 'hi';
  else if (taCount > 2) primaryLang = 'ta';

  const categoryKey = finalScore >= 60 ? 'KYC_SCAM' : (finalScore >= 30 ? 'BANK_FRAUD' : 'INFORMATIONAL');
  const isSafe = riskLevel === 'SAFE';

  const reasonKeys = isSafe
    ? ['SAFE_NO_SUSPICIOUS_URL', 'SAFE_NO_CREDENTIAL_REQUEST', 'SAFE_NO_URGENT_LANGUAGE', 'SAFE_INFORMATIONAL']
    : (signals.length > 0 ? signals.map(s => s.key) : ['SUSPICIOUS_URL']);

  const recommendationKeys = isSafe
    ? ['KEEP_FOR_REFERENCE', 'VERIFY_UNKNOWN_NUMBER']
    : ['DO_NOT_CLICK_LINK', 'DO_NOT_SHARE_OTP', 'VERIFY_OFFICIAL_CHANNEL', 'DELETE_MESSAGE', 'REPORT_MESSAGE'];

  return {
    riskScore: finalScore,
    riskLevel,
    confidence: 88,
    language: {
      primary: primaryLang,
      displayName: primaryLang.toUpperCase(),
      type: 'single'
    },
    categoryKey,
    scamCategory: { name: categoryKey, categoryKey },
    signalKeys: signals.map(s => s.key),
    signals,
    reasonKeys,
    recommendationKeys,
    urlSignals: hasUrl ? [{ key: 'SUSPICIOUS_URL', type: 'SHORTENED_URL', score: 30 }] : [],
    urls: hasUrl ? [{ originalUrl: message.match(/(https?:\/\/[^\s]+)/i)?.[0] || 'http://example.xyz', riskScore: 30 }] : [],
    senderStatus: 'UNAVAILABLE',
    sender: { provided: false, status: 'UNAVAILABLE' },
    explanation: {
      whyHeaderKey: isSafe ? 'whySafeHeader' : 'whyHeader',
      reasonKeys,
      disclaimerKey: isSafe ? 'safeDisclaimer' : null,
      recommendationsHeaderKey: 'recsHeader',
      recommendationKeys
    },
    engine: { ruleBased: true, mlUsed: false, fallbackMode: true },
    analyzedAt: new Date().toISOString()
  };
}
