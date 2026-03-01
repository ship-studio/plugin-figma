---
phase: 15-strip-auto-detection
plan: 01
subsystem: assets
tags: [figma, asset-pipeline, cleanup, composition-detection, layout-extraction]

# Dependency graph
requires: []
provides:
  - Clean codebase with zero auto-detection code
  - Preview-only export pipeline ready for ManualAsset[] refactor
  - Simplified ExtractLayoutResult (no instancesWithText or imageFills collection)
affects: [16-manual-asset-types, 17-export-pipeline-refactor, 18-asset-list-ui, 19-cross-referencing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "export.ts preview-only pattern: fetchImages for single node at 2x, return empty assets[]"
    - "assetType union narrowed to 'icon' | 'image' only"

key-files:
  created: []
  modified:
    - src/assets/export.ts
    - src/assets/types.ts
    - src/assets/download.ts
    - src/layout/extract.ts
    - src/brief/generate.ts
    - src/brief/generate.test.ts
    - src/views/MainView.tsx

key-decisions:
  - "Removed instancesWithText from ExtractLayoutResult interface (only consumer was identifyAssets)"
  - "Removed collectImageFillsFromRawTree and raw imageFills merge from extractLayout (asset pipeline consumers deleted)"
  - "Kept breadcrumb.ts and AssetEntry type for downstream use in Phases 16-18"

patterns-established:
  - "Preview-only export: export.ts generates only preview PNG, returns empty assets array"

requirements-completed: [CLEAN-01, CLEAN-02, CLEAN-03, EXPT-03, EXPT-04]

# Metrics
duration: 4min
completed: 2026-03-01
---

# Phase 15 Plan 01: Strip Auto-Detection Summary

**Deleted 514 lines of auto-detection code (identify.ts + detect-composition.ts), hollowed export.ts to preview-only, stripped composition logic from brief generator and MainView**

## Performance

- **Duration:** 4 min 27 sec
- **Started:** 2026-03-01T13:07:56Z
- **Completed:** 2026-03-01T13:12:23Z
- **Tasks:** 2
- **Files modified:** 11 (4 deleted, 7 modified)

## Accomplishments
- Deleted identify.ts (306 lines), identify.test.ts (68 tests), detect-composition.ts (208 lines), detect-composition.test.ts (17 tests)
- Hollowed export.ts to preview-only: no asset identification, no batch download, returns empty assets[]
- Stripped all composition logic from generate.ts: no compositionNodeIds, no [Illustration] branch, no 'composition'/'component' in assetTypeLabel
- Simplified MainView.tsx: no rootNodes/imageFills/instancesWithText in exportAssets call, no composition count or warning filter
- All 256 remaining tests pass with zero type errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Delete auto-detection modules and hollow out asset pipeline** - `dd50e77` (feat)
2. **Task 2: Strip brief generator composition logic, fix tests, update MainView** - `a5726da` (feat)

## Files Created/Modified
- `src/assets/identify.ts` - DELETED (auto-detection core, 306 lines)
- `src/assets/identify.test.ts` - DELETED (51 tests)
- `src/assets/detect-composition.ts` - DELETED (composition detection, 208 lines)
- `src/assets/detect-composition.test.ts` - DELETED (17 tests)
- `src/assets/export.ts` - Hollowed to preview-only (fetchImages for selectedNodeId, no batch asset export)
- `src/assets/types.ts` - Narrowed ExportResult.assets[].assetType to 'icon' | 'image'
- `src/assets/download.ts` - Narrowed inline assetType unions to 'icon' | 'image'
- `src/layout/extract.ts` - Removed collectImageFillsFromRawTree, collectInstancesWithText, instancesWithText from interface
- `src/brief/generate.ts` - Removed compositionNodeIds, [Illustration] branch, 'composition'/'component' labels
- `src/brief/generate.test.ts` - Deleted composition test, fixed component->image test, removed instancesWithText from helper
- `src/views/MainView.tsx` - Simplified exportAssets call, removed composition count and warning filter

## Decisions Made
- Removed `instancesWithText` entirely from `ExtractLayoutResult` (only consumer was the deleted identifyAssets)
- Removed `collectImageFillsFromRawTree` and raw imageFills merge from `extractLayout` (both only served the deleted asset pipeline)
- Kept `breadcrumb.ts` and `AssetEntry` type intact (downstream use in Phases 16-18)
- Kept `fetchImageFills` in figma-api.ts (it's a general utility, just no longer imported by export.ts)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Codebase is cleanly stripped of all auto-detection code
- export.ts is preview-only, ready for Phase 17 to refactor to accept ManualAsset[]
- AssetEntry type retained in types.ts for Phase 16 to replace with ManualAsset
- All 256 tests pass, zero type errors
- The plugin produces briefs with layout tree, design tokens, and preview PNG only

## Self-Check: PASSED

All 4 deleted files confirmed absent. All 7 modified files confirmed present. Both task commits (dd50e77, a5726da) found in git log. SUMMARY.md exists.

---
*Phase: 15-strip-auto-detection*
*Completed: 2026-03-01*
