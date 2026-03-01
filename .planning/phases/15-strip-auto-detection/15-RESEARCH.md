# Phase 15: Strip Auto-Detection - Research

**Researched:** 2026-03-01
**Domain:** Codebase refactoring / dead code removal
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Deletion strategy:** Hollow out `export.ts` -- remove identifyAssets/detectCompositions calls but keep preview PNG generation and the download pipeline. Phase 17 will refactor it to accept ManualAsset[].
- **Keep `breadcrumb.ts`** (86 lines) -- may be useful for Phase 18 layout tree cross-referencing. Delete later if not needed.
- **Remove the imageFills pipeline** (`fetchImageFills` usage, `collectImageFillsFromRawTree`). With manual control, users point at nodes directly and get PNG renders via `fetchImages`. No need for imageRef resolution.
- **Delete `identify.ts`** (306 lines) and its test file entirely.
- **Delete `detect-composition.ts`** (208 lines) and its test file entirely.
- **Asset types cleanup:** Remove 'composition' and 'component' from the assetType union. Simplify to 'icon' | 'image' (or defer exact typing to Phase 16 ManualAsset).
- **Test handling:** All tests must pass after Phase 15. Delete identify.test.ts and detect-composition.test.ts alongside their modules. Fix generate.test.ts references to 'composition'/'component' asset types.

### Claude's Discretion
- Exact order of file deletions vs. reference updates (as long as tests pass at the end)
- Whether to delete AssetEntry type now or leave for Phase 16
- Brief empty state presentation (omit Assets section entirely, or show header with a note)
- How to handle any other dangling references to deleted modules
- How to fix generate.test.ts -- remove composition test cases, update type references, whatever produces a green suite

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLEAN-01 | All automatic asset detection code is removed (identify.ts, detect-composition.ts) | File deletion map + import chain analysis below |
| CLEAN-02 | All tests for removed auto-detection code are removed or replaced | Test file deletion + generate.test.ts fix analysis below |
| CLEAN-03 | Brief generator is updated to remove composition/illustration-specific logic | Composition logic inventory in generate.ts below |
| EXPT-03 | Plugin generates a brief with zero assets if the list is empty (layout + tokens + preview only) | Brief empty-state analysis below |
| EXPT-04 | Full-page preview PNG remains auto-generated | Preview PNG pipeline analysis below |
</phase_requirements>

## Summary

This phase is a surgical deletion: remove auto-detection modules and all their tentacles, simplify types, and verify the plugin still compiles and passes all tests. No new libraries, no new patterns -- just careful code removal and type narrowing.

The codebase currently has 325 passing tests across 9 test files. Two entire test files (68 tests total) will be deleted alongside their modules. The remaining 257 tests must all pass, with specific fixes needed in `generate.test.ts` (2 tests reference 'composition'/'component' asset types that will be removed).

The core challenge is tracing the import chain correctly. `export.ts` is the hub -- it imports from both `identify.ts` and `detect-composition.ts`, uses `fetchImageFills` from `figma-api.ts`, and receives `imageFills`/`instancesWithText` from `MainView.tsx`. All of these connections must be severed cleanly while preserving the preview PNG pipeline and download infrastructure.

**Primary recommendation:** Delete files first, then fix compilation errors by hollowing out `export.ts` and simplifying types. This creates immediate compiler feedback for any missed references. Run `npx vitest --run` as the final gate.

## Standard Stack

No new libraries needed. This phase is pure deletion/refactoring within the existing stack.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | (project version) | Type checking catches dangling references | Compiler errors surface every broken import |
| Vitest | 4.0.18 | Test runner | Already configured, 325 tests passing |

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | `vite.config.ts` (Vitest uses Vite config) |
| Quick run command | `npx vitest --run` |
| Full suite command | `npx vitest --run` (same -- all tests are unit, runs in ~165ms) |

## Architecture Patterns

### Current Import Chain (to be severed)

```
MainView.tsx
  └─ exportAssets() from assets/export.ts
       ├─ identifyAssets() from assets/identify.ts       ← DELETE
       ├─ detectCompositions() from assets/detect-composition.ts  ← DELETE
       ├─ fetchImageFills() from figma-api.ts            ← REMOVE USAGE (keep function)
       ├─ fetchImages() from figma-api.ts                ← KEEP (preview PNG)
       └─ downloadAllAssets() from assets/download.ts    ← KEEP

MainView.tsx passes to exportAssets:
  - rootNodes: LayoutNode[]         ← REMOVE from ExportAssetsOptions
  - imageFills: ImageFillRef[]      ← REMOVE from ExportAssetsOptions
  - instancesWithText: Set<string>  ← REMOVE from ExportAssetsOptions

generate.ts:
  - compositionNodeIds logic        ← REMOVE
  - assetTypeLabel 'composition'/'component' cases  ← REMOVE
  - renderTree compositionNodeIds param  ← REMOVE
```

### Target State After Phase 15

```
MainView.tsx
  └─ exportAssets() from assets/export.ts
       ├─ fetchImages() from figma-api.ts   (preview PNG only)
       └─ downloadAllAssets() from assets/download.ts (no-op with empty list)

export.ts:
  - Receives: shell, token, fileKey, selectedNodeId, projectPath, onProgress
  - Does: prepareAssetsDir → render preview PNG → return result with empty assets[]

generate.ts:
  - No compositionNodeIds concept
  - assetTypeLabel handles 'icon' | 'image' only
  - Assets section: renders preview row + whatever assets[] contains (empty = preview only)
```

### Recommended File Structure After Phase 15

```
src/assets/
├── breadcrumb.ts        # KEPT (86 lines, Phase 18 may need)
├── breadcrumb.test.ts   # KEPT (25 tests)
├── download.ts          # KEPT (94 lines, reusable)
├── export.ts            # MODIFIED (hollowed out -- preview only)
├── sanitize.ts          # KEPT (55 lines, Phase 16 needs)
├── sanitize.test.ts     # KEPT (15 tests)
└── types.ts             # MODIFIED (simplified assetType union)
```

Deleted files:
```
src/assets/identify.ts                 # 306 lines → DELETED
src/assets/identify.test.ts            # 51 tests → DELETED
src/assets/detect-composition.ts       # 208 lines → DELETED
src/assets/detect-composition.test.ts  # 17 tests → DELETED
```

### Pattern: Hollowed-Out export.ts

After stripping auto-detection, `exportAssets()` becomes a preview-only function:

```typescript
// Target shape of export.ts after Phase 15
import type { Shell } from '../types';
import type { AssetExportProgress, ExportResult } from './types';
import { fetchImages } from '../figma-api';
import { prepareAssetsDir, downloadFile } from './download';

export interface ExportAssetsOptions {
  shell: Shell;
  token: string;
  fileKey: string;
  selectedNodeId: string;
  projectPath: string;
  onProgress?: (progress: AssetExportProgress) => void;
}

export async function exportAssets(options: ExportAssetsOptions): Promise<ExportResult> {
  const { shell, token, fileKey, selectedNodeId, projectPath, onProgress } = options;
  const warnings: string[] = [];

  // 1. Create fresh assets directory
  const assetsDir = await prepareAssetsDir(shell, projectPath);

  // 2. Preview PNG (unchanged)
  if (onProgress) onProgress({ current: 0, total: 1, currentAsset: 'preview.png', phase: 'preview' });
  let previewPath = `${assetsDir}/preview.png`;
  try {
    const previewUrls = await fetchImages(shell, token, fileKey, [selectedNodeId], 'png', 2);
    const previewUrl = previewUrls[selectedNodeId];
    if (previewUrl) {
      const result = await downloadFile(shell, previewUrl, previewPath);
      if (!result.success) {
        warnings.push(`Preview download failed: ${result.error}`);
        previewPath = '';
      }
    } else {
      warnings.push('Figma could not render preview for this node');
      previewPath = '';
    }
  } catch (err: any) {
    warnings.push(`Preview render failed: ${err?.message || 'Unknown error'}`);
    previewPath = '';
  }

  // 3. No auto-detected assets -- empty list
  return {
    assetsDir,
    previewPath,
    assets: [],
    warnings,
  };
}
```

### Pattern: Simplified types.ts

```typescript
// Target shape after Phase 15
export interface AssetEntry {
  nodeId: string;
  nodeName: string;
  exportType: 'svg' | 'png-render' | 'png-fill';
  filename: string;
  imageRef?: string;
  parentInstanceId?: string;
}
// NOTE: AssetEntry can be kept for now (Phase 16 will replace with ManualAsset)
// OR deleted -- Claude's discretion per CONTEXT.md

export interface AssetExportProgress {
  current: number;
  total: number;
  currentAsset: string;
  phase: 'preview' | 'assets';
}

export interface ExportResult {
  assetsDir: string;
  previewPath: string;
  assets: {
    filename: string;
    path: string;
    nodeId?: string;
    assetType?: 'icon' | 'image';  // simplified -- no 'composition' | 'component'
    parentInstanceId?: string;
  }[];
  warnings: string[];
}
```

### Anti-Patterns to Avoid
- **Partial deletion:** Deleting a module file but leaving its import in another file. TypeScript compilation catches this, so always run `npx tsc --noEmit` or `npx vitest --run` after deletions.
- **Leaving dead types:** Keeping 'composition' | 'component' in the union "just in case." The whole point of this phase is clean removal.
- **Fixing tests by loosening types:** If a test references a removed type, delete/fix the test -- don't widen the type to make it compile.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Finding all references to deleted code | Manual grep | TypeScript compiler (`npx tsc --noEmit`) | Compiler catches every import/type reference automatically |
| Verifying no test regressions | Manual review | `npx vitest --run` | Full suite runs in ~165ms, catches everything |

**Key insight:** TypeScript + Vitest are the primary tools here. Delete files, let the compiler complain, fix every complaint, run tests.

## Common Pitfalls

### Pitfall 1: Missing the imageFills Pipeline in extract.ts
**What goes wrong:** `collectImageFillsFromRawTree` in `layout/extract.ts` (lines 51-78) is part of the imageFills pipeline. Per the user decision, this pipeline should be removed. But `extract.ts` also feeds `tokens.imageFills` which is part of `DesignTokens`. Removing usage in `export.ts` is not enough -- the `extractLayout()` function in `extract.ts` still calls `collectImageFillsFromRawTree` and merges results into `tokens.imageFills`.
**Why it happens:** The imageFills pipeline spans two modules: `layout/extract.ts` (collection) and `assets/export.ts` (consumption).
**How to avoid:** Decision scope says "remove the imageFills pipeline (`fetchImageFills` usage, `collectImageFillsFromRawTree`)." Remove the `collectImageFillsFromRawTree` function from `extract.ts`, remove the raw imageFills collection in `extractLayout()` (lines 172-205), and remove `instancesWithText` collection (lines 179-185) since it was only used by `identifyAssets`. Keep `collectInstancesWithText` function if it may be useful later, or delete it since its only consumer was auto-detection.
**Warning signs:** `tokens.imageFills` still being populated but never consumed.

**IMPORTANT NUANCE:** The `imageFills` field on `DesignTokens` and the `collectTokens` function in `tokens/collect.ts` also collect image fills (lines 107, 148, 359). That collection is part of the token system, not the asset pipeline. The user decision says to remove `collectImageFillsFromRawTree` (the raw-tree pre-normalization pass) and `fetchImageFills` usage (in export.ts). Whether to also remove `imageFills` from `DesignTokens` and `collectTokens` is a judgment call -- it could be left for Phase 16 since it does no harm and `tokens.imageFills` data might be useful metadata in the brief later. Safest approach: remove `collectImageFillsFromRawTree` and the merge logic in `extractLayout()`, but leave `collectTokens` imageFills collection intact.

### Pitfall 2: MainView.tsx Signature Mismatch
**What goes wrong:** `MainView.tsx` (line 151-161) passes `rootNodes`, `imageFills`, and `instancesWithText` to `exportAssets()`. If these are removed from `ExportAssetsOptions` without updating MainView, TypeScript will error.
**Why it happens:** The caller and callee must be updated in sync.
**How to avoid:** When simplifying `ExportAssetsOptions`, also update the `runAssetExport` callback in `MainView.tsx` to stop passing removed fields.
**Warning signs:** TypeScript errors on `MainView.tsx` after changing `export.ts`.

### Pitfall 3: download.ts assetType Union
**What goes wrong:** `download.ts` has inline type literals `'icon' | 'image' | 'composition' | 'component'` repeated 4 times (lines 62, 64, 65, 83). These must be narrowed to `'icon' | 'image'`.
**Why it happens:** The type is inlined rather than imported from types.ts, so it must be updated separately.
**How to avoid:** Update all 4 inline type references in `download.ts`. Consider extracting to a named type in `types.ts` to prevent future drift, but that's optional cleanup.
**Warning signs:** TypeScript still allows 'composition' | 'component' values through the download pipeline.

### Pitfall 4: generate.test.ts Has 2 Tests Referencing Removed Types
**What goes wrong:** Tests at lines 635-645 (`'renders Composition type for composition assets'`) and 764-775 (`'preserves existing behavior: instance shows -> component.png for direct asset match'`) reference `assetType: 'composition'` and `assetType: 'component'`. These will fail after removing those type variants.
**Why it happens:** Tests reflect old behavior that is being removed.
**How to avoid:** Delete the composition test entirely. For the component test, either delete it or change `assetType: 'component'` to `assetType: 'image'` and update the expected label -- depends on what makes sense for the remaining test coverage.
**Warning signs:** Test failures in generate.test.ts after type changes.

### Pitfall 5: generate.ts compositionNodeIds Logic
**What goes wrong:** `generate.ts` has composition-specific code in 3 locations: (1) Building `compositionNodeIds` set (lines 49-55), (2) Passing it to `buildLayoutTreeSection` (line 71), (3) The `[Illustration]` collapsed-subtree logic in `renderTree` (lines 152-161). All must be removed.
**Why it happens:** Composition detection was deeply integrated into the layout tree rendering.
**How to avoid:** Remove the compositionNodeIds variable, remove the parameter from `buildLayoutTreeSection` and `renderTree`, remove the `[Illustration]` branch in `renderTree`. The `assetTypeLabel` function should have its 'composition' and 'component' cases removed.
**Warning signs:** Brief output still contains "[Illustration]" lines.

### Pitfall 6: Brief Empty State for EXPT-03
**What goes wrong:** If assets is empty but previewPath exists, `buildAssetsSection` currently renders an Assets table with just the preview row. This is correct behavior for EXPT-03. But if both are empty, the section is omitted entirely (line 509). This is also correct.
**Why it happens:** The existing code already handles empty assets gracefully.
**How to avoid:** Verify the existing behavior is correct and test it. No code change needed for the empty-state logic -- it already works.
**Warning signs:** None -- existing test at line 701 (`'omits assets section when no assets and no preview'`) already covers this.

## Code Examples

### Example 1: Fixing MainView.tsx exportAssets Call

Current call (lines 151-161):
```typescript
const exportRes = await exportAssets({
  shell: shellRef.current,
  token,
  fileKey: result.fileKey,
  selectedNodeId: parsedUrl.nodeId || result.extraction.rootNodes[0]?.id || '0:0',
  projectPath: ctx?.project?.path ?? '.',
  rootNodes: result.extraction.rootNodes,      // REMOVE
  imageFills: result.tokens.imageFills,         // REMOVE
  instancesWithText: result.instancesWithText,  // REMOVE
  onProgress: setAssetProgress,
});
```

Target:
```typescript
const exportRes = await exportAssets({
  shell: shellRef.current,
  token,
  fileKey: result.fileKey,
  selectedNodeId: parsedUrl.nodeId || result.extraction.rootNodes[0]?.id || '0:0',
  projectPath: ctx?.project?.path ?? '.',
  onProgress: setAssetProgress,
});
```

### Example 2: Removing Composition Warning Filter in MainView.tsx

Current code (lines 597-599) filters composition warnings:
```typescript
const compositionWarnings = allWarnings.filter(w => w.startsWith('Composition "') || w.startsWith('Illustration "'));
const actionableWarnings = allWarnings.filter(w => !w.startsWith('Composition "') && !w.startsWith('Illustration "'));
```

After Phase 15, no composition warnings will ever be generated, so this filter is dead code. Simplify to:
```typescript
const actionableWarnings = allWarnings;
```

Also remove the composition count display (lines 545-553):
```typescript
// REMOVE: No more composition asset types
const compCount = exportResult.assets.filter(a => a.assetType === 'composition').length;
```

### Example 3: Stripping compositionNodeIds from generate.ts

Remove the construction (lines 49-55):
```typescript
// DELETE these lines:
const compositionNodeIds = new Set<string>();
// ...
if (asset.assetType === 'composition') {
  compositionNodeIds.add(asset.nodeId);
}
```

Simplify `buildLayoutTreeSection` signature:
```typescript
// FROM:
function buildLayoutTreeSection(rootNodes, assetNodeMap, compositionNodeIds)
// TO:
function buildLayoutTreeSection(rootNodes, assetNodeMap)
```

Remove the `[Illustration]` branch in `renderTree`:
```typescript
// DELETE this entire block (lines 152-161):
if (compositionNodeIds.has(node.id)) {
  const indent = '  '.repeat(depth);
  const filename = assetNodeMap.get(node.id);
  // ...
  lines.push(`${indent}[Illustration] '${node.name}'${dims}${ref}`);
  return;
}
```

### Example 4: Simplifying assetTypeLabel

```typescript
// FROM:
function assetTypeLabel(assetType?: 'icon' | 'image' | 'composition' | 'component'): string {
  switch (assetType) {
    case 'icon': return 'Icon';
    case 'image': return 'Image';
    case 'composition': return 'Composition';
    case 'component': return 'Component';
    default: return 'File';
  }
}

// TO:
function assetTypeLabel(assetType?: 'icon' | 'image'): string {
  switch (assetType) {
    case 'icon': return 'Icon';
    case 'image': return 'Image';
    default: return 'File';
  }
}
```

## Complete Change Inventory

### Files to DELETE (4 files, ~514 lines, 68 tests)
| File | Lines | Tests | Reason |
|------|-------|-------|--------|
| `src/assets/identify.ts` | 306 | -- | Auto-detection core |
| `src/assets/identify.test.ts` | ~730 | 51 | Tests for deleted module |
| `src/assets/detect-composition.ts` | 208 | -- | Composition detection |
| `src/assets/detect-composition.test.ts` | ~320 | 17 | Tests for deleted module |

### Files to MODIFY (6 files)
| File | Changes |
|------|---------|
| `src/assets/export.ts` | Remove identifyAssets/detectCompositions imports + calls. Remove imageFills/instancesWithText from options. Remove SVG/fill/png-render batch API calls. Remove download list construction. Keep preview PNG + return empty assets. |
| `src/assets/types.ts` | Remove 'composition' \| 'component' from ExportResult.assets.assetType union. Optionally simplify/keep AssetEntry. |
| `src/assets/download.ts` | Narrow inline assetType unions from `'icon' \| 'image' \| 'composition' \| 'component'` to `'icon' \| 'image'` (4 locations). |
| `src/brief/generate.ts` | Remove compositionNodeIds construction + parameter threading. Remove [Illustration] branch in renderTree. Remove 'composition'/'component' from assetTypeLabel. |
| `src/brief/generate.test.ts` | Delete/fix 2 tests: 'renders Composition type' test and 'instance shows -> component.png' test. |
| `src/views/MainView.tsx` | Remove rootNodes/imageFills/instancesWithText from exportAssets call. Remove composition count display. Simplify warning filter. |

### Files to POSSIBLY modify (2 files -- depends on scope interpretation)
| File | Changes | Decision |
|------|---------|----------|
| `src/layout/extract.ts` | Remove `collectImageFillsFromRawTree` function, raw imageFills collection (lines 172-205), and possibly `collectInstancesWithText` and `instancesWithText` from result. | User said "remove the imageFills pipeline (`fetchImageFills` usage, `collectImageFillsFromRawTree`)." This strongly implies removing from extract.ts too. `instancesWithText` was only consumed by identifyAssets, so it can also be removed. |
| `src/tokens/types.ts` | Possibly remove `imageFills: ImageFillRef[]` from `DesignTokens` and `ImageFillRef` type. | Conservative approach: leave intact. `collectTokens` still collects them, and removing from DesignTokens cascades to collect.ts and collect.test.ts. Can defer to Phase 16. |

### Files EXPLICITLY kept (per user decision)
| File | Reason |
|------|--------|
| `src/assets/breadcrumb.ts` | Phase 18 may need it for layout tree cross-referencing |
| `src/assets/breadcrumb.test.ts` | Tests for kept module |
| `src/assets/sanitize.ts` | Phase 16 needs it for filename sanitization |
| `src/assets/sanitize.test.ts` | Tests for kept module |
| `src/assets/download.ts` | Reusable download pipeline |
| `src/figma-api.ts` (fetchImageFills function) | Keep the function -- just remove usage in export.ts. Other consumers may use it later. |

## Open Questions

1. **How deep to cut the imageFills pipeline in extract.ts?**
   - What we know: User said "remove the imageFills pipeline (`fetchImageFills` usage, `collectImageFillsFromRawTree`)." This clearly covers `collectImageFillsFromRawTree` and `fetchImageFills` usage in `export.ts`.
   - What's unclear: Should we also remove `instancesWithText` collection from `extract.ts` and `ExtractLayoutResult`? Its only consumer was `identifyAssets`.
   - Recommendation: Remove both `collectImageFillsFromRawTree` and `collectInstancesWithText` from `extract.ts`, remove `instancesWithText` from `ExtractLayoutResult`. They served only auto-detection. Leave `imageFills` in `DesignTokens`/`collectTokens` (token-level metadata, not asset pipeline).

2. **Should AssetEntry type be deleted or kept?**
   - What we know: User said "Claude's discretion on whether to delete now or let Phase 16 replace it with ManualAsset."
   - Recommendation: Keep `AssetEntry` for now. It is imported by `sanitize.ts` (`resolveCollisions` takes `AssetEntry[]`). Deleting it now requires either removing `resolveCollisions` or changing its signature -- unnecessary churn. Phase 16 will replace it cleanly with `ManualAsset`.

## Sources

### Primary (HIGH confidence)
- Direct source code reading of all affected files in the project
- `npx vitest --run` output: 325 tests passing, 9 test files, ~165ms runtime
- CONTEXT.md user decisions for Phase 15

### Confidence Assessment
All findings are HIGH confidence -- based on direct source code inspection of the actual codebase, not external documentation or training data. The change inventory was produced by tracing every import and type reference through the actual code.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, existing Vitest + TypeScript
- Architecture: HIGH -- based on direct code reading of all affected files
- Pitfalls: HIGH -- every pitfall identified from actual code line numbers and import chains

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable -- internal refactoring, no external dependencies)
