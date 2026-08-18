/**
 * Localized Explainer Module for PhishGuard (Backend)
 * Generates transparent, language-neutral explanation keys and recommended action keys.
 * Frontend translates keys dynamically using react-i18next.
 */

function generateExplanation(riskResult) {
  const isSafe = riskResult.riskLevel === 'SAFE';

  if (isSafe) {
    return {
      whyHeaderKey: 'whySafeHeader',
      reasonKeys: [
        'SAFE_NO_SUSPICIOUS_URL',
        'SAFE_NO_CREDENTIAL_REQUEST',
        'SAFE_NO_URGENT_LANGUAGE',
        'SAFE_INFORMATIONAL'
      ],
      disclaimerKey: 'safeDisclaimer',
      recommendationsHeaderKey: 'recsHeader',
      recommendationKeys: [
        'KEEP_FOR_REFERENCE',
        'VERIFY_UNKNOWN_NUMBER'
      ]
    };
  }

  // Threat / Suspicious / Phishing Scenarios
  const reasonKeys = [];
  if (riskResult.signals && riskResult.signals.length > 0) {
    for (const sig of riskResult.signals) {
      reasonKeys.push(sig.key);
    }
  } else {
    reasonKeys.push('SUSPICIOUS_URL');
  }

  return {
    whyHeaderKey: 'whyHeader',
    reasonKeys: Array.from(new Set(reasonKeys)),
    disclaimerKey: null,
    recommendationsHeaderKey: 'recsHeader',
    recommendationKeys: [
      'DO_NOT_CLICK_LINK',
      'DO_NOT_SHARE_OTP',
      'VERIFY_OFFICIAL_CHANNEL',
      'DELETE_MESSAGE',
      'REPORT_MESSAGE'
    ]
  };
}

module.exports = {
  generateExplanation
};
