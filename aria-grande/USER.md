# Aria Grande user flows

These flows describe how an AI-enabled browser can help a user from two common
entry points: the website front page and a specific subpage. In each case, the
browser should adapt to whether the user already understands the website.

A regular user usually knows the website, the destination, or the action they
want. The browser should favor direct routes and avoid unnecessary orientation.
An unfamiliar user needs enough context to understand the website, compare its
offerings, and make an informed choice.

The browser should not infer familiarity from the entry URL alone. It should use
the user's request and any consented history or account preferences.

## 1. User enters the website front page

The front page is a general entry point. The browser can use `/ariag/site` to
understand the website, `/ariag/sitemap` or `/ariag/navigation` to discover
destinations, and `/ariag/search` or `/ariag/browse` to narrow them down.

### 1a. User is a regular user of the website

Typical goals:

- Log in to access member content or account features.
- Navigate directly to a page they visit frequently.
- Search for a specific page or offering they already know.
- Find contact information.

Typical flow:

1. Determine whether the user asked for a destination, known item, or account
   action.
2. For account access, check `/ariag/account` and use
   `/ariag/account/login` only when authentication is needed.
3. For a known destination, use its sitemap URL or a navigation result and visit
   the page directly.
4. For a known name or phrase, use `/ariag/search` and present the closest exact
   matches.
5. For contact information, locate the contact page through the sitemap,
   navigation, or search, then return its content.
6. Once the destination is reached, use `/ariag/content` and
   `/ariag/interactions` as needed.

The browser should preserve the user's established terminology and preferences
where available, while still confirming consequential actions.

### 1b. User is unfamiliar with the website

Typical goals:

- Learn which offering best matches what they are looking for.
- Learn about the company or organization.
- Find contact information.
- Register, subscribe, book, or purchase.

Typical flow:

1. Use `/ariag/site` to explain briefly what the website offers and who it is
   for.
2. Use `/ariag/sitemap`, `/ariag/navigation`, or `/ariag/browse` to show the
   most relevant destinations without listing the whole website unnecessarily.
3. Translate the user's goal into search terms or browse filters and explain any
   inferred constraints.
4. Compare the best-matching offerings using their content, important
   differences, requirements, and alternatives.
5. Use the About, Contact, policies, or other informational pages when the user
   wants to understand or evaluate the organization.
6. If the user chooses to register or perform another consequential action,
   discover the available interaction, preview its effect, request confirmation
   when required, execute it, and return the action receipt.

The browser should help the user evaluate the website before steering them
toward registration or purchase.

## 2. User enters a specific website subpage

The current page URL is supplied explicitly to the stateless API. The browser
can use that URL with `/ariag/content`, `/ariag/navigation`,
`/ariag/browse`, and `/ariag/interactions`.

### 2a. User is a regular user of the website

Typical goals:

- Read or interact with content they knew existed.
- Navigate to subpages related to the known page.
- Log in to access restricted content or actions.

Typical flow:

1. Request `/ariag/content` with the current URL and return the relevant section
   or facts directly.
2. If the user wants to act on the page, request `/ariag/interactions` with the
   same URL and use the matching interaction.
3. If the user wants a related subpage, use `/ariag/navigation` or
   `/ariag/browse` with the current URL and follow the selected destination.
4. If access is restricted, check `/ariag/account` and offer login without
   discarding the current destination or task.
5. Preview and confirm consequential interactions, then return their receipts.

The browser should treat the known page as the starting resource rather than
reintroducing the whole website.

### 2b. User is unfamiliar with the website

Typical goals:

- Learn whether the current offering matches what they were looking for.
- Find similar or alternative offerings that may be a better match.
- Learn about the company or organization.
- Register, subscribe, book, or purchase.

Typical flow:

1. Request `/ariag/content` with the current URL and summarize what the page
   offers, who it is for, important requirements, and relevant limitations.
2. Compare the page with the user's stated needs and distinguish known facts
   from inferred suitability.
3. Use the page's parent and related destinations, `/ariag/browse`, or
   `/ariag/search` to find similar and alternative offerings.
4. Explain the most important differences between the current page and those
   alternatives.
5. Use `/ariag/site` and relevant About, Contact, policy, or editorial pages if
   the user wants to evaluate the organization.
6. If the user chooses to register or perform another consequential action,
   discover and preview it before requesting confirmation and execution.
7. Return a clear receipt after any state-changing action, including recovery or
   undo options when available.

The browser should not assume that arriving on a specific page means the user
has already chosen that offering.

## Shared principles

- Use canonical sitemap or navigation URLs instead of guessing destinations
  from labels.
- Pass a URL or content identifier explicitly whenever an endpoint requires a
  resource; the API does not have an implicit current page.
- Prefer direct retrieval for known destinations and guided discovery for
  unfamiliar users.
- Keep authentication attached to the user's original task so login does not
  become a dead end.
- Separate reading and comparison from state-changing interactions.
- Preview consequential effects and request confirmation at the point it becomes
  meaningful.
- Return action status, errors, receipts, and recovery options in plain language.
