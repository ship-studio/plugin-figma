---
phase: 12-instance-asset-detection
plan: 02
subsystem: assets
tags: [figma, image-detection, instance-recursion, pipeline-integration, layout-tree, breadcrumb]

# Dependency graph
requires:
  - phase: 12-instance-asset-detection
    provides: isSimpleRectangle, findImageFillsInChildren, instance IMAGE fill detection in identify.ts
provides:
  - collectImageFillsFromRawTree function for pre-normalization IMAGE fill collection
  - parentInstanceId threading through full export pipeline (identify -> export -> download -> brief)
  - Instance-to-child-image mapping in layout tree cross-referencing
  - Breadcrumb fallback via parentInstanceId for instance child images in Assets table
affects: [brief-generation, asset-export]

# Tech tracking
tech-stack:
  added: []
  patterns: [raw-tree-image-fill-collection, parentInstanceId-pipeline-threading, breadcrumb-fallback]

key-files:
  created: []
  modified:
    - src/layout/extract.ts
    - src/brief/generate.ts
    - src/assets/export.ts
    - src/assets/download.ts
    - src/assets/types.ts
    - src/assets/identify.ts
    - src/brief/generate.test.ts

key-decisions:
  - "collectImageFillsFromRawTree runs before normalization to capture instance children IMAGE fills that normalization strips"
  - "parentInstanceId only set on first child image per instance (first wins for layout tree annotation)"
  - "Breadcrumb fallback: try direct nodeId first, then parentInstanceId -- instance child I-prefix nodeIds are not in normalized tree"
  - "I-prefix node IDs never sent to fetchImages -- only resolved via imageRef through fetchImageFills path"

patterns-established:
  - "Pre-normalization raw tree walking: extract data from raw API response before normalize strips instance children"
  - "parentInstanceId threading: carry parent context through the full pipeline for cross-referencing"
  - "Breadcrumb fallback chain: direct nodeId -> parentInstanceId -> '--' for nodes outside normalized tree"

requirements-completed: [ASSET-05, ASSET-06, ASSET-07]

# Metrics
duration: 4min
completed: 2026-03-01
---

# Phase 12 Plan 02: Pipeline Integration Summary

**End-to-end instance child image pipeline: raw tree IMAGE fill collection, parentInstanceId threading through export/download, layout tree cross-referencing, and breadcrumb fallback for instance child images**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-01T09:15:50Z
- **Completed:** 2026-03-01T09:20:03Z
- **Tasks:** 2 (1 TDD, 1 auto)
- **Files modified:** 7

## Accomplishments
- Raw Figma tree walked for IMAGE fills before normalization strips instance children (collectImageFillsFromRawTree in extract.ts)
- parentInstanceId threaded from identify.ts through export.ts and download.ts to ExportResult.assets
- Layout tree INSTANCE lines annotated with child image filenames via parentInstanceId mapping in generate.ts
- Assets table shows breadcrumb location for instance child images using parentInstanceId fallback
- All 303 tests passing (3 new tests + 300 existing)

## Task Commits

Each task was committed atomically:

1. **TDD RED: Failing tests for instance child cross-referencing** - `cf86603` (test)
2. **TDD GREEN: Wire instance child detection into full pipeline** - `70a7177` (feat)
3. **Task 2: Thread parentInstanceId through export pipeline** - `046896c` (feat)

_TDD refactor phase skipped: code was clean after GREEN, no changes needed._

## Files Created/Modified
- `src/layout/extract.ts` - Added collectImageFillsFromRawTree function, merge raw-tree imageFills with collectTokens output
- `src/brief/generate.ts` - parentInstanceId -> filename mapping in assetNodeMap, breadcrumb fallback via parentInstanceId in buildAssetsSection
- `src/assets/types.ts` - Added parentInstanceId field to AssetEntry and ExportResult assets
- `src/assets/identify.ts` - Set parentInstanceId on child image entries from findImageFillsInChildren
- `src/assets/export.ts` - Thread parentInstanceId through download list for fillEntries, defensive comment on I-prefix node IDs
- `src/assets/download.ts` - Thread parentInstanceId through downloadAllAssets results
- `src/brief/generate.test.ts` - 3 new tests: instance child cross-ref annotation, direct asset match preservation, breadcrumb fallback

## Decisions Made
- collectImageFillsFromRawTree runs before normalization to capture instance children IMAGE fills that normalization strips
- parentInstanceId only maps first child image per instance (first wins) -- instance lines can only show one -> filename.png
- Breadcrumb fallback: try direct nodeId first, then parentInstanceId -- instance child I-prefix nodeIds are not in normalized tree
- I-prefix node IDs never sent to fetchImages -- only resolved via imageRef through fetchImageFills path

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Complete end-to-end pipeline: instance child images flow from raw Figma data through identification, download, and into the design brief with correct cross-references
- Phase 12 (Instance Asset Detection) is now fully complete
- Ready for Phase 13 (next v1.3 phase)

## Self-Check: PASSED

All files and commits verified:
- src/layout/extract.ts: FOUND
- src/brief/generate.ts: FOUND
- src/assets/types.ts: FOUND
- src/assets/identify.ts: FOUND
- src/assets/export.ts: FOUND
- src/assets/download.ts: FOUND
- src/brief/generate.test.ts: FOUND
- 12-02-SUMMARY.md: FOUND
- cf86603 (RED commit): FOUND
- 70a7177 (GREEN commit): FOUND
- 046896c (Task 2 commit): FOUND

---
*Phase: 12-instance-asset-detection*
*Completed: 2026-03-01*
