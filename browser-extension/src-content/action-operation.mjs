let activeController;

export function startActionOperation() {
  cancelActionOperation();
  activeController = new AbortController();
  return activeController;
}

export function cancelActionOperation() {
  if (!activeController) {
    return;
  }

  activeController.abort();
  activeController = undefined;
}

export function finishActionOperation(controller) {
  if (activeController === controller) {
    activeController = undefined;
  }
}

export function throwIfActionAborted(signal) {
  if (signal?.aborted) {
    throw signal.reason ?? new DOMException("The action was cancelled.", "AbortError");
  }
}

export function isActionAbort(error, signal) {
  return signal?.aborted || error?.name === "AbortError";
}
