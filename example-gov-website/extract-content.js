#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const siteRoot = path.resolve(__dirname, 'gov.example');
const outputPath = path.resolve(siteRoot, process.argv[2] || 'content.txt');

const blockElements = new Set([
  'address', 'article', 'aside', 'blockquote', 'br', 'dd', 'div', 'dl',
  'dt', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre',
  'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'
]);

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() && entry.name !== 'templates' ? htmlFiles(entryPath) :
        entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
    });
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, entityValue) => {
      const codePoint = entityValue.toLowerCase().startsWith('x')
        ? parseInt(entityValue.slice(1), 16)
        : parseInt(entityValue, 10);
      return Number.isSafeInteger(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : _;
    });
}

function extractText(filePath) {
  const document = fs.readFileSync(filePath, 'utf8');
  const bodyMatch = document.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i);
  let html = (bodyMatch ? bodyMatch[1] : document)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1\s*>/gi, '');

  const text = html.replace(/<\/?([a-z][\w:-]*)\b[^>]*>/gi, (tag, tagName) =>
    blockElements.has(tagName.toLowerCase()) ? '\n' : '')
    .replace(/<[^>]*>/g, '');

  return decodeHtmlEntities(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

function extractTitle(filePath) {
  const document = fs.readFileSync(filePath, 'utf8');
  const titleMatch = document.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i);
  return titleMatch
    ? decodeHtmlEntities(titleMatch[1].replace(/\s+/g, ' ').trim())
    : '';
}

function extractDescription(filePath) {
  const document = fs.readFileSync(filePath, 'utf8');
  const metaTags = document.match(/<meta\b[^>]*>/gi) || [];
  const descriptionTag = metaTags.find((tag) =>
    /\bname\s*=\s*["']description["']/i.test(tag));
  const contentMatch = descriptionTag?.match(/\bcontent\s*=\s*(["'])([\s\S]*?)\1/i);
  return contentMatch ? decodeHtmlEntities(contentMatch[2].replace(/\s+/g, ' ').trim()) : '';
}

const pages = htmlFiles(siteRoot)
  .sort((a, b) => a.localeCompare(b))
  .map((filePath) => {
    const relativeUrl = path.relative(siteRoot, filePath).split(path.sep).join('/');
    return `Page: ${relativeUrl}\nTitle: ${extractTitle(filePath)}\nDescription: ${extractDescription(filePath)}\n<TEXT-CONTENT>\n${extractText(filePath)}\n</TEXT-CONTENT>`;
  });

fs.writeFileSync(outputPath, `${pages.join('\n\n')}\n`, 'utf8');
console.log(`Wrote ${pages.length} pages to ${path.relative(process.cwd(), outputPath)}`);
