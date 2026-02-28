---
phase: 05-brief-assembly-output
plan: 01
subsystem: brief
tags: [markdown, pure-function, layout-tree, design-tokens, tdd]

# Dependency graph
requires:
  - phase: 02-layout-extraction
    provides: "LayoutNode, ExtractionResult, ExtractLayoutResult types and extraction pipeline"
  - phase: 03-design-data-extraction
    provides: "DesignTokens with colors, gradients, typography, spacing, borders, shadows, components"
  - phase: 04-image-asset-export
    provides: "ExportResult with previewPath and asset file paths"
provides:
  - "generateBrief() pure function: ExtractLayoutResult + ExportResult -> structured markdown brief"
  - "BriefInput, BriefResult, BriefStats type definitions"
  - "estimateTokens() function and TOKEN_WARNING_THRESHOLD constant"
affects: [05-02-brief-output-ui]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Section builder pattern: private functions per brief section, composed in generateBrief()"
    - "Conditional section omission: empty sections filtered out before join"
    - "Path normalization: toRelativePath strips projectPath prefix for portable references"

key-files:
  created:
    - src/brief/types.ts
    - src/brief/generate.ts
    - src/brief/generate.test.ts
  modified: []

key-decisions:
  - "Node type displayed as title case (FRAME -> Frame) for readability in layout tree"
  - "Date field optional on BriefInput for test determinism via date override"
  - "INSTANCE nodes treated as leaf in tree -- no recursion into children"
  - "Design Tokens heading omitted when all token subtypes are empty"

patterns-established:
  - "Brief section builder pattern: each brief section has a private builder function returning string or empty"
  - "displayType() maps Figma uppercase types to title case for human-readable output"

requirements-completed: [BREF-01, BREF-02, BREF-03, BREF-04]

# Metrics
duration: 3min
completed: 2026-02-28
---

# Phase 5 Plan 1: Brief Generation Summary

**Pure generateBrief() function assembling 6-section markdown design brief from layout tree, design tokens, component inventory, and asset references with CSS flexbox layout descriptions and token estimation**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-28T18:16:27Z
- **Completed:** 2026-02-28T18:19:58Z
- **Tasks:** 1 (TDD: RED + GREEN)
- **Files modified:** 3

## Accomplishments
- Pure `generateBrief()` function produces structured markdown with 6 sections in locked order: metadata, preview, layout tree, design tokens, components, assets
- Layout tree renders indented CSS flexbox descriptions with default-value skipping, repeated instance collapsing, text content + font info, and hidden node filtering
- Design token tables grouped by type with conditional subsections (shadows, gradients, borders omitted when empty)
- 40 comprehensive tests covering all sections, edge cases, and empty-state handling

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Brief types and failing tests** - `2e0d136` (test)
2. **Task 1 (GREEN): generateBrief implementation** - `645dfad` (feat)

_TDD task: test commit followed by implementation commit._

## Files Created/Modified
- `src/brief/types.ts` - BriefInput, BriefResult, BriefStats type definitions with optional date override
- `src/brief/generate.ts` - Pure generateBrief() function with section builders, layout tree renderer, token tables, asset path normalization
- `src/brief/generate.test.ts` - 40 tests covering full structure, metadata, preview, layout tree, design tokens, components, assets, empty sections, token estimation

## Decisions Made
- Node type displayed as title case (FRAME -> Frame, TEXT -> Text) for readability in the layout tree output
- Added optional `date` field on BriefInput for test determinism -- defaults to `new Date().toISOString().slice(0,10)` when not provided
- INSTANCE nodes are treated as leaf nodes in the tree -- no recursion into children (matches the extraction model where instances are opaque)
- The "## Design Tokens" heading is omitted entirely when all token subtypes (colors, gradients, typography, spacing, borders, shadows) are empty

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed uppercase node type display in layout tree**
- **Found during:** Task 1 GREEN (implementation)
- **Issue:** Figma node types are stored as uppercase (FRAME, TEXT, GROUP) but the plan and research examples show title case (Frame, Text, Group)
- **Fix:** Added `displayType()` helper that converts FRAME -> Frame, TEXT -> Text, etc.
- **Files modified:** src/brief/generate.ts
- **Verification:** All 40 tests pass including explicit "Frame 'Login Card'" assertions
- **Committed in:** 645dfad (GREEN commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor display formatting fix. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `generateBrief()` is ready for consumption by 05-02 (UI wiring, file save, clipboard copy)
- BriefResult provides markdown string, charCount, estimatedTokens, and stats for UI display
- TOKEN_WARNING_THRESHOLD (12000) ready for yellow warning banner logic in MainView

## Self-Check: PASSED

All files exist, all commits verified, 208/208 tests pass.

---
*Phase: 05-brief-assembly-output*
*Completed: 2026-02-28*
