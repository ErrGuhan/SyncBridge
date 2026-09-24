const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/i18n/home.ts');

// Read as buffer, convert CRLF to LF uniformly first
let content = fs.readFileSync(filePath, 'utf8');

// Normalise line endings
content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// The bug: some multi-line string values use a bare \n inside single-quoted strings.
// JS does NOT allow this. We join them into one line separated by a space.
// We do this by scanning character by character.

let result = '';
let inStr = false;
let strChar = '';
let i = 0;

while (i < content.length) {
  const ch = content[i];

  if (!inStr) {
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = true;
      strChar = ch;
      result += ch;
      i++;
    } else {
      result += ch;
      i++;
    }
  } else {
    // inside string
    if (ch === '\\') {
      // escaped char — pass both through
      result += ch;
      i++;
      if (i < content.length) {
        result += content[i];
        i++;
      }
    } else if (ch === strChar) {
      // closing quote
      inStr = false;
      strChar = '';
      result += ch;
      i++;
    } else if (ch === '\n' && strChar !== '`') {
      // Bare newline inside a non-template string — illegal! Replace with space.
      result += ' ';
      i++;
      // Skip leading whitespace on the next line (indentation of continuation)
      while (i < content.length && (content[i] === ' ' || content[i] === '\t')) {
        i++;
      }
    } else {
      result += ch;
      i++;
    }
  }
}

// Write back with LF line endings
fs.writeFileSync(filePath, result, 'utf8');
console.log('Fixed. Characters written:', result.length);

// Quick validation
const lines = result.split('\n');
let opens = (result.match(/\{/g) || []).length;
let closes = (result.match(/\}/g) || []).length;
console.log('Brace balance: {=' + opens + ' }=' + closes + ' OK=' + (opens === closes));
console.log('Total lines:', lines.length);
