# Aria Grande browser extension

A minimal Manifest V3 extension for Chrome-compatible browsers and Firefox. It
requests access to all websites and opens a modal action menu one second after
its content script is inserted into the top-level page. The native modal dialog
makes the rest of the page inert while it is open.

The complete declarative Shadow DOM template and its inline CSS live in
`content.html`. The content script loads that packaged resource and attaches the
event behavior.

The extension/settings icon uses the original violet-and-cyan **AG** artwork.
The toolbar action uses a separate monochrome rounded rectangle with a
transparent **AG** cutout.

Select the toolbar icon to open the settings menu. You can turn the automatic
action menu on or off and choose a delay from 0 to 5 seconds. The defaults are
ON and 1 second; saved settings apply when a page is next loaded or reloaded.

Each button maps a click and long-click to an action. Hold a button for at
least 600 milliseconds to long-click it.

| Button | Click | Long-click |
| --- | --- | --- |
| Read / Summarise | Read | Summarise |
| Search / Ask | Search | Ask |
| Frontpage / Explore | Frontpage | Explore |
| Login or register | Login | Register |
| Cancel | close dialog | — |

Each non-Cancel action discovers its exact `ariag-*` WebMCP tool, supplies the
inputs collected for that action, and passes a successful structured result to
Chrome's on-device `LanguageModel` for an accessible user-facing response. Tool
output is treated as untrusted source data. Missing and failed
tools are normally reported as unavailable. If `ariag-read` fails, the dialog
closes without moving focus. If `ariag-summarise` fails, up to 12,000 characters
of readable DOM text and relevant login-state signals are sent to the local
model for a concise summary. Search asks for the query first. If `ariag-search`
fails, the local model selects from search forms, search-page links, and search
controls found in the DOM; the extension validates and performs that selection.
If no usable site search is found, the user can open a Google query in the form
`site:example.com query` or cancel the search. Ask prompts for a question; if
`ariag-ask` fails, the local model answers from readable page content and says
when the page does not contain enough information. If `ariag-frontpage` fails,
the local model selects from the page's complete resolved link URLs; when none is
suitable, the extension opens the current host root. Login and Register check
DOM login state before running. A successful WebMCP result is always passed
whole to the local model without assuming its format or contents. If WebMCP is
unavailable or fails, the model selects a visible Login or Register control when
logged out, or an account-page control when logged in, and the extension opens
it. The local `LanguageModel` can interpret arbitrary WebMCP instructions but is
text-only; executing instructions beyond opening a locally selected page
requires explicit extension tools. If `ariag-navigate` fails, all
descendant elements within the page's single `body`, including `footer`, are
passed to the local model with navigation and main sections prioritized. The
resulting main-pages modal supports a two-level hierarchy with up to 10
top-level items, up to 10 child items per group, and Return to actions. Top-level
groups start collapsed and reveal their page buttons on activation; deeper
nesting is ignored. Other fallbacks are not implemented yet. Chrome may download
its local language model the first time.

Press **Escape** to close the dialog. When the dialog is closed, press
**Escape** again anywhere on the page to reopen it. While open, the native modal
dialog makes the background page inert.

## Load in Chrome, Chromium, or Edge

1. Open the browser's extensions page (for Chrome, `chrome://extensions`).
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this `browser-extension` directory.
4. Accept the request to read and change data on all websites.
5. Open or reload a regular web page.

## Load temporarily in Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose **Load Temporary Add-on**.
3. Select `manifest.json` from this directory.
4. Open or reload a regular web page.

Browsers do not allow extensions to inject scripts into protected internal
pages such as `chrome://...`, `about:...`, browser extension stores, or some
other privileged pages. Tabs that were already open may need to be reloaded.
