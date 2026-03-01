---
phase: 21-mode-specific-brief-instructions
verified: 2026-03-01T17:30:00Z
status: passed
score: 7/7 must-haves verified
re_verification: false
---

# Phase 21: Mode-Specific Brief Instructions Verification Report

**Phase Goal:** The generated brief contains different Claude Code instructions depending on the selected mode, and the "Use as inspiration" mode captures custom user context
**Verified:** 2026-03-01T17:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                                                                      | Status     | Evidence                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Selecting 'Copy (Best results)' produces a brief with instructions for faithful reproduction using clean responsive code (flex/grid, relative units, semantic HTML)         | VERIFIED   | `generate.ts:127-132`: `effectiveMode === 'best'` branch pushes "semantic HTML, CSS flexbox/grid... relative units (rem, %, vh)" |
| 2   | Selecting 'Copy (Pixel for pixel)' produces a brief with instructions to match the Figma design exactly (exact pixel values, fixed widths, no responsive abstractions)     | VERIFIED   | `generate.ts:133-138`: `effectiveMode === 'pixel'` branch pushes "exact pixel values... fixed dimensions... visual accuracy"     |
| 3   | Selecting 'Use as inspiration' shows a text area where the user describes what to take from the design                                                                     | VERIFIED   | `MainView.tsx:572-580`: `{briefMode === 'inspiration' && <textarea ... />}` inside `!briefResult` gate                           |
| 4   | When 'Use as inspiration' is selected and the user provides custom text, the brief incorporates that text verbatim in a quoted block inside the instructions               | VERIFIED   | `generate.ts:147-149`: `inspirationText.trim().split('\n').join('\n> ')` — multiline blockquote rendering                        |
| 5   | When 'Use as inspiration' is selected with no custom text, the brief still generates with generic inspiration instructions                                                 | VERIFIED   | `generate.ts:139-144`: inspiration branch pushes Before/During/After text unconditionally; blockquote only added at line 147 if `inspirationText.trim()` is truthy |
| 6   | The mode-specific instructions fully replace the existing static 'How to Use This Brief' section — there is only one set of instructions, not two                          | VERIFIED   | `generate.ts:65`: single call `buildInstructionsSection(input.mode, input.inspirationText)`; no other "How to Use This Brief" string in generate.ts outside the function |
| 7   | The brief metadata header includes the mode name (e.g. '**Mode:** Copy (Best results)')                                                                                   | VERIFIED   | `generate.ts:113`: `'**Mode:** ${modeName}'` with lookup table for all three modes (lines 100-105)                               |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact                    | Expected                                                | Status    | Details                                                                                              |
| --------------------------- | ------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `src/brief/types.ts`        | BriefInput with mode and inspirationText fields         | VERIFIED  | Lines 24-27: `mode?: 'best' | 'pixel' | 'inspiration'` and `inspirationText?: string` — both optional, backward compatible |
| `src/views/MainView.tsx`    | Inspiration textarea UI and mode wiring to generateBrief | VERIFIED  | Line 151: `useState('')` for inspirationText; lines 572-580: conditional textarea; lines 242-243: `mode: briefMode, inspirationText: briefMode === 'inspiration' ? inspirationText : undefined` |
| `src/brief/generate.ts`     | Mode-aware buildInstructionsSection and buildMetadataSection | VERIFIED  | Line 118: `buildInstructionsSection(mode?, inspirationText?)` — three branches; line 95: `buildMetadataSection` includes `**Mode:**` line |

### Key Link Verification

| From                        | To                       | Via                                          | Pattern              | Status   | Details                                                                                      |
| --------------------------- | ------------------------ | -------------------------------------------- | -------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `src/views/MainView.tsx`    | `src/brief/generate.ts`  | generateBrief({ mode: briefMode, ... }) call | `mode.*briefMode`    | VERIFIED | `MainView.tsx:242`: `mode: briefMode,` found in generateBrief call at setTimeout block       |
| `src/brief/generate.ts`     | `src/brief/types.ts`     | BriefInput type import with mode field       | `input\.mode`        | VERIFIED | `generate.ts:65`: `buildInstructionsSection(input.mode, input.inspirationText)` and line 105: `input.mode ?? 'best'` |

### Requirements Coverage

| Requirement | Source Plan | Description                                                                                                               | Status    | Evidence                                                                                             |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| MODE-03     | 21-01-PLAN  | "Copy (Best results)" mode instructs Claude Code to faithfully reproduce the design with clean, responsive development practices | SATISFIED | `generate.ts:127-132`: 'best' branch — "clean, production-ready code... semantic HTML, CSS flexbox/grid... relative units (rem, %, vh)... responsive patterns" |
| MODE-04     | 21-01-PLAN  | "Copy (Pixel for pixel)" mode instructs Claude Code to match the Figma design as exactly as possible                     | SATISFIED | `generate.ts:133-138`: 'pixel' branch — "exact pixel values... fixed dimensions... Prioritize visual accuracy over code flexibility" |
| MODE-05     | 21-01-PLAN  | "Use as inspiration" mode shows a text area for the user to describe what to take from the design                        | SATISFIED | `MainView.tsx:572-580`: textarea rendered conditionally when `briefMode === 'inspiration'`, inside `!briefResult` gate |
| MODE-06     | 21-01-PLAN  | "Use as inspiration" mode instructs Claude Code to adapt design patterns to the user's site, incorporating their custom context | SATISFIED | `generate.ts:139-149`: 'inspiration' branch — adaptation instructions + blockquote of `inspirationText` when provided |

No orphaned requirements: all four MODE IDs declared in the PLAN are mapped to this phase in REQUIREMENTS.md and verified above.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| None | —    | —       | —        | —      |

No TODO/FIXME, placeholder text, empty implementations, or stub handlers detected in the four modified files (`types.ts`, `generate.ts`, `MainView.tsx`, `styles.ts`).

### Human Verification Required

#### 1. Textarea Conditional Visibility

**Test:** Open the plugin, paste a valid Figma URL, wait for file validation. Cycle through the three mode cards.
**Expected:** The textarea appears only when "Use as inspiration" is selected; it collapses immediately when switching to "Copy (Best results)" or "Copy (Pixel for pixel)".
**Why human:** Conditional CSS/React rendering of a UI element cannot be confirmed by static code analysis alone.

#### 2. Inspiration Text Blockquote in Generated Brief

**Test:** Select "Use as inspiration", type a multi-line context description, click "Get Brief", copy and inspect the markdown output.
**Expected:** The `## How to Use This Brief` section contains a `**What to take from this design:**` heading followed by the user's text formatted as a Markdown blockquote (`>`), with each line of the input prefixed by `> `.
**Why human:** Verifying the actual brief output for formatting and content requires a live plugin run.

#### 3. Mode Name in Brief Metadata Header

**Test:** Generate a brief with each of the three modes. Open the saved brief at `.shipstudio/assets/brief.md`.
**Expected:** The metadata block includes `**Mode:** Copy (Best results)`, `**Mode:** Copy (Pixel for pixel)`, or `**Mode:** Use as inspiration` respectively, placed between `**Extracted:**` and `**Figma URL:**`.
**Why human:** Requires live execution to confirm file output.

### Additional Notes

- The stale closure fix (adding `briefMode` and `inspirationText` to the `runAssetExport` useCallback dependency array at `MainView.tsx:276`) is correctly in place, ensuring mode and inspiration text are always current values when the brief is generated.
- `inspirationText` is passed as `undefined` (not as empty string) when mode is not 'inspiration' (`MainView.tsx:243`), preventing stale text from leaking into other mode briefs.
- TypeScript compiler reports zero errors (`npx tsc --noEmit` — clean exit).

---

_Verified: 2026-03-01T17:30:00Z_
_Verifier: Claude (gsd-verifier)_
