import { runAccountAction } from "./actions-account.mjs";

export function runLoginAction() {
  return runAccountAction("Login");
}

