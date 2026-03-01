# Phase 26: MainView Rewiring & Cleanup - Research

**Researched:** 2026-03-01
**Domain:** React component cleanup, dead code removal, import graph rewiring
**Confidence:** HIGH

## Summary

Phase 26 is a surgical cleanup phase. The `@S-` detection pipeline (Phase 24) and zero-asset warning (Phase 25) are already fully wired into MainView. The manual asset URL workflow -- `AssetListPanel`, `resolve.ts`, and all supporting state/callbacks in MainView -- is now dead code that coexists alongside the working detection pipeline.

The cleanup is straightforward but has one critical dependency to handle carefully: `detect.ts` imports `resolveFilenameCollision` from `resolve.ts`. This function must be relocated before `resolve.ts` can be deleted. All other deletions (AssetListPanel, resolve.test.ts) have no downstream consumers beyond the files being removed.

**Primary recommendation:** Relocate `resolveFilenameCollision` from `resolve.ts` to `sanitize.ts` (where the related `resolveCollisions` already lives), then delete the manual asset files, strip MainView of all manual asset state/callbacks/UI, and clean up orphaned CSS.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLNP-01 | Manual asset URL workflow removed (AssetListPanel, manual asset state) | Full inventory below: AssetListPanel.tsx, 7 useState/callbacks in MainView, AssetListPanel JSX block, manual asset count in button label, `hasResolvingAssets` guard |
| CLNP-02 | Resolve helpers for manual asset URLs removed | `resolve.ts` and `resolve.test.ts` deletable after relocating `resolveFilenameCollision` to `sanitize.ts`; `detect.ts` import updated |
</phase_requirements>

## Architecture Patterns

### Current Manual Asset Plumbing (to remove)

The manual asset workflow threads through these locations:

**Files to DELETE entirely:**
1. `src/components/AssetListPanel.tsx` -- Manual asset URL input panel (340 lines)
2. `src/assets/resolve.ts` -- Node resolution, I-prefix detection, format suggestion, filename collision resolution (172 lines)
3. `src/assets/resolve.test.ts` -- Tests for resolve.ts (159 lines)

**File with shared dependency (needs function relocation):**
- `src/assets/detect.ts` line 13: `import { resolveFilenameCollision } from './resolve'`
  - This is the ONLY surviving consumer of any `resolve.ts` export
  - `resolveFilenameCollision` is a pure utility function (no manual-asset-specific logic)
  - Natural new home: `src/assets/sanitize.ts` (already contains `resolveCollisions`, same domain)

**MainView state to remove (7 items):**
1. `const [manualAssets, setManualAssets] = useState<ManualAsset[]>([])` (line 149)
2. `handleAddAsset` callback (lines 159-161)
3. `handleRemoveAsset` callback (lines 163-165)
4. `handleClearAssets` callback (lines 167-169)
5. `handleRenameAsset` callback (lines 171-175)
6. `handleAssetResolved` callback (lines 177-181)
7. `handleAssetFormatChange` callback (lines 183-187)

**MainView import to remove:**
- `import { AssetListPanel } from '../components/AssetListPanel'` (line 14)
- `ManualAsset` from type import (line 11) -- only if no other usage remains

**MainView JSX to remove:**
- AssetListPanel block (lines 649-664) -- the entire `{parsedUrl && fileInfo && !validating && shell && (<AssetListPanel ... />)}`

**MainView logic to simplify:**
- `runAssetExport` (line 210-294): Remove `...manualAssets` merge -- only pass `detectedAsManual` assets
  - Line 219: `const allAssets = [...detectedAsManual, ...manualAssets]` becomes `const allAssets = detectedAsManual`
  - The `manualAssets` dependency in the useCallback deps array is removed
- `hasResolvingAssets` guard (line 552): Remove entirely -- no manual assets can be "resolving" anymore
- `extractDisabled` (line 553): Remove `hasResolvingAssets` from the condition
- Button label logic (lines 862-863): Remove the `manualAssets.filter(...)` branch that shows asset count
- `setManualAssets([])` calls in handleUrlChange (lines 345, 380) and handleExtract (line 449 area): Remove
- Comment "manual assets still flow through" (line 534): Update comment to reflect detection-only flow

**ManualAsset type considerations:**
- `ManualAsset` interface in `src/assets/types.ts` is still used by `export.ts`, `export.test.ts`, and `adapt.ts`
- The `adapt.ts` module converts `DetectedAsset[]` to `ManualAsset[]` for the export pipeline
- `ManualAsset` type itself STAYS -- it's the format that `exportAssets()` consumes
- The `'resolving'` and `'error'` status values become dead code on ManualAsset since detected assets are always `'valid'`, but this is cosmetic cleanup that can be deferred (Phase 27 or later)

**CSS to remove from `src/styles.ts`:**
- Lines 215-386: All `.figma-plugin-asset-*` CSS rules (panel, input-row, row, format-badge, filename, edit-input, status indicators, list-header, clear-btn, remove-btn, add-btn, warning)
- Keep `.figma-plugin-hint` -- it is defined earlier in the file (line 83) and is not specific to AssetListPanel

### Recommended Removal Order

This order prevents broken imports at any intermediate step:

1. **Relocate `resolveFilenameCollision`** from `resolve.ts` to `sanitize.ts`; update import in `detect.ts`
2. **Delete `resolve.ts` and `resolve.test.ts`** -- no remaining consumers
3. **Delete `AssetListPanel.tsx`** -- only imported by MainView
4. **Strip MainView** -- remove all manual asset state, callbacks, imports, JSX, and simplify `runAssetExport`
5. **Clean CSS** -- remove orphaned `.figma-plugin-asset-*` rules from `styles.ts`
6. **Run tests** -- verify 343 tests still pass (minus the ~25 tests in resolve.test.ts = ~318 expected)

### `detectedToManual` and `adapt.ts` -- KEEP

`adapt.ts` and `adapt.test.ts` remain necessary. They're the bridge between detection output (`DetectedAsset[]`) and the export pipeline input (`ManualAsset[]`). The naming is slightly misleading now ("manual" is a historical artifact), but renaming is cosmetic and out of scope for this phase.

### Import References -- Complete Map

| File | What it imports from removed files | Action |
|------|-----------------------------------|--------|
| `src/views/MainView.tsx` | `AssetListPanel` from `../components/AssetListPanel` | Remove import |
| `src/views/MainView.tsx` | `ManualAsset` from `../assets/types` | Keep (used by adapt.ts -> runAssetExport) -- but check if MainView still directly references it after cleanup |
| `src/components/AssetListPanel.tsx` | `isInstanceChildId, resolveNode, resolveFilenameCollision` from `../assets/resolve` | File deleted entirely |
| `src/assets/detect.ts` | `resolveFilenameCollision` from `./resolve` | Repoint to `./sanitize` |
| `src/assets/resolve.test.ts` | Multiple from `./resolve` | File deleted entirely |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Filename collision resolution | New implementation in detect.ts | Relocate existing `resolveFilenameCollision` to sanitize.ts | Already tested, works correctly; same file already has `resolveCollisions` |
| Dead code detection | Manual search | grep/search for removed identifiers | Catch any missed references |

## Common Pitfalls

### Pitfall 1: Forgetting the detect.ts dependency on resolve.ts
**What goes wrong:** Deleting resolve.ts breaks `detect.ts` which imports `resolveFilenameCollision`
**Why it happens:** resolve.ts is labeled "manual asset" code but contains a shared utility function
**How to avoid:** Relocate `resolveFilenameCollision` to `sanitize.ts` FIRST, before any deletions
**Warning signs:** TypeScript compile errors after deleting resolve.ts

### Pitfall 2: ManualAsset type still needed by export pipeline
**What goes wrong:** Removing the ManualAsset type breaks export.ts and adapt.ts
**Why it happens:** "Manual" in the name suggests it's part of the manual workflow
**How to avoid:** Keep `ManualAsset` in `types.ts` and `adapt.ts` / `adapt.test.ts` intact. Only remove the ManualAsset _import_ from MainView if MainView no longer directly references it
**Warning signs:** TypeScript errors in export.ts, adapt.ts

### Pitfall 3: Missing `setManualAssets([])` cleanup calls
**What goes wrong:** Leaving stale `setManualAssets` calls causes undefined reference errors
**Why it happens:** manualAssets state clearing is scattered across handleUrlChange and handleExtract
**How to avoid:** Search for ALL occurrences of `manualAssets` and `setManualAssets` in MainView and remove them all
**Warning signs:** Runtime errors when changing URLs or re-extracting

### Pitfall 4: Button label referencing manualAssets
**What goes wrong:** The "Get Brief (N assets)" label crashes because `manualAssets` is undefined
**Why it happens:** The button label has a ternary checking `manualAssets.filter(a => a.status === 'valid').length`
**How to avoid:** Simplify button label to just "Get Brief" (no count -- detected assets flow silently)
**Warning signs:** Runtime error in render

### Pitfall 5: CSS orphans causing confusion in future phases
**What goes wrong:** Dead CSS rules for AssetListPanel remain, causing confusion about whether the panel still exists
**Why it happens:** CSS is in a separate file (styles.ts) and easy to forget
**How to avoid:** Remove lines 215-386 of styles.ts (all `.figma-plugin-asset-*` rules)
**Warning signs:** Searching for `asset-` in styles.ts still returns results after cleanup

### Pitfall 6: `hasResolvingAssets` guard left in extractDisabled
**What goes wrong:** extractDisabled references `manualAssets` which no longer exists
**Why it happens:** The `hasResolvingAssets` const on line 552 reads `manualAssets.some(...)`
**How to avoid:** Remove `hasResolvingAssets` entirely and remove it from the `extractDisabled` condition
**Warning signs:** TypeScript or runtime error on the extractDisabled line

## Code Examples

### Relocating resolveFilenameCollision to sanitize.ts

```typescript
// In src/assets/sanitize.ts -- ADD this function (copy from resolve.ts):
/**
 * Resolve a filename collision against a list of existing filenames.
 * If the candidate is unique, returns it as-is. Otherwise appends
 * -2, -3, etc. before the extension until a unique name is found.
 */
export function resolveFilenameCollision(
  candidateFilename: string,
  existingFilenames: string[],
): string {
  if (!existingFilenames.includes(candidateFilename)) {
    return candidateFilename;
  }
  const dotIndex = candidateFilename.lastIndexOf('.');
  const hasExtension = dotIndex !== -1;
  const base = hasExtension ? candidateFilename.slice(0, dotIndex) : candidateFilename;
  const ext = hasExtension ? candidateFilename.slice(dotIndex) : '';
  let counter = 2;
  while (existingFilenames.includes(`${base}-${counter}${ext}`)) {
    counter++;
  }
  return `${base}-${counter}${ext}`;
}
```

### Updated detect.ts import

```typescript
// In src/assets/detect.ts -- CHANGE line 13:
// FROM: import { resolveFilenameCollision } from './resolve';
// TO:
import { resolveFilenameCollision } from './sanitize';
```

### Simplified runAssetExport in MainView

```typescript
// BEFORE (line 217-219):
const detectedAsManual = detection ? detectedToManual(detection.assets) : [];
const allAssets = [...detectedAsManual, ...manualAssets];
// ...
manualAssets: allAssets,

// AFTER:
const detectedAsManual = detection ? detectedToManual(detection.assets) : [];
// ...
manualAssets: detectedAsManual,
```

### Simplified extractDisabled

```typescript
// BEFORE:
const hasResolvingAssets = manualAssets.some(a => a.status === 'resolving');
const extractDisabled = !parsedUrl || !fileInfo || validating || extracting || exportingAssets || generatingBrief || hasResolvingAssets || zeroAssetWarning;

// AFTER:
const extractDisabled = !parsedUrl || !fileInfo || validating || extracting || exportingAssets || generatingBrief || zeroAssetWarning;
```

### Simplified button label

```typescript
// BEFORE:
: manualAssets.filter(a => a.status === 'valid').length > 0
  ? `Get Brief (${manualAssets.filter(a => a.status === 'valid').length} asset${...})`
  : 'Get Brief';

// AFTER:
: 'Get Brief';
```

## Test Impact Analysis

### Tests to be REMOVED (with deleted files)
- `src/assets/resolve.test.ts` -- 25 tests across 6 describe blocks (isInstanceChildId, extractParentInstanceId, suggestFormat, resolveFilenameCollision, deriveAssetFromNode, resolveNode)

### Tests to RELOCATE
- The 5 `resolveFilenameCollision` tests from `resolve.test.ts` should be moved to `sanitize.test.ts` since the function is moving there

### Tests that MUST STILL PASS (unchanged)
- `src/assets/detect.test.ts` -- uses detect.ts which now imports from sanitize.ts
- `src/assets/export.test.ts` -- uses ManualAsset type (unchanged)
- `src/assets/adapt.test.ts` -- uses detectedToManual (unchanged)
- `src/assets/sanitize.test.ts` -- existing tests plus relocated collision tests
- All other test files (no dependency on removed code)

### Expected test count after cleanup
- Current: 343 tests passing
- Removed: ~20 tests (resolve.test.ts minus the 5 collision tests that relocate)
- Relocated: 5 tests (resolveFilenameCollision -> sanitize.test.ts)
- Expected: ~328 tests passing

## MainView After Cleanup -- State Inventory

After removal, MainView retains these state variables (all necessary):

| State | Purpose | Stays? |
|-------|---------|--------|
| `urlInput` | Figma URL text input | YES |
| `parsedUrl` | Parsed URL parts | YES |
| `fileInfo` | File validation info | YES |
| `validating` | File access check spinner | YES |
| `error` | Error message display | YES |
| `extracting` | Extraction spinner | YES |
| `extractionResult` | Layout extraction output | YES |
| `largeTreeWarning` | Large tree gate | YES |
| `awaitingLargeTreeConfirm` | Large tree user decision | YES |
| `showTree` | Tree preview toggle | YES |
| `exportingAssets` | Export spinner | YES |
| `assetProgress` | Export progress | YES |
| `exportResult` | Export output | YES |
| `generatingBrief` | Brief gen spinner | YES |
| `briefResult` | Brief output | YES |
| `briefError` | Brief error display | YES |
| `zeroAssetWarning` | Zero @S- asset gate | YES |
| `retryCount` | Progressive hint counter | YES |
| `briefMode` | Brief mode selection | YES |
| `inspirationText` | Inspiration mode text | YES |
| `manualAssets` | Manual asset list | **REMOVE** |

## Open Questions

1. **Should `ManualAsset` be renamed to something less confusing?**
   - What we know: The type is used as the export pipeline input format, bridged by `adapt.ts`
   - What's unclear: Whether renaming improves clarity enough to justify the churn
   - Recommendation: Out of scope for Phase 26. If done later, rename to `ExportableAsset` or `AssetInput`

2. **Should `detectedToManual` in adapt.ts be renamed?**
   - Same consideration as above. Functional code, misleading name. Defer renaming.

3. **Should MainView still import `ManualAsset` type after cleanup?**
   - After removing the `manualAssets` state, MainView may no longer directly reference `ManualAsset`. Check whether `runAssetExport` signature still needs it. If `detectedToManual` returns `ManualAsset[]` and it's only passed through, the import can likely be removed from MainView (TypeScript will infer the type).

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of all files in `src/assets/`, `src/components/`, `src/views/MainView.tsx`
- Import graph traced via grep across entire `src/` directory
- Test suite verified: 343 tests passing (vitest run)

## Metadata

**Confidence breakdown:**
- File deletion targets: HIGH -- complete import graph traced, no hidden consumers
- Function relocation: HIGH -- `resolveFilenameCollision` is a pure function with well-defined interface
- MainView cleanup: HIGH -- all manual asset plumbing identified by systematic grep
- Test impact: HIGH -- test files directly correspond to removed source files

**Research date:** 2026-03-01
**Valid until:** Indefinite (cleanup of existing codebase, no external dependencies)
