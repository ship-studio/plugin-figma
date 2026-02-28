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

- ✓ Plugin detects complex compositions (nested groups/vectors) and exports them as single images — v1.1/v1.2
- ✓ Plugin maps every exported asset to its exact position in the layout tree — v1.1
- ✓ Brief includes instructions for Claude Code to enter plan mode and ask clarifying questions — v1.1
- ✓ Brief instructs Claude Code to use only provided assets and never fabricate replacements — v1.1
- ✓ Brief instructs Claude Code to verify its output against the PNG preview when done — v1.1
- ✓ UX uses clear, human-friendly terminology (no "Extraction Scope", "Single Node", etc.) — v1.1
- ✓ UX flow is simplified with fewer steps — v1.1
- ✓ UX results screen is less overwhelming — v1.1
- ✓ Vector-only illustration groups detected and exported as single PNG — v1.2
- ✓ Layout tree collapses illustration subtrees and cross-references assets — v1.2
- ✓ Component names cleaned of generic Figma property prefixes — v1.2
- ✓ Assets written to OS temp dir instead of project directory — post-v1.2

### Active

None — all current requirements validated. See deferred features below.

## Completed Milestones

- **v1.0** (shipped 2026-02-28) — Core plugin: extraction, tokens, assets, brief
- **v1.1** (shipped 2026-02-28) — Brief instructions, asset detection, UX simplification
- **v1.2** (shipped 2026-03-01) — Illustration detection, layout tree quality, UI fixes

## Deferred Features

- Progressive asset disclosure in results UI
- Collapsible tree preview
- Executable verification loop/checklist
- Text alignment in brief (textAlignHorizontal from Figma)
- Plugin icon SVG
- Advanced options behind progressive disclosure

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
- v1.0 user testing: ~80% accuracy on first Claude Code build. Main gap: complex illustrations (groups of nested vectors) were described textually instead of exported as images, causing Claude Code to fabricate replacements. Asset-to-layout mapping also missing — brief lists assets in flat table without showing where each belongs.

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
| Assets saved to OS temp dir | SVGs and images need to exist as files for Claude Code to reference them | ✓ Good — `mktemp -d` avoids clobbering user files (was `.shipstudio/assets/`, changed post-v1.1) |
| Include rendered PNG | Visual reference + structured data together give Claude Code the best context | ✓ Good — 2x preview at minimal cost |
| Framework-agnostic brief | CSS flexbox terms describe layout intent without locking to React/Vue/etc. | ✓ Good — Claude Code adapts to any project |
| Base64 shell encoding | Markdown contains shell metacharacters; base64 avoids escaping issues | ✓ Good — zero escaping bugs |
| Pure function brief generator | `generateBrief()` is synchronous, no side effects, fully testable | ✓ Good — 54 tests, deterministic output |
| Vector-only illustration detection | GROUPs/FRAMEs with all primitive descendants exported as single PNG | ✓ Good — eliminates dozens of redundant SVGs (v1.2) |
| Layout tree cross-referencing | INSTANCE and illustration lines show `-> filename` when asset exists | ✓ Good — ties brief sections together (v1.2) |
| Component name cleaning | Strip "Property N=" prefixes from Figma variant names | ✓ Good — cleaner brief output (v1.2) |

---
*Last updated: 2026-03-01 after v1.2 + temp directory migration*
