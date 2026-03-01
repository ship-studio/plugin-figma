# Phase 17: Export Pipeline Rebuild - Research

**Researched:** 2026-03-01
**Domain:** Figma REST API image rendering, async pipeline orchestration, format-aware batching
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EXPT-01 | Plugin exports all listed assets in a single batch (one fetchImages call per format) | Existing `fetchImages` already batches node IDs into a single API call; the pipeline needs to partition `ManualAsset[]` by format, call `fetchImages` once per partition, then download each URL. Null URLs in the response map indicate per-node render failure and must produce warnings without blocking. |
</phase_requirements>

## Summary

Phase 17 refactors `src/assets/export.ts` from its current preview-only stub into a full pipeline that accepts `ManualAsset[]`, batches assets by format (one `fetchImages` call for all PNGs, one for all SVGs), downloads every rendered file, and handles per-asset failures gracefully.

The existing codebase provides every building block needed:

1. **`fetchImages`** (src/figma-api.ts) already accepts an array of node IDs, a format, and an optional scale -- returns `Record<string, string | null>` where `null` means the node failed to render. No changes needed to this function.
2. **`downloadFile`** (src/assets/download.ts) handles single-file curl downloads with retry-once. No changes needed.
3. **`prepareAssetsDir`** (src/assets/download.ts) creates a fresh `.shipstudio/assets/` directory. No changes needed.
4. **`ManualAsset`** (src/assets/types.ts) has `nodeId`, `filename`, and `format` -- everything the pipeline needs.
5. **`ExportResult`** (src/assets/types.ts) already has the right shape: `assets[]` with `filename`, `path`, `nodeId`, `assetType`; plus `warnings[]`.

The new work is primarily in `export.ts`: accept `ManualAsset[]`, partition by format, call `fetchImages` per partition, iterate the response map to collect URLs (logging warnings for null entries), then download sequentially with progress callbacks. The preview PNG generation (current code) is retained alongside the new manual asset pipeline.

**Primary recommendation:** Refactor `exportAssets` in `src/assets/export.ts` to accept `ManualAsset[]` in its options, partition by format, make two `fetchImages` calls (one PNG at 2x scale, one SVG), then download each asset. Map each downloaded asset to the `ExportResult.assets[]` shape with `assetType` derived from format. Null-URL entries produce per-asset warnings. Preview PNG logic stays unchanged.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @figma/rest-api-spec | latest | Type definitions for Figma REST API responses | Already in project; provides `GetImagesResponse` type |
| vitest | latest | Test framework | Already in project; all 277 tests use it |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | - | - | All dependencies already present |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sequential downloads | Parallel Promise.all | Parallel downloads risk overwhelming Figma's CDN and Ship Studio's shell; sequential is simpler, already proven in `downloadAllAssets` pattern |
| Two fetchImages calls | One call + post-filtering | Format is a query parameter -- cannot mix PNG and SVG in a single Figma Images API call |

**Installation:** No new packages needed.

## Architecture Patterns

### Current Export Flow (preview-only, from Phase 15)
```
exportAssets(options)
  -> prepareAssetsDir(shell, projectPath)
  -> fetchImages(shell, token, fileKey, [selectedNodeId], 'png', 2)
  -> downloadFile(shell, previewUrl, previewPath)
  -> return { assetsDir, previewPath, assets: [], warnings }
```

### Target Export Flow (Phase 17)
```
exportAssets(options)                 // options now includes manualAssets: ManualAsset[]
  -> prepareAssetsDir(shell, projectPath)
  -> Preview: fetchImages([selectedNodeId], 'png', 2) -> downloadFile
  -> Partition manualAssets by format: pngAssets[], svgAssets[]
  -> PNG batch: fetchImages(pngNodeIds, 'png', 2) -> urlMap
  -> SVG batch: fetchImages(svgNodeIds, 'svg') -> urlMap
  -> For each asset: if urlMap[nodeId] is null -> warning; else downloadFile
  -> return { assetsDir, previewPath, assets: [...downloaded], warnings }
```

### Pattern 1: Format-Aware Batching
**What:** Partition `ManualAsset[]` into format groups, make one `fetchImages` call per group.
**When to use:** Always -- the Figma Images API `format` parameter applies to all IDs in a single call; you cannot mix formats.
**Example:**
```typescript
// Source: Figma REST API docs + existing fetchImages signature
const pngAssets = manualAssets.filter(a => a.format === 'png');
const svgAssets = manualAssets.filter(a => a.format === 'svg');

const pngUrlMap = pngAssets.length > 0
  ? await fetchImages(shell, token, fileKey, pngAssets.map(a => a.nodeId), 'png', 2)
  : {};
const svgUrlMap = svgAssets.length > 0
  ? await fetchImages(shell, token, fileKey, svgAssets.map(a => a.nodeId), 'svg')
  : {};
```

### Pattern 2: Null-URL Warning Collection
**What:** Iterate the fetchImages response map; for each null URL, push a per-asset warning and skip the download.
**When to use:** Always -- the Figma API guarantees every requested node ID appears in the response map, but the URL can be null when the node cannot be rendered.
**Example:**
```typescript
// Source: @figma/rest-api-spec GetImagesResponse.images type
for (const asset of pngAssets) {
  const url = pngUrlMap[asset.nodeId];
  if (!url) {
    warnings.push(`Failed to render ${asset.filename}: Figma returned no image for node ${asset.nodeId}`);
    continue;
  }
  // download...
}
```

### Pattern 3: AssetType Derivation from Format
**What:** Map `ManualAsset.format` to `ExportResult.assets[].assetType` so the brief generator can label assets correctly.
**When to use:** When building the `ExportResult.assets[]` entries from downloaded files.
**Example:**
```typescript
const assetType: 'icon' | 'image' = asset.format === 'svg' ? 'icon' : 'image';
```
Note: Phase 18 may simplify these labels, but the current type system expects `'icon' | 'image'`.

### Anti-Patterns to Avoid
- **Mixing formats in one fetchImages call:** The API's `format` parameter is per-call, not per-node. Attempting to request mixed formats silently applies one format to all nodes.
- **Parallel downloads without throttling:** Ship Studio's `shell.exec` runs curl processes; spawning too many in parallel could hit process limits or rate limits. Sequential download (as in existing `downloadAllAssets`) is proven and safe.
- **Throwing on null URL:** A single unrenderable node should not abort the entire export. The success criteria explicitly require per-asset warnings without blocking.
- **Forgetting scale for PNGs:** Preview uses 2x scale; manual PNG assets should also use 2x for consistency with the preview quality.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Figma API image rendering | Custom fetch/curl wrapper | Existing `fetchImages` from `figma-api.ts` | Already handles URL encoding, SVG options, timeout, error parsing |
| File downloads with retry | Custom download logic | Existing `downloadFile` from `download.ts` | Already implements retry-once, timeout, redirect following |
| Assets directory lifecycle | Manual rm/mkdir | Existing `prepareAssetsDir` from `download.ts` | Already handles clean recreation |
| Sequential download with progress | New download loop | Adapt pattern from existing `downloadAllAssets` in `download.ts` | Same loop structure, same progress callback pattern |

**Key insight:** Phase 17's implementation is almost entirely orchestration of existing functions. The new logic is: partition by format, call fetchImages per partition, handle null URLs, then feed into the existing download/progress pipeline.

## Common Pitfalls

### Pitfall 1: Node ID Encoding in fetchImages Response Map
**What goes wrong:** The Figma API may return node IDs with URL encoding (e.g., "12%3A34" instead of "12:34") in the response map keys.
**Why it happens:** The API sometimes normalizes or encodes the colon separator differently than the input.
**How to avoid:** When looking up a node ID in the response map, check both the raw ID and the URL-encoded variant. The existing `fetchFileNodes` in `figma-api.ts` already handles this pattern (see lines 120-133).
**Warning signs:** Assets silently report as "failed to render" when the URL actually exists under a different key.

### Pitfall 2: Empty Asset List Edge Case
**What goes wrong:** Calling `fetchImages` with an empty node ID list may produce an API error or unexpected behavior.
**Why it happens:** The API may reject an empty `ids` parameter.
**How to avoid:** Skip the `fetchImages` call entirely when a format partition is empty. The batching pattern above already guards with `pngAssets.length > 0`.
**Warning signs:** API error on "empty ids" when user has no PNG or no SVG assets.

### Pitfall 3: Scale Parameter for SVGs
**What goes wrong:** Passing `scale: 2` to an SVG export produces no visible effect (SVGs are vector, scale is meaningless) but clutters the API URL.
**Why it happens:** Developers copy the PNG call pattern for SVGs without removing scale.
**How to avoid:** Only pass `scale` for PNG format. The existing `fetchImages` function already supports optional `scale` -- just omit it for SVG calls.
**Warning signs:** No functional impact, but code is misleading.

### Pitfall 4: ExportResult.assets Shape Mismatch
**What goes wrong:** The brief generator reads `asset.nodeId` and `asset.assetType` from `ExportResult.assets[]`. If these fields are missing, tree cross-referencing and asset labeling silently break.
**Why it happens:** Building the downloaded asset entry without threading through `nodeId` and `assetType`.
**How to avoid:** Explicitly include `nodeId` and `assetType` in every entry pushed to the `downloaded` array. See Pattern 3 above.
**Warning signs:** Brief's Assets table shows empty Type or Location columns.

### Pitfall 5: Progress Callback Arithmetic
**What goes wrong:** The progress total doesn't account for preview + manual assets, or the current index is off by one.
**Why it happens:** Preview is step 0, manual assets start at 1, but total might only count manual assets.
**How to avoid:** Set `total = manualAssets.length + 1` (preview is always generated). Preview gets `current: 0`, manual assets get `current: i + 1`. Use `phase: 'preview'` for preview and `phase: 'assets'` for manual assets.
**Warning signs:** Progress indicator jumps or shows wrong counts in the UI.

## Code Examples

Verified patterns from the existing codebase:

### fetchImages Call (from src/figma-api.ts)
```typescript
// Source: src/figma-api.ts:186-203
export async function fetchImages(
  shell: Shell, token: string, fileKey: string,
  nodeIds: string[], format: 'png' | 'svg' = 'png', scale?: number,
): Promise<Record<string, string | null>> {
  const ids = nodeIds.map(id => encodeURIComponent(id)).join(',');
  let endpoint = `/images/${fileKey}?ids=${ids}&format=${format}`;
  if (scale != null) endpoint += `&scale=${scale}`;
  if (format === 'svg') endpoint += '&svg_outline_text=true&svg_include_id=true&svg_simplify_stroke=true';
  const response = await figmaApiCall<GetImagesResponse>(shell, endpoint, token, { timeout: 120000 });
  return response.images;
}
```

### downloadFile Call (from src/assets/download.ts)
```typescript
// Source: src/assets/download.ts:35-53
export async function downloadFile(
  shell: Shell, url: string, outputPath: string,
): Promise<{ success: boolean; error?: string }> {
  const args = ['-sS', '-o', outputPath, '--max-time', '30', '-L', url];
  const result = await shell.exec('curl', args, { timeout: 35000 });
  if (result.exit_code === 0) return { success: true };
  const retry = await shell.exec('curl', args, { timeout: 35000 });
  if (retry.exit_code === 0) return { success: true };
  return { success: false, error: retry.stderr || `curl exit code ${retry.exit_code}` };
}
```

### Current ExportAssetsOptions (to extend)
```typescript
// Source: src/assets/export.ts:20-29
export interface ExportAssetsOptions {
  shell: Shell;
  token: string;
  fileKey: string;
  selectedNodeId: string;        // for preview rendering
  projectPath: string;
  onProgress?: (progress: AssetExportProgress) => void;
  // Phase 17 adds:
  // manualAssets?: ManualAsset[];  // assets to export (empty = preview-only)
}
```

### ExportResult Shape (target output)
```typescript
// Source: src/assets/types.ts:32-50
export interface ExportResult {
  assetsDir: string;
  previewPath: string;
  assets: {
    filename: string;
    path: string;
    nodeId?: string;
    assetType?: 'icon' | 'image';
    parentInstanceId?: string;
  }[];
  warnings: string[];
}
```

### Test Pattern: Mock Shell (from resolve.test.ts)
```typescript
// Source: src/assets/resolve.test.ts:147-151
const failingShell: Shell = {
  exec: async () => {
    throw new Error('Network error');
  },
};
```

### Proposed: Full exportAssets Refactor Skeleton
```typescript
export async function exportAssets(options: ExportAssetsOptions): Promise<ExportResult> {
  const { shell, token, fileKey, selectedNodeId, projectPath, onProgress, manualAssets = [] } = options;
  const warnings: string[] = [];

  // 1. Clean assets directory
  const assetsDir = await prepareAssetsDir(shell, projectPath);

  // 2. Preview PNG (unchanged from current)
  const totalSteps = manualAssets.length + 1;
  if (onProgress) onProgress({ current: 0, total: totalSteps, currentAsset: 'preview.png', phase: 'preview' });
  let previewPath = `${assetsDir}/preview.png`;
  // ... existing preview logic ...

  // 3. Partition manual assets by format
  const pngAssets = manualAssets.filter(a => a.format === 'png' && a.status === 'valid');
  const svgAssets = manualAssets.filter(a => a.format === 'svg' && a.status === 'valid');

  // 4. Fetch image URLs per format
  const pngUrlMap = pngAssets.length > 0
    ? await fetchImages(shell, token, fileKey, pngAssets.map(a => a.nodeId), 'png', 2)
    : {};
  const svgUrlMap = svgAssets.length > 0
    ? await fetchImages(shell, token, fileKey, svgAssets.map(a => a.nodeId), 'svg')
    : {};

  // 5. Download each asset, collect results and warnings
  const downloaded: ExportResult['assets'] = [];
  const allAssets = [...pngAssets, ...svgAssets];
  for (let i = 0; i < allAssets.length; i++) {
    const asset = allAssets[i];
    const urlMap = asset.format === 'png' ? pngUrlMap : svgUrlMap;
    const url = urlMap[asset.nodeId];

    if (onProgress) onProgress({ current: i + 1, total: totalSteps, currentAsset: asset.filename, phase: 'assets' });

    if (!url) {
      warnings.push(`Failed to render ${asset.filename}: Figma returned no image for node ${asset.nodeId}`);
      continue;
    }

    const outputPath = `${assetsDir}/${asset.filename}`;
    const result = await downloadFile(shell, url, outputPath);
    if (result.success) {
      downloaded.push({
        filename: asset.filename,
        path: outputPath,
        nodeId: asset.nodeId,
        assetType: asset.format === 'svg' ? 'icon' : 'image',
      });
    } else {
      warnings.push(`Failed to download ${asset.filename}: ${result.error}`);
    }
  }

  return { assetsDir, previewPath, assets: downloaded, warnings };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Auto-detect assets (identify.ts) | Manual asset list (ManualAsset[]) | Phase 15 (2026-03-01) | Pipeline accepts explicit user-provided assets, no heuristics |
| Mixed format in single batch | Format-partitioned batching | Phase 17 (this phase) | One API call per format, matches Figma API constraints |

**Deprecated/outdated:**
- `identify.ts` and `detect-composition.ts` -- deleted in Phase 15; all automatic asset detection removed
- `downloadAllAssets` in download.ts -- still exists but may be unused after Phase 17 refactors export.ts to inline its pattern. Consider removing in a cleanup pass if not called from anywhere.

## Open Questions

1. **PNG scale for manual assets: 2x or 1x?**
   - What we know: Preview PNG uses 2x scale for retina quality. The existing pipeline used 1x for SVG-rendered PNGs.
   - What's unclear: Should manual PNG assets also use 2x? This doubles the file size.
   - Recommendation: Use 2x (matching preview) -- users are manually choosing what to export, so they likely want full quality. The scale parameter is trivially changeable later.

2. **Should `downloadAllAssets` be removed or kept?**
   - What we know: After Phase 17, `exportAssets` will inline the download loop pattern. `downloadAllAssets` would be unreferenced.
   - What's unclear: Whether any future phase or external consumer might need it.
   - Recommendation: Keep for now; defer cleanup to post-v2.0 if it remains unused. No harm in having a utility function.

3. **Node ID encoding mismatch in response map**
   - What we know: `fetchFileNodes` handles encoding mismatches (see figma-api.ts:120-133). The `fetchImages` response map may have the same issue.
   - What's unclear: Whether Figma's Images endpoint consistently returns the exact same key format as the input.
   - Recommendation: Add a lookup helper that tries `urlMap[nodeId]` first, then falls back to `urlMap[encodeURIComponent(nodeId)]` and `urlMap[decodeURIComponent(nodeId)]`. Flag this as a test case.

## Sources

### Primary (HIGH confidence)
- Figma REST API docs: https://developers.figma.com/docs/rest-api/file-endpoints/ -- GET /v1/images endpoint parameters, response shape, null URL semantics
- @figma/rest-api-spec `GetImagesResponse` type: `{ err: null, images: { [key: string]: string | null } }` -- verified in `node_modules/@figma/rest-api-spec/dist/api_types.ts`
- Existing codebase: `src/figma-api.ts`, `src/assets/export.ts`, `src/assets/download.ts`, `src/assets/types.ts` -- all read and verified

### Secondary (MEDIUM confidence)
- Figma forum threads on null image URLs: https://forum.figma.com/ask-the-community-7/get-image-by-node-id-stopped-returning-url-32208 -- confirms null URLs are expected for unrenderable nodes

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all existing functions verified by reading source
- Architecture: HIGH -- format-partitioned batching is the only possible pattern given Figma's API design (format is per-call); download loop follows existing proven pattern
- Pitfalls: HIGH -- node ID encoding verified against existing fetchFileNodes handler; null URL handling documented in official API spec; progress arithmetic is straightforward

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable -- Figma Images API has not changed significantly in years)
