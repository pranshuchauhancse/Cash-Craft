const fs = require('fs');
const path = require('path');

function stripComments(code) {
  let out = '';
  let i = 0;
  const len = code.length;
  let inSingle = false, inDouble = false, inTemplate = false;
  let inLineComment = false, inBlockComment = false;
  let escape = false;
  while (i < len) {
    const ch = code[i];
    const next = code[i+1];
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false; i += 2; continue;
      }
      i++; continue;
    }
    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false; out += ch; i++; continue;
      }
      i++; continue;
    }
    if (!inSingle && !inDouble && !inTemplate) {
      // possible comment start
      if (ch === '/' && next === '*') {
        inBlockComment = true; i += 2; continue;
      }
      if (ch === '/' && next === '/') {
        inLineComment = true; i += 2; continue;
      }
    }
    // handle strings
    if (inSingle) {
      out += ch;
      if (!escape && ch === "'") { inSingle = false; }
      escape = (!escape && ch === '\\');
      i++; continue;
    }
    if (inDouble) {
      out += ch;
      if (!escape && ch === '"') { inDouble = false; }
      escape = (!escape && ch === '\\');
      i++; continue;
    }
    if (inTemplate) {
      out += ch;
      if (!escape && ch === '`') { inTemplate = false; }
      // handle template expression start - we will keep content as-is (comments inside ${} won't be stripped)
      escape = (!escape && ch === '\\');
      i++; continue;
    }
    // not in any string
    if (ch === "'") { inSingle = true; out += ch; i++; escape = false; continue; }
    if (ch === '"') { inDouble = true; out += ch; i++; escape = false; continue; }
    if (ch === '`') { inTemplate = true; out += ch; i++; escape = false; continue; }
    out += ch; i++;
  }
  return out;
}

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file === 'node_modules' || file === '.git') return;
      results.push(...walk(filePath));
    } else {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) results.push(filePath);
    }
  });
  return results;
}

const root = path.join(__dirname, '..'); // cashcraft-backend
const srcDir = path.join(root, 'src');
const dbDir = path.join(root, 'db');

const targets = [];
if (fs.existsSync(srcDir)) targets.push(...walk(srcDir));
if (fs.existsSync(dbDir)) targets.push(...walk(dbDir));

console.log('Found files to process:', targets.length);

const changed = [];
for (const file of targets) {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const stripped = stripComments(original);
    if (stripped !== original) {
      fs.writeFileSync(file, stripped, 'utf8');
      changed.push(file);
      console.log('Stripped comments from:', file);
    }
  } catch (err) {
    console.error('Error processing', file, err.message);
  }
}

console.log('Done. Files changed:', changed.length);
if (changed.length > 0) console.log(changed.join('\n'));
