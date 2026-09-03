# Aria Grande browser extension

[Aria Grande](/aria-grande/README.md) is an accessibility system for AI assisted browsing.

The purpose of this extension is to demonstrate how an AI assisted accessibility browser
could work with an Aria Grande supported website.

## How it works

The extension loads an browsing action menu on every page load.

The user may close the menu or choose an action.

Actions trigger corresponding WebMCP tool provided by the website or the fallback action provided by the extension.

The extension uses Chrome browser's local Gemini model for some of the actions.


## Action menu

Action menu has 4 action buttons and cancel button:

| Button | Click | Long-click |
| --- | --- | --- |
| Read / Summarise | Read | Summarise |
| Search / Ask | Search | Ask |
| Frontpage / Navigate | Frontpage | Navigate |
| Login | Login | - |
| Cancel | close dialog | — |

The user may also press **Escape** to close or re-open the dialog.


## Local language model

The extension requries the Chrome local language model to be installed.

This installation is triggered on the first time usage.

Press **Escape** to close the dialog. When the dialog is closed, press
**Escape** again anywhere on the page to reopen it.


## Load in Chrome, Chromium, or Edge

1. Open the browser's extensions page (for Chrome, `chrome://extensions`).
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this `browser-extension` directory.
4. Accept the request to read and change data on all websites.
5. Open or reload a regular web page.

