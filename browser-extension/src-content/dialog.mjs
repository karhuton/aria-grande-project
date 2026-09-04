import templateHtml from "./content.html";

let actionsDialog;
let actionButtons;
let actionStatus;
let defaultActionStatus;
let navigateDialog;
let navigateTitle;
let navigateButtons;
let navigateStatus;

export async function initialiseDialogs() {
  const templateHtml = await loadDialogTemplate();
  const host = createDialogHost(templateHtml);
  const shadow = host.shadowRoot;

  actionsDialog = getRequiredElement(shadow, "dialog");
  actionButtons = getRequiredElement(shadow, ".buttons");
  actionStatus = getRequiredElement(shadow, "#status");
  defaultActionStatus = actionStatus.textContent;
  navigateDialog = getRequiredElement(shadow, "#navigate-dialog");
  navigateTitle = getRequiredElement(shadow, "#navigate-title");
  navigateButtons = getRequiredElement(shadow, "#navigate-buttons");
  navigateStatus = getRequiredElement(shadow, "#navigate-status");

  document.documentElement.append(host);
}

async function loadDialogTemplate() {
  return templateHtml;
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
export function getExploreDialog() { return navigateDialog; }
export function getExploreTitle() { return navigateTitle; }
export function getExploreButtons() { return navigateButtons; }
export function getExploreStatus() { return navigateStatus; }

export function updateStatus(message) {
  actionStatus.textContent = message;
}

export function closeActionsDialog() {
  actionsDialog.close();
}

export function openActionsDialog() {
  if (actionsDialog.open) return;
  updateStatus(defaultActionStatus);
  actionsDialog.showModal();
  actionButtons.querySelector("button").focus();
}

export function isActionsDialogOpen() {
  return actionsDialog.open;
}
