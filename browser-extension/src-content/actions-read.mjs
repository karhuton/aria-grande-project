import { closeActionsDialog, updateStatus } from "./dialog.mjs";

export function prepareReadFallback() {
  updateStatus("Returning to the page.");
  closeActionsDialog();
  return { tool: null, result: undefined };
}

