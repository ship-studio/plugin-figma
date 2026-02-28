---
phase: 02-layout-extraction
plan: 02
subsystem: layout
tags: [figma, api, extraction, react, pipeline, flexbox]

# Dependency graph
requires:
  - phase: 01-plugin-foundation-figma-connection
    provides: "Shell, figmaApiCall, FigmaUrlParts, ExtractionScope, MainView, token state"
  - phase: 02-layout-extraction
    plan: 01
    provides: "normalizeTree, countNodes, LayoutNode, ExtractionResult types"
provides:
  - "fetchFileNodes() -- GET /files/:key/nodes for node/frame scope extraction"
  - "fetchFullFile() -- GET /files/:key for page scope extraction"
  - "extractLayout() -- scope-based orchestrator: API fetch, node counting, normalization"
  - "WARN_THRESHOLD (500) and MAX_THRESHOLD (2000) constants for large tree detection"
  - "MainView wired end-to-end: URL input -> scope -> extract -> result display"
  - "ExtractionResult stored in component state for Phase 3+ consumption"
  - "collectStats() -- post-extraction analysis of frames, components, text nodes"
  - "TreePreview component -- collapsible 2-level tree preview of extracted nodes"
affects: [03-design-data-extraction, 05-brief-assembly-output]

# Tech tracking
tech-stack:
  added: []
  patterns: ["scope-based API endpoint selection", "large tree warning with deferred confirmation (no second API call)", "stale extraction request guard via counter ref", "extraction stats collection with component pill UI", "collapsible tree preview"]

key-files:
  created: ["src/layout/extract.ts"]
  modified: ["src/figma-api.ts", "src/views/MainView.tsx", "src/styles.ts", "dist/index.js"]

key-decisions:
  - "extractLayout always normalizes even for large trees -- stores result in ref and shows warning, user confirms without second API call"
  - "fetchFileNodes handles URL-encoded node IDs by checking both formats when lookup fails"
  - "Page scope uses first page's children (rootNodes[0].children) since full file returns CanvasNode[] (pages)"
  - "Extraction stats (collectStats) computed via useMemo over extractionResult for zero-cost re-renders"
  - "Tree preview limited to 2 levels of depth to keep UI readable for large trees"

patterns-established:
  - "Stale request guard pattern extended to extraction (extractRequestIdRef) alongside validation (requestIdRef)"
  - "Pending result ref pattern: store full API result in ref during confirmation flow, avoid re-fetch"
  - "CSS class-based styling for warning banners (figma-plugin-warning) instead of inline styles, supporting dark theme"
  - "Component pill UI pattern: compact badges with border and background from CSS variables"

requirements-completed: [LYOT-01, LYOT-02, LYOT-03, LYOT-04, LYOT-05]

# Metrics
duration: 15min
completed: 2026-02-28
---

# Phase 2 Plan 02: Layout Extraction Pipeline Summary

**End-to-end extraction pipeline: Figma API fetch by scope, tree normalization, large-tree warning with deferred confirm, extraction stats with component pills and collapsible tree preview in MainView**

## Performance

- **Duration:** 15 min
- **Started:** 2026-02-28T15:15:25Z
- **Completed:** 2026-02-28T15:30:54Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 5

## Accomplishments
- Complete extraction pipeline from button click to normalized LayoutNode tree: paste URL, select scope, click Extract, see results
- Scope-based API endpoint selection: fetchFileNodes (node/frame) uses /files/:key/nodes, fetchFullFile (page) uses /files/:key
- Large tree warning at 500+ nodes with "Continue" / "Cancel" -- avoids second API call by storing result in ref
- Extraction result display with stats breakdown (auto-layout frames, text layers), component pills, and collapsible 2-level tree preview
- Dark theme compatible warning banner and result UI via CSS classes and CSS custom properties
- All 58 existing tests continue to pass, TypeScript compiles clean, dist/index.js builds (32.17 kB)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Figma API fetch functions and extraction orchestrator** - `58fc1c1` (feat)
2. **Task 2: Wire extraction into MainView with progress and error handling** - `617fabc` (feat)
3. **Checkpoint fix: Restyle large tree warning and result for dark theme** - `c4f7acd` (fix)
4. **Checkpoint fix: Add extraction breakdown with stats, components, and tree preview** - `f65cf46` (fix)

_Commits 3-4 were checkpoint fixes applied after user verification feedback._

## Files Created/Modified
- `src/layout/extract.ts` - Extraction orchestrator: scope-based API call, node counting, large tree detection, normalization
- `src/figma-api.ts` - Added fetchFileNodes (GET /files/:key/nodes) and fetchFullFile (GET /files/:key) with 120s timeouts
- `src/views/MainView.tsx` - Wired extractLayout into handleExtract, added spinner, large tree warning, result summary with stats/components/tree preview
- `src/styles.ts` - Added figma-plugin-warning CSS class with dark theme support
- `dist/index.js` - Rebuilt production bundle (32.17 kB)

## Decisions Made
- extractLayout always normalizes and returns the full result even for large trees. The warning flow stores the result in a ref and presents it on user confirmation, avoiding a second API call. This is simpler and faster than re-fetching.
- fetchFileNodes handles URL-encoded node IDs (e.g., "12%3A34" vs "12:34") by checking both formats when the initial lookup fails, since the Figma API may return keys in either format.
- Page scope extracts first page's children rather than all pages, since the typical use case is extracting from the active page.
- Extraction stats are computed via useMemo over extractionResult, so they only recalculate when the result changes.
- Tree preview is capped at 2 levels of depth to keep the UI readable even for deeply nested designs.

## Deviations from Plan

### Checkpoint-driven Improvements

**1. [Checkpoint feedback] Restyled large tree warning and extraction result for dark theme**
- **Found during:** Checkpoint verification (Task 3)
- **Issue:** Large tree warning used inline styles with hardcoded light-theme colors that didn't work in dark mode; extraction result lacked visual polish
- **Fix:** Created figma-plugin-warning CSS class in styles.ts with CSS custom properties; updated result display with checkmark icon, node/frame counts, and proper dark theme colors
- **Files modified:** src/styles.ts, src/views/MainView.tsx
- **Commit:** c4f7acd

**2. [Checkpoint feedback] Added extraction breakdown with stats, components, and tree preview**
- **Found during:** Checkpoint verification (Task 3)
- **Issue:** Extraction result was minimal (just node count). User wanted more visibility into what was extracted before proceeding to later phases.
- **Fix:** Added collectStats() helper to compute frame/auto-layout/text/hidden/component counts; added component pill badges showing top 8 components with counts; added collapsible TreePreview component showing 2 levels of the normalized tree with type labels, component brackets, and text content previews
- **Files modified:** src/views/MainView.tsx, dist/index.js
- **Commit:** f65cf46

---

**Total deviations:** 2 checkpoint-driven improvements (UI polish and richer result display)
**Impact on plan:** Additive improvements that enhance usability without changing the extraction pipeline architecture. No scope creep -- all additions serve the plan's goal of showing extraction results to the user.

## Issues Encountered
None -- the core extraction pipeline (Tasks 1-2) executed cleanly. Checkpoint improvements were user-requested enhancements.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- ExtractionResult (normalized LayoutNode tree) is stored in MainView state, ready for Phase 3 (design token extraction) to consume
- extractLayout returns the full ExtractionResult including rootNodes, nodeCount, and truncated flag
- Component instances are already identified as leaf nodes with ComponentRef metadata (componentName, variantProperties) -- Phase 3 COMP-01/02/03 can build directly on this
- All Figma API infrastructure (figmaApiCall, fetchFileNodes, fetchFullFile) is available for Phase 4 (image export via Figma images API)
- Phase 2 is now complete: both plans (02-01 normalization + 02-02 extraction pipeline) are done

## Self-Check: PASSED

All files exist, all commits verified:
- FOUND: src/layout/extract.ts
- FOUND: src/figma-api.ts
- FOUND: src/views/MainView.tsx
- FOUND: src/styles.ts
- FOUND: dist/index.js
- FOUND: .planning/phases/02-layout-extraction/02-02-SUMMARY.md
- FOUND: 58fc1c1 (feat: API fetch + orchestrator)
- FOUND: 617fabc (feat: MainView wiring)
- FOUND: c4f7acd (fix: dark theme restyle)
- FOUND: f65cf46 (fix: extraction breakdown)

---
*Phase: 02-layout-extraction*
*Completed: 2026-02-28*
