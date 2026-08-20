/**
 * Quick Scan Vector Detection Module for BharathShield
 * Evaluates 6 specialized threat vectors:
 * 1. SMS (Multi-stage text & payload inspection)
 * 2. URL (Domain, IP link, shorteners, HTTP, brand typosquatting)
 * 3. Phone Number (Commercial headers vs 10-digit mobile impersonations)
 * 4. UPI ID (Impersonation handles, fraudulent collection triggers)
 * 5. APK / File (App installer safety & side-loading risks)
 * 6. Screenshot (OCR text extraction & threat classification)
 */

const { analyzeSMS } = require('./phishingDetector');
const { analyzeUrls } = require('./urlAnalyzer');
const { analyzeSender } = require('./senderAnalyzer');

async function processQuickScan(payload) {
  const { vector = 'sms', inputData = '', sender = '', language = 'auto', ocrText = '' } = payload || {};

  const cleanInput = (typeof inputData === 'string' ? inputData : '').trim();

  // Vector 1: Standard SMS
  if (vector === 'sms') {
    const res = await analyzeSMS({ message: cleanInput, sender, language });
    return { ...res, vector: 'sms' };
  }

  // Vector 2: URL Analysis
  if (vector === 'url') {
    const urlPayload = cleanInput.startsWith('http') ? cleanInput : `http://${cleanInput}`;
    const res = await analyzeSMS({ message: `Check link: ${urlPayload}`, sender: 'WEB-SCAN', language });
    return {
      ...res,
      vector: 'url',
      scanTarget: urlPayload
    };
  }

  // Vector 3: Phone Number Inspection
  if (vector === 'phone') {
    const senderRes = analyzeSender(cleanInput, '');
    let riskScore = 10;
    let riskLevel = 'SAFE';
    const reasonKeys = [];

    if (senderRes.status === 'PERSONAL_NUMBER_IMPERSONATION') {
      riskScore = 75;
      riskLevel = 'PHISHING';
      reasonKeys.push('PERSONAL_SENDER_IMPERSONATION');
    } else if (senderRes.status === 'INTERNATIONAL_ANOMALY') {
      riskScore = 60;
      riskLevel = 'SUSPICIOUS';
      reasonKeys.push('INTERNATIONAL_SENDER');
    } else if (senderRes.status === 'SUSPICIOUS_HEADER') {
      riskScore = 50;
      riskLevel = 'SUSPICIOUS';
      reasonKeys.push('MALFORMED_SENDER');
    } else {
      reasonKeys.push('SAFE_INFORMATIONAL');
    }

    return {
      vector: 'phone',
      scanTarget: cleanInput,
      riskScore,
      riskLevel,
      confidence: 92,
      senderStatus: senderRes.status,
      sender: senderRes,
      categoryKey: riskScore >= 70 ? 'BANK_FRAUD' : 'INFORMATIONAL',
      reasonKeys,
      recommendationKeys: riskScore >= 50
        ? ['DO_NOT_SHARE_OTP', 'VERIFY_OFFICIAL_CHANNEL', 'REPORT_MESSAGE']
        : ['KEEP_FOR_REFERENCE', 'VERIFY_UNKNOWN_NUMBER'],
      analyzedAt: new Date().toISOString()
    };
  }

  // Vector 4: UPI ID Reputation Check
  if (vector === 'upi') {
    const upiHandle = cleanInput.toLowerCase();
    const isSuspiciousHandle = /refund|cashback|customer|support|verify|kyc|sbi-help|ybl-pay/i.test(upiHandle);
    const riskScore = isSuspiciousHandle ? 80 : 15;
    const riskLevel = isSuspiciousHandle ? 'PHISHING' : 'SAFE';

    return {
      vector: 'upi',
      scanTarget: cleanInput,
      riskScore,
      riskLevel,
      confidence: 90,
      categoryKey: isSuspiciousHandle ? 'UPI_SCAM' : 'INFORMATIONAL',
      reasonKeys: isSuspiciousHandle
        ? ['AUTHORITY_CLAIM', 'FINANCIAL', 'ACTION_COERCION']
        : ['SAFE_NO_CREDENTIAL_REQUEST', 'SAFE_INFORMATIONAL'],
      recommendationKeys: isSuspiciousHandle
        ? ['DO_NOT_SHARE_OTP', 'DO_NOT_CLICK_LINK', 'REPORT_MESSAGE']
        : ['KEEP_FOR_REFERENCE'],
      analyzedAt: new Date().toISOString()
    };
  }

  // Vector 5: APK / File Installer Inspection
  if (vector === 'apk') {
    const filename = cleanInput.toLowerCase();
    const isApk = filename.endsWith('.apk') || filename.includes('anydesk') || filename.includes('quicksupport') || filename.includes('teamviewer');
    const riskScore = isApk ? 85 : 20;
    const riskLevel = isApk ? 'PHISHING' : 'SAFE';

    return {
      vector: 'apk',
      scanTarget: cleanInput,
      riskScore,
      riskLevel,
      confidence: 95,
      categoryKey: isApk ? 'OTP_SCAM' : 'INFORMATIONAL',
      reasonKeys: isApk
        ? ['CREDENTIAL_REQS', 'ACTION_COERCION', 'SUSPICIOUS_URL']
        : ['SAFE_INFORMATIONAL'],
      recommendationKeys: isApk
        ? ['DELETE_MESSAGE', 'DO_NOT_CLICK_LINK', 'REPORT_MESSAGE']
        : ['KEEP_FOR_REFERENCE'],
      analyzedAt: new Date().toISOString()
    };
  }

  // Vector 6: Screenshot OCR Text Extraction
  if (vector === 'screenshot') {
    const extractedMessage = ocrText || cleanInput || 'Sample extracted screenshot message';
    const res = await analyzeSMS({ message: extractedMessage, sender, language });
    return {
      ...res,
      vector: 'screenshot',
      ocrExtractedText: extractedMessage
    };
  }

  // Default fallback
  const res = await analyzeSMS({ message: cleanInput, sender, language });
  return { ...res, vector: 'sms' };
}

module.exports = {
  processQuickScan
};
