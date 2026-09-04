import { initialiseActions } from "./dialog-actions.mjs";
import { scheduleInitialisation } from "./settings.mjs";
import {
  checkBrowserAiSupport,
  showCompatibilityError
} from "./compatibility.mjs";

async function initialiseWhenIntroductionIsClosed() {
  while (window.BLOCK_ARIA_GRANDE) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const report = await checkBrowserAiSupport();
  console.info("Aria Grande browser AI support:", report);

  if (!report.supported) {
    showCompatibilityError(report);
    return;
  }

  await initialiseActions();
}

scheduleInitialisation(initialiseWhenIntroductionIsClosed);
