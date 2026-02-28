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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 | 5 | First milestone — established patterns for Ship Studio plugin development |

### Cumulative Quality

| Milestone | Tests | Coverage | Bundle Size |
|-----------|-------|----------|-------------|
| v1.0 | 208 | Logic-focused | 66.54 kB |

### Top Lessons (Verified Across Milestones)

1. Pure function extraction makes every subsequent phase faster — compound returns on testability
2. Shell.exec + base64 encoding is the reliable universal I/O pattern for Ship Studio plugins
