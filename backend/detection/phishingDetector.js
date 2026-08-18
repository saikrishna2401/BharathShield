/**
 * Master Phishing Detection Engine Orchestrator for PhishGuard
 * Integrates text normalization, language detection, URL analysis, keyword matching,
 * context analysis, sender verification, risk scoring, classification, and language-neutral explainer.
 */

const { normalizeText } = require('./textNormalizer');
const { detectLanguage } = require('./languageDetector');
const { analyzeUrls } = require('./urlAnalyzer');
const { analyzeKeywords } = require('./keywordAnalyzer');
const { analyzeContext } = require('./contextAnalyzer');
const { analyzeSender } = require('./senderAnalyzer');
const { calculateRiskScore } = require('./riskScorer');
const { classifyScam } = require('./scamClassifier');
const { generateExplanation } = require('./localizedExplainer');

async function analyzeSMS(inputPayload) {
  const messageRaw = typeof inputPayload === 'string' ? inputPayload : (inputPayload.message || '');
  const senderRaw = typeof inputPayload === 'object' ? inputPayload.sender : '';
  const requestedLang = typeof inputPayload === 'object' ? (inputPayload.language || 'auto') : 'auto';

  // 1. Text Normalization
  const normalized = normalizeText(messageRaw);

  // 2. Regional Language Detection
  const languageInfo = detectLanguage(normalized.cleanText);
  const activeLang = (requestedLang !== 'auto' && ['en', 'te', 'hi', 'ta'].includes(requestedLang))
    ? requestedLang
    : languageInfo.primary;

  // 3. URL Extraction & Threat Analysis
  const urlAnalysis = analyzeUrls(normalized.originalText, normalized.normalizedText);

  // 4. Multilingual Keyword & Phrase Analysis
  const keywordAnalysis = analyzeKeywords(normalized.originalText, normalized.normalizedText);

  // 5. Context & False-Positive Guard Analysis
  const contextAnalysis = analyzeContext(normalized.cleanText, keywordAnalysis, urlAnalysis);

  // 6. Sender Analysis
  const senderAnalysis = analyzeSender(senderRaw, normalized.cleanText);

  // 7. Transparent Deterministic Risk & Confidence Scoring
  const riskResult = calculateRiskScore(urlAnalysis, keywordAnalysis, contextAnalysis, senderAnalysis);

  // 8. Scam Category Classification
  const scamCategory = classifyScam(normalized.cleanText, riskResult.riskScore, keywordAnalysis, urlAnalysis);

  // 9. Language-Neutral Explanations & Action Recommendation Keys
  const explanation = generateExplanation(riskResult);

  const signalKeys = (riskResult.signals || []).map(s => s.key);
  const urlSignals = (urlAnalysis.signals || []).map(s => ({
    key: s.key,
    type: s.type || s.key,
    score: s.score
  }));

  return {
    riskScore: riskResult.riskScore,
    riskLevel: riskResult.riskLevel,
    confidence: riskResult.confidence,
    language: {
      primary: languageInfo.primary,
      displayName: languageInfo.primary.toUpperCase(),
      type: languageInfo.type || 'single',
      secondary: languageInfo.secondary || []
    },
    categoryKey: scamCategory.categoryKey || scamCategory.name,
    scamCategory: {
      name: scamCategory.name,
      categoryKey: scamCategory.categoryKey || scamCategory.name
    },
    signalKeys,
    signals: riskResult.signals,
    reasonKeys: explanation.reasonKeys,
    recommendationKeys: explanation.recommendationKeys,
    urlSignals,
    urls: urlAnalysis.urls,
    senderStatus: senderAnalysis.status,
    sender: senderAnalysis,
    context: contextAnalysis,
    explanation,
    engine: {
      ruleBased: true,
      mlUsed: false,
      version: '2.0.0-Enhanced'
    },
    analyzedAt: new Date().toISOString()
  };
}

module.exports = {
  analyzeSMS
};
