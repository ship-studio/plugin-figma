# Phase 5: Brief Assembly & Output - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

The plugin assembles all extracted data (layout tree, design tokens, components, asset references) into a structured markdown design brief, estimates token count, saves to file, and copies to clipboard with progress feedback and error messages. This is the final assembly phase — all extraction data is already available from Phases 2-4.

</domain>

<decisions>
## Implementation Decisions

### Brief structure & sections
- Visual-first section order: 1) Metadata (file, frame, date), 2) Preview image reference, 3) Layout tree, 4) Design tokens (colors, typography, spacing, borders, shadows), 5) Components inventory, 6) Asset references
- Design tokens formatted as markdown tables grouped by type — each row shows token name/value and usage count
- Include actual text content from text nodes alongside node info (e.g., Text 'Sign In' (Inter 16/600)) — essential for Claude Code to reproduce the UI accurately

### Layout description style
- Indented tree format with key properties inline on each line — type, name, layout direction, gap, key dimensions (e.g., Frame 'Card' (column, gap: 12, 320x200))
- Skip default/obvious values, only show meaningful properties
- Full tree depth — show complete hierarchy as extracted, no depth cap
- CSS flexbox terms: 'row', 'column', 'gap: 16', 'justify: center', 'align: stretch', 'padding: 16 24' — directly translatable to code
- Collapse repeated identical component instances with count: 'Instance "ListItem" x5 (repeated)' — uses existing repeatCount on LayoutNode
- Framework-agnostic: describe layout intent, not framework-specific code

### Clipboard & output flow
- Auto-generate brief after asset export completes — full pipeline runs from URL paste to clipboard-ready brief in one flow
- Prominent 'Copy Brief to Clipboard' button shown after generation — clicking copies markdown and shows success toast, button stays available for re-copying
- Also save brief to `.shipstudio/brief.md` alongside assets — persists across clipboard changes, gives Claude Code a file to reference directly
- Summary stats only in plugin UI (no full brief preview): 'Brief ready: 47 nodes, 8 colors, 3 fonts, 12 assets, ~8K tokens' — the brief is for Claude Code, not for reading in the plugin

### Token count & warnings
- Estimate tokens as characters / 4 (standard rough estimate) — simple, no dependencies, shown as '~8K tokens'
- Always show token estimate in the summary stats — turns yellow/warning only when exceeding threshold
- Warning at ~12K tokens: yellow banner 'Brief is ~15K tokens (recommended max: 12K). Consider selecting a smaller frame.' — warning only, still allow copy, user decides
- No auto-truncation — if it's too large, user should select a smaller frame

### Claude's Discretion
- Exact markdown formatting details and whitespace
- How to handle nodes with no meaningful properties (empty containers, groups)
- Component inventory table column layout
- Asset reference section formatting
- Progress message wording during brief generation
- Error message wording for extraction failures (PLUI-03, PLUI-04 — progress and error messages are already partially implemented in MainView)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExtractLayoutResult` in `src/layout/extract.ts`: Complete extraction data structure with `extraction.rootNodes`, `tokens`, `fileKey`
- `ExportResult` in `src/assets/types.ts`: Asset export data with `previewPath`, `assets[]`, `warnings[]`
- `LayoutNode` in `src/layout/types.ts`: Full node structure with `autoLayout`, `textContent`, `componentRef`, `repeatCount`, `styleRefs`
- `DesignTokens` in `src/tokens/types.ts`: All 8 token types with names, values, usage counts, node back-references
- `figmaColorToCSS` / `gradientToCSS` in `src/tokens/color-utils.ts`: CSS value formatters already built
- `actions.showToast()`: Existing toast notification system for success/error feedback
- `shell.exec()`: Can run `pbcopy` (macOS) for clipboard, `echo > file` for file writes

### Established Patterns
- Pure functions for all data transformation (testable via Vitest, 168 tests currently)
- Spinner + message pattern for async operations in MainView
- Stats display with `useMemo` for computed summaries
- Warning boxes with `figma-plugin-warning` CSS class and action buttons
- Toast notifications for operation completion feedback

### Integration Points
- `MainView.tsx`: Brief generation triggers after `exportResult` is set — wire into `runAssetExport` completion
- `project.path`: Project root for `.shipstudio/brief.md` file path
- `shell.exec('pbcopy')` or platform clipboard API for copy-to-clipboard
- Existing extraction stats display can be extended with brief summary stats

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-brief-assembly-output*
*Context gathered: 2026-02-28*
