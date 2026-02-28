---
phase: 03-design-data-extraction
plan: 01
subsystem: tokens
tags: [figma, color-conversion, gradient-css, design-tokens, typography, tdd]

# Dependency graph
requires:
  - phase: 02-layout-extraction
    provides: LayoutNode interface and normalizeNode tree walker
provides:
  - Token type definitions (9 interfaces) for downstream collectTokens
  - figmaColorToCSS and gradientToCSS pure conversion functions
  - Enriched normalizeNode capturing fills, strokes, effects, corner radii, text styles, opacity, style refs
  - Extended LayoutNode interface with 10 style fields
affects: [03-02-token-collection, 04-asset-export, 05-brief-assembly]

# Tech tracking
tech-stack:
  added: []
  patterns: [figma-color-to-css-hex-rgba, gradient-handle-positions-to-css-angle, style-enrichment-during-tree-walk]

key-files:
  created:
    - src/tokens/types.ts
    - src/tokens/color-utils.ts
    - src/tokens/color-utils.test.ts
  modified:
    - src/layout/types.ts
    - src/layout/normalize.ts
    - src/layout/normalize.test.ts

key-decisions:
  - "Diamond gradients approximated as radial-gradient with CSS comment prefix"
  - "Opacity of 1 (Figma default) omitted from LayoutNode to reduce noise"
  - "Empty styleOverrideTable omitted from LayoutNode (no mixed styles on that TEXT node)"
  - "Style capture placed before type dispatch switch so INSTANCE nodes also get fills/strokes/effects"

patterns-established:
  - "Pure color conversion: figmaColorToCSS handles 0-1 RGBA to #hex/rgba() with Math.round"
  - "Gradient angle: atan2(dy,dx) + 90 degrees normalized to 0-360 for CSS linear-gradient"
  - "Style enrichment: normalizeNode captures raw Figma style data as any[] for downstream token extraction"

requirements-completed: [TOKN-01, TOKN-04, TOKN-05]

# Metrics
duration: 4min
completed: 2026-02-28
---

# Phase 3 Plan 01: Token Types & Style Enrichment Summary

**9 token type interfaces, tested color/gradient CSS conversion utilities, and normalizeNode enriched with fills/strokes/effects/cornerRadius/textStyle/opacity/styleRefs for downstream token extraction**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-28T16:43:34Z
- **Completed:** 2026-02-28T16:47:26Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Defined all 9 token interfaces (ColorToken, GradientToken, TypographyToken, SpacingToken, BorderToken, ShadowToken, ImageFillRef, ComponentInventoryEntry, DesignTokens) as data contracts for Plan 02
- Built and tested figmaColorToCSS (hex for opaque, rgba for alpha) and gradientToCSS (linear/radial/conic/diamond) with 18 TDD tests
- Extended LayoutNode with 10 optional style fields and enriched normalizeNode to capture them during tree walk with 14 TDD tests
- Full test suite at 90 tests, zero regressions from Phase 2 baseline of 58

## Task Commits

Each task was committed atomically:

1. **Task 1: Token type definitions and color utility functions (TDD)** - `e4cc653` (feat)
2. **Task 2: Extend LayoutNode with style fields and enrich normalizeNode (TDD)** - `a523cfc` (feat)

_Both tasks followed TDD: RED (failing tests) -> GREEN (implementation passing) -> verified_

## Files Created/Modified
- `src/tokens/types.ts` - 9 token type interfaces (ColorToken, GradientToken, TypographyToken, SpacingToken, BorderToken, ShadowToken, ImageFillRef, ComponentInventoryEntry, DesignTokens)
- `src/tokens/color-utils.ts` - figmaColorToCSS and gradientToCSS pure conversion functions
- `src/tokens/color-utils.test.ts` - 18 tests covering hex, rgba, gradient angle, radial, conic, diamond, alpha stops, multi-stop
- `src/layout/types.ts` - LayoutNode extended with fills, strokes, strokeWeight, effects, cornerRadius, rectangleCornerRadii, textStyle, textStyleOverrides, opacity, styleRefs
- `src/layout/normalize.ts` - normalizeNode enriched with style data capture before type dispatch + TEXT case captures textStyle/textStyleOverrides
- `src/layout/normalize.test.ts` - 14 new tests for style enrichment (fills, strokes, effects, cornerRadius, rectangleCornerRadii, strokeWeight, textStyle, textStyleOverrides, opacity, styleRefs, GROUP omission, INSTANCE preservation, empty override omission)

## Decisions Made
- Diamond gradients (GRADIENT_DIAMOND) approximated as `/* diamond */ radial-gradient(...)` since CSS has no diamond gradient -- the comment prefix allows downstream consumers to identify the approximation
- Opacity of exactly 1 is omitted from LayoutNode to reduce noise (Figma defaults all nodes to opacity 1)
- Empty styleOverrideTable objects are not stored (avoids meaningless `textStyleOverrides: {}` on simple text nodes)
- Style capture block placed before the type dispatch switch statement so that INSTANCE nodes (which return early) still get fills/strokes/effects captured

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Token type definitions are exported and ready for import by Plan 02's collectTokens function
- LayoutNode tree now carries all raw style data needed for token extraction
- color-utils functions are available for Plan 02 to convert colors during collection
- Plan 02 can walk the enriched tree to produce deduplicated DesignTokens

## Self-Check: PASSED

All 7 files verified present. Both task commits (e4cc653, a523cfc) verified in git log.

---
*Phase: 03-design-data-extraction*
*Completed: 2026-02-28*
