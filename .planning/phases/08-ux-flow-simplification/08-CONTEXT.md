# Phase 8: UX Flow Simplification - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Streamline the plugin flow so users go from URL to brief faster, and see clear results without data overload. The flow keeps its current capabilities but reduces visual noise, merges separate result sections, and surfaces composition detection information.

</domain>

<decisions>
## Implementation Decisions

### Step reduction
- Keep scope selection (This element / This section / Whole page) — users need this
- Keep file info section as-is (file key, node ID, file type) — helps verify the right file is selected
- Merge the 3 separate result sections (extraction stats, asset export stats, brief result) into one combined result card
- Intermediate result sections (extraction complete, assets exported) should not appear as standalone sections — their data folds into the merged card

### Merged result card layout
- Copy button is the most prominent element — at the top of the result card
- Stats below the copy button (layers, assets, tokens, etc.)
- Component badges (Button x3, Card x2) stay in the merged card
- Tree preview toggle stays in the merged card as a collapsible section
- Asset warnings displayed within the card (existing pattern, just relocated)
- Token warning banner stays when brief exceeds threshold

### Composition display
- Composition detection results appear in the merged result card (not before extraction)
- Claude's discretion on whether to use an inline stat or a highlighted callout

### Progress experience
- Claude's discretion on best progress pattern during the combined extraction+export+brief process
- Current approach: 3 separate spinners. Could become a single updating message or step indicator.

### Claude's Discretion
- Progress indicator design (single spinner with updating text vs. step indicator vs. other)
- Composition result presentation style (inline stat vs. callout)
- Exact layout and spacing of the merged result card
- Whether to keep the "Also saved to .shipstudio/brief.md" note

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `MainView.tsx` (739 lines): Main view with URL input, extraction, export, and brief display — this is the primary file to refactor
- `Modal.tsx`: Modal component wrapping the plugin UI
- `collectStats()`: Extracts ExtractionStats from layout nodes — reusable for merged card
- `TreePreview`: Existing component for collapsible tree view — relocate into merged card
- CSS classes: `figma-plugin-section`, `figma-plugin-file-info`, `figma-plugin-warning`, `btn-primary` — established styling patterns

### Established Patterns
- State management: useState hooks for each phase (extracting, exportingAssets, generatingBrief) with corresponding result/error states
- Progress: Spinner element + text message pattern (`<span className="figma-plugin-spinner" />`)
- Toast notifications via `actions.showToast()` for success/error feedback
- Deferred execution: `setTimeout(0)` for brief generation to allow spinner paint
- Asset progress callback: `onProgress: setAssetProgress` pattern

### Integration Points
- `MainView.tsx` is the sole file managing the extraction → export → brief pipeline
- `exportAssets()` triggers `generateBrief()` internally via callback chain
- Brief result contains `stats.nodeCount`, `stats.assetCount`, `stats.estimatedTokens`
- Export result contains `assets[]`, `warnings[]`, `previewPath`
- Composition detection results flow through `exportAssets` → `ExportResult.warnings`

</code_context>

<specifics>
## Specific Ideas

- The merged result card should feel like a "brief is ready" confirmation — copy button as primary action, stats as supporting info
- Component badges are valued for quick visual identification of what's in the design

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-ux-flow-simplification*
*Context gathered: 2026-02-28*
