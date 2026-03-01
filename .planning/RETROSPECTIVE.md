# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Ship Studio Figma Plugin

**Shipped:** 2026-02-28
**Phases:** 5 | **Plans:** 11 | **Sessions:** 1

### What Was Built
- Complete Figma REST API integration via shell.exec + curl with PAT authentication, URL parsing, and file/node validation
- Recursive layout tree extraction with CSS flexbox property mapping, auto-layout normalization, instance deduplication, and component metadata
- Full design token system: colors (hex/rgba/gradients), typography, spacing, borders, shadows — all with deduplication and auto-naming
- Asset export pipeline: SVG/PNG node classification via two-function tree walk, batch Figma image API rendering, sequential download with retry and collision resolution
- Structured markdown brief assembly (6 sections, locked order) with token estimation and one-click clipboard copy
- 208 tests, 6,985 LOC TypeScript, 66.54 kB bundle, 61 commits

### What Worked
- **Single-session delivery:** Entire v1.0 from project init to shipped in ~5.5 hours — tight feedback loops, no context loss between phases
- **Accelerating velocity:** Phase 1 averaged 10min/plan, Phase 5 averaged 2.5min/plan — each phase built cleanly on the previous, with less discovery work needed
- **TDD on data transforms:** Writing failing tests first for URL parser, layout normalization, token collection, asset identification, and brief generation caught edge cases early and made refactoring safe
- **Pure function extraction:** `normalizeTree()`, `collectTokens()`, `identifyAssets()`, `generateBrief()` — all pure, all independently testable, all composable in the pipeline
- **Research-then-plan workflow:** Phase research (reading Figma API docs, Ship Studio conventions) before planning eliminated rework during execution
- **GSD tooling:** Automated plan checking, verification, and state tracking kept quality consistent without manual overhead

### What Was Inefficient
- **Phase 1 took 42% of total execution time** (29min of 69min) — foundation phases with UI scaffolding, build config, and runtime integration are inherently slower; this is expected but worth noting
- **Redundant React hook patterns:** Early useState cast pattern (`null as T | null`) was replaced by cleaner hook imports from the externalized React module — wasted a small amount of rework in 01-02 and 01-03
- **Audit status "tech_debt" not "passed":** 4 non-critical items found at audit, all preventable with slightly more precise plan specifications (e.g., specifying nullable return types, cross-platform clipboard)

### Patterns Established
- **shell.exec('curl', [...args])** with separate command and args array for all HTTP requests to Figma API
- **CSS injection lifecycle:** inject `<style>` on mount with STYLE_ID, remove on unmount
- **Plugin module exports:** `{ name, slots: { toolbar }, onActivate, onDeactivate }` contract with Ship Studio
- **Base64 shell encoding:** `btoa(unescape(encodeURIComponent(content)))` for any content passing through shell.exec
- **Two-function tree walk:** `classifyNode` (recurses into containers) + `classifyNodeLeaf` (no recursion) for asset identification
- **Default-value skipping:** Layout tree omits flex properties matching CSS defaults to reduce brief noise
- **Collision resolution:** `-2`, `-3` numeric suffixes for duplicate filenames, not node ID fragments

### Key Lessons
1. **Foundation phases are always the slowest** — build config, runtime integration, and type scaffolding have high fixed cost; plan time accordingly and don't compare their velocity to later phases
2. **Pure functions compound:** Each extraction engine (layout, tokens, assets) being pure made the brief generator trivial — it just calls them and formats output
3. **Shell.exec is the universal escape hatch:** Any capability the plugin runtime doesn't support (HTTP, filesystem, clipboard) can be achieved through shell.exec with appropriate encoding
4. **Test the data transforms, trust the UI wiring:** 208 tests all target pure logic; UI integration was verified by the audit's E2E flow checks — this split is efficient
5. **Batch API calls aggressively:** Single Figma GET /v1/images call for all nodes (PNG + SVG) vs one-per-node saved significant API roundtrips in Phase 4

### Cost Observations
- Model mix: Quality profile throughout (Opus for orchestration, Sonnet for agents)
- Sessions: 1 continuous session
- Notable: 11 plans executed in ~69 minutes total — average 6.3min/plan including research, planning, execution, and verification

---

## Milestone: v1.3 — Asset Completeness & Polish

**Shipped:** 2026-03-01
**Phases:** 3 | **Plans:** 4 | **Sessions:** 1

### What Was Built
- Instance child IMAGE fill detection — full-depth recursion into component instances with global imageRef dedup
- Instance IMAGE fill override detection — background images on INSTANCE nodes exported as PNG
- Smart rectangle filtering — simple solid-color RECTANGLEs silently skipped from SVG export
- Absolute position offsets — `[absolute] top:N left:N` for absolutely-positioned elements
- Flex-child properties — flex-grow:1 and align-self:stretch annotations in brief layout tree
- Figma logo SVG in Ship Studio toolbar button with theme-aware `fill=currentColor`

### What Worked
- **Pre-normalization image collection:** Running `collectImageFillsFromRawTree` before normalization strips instance subtrees was the key insight — without it, deeply nested fills would be lost
- **parentInstanceId threading:** Single field threaded through the entire pipeline (identify -> export -> download -> generate) enabled layout tree cross-referencing without restructuring the pipeline
- **TDD continued to compound:** Failing tests first caught edge cases in rectangle filtering (invisible strokes, invisible effects) and instance dedup that would have been hard to spot in integration
- **Minimal plan count:** 4 plans total for 7 requirements — each plan was well-scoped, no rework needed

### What Was Inefficient
- **Stale audit file:** A preliminary audit was run mid-milestone (before phases 13-14), creating a stale v1.3-MILESTONE-AUDIT.md that had to be overwritten. Running audit only at milestone completion is cleaner.
- **Inline anonymous types in download.ts/export.ts:** These shadow the typed definitions in types.ts and would not catch a type mismatch automatically. Pre-existing pattern, but noted as a maintainability concern.

### Patterns Established
- **Pre-normalization raw tree walking:** Collect data from the raw Figma API response before normalization discards subtrees (instance children, deeply nested structures)
- **parentInstanceId as pipeline-wide context:** Thread parent context through the full asset pipeline when child assets need to reference their container in the brief
- **Noise reduction via default suppression:** Only emit non-default flex values (layoutGrow !== 0, layoutAlign !== 'INHERIT') to keep brief concise
- **parentBBox threading for relative offsets:** Pass parent's absoluteBoundingBox as parameter through recursive normalization

### Key Lessons
1. **Pre-normalization data capture is critical** — any data the normalization step discards must be extracted first. This applies to instance children, hidden nodes, or any subtree that gets collapsed.
2. **Global dedup sets prevent cross-instance duplication** — identical images shared across component instances only need exporting once. A single `Set<string>` passed through the tree walk handles this cleanly.
3. **Small phases with focused requirements ship fast** — 4 plans in ~11 minutes with 303 tests. Each requirement mapped cleanly to one or two plans with no overlap.

### Cost Observations
- Model mix: Quality profile (Opus orchestration, Sonnet agents)
- Sessions: 1 continuous session
- Notable: 4 plans executed in ~11 minutes total — average 2.75min/plan. Fastest milestone yet.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Plans | Key Change |
|-----------|----------|--------|-------|------------|
| v1.0 | 1 | 5 | 11 | First milestone — established patterns for Ship Studio plugin development |
| v1.1 | 1 | 3 | 5 | Brief quality & UX — composition detection, breadcrumb mapping |
| v1.2 | 1 | 3 | N/A | Outside GSD — illustration detection, tree quality, temp dir migration |
| v1.3 | 1 | 3 | 4 | Asset completeness — instance recursion, spacing, icon. Fastest milestone. |

### Cumulative Quality

| Milestone | Tests | LOC | Avg min/plan |
|-----------|-------|-----|-------------|
| v1.0 | 208 | 6,985 | 6.3 |
| v1.1 | 272 | ~7,500 | 8.8 |
| v1.2 | 276 | ~8,200 | N/A |
| v1.3 | 303 | 9,411 | 2.75 |

### Top Lessons (Verified Across Milestones)

1. **Pure function extraction compounds** — each milestone builds faster because pure functions compose cleanly and are independently testable (v1.0, v1.1, v1.3)
2. **Shell.exec + base64 encoding** is the reliable universal I/O pattern for Ship Studio plugins (v1.0, confirmed in every subsequent milestone)
3. **TDD catches edge cases early** — rectangle filtering, composition detection, instance dedup all caught bugs in the test-first phase that would have been subtle in integration (v1.1, v1.3)
4. **Pre-normalization data capture** — any data discarded by normalization must be extracted beforehand; this pattern will recur in future milestones (v1.3)
