# Ship Studio Figma Plugin

## What This Is

A Ship Studio plugin that extracts structured design data from Figma and prepares it for Claude Code. Instead of screenshotting designs and hoping for the best, users get rich layout structure, design tokens, component mapping, exported assets, and a rendered image — all formatted as a design brief that Claude Code can use to produce accurate code.

## Core Value

Turn any Figma design into a structured, complete design brief that gives Claude Code everything it needs to build the component accurately — layout, tokens, assets, and a visual reference.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can enter and store their Figma personal access token once (persisted via plugin storage)
- [ ] User can paste a Figma URL (file, frame, or component) to select what to extract
- [ ] Plugin extracts layout structure from Figma (component hierarchy, auto-layout/flex properties, spacing, sizing)
- [ ] Plugin extracts design tokens (colors, typography, spacing scales, border radii, shadows)
- [ ] Plugin extracts component mapping (which Figma components are used and their properties)
- [ ] Plugin renders the selected frame/component as a PNG image and saves it to the project
- [ ] Plugin exports SVG icons and image assets found in the design and saves them to the project
- [ ] Plugin formats all extracted data into a structured design brief
- [ ] Plugin copies the design brief to clipboard, ready to paste into Claude Code
- [ ] User can extract a single frame/component or an entire page
- [ ] Plugin uses Ship Studio's theme system for consistent UI

### Out of Scope

- Code generation — the plugin prepares context, Claude Code generates code
- Running Claude Code — user controls when and how they invoke Claude Code
- Figma editing — this is read-only extraction
- Real-time sync with Figma — on-demand extraction only
- OAuth/Figma login — personal access token is sufficient and simpler
- Framework-specific output — the design brief is framework-agnostic; Claude Code adapts to the project

## Context

- Built on the Ship Studio plugin starter template (React/TypeScript/Vite, Tauri runtime)
- Plugins render in the "toolbar" slot and can open modals for richer UI
- Plugin has shell access (`shell.exec`) for making HTTP requests (curl) to the Figma REST API
- Plugin storage persists data per-project — used for Figma token storage
- `dist/index.js` must be committed to the repo — Ship Studio clones without building
- The Figma REST API provides full design tree access, image rendering, and node data via personal access tokens
- Ship Studio starter repo: https://github.com/ship-studio/plugin-starter

## Constraints

- **Platform**: Ship Studio plugin (toolbar slot only, React via shared host instance)
- **No direct network**: Must use `shell.exec` with curl for Figma API calls
- **Bundle committed**: `dist/index.js` must be in the repo
- **10s load timeout**: Keep module scope lightweight, defer work to effects
- **120s shell timeout**: Figma API calls need to complete within this window (configurable)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Figma REST API via curl | Plugin can't make direct HTTP requests; shell.exec + curl is the supported pattern | — Pending |
| Personal access token | Simpler than OAuth, lower setup friction, sufficient for read-only access | — Pending |
| Clipboard output | Keeps plugin focused on extraction; user controls Claude Code interaction | — Pending |
| Assets saved to project | SVGs and images need to exist as files for Claude Code to reference them | — Pending |
| Include rendered PNG | Visual reference + structured data together give Claude Code the best context | — Pending |

---
*Last updated: 2026-02-28 after initialization*
