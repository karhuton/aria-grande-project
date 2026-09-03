import { runAccountAction } from "./actions-account.mjs";

export function runRegisterAction() {
  return runAccountAction("Register");
}

