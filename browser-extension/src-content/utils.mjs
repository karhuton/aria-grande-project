export function getExtensionApi() {
  return globalThis.browser ?? globalThis.chrome;
}

export function parseJsonObject(value) {
  if (typeof value !== "string") {
    return null;
  }

  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");

  if (start < 0 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(value.slice(start, end + 1));
  } catch {
    return null;
  }
}

export function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : "Could not complete this action.";
}

