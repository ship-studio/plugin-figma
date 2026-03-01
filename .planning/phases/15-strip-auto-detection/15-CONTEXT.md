# Phase 15: Strip Auto-Detection - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove all automatic asset detection code (identify.ts, detect-composition.ts, related tests) so the codebase compiles cleanly. After this phase, the plugin produces briefs with layout tree, design tokens, and preview PNG — but zero auto-detected assets. This creates a clean base for the manual asset pipeline (Phases 16-19).

</domain>

<decisions>
## Implementation Decisions

### Deletion strategy
- Hollow out `export.ts` — remove identifyAssets/detectCompositions calls but keep preview PNG generation and the download pipeline. Phase 17 will refactor it to accept ManualAsset[].
- Keep `breadcrumb.ts` (86 lines) — it may be useful for Phase 18 layout tree cross-referencing. Delete later if not needed.
- Remove the imageFills pipeline (`fetchImageFills` usage, `collectImageFillsFromRawTree`). With manual control, users point at nodes directly and get PNG renders via `fetchImages`. No need for imageRef resolution.
- Delete `identify.ts` (306 lines) and its test file entirely.
- Delete `detect-composition.ts` (208 lines) and its test file entirely.

### Asset types cleanup
- Remove 'composition' and 'component' from the assetType union — they're dead after auto-detection removal.
- Simplify to 'icon' | 'image' (or defer exact typing to Phase 16 ManualAsset).
- AssetEntry type: Claude's discretion on whether to delete now or let Phase 16 replace it with ManualAsset.

### Brief empty state
- Claude's discretion on how the Assets section renders when the list is empty. Options: omit entirely, or show header with a note. Pick whatever makes the cleanest brief output.

### Test handling
- All tests must pass after Phase 15 — no broken windows.
- Delete identify.test.ts and detect-composition.test.ts (68 tests) alongside their modules.
- Fix generate.test.ts references to 'composition'/'component' asset types so all remaining tests pass.
- Claude's discretion on the exact approach to fixing generate.test.ts — remove composition test cases, update type references, whatever produces a green suite.

### Claude's Discretion
- Exact order of file deletions vs. reference updates (as long as tests pass at the end)
- Whether to delete AssetEntry type now or leave for Phase 16
- Brief empty state presentation
- How to handle any other dangling references to deleted modules

</decisions>

<specifics>
## Specific Ideas

- User philosophy: "People would rather take a bit longer to enter their shit and get a perfect result, than a mediocre result in less time." This phase clears the decks for that perfect result.
- Research flagged: MainView.tsx is 673 lines — but that's a Phase 19 concern, not Phase 15.

</specifics>

<code_context>
## Existing Code Insights

### Files to Delete
- `src/assets/identify.ts` (306 lines) — auto-detection of SVG/PNG/fill assets from tree
- `src/assets/identify.test.ts` — 40+ tests for identify
- `src/assets/detect-composition.ts` (208 lines) — vector-only group and composition detection
- `src/assets/detect-composition.test.ts` — 28+ tests for detect-composition

### Files to Modify
- `src/assets/export.ts` (160 lines) — remove identifyAssets/detectCompositions imports and calls; remove imageFills resolution; keep preview PNG + download orchestration
- `src/assets/types.ts` — simplify assetType union, possibly remove AssetEntry
- `src/brief/generate.ts` — remove compositionNodeIds logic, update assetTypeLabel
- `src/brief/generate.test.ts` — fix/remove tests referencing 'composition'/'component' types

### Files to Keep
- `src/assets/download.ts` (94 lines) — prepareAssetsDir, downloadFile, downloadAllAssets (all reusable)
- `src/assets/sanitize.ts` (55 lines) — sanitizeFilename, resolveCollisions (needed for Phase 16)
- `src/assets/breadcrumb.ts` (86 lines) — may be useful for Phase 18

### Import Chain
- `export.ts` imports from `identify` and `detect-composition` — these imports must be removed
- `generate.ts` references `compositionNodeIds` set — this logic must be stripped
- `MainView.tsx` calls `exportAssets()` — its signature will change (remove rootNodes/imageFills/instancesWithText)

### Established Patterns
- Pure function brief generator (`generateBrief()`) — changes to generate.ts must maintain this pattern
- Test files co-located with source (`identify.test.ts` next to `identify.ts`)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 15-strip-auto-detection*
*Context gathered: 2026-03-01*
