import { runAccountAction } from "./actions-account.mjs";

export function runRegisterAction(signal) {
  return runAccountAction("Register", signal);
}
