import { getExtensionApi } from "./utils.mjs";

const DEFAULT_ACTION_MENU_SETTINGS = {
  actionMenuEnabled: true,
  actionMenuDelaySeconds: 1
};

export async function scheduleInitialisation(initialise) {
  let settings = DEFAULT_ACTION_MENU_SETTINGS;
  try {
    settings = await getExtensionApi().storage.local.get(DEFAULT_ACTION_MENU_SETTINGS);
  } catch (error) {
    console.warn("Could not load Aria Grande settings; using defaults.", error);
  }
  if (!settings.actionMenuEnabled) return;
  const delay = normaliseActionMenuDelay(settings.actionMenuDelaySeconds);
  setTimeout(() => void initialise().catch(handleInitialisationError), delay * 1000);
}

function normaliseActionMenuDelay(value) {
  const delay = Number.parseInt(value, 10);

  if (!Number.isFinite(delay)) {
    return DEFAULT_ACTION_MENU_SETTINGS.actionMenuDelaySeconds;
  }

  return Math.min(5, Math.max(0, delay));
}

function handleInitialisationError(error) {
  console.error("Could not initialise Aria Grande:", error);
}

