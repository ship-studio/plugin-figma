---
phase: 08-ux-flow-simplification
verified: 2026-02-28T23:15:00Z
status: gaps_found
score: 2/3 must-haves verified
re_verification: false
gaps:
  - truth: "When complex compositions are detected, user sees a clear count/warning before extraction begins"
    status: failed
    reason: "Composition count is shown in the merged result card AFTER the full pipeline completes, not before extraction begins. The CONTEXT.md design decision explicitly placed compositions in the post-extraction result card ('Composition detection results appear in the merged result card (not before extraction)'). The phase-level success criterion 3 was not implemented as stated."
    artifacts:
      - path: "src/views/MainView.tsx"
        issue: "Lines 544-551: composition count rendered inside the merged result card gated on briefResult && extractionResult && extractionStats && exportResult — visible only after the entire pipeline finishes, not before extraction begins"
    missing:
      - "A pre-extraction composition warning/count is not present. If the intent was to warn the user before extraction, this requires detecting compositions from the URL or a pre-flight inspection before running extractLayout(). Alternatively, if the design decision in CONTEXT.md was intentional (show composition count post-extraction in the result card), then the phase-level success criterion 3 should be revised to match the implemented behavior."
human_verification:
  - test: "Single updating button state during pipeline"
    expected: "Button text cycles through 'Extracting layout...' -> 'Rendering preview...' / 'Exporting assets (N/M)...' -> 'Generating brief...' while the spinner is inline in the button during each stage"
    why_human: "Cannot verify animated/sequential button state transitions through static code analysis"
  - test: "Merged result card visual layout"
    expected: "Single card appears after pipeline completes showing: checkmark + 'Brief ready' header, full-width 'Copy Brief to Clipboard' button at top, stats row (layers, assets, tokens), composition count in amber if any, token warning banner if brief is large, component badges, asset warnings, 'Show tree preview' toggle, and '.shipstudio/brief.md' note"
    why_human: "Card styling and visual hierarchy can only be confirmed in running plugin"
  - test: "Auto-derived scope hint"
    expected: "No radio group for scope selection; instead a single-line hint 'Will extract the selected element' or 'Will extract the whole page — select a specific element in Figma to narrow scope' based on whether the URL contains a nodeId"
    why_human: "URL-based hint behavior requires testing with both URL types in running plugin"
  - test: "Gray 'Get New Brief' button after completion"
    expected: "After the pipeline completes and the result card appears, the button becomes gray with 'Get New Brief' text, clearly signaling completion while remaining actionable"
    why_human: "Button styling and state transition require visual confirmation in running plugin"
---

# Phase 8: UX Flow Simplification - Verification Report

**Phase Goal:** Users experience a streamlined plugin flow with fewer steps and less overwhelming results
**Verified:** 2026-02-28T23:15:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Plugin flow has fewer visible steps between pasting a URL and getting the brief | VERIFIED | Radio group eliminated (auto-derived scope). Loading shown inline in button, not separate spinner section. 3 result sections merged into 1 card. Net reduction: removed 3 spinner sections + 3 result sections + 1 radio group; added 1 merged result card + button-inline loading. |
| 2 | Results screen surfaces key information (brief size, asset count, composition count) without overwhelming the user with raw data | VERIFIED | Merged result card at lines 509-632 shows: layer count, asset count, token estimate (with amber warning if large), composition count (amber, conditional), component badges (capped at 8), asset warnings (capped at 5), tree toggle (collapsed by default). No raw data dumps. |
| 3 | When complex compositions are detected, user sees a clear count/warning before extraction begins | FAILED | Composition count is rendered inside the merged result card (lines 544-551), which is gated on `briefResult && extractionResult && extractionStats && exportResult` — visible only AFTER the full pipeline completes. No pre-extraction composition warning exists. |

**Score:** 2/3 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/views/MainView.tsx` | Merged result card and single progress indicator replacing 3 separate sections each | VERIFIED | File exists (662 lines). Merged result card present at lines 508-632. Progress indicator consolidated into button (lines 634-659). No old separate spinner sections remain. |
| `src/styles.ts` | Optional result card CSS class if needed | VERIFIED | No CSS changes needed; existing classes (`figma-plugin-section`, `figma-plugin-file-info`) reused as planned. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| MainView.tsx (button loading) | extracting, exportingAssets, generatingBrief state hooks | `const isLoading = extracting \|\| exportingAssets \|\| generatingBrief` at line 636 | WIRED | Button label ternary (lines 637-647) derives from all three boolean states. Spinner renders inline in button when `isLoading` is true (line 655). |
| MainView.tsx (merged result card) | briefResult, extractionResult, extractionStats, exportResult state hooks | `briefResult && extractionResult && extractionStats && exportResult` at line 509 | WIRED | All four state values gate the merged result card. Each is consumed: briefResult.stats (lines 532-539), extractionResult.truncated (line 516), extractionStats.components (line 562), exportResult.assets (line 545) and exportResult.warnings (line 591). |
| MainView.tsx (composition count) | exportResult.assets filtered by assetType==='composition' | `exportResult.assets.filter(a => a.assetType === 'composition').length` at line 545 | WIRED (post-extraction only) | Connection to ExportResult is correct. Count is computed and rendered. However this is post-extraction, not pre-extraction as success criterion 3 requires. |
| MainView.tsx (scope auto-derivation) | parsedUrl.nodeId presence | `const scope: ExtractionScope = parsedUrl?.nodeId ? 'node' : 'page'` at line 103 | WIRED | Scope derived from URL at line 103. Radio group removed. Scope hint rendered conditionally at lines 473-481. |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| UX-02 | 08-01-PLAN.md | Plugin flow is simplified with fewer visible steps | PARTIALLY SATISFIED | The core simplification is implemented: 3 result sections -> 1 merged card, radio group removed, loading consolidated into button. However success criterion 3 (pre-extraction composition warning) was explicitly de-scoped in CONTEXT.md design decisions ("Composition detection results appear in the merged result card (not before extraction)"). UX-02 is satisfied at the level planned and designed, but not at the level described in the phase-level success criterion 3. |

**Orphaned requirements check:** REQUIREMENTS.md maps only UX-02 to Phase 8. No orphaned requirements found.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None detected | — | — | — | — |

No TODO/FIXME comments, no empty implementations, no stub returns, no disconnected state found in `src/views/MainView.tsx`. The build succeeds with no TypeScript errors (`npx vite build` exits 0, 66.71 kB output).

---

### Human Verification Required

#### 1. Single updating button state during pipeline

**Test:** Paste a Figma URL, click "Get Brief", and watch the button during each pipeline phase.
**Expected:** Button shows spinner + "Extracting layout..." during extraction, then "Rendering preview..." or "Exporting assets (N/M)..." during export, then "Generating brief..." during brief generation.
**Why human:** Sequential animated state transitions cannot be verified through static code analysis.

#### 2. Merged result card visual layout

**Test:** Complete a full pipeline run and inspect the result card.
**Expected:** Single card shows: green checkmark + "Brief ready" header, full-width "Copy Brief to Clipboard" button at top, stats row (layers dot assets dot ~NK tokens), composition count in amber if any compositions were exported, token warning banner if brief is large, component badges (max 8 + overflow count), asset warnings (max 5 + overflow), "Show tree preview" toggle, "Also saved to .shipstudio/brief.md" note.
**Why human:** Card visual hierarchy, spacing, and color rendering require inspection in the running plugin.

#### 3. Auto-derived scope hint

**Test:** Test with two URLs — one with a nodeId fragment, one without.
**Expected (with nodeId):** Hint reads "Will extract the selected element". Expected (without nodeId): Hint reads "Will extract the whole page — select a specific element in Figma to narrow scope". No radio buttons appear in either case.
**Why human:** URL-dependent conditional rendering requires live testing with real Figma URLs.

#### 4. Gray "Get New Brief" button after completion

**Test:** Complete a pipeline run and observe the button state after the result card appears.
**Expected:** Button turns gray with "Get New Brief" label (uses `btn-secondary` class when `briefResult && !isLoading`). Clicking it should clear results and re-run the pipeline.
**Why human:** Button style class application (`btn-primary` vs `btn-secondary`) and color rendering require visual confirmation.

---

### Gaps Summary

**Gap 1: Composition count is shown post-extraction, not pre-extraction (Success Criterion 3)**

The phase-level success criterion states the user should see a composition count/warning "before extraction begins." The actual implementation — documented in CONTEXT.md before planning, reflected in the PLAN, and confirmed in code — places the composition count inside the merged result card, which is only visible after the full pipeline completes.

This is a design decision conflict, not a code defect. The CONTEXT.md explicitly states: "Composition detection results appear in the merged result card (not before extraction)." The planning and implementation are internally consistent.

**Resolution options:**
1. If the intent was always post-extraction (matching CONTEXT.md), update the phase-level success criterion to reflect "User sees composition count in the result card after export."
2. If pre-extraction warning is genuinely required, this requires a pre-flight inspection step before `extractLayout()` is called — a non-trivial addition that would need a new plan task.

The current implementation is well-built and internally consistent with its own design documents. The gap is between the verifier's success criterion 3 and what was designed and shipped.

---

_Verified: 2026-02-28T23:15:00Z_
_Verifier: Claude (gsd-verifier)_
