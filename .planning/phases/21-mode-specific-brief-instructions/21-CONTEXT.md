# Phase 21: Mode-Specific Brief Instructions - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate different "How to Use This Brief" instructions depending on the selected brief mode. The "Use as inspiration" mode also shows a text area in the plugin UI for users to describe what to adapt. This phase wires the `briefMode` state from Phase 20 into the brief generator. Extraction and export logic are unchanged — only the instructions section changes.

</domain>

<decisions>
## Implementation Decisions

### Instruction content
- Each mode's instructions follow the same Before/During/After structure used today
- "Copy (Best results)" tone: faithful but smart — reproduce the design faithfully, use clean responsive code (flex/grid, relative units, semantic HTML)
- "Copy (Pixel for pixel)" tone: exact values from brief — use exact pixel sizes, colors, spacing from design tokens; fixed widths; no responsive abstractions
- "Use as inspiration" tone: adapt patterns, don't copy — use the design as a reference for style/layout patterns, adapt to the user's existing site and codebase
- Claude drafts the specific bullet text for each mode

### Inspiration text area
- Appears below the mode cards when "Use as inspiration" is selected; collapses when other modes are picked
- Placeholder text: Claude decides (focus on describing what to take or adapt)
- Optional — user can leave it blank and get generic inspiration instructions
- Height: Claude decides based on plugin density patterns (compact plugin panel)

### Instruction placement
- Mode instructions fully replace the current static "How to Use This Brief" section — one set of instructions, not two
- Heading: Claude decides — could keep "How to Use This Brief" or change per mode
- User's inspiration text included verbatim as a quoted block inside the instructions
- Shared base rules across all modes (e.g. "use only listed assets", "compare to preview") with mode-specific additions on top

### Mode label in output
- Mode name appears in the metadata header (e.g. `**Mode:** Copy (Best results)`) alongside File, Frame, Date
- "Get Brief" button label: Claude decides whether to include the mode name
- Claude decides whether to also include the mode in the instructions heading

### Claude's Discretion
- Exact instruction bullet text for each mode
- Placeholder text for the inspiration text area
- Text area height
- Whether instructions heading changes per mode or stays "How to Use This Brief"
- Whether "Get Brief" button includes the mode name
- CSS styling for the text area (should match existing `.figma-plugin-input` patterns)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `BriefMode` type and `BRIEF_MODES` constant in `MainView.tsx` (Phase 20) — mode id/name/description already defined
- `briefMode` React state in `MainView.tsx` — already tracks selected mode
- `.figma-plugin-input` CSS class — textarea can reuse this for consistent styling
- `.figma-plugin-mode-section` wrapper — text area can nest inside this section

### Established Patterns
- `BriefInput` type in `src/brief/types.ts` — needs a `mode` field (and optionally `inspirationText`) added
- `generateBrief()` in `src/brief/generate.ts` is a pure function — takes `BriefInput`, returns `BriefResult`
- `buildInstructionsSection()` is currently a no-argument function returning static text (lines 110-118)
- `generateBrief` calls `buildInstructionsSection()` at line 65 — needs to pass mode through
- `buildMetadataSection(input)` at line 64 — needs to include mode name in output

### Integration Points
- `generateBrief()` call in MainView.tsx line 234 — needs `mode` and `inspirationText` added to the input object
- `buildInstructionsSection()` — needs mode parameter to switch instruction content
- `buildMetadataSection()` — needs mode parameter to add `**Mode:** ...` line
- Text area state needs a new `useState` in MainView for the inspiration text input

</code_context>

<specifics>
## Specific Ideas

No specific references — open to standard approaches. Instructions should be concise and actionable, not verbose.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 21-mode-specific-brief-instructions*
*Context gathered: 2026-03-01*
