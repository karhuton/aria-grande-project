#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const siteRoot = path.resolve(__dirname, 'gov.example');

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return htmlFiles(entryPath);
    }
    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

let updated = 0;
for (const filePath of htmlFiles(siteRoot)) {
  const source = fs.readFileSync(filePath, 'utf8');
  const fixed = source.replace(
    /(<title\b[^>]*>[\s\S]*?)\s+—\s+GOV\.EXAMPLE(\s*<\/title\s*>)/gi,
    '$1$2'
  );

  if (fixed !== source) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    updated += 1;
  }
}

console.log(`Removed GOV.EXAMPLE suffix from ${updated} HTML titles.`);
