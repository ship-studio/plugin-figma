---
phase: 22-asset-clarity-in-brief
plan: 01
subsystem: brief
tags: [markdown, brief-generator, assets, usage-context]

# Dependency graph
requires:
  - phase: 18-manual-asset-pipeline
    provides: "Asset pipeline with nodeId, assetType, parentInstanceId, breadcrumb map"
  - phase: 21-mode-specific-brief-instructions
    provides: "Mode-specific instructions with Before/During/After structure"
provides:
  - "Usage column in Assets table replacing raw Location column"
  - "deriveUsageContext function for human-readable asset purpose strings"
  - "Updated brief instructions calling Assets section the complete manifest"
affects: [23-placeholder-detection]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Usage context derivation: type + breadcrumb -> human-readable purpose"

key-files:
  created: []
  modified:
    - src/brief/generate.ts
    - src/brief/generate.test.ts

key-decisions:
  - "Replace Location column entirely with Usage column (not add alongside)"
  - "Usage format: 'Type in Breadcrumb' for located assets, plain 'Type' for unlocated"
  - "Preview row gets fixed 'Full-page preview screenshot' usage text"

patterns-established:
  - "deriveUsageContext pattern: switch on assetType with location check for human-readable output"

requirements-completed: [ASTC-01, ASTC-02]

# Metrics
duration: 3min
completed: 2026-03-01
---

# Phase 22 Plan 01: Asset Clarity in Brief Summary

**Assets table uses Usage column with human-readable context ("Icon in Hero > Header") replacing raw breadcrumb Location, plus manifest-explicit instructions**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-01T17:24:51Z
- **Completed:** 2026-03-01T17:27:53Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Assets table now shows "Usage" column with derived context like "Icon in Hero > Header" instead of raw breadcrumb paths
- Preview row shows "Full-page preview screenshot" as its usage
- Brief instructions explicitly call Assets section the "complete manifest" and direct Claude Code to use CSS/HTML for non-listed elements
- 6 new usage context tests plus all existing tests updated (73 total, all passing)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Usage column to Assets table and derive usage context** - `7509e83` (feat)
2. **Task 2: Add tests for usage context and asset clarity** - `2ced4d0` (test)

## Files Created/Modified
- `src/brief/generate.ts` - Added deriveUsageContext function, updated buildAssetsSection to use Usage column, updated instructions manifest language
- `src/brief/generate.test.ts` - Updated 10 existing assertions for new column format, added 6 new usage context tests, updated 3 instruction tests

## Decisions Made
- Replaced Location column entirely with Usage column rather than adding Usage alongside Location -- keeps table width manageable
- Usage format uses "Type in Breadcrumb" pattern for assets with location, plain type label for unlocated assets
- Preview row gets a fixed descriptive string rather than a derived one since preview is always a full-page screenshot

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated stale instruction tests from prior phase**
- **Found during:** Task 2 (test updates)
- **Issue:** Three instruction tests ("Before building", "During building", "After building") were checking for text patterns from a previous version of the instructions that no longer existed after phase 21's mode-specific instruction changes
- **Fix:** Updated test assertions to match current instruction text (e.g., checking for "Read this brief" instead of "plan" and "clarifying questions")
- **Files modified:** src/brief/generate.test.ts
- **Verification:** All 73 tests pass
- **Committed in:** 2ced4d0 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Test fix was necessary for correctness -- pre-existing stale assertions. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Brief generator now clearly distinguishes assets from non-asset elements
- Ready for phase 23 (placeholder detection) which builds on asset clarity

## Self-Check: PASSED

All files and commits verified:
- src/brief/generate.ts: FOUND
- src/brief/generate.test.ts: FOUND
- 22-01-SUMMARY.md: FOUND
- Commit 7509e83: FOUND
- Commit 2ced4d0: FOUND

---
*Phase: 22-asset-clarity-in-brief*
*Completed: 2026-03-01*
