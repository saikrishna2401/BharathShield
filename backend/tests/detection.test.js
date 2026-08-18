/**
 * Automated Detection Unit Tests for PhishGuard Engine
 * Evaluates Language Detector, Text Normalizer, URL Analyzer, Context False-Positive Guard, and Master Detection API.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const { detectLanguage } = require('../detection/languageDetector');
const { normalizeText } = require('../detection/textNormalizer');
const { analyzeUrls } = require('../detection/urlAnalyzer');
const { analyzeContext } = require('../detection/contextAnalyzer');
const { analyzeKeywords } = require('../detection/keywordAnalyzer');
const { analyzeSMS } = require('../detection/phishingDetector');

test('LanguageDetector - Identifies Telugu, Hindi, Tamil, English & Code-Mixed Text', () => {
  const enRes = detectLanguage('Your bank account alert');
  assert.equal(enRes.primary, 'en');

  const teRes = detectLanguage('మీ బ్యాంక్ ఖాతా ఈరోజు బ్లాక్ అవుతుంది');
  assert.equal(teRes.primary, 'te');

  const hiRes = detectLanguage('आपका बैंक खाता बंद हो जाएगा');
  assert.equal(hiRes.primary, 'hi');

  const taRes = detectLanguage('உங்கள் வங்கி கணக்கு முடக்கப்படும்');
  assert.equal(taRes.primary, 'ta');

  const mixedRes = detectLanguage('మీ account block అవుతుంది. Click this link');
  assert.equal(mixedRes.type, 'code-mixed');
});

test('TextNormalizer - Cleans zero-width characters and homoglyphs', () => {
  const normRes = normalizeText('Click\u200B this link');
  assert.equal(normRes.hasZeroWidthChars, true);
  assert.equal(normRes.cleanText, 'Click this link');
});

test('UrlAnalyzer - Detects Shorteners, IP links, and Suspicious TLDs', () => {
  const urlRes = analyzeUrls('Visit http://192.168.1.1/login or http://bit.ly/test or http://sbi-kyc.xyz');
  assert.equal(urlRes.hasUrl, true);
  assert.equal(urlRes.urls.length, 3);
  assert.ok(urlRes.urls.some(u => u.isIp));
  assert.ok(urlRes.urls.some(u => u.isShortener));
  assert.ok(urlRes.urls.some(u => u.isSuspiciousTld));
});

test('ContextAnalyzer - Protects Legitimate OTP Messages (False Positive Guard)', () => {
  const keywords = analyzeKeywords('Your OTP is 483921. Do not share this OTP with anyone.');
  const urls = analyzeUrls('Your OTP is 483921. Do not share this OTP with anyone.');
  const ctx = analyzeContext('Your OTP is 483921. Do not share this OTP with anyone.', keywords, urls);

  assert.equal(ctx.isTransactional, true);
  assert.ok(ctx.scoreAdjustment < 0, 'Risk score should be reduced for safe OTP with disclaimer');
});

test('PhishingDetector Master API - Classifies Safe OTP vs Phishing Link correctly', async () => {
  const safeRes = await analyzeSMS({
    message: 'Your OTP for login is 483921. Do not share this OTP with anyone.',
    sender: 'VK-SBIINB'
  });
  assert.equal(safeRes.riskLevel, 'SAFE');
  assert.ok(safeRes.riskScore < 30);

  const phishRes = await analyzeSMS({
    message: 'Congratulations! You won ₹25,00,000 lottery. Click link immediately to verify KYC: http://sbi-kyc.xyz',
    sender: '9876543210'
  });
  assert.equal(phishRes.riskLevel, 'PHISHING');
  assert.ok(phishRes.riskScore >= 60);
  assert.ok(phishRes.signals.length > 0);
});
