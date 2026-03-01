# Phase 6: Brief Instructions & Terminology - Research

**Researched:** 2026-02-28
**Domain:** Brief generation (markdown assembly), Figma plugin UI (React/JSX string literals)
**Confidence:** HIGH

## Summary

This phase has two distinct workstreams that touch different parts of the codebase with minimal overlap. The first workstream adds a new "How to Use This Brief" section to the generated markdown brief, slotting it between the existing Metadata and Preview sections. The second workstream replaces developer-facing jargon in the plugin's React UI with human-friendly terminology. Both workstreams are straightforward string manipulation with no new dependencies, no architectural changes, and no API surface modifications.

The brief generation side follows the existing pattern perfectly: add a new `buildInstructionsSection()` pure function that returns a markdown string, insert it into the `sections` array in `generateBrief()` at position index 1 (after metadata, before preview), and update the section order comment. The UI terminology side is a series of inline string replacements in `MainView.tsx` plus simplification of the stats computation that drops `autoLayoutFrames`, `colorCount`, and `fontCount` from the summary display.

**Primary recommendation:** Treat this as two independent sub-tasks: (1) new brief section with tests, (2) UI terminology replacements with manual verification. No new libraries or types needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Structured checklist format with three stages: Before building / During building / After building
- Describe behaviors, not feature names -- "Plan your approach and ask clarifying questions" not "Enter plan mode"
- Asset-only rule must be specific: reference the asset mapping section, state exact paths, and say "if an asset is missing, ask -- do not substitute"
- Verification step: both visual comparison against the preview image AND checklist verification that tokens and assets are correctly used
- New section goes right after Metadata, before Preview -- Claude Code reads the rules first
- Section heading: "How to Use This Brief" (not just "Instructions")
- Instructions cross-reference other sections by name (e.g., "See the Assets section below for exact file paths")
- No token count estimate in the instructions section
- "Extraction Scope" (radio group label) -> "What to extract"
- "Single Node" -> "This element"
- "Frame" -> "This section"
- "Entire Page" -> "Whole page"
- "nodes" -> "layers" (matches Figma's own terminology)
- "auto-layout frames" stat -> drop entirely from stats display
- Stats line simplified from "340 nodes . 5 colors . 2 fonts . 3 assets . ~8K tokens" to "340 layers . 3 assets . ~8K tokens"
- Instructions section must be visible in the brief (builds user confidence) but concise -- 3-5 lines max, not a wall of text
- Token warning rephrased in plain language without the token count: e.g., "This brief is large. Consider extracting a smaller section for better results."
- Primary button label simplified from "Extract Design Brief" to something shorter
- Progress state labels ("Extracting...", "Exporting assets...", "Generating brief...") kept as-is

### Claude's Discretion
- Exact wording of each instruction line (within the before/during/after structure)
- Whether to include the hint text for disabled "This element" option or rephrase it
- Exact button label choice (e.g., "Get Brief", "Get Design Brief", "Extract")
- How to rephrase the token warning in plain language

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INST-01 | Brief includes a plan mode instruction telling Claude Code to plan and ask questions before building | Implemented via "Before building" stage in the new `buildInstructionsSection()` function. Cross-references brief sections by name. |
| INST-02 | Brief includes an asset-only rule telling Claude Code to use only provided assets, never fabricate replacements | Implemented via "During building" stage. References the Assets section explicitly, includes "if an asset is missing, ask -- do not substitute" directive. |
| INST-03 | Brief includes a verification instruction telling Claude Code to compare its output against the PNG preview when done | Implemented via "After building" stage. References both the Preview image and the tokens/assets for dual verification. |
| UX-01 | Plugin uses human-friendly terminology throughout (no "Extraction Scope", "Single Node", "auto-layout frames") | Implemented via string replacements in MainView.tsx: radio group label, radio option labels, stats line simplification, token warning rephrasing, button label change. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18 | Plugin UI rendering | Already in project; UI changes are JSX string replacements |
| TypeScript | (project version) | Type safety | Already in project; no new types needed |
| Vitest | (project version) | Unit testing for brief generation | Already in project; existing test patterns for `generateBrief()` |

### Supporting
No new libraries needed. This phase is entirely string manipulation in existing files.

### Alternatives Considered
None -- no library decisions to make. This is pure code modification.

## Architecture Patterns

### Recommended Project Structure
No new files needed. All changes go into existing files:
```
src/
├── brief/
│   ├── generate.ts          # Add buildInstructionsSection(), update sections array + comment
│   ├── generate.test.ts     # Add tests for new section + updated section order
│   └── types.ts             # No changes needed (instructions are a constant, not configurable)
└── views/
    └── MainView.tsx          # Terminology replacements, stats simplification, button label
```

### Pattern 1: Section Builder Function
**What:** Each brief section is built by a dedicated `build*Section()` function that returns a markdown string. Empty strings are filtered out by `.filter(Boolean)`.
**When to use:** Always -- this is the established pattern for all brief sections.
**Example:**
```typescript
// Source: src/brief/generate.ts (existing pattern)
function buildInstructionsSection(): string {
  return [
    '## How to Use This Brief',
    '',
    '**Before building:** ...',
    '**During building:** ...',
    '**After building:** ...',
  ].join('\n');
}
```

Key characteristics of this pattern:
- Pure function, no side effects
- Returns a single markdown string
- Uses `.join('\n')` for line assembly
- Called from the `sections` array in `generateBrief()`

### Pattern 2: Static Section (No Input Parameters)
**What:** The instructions section content is fixed -- it does not depend on `BriefInput` data. It can be a zero-parameter function.
**When to use:** When the section content is a constant that cross-references other section names but doesn't use extracted data.
**Example:**
```typescript
// No parameters needed -- content is static
function buildInstructionsSection(): string {
  // ...
}

// In generateBrief():
const sections = [
  buildMetadataSection(input),
  buildInstructionsSection(),       // <-- no input needed
  buildPreviewSection(...),
  // ...
];
```

This is a deliberate choice: the instructions don't reference specific asset filenames or token values (that would make them fragile). They reference section *names* ("See the Assets section") which are stable.

### Pattern 3: Inline UI Strings
**What:** All user-facing text in the plugin is inline in the JSX. There is no i18n layer or string constants file. Changes are direct edits to string literals in the component.
**When to use:** For all UI terminology changes in this phase.
**Example:**
```tsx
// Current (MainView.tsx line 480):
<label className="figma-plugin-label">Extraction Scope</label>

// Changed to:
<label className="figma-plugin-label">What to extract</label>
```

### Anti-Patterns to Avoid
- **Parameterizing instruction content via BriefInput:** The instructions are a constant. Adding a field to `BriefInput` for this would add unnecessary complexity and coupling. If instructions need to be configurable in the future, that's a v2 concern (and currently deferred).
- **Extracting UI strings to a constants file:** The project uses inline strings consistently. Introducing a separate strings file for just this phase would break consistency. If i18n is needed later, it should be a dedicated effort.
- **Including specific asset paths in instruction text:** Instructions should reference sections by name ("See the Assets section"), not embed specific file paths. The assets change per extraction; the instructions don't.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown formatting | Custom markdown builder | `.join('\n')` array pattern | Established project convention, simple, readable |
| Token counting | Complex tokenizer | `estimateTokens()` (chars/4) | Already exists, good enough for warning threshold |

**Key insight:** This phase has zero "deceptively complex" problems. It is string manipulation through and through. The risk is not technical complexity but getting the wording right (which is covered by user decisions in CONTEXT.md).

## Common Pitfalls

### Pitfall 1: Breaking Existing Test Assertions on Section Order
**What goes wrong:** The test `produces markdown with all 6 sections in locked order` asserts that Metadata < Preview < Layout Tree < Tokens < Components < Assets. Inserting a new section between Metadata and Preview changes the count to 7 sections and could break index-based assertions.
**Why it happens:** Tests check `indexOf()` ordering. A new section between Metadata and Preview doesn't break the relative order check, but any test checking "6 sections" by count would break.
**How to avoid:** Update the test description from "6 sections" to "7 sections" and add an assertion for the new "How to Use This Brief" section in the correct position (after Metadata, before Preview).
**Warning signs:** Test failures in `generate.test.ts` after adding the new section.

### Pitfall 2: Stats Line Inconsistency Between Brief and UI
**What goes wrong:** The brief result `stats` object still includes `nodeCount`, `colorCount`, `fontCount`, `assetCount` (the `BriefStats` type). The UI currently displays all of these. If we simplify the UI stats line but don't update the toast message, we get inconsistent terminology.
**Why it happens:** Stats are used in two places: (1) the "Brief ready" display section (lines 692-703), and (2) the toast message (line 200). Both need updating.
**How to avoid:** Search for all usages of `briefResult.stats` and `brief.stats` in MainView.tsx and update them consistently. Change "nodes" to "layers" everywhere.
**Warning signs:** One place says "layers" and another says "nodes".

### Pitfall 3: Forgetting to Update the Section Order Comment
**What goes wrong:** The JSDoc comment on `generateBrief()` documents the locked section order (1-6). Adding section 2 ("How to Use This Brief") bumps everything else up.
**Why it happens:** Comments are easy to forget when the code change is mechanical.
**How to avoid:** Update the JSDoc comment to reflect the new 7-section order: 1. Metadata, 2. How to Use This Brief, 3. Preview, 4. Layout Tree, 5. Design Tokens, 6. Components, 7. Assets.

### Pitfall 4: Token Warning Inconsistency
**What goes wrong:** The token warning banner (lines 707-712) currently shows the token count in the strong tag: "Large brief (~12K tokens)". The user wants this rephrased in plain language *without* the token count.
**Why it happens:** The current implementation programmatically inserts the calculated token count.
**How to avoid:** Replace both the `<strong>` heading and the `<p>` body text. Remove the dynamic token count from the heading. Use plain language like "This brief is large. Consider extracting a smaller section for better results."

### Pitfall 5: Disabled Radio Hint Text
**What goes wrong:** The "This element" option (currently "Single Node") has a hint when disabled: "Paste a URL with a node-id to use this option". This hint uses technical language ("node-id") that contradicts the plain-language goal.
**Why it happens:** The hint was written for developer users.
**How to avoid:** Rephrase to something like "Select an element in Figma first" or "Paste a URL that points to a specific element". This is at Claude's discretion per CONTEXT.md.

### Pitfall 6: Toast Messages Still Using Old Terminology
**What goes wrong:** The `showToast` call after extraction (line 365) says `Extracted ${result.extraction.nodeCount} nodes`. The toast after brief generation (line 200) says `${brief.stats.nodeCount} nodes, ${brief.stats.colorCount} colors, ${brief.stats.fontCount} fonts, ...`.
**Why it happens:** Toast messages are separate from the visible stats display.
**How to avoid:** Audit all `showToast` calls in MainView.tsx for terminology. Change "nodes" to "layers" in toasts. Simplify the brief-ready toast to match the simplified stats line.

## Code Examples

Verified patterns from the existing codebase:

### Adding a New Brief Section
```typescript
// Source: src/brief/generate.ts -- existing pattern, adapted for instructions
function buildInstructionsSection(): string {
  return [
    '## How to Use This Brief',
    '',
    '**Before building:** Read this brief fully. Plan your approach and ask clarifying questions before writing any code.',
    '**During building:** Use only the assets listed in the Assets section below -- if an asset is missing, ask the user rather than substituting or fabricating a replacement.',
    '**After building:** Compare your result against the Preview image above and verify that all design tokens and assets are correctly applied.',
  ].join('\n');
}
```

### Inserting the New Section in the Correct Position
```typescript
// Source: src/brief/generate.ts -- sections array modification
const sections = [
  buildMetadataSection(input),
  buildInstructionsSection(),                                    // NEW -- after metadata, before preview
  buildPreviewSection(exportResult.previewPath, projectPath),
  buildLayoutTreeSection(extraction.extraction.rootNodes),
  buildDesignTokensSection(tokens),
  buildComponentsSection(tokens.components),
  buildAssetsSection(exportResult.previewPath, exportResult.assets, projectPath),
].filter(Boolean);
```

### UI Terminology Replacements (MainView.tsx)
```tsx
// Line 480 -- radio group label
<label className="figma-plugin-label">What to extract</label>

// Line 491 -- "Single Node" option
This element

// Line 506 -- "Frame" option
This section

// Line 516 -- "Entire Page" option
Whole page

// Line 564 -- stats line (after extraction)
{extractionResult.nodeCount} layers &middot; {extractionStats.textNodes} text layers

// Lines 692-703 -- brief ready stats line
{briefResult.stats.nodeCount} layers &middot;{' '}
{briefResult.stats.assetCount} assets &middot;{' '}
<span style={{...}}>
  ~{Math.round(briefResult.stats.estimatedTokens / 1000)}K tokens
</span>

// Lines 707-712 -- token warning banner
<div className="figma-plugin-warning" style={{ marginTop: '8px' }}>
  <strong>This brief is large</strong>
  <p>Consider extracting a smaller section for better results.</p>
</div>

// Line 738 -- primary button
{extracting ? 'Extracting...' : exportingAssets ? 'Exporting assets...' : generatingBrief ? 'Generating brief...' : 'Get Brief'}
```

### Simplifying the Stats Computation
```typescript
// The ExtractionStats interface and collectStats function can be simplified.
// autoLayoutFrames is no longer displayed, but keeping it in the interface is harmless.
// The key change is in the JSX rendering, not the computation.
// However, if desired, autoLayoutFrames can be removed from ExtractionStats to keep it clean.
```

### Test Update for New Section Order
```typescript
// Source: src/brief/generate.test.ts -- updated section order test
it('produces markdown with all 7 sections in locked order', () => {
  const result = generateBrief(makeInput());

  expect(result.markdown).toContain('# Design Brief');
  expect(result.markdown).toContain('## How to Use This Brief');
  expect(result.markdown).toContain('## Preview');
  // ... rest of sections

  const metadataIdx = result.markdown.indexOf('# Design Brief');
  const instructionsIdx = result.markdown.indexOf('## How to Use This Brief');
  const previewIdx = result.markdown.indexOf('## Preview');
  // ...

  expect(metadataIdx).toBeLessThan(instructionsIdx);
  expect(instructionsIdx).toBeLessThan(previewIdx);
  // ... rest of order checks
});
```

## Exact Change Locations

### `src/brief/generate.ts`
| Line(s) | Current | Change |
|---------|---------|--------|
| 30-38 | JSDoc section order comment (1-6) | Update to 7 sections, insert "How to Use This Brief" at position 2 |
| 44-51 | `sections` array (6 entries) | Insert `buildInstructionsSection()` at index 1 |
| (new) | -- | Add `buildInstructionsSection()` function (~10 lines) |

### `src/brief/generate.test.ts`
| Location | Current | Change |
|----------|---------|--------|
| Line 147 | "all 6 sections" test | Update to 7 sections, add `## How to Use This Brief` assertion and ordering |
| (new) | -- | Add dedicated test block for instructions section content |

### `src/views/MainView.tsx`
| Line(s) | Current | Change |
|---------|---------|--------|
| 200 | Toast: `nodes, colors, fonts, assets, tokens` | Simplify to `layers, assets, tokens` |
| 365 | Toast: `Extracted N nodes` | Change to `Extracted N layers` |
| 480 | `Extraction Scope` | `What to extract` |
| 491 | `Single Node` | `This element` |
| 493-496 | Hint: "Paste a URL with a node-id..." | Rephrase to plain language |
| 506 | `Frame` | `This section` |
| 516 | `Entire Page` | `Whole page` |
| 536 | `{largeTreeWarning.nodeCount} nodes detected` | `{largeTreeWarning.nodeCount} layers detected` |
| 564 | Stats: `N nodes . N auto-layout frames . N text layers` | `N layers . N text layers` (drop auto-layout) |
| 692-703 | Brief stats: `nodes . colors . fonts . assets . tokens` | `layers . assets . tokens` |
| 707-712 | Token warning: `Large brief (~NK tokens)` + `Recommended max...` | `This brief is large` + `Consider extracting a smaller section for better results.` |
| 738 | `Extract Design Brief` | Shorter label (e.g., "Get Brief") |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No brief instructions | Static instructions section in brief | This phase | Claude Code gets behavioral guidance before reading design data |
| Developer jargon in UI | Human-friendly terminology | This phase | Non-technical users can understand the plugin |

**Deprecated/outdated:**
- None -- this is greenfield work on top of a stable v1.0 codebase.

## Open Questions

1. **Exact instruction wording**
   - What we know: Structure is before/during/after, 3-5 lines max, references section names
   - What's unclear: The precise wording within each stage (this is Claude's discretion per CONTEXT.md)
   - Recommendation: Draft wording in the plan, finalize during implementation. The code example above is a reasonable starting point.

2. **"This element" hint text for disabled state**
   - What we know: Current text is "Paste a URL with a node-id to use this option" -- too technical
   - What's unclear: Exact replacement phrasing (Claude's discretion)
   - Recommendation: "Select a specific element in Figma to use this option" or similar

3. **Exact button label**
   - What we know: Must be shorter than "Extract Design Brief"
   - What's unclear: Whether "Get Brief" or "Get Design Brief" or "Extract" (Claude's discretion)
   - Recommendation: "Get Brief" -- shortest, clearest, matches the action

4. **Whether to remove autoLayoutFrames from ExtractionStats interface**
   - What we know: The stat is no longer displayed in the UI
   - What's unclear: Whether to keep the field for potential future use or remove it for cleanliness
   - Recommendation: Remove it -- YAGNI. It can be re-added if needed. Removing it also ensures no accidental references remain.

## Sources

### Primary (HIGH confidence)
- `src/brief/generate.ts` -- read in full, section builder pattern verified
- `src/brief/generate.test.ts` -- read in full, 40 existing tests, assertion patterns verified
- `src/brief/types.ts` -- read in full, BriefInput/BriefResult/BriefStats types verified
- `src/views/MainView.tsx` -- read in full, all line numbers for terminology changes verified
- `.planning/phases/06-brief-instructions-terminology/06-CONTEXT.md` -- user decisions locked

### Secondary (MEDIUM confidence)
- `.planning/REQUIREMENTS.md` -- requirement IDs and descriptions confirmed
- `.planning/PROJECT.md` -- project constraints and architecture confirmed
- `.planning/STATE.md` -- current project position confirmed

### Tertiary (LOW confidence)
- None -- all findings are from direct codebase inspection.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, purely existing codebase
- Architecture: HIGH -- follows established section builder pattern exactly
- Pitfalls: HIGH -- identified from reading actual code and tests, specific line numbers verified

**Research date:** 2026-02-28
**Valid until:** 2026-03-30 (stable codebase, no external dependencies to drift)
