# Phase 1: Plugin Foundation & Figma Connection - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Working Ship Studio plugin that can authenticate with Figma, parse any Figma URL format, and fetch targeted node data via the REST API. This phase delivers the foundation everything else builds on: toolbar button, modal UI, token management, URL parsing, scope selection, API client with rate limiting and retry logic. No extraction logic — just the ability to connect and fetch.

</domain>

<decisions>
## Implementation Decisions

### Project Setup
- Clone/fork the ship-studio/plugin-starter template as the starting point
- Update plugin.json with Figma plugin identity (id, name, description, icon)
- Keep the existing Vite + TypeScript + React build setup from the starter
- Use `@figma/rest-api-spec` (dev dependency) for Figma API TypeScript types
- All HTTP requests via `shell.exec` + `curl` — no fetch/axios (Ship Studio constraint)

### Modal Layout
- Keep it simple: minimal UI focused on the core workflow
- Primary view: URL input + scope selection + extract button
- Settings accessible via gear icon or separate settings view (token management)
- First-time users see token setup before anything else (if no token stored)

### Token Onboarding
- On first open (no stored token): show a setup view with a text field for the PAT
- Include a brief instruction/link explaining how to generate a Figma PAT
- Validate token immediately on entry via `GET /v1/me` endpoint
- Show success/failure feedback inline — green checkmark or red error message
- Store validated token via Ship Studio plugin storage
- Settings view allows updating or removing the token at any time

### URL Input & Scope Selection
- Single text input for pasting Figma URLs
- Plugin auto-parses file key and node ID from the URL
- Support all URL formats: `/file/`, `/design/`, `/proto/`, `/board/`
- Handle node-id query parameter (URL-encoded, `-` to `:` conversion)
- After URL parsing: validate file accessibility with a lightweight API call
- Scope selection: radio buttons or dropdown — single node (from URL), frame, or page
- If URL contains a node-id, default scope to "single node"
- If URL is file-level (no node-id), default scope to "page" or show available frames

### API Client Design
- Thin wrapper around `shell.exec` + `curl` for Figma REST API calls
- Pass `X-Figma-Token` header for authentication
- Handle rate limits: detect 429 responses, respect `Retry-After` header
- 120-second timeout per shell command (Ship Studio default, configurable)
- JSON response parsing with error handling for malformed responses
- Batch image requests where possible (Figma rate limits are strict)

### Claude's Discretion
- Exact modal dimensions and spacing
- Whether settings is a separate view or a collapsible section
- Loading state animations during API validation
- Exact error message copy
- How to display parsed URL information (file name, node path) back to the user
- Whether to show a "recent URLs" history

</decisions>

<specifics>
## Specific Ideas

- The user emphasized "simple, effective, and beneficial" — avoid over-engineering the UI
- Plugin should feel native to Ship Studio (use host CSS classes like `toolbar-icon-btn`, `btn-primary`, etc.)
- The starter repo pattern of toolbar button → modal is the right entry point

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **plugin-starter template**: Complete working example with toolbar button, modal, shell.exec, storage, theming — this IS the foundation
- **Host CSS classes**: `toolbar-icon-btn`, `btn-primary`, `btn-secondary` provided by Ship Studio
- **CSS variables**: `--bg-primary`, `--bg-secondary`, `--text-primary`, etc. for theme integration
- **Plugin context API**: `usePluginContext()` pattern from starter — provides project, shell, storage, theme, actions

### Established Patterns
- **No direct imports**: React comes from `window.__SHIPSTUDIO_REACT__`, context from `window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__`
- **Shell for HTTP**: All network requests must go through `shell.exec` + `curl`
- **CSS injection**: Styles injected via `document.head.appendChild(style)` with cleanup on unmount
- **Storage**: `storage.read()` / `storage.write()` for persistent state (per-project)

### Integration Points
- **Toolbar slot**: Plugin renders in Ship Studio's toolbar via `slots.toolbar` export
- **Plugin storage**: Where the Figma token will be persisted
- **Project path**: `project.path` from context — where assets will be saved (later phases)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-plugin-foundation-figma-connection*
*Context gathered: 2026-02-28*
