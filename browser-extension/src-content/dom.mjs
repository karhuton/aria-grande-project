const PAGE_EXCERPT_LIMIT = 12000;
const CONTENT_SEMANTIC_TAGS = new Set([
  "a",
  "area",
  "article",
  "aside",
  "audio",
  "button",
  "dd",
  "details",
  "dialog",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "iframe",
  "img",
  "input",
  "label",
  "legend",
  "li",
  "main",
  "nav",
  "ol",
  "option",
  "optgroup",
  "p",
  "section",
  "select",
  "summary",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
  "video"
]);
const CONTENT_MEANINGFUL_ATTRIBUTES = [
  "alt",
  "aria-label",
  "aria-labelledby",
  "for",
  "href",
  "label",
  "name",
  "placeholder",
  "role",
  "type",
  "title"
];
const CONTENT_PRESERVED_ATTRIBUTES = [
  "alt",
  "aria-labelledby",
  "for",
  "label",
  "name",
  "placeholder",
  "title",
  "type"
];

export function getContentElementsFromDOM(container = document.body) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll("*")).filter(element =>
    isMeaningfulContentElement(element)
  );
}

export function getContentElementAttributes(element) {
  const attributes = {};

  for (const name of CONTENT_PRESERVED_ATTRIBUTES) {
    const value = cleanDomDescription(element.getAttribute(name));

    if (value) {
      attributes[name] = value;
    }
  }

  return Object.keys(attributes).length > 0 ? attributes : null;
}

function isMeaningfulContentElement(element) {
  if (
    element.closest("#aria-grande-actions") ||
    element.closest("script, style, noscript, template") ||
    element.closest('[hidden], [inert], [aria-hidden="true"]')
  ) {
    return false;
  }

  const style = window.getComputedStyle(element);

  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  const mediaContainer = element.closest("svg, canvas");

  if (mediaContainer && mediaContainer !== element) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();
  const hasDirectText = Array.from(element.childNodes).some(node =>
    node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
  );
  const hasMeaningfulAttribute = CONTENT_MEANINGFUL_ATTRIBUTES.some(name =>
    element.hasAttribute(name)
  );

  return (
    hasDirectText ||
    hasMeaningfulAttribute ||
    CONTENT_SEMANTIC_TAGS.has(tagName)
  );
}

export function isVisibleElement(element) {
  const style = window.getComputedStyle(element);
  const hasLayout =
    element.offsetWidth > 0 ||
    element.offsetHeight > 0 ||
    element.getClientRects().length > 0;

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    hasLayout
  );
}

export function cleanDomDescription(value) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 240) || null;
}

export function getPageExcerpt() {
  const pageText = document.body?.innerText?.replace(/\s+/g, " ").trim();

  if (!pageText) {
    throw new Error("This page does not contain readable text.");
  }

  return pageText.slice(0, PAGE_EXCERPT_LIMIT);
}

export function getLoginDomEvidence() {
  const loginTerms =
    /\b(log[ -]?out|sign[ -]?out|my account|account menu|user menu|profile|avatar|current user|log[ -]?in|sign[ -]?in|register|create account)\b/i;
  const evidence = [];
  const elements = document.body.querySelectorAll(
    "a, button, [role], [aria-label], [title], [data-testid]"
  );

  for (const element of elements) {
    const description = describeElementForLoginCheck(element);

    if (loginTerms.test(description)) {
      evidence.push(description);
    }

    if (evidence.length >= 30) {
      break;
    }
  }

  return evidence.length > 0
    ? evidence.join("\n").slice(0, 3000)
    : "No obvious login-related DOM signals found.";
}

function describeElementForLoginCheck(element) {
  const parts = [element.tagName.toLowerCase()];
  const text = element.innerText ?? element.textContent ?? "";

  addLoginEvidencePart(parts, "text", text);
  addLoginEvidencePart(parts, "path", getElementLinkPath(element));
  addLoginEvidencePart(parts, "aria-label", element.getAttribute("aria-label"));
  addLoginEvidencePart(parts, "title", element.getAttribute("title"));
  addLoginEvidencePart(parts, "role", element.getAttribute("role"));
  addLoginEvidencePart(parts, "test-id", element.getAttribute("data-testid"));

  return parts.join(" | ");
}

function getElementLinkPath(element) {
  const href = element.getAttribute("href");

  if (!href) {
    return "";
  }

  try {
    return new URL(href, location.href).pathname;
  } catch {
    return "";
  }
}

function addLoginEvidencePart(parts, name, value) {
  const cleanValue = value?.replace(/\s+/g, " ").trim();

  if (cleanValue) {
    parts.push(`${name}: ${cleanValue.slice(0, 160)}`);
  }
}
