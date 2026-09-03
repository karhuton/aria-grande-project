import { getExtensionApi } from "./utils.mjs";

let actionsDialog;
let actionButtons;
let actionStatus;
let exploreDialog;
let exploreTitle;
let exploreButtons;
let exploreStatus;

export async function initialiseDialogs() {
  const templateHtml = await loadDialogTemplate();
  const host = createDialogHost(templateHtml);
  const shadow = host.shadowRoot;

  actionsDialog = getRequiredElement(shadow, "dialog");
  actionButtons = getRequiredElement(shadow, ".buttons");
  actionStatus = getRequiredElement(shadow, "#status");
  exploreDialog = getRequiredElement(shadow, "#explore-dialog");
  exploreTitle = getRequiredElement(shadow, "#explore-title");
  exploreButtons = getRequiredElement(shadow, "#explore-buttons");
  exploreStatus = getRequiredElement(shadow, "#explore-status");

  document.documentElement.append(host);
}

async function loadDialogTemplate() {
  const runtime = getExtensionApi().runtime;
  const response = await fetch(runtime.getURL("content.html"));

  if (!response.ok) {
    throw new Error(`Could not load content.html: ${response.status}`);
  }

  return response.text();
}

function createDialogHost(templateHtml) {
  const host = document.createElement("div");
  host.id = "aria-grande-actions";

  if (typeof host.setHTMLUnsafe === "function") {
    host.setHTMLUnsafe(templateHtml);
  } else {
    host.innerHTML = templateHtml;
  }

  if (!host.shadowRoot) {
    hydrateShadowRoot(host, templateHtml);
  }

  return host;
}

function hydrateShadowRoot(host, templateHtml) {
  let template = host.querySelector("template[shadowrootmode]");

  if (!template) {
    host.innerHTML = templateHtml;
    template = host.querySelector("template[shadowrootmode]");
  }

  if (!template) {
    throw new Error("content.html does not contain a Shadow DOM template.");
  }

  const content = template.content.cloneNode(true);
  template.remove();
  host.attachShadow({ mode: "open" }).append(content);
}

function getRequiredElement(root, selector) {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`content.html is missing required element: ${selector}`);
  }

  return element;
}

export function getActionButtons() { return actionButtons; }
export function getExploreDialog() { return exploreDialog; }
export function getExploreTitle() { return exploreTitle; }
export function getExploreButtons() { return exploreButtons; }
export function getExploreStatus() { return exploreStatus; }

export function updateStatus(message) {
  actionStatus.textContent = message;
}

export function closeActionsDialog() {
  actionsDialog.close();
}

export function openActionsDialog() {
  if (actionsDialog.open) return;
  actionsDialog.showModal();
  actionButtons.querySelector("button").focus();
}

export function isActionsDialogOpen() {
  return actionsDialog.open;
}

