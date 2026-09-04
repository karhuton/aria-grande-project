(() => {
  const query = new URLSearchParams(window.location.search).get("q")?.trim() || "";
  const queryHeading = document.querySelector("#search-query");
  const queryInput = document.querySelector("#site-search");
  const results = document.querySelector("#search-results");
  const status = document.querySelector("#search-status");

  if (queryHeading) {
    queryHeading.textContent = query ? `Search results for: ${query}` : "Search GOV.EXAMPLE";
  }
  if (queryInput) {
    queryInput.value = query;
  }
  if (!results || !status) {
    return;
  }

  const stopWords = new Set([
    "a", "about", "an", "and", "are", "as", "at", "be", "by", "for",
    "from", "how", "in", "into", "is", "it", "of", "on", "or", "that",
    "the", "this", "to", "was", "what", "when", "where", "which", "who",
    "why", "with"
  ]);

  const keywords = query
    .toLocaleLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}'-]/gu, ""))
    .filter((word, index, words) => word && !stopWords.has(word) && words.indexOf(word) === index);

  if (!keywords.length) {
    status.textContent = query ? "Enter a search term that is not a common article or preposition." : "Enter a search term to find information.";
    return;
  }

  fetch("content.txt")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load search contents (${response.status}).`);
      }
      return response.text();
    })
    .then((contents) => {
      const pages = contents.split(/\n\n(?=Page:\s)/).map(parsePage).filter(Boolean);
      const rankedPages = pages
        .map((page) => ({
          ...page,
          score: keywords.reduce((score, keyword) => {
            const matches = page.content.toLocaleLowerCase().match(
              new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(keyword)}(?=$|[^\\p{L}\\p{N}])`, "gu")
            );
            return score + (matches ? matches.length * keyword.length : 0);
          }, 0)
        }))
        .filter((page) => page.score > 0)
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));

      results.replaceChildren();
      if (!rankedPages.length) {
        status.textContent = "No results found.";
        return;
      }

      status.textContent = `${rankedPages.length} result${rankedPages.length === 1 ? "" : "s"} found.`;
      for (const page of rankedPages) {
        const item = document.createElement("li");
        const title = document.createElement("h2");
        const link = document.createElement("a");
        const description = document.createElement("p");
        link.href = page.url;
        link.textContent = page.title;
        description.textContent = page.description;
        title.append(link);
        item.append(title, description);
        results.append(item);
      }
    })
    .catch((error) => {
      status.textContent = "Search is temporarily unavailable.";
      console.error(error);
    });

  function parsePage(page) {
    const header = page.match(/^Page:\s*(.+)\nTitle:\s*(.*)\nDescription:\s*(.*)\n<TEXT-CONTENT>\n([\s\S]*?)\n<\/TEXT-CONTENT>\s*$/);
    return header ? { url: header[1].trim(), title: header[2].trim(), description: header[3].trim(), content: header[4] } : null;
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
})();
