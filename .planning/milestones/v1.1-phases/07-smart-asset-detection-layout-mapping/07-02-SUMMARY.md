---
phase: 07-smart-asset-detection-layout-mapping
plan: 02
subsystem: assets
tags: [composition-export, breadcrumb, brief-table, pipeline-integration, png-render, tdd]

# Dependency graph
requires:
  - phase: 07-smart-asset-detection-layout-mapping
    provides: detectCompositions, buildBreadcrumbMap, ExportResult type extensions
  - phase: 04-asset-export
    provides: identifyAssets, exportAssets, downloadAllAssets pipeline
  - phase: 05-brief-assembly
    provides: generateBrief, buildAssetsSection, BriefInput types
provides:
  - Composition-aware asset identification (compositionIds parameter)
  - PNG-render batch export at 2x scale for compositions
  - 4-column Assets table in brief (File, Type, Location, Path)
  - nodeId/assetType threaded through full download pipeline
affects: [brief-output, asset-pipeline, ux-flow]

# Tech tracking
tech-stack:
  added: []
  patterns: [composition-id-pass-through, breadcrumb-location-column, png-render-batch-fallback, asset-type-labeling]

key-files:
  created: []
  modified:
    - src/assets/identify.ts
    - src/assets/identify.test.ts
    - src/assets/export.ts
    - src/assets/download.ts
    - src/brief/generate.ts
    - src/brief/generate.test.ts
    - src/brief/types.ts
    - src/views/MainView.tsx

key-decisions:
  - "compositionIds defaults to empty Set for backward compatibility -- existing callers unaffected"
  - "Composition check runs BEFORE all other classification (INSTANCE, IMAGE fill, SVG) in both classifyNode and classifyNodeLeaf"
  - "PNG-render batch failure is non-fatal -- warning added, not thrown"
  - "SVG assets get assetType 'icon', png-fill gets 'image', png-render gets 'composition'"
  - "BriefInput.rootNodes is optional, falls back to extraction.extraction.rootNodes"
  - "Assets without nodeId show '--' in Location column (backward compat for legacy pipeline)"

patterns-established:
  - "Composition-first classification: compositionIds checked before all other export type logic"
  - "Non-fatal API batch: composition PNG render failures degrade gracefully with warnings"
  - "Asset metadata threading: nodeId and assetType flow through download list to ExportResult"
  - "Brief breadcrumb integration: breadcrumbMap computed once and passed to buildAssetsSection"

requirements-completed: [ASSET-01, ASSET-02, ASSET-03, ASSET-04]

# Metrics
duration: 4min
completed: 2026-02-28
---

# Phase 7 Plan 02: Pipeline Integration Summary

**Composition detection wired into export pipeline with PNG-render batch, and brief Assets table extended to 4 columns (File, Type, Location, Path) with breadcrumb-based location paths**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-28T21:38:08Z
- **Completed:** 2026-02-28T21:42:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- identifyAssets now accepts compositionIds Set, classifying matched nodes as png-render and skipping child recursion
- exportAssets calls detectCompositions before identifyAssets, makes separate PNG batch API call at 2x scale for compositions
- downloadAllAssets threads nodeId and assetType through to ExportResult.assets for downstream use
- Brief Assets table upgraded from 3 columns to 4 columns with Type (Icon/Image/Composition/Preview) and Location (breadcrumb path or --)
- MainView passes rootNodes to generateBrief for breadcrumb computation
- 272 total tests pass (7 net new: 5 for identify composition, 5 new for brief assets replacing 3 old), zero regressions

## Task Commits

Each task was committed atomically (TDD: test -> feat):

1. **Task 1: Integrate composition detection into identify and export pipeline**
   - `dcc1a1c` (test) - Failing tests for composition detection in identifyAssets
   - `33dedf0` (feat) - Implement composition detection integration in identify, export, download
2. **Task 2: Extend brief Assets table with Type and Location columns**
   - `dbaf11e` (test) - Failing tests for 4-column assets table with Type and Location
   - `4581311` (feat) - Implement 4-column assets table with breadcrumb location

## Files Created/Modified
- `src/assets/identify.ts` - Added compositionIds parameter, composition-first check in classifyNode and classifyNodeLeaf
- `src/assets/identify.test.ts` - 5 new tests for composition identification behavior
- `src/assets/export.ts` - Calls detectCompositions, PNG-render batch, nodeId/assetType in download list
- `src/assets/download.ts` - downloadAllAssets threads nodeId and assetType through to results
- `src/brief/generate.ts` - 4-column Assets table with Type, Location (breadcrumb), assetTypeLabel helper
- `src/brief/generate.test.ts` - 5 new tests replacing 3 old for 4-column table, breadcrumb, composition type
- `src/brief/types.ts` - BriefInput gains optional rootNodes field
- `src/views/MainView.tsx` - Passes rootNodes to generateBrief

## Decisions Made
- **compositionIds default:** Added `= new Set()` default parameter for backward compatibility -- all existing callers work without modification.
- **Composition priority:** Composition check runs FIRST in both classifyNode and classifyNodeLeaf, before INSTANCE or IMAGE fill checks. This ensures a node flagged as composition is never misclassified.
- **PNG-render fallback:** If the fetchImages call for compositions fails, a warning is added but export continues. Non-fatal design matches existing SVG/fill error handling.
- **Asset type mapping:** SVG entries get assetType 'icon', png-fill gets 'image', png-render gets 'composition'. This creates a clean display label mapping.
- **BriefInput rootNodes optional:** Falls back to extraction.extraction.rootNodes when not explicitly provided, ensuring backward compatibility.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 7 is complete: composition detection, breadcrumb mapping, pipeline integration, and brief table extension all operational
- The asset pipeline now handles three export types: SVG (icons), PNG-fill (images), and PNG-render (compositions)
- Brief output includes full location context via breadcrumbs, enabling Claude Code to understand asset placement in the design hierarchy
- Ready for Phase 8 (UX Flow Simplification)

## Self-Check: PASSED

- All 9 files exist (8 modified + 1 SUMMARY created)
- All 4 commits found (dcc1a1c, 33dedf0, dbaf11e, 4581311)
- 272 tests pass, 0 failures

---
*Phase: 07-smart-asset-detection-layout-mapping*
*Completed: 2026-02-28*
