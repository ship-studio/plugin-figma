---
phase: 12-instance-asset-detection
plan: 01
subsystem: assets
tags: [figma, image-detection, instance-recursion, rectangle-filter, tdd]

# Dependency graph
requires:
  - phase: 09-smart-illustration-detection
    provides: composition detection and vector-only group identification in identify.ts
provides:
  - isSimpleRectangle pure function for CSS-reproducible rectangle filtering
  - findImageFillsInChildren recursive IMAGE fill discovery in instance children
  - Instance IMAGE fill override detection (png-fill instead of png-render)
  - Global imageRef dedup across all walkTree calls via seenImageRefs set
affects: [12-02, brief-generation, token-collection]

# Tech tracking
tech-stack:
  added: []
  patterns: [instance-child-image-recursion, imageRef-global-dedup, rectangle-simplicity-filter]

key-files:
  created: []
  modified:
    - src/assets/identify.ts
    - src/assets/identify.test.ts

key-decisions:
  - "Instance own IMAGE fill (ASSET-06) takes priority over child recursion -- early return prevents both png-fill and png-render"
  - "imageRef dedup is global (seenImageRefs shared across all walkTree calls) to prevent duplicate exports of identical images across instances"
  - "Rectangle filtering only applies in main tree walk, not inside instance children (instance children only scanned for IMAGE fills)"
  - "Updated existing test for rectangle-with-solid-fill to reflect new ASSET-07 behavior (silently skipped instead of SVG export)"

patterns-established:
  - "Instance IMAGE fill check before png-render fallback: always check hasImageFill on INSTANCE nodes first"
  - "findImageFillsInChildren: recurse full depth, collect only IMAGE fills, dedup by imageRef"
  - "isSimpleRectangle guard: check strokes, gradients, image fills, and effects before exporting RECTANGLE as SVG"

requirements-completed: [ASSET-05, ASSET-06, ASSET-07]

# Metrics
duration: 3min
completed: 2026-03-01
---

# Phase 12 Plan 01: Instance Asset Detection Summary

**Instance IMAGE fill override detection, child image recursion with global imageRef dedup, and simple rectangle filtering in identifyAssets**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-01T09:10:26Z
- **Completed:** 2026-03-01T09:13:16Z
- **Tasks:** 2 (TDD RED + GREEN)
- **Files modified:** 2

## Accomplishments
- ASSET-07: Simple rectangles (solid-only, no strokes/effects/gradients) silently skipped from SVG export
- ASSET-06: Instance nodes with IMAGE fill overrides exported as png-fill using instance name instead of component screenshot
- ASSET-05: Full-depth recursive instance child IMAGE fill detection with global imageRef dedup
- 50 tests passing (24 new tests + 26 existing, 1 existing updated for new behavior)

## Task Commits

Each task was committed atomically:

1. **TDD RED: Failing tests** - `a6bda29` (test)
2. **TDD GREEN: Implementation** - `b7a1b03` (feat)

_TDD refactor phase skipped: code was clean after GREEN, no changes needed._

## Files Created/Modified
- `src/assets/identify.ts` - Added isSimpleRectangle, findImageFillsInChildren, updated walkTree INSTANCE branch with IMAGE fill checks and child recursion, added seenImageRefs to walkTree signature
- `src/assets/identify.test.ts` - 24 new tests covering rectangle filtering, instance IMAGE fill override, instance child image detection, imageRef dedup, and edge cases

## Decisions Made
- Instance own IMAGE fill (ASSET-06) takes priority over child recursion -- if the instance itself has an IMAGE fill, we export that and skip child scanning
- imageRef dedup is global across all walkTree calls to prevent duplicate exports of identical images appearing in multiple card instances
- Rectangle filtering only applies in the main tree walk, not inside instance children (those are only scanned for IMAGE fills anyway)
- Updated one existing test ("identifies RECTANGLE without image fills as SVG") to reflect ASSET-07 behavior change -- solid-only rectangles are now silently skipped

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated existing test for ASSET-07 behavioral change**
- **Found during:** TDD GREEN (implementation)
- **Issue:** Existing test "identifies RECTANGLE without image fills as SVG" expected a solid-fill rectangle to export as SVG, but ASSET-07 intentionally changes this behavior to silently skip simple rectangles
- **Fix:** Updated test expectation to verify rectangle is skipped (length 0), added separate test for complex rectangle with stroke to preserve SVG export coverage
- **Files modified:** src/assets/identify.test.ts
- **Verification:** All 50 tests pass
- **Committed in:** b7a1b03

---

**Total deviations:** 1 auto-fixed (1 bug -- test expectation mismatch with intended behavioral change)
**Impact on plan:** Expected consequence of ASSET-07. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- identify.ts now produces correct AssetEntry lists for instance images and filtered rectangles
- Plan 02 (token collection and brief generation integration) can consume the new asset entries
- findImageFillsInChildren returns entries with imageRef, ready for existing png-fill download pipeline

## Self-Check: PASSED

All files and commits verified:
- src/assets/identify.ts: FOUND
- src/assets/identify.test.ts: FOUND
- 12-01-SUMMARY.md: FOUND
- a6bda29 (RED commit): FOUND
- b7a1b03 (GREEN commit): FOUND

---
*Phase: 12-instance-asset-detection*
*Completed: 2026-03-01*
