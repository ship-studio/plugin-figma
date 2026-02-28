---
phase: 02-layout-extraction
plan: 01
subsystem: layout
tags: [figma, flexbox, typescript, normalization, tdd, tree-walker]

# Dependency graph
requires:
  - phase: 01-plugin-foundation-figma-connection
    provides: "@figma/rest-api-spec types, FigmaUrlParts, ExtractionScope"
provides:
  - "LayoutNode interface -- normalized Figma node type in CSS flexbox terms"
  - "AutoLayoutProps interface -- CSS flexbox property mapping"
  - "ComponentRef interface -- component instance metadata"
  - "ExtractionResult interface -- tree normalization output"
  - "mapToFlexbox() -- Figma auto-layout to CSS flexbox conversion"
  - "describeSizing() -- sizing mode with resolved px description"
  - "normalizeNode() -- recursive Figma node to LayoutNode converter"
  - "normalizeTree() -- multi-root normalization returning ExtractionResult"
  - "countNodes() -- recursive node counting for large tree detection"
  - "deduplicateChildren() -- collapse 3+ identical instances with repeatCount"
affects: [02-layout-extraction, 03-design-data-extraction, 05-brief-assembly-output]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Figma-to-CSS flexbox mapping", "recursive tree normalization with type dispatch", "component instance leaf node pattern", "deduplication by fingerprint"]

key-files:
  created: ["src/layout/types.ts", "src/layout/flexbox-map.ts", "src/layout/normalize.ts", "src/layout/normalize.test.ts"]
  modified: []

key-decisions:
  - "Used 'any' for Figma node input types instead of narrow @figma/rest-api-spec union types -- simplifies the recursive walker since it handles 20+ node types with shared trait-based property access"
  - "buildInstanceFingerprint uses componentId + sorted JSON of variantProperties -- deterministic deduplication key"
  - "countNodes operates on raw Figma nodes (pre-normalization) to give accurate count before any filtering"

patterns-established:
  - "Type dispatch in normalizeNode: switch on node.type for TEXT, INSTANCE, BOOLEAN_OPERATION specialization"
  - "Null-safe property access: 'prop' in node && node.prop != null pattern for optional Figma traits"
  - "Deduplication threshold of 3+ identical instances before collapsing"

requirements-completed: [LYOT-01, LYOT-02, LYOT-03, LYOT-04, LYOT-05]

# Metrics
duration: 4min
completed: 2026-02-28
---

# Phase 2 Plan 01: Layout Normalization Summary

**TDD-driven LayoutNode type system with CSS flexbox mapping, recursive tree normalization, component instance leaf-node handling, and deduplication of repeated instances**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-28T15:08:04Z
- **Completed:** 2026-02-28T15:12:32Z
- **Tasks:** 1 (TDD feature: RED + GREEN)
- **Files modified:** 4

## Accomplishments
- Complete LayoutNode type system with AutoLayoutProps, ComponentRef, and ExtractionResult interfaces consumed by Phase 3+
- CSS flexbox mapping from all Figma auto-layout properties (direction, alignment, gap, padding, wrap, rowGap)
- Recursive tree walker that handles every Figma node type: frames, text, instances, boolean operations, groups, sections
- Component instances treated as leaf nodes with full metadata (name, description, variant properties, overrides, local/library source)
- Hidden nodes preserved with visible=false, SLICE nodes filtered out, absolute positioning tagged
- Deduplication of 3+ identical component instances to single representative with repeatCount
- 47 comprehensive test cases all passing

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Failing tests for layout normalization** - `9e476d3` (test)
2. **Task 1 (GREEN): Implement types, flexbox mapping, normalization** - `cd3979d` (feat)

_TDD flow: RED (47 failing tests) -> GREEN (47 passing tests). No REFACTOR needed -- implementation was clean on first pass._

## Files Created/Modified
- `src/layout/types.ts` - LayoutNode, AutoLayoutProps, ComponentRef, ExtractionResult interfaces; re-exports LayoutConstraint
- `src/layout/flexbox-map.ts` - mapToFlexbox (auto-layout to CSS flexbox) and describeSizing (sizing mode description)
- `src/layout/normalize.ts` - normalizeNode, normalizeTree, countNodes, deduplicateChildren, buildComponentRef
- `src/layout/normalize.test.ts` - 47 test cases covering all behavior specifications

## Decisions Made
- Used `any` for Figma node input types rather than narrow union types from @figma/rest-api-spec. The recursive walker handles 20+ node types via shared trait-based property access (`'prop' in node`), making narrow types impractical without extensive type narrowing boilerplate.
- buildInstanceFingerprint concatenates componentId with sorted JSON of variantProperties for deterministic deduplication keys.
- countNodes operates on raw Figma nodes (pre-normalization) so nodeCount in ExtractionResult reflects the true API response size, not the filtered/deduplicated count.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed incorrect nodeCount expectation in test**
- **Found during:** Task 1 GREEN phase
- **Issue:** Test for normalizeTree expected nodeCount=4 but the test fixture only had 3 nodes (Frame1 + Text1 child + Frame2)
- **Fix:** Corrected expectation to nodeCount=3 with accurate comment
- **Files modified:** src/layout/normalize.test.ts
- **Verification:** Test passes with correct count
- **Committed in:** cd3979d (part of GREEN commit)

---

**Total deviations:** 1 auto-fixed (1 bug in test expectation)
**Impact on plan:** Trivial arithmetic fix in test data. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All layout normalization functions are ready for 02-02-PLAN (API fetch + extraction orchestrator)
- normalizeTree is the entry point that 02-02 will wire to API responses
- countNodes enables the large-tree warning feature planned in 02-02
- LayoutNode type is the interface contract for Phase 3 (design data extraction)

## Self-Check: PASSED

All files exist, all commits verified:
- FOUND: src/layout/types.ts
- FOUND: src/layout/flexbox-map.ts
- FOUND: src/layout/normalize.ts
- FOUND: src/layout/normalize.test.ts
- FOUND: .planning/phases/02-layout-extraction/02-01-SUMMARY.md
- FOUND: 9e476d3 (test RED)
- FOUND: cd3979d (feat GREEN)

---
*Phase: 02-layout-extraction*
*Completed: 2026-02-28*
