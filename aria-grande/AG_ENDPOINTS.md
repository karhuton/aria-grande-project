# Aria Grande endpoints

## Website

GET /ariag/site (optional: locale)

Returns the website's identity, purpose, capabilities, and supported settings.

## Account

GET /ariag/account ()

Returns the authentication state, account profile, preferences, and supported operations.

POST /ariag/account/register (credentials; optional: profile, consents, idempotencyKey)

Creates an account and returns its authentication result.

POST /ariag/account/login (credentials; optional: remember)

Authenticates an account and returns credentials for subsequent requests.

POST /ariag/account/logout ()

Ends the authenticated session or invalidates its credentials.

POST /ariag/account/update (updates; optional: idempotencyKey)

Updates the authenticated account's profile or preferences.

## Navigation

GET /ariag/navigation (optional: parentId, contentId, url, locale)

Lists the website destinations available from a navigation point or resource.

## Browse

GET /ariag/browse (optional: contentId, url, parentId, type, filters, sort, cursor, limit, locale)

Lists ways to browse or refine the website and the content matching the selection.

## Search

GET /ariag/search (query; optional: type, filters, sort, cursor, limit, locale)

Searches the website's content using a query and optional constraints.

## Content

GET /ariag/content (contentId or url; optional: locale)

Returns one complete content item with metadata describing its identity and location.

## Interactions

GET /ariag/interactions (contentId or url)

Lists the interactions currently available and the parameters they accept.

POST /ariag/interactions/preview (interactionId, params)

Validates an interaction and previews its effects without executing it.

POST /ariag/interactions/execute (interactionId, params; optional: confirmationToken, idempotencyKey)

Executes an interaction, using confirmation and duplicate protection when needed.

## Actions

GET /ariag/actions (actionId)

Returns an action's status, result, receipt, errors, and available recovery steps.
