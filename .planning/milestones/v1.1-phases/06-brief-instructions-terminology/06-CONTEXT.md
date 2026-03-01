# Phase 6: Brief Instructions & Terminology - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a concise instructions section to the generated design brief that tells Claude Code how to work with the brief (plan first, use only provided assets, verify against preview). Replace developer jargon throughout the plugin UI with human-friendly terminology. No backend changes to extraction or asset detection — those are Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Instruction wording
- Structured checklist format with three stages: Before building / During building / After building
- Describe behaviors, not feature names — "Plan your approach and ask clarifying questions" not "Enter plan mode"
- Asset-only rule must be specific: reference the asset mapping section, state exact paths, and say "if an asset is missing, ask — do not substitute"
- Verification step: both visual comparison against the preview image AND checklist verification that tokens and assets are correctly used

### Instruction placement in brief
- New section goes right after Metadata, before Preview — Claude Code reads the rules first
- Section heading: "How to Use This Brief" (not just "Instructions")
- Instructions cross-reference other sections by name (e.g., "See the Assets section below for exact file paths")
- No token count estimate in the instructions section

### Terminology replacements
- "Extraction Scope" (radio group label) → "What to extract"
- "Single Node" → "This element"
- "Frame" → "This section"
- "Entire Page" → "Whole page"
- "nodes" → "layers" (matches Figma's own terminology)
- "auto-layout frames" stat → drop entirely from stats display
- Stats line simplified from "340 nodes · 5 colors · 2 fonts · 3 assets · ~8K tokens" to "340 layers · 3 assets · ~8K tokens"

### Brief readability
- Instructions section must be visible in the brief (builds user confidence) but concise — 3-5 lines max, not a wall of text
- Token warning rephrased in plain language without the token count: e.g., "This brief is large. Consider extracting a smaller section for better results."
- Primary button label simplified from "Extract Design Brief" to something shorter (e.g., "Get Design Brief")
- Progress state labels ("Extracting...", "Exporting assets...", "Generating brief...") kept as-is

### Claude's Discretion
- Exact wording of each instruction line (within the before/during/after structure)
- Whether to include the hint text for disabled "This element" option or rephrase it
- Exact button label choice (e.g., "Get Brief", "Get Design Brief", "Extract")
- How to rephrase the token warning in plain language

</decisions>

<specifics>
## Specific Ideas

- Instructions should feel like a quick-start guide, not a legal document
- The before/during/after structure should be compact — think bullet points, not paragraphs
- Cross-references should help Claude Code navigate the brief: "See Assets section for file paths and their positions in the layout"
- Dropping the auto-layout count: users don't care how many frames use auto-layout. Layers + assets + estimated size is enough.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `generateBrief()` in `src/brief/generate.ts` is a pure function — new section inserts cleanly into the sections array
- `BriefInput` type in `src/brief/types.ts` may need a new field if instructions are configurable (or can be a constant)
- CSS classes like `.figma-plugin-section`, `.figma-plugin-label`, `.figma-plugin-radio-label` are shared across views
- `estimateTokens()` already exists for token count calculation

### Established Patterns
- Brief sections are built by individual `build*()` functions, filtered for empty, joined with double newlines
- Empty sections are omitted entirely (`.filter(Boolean)`)
- UI strings are inline in view components (no i18n layer) — simple find-and-replace
- Stats are computed via `useMemo` in MainView

### Integration Points
- New `buildInstructionsSection()` function slots into the sections array in `generateBrief()` after `buildMetadataSection()`
- Terminology changes are string replacements in `src/views/MainView.tsx` (lines 480, 491, 506, 516, 564, 692-703, 709-710, 738)
- Stats simplification modifies the `useMemo` computation and the summary line in the brief-ready display
- Button label change is in the dynamic button text section (line 738)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-brief-instructions-terminology*
*Context gathered: 2026-02-28*
