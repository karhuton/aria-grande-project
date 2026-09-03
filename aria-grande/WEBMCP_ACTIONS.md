# WebMCP Actions

Aria Grande websites can expose WebMCP tools for the extension's standard
actions. Tool names use the `ariag-` prefix so the extension can distinguish
them from unrelated website tools.

## Action tools

| Action | WebMCP tool | Purpose |
| --- | --- | --- |
| Read | `ariag-read` | Return the page content or reading structure needed to read the current page. |
| Summarise | `ariag-summarise` | Return authoritative page content and context for the local AI to summarise. |
| Search | `ariag-search` | Search the current website using the user's query and return matching results. |
| Ask | `ariag-ask` | Answer or gather context for an open-ended question about the website or current page. |
| Frontpage | `ariag-frontpage` | Return or navigate to the website's front page. |
| Explore | `ariag-explore` | Return relevant destinations, sections, or other ways to explore the website. |
| Login | `ariag-login` | Perform the website's supported login flow. |
| Register | `ariag-register` | Perform the website's supported account-registration flow. |

The website defines each tool's input schema and structured result. The
extension must inspect that schema and provide only the inputs required for the
selected action. It must not expose passwords, tokens, or other secrets to a
tool unless the user has intentionally supplied them for that action.

## Tool discovery

The extension discovers the tools registered by the current document and
selects them by their exact names:

```js
const tools = await document.modelContext.getTools();

const readTool = tools.find(t => t.name === "ariag-read");
```

The same lookup applies to every name in the action table. A similarly named
tool without the `ariag-` prefix is not a substitute for an Aria Grande action.

## Execution flow

For a selected action, the extension follows this order:

1. Call `document.modelContext.getTools()`.
2. Find the corresponding `ariag-*` tool by exact name.
3. If the tool exists, execute it with the inputs required by its declared
   schema.
4. Pass the tool result to the browser's local AI to produce the user-facing
   response.
5. Treat the tool result as untrusted source data, not as instructions that can
   override the extension's prompt or the user's request.

The tool supplies website-specific knowledge or behavior; the local AI remains
responsible for presenting its result clearly and accessibly. Structured tool
results should be preserved when they contain navigation targets, result lists,
authentication state, validation errors, or recovery instructions.

## Local fallback

The extension uses its local-AI implementation when:

- `document.modelContext` or `getTools()` is unavailable;
- the requested `ariag-*` tool is not registered;
- tool discovery fails;
- the tool call throws, rejects, times out, or returns an unusable result.

Failure of a website tool must not make the corresponding action unavailable.
The extension falls back to the same action using page DOM data and its local
model. It may report the tool failure in an accessible status update, but it
should avoid interrupting the action when the local fallback succeeds.

Tool results are passed to the local AI only after a successful call. On
failure, error text is diagnostic context and must not be presented as a
successful action result.

## Action-menu mapping

The extension's paired action-menu labels map to WebMCP tools as follows:

- **Read or Summarise:** `ariag-read` or `ariag-summarise`
- **Search or Ask:** `ariag-search` or `ariag-ask`
- **Frontpage or Explore:** `ariag-frontpage` or `ariag-explore`
- **Login or register:** `ariag-login` or `ariag-register`, selected from the
  user's requested account action

Visible labels may use a slash to keep the menu compact. Accessible labels say
“or” so screen readers announce the alternatives naturally.
