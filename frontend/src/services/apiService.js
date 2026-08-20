/**
 * API Service Client for BharathShield Frontend
 * Handles HTTP requests to Express backend with client-side fallback detection when offline.
 * Supports user scoping (X-User-Id), Quick Scan vectors, Family Circle, and Notifications.
 */

const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (res.ok) {
      return await res.json();
    }
    return { status: 'offline', database: 'local_file', ml: 'unavailable' };
  } catch (e) {
    return { status: 'offline', database: 'local_file', ml: 'unavailable' };
  }
}

export async function analyzeSMS(payload, userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify({ ...payload, userId })
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

export async function runQuickScan(payload, userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/quick-scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify({ ...payload, userId })
    });

    if (res.ok) {
      return await res.json();
    }
    throw new Error('Quick scan request failed');
  } catch (e) {
    return runClientFallbackAnalysis(payload);
  }
}

export async function submitScamReport(reportPayload, userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify({ ...reportPayload, userId })
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

export async function fetchHistory(userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/history?userId=${encodeURIComponent(userId)}`, {
      headers: { 'X-User-Id': userId }
    });
    if (res.ok) {
      const data = await res.json();
      return data.history || [];
    }
    return [];
  } catch (e) {
    return [];
  }
}

export async function clearHistory(userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/history?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': userId }
    });
    return res.ok;
  } catch (e) {
    return true;
  }
}

export async function fetchStatistics(userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/statistics?userId=${encodeURIComponent(userId)}`, {
      headers: { 'X-User-Id': userId }
    });
    if (res.ok) {
      return await res.json();
    }
    return getEmptyStats();
  } catch (e) {
    return getEmptyStats();
  }
}

// --- FAMILY CIRCLE API CLIENT ---
export async function fetchFamilyMembers(userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/family?userId=${encodeURIComponent(userId)}`, {
      headers: { 'X-User-Id': userId }
    });
    if (res.ok) {
      return await res.json();
    }
    return { success: true, members: [], alerts: [], protectedCount: 0, totalCount: 0 };
  } catch (e) {
    return { success: true, members: [], alerts: [], protectedCount: 0, totalCount: 0 };
  }
}

export async function addFamilyMember(memberData, userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/family`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify({ ...memberData, userId })
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error('Failed to add family member');
  } catch (e) {
    return { success: false, message: e.message };
  }
}

export async function removeFamilyMember(id, userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/family/${id}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': userId }
    });
    return res.ok;
  } catch (e) {
    return true;
  }
}

// --- NOTIFICATIONS API CLIENT ---
export async function fetchNotifications(userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/notifications?userId=${encodeURIComponent(userId)}`, {
      headers: { 'X-User-Id': userId }
    });
    if (res.ok) {
      return await res.json();
    }
    return { notifications: [], unreadCount: 0 };
  } catch (e) {
    return { notifications: [], unreadCount: 0 };
  }
}

export async function markNotificationsRead(userId = 'user-101') {
  try {
    const res = await fetch(`${API_BASE}/notifications/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      },
      body: JSON.stringify({ userId })
    });
    return res.ok;
  } catch (e) {
    return true;
  }
}

function getEmptyStats() {
  return {
    totalAnalyzed: 0,
    safeCount: 0,
    suspiciousCount: 0,
    phishingCount: 0,
    shieldScore: 100,
    environmentThreatIndex: 72,
    averageRiskScore: 0,
    mostCommonScamKey: 'INFORMATIONAL',
    mostDetectedLanguageKey: 'te',
    languageDistribution: { en: 0, te: 0, hi: 0, ta: 0 },
    riskDistribution: { safe: 0, suspicious: 0, phishing: 0 }
  };
}

/**
 * Emergency Client-Side Fallback Analyzer when backend server is unreachable
 */
function runClientFallbackAnalysis(payload) {
  const input = typeof payload === 'string' ? payload : (payload.inputData || payload.message || '');
  const lower = input.toLowerCase();

  const hasUrl = /https?:\/\/|www\.|bit\.ly|tinyurl|\.xyz|\.top/i.test(input);
  const hasUrgency = /immediately|urgent|blocked|expires|వెంటనే|ఈరోజే|तुरंत|आज ही|உடனடியாக/i.test(input);
  const hasCredential = /otp|pin|cvv|password|aadhaar|pan card|ఓటిపి|పిన్|ओटीपी|पिन|ஒடிபி/i.test(input);
  const hasDisclaimer = /do not share|never share|రహస్యంగా|షేర్|शेयर न करें|பகிர வேண்டாம்/i.test(input);

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

  let teCount = (input.match(/[\u0C00-\u0C7F]/g) || []).length;
  let hiCount = (input.match(/[\u0900-\u097F]/g) || []).length;
  let taCount = (input.match(/[\u0B80-\u0BFF]/g) || []).length;

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
    urls: hasUrl ? [{ originalUrl: input.match(/(https?:\/\/[^\s]+)/i)?.[0] || 'http://example.xyz', riskScore: 30 }] : [],
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
