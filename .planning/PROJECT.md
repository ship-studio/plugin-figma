# Ship Studio Figma Plugin

## What This Is

A Ship Studio plugin that extracts structured design data from Figma and formats it as a complete design brief for Claude Code. Users paste a Figma URL for the page/frame, then manually add assets by pasting Figma URLs for specific elements and choosing their export format (PNG or SVG). The plugin extracts layout structure, design tokens, component mapping, and the user-specified assets — then assembles everything into a structured markdown brief ready to paste into Claude Code.

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

- ✓ Instance child IMAGE fill detection — recurses into component instances at full depth — v1.3
- ✓ Instance IMAGE fill override detection on INSTANCE nodes — v1.3
- ✓ Smart rectangle filtering — skips simple solid-color rectangles — v1.3
- ✓ Absolute position offsets (top/left) in brief for absolutely-positioned elements — v1.3
- ✓ flex-grow:1 and align-self:stretch annotations in brief — v1.3
- ✓ Figma logo SVG in Ship Studio toolbar — v1.3

### Active

<!-- v2.0 Manual Asset Control -->
- [ ] User can add assets by pasting Figma URLs (single node or multi-select) and choosing PNG or SVG format
- [ ] User can add multiple assets, building a list before exporting
- [ ] User can remove assets from the list before exporting
- [ ] Asset filenames are auto-derived from Figma layer names
- [ ] Duplicate layer names are auto-numbered (icon.png, icon-2.png)
- [ ] Assets are mapped to their position in the layout tree by node ID
- [ ] All automatic asset detection code is removed (detect-composition, identify, SVG dedup, illustration heuristics)
- [ ] Full-page preview PNG remains auto-generated

## Completed Milestones

- **v1.0** (shipped 2026-02-28) — Core plugin: extraction, tokens, assets, brief
- **v1.1** (shipped 2026-02-28) — Brief instructions, asset detection, UX simplification
- **v1.2** (shipped 2026-03-01) — Illustration detection, layout tree quality, UI fixes
- **v1.3** (shipped 2026-03-01) — Instance asset detection, spacing accuracy, plugin icon

## Current Milestone: v2.0 Manual Asset Control

**Goal:** Replace unreliable automatic asset detection with explicit user-driven asset selection — users specify exactly which Figma elements to export and in what format, producing a perfect brief every time.

**Target features:**
- Manual asset addition via Figma URL + format picker (PNG/SVG)
- Support for both single-node URLs and multi-select URLs
- Asset list management (add, remove, review before export)
- Auto-derived filenames from Figma layer names with conflict resolution
- Layout tree cross-referencing by node ID
- Complete removal of auto-detection code

## Deferred Features

- Text alignment in brief (textAlignHorizontal from Figma)
- Progressive asset disclosure in results UI
- Collapsible tree preview
- Executable verification loop/checklist
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
- Current state: 9,411 LOC TypeScript, 303 tests, 4 milestones shipped (v1.0-v1.3) — will shrink significantly after removing auto-detection code
- Tech stack: React 18, TypeScript, Vite, Vitest, @figma/rest-api-spec
- Plugins render in the "toolbar" slot and can open modals for richer UI
- Plugin has shell access (`shell.exec`) for HTTP requests (curl) to Figma REST API
- Plugin storage persists data per-project — used for Figma token storage
- `dist/index.js` must be committed to the repo — Ship Studio clones without building
- v1.3 improvements: instance images now fully detected at any nesting depth, spacing/flex properties in brief, Figma logo icon in toolbar
- Known areas for improvement: text alignment not yet in brief, bounding-box spacing may need tuning with real designs
- v2.0 direction: auto-detection was unreliable (missed assets, over-captured sections as PNG). Users prefer spending more time for a perfect result over getting a mediocre result faster

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
| Instance IMAGE fill priority | Instance own fill detected before child recursion — early return prevents double export | ✓ Good — clean pipeline, no duplicate assets (v1.3) |
| Global imageRef dedup | Single seenImageRefs set across all walkTree calls | ✓ Good — identical images exported once across instances (v1.3) |
| Pre-normalization image fill collection | collectImageFillsFromRawTree runs before normalizeTree strips instance subtrees | ✓ Good — captures deeply nested fills that normalization would discard (v1.3) |
| absoluteBoundingBox for offsets | Use absoluteBoundingBox (not absoluteRenderBounds) for position offsets | ✓ Good — represents layout intent, not visual bounds with shadows/strokes (v1.3) |
| Noise reduction for flex defaults | Only store layoutGrow when 1, layoutAlign when STRETCH | ✓ Good — brief stays concise (v1.3) |
| User-provided Figma logo SVG | Used viewBox 0 0 15 15 version instead of Simple Icons 0 0 24 24 | ✓ Good — correct rendering in toolbar (v1.3) |
| Manual asset control over auto-detection | Auto-detection was unreliable in both directions; users prefer perfect results over speed | — Pending (v2.0) |
| Remove all auto-detection code | Dead code after manual control; clean slate reduces maintenance burden | — Pending (v2.0) |

---
*Last updated: 2026-03-01 after v2.0 milestone started*
