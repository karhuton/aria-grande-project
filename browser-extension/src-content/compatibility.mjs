/**
 * Checks the APIs in the extension content-script context, where
 * LanguageModel is available to Aria Grande.
 *
 * @returns {Promise<{supported: boolean, webmcp: boolean, localModel: boolean}>}
 */
export async function checkBrowserAiSupport({ webmcpTimeoutMs = 2000 } = {}) {
  const webmcp = await waitForWebMcp(webmcpTimeoutMs);
  const ariaFallback = hasAriaFallback();
  const localModel = await checkLocalModel();

  // WebMCP and the page fallback are interchangeable action providers.
  return { supported: localModel && (webmcp || ariaFallback), webmcp, ariaFallback, localModel };
}

function hasAriaFallback() {
  return Boolean(window.ariag && typeof window.ariag.summarise === "function");
}

async function waitForWebMcp(timeoutMs) {
  for (let attempt = 0; attempt < Math.ceil(timeoutMs / 100); attempt += 1) {
    if (
      (typeof navigator !== "undefined" && "modelContext" in navigator) ||
      (typeof document !== "undefined" && "modelContext" in document)
    ) {
      return true;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return false;
}

async function checkLocalModel() {
  if (!("LanguageModel" in globalThis)) {
    return false;
  }

  try {
    const availability = await LanguageModel.availability({
      expectedInputs: [{ type: "text", languages: ["en"] }],
      expectedOutputs: [{ type: "text", languages: ["en"] }]
    });

    // The extension initializes/downloads the model lazily when an action is used.
    return availability !== "unavailable";
  } catch (error) {
    console.debug("Could not check local model availability.", error);
    return false;
  }
}

export function showCompatibilityError(report) {
  const missing = !report.localModel
    ? "a local AI model"
    : "WebMCP or the Aria Grande page fallback";
  const chromeGuidance = isChrome()
    ? `<p>In Chrome, enable WebMCP at <code>chrome://flags/#enable-webmcp-testing</code>, relaunch Chrome, and reload this page.</p>`
    : "";
  const dialog = document.createElement("dialog");

  dialog.setAttribute("aria-labelledby", "aria-grande-compatibility-error-title");
  dialog.innerHTML = `
    <h1 id="aria-grande-compatibility-error-title">Browser not supported</h1>
    <p>Aria Grande needs ${missing} to work.</p>
    <p>Use the latest version of <strong>Google Chrome</strong> or <strong>Codex</strong>, then reload this page.</p>
    ${chromeGuidance}
    <form method="dialog">
      <button type="submit">Close</button>
    </form>
  `;

  document.body.append(dialog);
  dialog.showModal();
}

function isChrome() {
  const userAgent = navigator.userAgent;
  return /Chrome\//.test(userAgent) && !/Edg\//.test(userAgent) && !/OPR\//.test(userAgent);
}
