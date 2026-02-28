---
phase: 07-smart-asset-detection-layout-mapping
plan: 01
subsystem: assets
tags: [composition-detection, breadcrumb, layout-node, heuristic, pure-function, tdd]

# Dependency graph
requires:
  - phase: 02-layout-normalization
    provides: LayoutNode type and normalizeNode function
provides:
  - detectCompositions pure function (structural + visual heuristic)
  - buildBreadcrumbMap pure function (nodeId -> arrow-path map)
  - LayoutNode extended with blendMode and isMask
  - ExportResult.assets extended with nodeId and assetType
affects: [07-02-pipeline-integration, brief-generation, asset-export]

# Tech tracking
tech-stack:
  added: []
  patterns: [heuristic-combination-detection, pure-function-pre-pass, breadcrumb-arrow-format, generic-name-filtering]

key-files:
  created:
    - src/assets/detect-composition.ts
    - src/assets/detect-composition.test.ts
    - src/assets/breadcrumb.ts
    - src/assets/breadcrumb.test.ts
  modified:
    - src/layout/types.ts
    - src/layout/normalize.ts
    - src/layout/normalize.test.ts
    - src/assets/types.ts

key-decisions:
  - "ExportResult.assets nodeId and assetType made optional to avoid breaking existing pipeline (Plan 02 will thread them through)"
  - "CHILD_COUNT_THRESHOLD=5 for direct children (avoids false positives on 2-4 vector icons)"
  - "NESTING_DEPTH_THRESHOLD=3 and SCAN_DEPTH_LIMIT=3 for visual effect scanning"
  - "GENERIC_NAME_PATTERN includes Line, Star, Polygon in addition to research recommendation"

patterns-established:
  - "Heuristic combination: require BOTH structural AND visual signals for composition detection"
  - "Outer-wins: once flagged, no recursion into children for further detection"
  - "Breadcrumb smart truncation: first > ... > last 2 at 5+ segments"
  - "Generic name filtering via exported regex constant for testability"

requirements-completed: [ASSET-01, ASSET-03, ASSET-04]

# Metrics
duration: 4min
completed: 2026-02-28
---

# Phase 7 Plan 01: Core Algorithms Summary

**Pure-function composition detection heuristic (structural + visual signals) and breadcrumb path builder with generic name filtering and smart truncation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-28T21:30:27Z
- **Completed:** 2026-02-28T21:34:57Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Composition detection with dual-signal heuristic (BOTH structural complexity AND visual effects required) prevents false positives on simple icon groups
- Breadcrumb path builder maps every node to its layout tree position, skipping auto-generated Figma names
- LayoutNode extended with blendMode and isMask; normalizeNode captures them from raw Figma API data
- ExportResult.assets extended with optional nodeId and assetType for downstream pipeline integration
- 260 total tests pass (25 new for breadcrumb, 14 new for composition detection, 6 new for normalize), zero regressions

## Task Commits

Each task was committed atomically (TDD: test -> feat):

1. **Task 1: Extend types and add composition detection signals**
   - `2411884` (test) - Failing tests for composition detection and type extensions
   - `b5b863f` (feat) - Implement composition detection and type signal capture
2. **Task 2: Breadcrumb path builder**
   - `9c07dbc` (test) - Failing tests for breadcrumb path builder
   - `b046205` (feat) - Implement breadcrumb path builder with generic name filtering

## Files Created/Modified
- `src/assets/detect-composition.ts` - Pure composition detection function with structural + visual heuristic
- `src/assets/detect-composition.test.ts` - 14 test cases covering all detection scenarios (267 lines)
- `src/assets/breadcrumb.ts` - Pure breadcrumb path builder with generic name filtering
- `src/assets/breadcrumb.test.ts` - 25 test cases for breadcrumb paths and generic pattern (300 lines)
- `src/layout/types.ts` - Added blendMode and isMask fields to LayoutNode
- `src/layout/normalize.ts` - Captures blendMode (non-PASS_THROUGH/NORMAL) and isMask (true) from raw nodes
- `src/layout/normalize.test.ts` - Added 6 tests for blendMode and isMask capture
- `src/assets/types.ts` - Extended ExportResult.assets with optional nodeId and assetType

## Decisions Made
- **ExportResult fields made optional:** nodeId and assetType on ExportResult.assets are optional (`?`) to avoid breaking the existing export pipeline (download.ts returns `{ filename, path }` only). Plan 02 will make them required when it threads nodeId through the full pipeline.
- **Threshold values:** CHILD_COUNT_THRESHOLD=5 (avoids 2-4 vector icon groups), NESTING_DEPTH_THRESHOLD=3, SCAN_DEPTH_LIMIT=3 -- exported as constants for easy tuning.
- **Generic name pattern expanded:** Added Line, Star, Polygon to the pattern beyond the research recommendation, matching all Figma primitive node type names.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Made ExportResult.assets nodeId and assetType optional**
- **Found during:** Task 1 (type extensions)
- **Issue:** Making nodeId and assetType required on ExportResult.assets would break existing export.ts (downloadAllAssets returns { filename, path } only) and generate.test.ts (makeExportResult doesn't include these fields)
- **Fix:** Made both fields optional with `?` -- they are available when populated by the enhanced pipeline (Plan 02)
- **Files modified:** src/assets/types.ts
- **Verification:** Full test suite passes (260 tests), no type errors in existing code
- **Committed in:** 2411884 (part of Task 1 RED commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor type-level adjustment. nodeId and assetType are structurally present on ExportResult for downstream use; Plan 02 will populate them when threading through the pipeline.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Composition detection and breadcrumb builder are tested pure functions ready for pipeline integration
- Plan 02 will integrate detectCompositions into identifyAssets, add PNG-render batch to export, thread nodeId through downloadAllAssets, and extend the brief Assets table with Type and Location columns
- Threshold constants are exported and tunable if real-world testing reveals adjustments needed

## Self-Check: PASSED

- All 8 files exist
- All 4 commits found (2411884, b5b863f, 9c07dbc, b046205)
- 260 tests pass

---
*Phase: 07-smart-asset-detection-layout-mapping*
*Completed: 2026-02-28*
