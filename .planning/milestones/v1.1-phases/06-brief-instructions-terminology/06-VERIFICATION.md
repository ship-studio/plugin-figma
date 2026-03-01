---
phase: 06-brief-instructions-terminology
verified: 2026-02-28T21:29:00Z
status: passed
score: 9/9 must-haves verified
gaps: []
---

# Phase 6: Brief Instructions & Terminology Verification Report

**Phase Goal:** Users get a brief that tells Claude Code how to behave (plan first, use only provided assets, verify against preview) and a plugin UI that speaks plain language
**Verified:** 2026-02-28T21:29:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Generated brief contains a plan mode instruction telling Claude Code to plan its approach and ask clarifying questions before building | VERIFIED | `buildInstructionsSection()` line: "Plan your approach and ask clarifying questions before writing any code." Test passes: `/Before building.*plan/i` and `/Before building.*clarifying questions/i` |
| 2 | Generated brief contains an asset-only rule telling Claude Code to use only the provided assets and never fabricate replacements | VERIFIED | Line: "Use only the assets listed in the Assets section below -- if an asset is missing, ask the user rather than substituting or fabricating a replacement." Test passes: `/During building.*Assets section/` and `/rather than substituting or fabricating/i` |
| 3 | Generated brief contains a verification instruction telling Claude Code to compare its output against the PNG preview when done | VERIFIED | Line: "Compare your result against the Preview image above and verify that all design tokens and assets are correctly applied." Tests pass: `/After building.*Preview/`, `/After building.*token/i`, `/After building.*asset/i` |
| 4 | Plugin UI says 'What to extract' instead of 'Extraction Scope' | VERIFIED | MainView.tsx line 478: `<label className="figma-plugin-label">What to extract</label>` |
| 5 | Plugin UI says 'This element' / 'This section' / 'Whole page' instead of jargon | VERIFIED | Lines 489, 504, 514 in MainView.tsx |
| 6 | Plugin UI uses 'layers' not 'nodes' in all user-visible strings | VERIFIED | Lines 198, 363, 401, 534, 562, 691 all use 'layers'. Grep for `"nodes"` in user-visible strings returns zero results. |
| 7 | Brief ready stats show 'N layers . N assets . ~NK tokens' only (no colors, fonts) | VERIFIED | Lines 691-699: shows only nodeCount layers, assetCount assets, estimatedTokens -- colorCount and fontCount removed entirely |
| 8 | Token warning says 'This brief is large' without token count in heading | VERIFIED | Line 705: `<strong>This brief is large</strong>`. Dynamic count removed from heading. |
| 9 | Primary button label is 'Get Brief' | VERIFIED | Line 734: `'Get Brief'` as the idle label |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/brief/generate.ts` | `buildInstructionsSection()` function and updated sections array | VERIFIED | Function exists at line 92, inserted at sections index 1 (line 47), returns 5-line static string with before/during/after structure |
| `src/brief/generate.test.ts` | Tests for instructions section content, position, and updated section count | VERIFIED | `describe('instructions section', ...)` block with 6 tests covering heading, position, before/during/after content, static nature, and conciseness. Section count updated from 6 to 7. |
| `src/views/MainView.tsx` | Human-friendly terminology throughout plugin UI | VERIFIED | All jargon replacements applied. `autoLayoutFrames` removed from `ExtractionStats` interface. TypeScript compiles with zero errors. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/brief/generate.ts` | `generateBrief sections array` | `buildInstructionsSection()` inserted at index 1 | WIRED | Line 47: `buildInstructionsSection()` called in sections array between `buildMetadataSection(input)` and `buildPreviewSection(...)` |
| `src/views/MainView.tsx` | User-visible text | Inline JSX string literals | WIRED | All expected strings verified present: "What to extract", "This element", "This section", "Whole page", "layers" (multiple), "This brief is large", "Get Brief" |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| INST-01 | 06-01-PLAN.md | Brief includes a plan mode instruction telling Claude Code to plan and ask questions before building | SATISFIED | `buildInstructionsSection()` "Before building" line; 47 tests pass including dedicated "Before building" test |
| INST-02 | 06-01-PLAN.md | Brief includes an asset-only rule telling Claude Code to use only provided assets, never fabricate replacements | SATISFIED | "During building" line references "Assets section" and says "rather than substituting or fabricating"; test verifies this pattern |
| INST-03 | 06-01-PLAN.md | Brief includes a verification instruction telling Claude Code to compare its output against the PNG preview when done | SATISFIED | "After building" line references "Preview image" and "design tokens and assets"; dedicated test confirms all three patterns |
| UX-01 | 06-02-PLAN.md | Plugin uses human-friendly terminology throughout (no "Extraction Scope", "Single Node", "auto-layout frames") | SATISFIED | Grep for all four banned terms returns zero matches in MainView.tsx; all new terms verified present |

**Orphaned requirements:** None. All four Phase 6 requirements (INST-01, INST-02, INST-03, UX-01) are claimed by plans and verified satisfied.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/views/MainView.tsx` | 437 | `placeholder="https://www.figma.com/..."` | Info | HTML input placeholder attribute -- not a code stub. No impact. |

No code stubs, empty implementations, or TODO markers found in any modified file.

### Human Verification Required

None identified. All success criteria are verifiable programmatically:

- Brief section content is static string-matchable
- UI text is grep-auditable
- TypeScript compilation confirms type safety after interface cleanup
- Test suite (215 tests, all passing) covers all instruction section behaviors

### Test Suite Summary

All tests pass with zero failures:

- `src/brief/generate.test.ts`: 47 tests -- includes 6 new instructions section tests and updated section count assertion (6 -> 7)
- Full suite: 215 tests across 7 test files -- no regressions

TypeScript: `npx tsc --noEmit` exits clean (no errors).

### Gaps Summary

No gaps. All must-haves verified at all three levels (exists, substantive, wired).

- `buildInstructionsSection()` exists, contains real instruction content (not a stub), and is wired into `generateBrief()` at the correct position
- All UX terminology replacements are present, consistent, and cover every user-visible surface (labels, radio options, hint text, stats lines, toast messages, warning banners, primary button)
- `autoLayoutFrames` correctly removed from both interface and `collectStats()` logic

---

_Verified: 2026-02-28T21:29:00Z_
_Verifier: Claude (gsd-verifier)_
