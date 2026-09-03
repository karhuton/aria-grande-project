const DEFAULT_SETTINGS = {
  actionMenuEnabled: true,
  actionMenuDelaySeconds: 1
};

let settingsForm;
let actionMenuEnabled;
let actionMenuDelay;
let settingsStatus;

async function initialiseMenu() {
  settingsForm = document.querySelector("#settings-form");
  actionMenuEnabled = document.querySelector("#action-menu-enabled");
  actionMenuDelay = document.querySelector("#action-menu-delay");
  settingsStatus = document.querySelector("#status");

  settingsForm.addEventListener("submit", saveChanges);
  document.querySelector("#cancel").addEventListener("click", cancelChanges);

  const settings = await getExtensionApi().storage.local.get(DEFAULT_SETTINGS);
  actionMenuEnabled.checked = settings.actionMenuEnabled;
  actionMenuDelay.value = normaliseDelay(settings.actionMenuDelaySeconds);
}

function getExtensionApi() {
  return globalThis.browser ?? globalThis.chrome;
}

async function saveChanges(event) {
  event.preventDefault();
  updateSettingsStatus("Saving changes…");

  await getExtensionApi().storage.local.set({
    actionMenuEnabled: actionMenuEnabled.checked,
    actionMenuDelaySeconds: normaliseDelay(actionMenuDelay.value)
  });

  updateSettingsStatus("Changes saved.");
  window.close();
}

function cancelChanges() {
  window.close();
}

function normaliseDelay(value) {
  const delay = Number.parseInt(value, 10);

  if (!Number.isFinite(delay)) {
    return DEFAULT_SETTINGS.actionMenuDelaySeconds;
  }

  return Math.min(5, Math.max(0, delay));
}

function updateSettingsStatus(message) {
  settingsStatus.textContent = message;
}

function startMenu() {
  void initialiseMenu().catch(handleMenuError);
}

function handleMenuError(error) {
  updateSettingsStatus("Could not load or save settings.");
  console.error("Aria Grande settings error:", error);
}

document.addEventListener("DOMContentLoaded", startMenu);
