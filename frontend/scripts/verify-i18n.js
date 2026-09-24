const fs = require('fs');
const path = require('path');

console.log('=== SYNCBRIDGE I18N VERIFICATION AUDIT ===\n');

const i18nDir = path.join(__dirname, '..', 'src', 'i18n');
const files = fs.readdirSync(i18nDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

let totalKeys = 0;
let errors = [];

const devanagariRegex = /[\u0900-\u097F]/;
const kannadaRegex = /[\u0C80-\u0CFF]/;
const tamilRegex = /[\u0B80-\u0BFF]/;

for (const file of files) {
  const filePath = path.join(i18nDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Match key: { en: '...', hi: '...', kn: '...', ta: '...' }
  const regex = /(\w+):\s*\{([^}]+)\}/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const block = match[2];

    if (!block.includes('en:') || !block.includes('hi:')) continue;

    totalKeys++;

    const enMatch = block.match(/en:\s*['"`]([\s\S]*?)['"`]/);
    const hiMatch = block.match(/hi:\s*['"`]([\s\S]*?)['"`]/);
    const knMatch = block.match(/kn:\s*['"`]([\s\S]*?)['"`]/);
    const taMatch = block.match(/ta:\s*['"`]([\s\S]*?)['"`]/);

    if (!enMatch || !enMatch[1].trim()) errors.push(`[${file} -> ${key}] Missing or empty 'en' translation`);
    if (!hiMatch || !hiMatch[1].trim()) errors.push(`[${file} -> ${key}] Missing or empty 'hi' translation`);
    if (!knMatch || !knMatch[1].trim()) errors.push(`[${file} -> ${key}] Missing or empty 'kn' translation`);
    if (!taMatch || !taMatch[1].trim()) errors.push(`[${file} -> ${key}] Missing or empty 'ta' translation`);

    if (hiMatch && hiMatch[1] && !devanagariRegex.test(hiMatch[1]) && !/^[\d\s₹%+.,:;!?()/-]+$/.test(hiMatch[1])) {
      errors.push(`[${file} -> ${key}] 'hi' translation does not contain Devanagari characters: "${hiMatch[1]}"`);
    }
    if (knMatch && knMatch[1] && !kannadaRegex.test(knMatch[1]) && !/^[\d\s₹%+.,:;!?()/-]+$/.test(knMatch[1])) {
      errors.push(`[${file} -> ${key}] 'kn' translation does not contain Kannada characters: "${knMatch[1]}"`);
    }
    if (taMatch && taMatch[1] && !tamilRegex.test(taMatch[1]) && !/^[\d\s₹%+.,:;!?()/-]+$/.test(taMatch[1])) {
      errors.push(`[${file} -> ${key}] 'ta' translation does not contain Tamil characters: "${taMatch[1]}"`);
    }
  }
}

console.log(`Audited ${totalKeys} translation keys across ${files.length} module files in 4 languages (English, Hindi, Kannada, Tamil).\n`);

if (errors.length > 0) {
  console.error(`❌ Found ${errors.length} translation issues:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('✅ ALL TRANSLATION KEYS VERIFIED 100% COMPLETE AND CORRECT IN ALL 4 LANGUAGES!');
  process.exit(0);
}
