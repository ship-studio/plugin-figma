# Phase 18: Brief Generator Updates - Research

**Researched:** 2026-03-01
**Domain:** Brief generation -- asset-to-layout cross-referencing and type label simplification
**Confidence:** HIGH

## Summary

Phase 18 is a focused refactoring of the brief generator (`src/brief/generate.ts`) and its tests to correctly map manually-added assets to their positions in the layout tree. The current codebase already has all the foundational infrastructure: breadcrumb mapping (`src/assets/breadcrumb.ts`), node ID propagation from the export pipeline, and the brief's Assets table with a Location column. The work is small in scope but precise -- wiring ManualAsset nodeIds through breadcrumb lookups and simplifying asset type labels.

The export pipeline (Phase 17) already populates `ExportResult.assets[].nodeId` from `ManualAsset.nodeId` for every successfully downloaded asset. The breadcrumb system already walks the normalized layout tree and produces `Map<nodeId, breadcrumbPath>`. The brief generator already calls `buildBreadcrumbMap` and passes the result to `buildAssetsSection`. **The cross-referencing pathway already works for assets whose nodeIds appear in the tree.** The gap is handling assets whose node IDs do NOT appear in the tree (instance-child I-prefix IDs) and ensuring the type labels use the simplified "Icon"/"Image" vocabulary.

**Primary recommendation:** This phase requires minimal new code -- mainly adjusting the `buildAssetsSection` function to handle the already-existing `parentInstanceId` fallback correctly for manual assets, ensuring the `assetTypeLabel` function is clean of legacy terminology, and writing/updating tests to verify all three success criteria.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EXPT-02 | Plugin maps each exported asset to its position in the layout tree by node ID | The breadcrumb system (`buildBreadcrumbMap`) and the brief generator's `buildAssetsSection` already implement this lookup. Manual assets get their `nodeId` threaded through `exportAssets` into `ExportResult.assets[].nodeId`. The only gap is ensuring instance-child node IDs that fail direct lookup fall back gracefully. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | (existing) | Test framework | Already used by all tests in this project |
| TypeScript | (existing) | Type safety | All source is TypeScript |

### Supporting
No new libraries needed. This phase modifies existing pure functions only.

### Alternatives Considered
None -- this is internal refactoring of existing code with no new dependencies.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/
│   ├── breadcrumb.ts          # buildBreadcrumbMap (unchanged)
│   ├── types.ts               # ExportResult, ManualAsset (unchanged)
│   └── export.ts              # exportAssets (unchanged -- already threads nodeId)
├── brief/
│   ├── generate.ts            # MODIFIED: update buildAssetsSection, assetTypeLabel
│   ├── generate.test.ts       # MODIFIED: add/update tests for cross-referencing
│   └── types.ts               # BriefInput (unchanged)
└── layout/
    └── types.ts               # LayoutNode (unchanged)
```

### Pattern 1: Breadcrumb Lookup with Fallback Chain
**What:** When looking up an asset's location in the layout tree, try the direct `nodeId` first, then fall back to `parentInstanceId` for instance-child nodes, then show `--` as a last resort.
**When to use:** Every asset row in `buildAssetsSection`.
**Current implementation (already exists in generate.ts lines 506-508):**
```typescript
let location = '--';
if (asset.nodeId) {
  location = breadcrumbMap.get(asset.nodeId)
    || (asset.parentInstanceId
      ? (breadcrumbMap.get(asset.parentInstanceId) || '--')
      : '--');
}
```
**Assessment:** This logic already handles the three-tier fallback correctly. The only consideration is that manual assets coming from the export pipeline may NOT have `parentInstanceId` set (the current `exportAssets` does not set it). For Phase 18, the fallback to `--` is the correct graceful degradation per success criterion 3.

### Pattern 2: Asset Type Labels from Format
**What:** Map asset format to display label: SVG -> "Icon", PNG -> "Image".
**When to use:** The `assetTypeLabel` function in generate.ts.
**Current implementation (already correct, lines 525-531):**
```typescript
function assetTypeLabel(assetType?: 'icon' | 'image'): string {
  switch (assetType) {
    case 'icon': return 'Icon';
    case 'image': return 'Image';
    default: return 'File';
  }
}
```
**Assessment:** Already correct. The export pipeline (export.ts line 136) maps `format === 'svg'` to `assetType: 'icon'` and everything else to `assetType: 'image'`. No composition/illustration terminology exists anywhere.

### Pattern 3: Instance Line Cross-Reference in Layout Tree
**What:** When rendering an INSTANCE node in the layout tree, annotate it with `-> filename` if an asset matches that node.
**Current implementation (generate.ts lines 46-57, 211-214):**
```typescript
// In generateBrief():
const assetNodeMap = new Map<string, string>();
for (const asset of exportResult.assets) {
  if (asset.nodeId) {
    assetNodeMap.set(asset.nodeId, asset.filename);
  }
  if (asset.parentInstanceId && !assetNodeMap.has(asset.parentInstanceId)) {
    assetNodeMap.set(asset.parentInstanceId, asset.filename);
  }
}

// In renderNodeLine():
const assetFile = assetNodeMap?.get(node.id);
if (assetFile) {
  label += ` -> ${assetFile}`;
}
```
**Assessment:** This works for direct matches (asset nodeId = INSTANCE id in tree). For manual assets, the user explicitly selects nodes by URL, so the nodeId will be the node they pointed at. If they pointed at a top-level INSTANCE, the cross-reference in the tree works. If they pointed at a child inside an INSTANCE (I-prefix), the `parentInstanceId` mapping in the assetNodeMap handles the tree annotation. However -- the current export pipeline does NOT populate `parentInstanceId` on manual assets. This is an intentional design choice because manual asset nodes are chosen by the user, not auto-detected from instance internals. The `parentInstanceId` was a v1.x concept for auto-detected instance-child images.

### Anti-Patterns to Avoid
- **Introducing new terminology:** Do not add "composition", "illustration", "component" (as asset type), or "vector-only group" labels. Only "Icon" and "Image" are used.
- **Deep-walking instance children for breadcrumb:** The breadcrumb map only covers the normalized tree, which treats INSTANCE nodes as leaves. Do not try to extend breadcrumbs into instance internals -- the `--` fallback is the correct behavior per SC-3.
- **Modifying the export pipeline:** Phase 18 is brief-generator-only. Do not modify `export.ts`, `resolve.ts`, or `breadcrumb.ts`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Breadcrumb path computation | Custom tree walker in generate.ts | `buildBreadcrumbMap` from breadcrumb.ts | Already handles generic name skipping, smart truncation, multi-root trees |
| Filename sanitization | Manual string cleanup | `sanitizeFilename` from sanitize.ts | Already tested with edge cases |
| Node ID matching variants | Multiple lookup attempts | `lookupUrl` pattern from export.ts | Already handles encoded/decoded variants (though not needed for breadcrumb map which uses normalized IDs) |

**Key insight:** The cross-referencing infrastructure is already fully built. Phase 18 is about verifying it works correctly with the ManualAsset flow and adding test coverage to prove it.

## Common Pitfalls

### Pitfall 1: Instance-Child Node IDs in Breadcrumb Map
**What goes wrong:** Expecting I-prefix node IDs (like "I20:1;20:2") to appear in the breadcrumb map. They won't, because the normalized tree treats INSTANCE nodes as leaves and never descends into their children.
**Why it happens:** The breadcrumb walker (`walkForBreadcrumbs`) follows `node.children`, but `renderTree` stops recursing at INSTANCE nodes (`if (node.componentRef) return`). The breadcrumb walker does walk into instances (it has no such guard), but the normalized tree itself doesn't have instance children -- they're pruned during normalization.
**How to avoid:** Accept `--` for instance-child node IDs. This is explicit in success criterion 3.
**Warning signs:** Tests that construct I-prefix nodeIds and expect a breadcrumb match against the tree will fail. Use `parentInstanceId` fallback in the test setup if cross-referencing is desired.

### Pitfall 2: parentInstanceId Not Set on Manual Assets
**What goes wrong:** Assuming `ExportResult.assets[].parentInstanceId` is populated for manual assets.
**Why it happens:** The old auto-detection pipeline populated `parentInstanceId` when it found images inside INSTANCE nodes. The new `exportAssets` (Phase 17) does NOT set `parentInstanceId` -- it only sets `nodeId` and `assetType` (see export.ts lines 132-137).
**How to avoid:** For Phase 18, the brief generator's existing code already handles `parentInstanceId` being undefined -- it falls through to `--`. Do not try to derive `parentInstanceId` in the brief generator; that's the export pipeline's job and out of scope for this phase.
**Warning signs:** Existing tests that use `parentInstanceId` on asset fixtures still pass because the code handles the presence gracefully. But new tests should NOT assume it's present for manual assets unless the test explicitly sets it.

### Pitfall 3: Empty Breadcrumb for Root-Level Assets
**What goes wrong:** An asset whose nodeId matches the root frame gets an empty string breadcrumb (or the root name only), which looks odd in the table.
**Why it happens:** If the root frame has a generic name (e.g., "Frame 1"), `buildBreadcrumbMap` returns `""` for it. The breadcrumb of `""` is falsy, so the fallback `|| '--'` kicks in, showing `--`.
**How to avoid:** This is actually correct behavior and already handled. Verify with a test that a root-level asset with generic frame name shows `--`.

### Pitfall 4: Breadcrumb Map Input Source
**What goes wrong:** Using the wrong root nodes for breadcrumb computation.
**Why it happens:** `generateBrief` has two potential sources: `input.rootNodes` and `extraction.extraction.rootNodes`. Line 60 prefers `input.rootNodes` as an override.
**How to avoid:** The caller (MainView.tsx line 182) already passes `rootNodes: result.extraction.rootNodes`, so these are the same. No action needed, but tests should be aware of this.

## Code Examples

### Current Asset Table Output (verified from existing tests)
```markdown
## Assets

| File | Type | Location | Path |
|------|------|----------|------|
| preview.png | Preview | -- | .shipstudio/assets/preview.png |
| arrow-icon.svg | Icon | Hero Section > Header > ArrowIcon | .shipstudio/assets/arrow-icon.svg |
| hero.png | Image | -- | .shipstudio/assets/hero.png |
```

### Test Pattern: Asset with Breadcrumb Location (from generate.test.ts)
```typescript
it('renders breadcrumb location from rootNodes', () => {
  const rootNode: LayoutNode = {
    id: '1:1', name: 'Hero Section', type: 'FRAME', visible: true,
    children: [
      { id: '2:1', name: 'Header', type: 'FRAME', visible: true,
        children: [
          { id: '3:1', name: 'ArrowIcon', type: 'VECTOR', visible: true },
        ],
      },
    ],
  };
  const input = makeInput({
    extraction: makeExtraction([rootNode]),
    exportResult: makeExportResult({
      assets: [
        { filename: 'arrow-icon.svg', path: '...', nodeId: '3:1', assetType: 'icon' },
      ],
    }),
  });
  const result = generateBrief(input);
  expect(result.markdown).toContain(
    '| arrow-icon.svg | Icon | Hero Section > Header > ArrowIcon | ... |'
  );
});
```

### Test Pattern: Instance-Child Fallback (from generate.test.ts)
```typescript
it('shows breadcrumb for instance child image via parentInstanceId fallback', () => {
  // ... rootNode with INSTANCE at id '22:1' ...
  const input = makeInput({
    exportResult: makeExportResult({
      assets: [{
        filename: 'product-photo.png',
        path: '...',
        nodeId: 'I22:1;22:2',  // I-prefix: NOT in tree
        assetType: 'image',
        parentInstanceId: '22:1',  // Fallback: IS in tree
      }],
    }),
  });
  // Breadcrumb of '22:1' is "Hero Section > Product Card"
  expect(result.markdown).toContain(
    '| product-photo.png | Image | Hero Section > Product Card |'
  );
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Auto-detected assets with composition/illustration labels | Manual assets with Icon/Image labels only | Phase 15 (2026-03-01) | Simplified type system, no auto-detection code |
| `identify.ts` + `detect-composition.ts` tree walking | User provides node URLs, pipeline exports what user specifies | Phase 15-17 (2026-03-01) | Deterministic, user-controlled asset selection |
| `assetType: 'composition' \| 'component' \| 'icon' \| 'image'` | `assetType: 'icon' \| 'image'` | Phase 15 (2026-03-01) | Clean two-value union |

**Deprecated/outdated:**
- `'composition'` and `'component'` asset types -- fully removed in Phase 15
- `identify.ts`, `detect-composition.ts` -- deleted in Phase 15
- `[Illustration]` tree line prefix -- removed in Phase 15

## Open Questions

1. **Should the brief generator handle the case where a manual asset's node IS in the tree but is inside a collapsed INSTANCE subtree?**
   - What we know: INSTANCE nodes are leaf nodes in the normalized tree. Their children are NOT in the tree. If a user exports a node that happens to be a child of an INSTANCE (without I-prefix), it would be in the raw Figma data but not the normalized tree.
   - What's unclear: Can a user specify a non-I-prefix node that's inside an INSTANCE? In practice, Figma node URLs for elements inside component instances use I-prefix IDs, so this is unlikely.
   - Recommendation: Accept `--` for these cases. The I-prefix detection at add-time (AINP-05, Phase 16) already warns users about instance children. No additional handling needed.

2. **Should `parentInstanceId` be derived from I-prefix node IDs in the brief generator?**
   - What we know: `extractParentInstanceId` in resolve.ts can parse "I20:1;20:2" -> "20:1". The export pipeline currently does NOT call this or set parentInstanceId.
   - What's unclear: Whether the brief generator should independently derive parentInstanceId from nodeId for breadcrumb fallback, or whether that should be the export pipeline's responsibility.
   - Recommendation: The brief generator could optionally derive parentInstanceId if not set, using `isInstanceChildId` and `extractParentInstanceId` from resolve.ts. This would enable breadcrumb fallback for I-prefix assets even though the export pipeline doesn't set it. This is a small, self-contained enhancement that improves location display. However, per the current success criteria, `--` is acceptable for instance-child nodes, so this is optional.

## Analysis of What Needs to Change

### Changes Required (minimal)

1. **`src/brief/generate.ts` -- `buildAssetsSection`**: The function already works correctly. The only potential improvement is deriving `parentInstanceId` from I-prefix nodeIds for breadcrumb fallback (see Open Question 2). This is optional since SC-3 explicitly accepts `--` for instance-child nodes.

2. **`src/brief/generate.ts` -- `assetTypeLabel`**: Already correct. Returns "Icon" for 'icon', "Image" for 'image', "File" for undefined. No composition/illustration terminology exists.

3. **`src/brief/generate.ts` -- `assetNodeMap` construction**: Already works for direct nodeId matches and parentInstanceId fallback. Manual assets from the current pipeline won't have parentInstanceId set, so the `->` annotation in the layout tree will only fire for direct matches (asset nodeId = tree node id).

4. **`src/brief/generate.test.ts`**: Needs tests that specifically verify the three success criteria with ManualAsset-shaped fixtures (assets that have nodeId but no parentInstanceId, I-prefix nodeIds, etc.).

### Changes NOT Required

- `breadcrumb.ts` -- working correctly, no changes needed
- `export.ts` -- out of scope for this phase
- `types.ts` -- no type changes needed
- `MainView.tsx` -- no UI changes needed

### Scope Assessment

This is a **test-heavy, code-light** phase. The existing implementation already satisfies most of the success criteria. The main work is:
1. Writing tests that prove the three success criteria hold for manual asset scenarios
2. Optionally deriving parentInstanceId in the brief generator for improved I-prefix breadcrumb fallback
3. Verifying no composition/illustration terminology remains (it was already cleaned in Phase 15)

## Sources

### Primary (HIGH confidence)
- Source code inspection of `src/brief/generate.ts` (lines 43-531)
- Source code inspection of `src/assets/breadcrumb.ts` (lines 1-87)
- Source code inspection of `src/assets/export.ts` (lines 1-147)
- Source code inspection of `src/assets/types.ts` (lines 1-75)
- Source code inspection of `src/brief/generate.test.ts` (lines 1-951)
- Phase 15 summary (strip auto-detection, confirmed removal of composition/illustration terminology)
- Phase 17 summary (export pipeline, confirmed nodeId threading from ManualAsset to ExportResult)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, pure TypeScript/vitest
- Architecture: HIGH - all patterns already exist in codebase, verified by reading source
- Pitfalls: HIGH - identified from direct code analysis, not assumptions

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable internal code, no external dependency risk)
