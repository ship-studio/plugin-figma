# Ship Studio Figma Plugin

## What This Is

A Ship Studio plugin that extracts structured design data from Figma and formats it as a complete design brief for Claude Code. Users paste a Figma URL, and the plugin extracts layout structure, design tokens, component mapping, and image assets — then assembles everything into a structured markdown brief ready to paste into Claude Code.

## Core Value

Turn any Figma design into a structured, complete design brief that gives Claude Code everything it needs to build the component accurately — layout, tokens, assets, and a visual reference.

## Requirements

### Validated

- ✓ User can enter and store their Figma personal access token (persisted via plugin storage) — v1.0
- ✓ User can paste a Figma URL (file, frame, or component) to select what to extract — v1.0
- ✓ Plugin extracts layout structure (component hierarchy, auto-layout/flex properties, spacing, sizing) — v1.0
- ✓ Plugin extracts design tokens (colors, typography, spacing, borders, shadows) with deduplication — v1.0
- ✓ Plugin extracts component mapping (names, descriptions, variant properties) — v1.0
- ✓ Plugin renders PNG preview and saves it to the project — v1.0
- ✓ Plugin exports SVG icons and image assets to the project directory — v1.0
- ✓ Plugin formats all extracted data into a structured design brief — v1.0
- ✓ Plugin copies the design brief to clipboard — v1.0
- ✓ User can extract a single frame/component or an entire page — v1.0
- ✓ Plugin uses Ship Studio's theme system for consistent UI — v1.0

### Active

(None — define with `/gsd:new-milestone`)

### Out of Scope

- Code generation — the plugin prepares context, Claude Code generates code
- Running Claude Code — user controls when and how they invoke Claude Code
- Figma editing — this is read-only extraction
- Real-time sync with Figma — on-demand extraction only
- OAuth/Figma login — personal access token is sufficient and simpler
- Framework-specific output — the design brief is framework-agnostic; Claude Code adapts to the project

## Context

- Built on the Ship Studio plugin starter template (React/TypeScript/Vite, Tauri runtime)
- Shipped v1.0 with 6,985 LOC TypeScript, 208 tests, 66.54 kB bundle
- Tech stack: React 18, TypeScript, Vite, Vitest, @figma/rest-api-spec
- Plugins render in the "toolbar" slot and can open modals for richer UI
- Plugin has shell access (`shell.exec`) for HTTP requests (curl) to Figma REST API
- Plugin storage persists data per-project — used for Figma token storage
- `dist/index.js` must be committed to the repo — Ship Studio clones without building

## Constraints

- **Platform**: Ship Studio plugin (toolbar slot only, React via shared host instance)
- **No direct network**: Must use `shell.exec` with curl for Figma API calls
- **Bundle committed**: `dist/index.js` must be in the repo
- **10s load timeout**: Keep module scope lightweight, defer work to effects
- **120s shell timeout**: Figma API calls need to complete within this window

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Figma REST API via curl | Plugin can't make direct HTTP requests; shell.exec + curl is the supported pattern | ✓ Good — reliable, handles all API endpoints |
| Personal access token | Simpler than OAuth, lower setup friction, sufficient for read-only access | ✓ Good — one-time setup, persists across sessions |
| Clipboard output | Keeps plugin focused on extraction; user controls Claude Code interaction | ✓ Good — clean separation of concerns |
| Assets saved to project | SVGs and images need to exist as files for Claude Code to reference them | ✓ Good — `.shipstudio/assets/` convention works well |
| Include rendered PNG | Visual reference + structured data together give Claude Code the best context | ✓ Good — 2x preview at minimal cost |
| Framework-agnostic brief | CSS flexbox terms describe layout intent without locking to React/Vue/etc. | ✓ Good — Claude Code adapts to any project |
| Base64 shell encoding | Markdown contains shell metacharacters; base64 avoids escaping issues | ✓ Good — zero escaping bugs |
| Pure function brief generator | `generateBrief()` is synchronous, no side effects, fully testable | ✓ Good — 40 tests, deterministic output |

---
*Last updated: 2026-02-28 after v1.0 milestone*
