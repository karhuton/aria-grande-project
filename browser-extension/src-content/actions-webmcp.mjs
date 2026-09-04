const WEBMCP_ACTION_TOOLS = {
  "Read page": "ariag-read",
  Summarise: "ariag-summarise",
  Search: "ariag-search",
  Ask: "ariag-ask",
  Frontpage: "ariag-frontpage",
  Navigate: "ariag-navigate",
  Login: "ariag-login",
  Register: "ariag-register"
};

function throwIfAborted(signal) {
  if (signal?.aborted) {
    throw signal.reason ?? new DOMException("The action was cancelled.", "AbortError");
  }
}

export async function executeWebMcpAction(action, actionInput = {}, options = {}) {
  const toolName = WEBMCP_ACTION_TOOLS[action];

  if (!toolName) {
    throw new Error(`Unknown Aria Grande action: ${action}`);
  }

  const modelContext = document.modelContext;
  const signal = options.signal;

  throwIfAborted(signal);

  if (
    !modelContext ||
    typeof modelContext.getTools !== "function" ||
    typeof modelContext.executeTool !== "function"
  ) {
    throw new Error("This page does not provide WebMCP actions.");
  }

  const tools = await modelContext.getTools();
  throwIfAborted(signal);
  const tool = tools.find(candidate => candidate.name === toolName);

  if (!tool) {
    throw new Error(`This page does not provide the ${action} action.`);
  }

  const input = getToolInput(tool, action, actionInput);
  const result = await modelContext.executeTool(tool, input, { signal });
  throwIfAborted(signal);

  if (result === undefined) {
    throw new Error(`The ${action} action returned no result.`);
  }

  if (isDirectNavigationAction(action)) {
    const url = getDirectUrl(result);

    if (url) {
      window.location.assign(url);
      return { complete: true, result };
    }
  }

  return { tool, result };
}

export async function executeAriaFallbackAction(action, actionInput = {}, options = {}) {
  const method = {
    "Read page": "read",
    Summarise: "summarise",
    Search: "search",
    Ask: "ask",
    Frontpage: "frontpage",
    Navigate: "navigate",
    Login: "login"
  }[action];
  const ariaFallback = window.ariag;

  if (!method || !ariaFallback || typeof ariaFallback[method] !== "function") {
    throw new Error(`This page does not provide the ${action} fallback.`);
  }

  throwIfAborted(options.signal);
  const result = await ariaFallback[method](
    action === "Search" ? actionInput.query : action === "Ask" ? actionInput.question : undefined
  );
  throwIfAborted(options.signal);

  if (isDirectNavigationAction(action)) {
    const url = getDirectUrl(result);

    if (url) {
      window.location.assign(url);
      return { complete: true, result };
    }
  }

  return {
    tool: { name: `ariag-${method}` },
    result,
    complete: true,
    directResult: action === "Summarise" || action === "Ask"
  };
}

function isDirectNavigationAction(action) {
  return action === "Frontpage" || action === "Search" || action === "Ask";
}

function getDirectUrl(result) {
  if (typeof result !== "string") {
    return null;
  }

  const value = result.trim();
  const bracketedUrl = /^\[([^\]]+)\]$/.exec(value)?.[1]?.trim();
  const candidate = bracketedUrl ?? value;

  try {
    const url = new URL(candidate, window.location.href);
    return url.href;
  } catch {
    return null;
  }
}

function getToolInput(tool, action, actionInput = {}) {
  const requiredProperties = tool.inputSchema?.required;

  if (action === "Search" && actionInput.query) {
    const queryProperty = getTextInputProperty(tool.inputSchema, [
      "query",
      "q",
      "search",
      "searchTerm",
      "term"
    ]);

    if (queryProperty) {
      return { [queryProperty]: actionInput.query };
    }
  }

  if (action === "Ask" && actionInput.question) {
    const questionProperty = getTextInputProperty(tool.inputSchema, [
      "question",
      "query",
      "prompt",
      "request",
      "ask"
    ]);

    if (questionProperty) {
      return { [questionProperty]: actionInput.question };
    }
  }

  if (Array.isArray(requiredProperties) && requiredProperties.length > 0) {
    throw new Error(
      `${action} requires additional input, which is not supported yet.`
    );
  }

  return {};
}

function getTextInputProperty(inputSchema, preferredNames) {
  const properties = inputSchema?.properties;

  if (!properties || typeof properties !== "object") {
    return null;
  }

  const requiredProperties = Array.isArray(inputSchema.required)
    ? inputSchema.required
    : [];
  const requiredStringProperty = requiredProperties.find(name => {
    const property = properties[name];
    return !property?.type || property.type === "string";
  });

  if (requiredStringProperty && requiredProperties.length === 1) {
    return requiredStringProperty;
  }

  return preferredNames.find(name => {
    const property = properties[name];
    return property && (!property.type || property.type === "string");
  }) ?? null;
}
