---
phase: 01-plugin-foundation-figma-connection
plan: 03
subsystem: ui
tags: [react, figma-api, url-parsing, form-validation]

# Dependency graph
requires:
  - phase: 01-plugin-foundation-figma-connection
    provides: "URL parser (parseFigmaUrl), Figma API client (validateFileAccess), plugin context (usePluginContext), Modal component, SetupView, SettingsView"
provides:
  - "MainView with URL input, auto-parsing, scope selection, and file validation"
  - "Complete Phase 1 end-to-end user flow: token setup -> URL input -> file validation -> extract button"
  - "View routing: SetupView (no token) -> MainView (has token) -> SettingsView (gear icon)"
affects: [02-design-extraction-engine]

# Tech tracking
tech-stack:
  added: []
  patterns: [stale-request-guard, auto-scope-defaulting, debounced-validation]

key-files:
  created: [src/views/MainView.tsx]
  modified: [src/index.tsx, src/context.ts, src/figma-api.ts, src/components/Modal.tsx, src/views/SetupView.tsx, src/views/SettingsView.tsx, plugin.json, dist/index.js]

key-decisions:
  - "Stale request guard via counter pattern to prevent out-of-order validation responses"
  - "Scope auto-defaults: 'node' when URL has node-id, 'page' when it does not"
  - "Extract button shows toast placeholder -- extraction logic deferred to Phase 2"
  - "React hooks imported from 'react' module (externalized by Vite) instead of window global access"

patterns-established:
  - "Stale request guard: increment requestId before async call, check on response to discard stale results"
  - "View components always call all hooks before any conditional returns to avoid React hooks ordering violations"

requirements-completed: [INPT-01, INPT-03, INPT-04]

# Metrics
duration: 23min
completed: 2026-02-28
---

# Phase 1 Plan 3: Main View Summary

**MainView with URL auto-parsing, scope selection, file validation, and complete Phase 1 end-to-end flow verified by human tester**

## Performance

- **Duration:** 23 min (including human verification and bug fixes)
- **Started:** 2026-02-28T14:13:07Z
- **Completed:** 2026-02-28T14:36:36Z
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 9

## Accomplishments
- MainView renders URL input that auto-parses Figma URLs on change/paste using parseFigmaUrl
- File validation runs automatically via validateFileAccess when a valid URL is parsed, with stale request guarding
- Scope selection offers three radio options (Single Node, Frame, Entire Page) with smart defaults based on URL content
- Extract button is present and enabled only after successful file validation (shows toast placeholder for Phase 2)
- Complete Phase 1 flow verified end-to-end: toolbar button -> modal -> token setup -> URL input -> file validation -> scope selection -> extract button
- All 19 human verification steps passed

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MainView with URL input, scope selection, and file validation** - `325217d` (feat)
2. **Task 2: Verify complete Phase 1 end-to-end flow** - `5ed13cd` (fix -- bugs discovered during human verification)

## Files Created/Modified
- `src/views/MainView.tsx` - Main view with URL input, auto-parsing, scope selection, file validation, and extract button
- `src/index.tsx` - Updated to render MainView when token exists and view is 'main'
- `src/context.ts` - Fixed React.useContext pattern, return null instead of throw when unavailable
- `src/figma-api.ts` - Added curl --max-time flag to prevent hanging API calls
- `src/components/Modal.tsx` - Fixed hooks ordering (all hooks before conditional returns)
- `src/views/SetupView.tsx` - Fixed hooks ordering
- `src/views/SettingsView.tsx` - Fixed hooks ordering
- `plugin.json` - Added required fields (slots, api_version, min_app_version, required_commands)
- `dist/index.js` - Rebuilt bundle

## Decisions Made
- Stale request guard via counter pattern to prevent out-of-order validation responses when user changes URL while validation is in flight
- Scope auto-defaults based on URL content: 'node' when URL has node-id, 'page' when it does not
- Extract button shows toast placeholder -- actual extraction logic deferred to Phase 2
- React hooks imported from 'react' module (externalized by Vite) rather than accessing via window global to avoid module-scope issues

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed React context pattern and hooks ordering**
- **Found during:** Task 2 (human verification checkpoint)
- **Issue:** Plugin context used ref.current pattern that broke on re-renders; all view components had hooks after conditional returns violating React rules of hooks; context threw errors when unavailable instead of returning null gracefully
- **Fix:** Switched to React.useContext() pattern, moved all hooks before conditional returns in MainView/SetupView/SettingsView/Modal, return null from context when unavailable
- **Files modified:** src/context.ts, src/views/MainView.tsx, src/views/SetupView.tsx, src/views/SettingsView.tsx, src/components/Modal.tsx
- **Verification:** All 19 end-to-end verification steps passed
- **Committed in:** 5ed13cd

**2. [Rule 1 - Bug] Fixed infinite validation loop**
- **Found during:** Task 2 (human verification checkpoint)
- **Issue:** Shell ref in useEffect dependency array caused validation to re-fire on every context re-render, creating an infinite loop
- **Fix:** Removed shell from useEffect deps, use ref-based access inside the effect instead
- **Files modified:** src/views/MainView.tsx
- **Verification:** URL validation runs once per URL change, no loop
- **Committed in:** 5ed13cd

**3. [Rule 3 - Blocking] Added missing plugin.json fields**
- **Found during:** Task 2 (human verification checkpoint)
- **Issue:** plugin.json was missing required fields (slots, api_version, min_app_version, required_commands) needed by Ship Studio
- **Fix:** Added all required fields to plugin.json
- **Files modified:** plugin.json
- **Verification:** Plugin loads correctly in Ship Studio
- **Committed in:** 5ed13cd

**4. [Rule 1 - Bug] Added curl timeout to prevent hanging API calls**
- **Found during:** Task 2 (human verification checkpoint)
- **Issue:** API calls via curl had no timeout, could hang indefinitely
- **Fix:** Added --max-time flag to curl commands in figma-api.ts
- **Files modified:** src/figma-api.ts
- **Verification:** API calls complete within timeout
- **Committed in:** 5ed13cd

---

**Total deviations:** 4 auto-fixed (3 bugs, 1 blocking)
**Impact on plan:** All auto-fixes necessary for correct runtime behavior. No scope creep. All discovered during human verification step.

## Issues Encountered
- Multiple bugs surfaced only at runtime in Ship Studio that could not be caught by build-only verification (hooks ordering, context pattern, infinite loop). These were all resolved during the human-verify checkpoint before approval.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 1 is now complete: plugin scaffolding, Figma API client, token management, and main view are all functional
- Phase 2 (Design Extraction Engine) can begin -- the Extract button is wired and ready to be connected to extraction logic
- All foundational modules (url-parser, figma-api, context, types) are stable and tested end-to-end

## Self-Check: PASSED

All files verified present, all commit hashes confirmed in git log.

---
*Phase: 01-plugin-foundation-figma-connection*
*Completed: 2026-02-28*
