/**
 * Risk Scorer Module for PhishGuard
 * Calculates transparent, deduplicated risk score (0-100) and separate confidence rating (0-100%).
 */

function calculateRiskScore(urlAnalysis, keywordAnalysis, contextAnalysis, senderAnalysis) {
  const signalMap = new Map();
  let baseScore = 0;

  // 1. Collect & deduplicate URL signals
  if (urlAnalysis && urlAnalysis.signals) {
    for (const sig of urlAnalysis.signals) {
      if (!signalMap.has(sig.key)) {
        signalMap.set(sig.key, sig);
        baseScore += sig.score;
      }
    }
  }

  // 2. Collect & deduplicate Keyword signals
  if (keywordAnalysis && keywordAnalysis.signals) {
    for (const sig of keywordAnalysis.signals) {
      if (!signalMap.has(sig.key)) {
        signalMap.set(sig.key, sig);
        baseScore += sig.score;
      }
    }
  }

  // 3. Collect Sender signals
  if (senderAnalysis && senderAnalysis.signals) {
    for (const sig of senderAnalysis.signals) {
      if (!signalMap.has(sig.key)) {
        signalMap.set(sig.key, sig);
        baseScore += sig.score;
      }
    }
  }

  // 4. Apply Context Adjustment (False Positive Protection offset or Coercion multiplier)
  if (contextAnalysis && typeof contextAnalysis.scoreAdjustment === 'number') {
    baseScore += contextAnalysis.scoreAdjustment;
  }

  // Cap final risk score between 0 and 100
  const finalRiskScore = Math.max(0, Math.min(100, Math.round(baseScore)));

  // Determine Risk Category
  let riskLevel = 'SAFE';
  if (finalRiskScore >= 60) {
    riskLevel = 'PHISHING';
  } else if (finalRiskScore >= 30) {
    riskLevel = 'SUSPICIOUS';
  } else {
    riskLevel = 'SAFE';
  }

  // Calculate separate Detection Confidence Score
  // Confidence increases with signal density, URL clarity, or strong transactional indicator
  const uniqueSignalCount = signalMap.size;
  let confidence = 70; // baseline

  if (uniqueSignalCount === 0 && finalRiskScore < 20) {
    confidence = 90; // High confidence in safe informational message
  } else if (uniqueSignalCount >= 3) {
    confidence = 94; // High confidence when multiple independent signals align
  } else if (uniqueSignalCount === 2) {
    confidence = 85;
  } else if (uniqueSignalCount === 1) {
    confidence = 72;
  }

  if (contextAnalysis && contextAnalysis.hasSafetyDisclaimer) {
    confidence = Math.min(96, confidence + 5);
  }

  const signalsList = Array.from(signalMap.values());

  return {
    riskScore: finalRiskScore,
    riskLevel,
    confidence,
    signals: signalsList
  };
}

module.exports = {
  calculateRiskScore
};
