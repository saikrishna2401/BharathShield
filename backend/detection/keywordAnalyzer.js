/**
 * Keyword & Phrase Analyzer Module for PhishGuard
 * Multilingual phrase detection across English, Telugu, Hindi, and Tamil.
 */

const DICTIONARY = {
  URGENCY: {
    score: 15,
    label: 'Urgent/Coercive Language',
    patterns: [
      // English
      /immediately/i, /urgent/i, /account (?:will be )?block(?:ed)?/i, /expires? today/i,
      /last chance/i, /act now/i, /within 24 hours/i, /suspended/i, /deactivated/i,
      // Telugu
      /వెంటనే/i, /ఈరోజే/i, /బ్లాక్/i, /రద్దవుతుంది/i, /నిలిపివేయబడుతుంది/i, /చివరి అవకాశం/i, /తక్షణమే/i,
      // Hindi
      /तुरंत/i, /आज ही/i, /ब्लॉक/i, /बंद हो जाएगा/i, /अंतिम अवसर/i, /अकाउंट सस्पेंड/i, /तत्काल/i,
      // Tamil
      /உடனடியாக/i, /இன்றே/i, /முடக்கப்படும்/i, /செயலிழக்கப்படும்/i, /கடைசி வாய்ப்பு/i
    ]
  },
  FINANCIAL: {
    score: 20,
    label: 'Financial Offer / Threat',
    patterns: [
      // English
      /won ₹?\d+/i, /lottery/i, /cashback/i, /prize/i, /reward/i, /claim/i, /refund/i, /money transfer/i, /credited/i, /debited/i,
      // Telugu
      /గెలుచుకున్నారు/i, /బహుమతి/i, /లక్కీ డ్రా/i, /రూపాయలు/i, /నగదు/i, /రకం క్లెయిమ్/i,
      // Hindi
      /जीते हैं/i, /इनाम/i, /लॉटरी/i, /कैशबैक/i, /रुपये प्राप्त/i, /दावा करें/i,
      // Tamil
      /வென்றுள்ளீர்கள்/i, /பரிசு/i, /லாட்டரி/i, /பணம்/i, /கோரவும்/i
    ]
  },
  CREDENTIAL_REQS: {
    score: 25,
    label: 'Request for Sensitive Credentials',
    patterns: [
      // English
      /otp/i, /pin/i, /cvv/i, /password/i, /aadhaar/i, /pan card/i, /bank details/i, /login credentials/i, /upi pin/i,
      // Telugu
      /ఓటిపి/i, /పిన్/i, /పాస్వర్డ్/i, /ఆధార్/i, /పాన్ కార్డ్/i, /బ్యాంక్ వివరాలు/i,
      // Hindi
      /ओटीपी/i, /पिन/i, /पासवर्ड/i, /आधार/i, /पैन कार्ड/i, /बैंक विवरण/i,
      // Tamil
      /ஒடிபி/i, /பின்/i, /கடவுச்சொல்/i, /ஆதார்/i, /பான் கார்டு/i, /வங்கி விவரங்கள்/i
    ]
  },
  ACTION_COERCION: {
    score: 15,
    label: 'Request to Click Link / Take Action',
    patterns: [
      // English
      /click (?:this )?link/i, /verify (?:your )?kyc/i, /update (?:your )?account/i, /download app/i, /install apk/i,
      // Telugu
      /లింక్పై క్లిక్/i, /కేవైసీ పూర్తి/i, /ఖాతాను నవీకరించండి/i, /యాప్ డౌన్లోడ్/i,
      // Hindi
      /लिंक पर क्लिक/i, /केवाईसी अपडेट/i, /खाता सत्यापित/i, /ऐप डाउनलोड/i,
      // Tamil
      /இணைப்பைக் கிளிக்/i, /கேஒய்சி புதுப்பிப்பு/i, /கணக்கை சரிபார்க்கவும்/i
    ]
  },
  AUTHORITY_CLAIM: {
    score: 20,
    label: 'Claims Trusted Authority / Impersonation',
    patterns: [
      // English
      /state bank/i, /sbi/i, /hdfc/i, /icici/i, /axis/i, /paytm/i, /phonepe/i, /trai/i, /electricity board/i, /india post/i, /income tax/i, /police/i,
      // Telugu
      /బ్యాంక్/i, /విద్యుత్ శాఖ/i, /ఆదాయ పన్ను/i, /ప్రభుత్వం/i,
      // Hindi
      /बैंक/i, /बिजली विभाग/i, /आयकर/i, /सरकार/i,
      // Tamil
      /வங்கி/i, /மின்சார துறை/i, /வருமான வரி/i, /அரசு/i
    ]
  }
};

function analyzeKeywords(text, normalizedText = '') {
  if (!text || typeof text !== 'string') {
    return {
      categoryMatches: {},
      signals: [],
      keywordScore: 0
    };
  }

  const combined = `${text} ${normalizedText}`.toLowerCase();
  const categoryMatches = {};
  const signals = [];
  let totalScore = 0;

  for (const [catKey, catData] of Object.entries(DICTIONARY)) {
    let matched = false;
    const matchedPhrases = [];

    for (const pattern of catData.patterns) {
      const match = combined.match(pattern);
      if (match) {
        matched = true;
        matchedPhrases.push(match[0]);
      }
    }

    if (matched) {
      categoryMatches[catKey] = {
        label: catData.label,
        score: catData.score,
        phrases: Array.from(new Set(matchedPhrases))
      };

      signals.push({
        key: catKey,
        label: catData.label,
        score: catData.score,
        matchedCount: categoryMatches[catKey].phrases.length
      });

      totalScore += catData.score;
    }
  }

  return {
    categoryMatches,
    signals,
    keywordScore: totalScore
  };
}

module.exports = {
  analyzeKeywords
};
