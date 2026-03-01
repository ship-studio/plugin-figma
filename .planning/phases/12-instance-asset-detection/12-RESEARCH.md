# Phase 12: Instance Asset Detection - Research

**Researched:** 2026-03-01
**Domain:** Figma REST API instance traversal, image fill extraction, rectangle filtering
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use the image node's own Figma name for the exported filename (e.g., `hero-image.png`, `avatar.png`)
- For name collisions, use the existing `resolveCollisions()` suffix pattern (`hero-image.png`, `hero-image-2.png`)
- For instance-level IMAGE fill overrides (ASSET-06), use the instance node's name as the filename
- Export instance-level IMAGE fill overrides as png-fill (extract just the image), NOT png-render (component screenshot) -- this replaces the component render, don't export both
- Never export simple solid-color rectangles as SVG assets -- they are always CSS-reproducible
- Silent omission for skipped rectangles: no warnings or notes in the brief
- The layout tree still shows rectangle nodes with their style tokens (color, border-radius, size)
- Annotate instance lines with asset references: `[INSTANCE] Card (x3) 320x240 -> hero-image.png`
- Same annotation pattern as existing compositions (`-> filename.png`)
- For deduplicated instance groups, mention the image once (not per-instance)
- Assets table treats instance-child images the same as any other image -- breadcrumb path shows context
- Identical images across instances (same imageRef) exported once
- Full-depth recursion into instance children to find IMAGE fills -- no depth limit
- Instance dedup by componentId+variant continues to work; image dedup layers on top

### Claude's Discretion
- Exact rectangle "simplicity" threshold (what combination of fills/strokes/effects/gradients triggers export)
- Whether rectangle filtering applies inside instances or only in the non-instance tree
- Whether to differentiate fill-image vs child-image annotations in the tree (e.g., `[fill]` prefix)
- Whether instances with detected child images should still get a component png-render alongside the extracted images

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ASSET-05 | Plugin detects and exports IMAGE fills inside component instance children (hero images, avatars, product photos nested in components) | Figma REST API returns instance children with full fills data including imageRef; walkTree must recurse into instances instead of early-returning; image dedup by imageRef prevents duplicate exports |
| ASSET-06 | Plugin detects and exports IMAGE fills on INSTANCE nodes themselves (background image overrides) | INSTANCE nodes inherit HasGeometryTrait via FrameTraits, which includes fills; hasImageFill() already detects IMAGE fills -- just needs to be checked before the INSTANCE early-return; export as png-fill using imageRef from the instance's fills |
| ASSET-07 | Plugin skips exporting simple solid-color RECTANGLE nodes as SVG (only exports rectangles with strokes or complex fills) | Rectangle simplicity check: no strokes, no gradients, no image fills, no effects, single or zero solid fills = simple; silent omission, no warnings |
</phase_requirements>

## Summary

This phase modifies three files in the existing asset pipeline to close gaps in image detection. The Figma REST API returns INSTANCE nodes with their full children subtree, including fills with `imageRef` properties on child nodes. Currently, `walkTree()` in `identify.ts` returns early at line 87 when it encounters an INSTANCE node, never inspecting children for IMAGE fills. The fix is to recurse into instance children specifically to find IMAGE fills, while keeping the existing instance-as-leaf-node behavior for the layout tree.

The three changes are: (1) modify `walkTree()` to recurse into INSTANCE children for IMAGE fill detection, (2) check the INSTANCE node itself for IMAGE fills before the existing component render logic, and (3) add a simplicity filter for RECTANGLE nodes to skip CSS-reproducible solid-color rectangles. Additionally, the token collector (`collect.ts`) needs to recurse into instance children to discover IMAGE fills there, and the brief generator needs to thread instance child image filenames into the layout tree annotations.

**Primary recommendation:** Modify `identify.ts` walkTree to recurse into instance children for IMAGE fill detection, using imageRef as the dedup key. Check the INSTANCE node's own fills first (ASSET-06). Add a `isSimpleRectangle()` guard to the RECTANGLE branch (ASSET-07). Thread child image data through to the brief generator for layout tree cross-referencing.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @figma/rest-api-spec | (project-local) | TypeScript types for Figma API responses | Official Figma type definitions; confirms INSTANCE inherits FrameTraits including HasChildrenTrait and HasGeometryTrait (fills) |

### Supporting
No new dependencies needed. All changes are to existing pure functions in the project.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recursive instance child walk | Figma /v1/images render of instance (png-render) | Instance sublayer node IDs (I-prefix) return null from /v1/images endpoint; imageRef via /v1/files/:key/images is reliable |
| imageRef dedup | No dedup (export each instance's image separately) | Would produce duplicate files for identical images across card instances |

**Installation:**
No new packages needed.

## Architecture Patterns

### Recommended Project Structure
No new files. All changes within existing modules:
```
src/
├── assets/
│   ├── identify.ts       # PRIMARY: walkTree instance recursion, rectangle filter
│   └── export.ts          # Minor: no changes expected (png-fill path already works)
├── tokens/
│   └── collect.ts         # Token collection: recurse into instance children for imageFills
├── layout/
│   └── normalize.ts       # NO CHANGES: instances remain leaf nodes for layout tree
└── brief/
    └── generate.ts        # Layout tree: thread instance child image filenames into annotations
```

### Pattern 1: Instance Image Recursion in walkTree
**What:** When walkTree encounters an INSTANCE node, instead of immediately returning, it first checks the instance's own fills for IMAGE type, then recurses into children to find IMAGE fills at any depth. Non-IMAGE children are ignored (no SVG export from instance internals).
**When to use:** Every INSTANCE node in walkTree.
**Example:**
```typescript
// In walkTree, replace the INSTANCE early-return block:
if (node.type === 'INSTANCE' && node.componentRef) {
  // ASSET-06: Check instance node itself for IMAGE fill override
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
    // Don't also export as png-render -- fill override replaces component render
    return;
  }

  // ASSET-05: Recurse into children to find IMAGE fills
  const childImages = findImageFillsInChildren(node, imageFillMap, matchedNodeIds);

  // Still export instance as png-render if no child images found (existing behavior)
  const key = instanceDedupKey(node);
  if (!seenInstances.has(key)) {
    seenInstances.add(key);
    if (childImages.length === 0) {
      entries.push({
        nodeId: node.id,
        nodeName: node.componentRef.componentName,
        exportType: 'png-render',
        filename: sanitizeFilename(node.componentRef.componentName) + '.png',
      });
    }
  }

  // Add child images (deduplicated by imageRef)
  for (const img of childImages) {
    entries.push(img);
  }

  return;
}
```

### Pattern 2: Image Fill Recursion Helper
**What:** A dedicated recursive function that walks instance children at full depth, collecting only IMAGE fill entries. Does NOT export SVGs, rectangles, or other assets from instance internals.
**When to use:** Called from walkTree's INSTANCE branch.
**Example:**
```typescript
function findImageFillsInChildren(
  node: LayoutNode,
  imageFillMap: Map<string, string>,
  matchedNodeIds: Set<string>,
  seenImageRefs: Set<string> = new Set(),
): AssetEntry[] {
  const results: AssetEntry[] = [];
  if (!node.children) return results;

  for (const child of node.children) {
    if (hasImageFill(child)) {
      const imageRef = imageFillMap.get(child.id) ?? getImageRefFromFills(child);
      // Dedup by imageRef -- same image across instances exported once
      if (imageRef && !seenImageRefs.has(imageRef)) {
        seenImageRefs.add(imageRef);
        if (imageFillMap.has(child.id)) matchedNodeIds.add(child.id);
        results.push({
          nodeId: child.id,
          nodeName: child.name,
          exportType: 'png-fill',
          filename: sanitizeFilename(child.name) + '.png',
          imageRef,
        });
      }
    }
    // Recurse deeper (full depth, no limit)
    results.push(...findImageFillsInChildren(child, imageFillMap, matchedNodeIds, seenImageRefs));
  }

  return results;
}
```

### Pattern 3: Simple Rectangle Filter
**What:** A guard function that determines if a RECTANGLE is CSS-reproducible (simple) and should be skipped for SVG export.
**When to use:** In the RECTANGLE branch of walkTree before pushing an SVG entry.
**Example:**
```typescript
function isSimpleRectangle(node: LayoutNode): boolean {
  // Has strokes? Not simple
  if (node.strokes?.some((s: any) => s.visible !== false)) return false;
  // Has gradient fill? Not simple
  if (node.fills?.some((f: any) => f.visible !== false && f.type?.startsWith('GRADIENT_'))) return false;
  // Has image fill? Not simple
  if (hasImageFill(node)) return false;
  // Has effects (shadows, blurs)? Not simple
  if (node.effects?.some((e: any) => e.visible !== false)) return false;
  // All remaining fills are SOLID or empty -- simple, CSS-reproducible
  return true;
}

// In walkTree RECTANGLE branch:
if (node.type === 'RECTANGLE') {
  if (isSimpleRectangle(node)) return; // Silent omission (ASSET-07)
  // ... existing SVG export logic
}
```

### Pattern 4: Token Collection Instance Recursion
**What:** The token collector's `walk()` function currently stops at INSTANCE leaf nodes (because `normalizeNode` doesn't recurse into instance children, so the LayoutNode tree has no children on INSTANCE nodes). However, `collectTokens` needs to discover IMAGE fills inside instances.
**When to use:** When the LayoutNode tree is built, instance children are stripped. The IMAGE fill detection in `collect.ts` only finds IMAGE fills on nodes that appear in the normalized tree.
**Critical insight:** The normalized LayoutNode tree does NOT contain instance children (normalizeNode returns early for INSTANCE). So `collectTokens` walking the LayoutNode tree will never find IMAGE fills inside instances. The image fills for instance children must come from a different source:
  1. Option A: Walk the raw Figma node tree (before normalization) in `extract.ts` to collect all imageFills including those inside instances
  2. Option B: Modify `normalizeNode` to stash instance children fills on the LayoutNode (new field)
  3. Option C: Perform a separate raw-tree walk in the image fill collection step

**Recommendation:** Option A is cleanest -- add a raw-tree image fill collector in `extract.ts` that runs before normalization. The raw Figma node data includes full instance children with fills. This replaces the normalized-tree imageFill collection from `collectTokens` for the purpose of image detection.

### Pattern 5: Layout Tree Cross-Referencing
**What:** The layout tree renderer already annotates INSTANCE lines with `-> filename.png` when the instance's nodeId appears in assetNodeMap. For instance child images, the child nodeId maps to a filename. Since instance children are NOT rendered in the layout tree (instances are leaf nodes), the annotation should go on the instance's line itself.
**When to use:** In `renderNodeLine` in `generate.ts`, when rendering INSTANCE nodes.
**Example:**
```typescript
// In renderNodeLine, for componentRef nodes:
// After existing asset cross-reference:
const assetFile = assetNodeMap?.get(node.id);
// Also check if any child of this instance has an asset
// Need a Map<instanceNodeId, childAssetFilename> passed into generate
```
**Key decision needed (Claude's discretion):** The current assetNodeMap maps nodeId -> filename. Instance child images have child nodeIds, not the instance nodeId. To annotate the instance line, we need a reverse mapping: instanceNodeId -> child image filename. This can be built during identify by tracking which instance each child image came from.

### Anti-Patterns to Avoid
- **Rendering instance sublayer IDs via /v1/images:** I-prefix node IDs (e.g., `I5912:74596;5912:74456`) return null from the Figma /v1/images endpoint. Always use imageRef via /v1/files/:key/images instead.
- **Exporting ALL asset types from instance children:** Only IMAGE fills should be extracted from instances. SVGs, rectangles, and other shapes inside instances are component internals, not user-facing assets.
- **Modifying normalizeNode to recurse into instances:** This would explode the layout tree size. The Out of Scope table in REQUIREMENTS.md explicitly says "Deep-recurse instance children for layout tree" is excluded. Only recurse for IMAGE fill detection.
- **Losing instance png-render for instances with child images:** Per user decision (Claude's discretion area), when an instance has child images detected, the instance itself should NOT also get a png-render. The child images replace the component render.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Filename sanitization | Custom sanitizer | `sanitizeFilename()` from `sanitize.ts` | Already handles edge cases (slashes, unicode, empty strings) |
| Filename collision resolution | Custom dedup | `resolveCollisions()` from `sanitize.ts` | Already handles numeric suffixes correctly |
| Image fill detection | Custom fill checker | `hasImageFill()` / `getImageRefFromFills()` from `identify.ts` | Already filters for IMAGE type fills |
| Instance dedup | Custom fingerprint | `instanceDedupKey()` from `identify.ts` | Already handles componentId+variant key |
| Image download via imageRef | Custom URL resolution | `fetchImageFills()` from `figma-api.ts` | Already calls GET /v1/files/:key/images and returns imageRef -> URL map |

**Key insight:** The existing pipeline already handles png-fill export end-to-end (identify -> fetch image fill URLs -> download). Instance child images just need to be added to the AssetEntry list with `exportType: 'png-fill'` and an `imageRef`, and the existing download pipeline handles the rest.

## Common Pitfalls

### Pitfall 1: Instance Children Not in Normalized Tree
**What goes wrong:** The normalized LayoutNode tree treats instances as leaf nodes (normalizeNode returns early at line 172-173). Token collection walks the normalized tree. So IMAGE fills inside instance children are never discovered by `collectTokens`.
**Why it happens:** By design -- instance children are stripped to keep the layout tree compact. But this means imageFills in `collectTokens` output won't include instance-interior images.
**How to avoid:** Collect IMAGE fills from the raw Figma API response (before normalization) in a separate pass. The raw tree includes full instance children with fills. Run this in `extract.ts` after `fetchFileNodes`/`fetchFullFile` but before `normalizeTree`.
**Warning signs:** IMAGE fills array is empty or missing expected instance child images despite the Figma design having them.

### Pitfall 2: imageRef Dedup Must Be Global
**What goes wrong:** If imageRef dedup is done per-instance, the same hero image used in 10 card instances gets exported 10 times.
**Why it happens:** Each card instance has its own child with the same imageRef but different nodeIds.
**How to avoid:** Use a global `seenImageRefs: Set<string>` across all walkTree calls. When an imageRef has already been seen, skip the entry.
**Warning signs:** Multiple files with the same content but different collision suffixes (hero-image.png, hero-image-2.png, hero-image-3.png all identical).

### Pitfall 3: Instance IMAGE Fill Override Conflicts with png-render
**What goes wrong:** An INSTANCE node has an IMAGE fill override (ASSET-06) but the code also exports it as a png-render component screenshot.
**Why it happens:** The IMAGE fill check and the png-render export are separate code paths, and both fire.
**How to avoid:** Check for IMAGE fill FIRST. If found, export as png-fill and return immediately (don't fall through to png-render). Per user decision, the fill image replaces the component render.
**Warning signs:** Two assets for the same instance -- one PNG of the image, one PNG screenshot of the component.

### Pitfall 4: I-Prefix Node IDs in Instance Children
**What goes wrong:** Instance child node IDs in the Figma API response use I-prefix format (e.g., `I5912:74596;5912:74456`). These IDs fail when used with `/v1/images` endpoint (returns null).
**Why it happens:** Figma uses compound IDs for instance sublayers that combine the instance ID with the original component layer ID.
**How to avoid:** For instance child images, always use `imageRef` from the fills array, resolved via `/v1/files/:key/images` (fetchImageFills). Never try to render instance sublayer node IDs via fetchImages.
**Warning signs:** "No render URL for hero-image.png" warnings, null URLs from fetchImages for I-prefix IDs.

### Pitfall 5: Rectangle Filter Over-Filtering
**What goes wrong:** A rectangle with a subtle gradient, shadow, or image fill gets filtered as "simple" and its SVG is never exported.
**Why it happens:** The simplicity check is too aggressive or doesn't check all visual properties.
**How to avoid:** Check ALL visual complexity signals: strokes, gradient fills, image fills, effects (shadows/blurs). Only classify as simple when ALL fills are SOLID (or empty) AND no strokes AND no effects.
**Warning signs:** Decorative rectangles with gradients or shadows missing from exports.

### Pitfall 6: Breadcrumb Map Missing Instance Child Nodes
**What goes wrong:** Instance child image assets show "--" in the Location column of the Assets table because breadcrumbMap doesn't contain entries for instance child nodeIds.
**Why it happens:** `buildBreadcrumbMap` walks the normalized tree, which doesn't include instance children.
**How to avoid:** Either extend breadcrumbMap to include instance children paths, or use the parent instance's breadcrumb for child assets. Since instance children aren't in the layout tree, the breadcrumb should show the instance's path (e.g., "Hero > Card > Card") as the location.
**Warning signs:** Assets table has "--" for instance child images while other assets show proper breadcrumb paths.

## Code Examples

Verified patterns from existing codebase:

### IMAGE Fill Detection (existing, reuse)
```typescript
// Source: src/assets/identify.ts lines 29-39
function hasImageFill(node: LayoutNode): boolean {
  return node.fills?.some((f: any) => f.type === 'IMAGE') ?? false;
}

function getImageRefFromFills(node: LayoutNode): string | undefined {
  const imageFill = node.fills?.find((f: any) => f.type === 'IMAGE');
  return imageFill?.imageRef;
}
```

### Instance Dedup Key (existing, reuse)
```typescript
// Source: src/assets/identify.ts lines 44-50
function instanceDedupKey(node: LayoutNode): string {
  const ref = node.componentRef!;
  const variants = ref.variantProperties
    ? Object.entries(ref.variantProperties).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join(',')
    : '';
  return `${ref.componentId}|${variants}`;
}
```

### Composition Cross-Reference in Layout Tree (existing pattern to follow)
```typescript
// Source: src/brief/generate.ts lines 149-157
if (compositionNodeIds.has(node.id)) {
  const indent = '  '.repeat(depth);
  const filename = assetNodeMap.get(node.id);
  const dims = (node.width != null && node.height != null)
    ? ` ${Math.round(node.width)}x${Math.round(node.height)}`
    : '';
  const ref = filename ? ` -> ${filename}` : '';
  lines.push(`${indent}[Illustration] '${node.name}'${dims}${ref}`);
  return;
}
```

### Instance Line Asset Cross-Reference (existing pattern to extend)
```typescript
// Source: src/brief/generate.ts lines 225-229
// Currently only checks assetNodeMap for the instance's own nodeId
const assetFile = assetNodeMap?.get(node.id);
if (assetFile) {
  label += ` -> ${assetFile}`;
}
```

### Raw Figma Node IMAGE Fill Collection (new, for extract.ts)
```typescript
// Walk raw Figma API response to collect all IMAGE fills including instance children
function collectImageFillsFromRawTree(node: any): ImageFillRef[] {
  const results: ImageFillRef[] = [];

  if (node.fills && Array.isArray(node.fills)) {
    for (const paint of node.fills) {
      if (paint.visible === false) continue;
      if (paint.type === 'IMAGE' && paint.imageRef) {
        results.push({
          imageRef: paint.imageRef,
          scaleMode: paint.scaleMode ?? 'FILL',
          nodeId: node.id,
          nodeName: node.name,
        });
      }
    }
  }

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      results.push(...collectImageFillsFromRawTree(child));
    }
  }

  return results;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Instance as opaque leaf (no child inspection) | Instance children walked for IMAGE fill detection | Phase 12 (this phase) | Captures hero images, avatars, product photos inside component instances |
| All rectangles exported as SVG | Simple rectangles silently skipped | Phase 12 (this phase) | Eliminates noise SVGs for CSS-reproducible shapes |
| Component png-render for all instances | png-fill when instance has IMAGE fill override | Phase 12 (this phase) | Exports actual image instead of component screenshot |

**Deprecated/outdated:**
- Instance sublayer rendering via /v1/images: Node IDs with I-prefix return null. Use imageRef via /v1/files/:key/images instead.

## Open Questions

1. **Raw tree access for image fill collection**
   - What we know: `normalizeNode` strips instance children, so `collectTokens` won't find IMAGE fills inside instances. The raw Figma API response has full children.
   - What's unclear: Whether the raw tree is available at the right point in the pipeline. Currently `extractLayout` calls `normalizeTree` then `collectTokens`. The raw nodes are available before normalization.
   - Recommendation: Add a `collectImageFillsFromRawTree()` call in `extractLayout` before normalization, merge results with `collectTokens` imageFills, and pass the combined list to `exportAssets`. HIGH confidence this works -- rawNodes is available at lines 54-79 of extract.ts.

2. **Instance child image -> parent instance mapping for layout tree**
   - What we know: Layout tree doesn't render instance children. To annotate the instance line with `-> hero-image.png`, we need to know which instance "owns" each child image.
   - What's unclear: Best place to build this reverse mapping.
   - Recommendation: In `findImageFillsInChildren`, track the parent instance nodeId on each AssetEntry (new optional field `parentInstanceId`). The brief generator can then add entries to assetNodeMap for `parentInstanceId -> filename`. MEDIUM confidence -- depends on how the data flows through the pipeline.

3. **Rectangle filtering inside instances**
   - What we know: The user left this as Claude's discretion.
   - What's unclear: Whether rectangle filtering matters inside instances, given that instance children are only walked for IMAGE fills (not SVGs/rectangles).
   - Recommendation: Rectangle filtering is NOT needed inside instances because the instance child walk only looks for IMAGE fills. SVG export of rectangles only happens in the main tree walk. Apply `isSimpleRectangle` only in the main RECTANGLE branch of walkTree. HIGH confidence.

## Sources

### Primary (HIGH confidence)
- `@figma/rest-api-spec` dist/api_types.ts (local package) - Confirmed InstanceNode extends FrameTraits which includes HasChildrenTrait (children: SubcanvasNode[]) and HasGeometryTrait -> MinimalFillsTrait (fills: Paint[]) where Paint includes ImagePaint with imageRef
- Project source code: identify.ts, normalize.ts, collect.ts, export.ts, generate.ts, extract.ts, figma-api.ts, sanitize.ts, breadcrumb.ts, types.ts

### Secondary (MEDIUM confidence)
- [Figma Developer Docs - File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) - Confirmed image fills are resolved via GET /v1/files/:key/images endpoint using imageRef
- [Figma Developer Docs - File Node Types](https://developers.figma.com/docs/rest-api/file-node-types/) - Confirmed INSTANCE has all properties of FRAME including children
- [Figma Forum - Can't get file nodes of component instance children](https://forum.figma.com/ask-the-community-7/can-t-get-file-nodes-of-component-instance-children-19465) - Confirmed I-prefix node IDs are instance sublayer internal IDs
- [Figma Forum - Can't Get Node with Prefix I](https://forum.figma.com/ask-the-community-7/can-t-get-node-with-prefix-i-9560) - Confirmed I-prefix node IDs don't work with /v1/files/:key/nodes endpoint
- [figma/rest-api-spec on GitHub](https://github.com/figma/rest-api-spec) - Official TypeScript type definitions for Figma REST API

### Tertiary (LOW confidence)
- [Figma Forum - Image rendering for specific node IDs](https://forum.figma.com/ask-the-community-7/is-it-possible-to-get-an-image-for-a-specific-node-id-with-the-rest-api-36894) - Suggests /v1/images may not render instance sublayers; not fully verified but consistent with I-prefix limitation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all changes within existing well-understood codebase
- Architecture: HIGH - patterns directly follow existing code patterns (composition detection, SVG dedup, image fill export); Figma API response structure confirmed via official type definitions
- Pitfalls: HIGH - I-prefix limitation confirmed by multiple forum sources and project STATE.md; other pitfalls derived from direct code analysis

**Research date:** 2026-03-01
**Valid until:** 2026-03-31 (stable domain, Figma REST API rarely changes)
