# Phase 25: Pipeline Integration & Zero-Asset Warning - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the `detectAssets()` output from Phase 24 into the existing extraction/export pipeline and add a blocking warning when no `@S-` prefixed layers are found. Detection replaces manual asset URLs as the primary asset source, but the manual asset panel (AssetListPanel) stays until Phase 26 removes it.

</domain>

<decisions>
## Implementation Decisions

### Warning timing
- Detection runs immediately after `extractLayout()` returns raw Figma nodes, before export begins
- If zero `@S-` assets detected, pause the pipeline and show a blocking warning
- Warning blocks export/brief generation until user decides (Continue or Try Again)

### Warning visual treatment
- Reuse the existing `figma-plugin-warning` card style (same as large-tree warning)
- Full-width blocking card with explanation text and two action buttons
- "Try again" is the primary button (green, `btn-primary`) to nudge designers toward fixing their file
- "Continue anyway" is secondary (gray, `btn-secondary`)

### @S- convention explanation
- Short guide with example: 2-3 lines explaining the convention, a naming example, and PNG vs SVG auto-detection note
- Compact enough to fit in the warning card without overwhelming

### "Try again" behavior
- Full re-extraction: calls `extractLayout()` again from scratch, re-fetches from Figma API
- Designer fixes their file in Figma, hits Try Again to pick up changes
- Reuses the existing "Extracting layout..." spinner in the main button area during re-fetch
- If retry still finds zero assets, show same warning with extra hint: "Still no @S- layers found. Check your layer names in Figma."

### Successful retry flow
- When Try Again finds assets, auto-continue the pipeline (export + brief generation)
- No extra confirmation step needed since user already clicked the main button

### Asset detection feedback
- Silent pipeline: detection runs invisibly when assets ARE found
- No separate "Detecting assets..." progress step (detection is instant, pure in-memory)
- Asset count appears in the existing stats line: "42 layers · 3 assets · ~8K tokens"
- Detection warnings (e.g., skipped empty @S- prefix layers) merge into the existing warnings section in the result card

### Zero-asset brief
- Normal result card with "0 assets" in stats line
- Subtle info line: "No assets exported — Claude Code will create placeholders for visual elements"
- Preview PNG always exported regardless of asset count
- Brief mode selector (Best/Pixel/Inspiration) always visible regardless of asset count

### Manual asset panel coexistence
- AssetListPanel stays visible in Phase 25 — removal is Phase 26's scope
- Detected assets take priority in the pipeline; manual assets still work as fallback
- Both detected + manual assets feed into `exportAssets()` together

### Claude's Discretion
- How to expose raw Figma nodes from extractLayout to detectAssets (architecture detail)
- How DetectedAsset[] maps to the exportAssets() ManualAsset[] input format
- Error handling when detection throws unexpectedly
- Exact warning card copy/wording within the constraints above

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `detectAssets()` (src/assets/detect.ts): Pure function, takes raw Figma node, returns `DetectionResult { assets, warnings }`
- `figma-plugin-warning` CSS class: Existing warning card style used by large-tree warning in MainView
- `exportAssets()` (src/assets/export.ts): Takes `ManualAsset[]`, partitions by format, batch-fetches render URLs
- `extractLayout()` (src/layout/extract.ts): Already has raw `rootNodes` (line 54-79) before normalization

### Established Patterns
- Pipeline flow in MainView: `handleExtract` → `extractLayout()` → `runAssetExport()` → `generateBrief()`
- Large-tree warning pattern: extraction returns `largeTreeWarning`, MainView shows blocking card with Confirm/Cancel
- Progress reporting: `onProgress` callback with `{ current, total, currentAsset, phase }` shape
- State management: useState hooks for each pipeline stage, request ID refs for stale response handling

### Integration Points
- `extractLayout()` return type (`ExtractLayoutResult`) needs to include raw nodes for detection
- `MainView.handleExtract` (line 376-448): insert detection call between extraction and asset export
- `exportAssets()` input: `manualAssets` param accepts `ManualAsset[]` — detected assets need mapping to this type or a parallel input

</code_context>

<specifics>
## Specific Ideas

- Warning card should feel like the existing large-tree warning — same visual language, same blocking pattern
- "Try again" nudge mirrors the UX philosophy from Phase 8: guide the designer toward the right action

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 25-pipeline-integration-zero-asset-warning*
*Context gathered: 2026-03-01*
