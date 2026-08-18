/**
 * Text Normalizer Module for PhishGuard
 * Safely normalizes SMS text for analysis while preserving original text for UI rendering.
 */

function normalizeText(input) {
  if (!input || typeof input !== 'string') {
    return {
      originalText: '',
      normalizedText: '',
      cleanText: '',
      hasHomoglyphs: false,
      hasZeroWidthChars: false
    };
  }

  const originalText = input;

  // 1. Check for Zero-Width Characters and hidden Unicode tricks
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF]/g;
  const hasZeroWidthChars = zeroWidthRegex.test(originalText);
  let cleaned = originalText.replace(zeroWidthRegex, '');

  // 2. Unicode NFKC Normalization (preserves Indic script code points while standardizing compatibility characters)
  cleaned = cleaned.normalize('NFKC');

  // 3. Map common Cyrillic / Homoglyph lookalike characters used in URL/Text obfuscation
  const homoglyphMap = {
    'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x', 'у': 'y',
    'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'H', 'О': 'O',
    'Р': 'P', 'С': 'S', 'Т': 'T', 'Х': 'X'
  };

  let hasHomoglyphs = false;
  let normalizedText = '';

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (homoglyphMap[char]) {
      normalizedText += homoglyphMap[char];
      hasHomoglyphs = true;
    } else {
      normalizedText += char;
    }
  }

  // 4. Clean text version for keyword matching (lowercase, standardized whitespace)
  const cleanText = normalizedText
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    originalText,
    normalizedText,
    cleanText,
    cleanTextLower: cleanText.toLowerCase(),
    hasHomoglyphs,
    hasZeroWidthChars
  };
}

module.exports = {
  normalizeText
};
