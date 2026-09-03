import { initialiseActions } from "./dialog-actions.mjs";
import { scheduleInitialisation } from "./settings.mjs";

scheduleInitialisation(initialiseActions);

