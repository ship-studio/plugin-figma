---
phase: 03-design-data-extraction
plan: 02
subsystem: tokens
tags: [figma, design-tokens, color-extraction, typography, spacing, borders, shadows, components, deduplication, tdd]

# Dependency graph
requires:
  - phase: 03-design-data-extraction
    provides: Token type definitions (9 interfaces), figmaColorToCSS/gradientToCSS, enriched LayoutNode with style fields
  - phase: 02-layout-extraction
    provides: LayoutNode tree, normalizeTree, countNodes, componentRef
provides:
  - collectTokens engine producing deduplicated DesignTokens from enriched LayoutNode tree
  - API functions returning styles map for named style resolution
  - Full extraction pipeline producing tokens alongside layout tree
affects: [04-asset-export, 05-brief-assembly]

# Tech tracking
tech-stack:
  added: []
  patterns: [token-dedup-by-canonical-key, tree-walk-accumulator-pattern, styles-map-propagation]

key-files:
  created:
    - src/tokens/collect.ts
    - src/tokens/collect.test.ts
  modified:
    - src/figma-api.ts
    - src/layout/extract.ts

key-decisions:
  - "Shadow colors also extracted as ColorTokens with source 'shadow' for complete color inventory"
  - "Component inventory keyed by componentName+variantProperties JSON since componentId is already on componentRef"
  - "Color auto-names use hex suffix (color-ff0000) for easy visual identification"
  - "Spacing usageCount incremented per source occurrence rather than per unique value per node"

patterns-established:
  - "Map-based accumulation: walk tree, accumulate into Maps keyed by dedup string, convert to sorted arrays at end"
  - "Style name resolution: check node.styleRefs against top-level stylesMap, fall back to auto-generated names"
  - "Pipeline flow: fetch (with styles) -> normalize -> collectTokens -> DesignTokens on ExtractLayoutResult"

requirements-completed: [TOKN-01, TOKN-02, TOKN-03, TOKN-04, TOKN-05, COMP-01, COMP-02, COMP-03]

# Metrics
duration: 6min
completed: 2026-02-28
---

# Phase 3 Plan 02: Token Collection & Pipeline Integration Summary

**collectTokens engine extracting and deduplicating 8 token types (colors, gradients, typography, spacing, borders, shadows, imageFills, components) from enriched LayoutNode trees with named Figma style resolution and full pipeline wiring**

## Performance

- **Duration:** 6 min
- **Started:** 2026-02-28T16:50:21Z
- **Completed:** 2026-02-28T16:56:24Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Built and tested collectTokens engine with 43 TDD tests covering all 8 token types, deduplication logic, named style resolution, and edge cases
- Extended fetchFileNodes and fetchFullFile to return styles map from Figma API response for named style resolution
- Wired token extraction into extractLayout pipeline so ExtractLayoutResult now produces DesignTokens alongside the layout tree
- Full test suite at 133 tests (43 new + 90 existing), zero regressions, Vite build passes

## Task Commits

Each task was committed atomically:

1. **Task 1: collectTokens -- token collection and deduplication engine (TDD)** - `8c0d20b` (feat)
2. **Task 2: Extend API functions and wire token extraction into pipeline** - `d916fd1` (feat)

_Task 1 followed TDD: RED (failing tests) -> GREEN (implementation passing) -> verified_

## Files Created/Modified
- `src/tokens/collect.ts` - collectTokens function: walks enriched LayoutNode tree, extracts/deduplicates all token types, resolves named styles from stylesMap
- `src/tokens/collect.test.ts` - 43 tests grouped by token type (colors, gradients, imageFills, typography, spacing, borders, shadows, components, named styles, edge cases)
- `src/figma-api.ts` - fetchFileNodes and fetchFullFile extended to return `styles: Record<string, any>` from API response
- `src/layout/extract.ts` - ExtractLayoutResult extended with `tokens: DesignTokens`, extractLayout calls collectTokens after normalizeTree

## Decisions Made
- Shadow colors are also extracted as ColorTokens with source 'shadow' to provide a complete color inventory including shadow colors
- Component inventory uses `componentName::JSON(variantProperties)` as dedup key since componentId is already available on componentRef
- Color auto-names use hex suffix pattern (e.g., `color-ff0000`) for easy visual identification when no named Figma style exists
- Spacing usageCount increments per source occurrence (each padding-top, gap, etc.) rather than once per node, giving accurate source-level frequency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 3 (Design Data Extraction) is now complete -- the plugin produces a full DesignTokens collection from any Figma design
- Token data flows end-to-end: Figma API -> enriched LayoutNode tree -> collectTokens -> DesignTokens on ExtractLayoutResult
- Phase 4 (Asset Export) can access imageFills for image export
- Phase 5 (Brief Assembly) has all data needed to assemble a complete design brief: layout tree + design tokens + component inventory

## Self-Check: PASSED

All 5 files verified present. Both task commits (8c0d20b, d916fd1) verified in git log.

---
*Phase: 03-design-data-extraction*
*Completed: 2026-02-28*
