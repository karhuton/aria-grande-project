import { runAction } from "./actions.mjs";
import {
  closeActionsDialog,
  getActionButtons,
  getExploreButtons,
  getExploreDialog,
  initialiseDialogs,
  isActionsDialogOpen,
  openActionsDialog
} from "./dialog.mjs";
import { returnToActions } from "./dialog-navigate.mjs";

const LONG_CLICK_DELAY = 600;
const longClickTimers = new WeakMap();
const suppressedClicks = new WeakSet();
const keyboardLongClickKeys = new WeakMap();
const keyboardLongClickTriggered = new WeakSet();

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
      button.addEventListener("keydown", handleKeyboardDown);
      button.addEventListener("keyup", handleKeyboardUp);
      button.addEventListener("blur", cancelKeyboardLongClick);
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

function handleKeyboardDown(event) {
  if (!isActivationKey(event.key)) return;

  event.preventDefault();
  if (event.repeat || keyboardLongClickKeys.has(event.currentTarget)) return;

  const button = event.currentTarget;
  clearLongClickTimer(button);
  suppressedClicks.delete(button);
  keyboardLongClickTriggered.delete(button);
  keyboardLongClickKeys.set(button, event.key);

  const timer = setTimeout(handleKeyboardLongClick, LONG_CLICK_DELAY, button);
  longClickTimers.set(button, timer);
}

function handleKeyboardUp(event) {
  if (!isActivationKey(event.key)) return;

  const button = event.currentTarget;
  if (keyboardLongClickKeys.get(button) !== event.key) return;

  event.preventDefault();
  keyboardLongClickKeys.delete(button);
  clearLongClickTimer(button);

  if (keyboardLongClickTriggered.has(button)) {
    keyboardLongClickTriggered.delete(button);
    return;
  }

  runAction(button.dataset.clickAction);
}

function cancelKeyboardLongClick(event) {
  const button = event.currentTarget;
  keyboardLongClickKeys.delete(button);
  keyboardLongClickTriggered.delete(button);
  clearLongClickTimer(button);
}

function isActivationKey(key) {
  return key === "Enter" || key === " ";
}

function handleKeyboardLongClick(button) {
  longClickTimers.delete(button);
  keyboardLongClickTriggered.add(button);
  runAction(button.dataset.longClickAction);
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
  if (event.key === "Escape" && getExploreDialog().open) {
    event.preventDefault();
    returnToActions();
    return;
  }

  if (event.key === "Escape" && !isActionsDialogOpen()) {
    event.preventDefault();
    openActionsDialog();
    return;
  }

  if (getExploreDialog().open) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusAdjacentButton(getExploreButtons(), 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusAdjacentButton(getExploreButtons(), -1);
    }
    return;
  }

  if (!isActionsDialogOpen()) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    focusAdjacentButton(getActionButtons(), 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    focusAdjacentButton(getActionButtons(), -1);
  }
}

function focusAdjacentButton(container, direction) {
  const buttons = [...container.querySelectorAll("button:not(:disabled)")]
    .filter((button) => !button.closest("[hidden]"));

  if (buttons.length === 0) return;

  const currentIndex = buttons.indexOf(
    container.querySelector("button:focus")
  );
  const nextIndex = currentIndex === -1
    ? direction === 1 ? 0 : buttons.length - 1
    : (currentIndex + direction + buttons.length) % buttons.length;

  buttons[nextIndex].focus();
}
