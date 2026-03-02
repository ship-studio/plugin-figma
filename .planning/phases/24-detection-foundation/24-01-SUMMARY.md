---
phase: 24-detection-foundation
plan: 01
subsystem: assets
tags: [figma, tree-walk, asset-detection, tdd, pure-function]

# Dependency graph
requires: []
provides:
  - "detectAssets() pure function for @S- prefix tree scanning"
  - "DetectedAsset and DetectionResult types"
  - "Auto PNG/SVG format detection via IMAGE fill walk"
  - "Filename sanitization with dedup and collision resolution"
  - "Position metadata (depth, parentPath) for layout tree mapping"
affects: [25-export-pipeline, 26-brief-integration, 27-results-ux]

# Tech tracking
tech-stack:
  added: []
  patterns: [two-phase-detect-dedup, image-fill-recursive-walk, insideDetected-flag]

key-files:
  created:
    - src/assets/detect.ts
    - src/assets/detect.test.ts
  modified:
    - src/assets/types.ts

key-decisions:
  - "TEXT-only layers default to SVG (svg_outline_text=true makes this safe)"
  - "Position metadata: depth (int) + parentPath (string[]) -- computed inline during walk"
  - "Duck typing for raw Figma nodes (consistent with existing normalizeNode, collectTokens patterns)"
  - "Silent dedup of identical filenames (matches Phase 9 SVG dedup pattern)"

patterns-established:
  - "Two-phase detection: walk tree collecting raws, then dedup+resolve in separate pass"
  - "insideDetected flag prevents nested @S- double-detection without modifying tree"
  - "fill.visible !== false (not === true) for Figma default-visible semantics"

requirements-completed: [DETECT-01, DETECT-02, DETECT-03, DETECT-04, DETECT-05]

# Metrics
duration: 3min
completed: 2026-03-01
---

# Phase 24 Plan 01: Detection Foundation Summary

**Pure detectAssets() function that walks raw Figma trees for @S- prefixed layers, auto-determines PNG/SVG format via recursive IMAGE fill detection, and returns typed assets with clean filenames and position metadata**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-01T21:09:28Z
- **Completed:** 2026-03-01T21:12:07Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Built `detectAssets()` pure function with full TDD cycle (26 tests RED -> GREEN)
- Auto-determines PNG vs SVG format by recursively checking for IMAGE fills in subtrees
- Handles all edge cases: nested @S- (outermost only), hidden layers, empty prefix, case-insensitive matching, strict dash requirement
- Reuses existing `sanitizeFilename` and `resolveFilenameCollision` -- no hand-rolled alternatives
- Full test suite passes (339/339 tests, 10 files) with zero regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: Add DetectedAsset type and write failing tests** - `04dc45d` (test)
2. **Task 2: Implement detectAssets to pass all tests** - `d5d6783` (feat)

**Plan metadata:** `d58d293` (docs: complete plan)

_Note: TDD tasks have RED (test) -> GREEN (feat) commits. No refactoring needed._

## Files Created/Modified
- `src/assets/types.ts` - Added DetectedAsset and DetectionResult interfaces
- `src/assets/detect.ts` - New module: detectAssets() pure function with tree walker, image fill checker, dedup/collision resolver
- `src/assets/detect.test.ts` - 26 tests covering all 5 DETECT requirements plus nesting rules

## Decisions Made
- TEXT-only layers default to SVG -- `svg_outline_text=true` in fetchImages converts text to paths, making SVG safe and smaller than PNG
- Position metadata shape: `depth: number` + `parentPath: string[]` -- both trivially computed during walk, no extra passes needed
- Duck typing with property existence checks for raw Figma nodes -- consistent with existing codebase patterns (normalizeNode, collectTokens)
- Silent dedup of identical filenames -- matches Phase 9 SVG dedup behavior, no warnings for expected duplicates

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `detectAssets()` is ready for Phase 25 (export pipeline integration)
- DetectedAsset type ready for Phase 26 (brief integration) to consume
- Function is pure with no side effects -- easy to compose into any pipeline

## Self-Check: PASSED

- FOUND: src/assets/detect.ts
- FOUND: src/assets/detect.test.ts
- FOUND: src/assets/types.ts
- FOUND: 24-01-SUMMARY.md
- FOUND: commit 04dc45d
- FOUND: commit d5d6783

---
*Phase: 24-detection-foundation*
*Completed: 2026-03-01*
