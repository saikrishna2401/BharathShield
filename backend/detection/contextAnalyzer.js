/**
 * Context & False-Positive Protection Analyzer for PhishGuard
 * Prevents false positives on legitimate informational & bank transaction SMS while flagging coercive threats.
 */

const SAFETY_DISCLAIMERS = [
  /do not share/i, /never share/i, /keep it confidential/i, /don't share/i,
  /రహస్యంగా ఉంచండి/i, /ఎవరికీ చెప్పకండి/i, /షేర్ చేయవద్దు/i,
  /शेयर न करें/i, /किसी के साथ साझा न करें/i, /गोपनीय रखें/i,
  /பகிர வேண்டாம்/i, /யாருடனும் பகிர வேண்டாம்/i
];

function analyzeContext(text, keywordAnalysis, urlAnalysis) {
  if (!text || typeof text !== 'string') {
    return {
      intent: 'INFORMATIONAL',
      isTransactional: false,
      hasSafetyDisclaimer: false,
      scoreAdjustment: 0,
      contextExplanation: 'No message context evaluated.'
    };
  }

  const lowerText = text.toLowerCase();

  // Check for presence of explicit safety disclaimer
  const hasSafetyDisclaimer = SAFETY_DISCLAIMERS.some(regex => regex.test(lowerText));

  // Check keyword indicators
  const hasOtpOrPin = !!(keywordAnalysis.categoryMatches && keywordAnalysis.categoryMatches.CREDENTIAL_REQS);
  const hasUrgency = !!(keywordAnalysis.categoryMatches && keywordAnalysis.categoryMatches.URGENCY);
  const hasCoercion = !!(keywordAnalysis.categoryMatches && keywordAnalysis.categoryMatches.ACTION_COERCION);
  const hasUrl = urlAnalysis && urlAnalysis.hasUrl;

  let intent = 'INFORMATIONAL';
  let isTransactional = false;
  let scoreAdjustment = 0;
  let contextExplanation = '';

  // 1. LEGITIMATE BANK TRANSACTION / OTP SCENARIO (False Positive Protection)
  if (hasOtpOrPin && !hasUrl && !hasUrgency && !hasCoercion) {
    intent = 'TRANSACTIONAL_SAFE';
    isTransactional = true;
    scoreAdjustment = -20; // Major reduction to prevent false positives
    contextExplanation = hasSafetyDisclaimer
      ? 'Legitimate transactional message containing OTP with safety warning.'
      : 'Standard informational transactional SMS without malicious indicators.';
  } else if (hasOtpOrPin && hasSafetyDisclaimer && !hasUrl) {
    intent = 'TRANSACTIONAL_SAFE';
    isTransactional = true;
    scoreAdjustment = -25;
    contextExplanation = 'Verified safety disclaimer present; no suspicious link attached.';
  }

  // 2. COERCIVE PHISHING COMBINATION (High Risk Context)
  if (hasOtpOrPin && (hasUrl || hasUrgency || hasCoercion)) {
    intent = 'COERCIVE_PHISHING_ATTEMPT';
    scoreAdjustment = +20; // Increase risk because credential request is paired with threat or link
    contextExplanation = 'Sensitive credential request combined with link or urgent threat.';
  }

  return {
    intent,
    isTransactional,
    hasSafetyDisclaimer,
    scoreAdjustment,
    contextExplanation
  };
}

module.exports = {
  analyzeContext
};
