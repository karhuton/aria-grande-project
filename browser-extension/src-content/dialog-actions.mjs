import { runAction } from "./actions.mjs";
import {
  closeActionsDialog,
  getActionButtons,
  getExploreDialog,
  initialiseDialogs,
  isActionsDialogOpen,
  openActionsDialog
} from "./dialog.mjs";
import { returnToActions } from "./dialog-navigate.mjs";

const LONG_CLICK_DELAY = 600;
const longClickTimers = new WeakMap();
const suppressedClicks = new WeakSet();

export async function initialiseActions() {
  await initialiseDialogs();
  attachButtonHandlers();
  window.addEventListener("keydown", handleWindowKeydown, true);
  openActionsDialog();
}

function attachButtonHandlers() {
  for (const button of getActionButtons().querySelectorAll("button")) {
    if (button.hasAttribute("data-cancel")) {
      button.addEventListener("click", closeActionsDialog);
      continue;
    }
    if (button.hasAttribute("data-long-click-action")) {
      button.addEventListener("pointerdown", handlePointerDown);
      button.addEventListener("pointerup", cancelLongClick);
      button.addEventListener("pointercancel", cancelLongClick);
      button.addEventListener("pointerleave", cancelLongClick);
      button.addEventListener("contextmenu", preventContextMenu);
    }
    button.addEventListener("click", handleButtonClick);
  }
}

function handlePointerDown(event) {
  if (!event.isPrimary || event.button !== 0) {
    return;
  }

  const button = event.currentTarget;
  clearLongClickTimer(button);
  suppressedClicks.delete(button);

  const timer = setTimeout(handleLongClick, LONG_CLICK_DELAY, button);
  longClickTimers.set(button, timer);
}

function handleLongClick(button) {
  longClickTimers.delete(button);
  suppressedClicks.add(button);
  runAction(button.dataset.longClickAction);
}

function cancelLongClick(event) {
  clearLongClickTimer(event.currentTarget);
}

function clearLongClickTimer(button) {
  clearTimeout(longClickTimers.get(button));
  longClickTimers.delete(button);
}

function preventContextMenu(event) {
  event.preventDefault();
}

function handleButtonClick(event) {
  const button = event.currentTarget;

  if (suppressedClicks.has(button)) {
    event.preventDefault();
    suppressedClicks.delete(button);
    return;
  }

  runAction(button.dataset.clickAction);
}

function handleWindowKeydown(event) {
  if (event.key !== "Escape") return;
  if (getExploreDialog().open) {
    event.preventDefault();
    returnToActions();
    return;
  }
  if (!isActionsDialogOpen()) {
    event.preventDefault();
    openActionsDialog();
  }
}

