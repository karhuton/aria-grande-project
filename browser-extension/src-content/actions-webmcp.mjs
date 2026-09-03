const WEBMCP_ACTION_TOOLS = {
  "Read page": "ariag-read",
  Summarise: "ariag-summarise",
  Search: "ariag-search",
  Ask: "ariag-ask",
  Frontpage: "ariag-frontpage",
  Explore: "ariag-navigate",
  Login: "ariag-login",
  Register: "ariag-register"
};

export async function executeWebMcpAction(action, actionInput = {}) {
  const toolName = WEBMCP_ACTION_TOOLS[action];

  if (!toolName) {
    throw new Error(`Unknown Aria Grande action: ${action}`);
  }

  const modelContext = document.modelContext;

  if (
    !modelContext ||
    typeof modelContext.getTools !== "function" ||
    typeof modelContext.executeTool !== "function"
  ) {
    throw new Error("This page does not provide WebMCP actions.");
  }

  const tools = await modelContext.getTools();
  const tool = tools.find(candidate => candidate.name === toolName);

  if (!tool) {
    throw new Error(`This page does not provide the ${action} action.`);
  }

  const input = getToolInput(tool, action, actionInput);
  const result = await modelContext.executeTool(tool, input);

  if (result === undefined) {
    throw new Error(`The ${action} action returned no result.`);
  }

  return { tool, result };
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
