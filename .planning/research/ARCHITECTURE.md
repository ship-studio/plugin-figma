# Architecture: v2.0 Manual Asset Control Integration

**Project:** Ship Studio Figma Plugin
**Milestone:** v2.0 -- Manual asset control replacing auto-detection
**Researched:** 2026-03-01
**Focus:** How the manual asset list integrates with existing architecture, what changes, what is new, and complete data flow
**Confidence:** HIGH (based on full codebase analysis)

## Executive Summary

The v2.0 milestone transforms the plugin from a single-button pipeline into a two-phase user interaction. The current architecture runs extraction, auto-detection, export, and brief generation as one uninterruptible sequence. v2.0 introduces a pause between extraction and export where the user manually builds an asset list by pasting Figma URLs and choosing formats.

The change is architecturally clean because the existing pipeline already has a natural boundary between extraction (layout/extract.ts) and asset export (assets/export.ts). The auto-detection layer (identify.ts, detect-composition.ts) sits between these two steps and is the code being removed. The extraction result feeds the brief generator through the same `ExtractLayoutResult` type; only the `ExportResult` changes shape because assets now come from a user-provided list rather than tree heuristics.

Four files are deleted entirely (identify.ts, detect-composition.ts, and their tests). Three files are modified significantly (export.ts, extract.ts, MainView.tsx). One new file is created (resolve.ts for node name lookup). The brief generator, download pipeline, sanitizer, breadcrumb builder, URL parser, and Figma API client are unchanged or need only minor type updates.

## Current Architecture (v1.3)

```
User Input (URL + token)
    |
[1. URL Parser] -> fileKey, nodeId
    |
[2. Figma API Client] -> validate access, fetch node tree
    |
[3. Layout Extraction] -> raw tree -> normalization -> LayoutNode tree
    |                      + collectImageFillsFromRawTree (pre-normalization)
    |                      + collectInstancesWithText (pre-normalization)
    |                      + collectTokens -> DesignTokens (with imageFills)
    |
[4. Asset Detection]  -> detect-composition.ts (composition/illustration IDs)
    |                  -> identify.ts (walk tree, classify nodes as assets)
    |                     AUTO-DETECT: instances, SVGs, image fills, compositions
    |
[5. Asset Export]     -> export.ts orchestrates:
    |                     fetchImages (SVG batch, PNG-render batch)
    |                     fetchImageFills (image fill URL resolution)
    |                     sequential download to temp dir
    |
[6. Brief Assembly]   -> generate.ts (pure function, markdown output)
    |                     layout tree with [Illustration] collapse + asset cross-refs
    |                     breadcrumb paths for asset location
    |
[7. Output]           -> clipboard + file save
```

**Critical behavior:** Steps 3-7 run as one continuous sequence triggered by the "Get Brief" button in MainView.tsx. There is no user interaction between extraction and export.

## v2.0 Architecture

### Fundamental Structural Change

The pipeline splits into two user-triggered phases:

```
PHASE 1: Extract (triggered by "Extract" button)
  URL Input -> Validate -> Extract Layout
  [User sees layout stats + tree preview]
  [Asset list UI becomes available]

USER INTERACTION: Build Asset List
  Paste asset URLs -> Resolve names -> Add to list
  Remove assets -> Recalculate filenames
  Choose format (PNG/SVG) per asset

PHASE 2: Export + Brief (triggered by "Get Brief" button)
  Asset List -> Export Assets -> Generate Brief -> Copy/Save
```

### Component Boundaries

| Component | Status | Change Summary |
|-----------|--------|----------------|
| `url-parser.ts` | **Unchanged** | Parses page/frame URLs; reused to parse asset URLs |
| `figma-api.ts` | **Unchanged** | All needed endpoints already exist |
| `layout/extract.ts` | **Simplified** | Remove `collectImageFillsFromRawTree`, `collectInstancesWithText`, imageFills merge |
| `layout/normalize.ts` | **Unchanged** | Tree normalization is independent of asset strategy |
| `layout/types.ts` | **Unchanged** | LayoutNode shape does not change |
| `tokens/collect.ts` | **Simplified** | Stop populating `imageFills` (keep field as empty array for compat) |
| `tokens/types.ts` | **Unchanged** | `ImageFillRef` type remains for compat; just not populated |
| `assets/identify.ts` | **DELETE** | Auto-detection logic entirely replaced by user list |
| `assets/identify.test.ts` | **DELETE** | Tests for deleted code |
| `assets/detect-composition.ts` | **DELETE** | Composition heuristics no longer needed |
| `assets/detect-composition.test.ts` | **DELETE** | Tests for deleted code |
| `assets/export.ts` | **Modified** | Accept `ManualAsset[]` instead of auto-detecting; remove identify/detect imports |
| `assets/download.ts` | **Unchanged** | Downloads any URL to any path; format-agnostic |
| `assets/sanitize.ts` | **Unchanged** | `sanitizeFilename` and `resolveCollisions` reused by asset list builder |
| `assets/breadcrumb.ts` | **Unchanged** | Builds nodeId -> path map from layout tree |
| `assets/types.ts` | **Modified** | Add `ManualAsset` type; simplify `ExportResult.assets` shape |
| `brief/generate.ts` | **Modified** | Remove composition collapse in tree; simplify asset type labels |
| `brief/types.ts` | **Minor update** | `BriefInput` no longer carries `instancesWithText` concern |
| `brief/io.ts` | **Unchanged** | Save/copy mechanics do not change |
| `views/MainView.tsx` | **Major rewrite** | Two-phase flow, asset list UI, new state management |
| **`assets/resolve.ts`** | **NEW** | Resolve node ID to layer name via Figma API |

### New Data Types

```typescript
/**
 * A user-specified asset to export.
 * Created when user pastes a Figma URL in the asset list.
 */
interface ManualAsset {
  /** Unique ID for React list rendering and removal */
  id: string;
  /** Figma node ID (e.g., "12:34") -- parsed from pasted URL */
  nodeId: string;
  /** Figma layer name -- fetched via API after URL paste */
  nodeName: string;
  /** User-selected export format */
  format: 'png' | 'svg';
  /** Auto-derived filename (sanitized from nodeName + format extension) */
  filename: string;
  /** Validation state for this asset entry */
  status: 'resolving' | 'valid' | 'error';
  /** Error message when status === 'error' */
  error?: string;
}
```

This type lives in `assets/types.ts` alongside the existing types. It replaces `AssetEntry` as the input to the export pipeline.

## Complete Data Flow

### Phase 1: Layout Extraction (simplified from v1.3)

```
User pastes page/frame URL
  -> parseFigmaUrl(url) -> { fileKey, nodeId, fileType }
  -> validateFileAccess(shell, token, fileKey) -> { name, pages }

User clicks "Extract":
  -> extractLayout({ shell, token, fileKey, nodeId, scope })
     1. Fetch raw tree via fetchFileNodes or fetchFullFile
     2. Count raw nodes -> large tree warning if > 500
     3. [REMOVED: collectImageFillsFromRawTree]
     4. [REMOVED: collectInstancesWithText]
     5. normalizeTree(rootNodes, components) -> ExtractionResult
     6. collectTokens(rootNodes, styles) -> DesignTokens
        [imageFills array is now always empty]
     7. [REMOVED: merge raw image fills into tokens]
     -> ExtractLayoutResult { extraction, tokens, fileKey, largeTreeWarning }

  UI shows: extraction stats, tree preview, asset list input
```

**Key change:** `ExtractLayoutResult` loses the `instancesWithText` field. The `tokens.imageFills` field is always `[]`. Three pre-normalization tree walks are eliminated, making extraction faster.

### User Interaction: Build Asset List

```
User pastes asset URL into input field:
  -> parseFigmaUrl(assetUrl) -> { fileKey: assetFileKey, nodeId: assetNodeId }

Validation checks:
  1. Must have nodeId (reject file-level URLs without a selected element)
  2. assetFileKey must equal the extracted file's fileKey (same file enforcement)

Name resolution:
  -> resolveNodeName(shell, token, fileKey, assetNodeId)
     Uses fetchFileNodes internally, reads only rootNode.name and rootNode.type
     -> { nodeName, nodeType }

Filename derivation:
  -> sanitizeFilename(nodeName) + (format === 'svg' ? '.svg' : '.png')
  -> recalculateFilenames(updatedList) for collision resolution
     (icon.png stays, second icon.png becomes icon-2.png)

Asset added to ManualAsset[] state with status 'valid'

User can:
  - Remove any asset (filter by id, recalculate filenames)
  - Add more assets (repeat the paste flow)
  - Change nothing and proceed to export
```

### Phase 2: Export + Brief Generation

```
User clicks "Get Brief":
  -> exportAssets({
       shell, token, fileKey, selectedNodeId, projectPath,
       assets: manualAssets.filter(a => a.status === 'valid'),
       onProgress
     })

     1. prepareAssetsDir(shell, projectPath) -> assetsDir
        [Unchanged: rm -rf + mkdir -p on .shipstudio/assets/]

     2. Preview PNG:
        fetchImages(shell, token, fileKey, [selectedNodeId], 'png', 2)
        downloadFile(shell, previewUrl, assetsDir/preview.png)
        [Unchanged from v1.3]

     3. Batch render by format:
        PNG assets: fetchImages(shell, token, fileKey, pngNodeIds, 'png', 2)
        SVG assets: fetchImages(shell, token, fileKey, svgNodeIds, 'svg')
        [SIMPLIFIED: No more fetchImageFills call]
        [SIMPLIFIED: No more separate composition PNG batch]

     4. Build download list from render URL responses
        [Each ManualAsset maps to one download entry]

     5. downloadAllAssets(shell, assetsDir, downloadList, onProgress)
        [Unchanged: sequential curl downloads]

     -> ExportResult {
          assetsDir,
          previewPath,
          assets: [{ filename, path, nodeId, assetType }],
          warnings
        }

  -> generateBrief({
       extraction: extractLayoutResult,
       exportResult,
       projectPath,
       fileName,
       figmaUrl,
       rootNodes
     })

     1. Build assetNodeMap: nodeId -> filename from exportResult.assets
        [Unchanged mechanism, simpler data]

     2. Build breadcrumbMap from rootNodes
        [Unchanged]

     3. Assemble markdown sections:
        - Metadata [unchanged]
        - Instructions [unchanged]
        - Preview [unchanged]
        - Layout Tree [simplified: no [Illustration] collapse, no compositionNodeIds]
          Asset cross-references still work: assetNodeMap.get(node.id) for INSTANCE lines
        - Design Tokens [unchanged]
        - Components [unchanged]
        - Assets table [simplified: types are 'Icon' or 'Image', no 'Composition'/'Component']

     -> BriefResult { markdown, charCount, estimatedTokens, stats }

  -> saveBrief(shell, assetsDir, markdown)
  -> User clicks "Copy Brief" -> copyToClipboard(shell, markdown)
```

## Detailed File Changes

### Files to DELETE

| File | Lines | Reason |
|------|-------|--------|
| `src/assets/identify.ts` | ~307 | Auto-detection heuristics replaced by user-provided list |
| `src/assets/identify.test.ts` | ~varies | Tests for deleted module |
| `src/assets/detect-composition.ts` | ~209 | Composition/illustration detection no longer needed |
| `src/assets/detect-composition.test.ts` | ~varies | Tests for deleted module |

### `src/layout/extract.ts` -- Simplified

Remove these functions entirely:
- `collectImageFillsFromRawTree()` (lines 51-78) -- was pre-normalization IMAGE fill collection
- `collectInstancesWithText()` (lines 86-112) -- was for identify.ts heuristic

Remove from `extractLayout()`:
- Step 4: `rawImageFills` collection loop (lines 174-178)
- Step 4b: `instancesWithText` collection loop (lines 180-185)
- Step 7: `rawImageFills` merge into `tokens.imageFills` (lines 198-205)

Remove from `ExtractLayoutResult`:
- `instancesWithText: Set<string>` field

The function becomes: fetch -> count -> normalize -> collect tokens -> return. Cleaner and faster.

### `src/assets/export.ts` -- Modified Interface

```typescript
// NEW signature
interface ExportAssetsOptions {
  shell: Shell;
  token: string;
  fileKey: string;
  selectedNodeId: string;   // For preview PNG
  projectPath: string;
  assets: ManualAsset[];    // User-provided asset list (was: rootNodes + imageFills + instancesWithText)
  onProgress?: (progress: AssetExportProgress) => void;
}
```

The function body simplifies from ~120 lines to ~80:
1. `prepareAssetsDir()` -- unchanged
2. Preview PNG -- unchanged
3. Split `assets` by format: `const pngAssets = assets.filter(a => a.format === 'png')`
4. `fetchImages(shell, token, fileKey, pngNodeIds, 'png', 2)` -- one call
5. `fetchImages(shell, token, fileKey, svgNodeIds, 'svg')` -- one call
6. Build download list mapping each asset to its rendered URL
7. `downloadAllAssets()` -- unchanged

Removed entirely:
- `identifyAssets()` import and call
- `detectCompositions()` import and call
- `fetchImageFills()` call (no more imageRef resolution)
- Complex download list building with separate SVG/fill/png-render paths
- `compositionNodeIdSet` tracking

### `src/assets/types.ts` -- Add ManualAsset, Simplify ExportResult

```typescript
// ADD
interface ManualAsset {
  id: string;
  nodeId: string;
  nodeName: string;
  format: 'png' | 'svg';
  filename: string;
  status: 'resolving' | 'valid' | 'error';
  error?: string;
}

// SIMPLIFY ExportResult.assets type
interface ExportResult {
  assetsDir: string;
  previewPath: string;
  assets: {
    filename: string;
    path: string;
    nodeId: string;                  // Always present (user provided it)
    assetType: 'icon' | 'image';    // svg -> icon, png -> image (no 'composition'/'component')
    // parentInstanceId removed
  }[];
  warnings: string[];
}
```

`AssetEntry` type can be kept for internal use or removed. It is no longer the input to export.

### `src/assets/resolve.ts` -- NEW

```typescript
/**
 * Resolve a Figma node ID to its layer name and type.
 * Used when the user pastes an asset URL to populate the ManualAsset.
 */
export async function resolveNodeName(
  shell: Shell,
  token: string,
  fileKey: string,
  nodeId: string,
): Promise<{ nodeName: string; nodeType: string }> {
  const result = await fetchFileNodes(shell, token, fileKey, nodeId);
  return {
    nodeName: result.rootNode.name,
    nodeType: result.rootNode.type,
  };
}
```

Single function, ~15 lines. Uses the existing `fetchFileNodes` from `figma-api.ts`. The full subtree is fetched but only the root node's name is read. Acceptable for the expected 5-20 asset resolution calls.

### `src/brief/generate.ts` -- Simplified

Remove:
- `compositionNodeIds` set construction in `generateBrief()`
- `compositionNodeIds` parameter from `buildLayoutTreeSection()` and `renderTree()`
- The `[Illustration]` collapse block in `renderTree()` (lines 153-161)
- `'composition' | 'component'` cases in `assetTypeLabel()`

The `assetTypeLabel` function becomes:
```typescript
function assetTypeLabel(assetType?: 'icon' | 'image'): string {
  switch (assetType) {
    case 'icon': return 'Icon';
    case 'image': return 'Image';
    default: return 'File';
  }
}
```

The layout tree cross-referencing via `assetNodeMap` continues to work: when an INSTANCE node's ID matches a user-provided asset nodeId, the tree line shows `-> filename`. For non-instance nodes that the user exports, the same lookup works if the nodeId appears in the tree traversal.

### `src/views/MainView.tsx` -- Major Rewrite

**New state variables:**
```typescript
const [manualAssets, setManualAssets] = useState<ManualAsset[]>([]);
const [assetUrlInput, setAssetUrlInput] = useState('');
const [assetFormat, setAssetFormat] = useState<'png' | 'svg'>('png');
const [addingAsset, setAddingAsset] = useState(false);
const [assetError, setAssetError] = useState<string | null>(null);
```

**Flow changes:**
1. "Get Brief" button split into "Extract" (Phase 1) and "Get Brief" (Phase 2)
2. After extraction succeeds, the asset list UI appears
3. "Get Brief" button is enabled only when extraction is complete (asset list can be empty for layout-only briefs, or require at least one asset -- design decision)
4. `runAssetExport()` no longer auto-fires after extraction
5. `handleExtract()` stops after setting `extractionResult`
6. New `handleGetBrief()` function triggers export + brief generation

**New UI sections (between extraction result and brief button):**
1. Asset URL input with format toggle (PNG/SVG)
2. "Add Asset" button
3. Asset list with name, format, filename, remove button
4. Inline validation messages

**Removed UI elements:**
- Composition count display (no more compositions)
- Composition-related warnings filtering

## Patterns to Follow

### Pattern 1: Validate-Then-Add for Asset List

When the user pastes an asset URL, validate immediately and show status before the entry is usable. Create an optimistic entry with `status: 'resolving'`, then update to `'valid'` or `'error'` after the API call completes.

```typescript
async function handleAddAsset() {
  const parsed = parseFigmaUrl(assetUrlInput);
  if (!parsed?.nodeId) {
    setAssetError('Select a specific element in Figma first');
    return;
  }
  if (parsed.fileKey !== extractedFileKey) {
    setAssetError('Asset must be from the same Figma file');
    return;
  }
  // Check for duplicate nodeId
  if (manualAssets.some(a => a.nodeId === parsed.nodeId)) {
    setAssetError('This element is already in the list');
    return;
  }

  const tempId = crypto.randomUUID();
  setManualAssets(prev => [...prev, {
    id: tempId, nodeId: parsed.nodeId, nodeName: '...',
    format: assetFormat, filename: '...', status: 'resolving',
  }]);
  setAssetUrlInput('');
  setAssetError(null);

  try {
    const { nodeName } = await resolveNodeName(shell, token, parsed.fileKey, parsed.nodeId);
    setManualAssets(prev => recalculateFilenames(
      prev.map(a => a.id === tempId
        ? { ...a, nodeName, status: 'valid' as const }
        : a
      )
    ));
  } catch (err: any) {
    setManualAssets(prev => prev.map(a => a.id === tempId
      ? { ...a, status: 'error' as const, error: err?.message || 'Failed to resolve' }
      : a
    ));
  }
}
```

### Pattern 2: Collision Resolution on List Mutation

Recalculate filenames whenever the asset list changes (add or remove). The user always sees the exact filenames that will appear in the brief.

```typescript
function recalculateFilenames(assets: ManualAsset[]): ManualAsset[] {
  const seen = new Map<string, number>();
  return assets.map(asset => {
    if (asset.status !== 'valid') return asset;
    const base = sanitizeFilename(asset.nodeName);
    const ext = asset.format === 'svg' ? '.svg' : '.png';
    const key = base + ext;
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    const filename = count === 0 ? key : `${base}-${count + 1}${ext}`;
    return { ...asset, filename };
  });
}
```

### Pattern 3: Same-File Enforcement

Asset URLs must reference the same Figma file as the page/frame URL. The `fileKey` from `parseFigmaUrl(assetUrl)` must match the `fileKey` from the extraction. This is enforced at add time, not at export time.

Rationale: The Figma render API (`/v1/images/{fileKey}`) is per-file. Cross-file references would need separate API calls and the node IDs would not exist in the extracted layout tree for cross-referencing.

### Pattern 4: Format-Aware API Batching

At export time, batch all PNG node IDs into one `fetchImages()` call and all SVG node IDs into another. Maximum two API calls for user assets (plus one for preview). The Figma render endpoint accepts comma-separated node IDs.

```typescript
const pngAssets = validAssets.filter(a => a.format === 'png');
const svgAssets = validAssets.filter(a => a.format === 'svg');

const pngUrls = pngAssets.length > 0
  ? await fetchImages(shell, token, fileKey, pngAssets.map(a => a.nodeId), 'png', 2)
  : {};
const svgUrls = svgAssets.length > 0
  ? await fetchImages(shell, token, fileKey, svgAssets.map(a => a.nodeId), 'svg')
  : {};
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Keeping Auto-Detection as Fallback

**What:** Keeping identify.ts and detect-composition.ts as optional alongside manual control.

**Why bad:** Two parallel pipelines double maintenance burden, create ambiguous UX, and undermine the decision that auto-detection was unreliable. If both exist, every bug report requires asking "which path did it take?"

**Instead:** Delete completely. If future versions want "suggested assets," implement as a pre-population of the manual list for user review -- not a separate pipeline.

### Anti-Pattern 2: Re-fetching the Full Tree for Name Resolution

**What:** Calling `fetchFileNodes` with the full subtree just to read `.name`.

**Why bad (at scale):** For a complex component, this fetches the entire subtree. Wasteful.

**Actually acceptable for v2.0:** Individual node fetches are fast for the expected 5-20 assets. The full tree response for a single icon/image is typically small. Optimize only if profiling shows this is a bottleneck.

**Future optimization if needed:** Cache the raw tree from the extraction and look up names locally. But this is premature for v2.0.

### Anti-Pattern 3: Storing Asset List in Plugin Storage

**What:** Persisting the manual asset list across sessions.

**Why bad:** Asset lists are per-extraction, tied to a specific Figma URL and tree state. Stale references would fail or export wrong content after the Figma file changes.

**Instead:** Asset list is ephemeral React state. Resets on URL change or re-extraction. Simple and correct.

### Anti-Pattern 4: Mixed Asset Type Semantics

**What:** Trying to distinguish "component" from "image" from "composition" in the brief when the user manually chose the format.

**Why bad:** The user explicitly chose PNG or SVG. Adding a third dimension of classification (component vs image vs icon) requires heuristics that are exactly what v2.0 is eliminating.

**Instead:** Asset type is derived purely from format: `svg -> 'Icon'`, `png -> 'Image'`. The user knows what they exported and the brief does not need to guess.

## Cross-Referencing: How User-Provided Node IDs Map to the Layout Tree

This is the most subtle integration point. The brief's layout tree uses `assetNodeMap.get(node.id)` to show `-> filename` inline on tree nodes that have corresponding assets. This works when:

1. **Node is in the normalized tree** (e.g., an INSTANCE, FRAME, or VECTOR node): The `renderTree` traversal visits the node, finds it in `assetNodeMap`, and appends `-> filename`. Works identically to v1.3.

2. **Node is a child of an INSTANCE** (e.g., a photo rectangle inside a card component): The normalized tree treats INSTANCE as a leaf -- its children are not in the traversal. The `assetNodeMap` entry exists but `renderTree` never visits that node ID. The asset will NOT show `-> filename` in the tree.

This is acceptable and arguably better than v1.3: The Assets table already shows every asset with its breadcrumb location. The tree annotation was useful in the auto-detection era to make implicit connections visible. With manual control, the user knows exactly which elements they added.

The breadcrumb lookup for instance-child assets also needs consideration: `buildBreadcrumbMap` only covers nodes in the normalized tree. An instance-child nodeId will not have a breadcrumb entry. The Assets table will show `--` for its Location column.

**Mitigation:** When building the assets table, if a nodeId has no breadcrumb, fall back to showing the parent INSTANCE node's breadcrumb. This requires knowing the parent-child relationship. Two approaches:

1. **Lookup during resolve:** When `resolveNodeName` fetches the node, also check if its parent is in the breadcrumb map. Store the parent breadcrumb on `ManualAsset`.
2. **Accept `--` for now:** Most user-selected assets will be top-level nodes (icons, sections, images) that ARE in the normalized tree. Instance children are an edge case. Ship with `--` and add parent breadcrumb in a follow-up if users report it as confusing.

**Recommendation:** Accept `--` for v2.0. This is a minor cosmetic issue and the brief is still fully functional.

## Suggested Build Order

Each phase is independently testable. Dependencies flow strictly downward.

### Phase 1: Strip Auto-Detection (foundation cleanup)

**Delete:** `identify.ts`, `identify.test.ts`, `detect-composition.ts`, `detect-composition.test.ts`

**Modify:**
- `extract.ts`: Remove `collectImageFillsFromRawTree()`, `collectInstancesWithText()`, imageFills merge, `instancesWithText` from return type
- `export.ts`: Remove `identifyAssets()` and `detectCompositions()` imports. Temporarily stub the function to skip auto-detection (return empty assets, preview only)
- `brief/generate.ts`: Remove `compositionNodeIds` tracking, `[Illustration]` collapse in `renderTree`, simplify `assetTypeLabel`

**Test updates:** Remove or update tests that reference deleted modules. Existing brief/generate tests that use composition fixtures need updating.

**Why first:** All subsequent work builds on a codebase without dead code. Merge conflicts are minimized by doing deletions first.

### Phase 2: Manual Asset Types + Node Resolution

**Create:** `assets/resolve.ts` with `resolveNodeName()`

**Modify:** `assets/types.ts` to add `ManualAsset` type, simplify `ExportResult.assets`

**Test:** Unit test `resolveNodeName` (mock figma-api). Unit test `ManualAsset` filename derivation with `sanitizeFilename`.

**Why second:** Pure data types and a single API function. No UI. Fully testable in isolation. Required before Phase 3 can accept the new input shape.

### Phase 3: Rebuild Export Pipeline

**Modify:** `assets/export.ts` to accept `ManualAsset[]`

New function body:
1. `prepareAssetsDir()` -- unchanged
2. Preview PNG -- unchanged
3. Split assets by format into PNG and SVG batches
4. `fetchImages()` per batch
5. Build download list
6. `downloadAllAssets()` -- unchanged

**Test:** Unit test with mocked API calls. Verify correct batching (all PNGs in one call, all SVGs in another). Verify filename passthrough from ManualAsset to download list.

**Why third:** Depends on Phase 2 types. The export pipeline must work before the UI can trigger it.

### Phase 4: Brief Generator Updates

**Modify:** `brief/generate.ts` to work with simplified export result

Changes:
- Remove `compositionNodeIds` parameter threading
- Simplify `assetTypeLabel` to `'icon' | 'image'`
- Remove `parentInstanceId` fallback in asset table building
- Update `BriefInput` type (remove `instancesWithText` concern)

**Test:** Update existing `generate.test.ts` fixtures. Verify layout tree rendering without composition collapse. Verify assets table with new type labels.

**Why fourth:** Depends on Phase 3 (new ExportResult shape). Pure function, fully testable.

### Phase 5: MainView UI Rewrite

**Modify:** `views/MainView.tsx`

- Split single button into two-phase flow (Extract, then Get Brief)
- Add asset list state management
- Add asset URL input + format picker + Add button
- Add asset list display with remove buttons
- Wire Get Brief to new export pipeline
- Update progress indicators
- Remove composition-related UI elements

**Why last:** Depends on all previous phases. The UI wires together resolve.ts (Phase 2), export.ts (Phase 3), and generate.ts (Phase 4). Best done when all pieces are stable and tested.

## Scalability Considerations

| Concern | 5 assets | 20 assets | 50+ assets |
|---------|----------|-----------|------------|
| Name resolution API calls | 5 serial fetches (~2s) | 20 serial fetches (~8s) | Likely too slow; batch needed |
| Render API batching | 1-2 calls | 1-2 calls | May hit URL length limits |
| Download time | ~5s | ~20s | ~50s; approaching 120s timeout |
| UI list rendering | Trivial | Trivial | May need scroll container |

For v2.0, 5-20 assets is the realistic range. No optimization needed beyond the basic format batching already planned.

## Sources

- Full codebase analysis of all source files in `src/` -- HIGH confidence
- Figma REST API endpoints: `/v1/files/{key}/nodes`, `/v1/images/{key}`, `/v1/files/{key}/images` -- HIGH confidence
- PROJECT.md v2.0 requirements -- HIGH confidence
- Existing `@figma/rest-api-spec` type definitions in node_modules -- HIGH confidence
