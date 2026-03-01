---
phase: 26-mainview-rewiring-cleanup
plan: 01
subsystem: ui
tags: [react, cleanup, dead-code-removal, asset-pipeline]

# Dependency graph
requires:
  - phase: 25-pipeline-integration-zero-asset-warning
    provides: "@S- detection wired into export pipeline, making manual asset workflow dead code"
provides:
  - "Clean codebase with @S- detection as sole asset pipeline"
  - "resolveFilenameCollision relocated to sanitize.ts"
  - "No manual asset UI, state, or callbacks in MainView"
affects: [27-brief-text-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single asset pipeline via @S- prefix detection (no manual workflow)"

key-files:
  created: []
  modified:
    - src/assets/sanitize.ts
    - src/assets/sanitize.test.ts
    - src/assets/detect.ts
    - src/views/MainView.tsx
    - src/styles.ts

key-decisions:
  - "Kept ManualAsset type and adapt.ts -- still used as bridge between detection and export pipeline"
  - "Kept manualAssets parameter name in export.ts -- renaming would cascade across test fixtures for no functional benefit"

patterns-established:
  - "Asset pipeline: detect.ts -> adapt.ts -> export.ts with no manual asset injection point"

requirements-completed: [CLNP-01, CLNP-02]

# Metrics
duration: 3min
completed: 2026-03-01
---

# Phase 26 Plan 01: MainView Rewiring & Cleanup Summary

**Removed entire manual asset URL workflow (resolve.ts, AssetListPanel, 6 callbacks, 170 lines CSS), leaving @S- detection as sole asset pipeline**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-01T22:13:40Z
- **Completed:** 2026-03-01T22:17:13Z
- **Tasks:** 2
- **Files modified:** 5 modified, 3 deleted

## Accomplishments
- Relocated `resolveFilenameCollision` from resolve.ts to sanitize.ts with all 5 tests
- Deleted 3 dead code files: resolve.ts (172 lines), resolve.test.ts (159 lines), AssetListPanel.tsx (340 lines)
- Stripped all manual asset plumbing from MainView: state, 6 callbacks, JSX panel, button label logic
- Cleaned 170 lines of orphaned `.figma-plugin-asset-*` CSS from styles.ts

## Task Commits

Each task was committed atomically:

1. **Task 1: Relocate resolveFilenameCollision and delete dead asset files** - `d72278d` (refactor)
2. **Task 2: Strip manual asset plumbing from MainView and clean orphaned CSS** - `dd091c7` (refactor)

## Files Created/Modified
- `src/assets/sanitize.ts` - Added resolveFilenameCollision function (relocated from resolve.ts)
- `src/assets/sanitize.test.ts` - Added 5 collision resolution tests (relocated from resolve.test.ts)
- `src/assets/detect.ts` - Updated import to point to sanitize instead of resolve
- `src/views/MainView.tsx` - Removed AssetListPanel, manualAssets state, 6 callbacks, simplified runAssetExport and button label
- `src/styles.ts` - Removed all .figma-plugin-asset-* CSS rules (170 lines)
- `src/assets/resolve.ts` - DELETED
- `src/assets/resolve.test.ts` - DELETED
- `src/components/AssetListPanel.tsx` - DELETED

## Decisions Made
- Kept `ManualAsset` type and `adapt.ts` -- they bridge DetectedAsset to the export pipeline format and are still actively used
- Kept `manualAssets` parameter name in export.ts -- renaming to `assets` would cascade across 15+ test fixture references for no functional benefit
- Button label simplified to "Get Brief" / "Get New Brief" (removed asset count display since assets are auto-detected, not manually managed)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Codebase is clean: zero traces of manual asset URL workflow
- @S- detection is the sole asset pipeline
- Ready for Phase 27 (brief text cleanup to update "manually added assets" placeholder text)

## Self-Check: PASSED

- All 5 modified files exist on disk
- All 3 deleted files confirmed absent
- Both task commits (d72278d, dd091c7) found in git log
- TypeScript compiles clean (tsc --noEmit exits 0)
- All 327 tests pass (vitest run)
- Zero grep hits for dead imports/references

---
*Phase: 26-mainview-rewiring-cleanup*
*Completed: 2026-03-01*
