---
phase: 16-asset-types-node-resolution
plan: 01
subsystem: assets
tags: [typescript, figma-api, tdd, vitest, manual-assets]

# Dependency graph
requires:
  - phase: 15-strip-auto-detection
    provides: Clean codebase with auto-detection removed, breadcrumb.ts and sanitize.ts preserved
provides:
  - ManualAsset interface (nodeId, nodeName, filename, format, status, error?, warning?)
  - isInstanceChildId and extractParentInstanceId for I-prefix detection
  - suggestFormat for auto-deriving png/svg from Figma node type
  - resolveFilenameCollision for deduplication with -2, -3 suffixes
  - deriveAssetFromNode for full asset derivation from node metadata
  - resolveNode for async API-backed node resolution with error handling
affects: [17-export-pipeline, 18-brief-generator, 19-ui-asset-list]

# Tech tracking
tech-stack:
  added: []
  patterns: [manual-asset-derivation, i-prefix-detection, format-suggestion]

key-files:
  created:
    - src/assets/resolve.ts
    - src/assets/resolve.test.ts
  modified:
    - src/assets/types.ts

key-decisions:
  - "No refactor phase needed -- implementation was minimal and clean on first pass"
  - "resolveNode error handler returns ManualAsset with status 'error' rather than throwing"

patterns-established:
  - "ManualAsset is the v2.0 asset type -- all downstream phases consume this interface"
  - "I-prefix detection is client-side only (no API call needed)"
  - "Format suggestion: vector primitives -> svg, everything else -> png"
  - "Filename collision resolution at add-time, not export-time"

requirements-completed: [NAME-01, NAME-02, AINP-05, AINP-06]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 16 Plan 01: ManualAsset Type and Node Resolution Summary

**ManualAsset type with 6 pure resolve functions: I-prefix detection, format suggestion, filename deduplication, and async node resolution via Figma API**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-01T13:57:30Z
- **Completed:** 2026-03-01T13:59:30Z
- **Tasks:** 1 (TDD: RED + GREEN, no REFACTOR needed)
- **Files modified:** 3

## Accomplishments
- ManualAsset interface added to types.ts as the v2.0 asset data model
- 6 exported pure functions in resolve.ts covering the full node-to-asset derivation pipeline
- 21 new tests covering all behaviors: I-prefix detection, format suggestion, filename collisions, asset derivation with generic name warnings, and error handling
- Full test suite (277 tests across 8 files) passes, TypeScript compiles clean

## Task Commits

Each task was committed atomically:

1. **TDD RED: Failing tests** - `c646c8d` (test)
2. **TDD GREEN: Implementation** - `77ba1a5` (feat)

_No REFACTOR commit -- implementation was clean on first pass._

## Files Created/Modified
- `src/assets/types.ts` - Added ManualAsset interface alongside existing AssetEntry
- `src/assets/resolve.ts` - All 6 resolve functions: isInstanceChildId, extractParentInstanceId, suggestFormat, resolveFilenameCollision, deriveAssetFromNode, resolveNode
- `src/assets/resolve.test.ts` - 21 tests covering all behaviors from the plan specification

## Decisions Made
- No refactor phase needed -- implementation was minimal and followed existing patterns cleanly
- resolveNode returns a ManualAsset with status 'error' on API failure rather than throwing, matching the plan's error-asset pattern
- GENERIC_NAME_PATTERN warning uses the final (post-collision) filename per Pitfall 5 from research

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- ManualAsset type is ready for consumption by Phase 17 (export pipeline) and Phase 18 (brief generator)
- All resolve functions are pure and independently testable
- resolveNode provides the async bridge to the Figma API that the UI will use in Phase 19

## Self-Check: PASSED

- [x] src/assets/resolve.ts exists
- [x] src/assets/resolve.test.ts exists
- [x] src/assets/types.ts exists (modified)
- [x] Commit c646c8d (RED) found
- [x] Commit 77ba1a5 (GREEN) found

---
*Phase: 16-asset-types-node-resolution*
*Completed: 2026-03-01*
