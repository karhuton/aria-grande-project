import { runAccountAction } from "./actions-account.mjs";

export function runLoginAction(signal) {
  return runAccountAction("Login", signal);
}
