import { prepareAskFallback } from "./actions-ask.mjs";
import { prepareExploreFallback, runExploreFallback } from "./actions-navigate.mjs";
import { applyFrontpageFallbackDecision, prepareFrontpageFallback } from "./actions-frontpage.mjs";
import { runLoginAction } from "./actions-login.mjs";
import { prepareReadFallback } from "./actions-read.mjs";
import { runRegisterAction } from "./actions-register.mjs";
import { applySearchFallbackDecision, prepareSearchFallback } from "./actions-search.mjs";
import { prepareSummariseFallback } from "./actions-summarise.mjs";
import { executeWebMcpAction } from "./actions-webmcp.mjs";
import { updateStatus } from "./dialog.mjs";
import { buildToolResultPrompt, destroyLanguageModelSession, getLanguageModelSession, serialiseToolResult } from "./local-model.mjs";
import { navigateToHostFrontpage } from "./navigation.mjs";
import { getErrorMessage } from "./utils.mjs";

export function runAction(action) {
  if (action === "Login") { void runLoginAction(); return; }
  if (action === "Register") { void runRegisterAction(); return; }
  void runWebMcpAction(action);
}

export async function runWebMcpAction(action) {
  const actionInput = getActionInputFromUser(action);

  if (actionInput === null) {
    return;
  }

  updateStatus(`${action} in progress…`);
  let session;
  let execution;

  try {
    execution = await executeWebMcpActionWithFallback(action, actionInput);
    const { tool, result, prompt: fallbackPrompt } = execution;

    if (execution.fallbackAction === "navigate") {
      session = await getLanguageModelSession();
      await runExploreFallback(session, execution.elements);
      return;
    }

    if (execution.complete || (!tool && !fallbackPrompt)) {
      return;
    }

    const prompt =
      fallbackPrompt ?? buildToolResultPrompt(action, tool, result);
    session = await getLanguageModelSession();
    updateStatus("Preparing response…");

    const response = await session.prompt(prompt);

    if (execution.fallbackAction === "search") {
      await applySearchFallbackDecision(
        response,
        execution.candidates,
        actionInput.query
      );
      return;
    }

    if (execution.fallbackAction === "frontpage") {
      applyFrontpageFallbackDecision(response, execution.urls);
      return;
    }

    updateStatus(`${action} complete.`);
    alert(response);
  } catch (error) {
    if (execution?.fallbackAction === "frontpage") {
      navigateToHostFrontpage();
      return;
    }

    updateStatus(`${action} unavailable.`);
    alert(getErrorMessage(error));
  } finally {
    destroyLanguageModelSession(session);
  }
}

function getActionInputFromUser(action) {
  if (action === "Search") {
    const query = window.prompt("What would you like to search for?");

    if (!query?.trim()) {
      updateStatus("Search cancelled.");
      return null;
    }

    return { query: query.trim() };
  }

  if (action === "Ask") {
    const question = window.prompt("What would you like to ask?");

    if (!question?.trim()) {
      updateStatus("Ask cancelled.");
      return null;
    }

    return { question: question.trim() };
  }

  return {};
}

async function executeWebMcpActionWithFallback(action, actionInput = {}) {
  try {
    const execution = await executeWebMcpAction(action, actionInput);
    serialiseToolResult(execution.result);
    return execution;
  } catch (error) {
    if (action === "Read page") {
      return prepareReadFallback();
    }

    if (action === "Summarise") {
      updateStatus("Summarising page locally…");
      return prepareSummariseFallback();
    }

    if (action === "Search") {
      return prepareSearchFallback(actionInput.query);
    }

    if (action === "Ask") {
      updateStatus("Answering from the page…");
      return prepareAskFallback(actionInput.question);
    }

    if (action === "Frontpage") {
      return prepareFrontpageFallback();
    }

    if (action === "Navigate") {
      return prepareExploreFallback();
    }

    throw error;
  }
}
