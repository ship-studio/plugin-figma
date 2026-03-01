# Phase 23: Placeholder System - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

The brief instructs Claude Code to create visible, named placeholder boxes for any visual element that needs an asset but doesn't have one. Users can reference these placeholders in follow-up prompts to replace them with real assets. This phase modifies the brief's instructions and adds a new Placeholders section -- no plugin UI changes, no asset pipeline changes.

</domain>

<decisions>
## Implementation Decisions

### Placeholder Appearance
- Dashed border box style -- transparent/light background with a dashed colored border and centered label
- Color should fit the site's context -- Claude Code picks an appropriate muted color that's visible but doesn't clash with the design
- Label shows reference name plus original dimensions: "[hero-bg] 1200x600"
- Placeholder boxes should be sized to match the design's intended dimensions from Figma

### Reference Naming
- Descriptive names derived from the Figma layer/element context: "hero-background", "team-photo", "social-linkedin-icon"
- Bracketed format: [hero-bg] -- square brackets make refs scannable and distinct from regular text
- Duplicate element types get auto-numbered: "team-photo-1", "team-photo-2"
- Include 1-2 example follow-up prompts showing how to replace placeholders

### Detection Scope
- Images and icons only -- only flag obvious content images and icons not in the asset list
- Explicit criteria: tell Claude Code to look for "any element in the preview that appears to be a photograph, logo, icon, or illustration but is NOT in the Assets list"
- Confident only -- only create placeholders for elements clearly visible as images/icons in the preview, no uncertain flags
- Replace the existing "ask the user" behavior with placeholders -- non-blocking workflow where Claude Code creates visible placeholders and keeps building

### Summary Format
- New "## Placeholders" section after the Assets section in the brief
- Instructions for Claude Code to generate the placeholder list during building (not plugin-generated) -- Claude Code judges what's missing by comparing preview against asset list
- Include follow-up workflow instruction with examples: 'To replace a placeholder, tell Claude Code: "Replace [hero-bg] with hero.jpg"'

### Claude's Discretion
- Exact placeholder CSS implementation details (border-radius, padding, font)
- How to derive descriptive names from Figma layer names (sanitization, abbreviation)
- Exact wording of detection criteria beyond the core rules above

</decisions>

<specifics>
## Specific Ideas

- The placeholder summary should be a table: | Reference | Description | Expected Size |
- The existing `sharedDuring` instruction ("ask the user rather than substituting or fabricating a replacement") should be updated to reference the placeholder system instead

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `buildInstructionsSection` in `src/brief/generate.ts`: Already has `sharedDuring` text about missing assets -- this is the integration point for placeholder instructions
- `buildAssetsSection` in `src/brief/generate.ts`: Assets table with Usage column -- placeholder section goes after this
- `deriveUsageContext` in `src/brief/generate.ts`: Derives human-readable context from asset type + breadcrumb -- similar logic could inform placeholder descriptions

### Established Patterns
- Brief sections are built by standalone `build*Section` functions that return markdown strings
- Section order is locked in `generateBrief`: Metadata, Instructions, Preview, Layout Tree, Tokens, Components, Assets
- Pure function architecture: no side effects, no async, no API calls
- Tests in `src/brief/generate.test.ts` (73 tests) cover all section builders

### Integration Points
- `generateBrief` in `src/brief/generate.ts` line 43: main orchestrator that calls all section builders -- new Placeholders section call goes here
- `sharedDuring` string at line 124: the "ask the user" text that gets replaced with placeholder instructions
- Brief section order: Placeholders section inserts after Assets (line 70)

</code_context>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 23-placeholder-system*
*Context gathered: 2026-03-01*
