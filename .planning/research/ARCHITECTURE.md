# Architecture Patterns

**Domain:** Figma plugin -- @S- prefix asset detection and results UX redesign (v2.2)
**Researched:** 2026-03-01
**Confidence:** HIGH (analysis based on direct codebase inspection, not external sources)

## Current Architecture (v2.1 Baseline)

The plugin follows a clean layered architecture with clear data flow:

```
URL Input (MainView)
  |
  v
Figma API (figma-api.ts) --- shell.exec('curl')
  |
  v
Layout Extraction (layout/extract.ts -> normalize.ts)
  |
  v
Asset Export (assets/export.ts -> download.ts)
  |                |
  |   Manual Assets (from AssetListPanel state)
  |                |
  v                v
Brief Generation (brief/generate.ts) --- pure function
  |
  v
Result Display (inline in MainView) + Clipboard Copy
```

### Current Component Map

| File | Responsibility | State Owned |
|------|---------------|-------------|
| `MainView.tsx` | Orchestrates entire flow, holds all state | URL, extraction, assets, brief, mode |
| `AssetListPanel.tsx` | URL-based manual asset addition UI | Input field, edit state |
| `Modal.tsx` | Reusable overlay shell (escape-to-close, overlay click) | None (controlled) |
| `assets/export.ts` | Orchestrates preview + manual asset download | None |
| `assets/resolve.ts` | Derives ManualAsset from Figma node metadata via API | None |
| `assets/download.ts` | Filesystem lifecycle + curl download with retry | None |
| `assets/sanitize.ts` | Filename cleaning + collision resolution | None |
| `assets/breadcrumb.ts` | Node ID -> breadcrumb path map for brief | None |
| `brief/generate.ts` | Pure markdown assembly (8 sections) | None |
| `brief/types.ts` | BriefInput, BriefResult, BriefStats types | None |
| `layout/extract.ts` | API fetch + normalization orchestrator | None |
| `layout/normalize.ts` | Figma node -> LayoutNode tree | None |
| `figma-api.ts` | Typed curl wrappers for all Figma endpoints | None |

### Current Manual Asset Data Flow (v2.0/v2.1)

1. User pastes asset URL into `AssetListPanel`
2. Panel validates URL (same-file, node-id presence, no duplicate, no I-prefix)
3. Optimistic `ManualAsset` with `status: 'resolving'` added to MainView state
4. `resolveNode()` fetches node metadata via Figma API, derives filename + format
5. Resolved asset replaces placeholder in state
6. On "Get Brief" click: `extractLayout()` -> `exportAssets()` -> `generateBrief()`
7. `exportAssets()` receives `manualAssets` array, partitions by format, batch-fetches render URLs, downloads each
8. `generateBrief()` receives `ExportResult`, builds markdown with asset cross-references

**Key observation:** The manual asset pipeline is entirely UI-driven. Users paste URLs one at a time into AssetListPanel. The plugin has zero automatic node-tree walking for asset detection -- all auto-detection was removed in v2.0.

### Current MainView State Shape

MainView holds ~15 state variables spanning the full pipeline:

- URL/validation: `urlInput`, `parsedUrl`, `fileInfo`, `validating`, `error`
- Extraction: `extracting`, `extractionResult`, `largeTreeWarning`, `awaitingLargeTreeConfirm`, `showTree`
- Manual assets: `manualAssets` (ManualAsset[])
- Export: `exportingAssets`, `assetProgress`, `exportResult`
- Brief: `generatingBrief`, `briefResult`, `briefError`
- Mode: `briefMode`, `inspirationText`

The extraction -> export -> brief pipeline runs as a single sequence triggered by "Get Brief". The manual asset list is consumed by `exportAssets()` via closure over `manualAssets`.

## Recommended Architecture for v2.2

### High-Level Change

Replace the user-driven asset addition loop (AssetListPanel + resolveNode per URL) with a single automatic tree-walk that finds `@S-` prefixed layers in the already-fetched Figma node tree. Replace the inline results card with a modal.

```
URL Input (MainView)
  |
  v
Figma API (extract.ts)
  |
  v
Layout Extraction (normalize.ts)
  |
  +---> @S- Detection (NEW: detect.ts) -- runs on raw tree
  |         |
  |         v
  |     DetectedAsset[] --- format auto-derived from fills
  |         |
  |    [if empty] ---> Zero-Asset Warning (inline MainView state)
  |         |                  |
  |    [if assets]      "Try again" = re-run handleExtract()
  |         |           "Continue" = proceed with 0 assets
  |         v
  v         v
Asset Export (export.ts -- adapted to accept DetectedAsset[])
  |
  v
Brief Generation (generate.ts -- unchanged)
  |
  v
Results Modal (NEW: ResultsModal.tsx, replaces inline card)
```

### Component Boundaries

| Component | Responsibility | Status | Communicates With |
|-----------|---------------|--------|-------------------|
| `assets/detect.ts` | Walk raw Figma tree, find @S- nodes, derive format | **NEW** | Called by MainView after extraction |
| `assets/detect.test.ts` | Tests for detection logic | **NEW** | -- |
| `components/ResultsModal.tsx` | "Brief is done" modal with expandable details | **NEW** | MainView (controlled), Modal shell |
| `MainView.tsx` | Orchestrator: removes manual asset state, adds detection step | **MODIFIED** | detect.ts, export.ts, ResultsModal |
| `layout/extract.ts` | Add `rawRootNodes` to return type | **MODIFIED** (3 lines) | MainView |
| `assets/export.ts` | Accept DetectedAsset[] instead of ManualAsset[] | **MODIFIED** (~10 lines) | download.ts, figma-api.ts |
| `assets/types.ts` | Add DetectedAsset interface | **MODIFIED** (~8 lines) | detect, export, ResultsModal |
| `styles.ts` | Add ResultsModal CSS classes | **MODIFIED** (~40 lines) | ResultsModal |
| `AssetListPanel.tsx` | Entire manual URL workflow | **DELETE** | -- |
| `assets/resolve.ts` | Per-URL node resolution | **DELETE** | -- |
| `assets/resolve.test.ts` | Tests for deleted module | **DELETE** | -- |

### Data Flow

#### Step 1: Extraction returns raw tree

The `@S-` detection must run on the **raw Figma API response**, not the normalized LayoutNode tree. The normalized tree is unsuitable because:

- INSTANCE nodes become leaf nodes (children stripped) -- an `@S-` layer inside an instance would be invisible
- SLICE nodes are filtered out
- Repeated instances are deduplicated

The raw tree is already available in `extractLayout()` as the `rootNodes` variable before `normalizeTree()` is called. Add `rawRootNodes: any[]` to `ExtractLayoutResult`:

```typescript
// In layout/extract.ts
export interface ExtractLayoutResult {
  extraction: ExtractionResult;
  tokens: DesignTokens;
  fileKey: string;
  rawRootNodes: any[];  // NEW -- raw Figma API nodes before normalization
  largeTreeWarning?: { nodeCount: number; message: string };
}
```

This keeps detection as a separate concern -- `extractLayout()` does not need to know about `@S-` prefixes.

#### Step 2: Detection walks raw tree

```typescript
// In MainView, after extractLayout() returns:
const detected = detectAssets(result.rawRootNodes);

if (detected.length === 0) {
  // Show zero-asset warning
  setZeroAssetWarning(true);
  pendingResultRef.current = result;
  return;
}

runAssetExport(result, detected);
```

#### Step 3: Export accepts DetectedAsset[]

`exportAssets()` currently takes `manualAssets: ManualAsset[]` and partitions by format. `DetectedAsset` has the same fields the pipeline needs: `nodeId`, `filename`, `format`. The change is minimal -- rename the parameter and update the type.

#### Step 4: Brief generation is unchanged

`generateBrief()` consumes `ExportResult` which has the same shape regardless of how assets were identified. No changes needed.

#### Step 5: Results shown in modal

Replace inline card (MainView lines 627-748) with `ResultsModal` component. Modal opens after brief generation succeeds.

## Patterns to Follow

### Pattern 1: Pure Tree Walker for @S- Detection

Same pattern as `normalizeNode()`, `collectTokens()`, `buildBreadcrumbMap()` -- all tree walkers in this codebase are pure, synchronous, and testable.

```typescript
// src/assets/detect.ts

import { sanitizeFilename } from './sanitize';
import { resolveFilenameCollision } from './resolve'; // or inline

const S_PREFIX = '@S-';

export interface DetectedAsset {
  nodeId: string;
  nodeName: string;       // Original name with @S- prefix
  filename: string;       // Prefix stripped + sanitized: "@S-hero" -> "hero.png"
  format: 'png' | 'svg';  // Auto-detected from fills
}

/**
 * Walk raw Figma node tree and collect all @S- prefixed nodes as assets.
 * Format auto-detected: PNG if any descendant has image fills, SVG otherwise.
 * Does NOT recurse into children of @S- nodes (the node is the export unit).
 */
export function detectAssets(rawNodes: any[]): DetectedAsset[] {
  const assets: DetectedAsset[] = [];
  const seenIds = new Set<string>();

  for (const node of rawNodes) {
    walkForAssets(node, assets, seenIds);
  }

  // Resolve filename collisions across all detected assets
  return deduplicateFilenames(assets);
}

function walkForAssets(
  node: any,
  assets: DetectedAsset[],
  seenIds: Set<string>,
): void {
  if (seenIds.has(node.id)) return;

  if (typeof node.name === 'string' && node.name.startsWith(S_PREFIX)) {
    seenIds.add(node.id);

    const rawName = node.name.slice(S_PREFIX.length);
    const format = hasImageFills(node) ? 'png' : 'svg';
    const baseName = sanitizeFilename(rawName);
    const filename = `${baseName}.${format}`;

    assets.push({
      nodeId: node.id,
      nodeName: node.name,
      filename,
      format,
    });

    // Do NOT recurse -- the @S- node itself is the export unit
    return;
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walkForAssets(child, assets, seenIds);
    }
  }
}

/**
 * Check if a node or any of its descendants has IMAGE type fills.
 * Used to auto-detect PNG vs SVG format.
 */
function hasImageFills(node: any): boolean {
  if (Array.isArray(node.fills)) {
    if (node.fills.some((f: any) => f.type === 'IMAGE')) return true;
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (hasImageFills(child)) return true;
    }
  }
  return false;
}
```

**Key design decisions:**

1. **Do NOT recurse into children of @S- nodes.** If a designer marks `@S-card`, they want the entire card as one asset, not its children individually.

2. **Image fill check IS recursive within the marked node.** A `@S-hero` group containing a child RECTANGLE with an image fill should export as PNG.

3. **Node ID dedup** prevents the same node appearing twice (possible with Figma's tree structure).

4. **Filename deduplication** uses the same `resolveFilenameCollision` pattern from the existing codebase, or a simpler inline version since all assets are known at once (no optimistic adds).

### Pattern 2: Zero-Asset Warning as State Machine Step

Mirrors the existing `awaitingLargeTreeConfirm` pattern -- same approach, same `pendingResultRef` usage:

```typescript
// In MainView:
const [zeroAssetWarning, setZeroAssetWarning] = useState(false);

// In extraction callback, after detection:
const detected = detectAssets(result.rawRootNodes);

if (detected.length === 0) {
  setZeroAssetWarning(true);
  pendingResultRef.current = result;
  return; // Don't proceed to export
}

runAssetExport(result, detected);
```

Two buttons:
- **"Continue anyway"**: Calls `runAssetExport(result, [])` with empty asset list
- **"Try again"**: Calls `handleExtract()` again (re-fetches from Figma API so designer can fix their file, add @S- prefixes, and come back)

### Pattern 3: Controlled Modal for Results

Replace the inline result card with a `ResultsModal` component that uses the existing `Modal` shell:

```typescript
// In MainView:
const [showResults, setShowResults] = useState(false);

// After brief generation succeeds:
setBriefResult(brief);
setShowResults(true);

// Render:
{showResults && briefResult && extractionResult && exportResult && (
  <ResultsModal
    open={showResults}
    onClose={() => setShowResults(false)}
    briefResult={briefResult}
    extractionResult={extractionResult}
    extractionStats={extractionStats}
    exportResult={exportResult}
    onCopyBrief={handleCopyBrief}
  />
)}
```

The `ResultsModal` internally composes `Modal` and renders:

```
ResultsModal
  +-- Modal shell (overlay, header, escape-to-close)
       +-- Success header ("Brief is ready")
       +-- Primary copy button
       +-- Next steps text (paste into agent, encourage refinement)
       +-- Potential mistakes warning
       +-- Stats row (layers, assets, tokens)
       +-- "View details" expandable toggle
            +-- Asset list table
            +-- Layout tree preview (TreePreview component)
            +-- Token summary counts
```

### Pattern 4: DetectedAsset Type (Not ManualAsset Reuse)

`ManualAsset` has lifecycle state (`status: 'resolving' | 'valid' | 'error'`, `warning`) designed for optimistic UI updates during async URL resolution. `DetectedAsset` is synchronously derived from data already in memory -- always valid, never resolving, never errored.

```typescript
// In assets/types.ts -- ADD:
export interface DetectedAsset {
  nodeId: string;
  nodeName: string;
  filename: string;
  format: 'png' | 'svg';
}
```

Clean, minimal, no dead fields.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Running Detection on Normalized Tree

**What:** Calling `detectAssets()` on `extractionResult.rootNodes` (the normalized LayoutNode tree).

**Why bad:** INSTANCE nodes are leaf nodes in the normalized tree -- their children are stripped. A designer naming a child of a component instance `@S-icon` would be invisible to detection. SLICE nodes are filtered. Repeated instances are deduplicated.

**Instead:** Pass `rawRootNodes` from `ExtractLayoutResult` to `detectAssets()`.

### Anti-Pattern 2: Making Detection Async

**What:** Having `detectAssets()` call the Figma API (e.g., to check node metadata).

**Why bad:** All the data is already in the fetched tree. The raw nodes include fills, children, types, and names. Zero additional API calls needed. Making it async adds complexity, latency, and error handling for no benefit.

**Instead:** Keep `detectAssets()` as a pure synchronous function, same as `normalizeTree()` and `collectTokens()`.

### Anti-Pattern 3: Keeping AssetListPanel Alongside @S- Detection

**What:** Supporting both manual URL-based asset addition AND @S- detection simultaneously.

**Why bad:** The v2.2 requirements explicitly state "Manual asset URL workflow removed entirely." Having both creates confusion about precedence, complicates the export pipeline, and clutters the UI.

**Instead:** Delete `AssetListPanel.tsx` and `assets/resolve.ts` entirely. The @S- convention replaces manual assets completely.

### Anti-Pattern 4: Reusing ManualAsset Type for Detected Assets

**What:** Using the existing `ManualAsset` type (with `status`, `error`, `warning` fields) for @S- detected assets.

**Why bad:** `ManualAsset` carries lifecycle state for async UI updates. Detected assets are synchronously derived -- they are always valid, never resolving, never errored. Dead fields confuse intent and waste bytes.

**Instead:** Define a clean `DetectedAsset` type with only the fields detection produces.

### Anti-Pattern 5: Running Detection Before Extraction

**What:** Adding a separate Figma API call just to check for @S- layers before the main extraction.

**Why bad:** Extraction already fetches the full node tree. Detection is a zero-cost walk over data already in memory. A separate API call doubles latency for no benefit.

**Instead:** Detection runs after extraction, on the raw tree that extraction already fetched.

## Integration Points: What Changes Where

### Files to CREATE

| File | Purpose | Estimated Size |
|------|---------|---------------|
| `src/assets/detect.ts` | @S- prefix tree walker + format detection | ~80 lines |
| `src/assets/detect.test.ts` | Tests for detection (edge cases, fills, nesting) | ~150 lines |
| `src/components/ResultsModal.tsx` | "Brief is done" modal with expandable details | ~180 lines |

### Files to MODIFY

| File | What Changes | Scope |
|------|-------------|-------|
| `src/layout/extract.ts` | Add `rawRootNodes: any[]` to `ExtractLayoutResult`, pass through in return | 3 lines |
| `src/assets/types.ts` | Add `DetectedAsset` interface | ~8 lines added |
| `src/assets/export.ts` | Rename `manualAssets` param to `detectedAssets`, update type from `ManualAsset` to `DetectedAsset`, remove `status` filter (always valid) | ~10 lines changed |
| `src/views/MainView.tsx` | Remove: all `manualAssets` state + 7 callbacks + AssetListPanel import. Add: `detectAssets()` call after extraction, `zeroAssetWarning` state, `detectedAssets` state, `showResults` state, ResultsModal rendering. Remove: inline result card (lines 627-748). | ~100 lines net reduction |
| `src/styles.ts` | Add CSS for ResultsModal details section, expandable toggle | ~40 lines added |

### Files to DELETE

| File | Reason |
|------|--------|
| `src/components/AssetListPanel.tsx` | Manual URL workflow replaced by @S- detection |
| `src/assets/resolve.ts` | Per-URL node resolution no longer needed |
| `src/assets/resolve.test.ts` | Tests for deleted module |

### Files UNCHANGED

| File | Why No Changes |
|------|---------------|
| `src/brief/generate.ts` | Consumes `ExportResult` -- already agnostic about asset source |
| `src/brief/types.ts` | `BriefInput` does not reference `ManualAsset` |
| `src/brief/io.ts` | Save/copy mechanics unchanged |
| `src/layout/normalize.ts` | Normalization is upstream of detection |
| `src/layout/types.ts` | LayoutNode shape unchanged |
| `src/assets/download.ts` | Downloads by URL -- agnostic about asset identification |
| `src/assets/sanitize.ts` | Still used for filename cleaning (by detect.ts) |
| `src/assets/breadcrumb.ts` | Still used for brief asset location |
| `src/figma-api.ts` | No new API endpoints needed |
| `src/tokens/collect.ts` | Token collection independent of assets |
| `src/context.ts` | No changes to plugin context |
| `src/url-parser.ts` | URL parsing unchanged |
| `src/components/Modal.tsx` | Reused as-is by ResultsModal |

## Suggested Build Order

Build order follows data flow (upstream first) and minimizes work-in-progress. Each phase is independently testable.

### Phase 1: Detection Foundation

**Build:** `assets/detect.ts` + `assets/detect.test.ts` + `DetectedAsset` type in `assets/types.ts`

**Rationale:** Pure function with zero dependencies on UI or pipeline changes. Can be fully tested in isolation with fixture node trees. This is the core new logic of v2.2.

**Why first:** Everything downstream depends on `DetectedAsset[]` existing and the detection logic being correct. Lock the type contract before UI work begins.

**Dependency:** None (only imports `sanitizeFilename` which already exists).

### Phase 2: Pipeline Integration

**Build:** Modify `layout/extract.ts` to return `rawRootNodes`. Modify `assets/export.ts` to accept `DetectedAsset[]` instead of `ManualAsset[]`.

**Rationale:** Adapter changes connecting Phase 1's output to the existing pipeline. Minimal code (~15 lines total). Can be tested by running the full pipeline with mock detected assets.

**Why second:** These are the plumbing changes that wire detection output into export. Must work before MainView can exercise the new flow.

**Dependency:** Phase 1 (DetectedAsset type).

### Phase 3: MainView Rewiring + Zero-Asset Warning + Cleanup

**Build:** Modify `MainView.tsx` to:
- Remove all `manualAssets` state and 7 associated callbacks
- Remove `AssetListPanel` import and rendering
- Add `detectAssets()` call in extraction callback
- Add `zeroAssetWarning` + `detectedAssets` state
- Wire detected assets to `runAssetExport()`
- Add zero-asset warning UI (two buttons: Continue anyway, Try again)

**Delete:** `AssetListPanel.tsx`, `assets/resolve.ts`, `assets/resolve.test.ts`

**Rationale:** After this phase, the plugin works end-to-end with @S- detection. Results still display inline (the old card). This is the critical integration phase.

**Why third:** Depends on Phase 1 (detection function) and Phase 2 (export accepts detected assets). After this, the core feature is functional.

**Dependency:** Phase 1 + Phase 2.

### Phase 4: Results Modal

**Build:** `components/ResultsModal.tsx` + styles. Replace inline result card in MainView with modal rendering.

**Rationale:** Pure UI change. The data pipeline is already working from Phase 3. This is purely about presentation and guidance text.

**Why last:** Depends on all pipeline changes being stable. Can be iterated on independently. If scope needs to be cut, the inline results card from v2.1 still works as a fallback.

**Dependency:** Phase 3 (MainView state for results data).

## MainView State After v2.2

The state shape simplifies:

**Removed:**
- `manualAssets` (ManualAsset[]) -- replaced by `detectedAssets`
- 7 callbacks: `handleAddAsset`, `handleRemoveAsset`, `handleClearAssets`, `handleRenameAsset`, `handleAssetResolved`, `handleAssetFormatChange`
- `hasResolvingAssets` derived state
- `extractDisabled` no longer checks `hasResolvingAssets`

**Added:**
- `detectedAssets` (DetectedAsset[]) -- set after detection, consumed by export
- `zeroAssetWarning` (boolean) -- intermediate UI state
- `showResults` (boolean) -- controls ResultsModal open/close

**Net effect:** ~5 fewer state variables, ~100 fewer lines in MainView.

## Scalability Considerations

| Concern | Current Scale | After @S- Detection | Notes |
|---------|--------------|---------------------|-------|
| Tree walk depth | Raw trees up to 2000 nodes | Same tree, one extra O(n) pass | Negligible -- synchronous, no allocation |
| API calls | 1 for tree + 1 per asset URL + 1 per format batch | 1 for tree + 1 per format batch | Fewer API calls (no per-asset resolution) |
| Asset count | 0-20 manual assets | 0-30 @S- assets | Same batch export, same Figma API limits |
| User latency | Paste + resolve per asset (~1s each) | Zero user interaction for assets | Significantly faster end-to-end |

No scalability concerns. Detection adds zero API calls and negligible computation.

## Sources

- Direct codebase inspection: all files listed in Component Map (HIGH confidence)
- `src/views/MainView.tsx` (780 lines) -- full state and flow analysis
- `src/assets/export.ts` -- current export pipeline interface
- `src/assets/resolve.ts` -- current per-URL resolution (to be deleted)
- `src/components/AssetListPanel.tsx` -- current manual UI (to be deleted)
- `src/layout/extract.ts` -- extraction pipeline and return types
- `src/layout/normalize.ts` -- normalization behavior (INSTANCE leaf nodes)
- `src/brief/generate.ts` -- brief assembly consuming ExportResult
- `src/assets/types.ts` -- ManualAsset and ExportResult types
- `src/components/Modal.tsx` -- reusable modal shell
- `.planning/PROJECT.md` -- v2.2 requirements and constraints
