---
phase: 21-mode-specific-brief-instructions
plan: 01
subsystem: brief
tags: [brief-generation, mode-selector, instructions, textarea, react]

# Dependency graph
requires:
  - phase: 20-mode-selector-ui
    provides: "BriefMode type and briefMode state in MainView"
provides:
  - "Mode-aware brief instructions (best/pixel/inspiration)"
  - "Mode label in brief metadata header"
  - "Inspiration textarea for user context"
  - "BriefInput.mode and BriefInput.inspirationText fields"
affects: [22-placeholder-detection, 23-brief-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: ["shared base rules + mode-specific additions in brief instructions", "conditional UI rendering based on mode state"]

key-files:
  created: []
  modified:
    - src/brief/types.ts
    - src/brief/generate.ts
    - src/views/MainView.tsx
    - src/styles.ts

key-decisions:
  - "Instructions use Before/During/After structure with shared base rules plus mode-specific additions"
  - "inspirationText only passed to generateBrief when mode is 'inspiration' to prevent stale text leaking"
  - "Mode label placed after Extracted date and before Figma URL in metadata header"

patterns-established:
  - "Brief sections accept mode parameter for conditional content generation"

requirements-completed: [MODE-03, MODE-04, MODE-05, MODE-06]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 21 Plan 01: Mode-Specific Brief Instructions Summary

**Mode-aware brief generation with three distinct instruction sets (best/pixel/inspiration), metadata mode label, and inspiration textarea for user context**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-01T17:07:24Z
- **Completed:** 2026-03-01T17:09:36Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- BriefInput extended with optional mode and inspirationText fields (backward compatible)
- Three distinct instruction sets: "best" emphasizes responsive/semantic code, "pixel" emphasizes exact values/fixed dimensions, "inspiration" emphasizes adaptation with optional user context as blockquote
- Brief metadata header includes **Mode:** line with human-readable mode name
- Inspiration textarea appears conditionally when "Use as inspiration" is selected, collapses for other modes

## Task Commits

Each task was committed atomically:

1. **Task 1: Add mode fields to BriefInput type and add inspiration textarea to MainView** - `edff36f` (feat)
2. **Task 2: Update brief generator for mode-aware instructions and metadata** - `788f893` (feat)

## Files Created/Modified
- `src/brief/types.ts` - Added mode and inspirationText optional fields to BriefInput
- `src/brief/generate.ts` - Mode-aware buildMetadataSection (with **Mode:** line) and buildInstructionsSection (three instruction variants + inspiration blockquote)
- `src/views/MainView.tsx` - Added inspirationText state, conditional textarea UI, wired mode/inspirationText into generateBrief call
- `src/styles.ts` - Added .figma-plugin-inspiration-textarea CSS class

## Decisions Made
- Instructions follow Before/During/After structure with shared base rules (read brief fully, use only listed assets, compare to preview) plus mode-specific additions
- inspirationText only passed when mode is 'inspiration' to prevent stale text from leaking into other modes
- Mode label placed in metadata between Extracted date and Figma URL for natural reading order

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed stale closure in runAssetExport dependency array**
- **Found during:** Task 1 (MainView updates)
- **Issue:** briefMode and inspirationText were used inside runAssetExport callback but not listed in its useCallback dependency array, causing stale closure values
- **Fix:** Added briefMode and inspirationText to the dependency array
- **Files modified:** src/views/MainView.tsx
- **Verification:** TypeScript compiles, React hooks dependency correctness
- **Committed in:** edff36f (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential for correctness -- without this fix, changing mode after initial render would use stale values. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Mode-aware brief generation is complete and ready for end-to-end testing
- Phase 22 (placeholder detection) can proceed -- briefs now include mode context
- All three modes produce valid, distinct instructions that fully replace the old static section

---
*Phase: 21-mode-specific-brief-instructions*
*Completed: 2026-03-01*
