/**
 * Scam Category Classifier Module for PhishGuard
 * Identifies probable scam category using stable language-neutral keys.
 */

const CATEGORY_PATTERNS = {
  KYC_SCAM: [/kyc/i, /కేవైసీ/i, /केवाईसी/i, /கேஒய்சி/i, /update kyc/i],
  ACCOUNT_BLOCKING_SCAM: [/block/i, /suspend/i, /deactivat/i, /బ్లాక్/i, /రద్దవు/i, /बंद/i, /செயலிழக்க/i],
  LOTTERY_SCAM: [/lottery/i, /won ₹/i, /prize/i, /cashback/i, /గెలుచుకున్నారు/i, /బహుమతి/i, /जीते हैं/i, /इनाम/i, /வென்றுள்ளீர்கள்/i],
  OTP_SCAM: [/otp/i, /cvv/i, /pin/i, /password/i, /ఓటిపి/i, /ओटीपी/i, /ஒடிபி/i],
  UPI_SCAM: [/upi/i, /gpay/i, /phonepe/i, /paytm/i, /collect request/i, /money received/i],
  BANK_FRAUD: [/sbi/i, /hdfc/i, /icici/i, /axis/i, /bank account/i, /బ్యాంక్/i, /बैंक/i, /வங்கி/i],
  JOB_SCAM: [/part time/i, /earn ₹/i, /work from home/i, /daily income/i, /job offer/i, /ఉద్యోగం/i, /नौकरी/i, /வேலை/i],
  GOVT_IMPERSONATION: [/electricity/i, /trai/i, /income tax/i, /india post/i, /విద్యుత్/i, /आयकर/i, /மின்சார/i]
};

function classifyScam(text, riskScore, keywordAnalysis, urlAnalysis) {
  if (riskScore < 30) {
    return {
      name: 'INFORMATIONAL',
      categoryKey: 'INFORMATIONAL',
      confidence: Math.max(85, 100 - riskScore)
    };
  }

  const combinedText = (text || '').toLowerCase();

  for (const [catKey, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(combinedText)) {
        return {
          name: catKey,
          categoryKey: catKey,
          confidence: Math.min(95, riskScore + 5)
        };
      }
    }
  }

  return {
    name: 'BANK_FRAUD',
    categoryKey: 'BANK_FRAUD',
    confidence: Math.min(90, riskScore)
  };
}

module.exports = {
  classifyScam
};
