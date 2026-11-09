const fs = require('fs');
const code = fs.readFileSync('C:/Users/zirih/Downloads/Website Boost Pack Lza.Labs/app/page.tsx', 'utf-8');

// Count bracket balance per line
const lines = code.split(/\r?\n/);
let stack = [];
const pairs = { ')': '(', ']': '[', '}': '{' };
let inString = null;
let lineInString = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const ch = line[j];
    if (inString) {
      if (ch === '\\') { j++; continue; }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = ch; lineInString = i; continue; }
    if (ch === '(' || ch === '[' || ch === '{') stack.push({ ch, line: i + 1 });
    else if (pairs[ch]) {
      const top = stack.pop();
      if (!top || top.ch !== pairs[ch]) {
        console.log(`MISMATCH at line ${i+1} char ${j}: found ${ch}, expected close of ${top ? top.ch + ' (line ' + top.line + ')' : 'nothing'}`);
        if (i > 530) break;
      }
    }
  }
}

if (stack.length) {
  console.log(`UNCLOSED: ${stack.length} brackets still open`);
  stack.slice(-10).forEach(s => console.log(`  ${s.ch} opened at line ${s.line}`));
} else {
  console.log('All brackets balanced');
}

// Report string that didn't close
if (inString) {
  console.log(`Unclosed string '${inString}' started at line ${lineInString + 1}`);
}
