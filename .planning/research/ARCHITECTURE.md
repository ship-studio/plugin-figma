# Architecture Integration: v1.3 Asset Completeness & Spacing Accuracy

**Project:** Ship Studio Figma Plugin
**Milestone:** v1.3 -- Complete asset detection, spacing accuracy, plugin icon
**Researched:** 2026-03-01
**Focus:** How deeper asset traversal and spacing accuracy integrate with the existing identify/export/download pipeline
**Confidence:** HIGH

## Executive Summary

v1.3 addresses two systematic gaps in the extraction pipeline: (1) **assets inside component instances are invisible** because `identify.ts` treats INSTANCE nodes as leaf nodes and never inspects their children or fills, and (2) **spacing values come only from auto-layout properties**, missing the many Figma frames that use manual positioning where spacing must be inferred from bounding boxes.

The Figma REST API **does return children and fills for INSTANCE nodes** (confirmed via `@figma/rest-api-spec` -- `InstanceNode` extends `FrameTraits` which includes `HasChildrenTrait` and `HasGeometryTrait`). The current code intentionally skips INSTANCE children in both `normalize.ts` (line 173: `return result` before recursion) and `identify.ts` (line 87: `return` after pushing the instance entry). This was a reasonable v1.0 simplification but means background images, nested logos, and image fills inside components are never discovered.

The fix requires **surgical changes to existing files** -- no new architectural layers. The pipeline structure (identify -> export -> download) remains intact. Two files need modification (`identify.ts`, `normalize.ts`), one file needs a small addition (`flexbox-map.ts`), and the brief generator needs minor formatting changes. No new modules are needed.

## Current Architecture (v1.2 Baseline)

```
User Input (URL + token)
    |
[1. URL Parser] -> fileKey, nodeId
    |
[2. Figma API Client] -> raw node JSON (with full children, fills, etc.)
    |
[3. Layout Normalization] -> LayoutNode tree (CSS flexbox terms)
    |                         INSTANCE = leaf node (no children traversed)
    |                         fills[] preserved on nodes for token extraction
    |
[4. Token Extraction] -> design tokens + imageFills[] from IMAGE paints
    |                     walks full tree BUT skips INSTANCE children
    |                     (because normalize.ts already excluded them)
    |
[5. Asset Detection]  -> detect-composition.ts (composition/illustration IDs)
    |                  -> identify.ts (walk tree, classify nodes as assets)
    |                     INSTANCE = png-render, then RETURN (skip children)
    |                     IMAGE fill = png-fill
    |                     SVG types = svg
    |
[6. Asset Export]     -> export.ts orchestrates:
    |                     batch fetchImages (SVG, PNG renders)
    |                     batch fetchImageFills (IMAGE paint URLs)
    |                     sequential download to temp dir
    |
[7. Brief Assembly]   -> generate.ts (pure function, markdown output)
    |                     layout tree with inline styles
    |                     asset cross-references (nodeId -> filename)
    |                     breadcrumb paths for asset location
    |
[8. Output]           -> clipboard + file save
```

## Gap Analysis

### Gap 1: Assets Inside Component Instances

**Root cause:** Two coordinated `return` statements prevent traversal into INSTANCE children.

In `normalize.ts` line 171-173:
```typescript
case 'INSTANCE':
  result.componentRef = buildComponentRef(node, components);
  return result; // <-- Children never normalized
```

In `identify.ts` line 76-88:
```typescript
if (node.type === 'INSTANCE' && node.componentRef) {
  // ... push png-render entry
  return; // <-- Children never walked for asset detection
}
```

In `collect.ts` line 288-309:
```typescript
if (node.componentRef) {
  // ... accumulate component inventory
}
// Recurse into children happens at line 312
// BUT children were already excluded by normalize.ts
```

**What gets missed:**

1. **Image fills on the INSTANCE node itself** -- An INSTANCE can have its own fills (background image). The fills array IS present on the normalized LayoutNode (line 127-129 of normalize.ts captures fills), BUT identify.ts checks for IMAGE fills only AFTER the INSTANCE check, so it never reaches the IMAGE fill branch for INSTANCE nodes.

2. **Image fills on children inside instances** -- Photos, logos, or icons placed as child rectangles/frames inside a component. These children exist in the API response but normalize.ts never creates LayoutNode children for them.

3. **Nested component instances** -- An INSTANCE containing another INSTANCE (e.g., a Card component containing a Button component that has an icon). The outer instance stops traversal entirely.

4. **SVG vectors inside instances** -- Icon vectors placed as children inside a component. Rare to need separately (the instance PNG includes them), but relevant when the same icon appears standalone elsewhere.

**What the API provides:** Confirmed via `@figma/rest-api-spec`:
- `InstanceNode` extends `FrameTraits` which includes `HasChildrenTrait` (children: SubcanvasNode[])
- `InstanceNode` extends `FrameTraits` which includes `HasGeometryTrait` -> `MinimalFillsTrait` (fills: Paint[])
- Children are fully populated in the REST API response (not truncated)
- IMAGE paints on any node have `imageRef: string` for resolution via `fetchImageFills`

### Gap 2: Spacing Accuracy

**Root cause:** Spacing extraction relies exclusively on auto-layout properties.

In `flexbox-map.ts` line 43-64:
```typescript
export function mapToFlexbox(frame: any): AutoLayoutProps {
  return {
    gap: frame.itemSpacing ?? 0,
    padding: {
      top: frame.paddingTop ?? 0,
      right: frame.paddingRight ?? 0,
      bottom: frame.paddingBottom ?? 0,
      left: frame.paddingLeft ?? 0,
    },
    // ...
  };
}
```

This only captures spacing for frames with `layoutMode !== 'NONE'`. Frames without auto-layout -- and there are many in real Figma files -- have no spacing representation at all.

**What gets missed:**

1. **Non-auto-layout frames** -- Frames using manual positioning (the default in Figma). These have `absoluteBoundingBox` but no `itemSpacing` or `padding*` properties. Spacing between children can be inferred from bounding box arithmetic but currently is not.

2. **Individual padding on non-auto-layout containers** -- A frame with manually positioned children still has visual padding (space between frame edge and first child). Computable from `absoluteBoundingBox` of parent vs children.

3. **Negative spacing / overlapping** -- Elements that overlap produce negative computed gaps. This is valid (CSS negative margins exist) but needs careful handling.

**What the API provides:**
- `absoluteBoundingBox: { x, y, width, height }` on every node with layout
- For auto-layout: `paddingTop/Right/Bottom/Left`, `itemSpacing`, `counterAxisSpacing`
- For non-auto-layout: only `absoluteBoundingBox` -- spacing must be computed

## Recommended Architecture Changes

### Change 1: Deep Instance Traversal for Asset Detection

**Modify:** `src/assets/identify.ts`
**Nature:** Extend the INSTANCE branch in `walkTree` to inspect children for IMAGE fills

The key insight: we still want to export the INSTANCE itself as a png-render (for the component preview), AND we want to discover image assets hidden inside it. We do NOT want to export SVG children inside instances (they are part of the component rendering, not standalone assets).

```
BEFORE:
  INSTANCE detected -> push png-render -> RETURN (stop)

AFTER:
  INSTANCE detected -> push png-render -> scan children for IMAGE fills only
                                          (do NOT export SVGs inside instances)
```

**Implementation approach:**

Add a new helper function `scanInstanceForImageFills` that recursively walks instance children looking ONLY for nodes with IMAGE fills. This is narrower than the full `walkTree` -- it does not export SVGs, does not check for compositions, does not deduplicate instances. It only finds image assets.

```typescript
function scanInstanceForImageFills(
  node: LayoutNode,
  imageFillMap: Map<string, string>,
  matchedNodeIds: Set<string>,
  entries: AssetEntry[],
): void {
  if (hasImageFill(node)) {
    const imageRef = imageFillMap.get(node.id) ?? getImageRefFromFills(node);
    if (imageFillMap.has(node.id)) matchedNodeIds.add(node.id);
    entries.push({
      nodeId: node.id,
      nodeName: node.name,
      exportType: 'png-fill',
      filename: sanitizeFilename(node.name) + '.png',
      imageRef,
    });
    // Don't return -- the image fill node might have children with more fills
  }
  if (node.children) {
    for (const child of node.children) {
      scanInstanceForImageFills(child, imageFillMap, matchedNodeIds, entries);
    }
  }
}
```

Then modify the INSTANCE branch in `walkTree`:
```typescript
if (node.type === 'INSTANCE' && node.componentRef) {
  const key = instanceDedupKey(node);
  if (!seenInstances.has(key)) {
    seenInstances.add(key);
    entries.push({ /* existing png-render entry */ });
  }
  // NEW: Also check for image fills ON the instance itself
  if (hasImageFill(node)) {
    const imageRef = imageFillMap.get(node.id) ?? getImageRefFromFills(node);
    if (imageFillMap.has(node.id)) matchedNodeIds.add(node.id);
    entries.push({
      nodeId: node.id,
      nodeName: node.name,
      exportType: 'png-fill',
      filename: sanitizeFilename(node.name) + '-bg.png',
      imageRef,
    });
  }
  // NEW: Scan children for image fills (but not SVGs)
  if (node.children) {
    for (const child of node.children) {
      scanInstanceForImageFills(child, imageFillMap, matchedNodeIds, entries);
    }
  }
  return; // Still don't fall through to SVG/RECTANGLE handling
}
```

**Prerequisite:** `normalize.ts` must also be modified to include children of INSTANCE nodes in the LayoutNode tree, otherwise `identify.ts` has no children to scan.

### Change 2: Normalize Instance Children for Asset Scanning

**Modify:** `src/layout/normalize.ts`
**Nature:** Remove the early return for INSTANCE nodes, recurse into children

The INSTANCE case currently returns immediately after building `componentRef`. Change it to recurse into children like other container nodes:

```typescript
case 'INSTANCE':
  result.componentRef = buildComponentRef(node, components);
  // CHANGED: Still mark as instance, but DO recurse into children
  // so that identify.ts can find image fills inside
  break; // was: return result;
```

This means the normalized LayoutNode for an INSTANCE will now have a `children` array alongside its `componentRef`. This is a type-compatible change -- `LayoutNode.children` is already optional.

**Impact assessment:**
- **Token collection** (`collect.ts`): Will now walk into instance children. This is GOOD -- it discovers image fills inside instances that were previously missed. The `imageFills` array will be more complete.
- **Brief layout tree** (`generate.ts`): The `renderTree` function already has `if (node.componentRef) return;` at line 163, which prevents rendering instance children in the layout tree. This is correct behavior -- we want the tree to show the instance as a leaf while still allowing asset detection to find fills. **No change needed.**
- **Composition detection** (`detect-composition.ts`): The `detectInNode` function recurses into children. With instance children now present, it could potentially flag instance internals as compositions. However, the composition check already starts from `root.children` and recurses, and instance internals are typically simple. Low risk, but worth a test.
- **Deduplication** (`deduplicateChildren` in normalize.ts): Works on direct children of a container. Instance children being present does not change the dedup logic for the instance's siblings.

### Change 3: Instance Background Fills (IMAGE fills on the INSTANCE node itself)

**Already handled by Change 1.** The INSTANCE node's own fills are already captured in normalize.ts (line 127-129). After Change 1, `identify.ts` checks for IMAGE fills on the instance node before the early return.

But there is a subtlety: the INSTANCE node might have an IMAGE fill as a background (e.g., a card component with a background photo). Currently `hasImageFill(node)` is checked only after the INSTANCE branch returns. With Change 1, we check it explicitly inside the INSTANCE branch.

### Change 4: Spacing from Non-Auto-Layout Frames

**Modify:** `src/layout/normalize.ts` (add computed spacing)
**Nature:** Compute inferred spacing from absoluteBoundingBox when no auto-layout

For non-auto-layout frames (those where `layoutMode` is absent or 'NONE'), compute approximate spacing from bounding boxes:

```typescript
// After the autoLayout block in normalizeNode:
if (!result.autoLayout && node.children && Array.isArray(node.children) && node.absoluteBoundingBox) {
  const inferredSpacing = inferSpacingFromBounds(node, node.children);
  if (inferredSpacing) {
    result.inferredSpacing = inferredSpacing;
  }
}
```

**New type on LayoutNode:**
```typescript
/** Spacing inferred from bounding box positions (non-auto-layout frames) */
inferredSpacing?: {
  padding: { top: number; right: number; bottom: number; left: number };
  /** Median gap between consecutive children along dominant axis */
  gap?: number;
  /** Whether children are laid out primarily horizontally or vertically */
  dominantAxis?: 'horizontal' | 'vertical';
};
```

**Implementation approach:**

A pure function `inferSpacingFromBounds` that:
1. Gets parent `absoluteBoundingBox`
2. Gets children `absoluteBoundingBox` values
3. Computes padding: distance from parent edges to nearest child edges
4. Determines dominant axis (are children arranged more horizontally or vertically?)
5. Computes gaps between consecutive children along the dominant axis
6. Returns median gap as the representative spacing

```typescript
function inferSpacingFromBounds(
  parent: any, // raw Figma node with absoluteBoundingBox
  children: any[], // raw Figma child nodes with absoluteBoundingBox
): LayoutNode['inferredSpacing'] | null {
  const pBox = parent.absoluteBoundingBox;
  if (!pBox || !children.length) return null;

  // Filter to visible children with bounding boxes
  const childBoxes = children
    .filter((c: any) => c.visible !== false && c.absoluteBoundingBox)
    .map((c: any) => c.absoluteBoundingBox);

  if (childBoxes.length === 0) return null;

  // Compute padding from parent edges to outermost children
  const minChildX = Math.min(...childBoxes.map((b: any) => b.x));
  const minChildY = Math.min(...childBoxes.map((b: any) => b.y));
  const maxChildRight = Math.max(...childBoxes.map((b: any) => b.x + b.width));
  const maxChildBottom = Math.max(...childBoxes.map((b: any) => b.y + b.height));

  const padding = {
    top: Math.max(0, Math.round(minChildY - pBox.y)),
    right: Math.max(0, Math.round((pBox.x + pBox.width) - maxChildRight)),
    bottom: Math.max(0, Math.round((pBox.y + pBox.height) - maxChildBottom)),
    left: Math.max(0, Math.round(minChildX - pBox.x)),
  };

  // Skip if all padding is 0 and only 1 child (nothing interesting to report)
  if (childBoxes.length === 1) {
    const hasAnyPadding = padding.top > 0 || padding.right > 0 ||
                          padding.bottom > 0 || padding.left > 0;
    if (!hasAnyPadding) return null;
    return { padding };
  }

  // Determine dominant axis and compute gaps
  // Sort by position along each axis, compute gaps, pick axis with less variance
  const sortedByX = [...childBoxes].sort((a: any, b: any) => a.x - b.x);
  const sortedByY = [...childBoxes].sort((a: any, b: any) => a.y - b.y);

  const xGaps = computeGaps(sortedByX, 'x', 'width');
  const yGaps = computeGaps(sortedByY, 'y', 'height');

  // Pick axis: the one with positive gaps and lower variance
  const result: LayoutNode['inferredSpacing'] = { padding };

  if (xGaps.length > 0 && (yGaps.length === 0 || variance(xGaps) <= variance(yGaps))) {
    result.dominantAxis = 'horizontal';
    result.gap = median(xGaps);
  } else if (yGaps.length > 0) {
    result.dominantAxis = 'vertical';
    result.gap = median(yGaps);
  }

  return result;
}
```

**Where this connects to the brief:** The `renderNodeLine` function in `generate.ts` already outputs auto-layout spacing inline. Add a parallel block for `inferredSpacing`:

```typescript
if (node.inferredSpacing) {
  const is = node.inferredSpacing;
  const props: string[] = [];
  if (is.dominantAxis) props.push(is.dominantAxis === 'horizontal' ? 'row (inferred)' : 'column (inferred)');
  if (is.gap != null && is.gap > 0) props.push(`gap: ~${is.gap}`);
  const padding = formatPadding(is.padding);
  if (padding) props.push(padding);
  if (props.length > 0) parts.push(`(${props.join(', ')})`);
}
```

**Where this connects to token collection:** Add `inferredSpacing` values to the spacing token collection in `collect.ts`, tagged with source `'inferred-padding'` or `'inferred-gap'` to distinguish from auto-layout values.

### Change 5: Plugin Icon (Trivial)

**New file:** Plugin manifest/config update
**Nature:** Add Figma logo SVG as plugin icon

This is a configuration change, not an architecture change. It involves adding an SVG file and referencing it in the plugin manifest. No pipeline changes.

## Component Boundary Map

### Modified Files

| File | Change | Risk | Dependencies |
|------|--------|------|--------------|
| `src/layout/normalize.ts` | Remove early return for INSTANCE, add `inferSpacingFromBounds` | MEDIUM | Changes tree shape visible to all downstream |
| `src/layout/types.ts` | Add `inferredSpacing` to LayoutNode | LOW | Type-only, additive |
| `src/assets/identify.ts` | Add `scanInstanceForImageFills`, modify INSTANCE branch | LOW | Self-contained logic |
| `src/brief/generate.ts` | Render `inferredSpacing` in tree lines | LOW | Additive formatting |
| `src/tokens/collect.ts` | Collect spacing from `inferredSpacing` | LOW | Additive accumulation |

### Unchanged Files

| File | Why Unchanged |
|------|---------------|
| `src/assets/export.ts` | Orchestration logic is asset-type-agnostic. More png-fill entries flow through naturally. |
| `src/assets/download.ts` | Downloads any URL to any path. No type awareness. |
| `src/assets/detect-composition.ts` | Composition detection already handles recursion. Instance children do not add new composition candidates (instances are typically simple internally). |
| `src/assets/sanitize.ts` | Filename sanitization is input-agnostic. |
| `src/assets/breadcrumb.ts` | Breadcrumbs walk the tree. More children = more breadcrumbs. Works automatically. |
| `src/figma-api.ts` | No API changes needed. Same endpoints, same data. |
| `src/views/MainView.tsx` | UI is pipeline-result-agnostic. More assets = higher count in stats. |

### New Files

None. All changes are modifications to existing files. This is intentional -- the v1.2 architecture is well-structured and does not need new modules for these features.

## Data Flow Changes

### Before (v1.2): INSTANCE Node Processing

```
Figma API Response
  INSTANCE node (with children, fills)
    |
normalizeNode() -> LayoutNode { componentRef, fills, NO children }
    |
    +-> collectTokens(): sees componentRef, accumulates component inventory
    |                     does NOT recurse (no children on LayoutNode)
    |                     sees fills[] but only for stroke/color tokens
    |                     IMAGE fills -> imageFills[] (if present on instance)
    |
    +-> identifyAssets(): INSTANCE branch -> push png-render -> RETURN
                          IMAGE fills on instance? NEVER CHECKED
                          Children with fills? NEVER WALKED
```

### After (v1.3): INSTANCE Node Processing

```
Figma API Response
  INSTANCE node (with children, fills)
    |
normalizeNode() -> LayoutNode { componentRef, fills, children[] }
    |
    +-> collectTokens(): sees componentRef, accumulates component inventory
    |                     NOW RECURSES into children
    |                     IMAGE fills on children -> imageFills[]
    |
    +-> identifyAssets(): INSTANCE branch -> push png-render
    |                     CHECK instance fills for IMAGE -> png-fill
    |                     SCAN children for IMAGE fills -> png-fill entries
    |                     RETURN (don't fall through to SVG handling)
    |
    +-> brief renderTree(): componentRef check -> RETURN (no children rendered)
                            Instance still appears as leaf in layout tree
                            BUT its image assets appear in the Assets table
```

### Before (v1.2): Non-Auto-Layout Frame Spacing

```
normalizeNode()
  Frame with layoutMode === undefined/NONE
    |
    autoLayout property: NOT SET (no mapToFlexbox call)
    |
    Result: LayoutNode has dimensions but NO spacing information
    |
    Brief: "Frame 'Header' 1440x80" -- no gap/padding info
```

### After (v1.3): Non-Auto-Layout Frame Spacing

```
normalizeNode()
  Frame with layoutMode === undefined/NONE
    |
    autoLayout: NOT SET
    inferredSpacing: COMPUTED from absoluteBoundingBox
    |
    Result: LayoutNode has dimensions AND inferred spacing
    |
    Brief: "Frame 'Header' (row (inferred), gap: ~24, padding: 16 32) 1440x80"
```

## Build Order (Dependency-Aware)

The changes have clear dependencies. Here is the correct build sequence:

### Phase 1: Instance Children in Layout Tree

**Must come first** -- all other instance-related changes depend on children being present in the LayoutNode tree.

1. Modify `src/layout/types.ts` -- no type changes needed for this step (children already optional on LayoutNode)
2. Modify `src/layout/normalize.ts` -- change INSTANCE case from `return result` to `break`
3. Update `src/layout/normalize.test.ts` -- verify INSTANCE nodes now have children
4. Verify `src/brief/generate.ts` still renders INSTANCE as leaf (existing `componentRef` guard)
5. Verify `src/assets/detect-composition.ts` does not falsely flag instance internals
6. Run full test suite -- check for regressions in token collection and brief output

### Phase 2: Deep Asset Detection Inside Instances

**Depends on Phase 1** -- needs children to exist on INSTANCE LayoutNodes.

1. Add `scanInstanceForImageFills` helper to `src/assets/identify.ts`
2. Modify INSTANCE branch in `walkTree` to also check instance's own fills and scan children
3. Add asset type `'background'` to distinguish background fills from content images (optional)
4. Update `src/assets/identify.test.ts` with test cases:
   - Instance with IMAGE fill on itself (background photo)
   - Instance with child rectangle that has IMAGE fill (nested logo)
   - Instance with nested instance that has IMAGE fill (deeply nested)
   - Instance with only SVG children (should NOT export SVGs)
5. Verify `src/assets/export.ts` handles the additional png-fill entries (should work without changes)
6. End-to-end test with real Figma file containing components with images

### Phase 3: Spacing Inference from Bounding Boxes

**Independent of Phases 1-2** -- can be built in parallel.

1. Add `inferredSpacing` type to `src/layout/types.ts`
2. Add `inferSpacingFromBounds` pure function to `src/layout/normalize.ts` (with helpers: `computeGaps`, `median`, `variance`)
3. Call `inferSpacingFromBounds` in `normalizeNode` for non-auto-layout frames
4. Update `src/layout/normalize.test.ts` with test cases:
   - Frame with 3 horizontally arranged children -> inferred row, gap, padding
   - Frame with 3 vertically arranged children -> inferred column, gap, padding
   - Frame with single child -> padding only
   - Frame with no children -> null
   - Frame with overlapping children -> handle gracefully
5. Update `src/tokens/collect.ts` to accumulate spacing from `inferredSpacing`
6. Update `src/brief/generate.ts` to render `inferredSpacing` in tree lines
7. Unit test the brief output formatting

### Phase 4: Plugin Icon

**Independent of all other phases.**

1. Add Figma logo SVG to project
2. Update plugin manifest/config to reference it
3. Verify icon renders in Ship Studio toolbar

## Anti-Patterns to Avoid

### Anti-Pattern 1: Over-Traversal of Instance Trees
**What:** Recursing into every child of every instance for all asset types (SVG, composition, etc.)
**Why bad:** Instance internals are part of the component rendering. Exporting individual SVG paths from inside a Button component produces garbage. The instance PNG already captures the visual.
**Instead:** Only scan for IMAGE fills inside instances. SVGs, compositions, and other asset types should NOT be extracted from instance children.

### Anti-Pattern 2: Computed Spacing as Authoritative
**What:** Treating bounding-box-inferred spacing as precise design intent
**Why bad:** Manual positioning often has slight pixel variations. A designer might place elements at 23px, 25px, 24px gaps -- the median (24px) is useful guidance but is not the designer's declared value like auto-layout's `itemSpacing: 24`.
**Instead:** Mark inferred spacing clearly as approximate (`gap: ~24`, tagged as `inferred`) to distinguish from auto-layout's precise values. Use `~` prefix and `(inferred)` label.

### Anti-Pattern 3: Normalizing Instance Children for the Layout Tree
**What:** Showing instance child nodes in the brief's layout tree
**Why bad:** The layout tree is meant to show the designer's component structure. Instance internals are implementation details -- Claude Code should use the component, not recreate its internals.
**Instead:** Keep the `if (node.componentRef) return;` guard in `renderTree`. Instance children exist in the LayoutNode for asset detection and token collection only, not for layout tree display.

### Anti-Pattern 4: Changing Export Types Based on Instance Context
**What:** Exporting an IMAGE fill inside an instance differently from an IMAGE fill at the top level
**Why bad:** An image is an image regardless of where it lives. The download pipeline treats all `png-fill` entries identically.
**Instead:** Use the same `png-fill` export type for all IMAGE fills. The breadcrumb path naturally indicates the image's location context.

## Scalability Considerations

| Concern | Current (v1.2) | After v1.3 |
|---------|----------------|------------|
| Asset count | Moderate (instances are 1 asset each) | Higher (images inside instances add entries) |
| API calls | One batch per asset type | Same -- new image fills are resolved from the same `fetchImageFills` response |
| Download time | Sequential, ~1s per asset | Linear increase with more assets, but download.ts handles this |
| Brief size | Proportional to node count | Slightly larger with inferred spacing annotations |
| Computation | O(n) tree walk | O(n) -- instance children were already in API response, just not walked |

The `fetchImageFills` API call returns ALL image refs for the file in one response. Adding more `png-fill` entries from instance children does not require additional API calls. The only cost is additional sequential downloads (one `curl` per image), which is bounded by the number of unique `imageRef` values.

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Scan instances for IMAGE fills only | SVGs inside instances are component internals, not standalone assets. Only raster images (photos, logos) are meaningful to extract separately. |
| Keep instances as leaf nodes in layout tree | The layout tree communicates structure. Instance internals are abstracted away by design. |
| Infer spacing with explicit approximate markers | Bounding-box math produces useful-but-imprecise values. Honest labeling prevents Claude Code from treating estimates as exact specs. |
| No new files | The existing module structure handles these features cleanly. Adding modules would be unnecessary complexity. |
| Phase 1 before Phase 2 | Asset detection can only find instance children if normalize.ts produces them. Token collection also benefits from seeing instance children (finds more imageFills). |
| Phase 3 independent | Spacing inference has no dependency on instance traversal. Can be built and tested in isolation. |

## Sources

- Figma REST API spec: `@figma/rest-api-spec` (node_modules, InstanceNode type definition) -- HIGH confidence
- Figma REST API docs: [File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- HIGH confidence
- Figma REST API types: [api_types.ts](https://github.com/figma/rest-api-spec/blob/main/dist/api_types.ts) -- HIGH confidence
- Figma Plugin API: [fills property](https://www.figma.com/plugin-docs/api/properties/nodes-fills) -- MEDIUM confidence (Plugin API, not REST API, but consistent)
- Figma Forum: [absoluteBoundingBox spacing](https://forum.figma.com/t/intuition-behind-absoluteboundingbox/3389) -- MEDIUM confidence
- Figma auto-layout docs: [Guide to auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout) -- HIGH confidence
- Codebase analysis: All source files in `src/` -- HIGH confidence (direct code reading)
