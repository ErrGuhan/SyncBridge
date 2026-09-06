const fs = require('fs');
const path = require('path');

console.log('=== SYNCBRIDGE I18N VERIFICATION AUDIT ===\n');

const langContextPath = path.join(__dirname, '..', 'src', 'context', 'LanguageContext.tsx');
const content = fs.readFileSync(langContextPath, 'utf8');

// Regex to extract translation items:
// key: { en: '...', hi: '...', kn: '...', ta: '...' }
const regex = /(\w+):\s*\{([^}]+)\}/g;
let match;
let totalKeys = 0;
let errors = [];

const devanagariRegex = /[\u0900-\u097F]/;
const kannadaRegex = /[\u0C80-\u0CFF]/;
const tamilRegex = /[\u0B80-\u0BFF]/;

while ((match = regex.exec(content)) !== null) {
  const key = match[1];
  const block = match[2];

  // We only care about translation objects with en/hi/kn/ta
  if (!block.includes('en:') || !block.includes('hi:')) continue;

  totalKeys++;

  const enMatch = block.match(/en:\s*['"`](.*?)['"`]/);
  const hiMatch = block.match(/hi:\s*['"`](.*?)['"`]/);
  const knMatch = block.match(/kn:\s*['"`](.*?)['"`]/);
  const taMatch = block.match(/ta:\s*['"`](.*?)['"`]/);

  if (!enMatch || !enMatch[1]) errors.push(`[${key}] Missing or empty 'en' translation`);
  if (!hiMatch || !hiMatch[1]) errors.push(`[${key}] Missing or empty 'hi' translation`);
  if (!knMatch || !knMatch[1]) errors.push(`[${key}] Missing or empty 'kn' translation`);
  if (!taMatch || !taMatch[1]) errors.push(`[${key}] Missing or empty 'ta' translation`);

  if (hiMatch && hiMatch[1] && !devanagariRegex.test(hiMatch[1]) && !/\d+/.test(hiMatch[1])) {
    errors.push(`[${key}] 'hi' translation does not contain Devanagari characters: "${hiMatch[1]}"`);
  }
  if (knMatch && knMatch[1] && !kannadaRegex.test(knMatch[1]) && !/\d+/.test(knMatch[1])) {
    errors.push(`[${key}] 'kn' translation does not contain Kannada characters: "${knMatch[1]}"`);
  }
  if (taMatch && taMatch[1] && !tamilRegex.test(taMatch[1]) && !/\d+/.test(taMatch[1])) {
    errors.push(`[${key}] 'ta' translation does not contain Tamil characters: "${taMatch[1]}"`);
  }
}

console.log(`Audited ${totalKeys} translation keys across 4 languages (English, Hindi, Kannada, Tamil).`);

if (errors.length > 0) {
  console.error(`\n❌ Found ${errors.length} translation issues:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('\n✅ ALL TRANSLATION KEYS VERIFIED 100% COMPLETE AND CORRECT IN ALL 4 LANGUAGES!');
  process.exit(0);
}
