# Phase 25: Pipeline Integration & Zero-Asset Warning - Research

**Researched:** 2026-03-01
**Domain:** React UI pipeline orchestration, Figma plugin UX patterns
**Confidence:** HIGH

## Summary

Phase 25 wires the `detectAssets()` pure function (built in Phase 24) into the existing extraction/export pipeline in `MainView.tsx`, and adds a blocking zero-asset warning when no `@S-` layers are found. The core challenge is architectural: inserting detection between `extractLayout()` and `exportAssets()`, mapping `DetectedAsset[]` to the `ManualAsset[]` shape that `exportAssets()` already consumes, and adding a new blocking UI state (similar to the existing large-tree warning) for the zero-asset case.

All code involved is internal to this plugin -- there are no new external dependencies. The existing codebase has well-established patterns for blocking warnings (`awaitingLargeTreeConfirm` + `largeTreeWarning` state), pipeline orchestration (`handleExtract` -> `runAssetExport`), and type-safe asset handling. The research below documents these patterns precisely so the planner can create tasks that slot into the existing architecture without friction.

**Primary recommendation:** Model the zero-asset warning on the existing large-tree warning pattern (state variables + blocking card + action handlers), and create a thin `detectedToManual()` adapter function to bridge `DetectedAsset[]` into the `ManualAsset[]` format that `exportAssets()` already accepts.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Detection runs immediately after `extractLayout()` returns raw Figma nodes, before export begins
- If zero `@S-` assets detected, pause the pipeline and show a blocking warning
- Warning blocks export/brief generation until user decides (Continue or Try Again)
- Reuse the existing `figma-plugin-warning` card style (same as large-tree warning)
- Full-width blocking card with explanation text and two action buttons
- "Try again" is the primary button (green, `btn-primary`) to nudge designers toward fixing their file
- "Continue anyway" is secondary (gray, `btn-secondary`)
- Short guide with example: 2-3 lines explaining the convention, a naming example, and PNG vs SVG auto-detection note
- "Try again" does full re-extraction: calls `extractLayout()` again from scratch, re-fetches from Figma API
- Reuses the existing "Extracting layout..." spinner in the main button area during re-fetch
- If retry still finds zero assets, show same warning with extra hint: "Still no @S- layers found. Check your layer names in Figma."
- When Try Again finds assets, auto-continue the pipeline (export + brief generation) -- no extra confirmation
- Silent pipeline: detection runs invisibly when assets ARE found
- No separate "Detecting assets..." progress step
- Asset count appears in the existing stats line: "42 layers * 3 assets * ~8K tokens"
- Detection warnings merge into existing warnings section in result card
- Zero-asset brief: normal result card with "0 assets" in stats, subtle info line about placeholders
- Preview PNG always exported regardless of asset count
- Brief mode selector always visible regardless of asset count
- AssetListPanel stays visible in Phase 25 -- removal is Phase 26
- Detected assets take priority; manual assets still work as fallback
- Both detected + manual assets feed into `exportAssets()` together

### Claude's Discretion
- How to expose raw Figma nodes from extractLayout to detectAssets (architecture detail)
- How DetectedAsset[] maps to the exportAssets() ManualAsset[] input format
- Error handling when detection throws unexpectedly
- Exact warning card copy/wording within the constraints above

### Deferred Ideas (OUT OF SCOPE)
- None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| WARN-01 | Plugin shows a warning when no `@S-` layers are found | Zero-asset warning pattern (blocking card with state management, modeled on large-tree warning) |
| WARN-02 | Warning explains the `@S-` naming convention for designers | Warning card content: 2-3 line guide with example and PNG/SVG auto-detection note |
| WARN-03 | User can "Continue anyway" to proceed without assets | `handleContinueWithoutAssets` handler that proceeds to `runAssetExport` with empty detected assets |
| WARN-04 | User can "Try again" which re-fetches from the Figma API | `handleRetryDetection` handler that calls `extractLayout()` again from scratch with full API re-fetch |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | (existing) | UI rendering | Already used throughout MainView |
| TypeScript | (existing) | Type safety | Already used project-wide |
| Vitest | latest | Testing | Already configured, used for all test files |

### Supporting
No new libraries needed. All functionality builds on existing modules:

| Module | Path | Purpose |
|--------|------|---------|
| `detectAssets()` | `src/assets/detect.ts` | Pure tree scanner from Phase 24 |
| `exportAssets()` | `src/assets/export.ts` | Asset render + download pipeline |
| `extractLayout()` | `src/layout/extract.ts` | Figma API fetch + normalization |
| `generateBrief()` | `src/brief/generate.ts` | Brief assembly |

### Alternatives Considered
None -- this phase is pure integration of existing components with no new dependencies.

## Architecture Patterns

### Recommended Changes

```
src/
├── assets/
│   ├── detect.ts         # Phase 24 (unchanged)
│   ├── export.ts         # MODIFY: accept DetectedAsset[] alongside ManualAsset[]
│   ├── types.ts          # Unchanged (DetectedAsset already defined)
│   └── adapt.ts          # NEW: detectedToManual() adapter function
├── layout/
│   └── extract.ts        # MODIFY: expose rawRootNodes on ExtractLayoutResult
└── views/
    └── MainView.tsx       # MODIFY: pipeline integration + zero-asset warning UI
```

### Pattern 1: Expose Raw Figma Nodes from extractLayout

**What:** `extractLayout()` already has `rootNodes` (raw Figma API nodes, line 54-79) before passing them through `normalizeTree()`. The `ExtractLayoutResult` interface needs a new field to expose these raw nodes.

**Why:** `detectAssets()` needs the raw Figma tree (with fills, children inside INSTANCE subtrees, etc.) -- not the normalized `LayoutNode[]` which strips INSTANCE children and raw fill data. The raw nodes are already in memory; they just need to be threaded through.

**Implementation:**
```typescript
// In src/layout/extract.ts - ExtractLayoutResult interface
export interface ExtractLayoutResult {
  extraction: ExtractionResult;
  tokens: DesignTokens;
  fileKey: string;
  largeTreeWarning?: { nodeCount: number; message: string };
  /** Raw Figma API nodes (pre-normalization) for asset detection. */
  rawRootNodes: any[];
}

// In the extractLayout function body (line ~109):
return { extraction, tokens, fileKey, largeTreeWarning, rawRootNodes: rootNodes };
```

**Confidence:** HIGH -- `rootNodes` is already a local variable (line 54); this is a one-line addition to the return object plus a type field.

### Pattern 2: DetectedAsset-to-ManualAsset Adapter

**What:** The `exportAssets()` function accepts `ManualAsset[]`. Rather than refactoring `exportAssets()` to accept a union type, create a thin adapter that maps `DetectedAsset[]` to `ManualAsset[]`.

**Why:** `ManualAsset` and `DetectedAsset` share `nodeId`, `nodeName`, `filename`, and `format`. The only difference is `ManualAsset` has `status`, `error`, and `warning` fields (lifecycle state) while `DetectedAsset` has `depth` and `parentPath` (position metadata). The adapter fills in `status: 'valid'` and drops position metadata.

**Implementation:**
```typescript
// src/assets/adapt.ts (new file)
import type { DetectedAsset, ManualAsset } from './types';

/**
 * Convert detected assets to the ManualAsset format consumed by exportAssets().
 * Position metadata (depth, parentPath) is dropped; lifecycle status is set to 'valid'.
 */
export function detectedToManual(detected: DetectedAsset[]): ManualAsset[] {
  return detected.map(d => ({
    nodeId: d.nodeId,
    nodeName: d.nodeName,
    filename: d.filename,
    format: d.format,
    status: 'valid' as const,
  }));
}
```

**Confidence:** HIGH -- straightforward field mapping between two types already defined in types.ts.

### Pattern 3: Zero-Asset Warning (Modeled on Large-Tree Warning)

**What:** A blocking UI state that pauses the pipeline when `detectAssets()` returns zero assets.

**Why:** The large-tree warning pattern in MainView (lines 132-133, 450-465, 602-617) is the exact precedent: extraction pauses, user sees a card with two buttons, and the pipeline resumes based on user choice.

**Implementation pattern (state):**
```typescript
// New state in MainView
const [zeroAssetWarning, setZeroAssetWarning] = useState(false);
const [retryCount, setRetryCount] = useState(0);
```

**Implementation pattern (detection insertion in handleExtract):**
```typescript
// After extractLayout() succeeds and large-tree check passes:
// 1. Run detection on raw nodes
const detection = detectAssets(result.rawRootNodes[0] ?? { children: result.rawRootNodes });

// 2. If zero assets detected, show warning
if (detection.assets.length === 0) {
  pendingResultRef.current = result;
  // Store detection warnings for later merge
  setZeroAssetWarning(true);
  setExtracting(false);
  return;
}

// 3. Assets found -- silently continue
// Merge detected + manual assets and proceed to export
runAssetExport(result, detection);
```

**Warning card JSX pattern:**
```tsx
{zeroAssetWarning && (
  <div className="figma-plugin-section">
    <div className="figma-plugin-warning">
      <strong>No @S- asset layers found</strong>
      <p>
        Prefix layer names with <code>@S-</code> to mark them as assets.
        Example: <code>@S-hero-image</code> exports as <code>hero-image.png</code>.
        PNG or SVG is auto-detected from layer content.
      </p>
      {retryCount > 0 && (
        <p style={{ fontStyle: 'italic' }}>
          Still no @S- layers found. Check your layer names in Figma.
        </p>
      )}
      <div className="figma-plugin-warning-actions">
        <button className="btn-primary" onClick={handleRetryDetection}>
          Try again
        </button>
        <button className="btn-secondary" onClick={handleContinueWithoutAssets}>
          Continue anyway
        </button>
      </div>
    </div>
  </div>
)}
```

**Confidence:** HIGH -- directly mirrors the existing large-tree warning pattern already in MainView.

### Pattern 4: Try Again (Full Re-extraction)

**What:** "Try again" calls `extractLayout()` from scratch, not just re-scanning in-memory data.

**Why:** The designer may have fixed layer names in Figma between clicks. The Figma API must be re-queried to pick up changes.

**Implementation pattern:**
```typescript
const handleRetryDetection = useCallback(() => {
  setZeroAssetWarning(false);
  setRetryCount(prev => prev + 1);
  pendingResultRef.current = null;
  // Re-trigger the full extraction pipeline
  handleExtract();
}, [handleExtract]);
```

**Key detail:** `handleExtract` already sets `setExtracting(true)` and shows the spinner. The "Extracting layout..." label auto-appears during re-fetch.

**Confidence:** HIGH -- reuses the existing `handleExtract` function wholesale.

### Pattern 5: Merge Detected + Manual Assets

**What:** Both detected assets and any remaining manual assets flow into `exportAssets()`.

**Why:** AssetListPanel stays in Phase 25. A user might have both @S- detected assets AND manually-added ones.

**Implementation:**
```typescript
// In the modified runAssetExport:
const detectedAsManual = detectedToManual(detection.assets);
// Detected assets first (priority), then manual assets
const allAssets = [...detectedAsManual, ...manualAssets];

// Pass combined list to exportAssets
const exportRes = await exportAssets({
  ...options,
  manualAssets: allAssets,
});
```

**Confidence:** HIGH -- `exportAssets` already filters to `status === 'valid'` assets, and the adapter sets status to 'valid'.

### Pattern 6: Detection on Multiple Root Nodes

**What:** `detectAssets()` accepts a single `rootNode`, but `extractLayout()` may return multiple `rawRootNodes` (page scope returns all top-level frames).

**Why:** Need to scan ALL raw nodes, not just the first one.

**Implementation:**
```typescript
// Wrap multiple roots in a synthetic parent node for detection
const syntheticRoot = result.rawRootNodes.length === 1
  ? result.rawRootNodes[0]
  : { name: '__root__', children: result.rawRootNodes, visible: true };
const detection = detectAssets(syntheticRoot);
```

**Confidence:** HIGH -- `detectAssets` recurses into `node.children`; a synthetic wrapper with `visible: true` and a `children` array works because the walker uses duck typing (any-typed node parameter).

### Anti-Patterns to Avoid
- **Modifying `exportAssets()` signature to accept DetectedAsset[]:** Use the adapter pattern instead. Keeps `exportAssets()` stable for Phase 26 cleanup.
- **Running detection on normalized LayoutNode[]:** Would miss INSTANCE subtrees (they're collapsed to leaf nodes) and raw fill data. Must use pre-normalization raw nodes.
- **Showing a detection progress step:** Detection is synchronous and instant (pure in-memory tree walk). Adding a progress step would flash briefly and feel janky.
- **Storing detection result in React state unnecessarily:** Detection result only needs to flow through the pipeline once. Pass it as a parameter to `runAssetExport()`, don't persist in state.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Asset tree scanning | Custom walker in MainView | `detectAssets()` from Phase 24 | Already tested, handles edge cases (nesting, hidden nodes, dedup) |
| Warning card styling | Custom CSS | `figma-plugin-warning` class | Existing style with amber border, action buttons layout |
| Filename sanitization | Manual string cleaning | `sanitizeFilename()` + `resolveFilenameCollision()` | Already handles all edge cases |
| Asset export orchestration | Direct Figma API calls | `exportAssets()` | Already handles preview, batching, error recovery |
| Re-fetch from Figma | Manual API calls | `handleExtract()` (existing) | Already handles stale request IDs, error states, spinner |

## Common Pitfalls

### Pitfall 1: Raw Nodes vs Normalized Nodes Confusion
**What goes wrong:** Running `detectAssets()` on `extraction.rootNodes` (normalized `LayoutNode[]`) instead of the raw Figma API nodes.
**Why it happens:** `ExtractLayoutResult.extraction.rootNodes` looks like the obvious choice. But normalized nodes have INSTANCE children stripped and fills data restructured.
**How to avoid:** Always pass `result.rawRootNodes` to `detectAssets()`. The `rawRootNodes` field is the raw `any[]` from the Figma API response.
**Warning signs:** Detection finds zero assets even when @S- layers exist; TypeScript allows it because `detectAssets` accepts `any`.

### Pitfall 2: Node ID Encoding Mismatch
**What goes wrong:** Detected asset node IDs don't match when passed to `fetchImages()` for rendering.
**Why it happens:** Figma node IDs contain colons (e.g., "12:34"). The Figma Images API may return URL-encoded keys ("12%3A34").
**How to avoid:** The existing `lookupUrl()` helper in `export.ts` (line 40-42) already tries three key variants (raw, encoded, decoded). This pattern is already in place; just ensure detected node IDs flow through unchanged (no double-encoding).
**Warning signs:** Assets render as null URLs despite valid node IDs.

### Pitfall 3: Detection Result Not Flowing Through Large-Tree Warning Path
**What goes wrong:** When the large-tree warning fires, detection doesn't run, and the user gets no zero-asset warning after confirming.
**Why it happens:** Detection needs to run AFTER the user confirms the large-tree warning, not before. The `handleConfirmLargeTree` handler (line 450-465) must also run detection before proceeding to export.
**How to avoid:** Insert detection in BOTH code paths: (1) direct extraction without large-tree warning, and (2) after large-tree confirmation. Best approach: create a shared `runDetectionAndExport(result)` function called from both paths.
**Warning signs:** Zero-asset warning never appears for large trees.

### Pitfall 4: Re-extraction Stale Request ID
**What goes wrong:** "Try again" triggers `handleExtract()` but the stale request ID check discards the result.
**Why it happens:** `extractRequestIdRef` increments on each `handleExtract` call. If the previous extraction's promise is still in flight (unlikely but possible), the new one's ID check works correctly. More likely issue: not clearing `zeroAssetWarning` state before re-extracting.
**How to avoid:** Clear `zeroAssetWarning` and `pendingResultRef` at the top of `handleExtract` (alongside the existing state clears on line 382-396).
**Warning signs:** "Try again" appears to do nothing; spinner shows but result never appears.

### Pitfall 5: assetType Mapping for DetectedAsset
**What goes wrong:** `ExportResult.assets[].assetType` is always undefined for detected assets, breaking the brief's "Icon"/"Image" type column.
**Why it happens:** `exportAssets()` currently maps `format === 'svg'` to `assetType: 'icon'` (line 136) from the ManualAsset. But when detection provides the asset, the mapping logic in `exportAssets` needs the format info, which IS available via `ManualAsset.format` on the adapted asset.
**How to avoid:** Verify that `exportAssets` lines 132-137 correctly read the `format` from the adapted ManualAsset and set `assetType` accordingly. Since the adapter sets `format` from `DetectedAsset.format`, this should work automatically.
**Warning signs:** Brief assets table shows "File" instead of "Icon" or "Image".

### Pitfall 6: Detection Warnings Swallowed
**What goes wrong:** Detection warnings (e.g., "Skipped layer '@S-': empty name after prefix") never appear in the UI.
**Why it happens:** `detectAssets()` returns warnings in `DetectionResult.warnings`, but these aren't merged into `ExportResult.warnings` which the UI renders.
**How to avoid:** Merge detection warnings into the export warnings array, or store them separately and render both in the result card warnings section.
**Warning signs:** User prefixes a layer with just "@S-" (no name), gets silently skipped with no feedback.

## Code Examples

### Example 1: ExtractLayoutResult with rawRootNodes
```typescript
// src/layout/extract.ts (modified interface)
export interface ExtractLayoutResult {
  extraction: ExtractionResult;
  tokens: DesignTokens;
  fileKey: string;
  largeTreeWarning?: { nodeCount: number; message: string };
  /** Raw Figma API root nodes before normalization, for asset detection. */
  rawRootNodes: any[];
}

// In extractLayout() return statement:
return { extraction, tokens, fileKey, largeTreeWarning, rawRootNodes: rootNodes };
```

### Example 2: DetectedAsset-to-ManualAsset Adapter
```typescript
// src/assets/adapt.ts (new file)
import type { DetectedAsset, ManualAsset } from './types';

export function detectedToManual(detected: DetectedAsset[]): ManualAsset[] {
  return detected.map(d => ({
    nodeId: d.nodeId,
    nodeName: d.nodeName,
    filename: d.filename,
    format: d.format,
    status: 'valid' as const,
  }));
}
```

### Example 3: Detection Integration in Pipeline
```typescript
// In MainView, shared function for both normal and large-tree-confirmed paths
const runDetectionAndExport = useCallback(async (result: ExtractLayoutResult) => {
  // Run detection on raw nodes
  const syntheticRoot = result.rawRootNodes.length === 1
    ? result.rawRootNodes[0]
    : { name: '__root__', children: result.rawRootNodes, visible: true };
  const detection = detectAssets(syntheticRoot);

  // Store detection for later use
  detectionResultRef.current = detection;

  if (detection.assets.length === 0) {
    // Zero assets -- show blocking warning
    pendingResultRef.current = result;
    setZeroAssetWarning(true);
    setExtracting(false);
    return;
  }

  // Assets found -- silently continue to export
  setExtractionResult(result.extraction);
  runAssetExport(result, detection);
}, [runAssetExport]);
```

### Example 4: Modified runAssetExport to Accept Detection
```typescript
// Signature change:
const runAssetExport = useCallback(async (
  result: ExtractLayoutResult,
  detection?: DetectionResult,
) => {
  // ... existing setup ...

  // Merge detected + manual assets
  const detectedAsManual = detection ? detectedToManual(detection.assets) : [];
  const allAssets = [...detectedAsManual, ...manualAssets];

  const exportRes = await exportAssets({
    shell: shellRef.current,
    token,
    fileKey: result.fileKey,
    selectedNodeId: parsedUrl.nodeId || result.extraction.rootNodes[0]?.id || '0:0',
    projectPath: ctx?.project?.path ?? '.',
    manualAssets: allAssets,
    onProgress: setAssetProgress,
  });

  // Merge detection warnings into export warnings
  if (detection?.warnings.length) {
    exportRes.warnings.push(...detection.warnings);
  }

  // ... rest of existing brief generation logic ...
}, [/* deps */]);
```

### Example 5: Zero-Asset Warning Card
```tsx
{zeroAssetWarning && (
  <div className="figma-plugin-section">
    <div className="figma-plugin-warning">
      <strong>No @S- asset layers found</strong>
      <p>
        Prefix layer names with <code>@S-</code> to mark them for export.{' '}
        Example: <code>@S-hero-image</code> becomes <code>hero-image.png</code>.{' '}
        PNG or SVG format is auto-detected from layer content.
      </p>
      {retryCount > 0 && (
        <p style={{ fontStyle: 'italic', marginTop: '4px' }}>
          Still no @S- layers found. Check your layer names in Figma.
        </p>
      )}
      <div className="figma-plugin-warning-actions">
        <button className="btn-primary" onClick={handleRetryDetection}>
          Try again
        </button>
        <button className="btn-secondary" onClick={handleContinueWithoutAssets}>
          Continue anyway
        </button>
      </div>
    </div>
  </div>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual asset URLs | @S- prefix detection | Phase 24 (v2.2) | Designers mark assets in Figma, no copy-pasting URLs |
| manualAssets-only pipeline | detected + manual merged | Phase 25 (this phase) | Both sources feed into same export pipeline |

**Deprecated/outdated:**
- Manual-only asset workflow: Still works as fallback in Phase 25, removed in Phase 26

## Open Questions

1. **Detection result storage for brief generator**
   - What we know: `generateBrief()` receives `exportResult` which contains downloaded assets. Detection warnings need to flow through. The current `exportResult.assets` already includes `nodeId` and `assetType`.
   - What's unclear: Whether detection warnings should be stored in a ref for the brief result card, or merged into `exportResult.warnings` before brief generation.
   - Recommendation: Merge into `exportResult.warnings` before brief generation. This is the simplest approach and the result card already renders `exportResult.warnings`. The planner should specify this in the task.

2. **Zero-asset brief info line**
   - What we know: User wants a subtle info line: "No assets exported -- Claude Code will create placeholders for visual elements"
   - What's unclear: Whether this line should be in the MainView result card (React) or in the markdown brief itself.
   - Recommendation: In the React result card only (UI feedback). The brief's Placeholders section already instructs Claude Code to handle missing assets. Adding a duplicate instruction in the brief would be redundant.

## Sources

### Primary (HIGH confidence)
- `src/views/MainView.tsx` -- Pipeline flow, large-tree warning pattern, state management
- `src/assets/detect.ts` -- detectAssets() API, DetectionResult type
- `src/assets/export.ts` -- exportAssets() API, ManualAsset consumption
- `src/assets/types.ts` -- DetectedAsset, ManualAsset, ExportResult interfaces
- `src/layout/extract.ts` -- ExtractLayoutResult type, rawRootNodes availability
- `src/styles.ts` -- figma-plugin-warning CSS class definition
- `src/brief/generate.ts` -- Brief assembly, assetNodeMap construction

### Secondary (MEDIUM confidence)
- `.planning/phases/24-detection-foundation/24-01-SUMMARY.md` -- Phase 24 completion details

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all existing modules
- Architecture: HIGH -- patterns directly mirror existing large-tree warning + ManualAsset pipeline
- Pitfalls: HIGH -- identified from reading actual source code, not hypothetical
- Type mapping: HIGH -- both DetectedAsset and ManualAsset types are fully defined and inspected

**Research date:** 2026-03-01
**Valid until:** indefinite (internal codebase patterns, no external dependency drift)
