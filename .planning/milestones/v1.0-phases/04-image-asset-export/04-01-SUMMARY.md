---
phase: 04-image-asset-export
plan: 01
subsystem: assets
tags: [figma, asset-identification, filename-sanitization, tdd, vitest]

# Dependency graph
requires:
  - phase: 02-layout-extraction
    provides: LayoutNode tree type definitions (LayoutNode interface)
  - phase: 03-design-data-extraction
    provides: ImageFillRef type and collected imageFills array
provides:
  - identifyAssets() pure function to walk LayoutNode tree and produce AssetEntry[]
  - sanitizeFilename() for filesystem-safe naming from Figma layer names
  - resolveCollisions() for handling duplicate filenames with -2, -3 suffixes
  - AssetEntry, AssetExportProgress, ExportResult type definitions
affects: [04-02-download-orchestrator, 05-brief-assembly]

# Tech tracking
tech-stack:
  added: []
  patterns: [depth-limited-tree-walk, pure-function-asset-identification, filename-collision-resolution]

key-files:
  created:
    - src/assets/types.ts
    - src/assets/identify.ts
    - src/assets/identify.test.ts
    - src/assets/sanitize.ts
    - src/assets/sanitize.test.ts
  modified: []

key-decisions:
  - "Two-function tree walk: classifyNode (top-level, recurses one level into containers) and classifyNodeLeaf (component-level, no further recursion)"
  - "INSTANCE nodes treated as SVG export leaf -- children never individually exported"
  - "Orphan imageFills (not matched by walked nodes) still added as png-fill entries"
  - "Collision resolution via -2, -3 numeric suffixes (not node ID fragments)"

patterns-established:
  - "Depth-limited tree walk: top-level + one recursion into FRAME/GROUP/SECTION containers"
  - "Pure function asset identification: LayoutNode[] + ImageFillRef[] -> AssetEntry[]"
  - "Sanitize-then-resolve pipeline: sanitizeFilename per node, resolveCollisions on full list"

requirements-completed: [ASST-02, ASST-03, ASST-04]

# Metrics
duration: 3min
completed: 2026-02-28
---

# Phase 4 Plan 01: Asset Identification Summary

**Pure-function identifyAssets() with depth-limited tree walk, sanitizeFilename, and collision resolution -- 35 new tests**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-28T17:38:49Z
- **Completed:** 2026-02-28T17:41:36Z
- **Tasks:** 1
- **Files modified:** 5

## Accomplishments
- identifyAssets() correctly identifies SVG candidates (VECTOR, BOOLEAN_OPERATION, LINE, STAR, POLYGON, ELLIPSE, RECTANGLE without image fills, INSTANCE) and png-fill candidates from a LayoutNode tree
- sanitizeFilename() converts Figma layer names to filesystem-safe lowercase-hyphenated strings with edge case handling (empty, special chars, slashes, collapsing)
- resolveCollisions() appends -2, -3 numeric suffixes for duplicate filenames without mutating input
- Depth-limited walk ensures only top-level and component-level nodes exported (deeply nested vector internals skipped)
- AssetEntry, AssetExportProgress, and ExportResult types exported for Plan 02 consumption

## Task Commits

Each task was committed atomically:

1. **Task 1: Types, sanitizeFilename, and identifyAssets (TDD)** - `19bcbbe` (feat)

## Files Created/Modified
- `src/assets/types.ts` - AssetEntry, AssetExportProgress, ExportResult type definitions
- `src/assets/sanitize.ts` - sanitizeFilename and resolveCollisions pure functions
- `src/assets/sanitize.test.ts` - 15 tests for sanitization and collision logic
- `src/assets/identify.ts` - identifyAssets tree walk function with depth control
- `src/assets/identify.test.ts` - 20 tests for asset identification logic

## Decisions Made
- Two-function tree walk pattern: `classifyNode` handles top-level with one level of recursion into containers; `classifyNodeLeaf` handles component-level without further recursion
- INSTANCE nodes treated as SVG export leaf nodes -- children never individually exported
- Orphan imageFills (referenced in token pipeline but not found in walked tree nodes) still added as png-fill entries
- Collision resolution uses -2, -3 numeric suffixes rather than node ID fragments for cleaner filenames

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- AssetEntry[] type and identifyAssets() ready for Plan 02 download orchestrator consumption
- sanitizeFilename() and resolveCollisions() exported for potential reuse
- All 168 tests passing (133 existing + 35 new), no regressions

## Self-Check: PASSED

All 5 created files verified on disk. Commit 19bcbbe verified in git log.

---
*Phase: 04-image-asset-export*
*Completed: 2026-02-28*
