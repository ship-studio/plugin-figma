---
phase: 25-pipeline-integration-zero-asset-warning
plan: 01
subsystem: ui
tags: [react, figma-api, asset-detection, pipeline]

# Dependency graph
requires:
  - phase: 24-detection-foundation
    provides: "detectAssets() function and DetectedAsset/DetectionResult types"
provides:
  - "Detection pipeline integrated into MainView extraction flow"
  - "detectedToManual() adapter bridging DetectedAsset to ManualAsset"
  - "rawRootNodes on ExtractLayoutResult for pre-normalization tree access"
  - "Zero-asset blocking warning card with Try again / Continue anyway"
  - "Detection warnings merged into export result warnings"
affects: [26-results-ux-refresh, 27-brief-copy-updates]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Detection-then-export pipeline pattern (runDetectionAndExport)"
    - "Blocking warning card pattern (mirrors large-tree warning)"

key-files:
  created:
    - src/assets/adapt.ts
    - src/assets/adapt.test.ts
  modified:
    - src/layout/extract.ts
    - src/views/MainView.tsx
    - src/brief/generate.test.ts

key-decisions:
  - "Synthetic root wrapper for multi-root detection (single root passthrough, multi wraps in __root__)"
  - "Detection runs after extractLayout but before exportAssets in both normal and large-tree paths"
  - "retryCount persists across handleExtract calls within a session for progressive hint messaging"

patterns-established:
  - "Detection pipeline checkpoint: runDetectionAndExport wraps detectAssets + zero-asset gate before export"
  - "Adapter pattern: detectedToManual bridges detection-only types to export-compatible ManualAsset"

requirements-completed: [WARN-01, WARN-02, WARN-03, WARN-04]

# Metrics
duration: 4min
completed: 2026-03-01
---

# Phase 25 Plan 01: Pipeline Integration Summary

**Detection pipeline wired into extraction flow with zero-asset blocking warning card, Try again/Continue anyway actions, and detected+manual asset merging into exportAssets()**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-01T21:41:02Z
- **Completed:** 2026-03-01T21:45:06Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- detectAssets() output integrated into MainView extraction pipeline via new runDetectionAndExport function
- Zero-asset blocking warning card with "Try again" (re-fetches from Figma API) and "Continue anyway" (generates brief without assets)
- Detected @S- assets merge with manual assets through detectedToManual() adapter before exportAssets()
- Detection warnings merge into export result for display in result card
- Pipeline works through both normal extraction path and large-tree confirmation path

## Task Commits

Each task was committed atomically:

1. **Task 1: Expose rawRootNodes and create DetectedAsset-to-ManualAsset adapter** - `d477c2e` (feat, TDD)
2. **Task 2: Wire detection into MainView pipeline and add zero-asset warning UI** - `9d8feda` (feat)

## Files Created/Modified
- `src/assets/adapt.ts` - DetectedAsset-to-ManualAsset adapter function (drops depth/parentPath, sets status='valid')
- `src/assets/adapt.test.ts` - 4 unit tests for adapter (TDD: RED then GREEN)
- `src/layout/extract.ts` - Added rawRootNodes field to ExtractLayoutResult interface and return statement
- `src/views/MainView.tsx` - Detection pipeline integration, zero-asset warning card, asset merging, state management
- `src/brief/generate.test.ts` - Added rawRootNodes to test fixture for ExtractLayoutResult type compliance

## Decisions Made
- Synthetic root wrapper: when multiple raw root nodes exist, wrap in `{ name: '__root__', children: [...], visible: true }` for detectAssets(); single root passes through directly
- Detection runs synchronously (pure function) between async extractLayout() and async exportAssets(), keeping the pipeline simple
- retryCount does NOT reset on handleExtract() -- it accumulates across retries so the hint message persists after second+ attempts
- pendingResultRef.current is NOT cleared in handleConfirmLargeTree because runDetectionAndExport may re-store it for the zero-asset path

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed ExtractLayoutResult type in generate.test.ts**
- **Found during:** Task 1 (after adding rawRootNodes to interface)
- **Issue:** generate.test.ts makeExtraction() helper was missing the new required rawRootNodes field, causing TypeScript compilation failure
- **Fix:** Added `rawRootNodes: []` to the test fixture
- **Files modified:** src/brief/generate.test.ts
- **Verification:** `npx tsc --noEmit` passes clean
- **Committed in:** d477c2e (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix was necessary to maintain TypeScript compilation after adding required field. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Detection pipeline fully operational -- ready for Phase 26 (Results UX Refresh) to update how results are displayed
- Brief placeholder text in generate.ts still references "manually added assets" -- to be addressed in Phase 26 or 27
- All 343 tests pass, TypeScript compiles clean

## Self-Check: PASSED

All 6 files verified present. Both task commits (d477c2e, 9d8feda) found in git log.

---
*Phase: 25-pipeline-integration-zero-asset-warning*
*Completed: 2026-03-01*
