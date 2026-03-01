---
phase: 20-mode-selector-ui
plan: 01
subsystem: ui
tags: [react, figma-plugin, css, brief-mode]

# Dependency graph
requires: []
provides:
  - BriefMode type and BRIEF_MODES configuration constant
  - Mode selector card UI with CSS classes
  - briefMode React state in MainView (defaults to 'best')
affects: [21-mode-aware-briefs]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Card-based radio selector with accent border for selection state"
    - "Session-only state that persists across URL changes but not panel closes"

key-files:
  created: []
  modified:
    - src/styles.ts
    - src/views/MainView.tsx

key-decisions:
  - "Used accent border for selection instead of radio bullets -- cleaner in compact plugin panel"
  - "Mode persists across URL changes within session via React useState (not localStorage)"

patterns-established:
  - "figma-plugin-mode-* CSS class namespace for mode selector components"
  - "BRIEF_MODES constant array pattern for mode configuration"

requirements-completed: [MODE-01, MODE-02]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 20 Plan 01: Mode Selector UI Summary

**Three-card brief mode picker (Best results / Pixel for pixel / Inspiration) with accent-border selection, session persistence, and auto-hide during results**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-01T16:22:54Z
- **Completed:** 2026-03-01T16:24:04Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added 8 CSS classes for mode selector cards with hover and selected states
- Added BriefMode type, BRIEF_MODES config, and briefMode useState to MainView
- Mode selector renders between scope hint and asset list panel with correct visibility logic
- Keyboard accessible (role="radio", aria-checked, Enter/Space key handlers)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add mode selector CSS classes to styles.ts** - `1791a24` (feat)
2. **Task 2: Add mode state and render mode selector in MainView.tsx** - `948df3e` (feat)

## Files Created/Modified
- `src/styles.ts` - Added 8 CSS classes (mode-section, mode-label, mode-group, mode-card, mode-card:hover, mode-card.selected, mode-card-name, mode-card-desc)
- `src/views/MainView.tsx` - Added BriefMode type, BRIEF_MODES config array, briefMode useState, and mode selector JSX rendering

## Decisions Made
- Used accent border only (no radio bullets) for selection indicator -- cleaner, matches Figma plugin design patterns
- Mode persists across URL changes within session via React useState -- simplest approach, matches existing manualAssets pattern
- Added `role="radio"` and keyboard handlers for accessibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- briefMode state is ready for Phase 21 to consume when adding mode to BriefInput and generating mode-specific brief instructions
- BriefMode type can be imported from MainView or extracted to a shared types file in Phase 21
- No blockers

---
*Phase: 20-mode-selector-ui*
*Completed: 2026-03-01*
