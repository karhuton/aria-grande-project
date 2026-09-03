# Universal browser actions

These are user-facing actions an AI-enabled browser can offer on every website
that supports Aria Grande. Users invoke them in natural language; they do not
need to know endpoint names.

Websites can implement the standard actions as discoverable WebMCP tools. Their
names, discovery flow, local-AI result handling, and fallback behavior are
defined in [WebMCP Actions](WEBMCP_ACTIONS.md).

## Contextual action menu

The browser keeps its general interface to four stable options. A short
activation performs the common action; a long activation performs the paired
action. The user can move between options with next and previous, then use short
or long activate. The browser announces the selected option, its position, and
both available actions.

Short and long activation are interaction concepts, not mandatory physical key
timings. A browser can expose them through configurable keys, buttons, gestures,
or voice commands.

Blocking dialogs and multi-step tasks can temporarily replace the general menu
with a contextual submenu. Those submenus include **Back** and **Other**. After
the dialog or task is complete, the browser restores the four general options
and asks, “What next?”

### Blocking dialog menu

If a cookie prompt requires a response, the browser announces that the dialog
is blocking access to the page. It presents cookie-dialog actions instead of
the page's general actions:

- **Summarise dialog content:** Generate a short summary, read it aloud, and
  return to the dialog's “What next?” menu.
- **Read dialog content:** Move focus to the dialog heading and enter traditional
  screen-reader mode so the user can read the original content and controls.
- **Allow all:** Accept every optional cookie or consent purpose shown by the
  dialog.
- **Allow some:** Present each available purpose one at a time and ask whether
  to allow it. Necessary purposes are identified as required rather than
  presented as optional. After the final choice, offer **Save choices**,
  **List choices again**, and **Other**.
- **Decline all:** Decline every optional cookie or consent purpose supported by
  the dialog.
- **Other:** Type or say another instruction for handling the dialog.

The browser must not dismiss the dialog, infer consent, or expose page actions
until the required response is complete. After dismissal, it announces, “The
page is now accessible. What next?” and presents the general page menu.

Other blocking dialogs follow the same pattern—summarise, read, available dialog
actions, and Other—but expose controls appropriate to that dialog instead of
cookie choices.

### General page menu

The four general options are:

1. **Read** — short: **Summarise page**; long: **Read page**.
2. **Explore** — short: **Explore**; long: **Go to front page**.
3. **Login** — short: **Login**; long: **Account**.
4. **Search** — short: **Search site**; long: **Other**.

**Explore** opens a contextual submenu containing relevant destinations and
actions, such as main site sections, About, Contact information, Legal
information, Related pages, Browse, Compare, or Available actions. It does not
read every possible item automatically.

**Account** opens the available account submenu, such as Register, Profile,
Update account, Login methods, or Logout. If the user is already authenticated,
short **Login** reports that state and offers the account submenu instead of
starting another login.

**Other** lets the user type or say an unrestricted natural-language request.
The four-option menu does not grow when context changes; contextual choices
appear only inside the selected action or task submenu.

## Consent and orientation

- **Cookie choices:** Open the blocking-dialog menu for a cookie or tracking
  request, report the current selection, and apply only the user's explicit
  choices. Consent must never be inferred or bundled with another action.
- **Summarise page:** Give a short spoken summary of the current page, including
  its purpose, the most important information, and any important limitation or
  access requirement.
- **Where am I?:** State the page title, website, parent section, and relevant
  position in the site hierarchy.
- **Explore site:** List the website's main sections with short descriptions.
  Allow the user to expand one section at a time instead of reading the entire
  sitemap by default.
- **About site:** Explain what the website, company, or organization does, who it
  serves, and where its ownership or editorial information comes from.
- **Contact information:** Give the available contact methods, their purpose,
  opening hours or expected response time when provided, and any accessibility
  contact route.
- **Legal information:** Find and explain the available terms of service,
  privacy policy, cookie policy, accessibility statement, returns or refund
  policy, and other site-specific policies. The browser should distinguish a
  summary from the original legal text and offer to open or read that text.

## Reading and discovery

- **Read page:** Switch to traditional screen-reader reading mode and place
  focus on the first `H1`. If no `H1` exists, announce that and focus the main
  content region. This action must not start unexpectedly.
- **Read section:** Read a named heading or content section, preserving its
  heading level, lists, tables, links, and reading order.
- **Describe media:** Read available descriptions of relevant images, charts,
  audio, or video and offer transcripts when present.
- **Search site:** Find pages or content on the current website from a natural-
  language request. Explain inferred filters, corrections, and relaxed
  constraints.
- **Browse:** Browse a selected site section and apply filters or sorting. Keep
  the active section, filters, result count, current position, and remaining
  pages available to the user.
- **Related pages:** List parent, child, similar, alternative, previous, and next
  pages when those relationships are available.
- **Compare:** Compare selected content using consistent attributes, identify
  missing information, and distinguish facts from inferred suitability.

## Account

- **Account:** Report whether the user is authenticated and summarize available
  profile, preference, and account-management actions without exposing secrets.
- **Login:** Authenticate using a supported method. Keep the user's original
  page and task so login does not become a dead end.
- **Register:** Explain required fields, consents, account benefits, and whether
  registration is necessary for the user's task before creating an account.
- **Update account:** Review and change profile or preference fields, clearly
  stating what will change before submission.
- **Logout:** End the authenticated session and report whether any unsaved task
  or state will be affected.

## Page actions

- **Available actions:** List what can be done with the current page or content,
  separating read-only actions from actions that change state.
- **Perform action:** Collect only the required information for a selected
  action and validate it without executing the action prematurely.
- **Review and confirm:** Read the expected effect of a consequential action,
  including recipients, selections, prices, totals, policies, and changed data,
  then request explicit confirmation when required.
- **Action result:** Report whether an action succeeded, failed, or is still in
  progress. Include a receipt, errors, recovery steps, and undo options.

## Screen-reader behavior

- Speak concise information in manageable chunks and let the user ask for more,
  repeat, pause, or stop.
- Announce page changes, modal dialogs, validation errors, loading states, result
  counts, and completed actions without moving focus unexpectedly.
- Preserve meaningful headings, landmarks, labels, lists, tables, and link text.
- Never communicate a choice using only visual position, color, shape, or an
  unlabeled icon.
- Preserve the user's current task, selected filters, and return location across
  navigation, authentication, and errors.
- Do not speak passwords, payment details, authentication tokens, or other
  secrets back to the user.
- Keep AI guidance distinct from the website's original content and state when
  information is summarized, inferred, or unavailable.
