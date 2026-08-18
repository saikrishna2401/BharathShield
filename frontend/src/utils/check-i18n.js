import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../locales');
const LANGUAGES = ['en', 'te', 'hi', 'ta'];

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

export function runCheck() {
  const dicts = {};
  const allKeysMap = {};

  for (const lang of LANGUAGES) {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`Error: Locale file missing for language '${lang}': ${filePath}`);
      process.exit(1);
    }
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    dicts[lang] = content;
    allKeysMap[lang] = new Set(getAllKeys(content));
  }

  const enKeysSet = allKeysMap['en'];
  const totalKeys = enKeysSet.size;

  let hasErrors = false;
  const missingByLang = {};

  console.log('\n--- PhishGuard Recursive Localization Check ---');

  for (const lang of LANGUAGES) {
    const currentKeys = allKeysMap[lang];
    const missing = [];

    for (const key of enKeysSet) {
      if (!currentKeys.has(key)) {
        missing.push(key);
      }
    }

    missingByLang[lang] = missing;
    const foundCount = totalKeys - missing.length;
    const coverage = ((foundCount / totalKeys) * 100).toFixed(1);

    console.log(`Language: ${lang.toUpperCase()} — Coverage: ${coverage}% (${foundCount}/${totalKeys} keys)`);

    if (missing.length > 0) {
      hasErrors = true;
    }
  }

  console.log('\nMissing keys breakdown:');
  let missingAny = false;
  for (const lang of LANGUAGES) {
    if (missingByLang[lang].length > 0) {
      missingAny = true;
      console.log(`\n❌ ${lang}.json: (${missingByLang[lang].length} missing keys)`);
      missingByLang[lang].forEach(k => console.log(`   - ${k}`));
    }
  }

  if (!missingAny) {
    console.log('None! All keys present across 100% of supported languages.\n');
  }

  if (hasErrors) {
    console.error('FAILED: Translation key mismatch detected!\n');
    process.exit(1);
  } else {
    console.log('SUCCESS: 100% translation key parity verified across English, Telugu, Hindi, and Tamil.\n');
    process.exit(0);
  }
}

runCheck();
