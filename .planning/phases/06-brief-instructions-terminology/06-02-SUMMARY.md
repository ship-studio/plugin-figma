---
phase: 06-brief-instructions-terminology
plan: 02
subsystem: ui
tags: [react, ux, terminology, figma-plugin]

# Dependency graph
requires: []
provides:
  - Human-friendly UI terminology throughout plugin (labels, stats, toasts, warnings)
  - Simplified stats display (layers, assets, tokens only)
  - Plain-language token warning without technical details
affects: [08-ux-flow-simplification]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "User-facing text uses 'layers' instead of 'nodes'"
    - "Stats display limited to layer count, asset count, token estimate"
    - "Warnings use plain language without technical thresholds"

key-files:
  created: []
  modified:
    - src/views/MainView.tsx

key-decisions:
  - "Removed autoLayoutFrames from ExtractionStats interface entirely (YAGNI) rather than keeping it unused"
  - "Kept code-level identifiers (nodeCount, rootNodes, textNodes) unchanged -- only user-visible strings updated"

patterns-established:
  - "UI terminology: 'layers' not 'nodes', 'section' not 'frame', 'element' not 'node'"
  - "Stats brevity: show only the 3 most useful metrics (layers, assets, tokens)"

requirements-completed: [UX-01]

# Metrics
duration: 2min
completed: 2026-02-28
---

# Phase 6 Plan 02: Brief Instructions & Terminology Summary

**Replaced all developer jargon with human-friendly labels: "What to extract" scope picker, "layers" instead of "nodes", simplified stats, plain-language warnings, and "Get Brief" button**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-28T20:23:23Z
- **Completed:** 2026-02-28T20:25:17Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Replaced all scope labels: "Extraction Scope" -> "What to extract", "Single Node" -> "This element", "Frame" -> "This section", "Entire Page" -> "Whole page"
- Changed all user-visible "nodes" to "layers" across stats, toasts, and warning banners
- Simplified stats display from 5 metrics (nodes, colors, fonts, assets, tokens) to 3 (layers, assets, tokens)
- Token warning now says "This brief is large" with plain advice instead of technical threshold numbers
- Primary button shortened from "Extract Design Brief" to "Get Brief"
- Removed `autoLayoutFrames` from ExtractionStats interface (no longer displayed)

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace all UI terminology in MainView.tsx** - `85f2dcc` (feat)

**Plan metadata:** `c68bbcb` (docs: complete plan)

## Files Created/Modified
- `src/views/MainView.tsx` - All user-facing terminology replaced with human-friendly language; ExtractionStats interface cleaned up

## Decisions Made
- Removed `autoLayoutFrames` field entirely from the `ExtractionStats` interface rather than leaving it unused. The auto-layout frame count was purely a developer diagnostic that non-technical users would never understand.
- Kept all code-level identifiers (`nodeCount`, `rootNodes`, `textNodes`, `hiddenNodes`, `nodeId`) unchanged since they are internal variable names, not user-visible text. This avoids unnecessary refactoring risk.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All UI terminology is now human-friendly and consistent
- Ready for Phase 7 (Smart Asset Detection & Layout Mapping) and Phase 8 (UX Flow Simplification)
- Future UI work should follow the established pattern: "layers" not "nodes", plain language in all user-facing strings

## Self-Check: PASSED

- FOUND: src/views/MainView.tsx
- FOUND: commit 85f2dcc
- FOUND: 06-02-SUMMARY.md

---
*Phase: 06-brief-instructions-terminology*
*Completed: 2026-02-28*
