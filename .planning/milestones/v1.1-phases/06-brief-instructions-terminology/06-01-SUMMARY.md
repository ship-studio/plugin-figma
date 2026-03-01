---
phase: 06-brief-instructions-terminology
plan: 01
subsystem: brief
tags: [markdown, brief-generation, instructions, claude-code]

# Dependency graph
requires:
  - phase: 04-brief-assembly
    provides: "generateBrief() with section builder pattern and 6-section structure"
provides:
  - "buildInstructionsSection() pure function for behavioral guidance in briefs"
  - "7-section brief structure with How to Use This Brief between Metadata and Preview"
affects: [06-02, brief-generation, claude-code-consumption]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Static section builder: zero-parameter function for data-independent brief content"

key-files:
  created: []
  modified:
    - src/brief/generate.ts
    - src/brief/generate.test.ts

key-decisions:
  - "Test adjusted to verify negative instruction wording (rather than substituting or fabricating) instead of asserting word absence"

patterns-established:
  - "Before/during/after instruction structure for Claude Code behavioral guidance"
  - "Static section builders take zero parameters when content is data-independent"

requirements-completed: [INST-01, INST-02, INST-03]

# Metrics
duration: 2min
completed: 2026-02-28
---

# Phase 6 Plan 1: Brief Instructions Section Summary

**Added buildInstructionsSection() with before/during/after behavioral guidance between Metadata and Preview sections**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-28T20:23:16Z
- **Completed:** 2026-02-28T20:25:01Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Added "How to Use This Brief" section with 3-line before/during/after instruction structure
- Brief now has 7 sections in locked order (was 6), instructions inserted at index 1
- Instructions are static (zero-parameter builder) and concise (3 instruction lines)
- Before: plan approach, ask clarifying questions
- During: use only listed assets, ask if missing (never substitute/fabricate)
- After: compare against Preview image, verify tokens and assets applied correctly

## Task Commits

Each task was committed atomically:

1. **Task 1: Add buildInstructionsSection() and update brief generation** - `00b922d` (feat)

**Plan metadata:** pending (docs: complete plan)

_Note: TDD task with RED/GREEN/REFACTOR in single commit (no code changes needed in refactor)_

## Files Created/Modified
- `src/brief/generate.ts` - Added buildInstructionsSection() function and updated sections array to 7 sections, updated JSDoc
- `src/brief/generate.test.ts` - Updated section count test from 6 to 7, added 7 new tests for instructions section content, position, static nature, and conciseness

## Decisions Made
- Adjusted test for "During building" line: instead of asserting the word "fabricat" is absent (which would fail since the instruction explicitly warns against fabricating), the test verifies the negative instruction pattern "rather than substituting or fabricating" is present. This correctly tests that the brief tells Claude Code NOT to fabricate, rather than avoiding the word entirely.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed overly strict test assertion for fabrication warning**
- **Found during:** Task 1 (TDD GREEN phase)
- **Issue:** Plan's test spec said "must NOT say substitute or fabricate" but the instruction text intentionally warns AGAINST fabricating. The test `not.toMatch(/fabricat/i)` would always fail because the word is used in a negative instruction.
- **Fix:** Changed test to verify the negative instruction pattern `rather than substituting or fabricating` is present, which correctly validates the intended behavior.
- **Files modified:** src/brief/generate.test.ts
- **Verification:** All 47 tests pass
- **Committed in:** 00b922d (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Test assertion corrected to match actual intent. No scope creep.

## Issues Encountered
None beyond the test assertion fix documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Instructions section complete and tested
- Ready for Plan 02 (terminology/naming improvements)
- All 47 tests passing, brief structure stable at 7 sections

## Self-Check: PASSED

- FOUND: src/brief/generate.ts
- FOUND: src/brief/generate.test.ts
- FOUND: 06-01-SUMMARY.md
- FOUND: commit 00b922d

---
*Phase: 06-brief-instructions-terminology*
*Completed: 2026-02-28*
