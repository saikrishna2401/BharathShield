/**
 * Sender Analyzer Module for PhishGuard
 * Analyzes SMS header / sender ID for anomalies.
 * Returns stable language-neutral status keys.
 */

function analyzeSender(senderInput, textBody = '') {
  if (!senderInput || typeof senderInput !== 'string' || !senderInput.trim()) {
    return {
      provided: false,
      sender: null,
      status: 'UNAVAILABLE',
      score: 0,
      signals: []
    };
  }

  const sender = senderInput.trim();
  const lowerBody = textBody.toLowerCase();
  const signals = [];
  let score = 0;
  let status = 'UNKNOWN';

  const telecomHeaderRegex = /^[A-Z]{2}-[A-Z0-9]{3,8}$/i;
  const mobileRegex = /^(\+91)?[\s-]?\d{10}$/;
  const intlRegex = /^\+(?!(91))\d{8,15}$/;

  const claimsAuthority = /sbi|bank|hdfc|icici|axis|paytm|trai|income\s*tax|police|electricity/i.test(lowerBody);

  if (telecomHeaderRegex.test(sender)) {
    status = 'VERIFIED_FORMAT';
    score = 0;
  } else if (mobileRegex.test(sender) && claimsAuthority) {
    status = 'PERSONAL_NUMBER_IMPERSONATION';
    score = 15;
    signals.push({ key: 'PERSONAL_SENDER_IMPERSONATION', score: 15 });
  } else if (intlRegex.test(sender)) {
    status = 'INTERNATIONAL_ANOMALY';
    score = 15;
    signals.push({ key: 'INTERNATIONAL_SENDER', score: 15 });
  } else if (sender.length < 3 || /[<>{}%\\]/.test(sender)) {
    status = 'MALFORMED_SENDER';
    score = 10;
    signals.push({ key: 'MALFORMED_SENDER', score: 10 });
  } else {
    status = 'UNKNOWN';
    score = 0;
  }

  return {
    provided: true,
    sender,
    status,
    score,
    signals
  };
}

module.exports = {
  analyzeSender
};
