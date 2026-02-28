---
phase: 08-ux-flow-simplification
plan: 01
subsystem: ui
tags: [figma-plugin, react, ux, progress-indicator, result-card]

# Dependency graph
requires:
  - phase: 07-smart-asset-detection-layout-mapping
    provides: "ExportResult with assetType field, composition detection pipeline"
provides:
  - "Single merged result card replacing 3 separate result sections"
  - "Single progress indicator replacing 3 separate spinners"
  - "Auto-derived scope from URL (no manual radio selection)"
  - "Streamlined button states (loading in button, gray 'Get New Brief' after completion)"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Derived progress label from existing boolean states instead of new state"
    - "Auto-derive extraction scope from URL nodeId presence"

key-files:
  created: []
  modified:
    - src/views/MainView.tsx

key-decisions:
  - "Loading state shown in button text instead of separate spinner element"
  - "Extraction scope auto-derived from URL (nodeId present -> element, else -> page) instead of 3-option radio group"
  - "Button shows gray 'Get New Brief' after completion instead of remaining green"
  - "Copy button placed at top of merged result card as most prominent element"

patterns-established:
  - "Single-card result pattern: pipeline output consolidated into one card gated on final result"
  - "Auto-derived scope: URL structure determines extraction scope without user selection"

requirements-completed: [UX-02]

# Metrics
duration: 32min
completed: 2026-02-28
---

# Phase 8 Plan 1: UX Flow Simplification Summary

**Merged 3 result sections into single "Brief ready" card, consolidated 3 spinners into button-inline loading, auto-derived scope from URL**

## Performance

- **Duration:** 32 min
- **Started:** 2026-02-28T22:11:00Z
- **Completed:** 2026-02-28T22:43:20Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Replaced 3 separate progress spinners (extraction, export, brief) with loading state shown directly in the button
- Merged 3 separate result sections (extraction stats, export stats, brief result) into a single "Brief ready" card with copy button at top
- Auto-derived extraction scope from URL structure (nodeId presence -> element scope, else -> page scope), eliminating the 3-option radio group
- Button transitions to gray "Get New Brief" after completion, providing clear state feedback

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace 3 progress spinners + 3 result sections with single progress indicator and merged result card** - `bcd4344` (feat)
2. **Task 2: Verify merged result card and single progress indicator in plugin UI** - `d000176` (fix -- checkpoint feedback refinements applied during verification)

**Plan metadata:** `dfa0354` (docs: complete plan)

## Files Created/Modified
- `src/views/MainView.tsx` - Merged 3 result sections into single card, consolidated spinners into button loading state, auto-derived scope from URL, simplified button states

## Decisions Made
- **Loading in button, not spinner:** During human verification, the separate spinner was removed in favor of showing loading state directly in the button text. This reduces visual elements further.
- **Auto-derive scope from URL:** The 3-option radio group (page/element/component) was replaced with automatic scope derivation from the URL. If a nodeId is present, element scope is used; otherwise page scope. This removes a decision point the user rarely needed to think about.
- **Gray "Get New Brief" button:** After pipeline completion, the button becomes gray with "Get New Brief" text instead of staying green. This clearly signals completion and provides a path to re-run.
- **Copy button at top:** The copy button is the most prominent element at the top of the merged result card, matching the locked decision from CONTEXT.md.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - UX Refinement] Removed separate spinner, loading in button instead**
- **Found during:** Task 2 (human verification checkpoint)
- **Issue:** Separate spinner element was unnecessary visual noise when the button already shows stage text
- **Fix:** Removed spinner, button text shows "Extracting..." / "Exporting assets..." / "Generating brief..." during loading
- **Files modified:** src/views/MainView.tsx
- **Verification:** Human verified in running plugin
- **Committed in:** d000176

**2. [Rule 2 - Missing Critical UX] Auto-derived scope from URL instead of manual radio**
- **Found during:** Task 2 (human verification checkpoint)
- **Issue:** 3-option radio group for scope selection was unnecessary friction -- the URL already encodes whether a specific node was selected
- **Fix:** Auto-derive scope from URL nodeId, show single-line hint instead of radio group
- **Files modified:** src/views/MainView.tsx
- **Verification:** Human verified in running plugin
- **Committed in:** d000176

**3. [Rule 1 - UX Refinement] Gray "Get New Brief" button after completion**
- **Found during:** Task 2 (human verification checkpoint)
- **Issue:** Button state after completion needed clearer visual differentiation
- **Fix:** Button shows gray "Get New Brief" after completion
- **Files modified:** src/views/MainView.tsx
- **Verification:** Human verified in running plugin
- **Committed in:** d000176

---

**Total deviations:** 3 auto-fixed (2 UX refinements, 1 missing critical UX)
**Impact on plan:** All refinements directly serve UX-02 (simplified flow). Applied during human verification checkpoint as feedback-driven improvements. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UX flow simplification complete for the core plugin workflow
- Plugin now presents a streamlined URL -> Brief experience with minimal user decisions
- Ready for any additional UX polish or feature phases

## Self-Check: PASSED

- FOUND: src/views/MainView.tsx
- FOUND: 08-01-SUMMARY.md
- FOUND: commit bcd4344
- FOUND: commit d000176

---
*Phase: 08-ux-flow-simplification*
*Completed: 2026-02-28*
