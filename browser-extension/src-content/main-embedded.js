import { initialiseActions } from "./dialog-actions.mjs";
import { scheduleInitialisation } from "./settings.mjs";

async function initialiseWhenIntroductionIsClosed() {
  while (window.BLOCK_ARIA_GRANDE) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await initialiseActions();
}

scheduleInitialisation(initialiseWhenIntroductionIsClosed);
