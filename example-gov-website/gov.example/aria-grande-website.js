(() => {
  const modelContext = document.modelContext;
  const siteRoot = document.currentScript?.src
    ? new URL(".", document.currentScript.src)
    : new URL("/", window.location.href);

  const ariag = window.ariag ?? {};
  ariag.read = () => document.body.innerText;
  ariag.summarise = () => fetchOptionalText(getCurrentSidecarUrl("summary.txt"));
  ariag.search = query => {
    const searchUrl = new URL("search.html", siteRoot);
    searchUrl.searchParams.set("q", query);
    window.location.assign(searchUrl);
    return `Opening search results for: ${query}`;
  };
  ariag.ask = query => {
    const askUrl = new URL("ask.html", siteRoot);
    askUrl.searchParams.set("q", query);
    return fetchOptionalText(askUrl);
  };
  ariag.frontpage = () => new URL("index.html", siteRoot).href;
  ariag.navigate = getNavigation;
  ariag.login = () => "The gov.example website does not include login or registration.";
  window.ariag = ariag;

  if (!modelContext || typeof modelContext.registerTool !== "function") {
    return;
  }

  void registerTools();

  async function registerTools() {
    const tools = [
      {
        name: "ariag-summarise",
        description: "Return the static summary for the current GOV.EXAMPLE page.",
        inputSchema: emptyInputSchema(),
        annotations: { readOnlyHint: true },
        execute: ariag.summarise
      },
      {
        name: "ariag-search",
        description: "Open GOV.EXAMPLE search results for the supplied query.",
        inputSchema: queryInputSchema(),
        execute: ({ query }) => ariag.search(query)
      },
      {
        name: "ariag-ask",
        description: "Ask the GOV.EXAMPLE assistant a question.",
        inputSchema: queryInputSchema(),
        annotations: { readOnlyHint: true },
        execute: ({ query }) => ariag.ask(query)
      },
      {
        name: "ariag-frontpage",
        description: "Return the GOV.EXAMPLE frontpage link.",
        inputSchema: emptyInputSchema(),
        annotations: { readOnlyHint: true },
        execute: ariag.frontpage
      },
      {
        name: "ariag-navigate",
        description: "Return navigation for the current page and the GOV.EXAMPLE frontpage.",
        inputSchema: emptyInputSchema(),
        annotations: { readOnlyHint: true },
        execute: ariag.navigate
      },
      {
        name: "ariag-login",
        description: "Explain whether GOV.EXAMPLE has login or registration.",
        inputSchema: emptyInputSchema(),
        annotations: { readOnlyHint: true },
        execute: ariag.login
      }
    ];

    try {
      await Promise.all(tools.map(tool => modelContext.registerTool(tool)));
    } catch (error) {
      console.warn("Could not register Aria Grande WebMCP tools.", error);
    }
  }

  function emptyInputSchema() {
    return { type: "object", properties: {} };
  }

  function queryInputSchema() {
    return {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query or question."
        }
      },
      required: ["query"]
    };
  }

  function getCurrentSidecarUrl(kind) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.pathname = url.pathname.replace(/\.html?$/i, `.${kind}`);
    return url;
  }

  async function getNavigation() {
    const [currentPageNavigation, frontpageNavigation] = await Promise.all([
      fetchOptionalText(getCurrentSidecarUrl("nav.txt")),
      fetchOptionalText(new URL("index.nav.txt", siteRoot))
    ]);

    return [currentPageNavigation, frontpageNavigation]
      .filter(Boolean)
      .join("\n\n") || null;
  }

  async function fetchOptionalText(url) {
    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Could not fetch ${url.pathname}: ${response.status}`);
    }

    return response.text();
  }
})();
