/**
 * Language Detector Module for PhishGuard
 * Accurately detects primary and secondary scripts: English, Telugu, Hindi, Tamil, and Code-Mixed text.
 */

function detectLanguage(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      primary: 'en',
      secondary: [],
      type: 'single',
      displayName: 'English',
      scriptCounts: { en: 0, te: 0, hi: 0, ta: 0 }
    };
  }

  // Count characters per script range
  let teCount = 0; // Telugu U+0C00..U+0C7F
  let hiCount = 0; // Hindi / Devanagari U+0900..U+097F
  let taCount = 0; // Tamil U+0B80..U+0BFF
  let enCount = 0; // Latin a-zA-Z

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0x0C00 && code <= 0x0C7F) {
      teCount++;
    } else if (code >= 0x0900 && code <= 0x097F) {
      hiCount++;
    } else if (code >= 0x0B80 && code <= 0x0BFF) {
      taCount++;
    } else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      enCount++;
    }
  }

  const scriptCounts = { en: enCount, te: teCount, hi: hiCount, ta: taCount };
  const totalLetters = teCount + hiCount + taCount + enCount;

  if (totalLetters === 0) {
    return {
      primary: 'en',
      secondary: [],
      type: 'single',
      displayName: 'English',
      scriptCounts
    };
  }

  // Determine active scripts with > 10% representation or minimum 3 letters
  const activeScripts = [];
  if (teCount > 2 || (teCount / totalLetters) >= 0.1) activeScripts.push({ lang: 'te', count: teCount });
  if (hiCount > 2 || (hiCount / totalLetters) >= 0.1) activeScripts.push({ lang: 'hi', count: hiCount });
  if (taCount > 2 || (taCount / totalLetters) >= 0.1) activeScripts.push({ lang: 'ta', count: taCount });
  if (enCount > 2 || (enCount / totalLetters) >= 0.1) activeScripts.push({ lang: 'en', count: enCount });

  activeScripts.sort((a, b) => b.count - a.count);

  const primary = activeScripts.length > 0 ? activeScripts[0].lang : 'en';
  const secondary = activeScripts.slice(1).map(s => s.lang);

  let type = 'single';
  let displayName = getLanguageName(primary);

  if (activeScripts.length > 1) {
    type = 'code-mixed';
    const primaryName = getLanguageName(primary);
    const secondaryNames = secondary.map(getLanguageName).join(' + ');
    displayName = `${primaryName} + ${secondaryNames}`;
  }

  return {
    primary,
    secondary,
    type,
    displayName,
    scriptCounts
  };
}

function getLanguageName(code) {
  switch (code) {
    case 'te': return 'Telugu';
    case 'hi': return 'Hindi';
    case 'ta': return 'Tamil';
    case 'en': return 'English';
    default: return 'English';
  }
}

module.exports = {
  detectLanguage
};
