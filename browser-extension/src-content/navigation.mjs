import { closeActionsDialog, updateStatus } from "./dialog.mjs";

export function navigateToHostFrontpage() {
  const url = new URL(location.href);
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  navigateToUrl(url.href);
}

export function navigateToUrl(url) {
  const destination = new URL(url, location.href);

  if (["javascript:", "data:", "vbscript:"].includes(destination.protocol)) {
    navigateToHostFrontpage();
    return;
  }

  updateStatus("Opening the front page…");
  closeActionsDialog();
  location.assign(destination.href);
}

