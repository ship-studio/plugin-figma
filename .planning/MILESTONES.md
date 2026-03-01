# Milestones

## v1.3 Asset Completeness & Polish (Shipped: 2026-03-01)

**Phases completed:** 3 phases, 4 plans, 0 tasks

**Key accomplishments:**
- Instance child image detection — recurses into component instances at full depth to find and export all IMAGE fills (photos, avatars, hero images)
- Instance IMAGE fill override detection — exports background image overrides on INSTANCE nodes as PNG
- Smart rectangle filtering — skips simple solid-color rectangles to eliminate SVG noise
- Absolute position offsets in brief (`[absolute] top:N left:N`) for CSS positioning
- Flex-child properties (flex-grow:1, align-self:stretch) for accurate layout matching
- Figma logo SVG toolbar icon for visual identity in Ship Studio
- 303 tests, 9,411 LOC TypeScript — built in ~11 minutes across 30 commits

---

## v1.0 Ship Studio Figma Plugin (Shipped: 2026-02-28)

**Phases completed:** 5 phases, 11 plans, 0 tasks

**Key accomplishments:**
- Complete Figma API integration with PAT authentication, URL parsing, and file validation
- Recursive layout tree extraction with CSS flexbox mapping, deduplication, and component metadata
- Full design token system: colors, gradients, typography, spacing, borders, shadows with deduplication
- Asset export pipeline: SVG/PNG identification, batch Figma image API rendering, sequential download with retry
- Structured markdown brief assembly with 6 sections, token estimation, and one-click clipboard copy
- 208 tests, 6,985 LOC TypeScript, 66.54 kB bundle — built in ~5.5 hours across 59 commits

---

## v1.1 Brief Quality & UX (Shipped: 2026-02-28)

**Phases completed:** 3 phases (6-8), 5 plans

**Key accomplishments:**
- "How to Use This Brief" instructions section guiding Claude Code behavior (plan mode, asset-only rule, verification)
- Human-friendly terminology throughout plugin UI (no jargon)
- Composition detection heuristic for complex illustrations (exported as single PNG)
- Asset-to-layout breadcrumb mapping in brief Assets table (4-column: File, Type, Location, Path)
- Merged 3 result sections into single card, auto-derived extraction scope from URL
- 272 tests — built in ~44 minutes

---

## v1.2 Brief Quality Overhaul (Shipped: 2026-03-01)

**Phases completed:** 3 phases (9-11), executed outside GSD workflow

**Key accomplishments:**
- Vector-only illustration detection — groups with all primitive descendants exported as single PNG instead of dozens of SVGs
- LINE nodes excluded from SVG export (CSS borders, not icons)
- SVG deduplication by sanitized filename
- Layout tree quality: illustration subtrees collapsed, asset cross-references on INSTANCE lines, text truncation at 200 chars
- Component name cleaning: strips "Property N=" Figma prefixes
- UI bugfixes: defensive warning rendering, component assetType support
- Post-milestone: temp directory migration — assets/brief written to OS temp dir via `mktemp -d` instead of `.shipstudio/`
- 276 tests

---

