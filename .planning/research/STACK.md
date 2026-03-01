# Technology Stack

**Project:** Ship Studio Figma Plugin v1.3 -- Asset Completeness & Spacing Accuracy
**Researched:** 2026-03-01

## Executive Summary

No new libraries are needed. The existing stack (`@figma/rest-api-spec`, `curl` via `shell.exec`, TypeScript, Vitest) already provides everything required for v1.3. The gaps are in **how the existing Figma REST API response is used**, not in what tools are available.

Three specific code-level changes are needed:

1. **Recurse into INSTANCE children for IMAGE fill detection** -- the REST API already returns children on INSTANCE nodes (confirmed: `InstanceNode` extends `FrameTraits` which includes `HasChildrenTrait`), but `identify.ts` and `normalize.ts` both treat INSTANCE as a leaf node and skip children entirely.

2. **Detect IMAGE fills on ALL node types, including inside component instances** -- currently only nodes the walker reaches have their fills checked. Since INSTANCE children are skipped, IMAGE fills inside component instances are invisible to both `identifyAssets` and `collectTokens`.

3. **Capture missing auto-layout child properties** (`layoutAlign`, `layoutGrow`) that affect spacing accuracy -- these exist in the API response but are not extracted during normalization.

## Recommended Stack (No Changes from v1.2)

### Core Framework (unchanged)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TypeScript | 5.x | Type safety | Already in use |
| React 18 | (host-provided) | Plugin UI | Ship Studio provides React |
| Vite | (starter config) | Build | Already in use |
| Vitest | existing | Testing | Already in use |

### Figma API (unchanged)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@figma/rest-api-spec` | ^0.36.0 | Type definitions | Already provides `InstanceNode`, `ImagePaint`, all `HasFramePropertiesTrait` types |
| `curl` via `shell.exec` | N/A | HTTP requests | Already the API access pattern |

### No New Dependencies

The milestone requirements are solved entirely by using existing API fields more thoroughly, not by adding libraries.

## Figma REST API Fields: What We Need and What We Have

### 1. Complete Asset Detection: IMAGE Fills Inside Component Instances

**The problem in the current code:**

`identify.ts` line 76-88:
```typescript
// INSTANCE nodes -> export as PNG, deduplicated by component+variant
if (node.type === 'INSTANCE' && node.componentRef) {
    // ... creates png-render entry ...
    return; // Don't recurse into instance children  <-- THE GAP
}
```

`normalize.ts` line 170-173:
```typescript
case 'INSTANCE':
    result.componentRef = buildComponentRef(node, components);
    // Do NOT recurse into children -- instances are leaf nodes  <-- THE GAP
    return result;
```

**What the API actually provides (verified from `@figma/rest-api-spec`):**

```typescript
// node_modules/@figma/rest-api-spec/dist/api_types.ts line 1110-1142:
export type InstanceNode = {
  type: 'INSTANCE'
  componentId: string
  componentProperties?: { [key: string]: ComponentProperty }
  overrides: Overrides[]
} & FrameTraits

// FrameTraits (line 804-819):
// = IsLayerTrait & HasChildrenTrait & HasLayoutTrait &
//   HasFramePropertiesTrait & HasGeometryTrait & ...

// HasChildrenTrait (line 165-169):
export type HasChildrenTrait = {
  children: SubcanvasNode[]  // INSTANCE nodes DO have children in the response
}

// HasGeometryTrait (line 504) includes MinimalFillsTrait:
export type MinimalFillsTrait = {
  fills: Paint[]  // INSTANCE nodes DO have fills
}
```

**Key insight:** The Figma REST API returns the **full subtree** of INSTANCE nodes, including all children with their fills, strokes, and effects. The data is already there in the API response -- the code just stops walking before it reaches it.

**What IMAGE fills look like in the response:**

```typescript
// ImagePaint type from @figma/rest-api-spec:
export type ImagePaint = {
  type: 'IMAGE'
  scaleMode: 'FILL' | 'FIT' | 'TILE' | 'STRETCH'
  imageRef: string           // Key for resolving via GET /v1/files/:key/images
  imageTransform?: Transform
  scalingFactor?: number
  filters?: ImageFilters
  rotation?: number
  gifRef?: string
} & BasePaint
```

IMAGE fills can appear on any node type: FRAME (background images), RECTANGLE (image containers), ELLIPSE (circular avatars), INSTANCE (component-level backgrounds), and even GROUP nodes.

**Resolution needed:** After exporting the INSTANCE itself as `png-render`, walk its children looking ONLY for `fills[].type === 'IMAGE'` nodes. Export those as separate `png-fill` entries. Do not export child vectors/shapes as separate SVGs (they belong to the component render).

**Confidence:** HIGH -- verified from `@figma/rest-api-spec` type definitions installed locally at `node_modules/@figma/rest-api-spec/dist/api_types.ts`.

### 2. IMAGE Fill Detection on FRAME Backgrounds

**Current behavior:** `identify.ts` checks `hasImageFill(node)` at line 91 for any node the walker reaches. This correctly catches RECTANGLE and FRAME nodes with IMAGE fills at the top level.

**Gap:** The `collectTokens` walk in `collect.ts` (line 312) recurses into children of all LayoutNode types. But since `normalizeNode` returns INSTANCE as a leaf (no children), any IMAGE fills inside instances are never collected as `ImageFillRef` entries for the token system either.

**Both pipelines miss the same data:** `identifyAssets` and `collectTokens` both skip INSTANCE internals.

**Resolution:** A single new function that walks the raw Figma API response (before normalization) to find all `fills[].type === 'IMAGE'` nodes anywhere in the tree, including inside INSTANCE subtrees. This produces a comprehensive `ImageFillRef[]` list that feeds into both `identifyAssets` (for asset export) and `collectTokens` (for the design tokens section of the brief).

**Confidence:** HIGH -- verified by reading source code of both pipelines.

### 3. The Image Fills Resolution API (Already Used Correctly)

The existing `fetchImageFills` in `figma-api.ts` calls `GET /v1/files/:key/images` which returns ALL image fill URLs for the entire file as a map of `imageRef -> downloadURL`. This endpoint is already called when any `png-fill` entries exist. No changes needed here -- the resolution step is correct, we just need to collect more `imageRef` values to resolve.

**Confidence:** HIGH.

### 4. Spacing Accuracy: What Auto-Layout Properties Exist

**Already extracted correctly (no changes needed):**

| Figma Property | CSS Equivalent | Where Extracted | Status |
|----------------|---------------|-----------------|--------|
| `paddingTop` | `padding-top` | `flexbox-map.ts:49` | OK |
| `paddingRight` | `padding-right` | `flexbox-map.ts:50` | OK |
| `paddingBottom` | `padding-bottom` | `flexbox-map.ts:51` | OK |
| `paddingLeft` | `padding-left` | `flexbox-map.ts:52` | OK |
| `itemSpacing` | `gap` | `flexbox-map.ts:48` | OK |
| `counterAxisSpacing` | `row-gap` (wrapping) | `flexbox-map.ts:60` | OK |
| `layoutMode` | `flex-direction` | `flexbox-map.ts:45` | OK |
| `primaryAxisAlignItems` | `justify-content` | `flexbox-map.ts:46` | OK |
| `counterAxisAlignItems` | `align-items` | `flexbox-map.ts:47` | OK |
| `layoutWrap` | `flex-wrap` | `flexbox-map.ts:55` | OK |

### 5. Spacing Properties NOT Yet Extracted (Need Adding)

| Figma Property | CSS Equivalent | Type Definition Location | Impact on Spacing |
|----------------|---------------|--------------------------|-------------------|
| `layoutAlign` | `align-self: stretch` | `HasLayoutTrait` (child property) | HIGH -- without this, Claude Code uses fixed width for children that should stretch to fill parent. Common in cards, sections, form fields. |
| `layoutGrow` | `flex-grow: 1` | `HasLayoutTrait` (child property) | HIGH -- without this, Claude Code uses fixed height/width for children that should flex to fill remaining space. Common in content areas, spacers. |
| `strokesIncludedInLayout` | `box-sizing: border-box` | `HasFramePropertiesTrait` | MEDIUM -- when true, strokes are inside the bounding box. When false (default), strokes add to element size. Affects spacing by up to 2x stroke weight. |
| `individualStrokeWeights` | `border-top/right/bottom/left-width` | `IndividualStrokesTrait` | LOW -- only matters when strokes differ per side (e.g., bottom-border-only dividers). Currently only uniform `strokeWeight` is captured. |
| `counterAxisAlignContent` | `align-content: space-between` | `HasFramePropertiesTrait` | LOW -- only applies to wrapping auto-layout frames. Affects distribution of wrapped tracks. |

**Exact property paths from `@figma/rest-api-spec`:**

```typescript
// HasLayoutTrait (line 172+):
layoutAlign?: 'INHERIT' | 'STRETCH' | 'MIN' | 'CENTER' | 'MAX'
layoutGrow?: 0 | 1

// HasFramePropertiesTrait (line 358+):
strokesIncludedInLayout?: boolean
counterAxisAlignContent?: 'AUTO' | 'SPACE_BETWEEN'

// IndividualStrokesTrait:
individualStrokeWeights?: {
  top: number
  right: number
  bottom: number
  left: number
}
```

**Confidence:** HIGH -- all verified from locally installed `@figma/rest-api-spec`.

### 6. Spacing for Non-Auto-Layout Frames

**Current behavior:** Non-auto-layout frames produce no `autoLayout` property. Their children are listed with dimensions but no spacing context.

**What the API provides:** `absoluteBoundingBox = { x, y, width, height }` on every node.

**Derived spacing (no new API calls):**
```
padding-top    = firstChild.y - parent.y
padding-left   = firstChild.x - parent.x
gap (vertical) = nextChild.y - (prevChild.y + prevChild.height)
```

**Recommendation: Skip for v1.3.** This adds heuristic complexity (detecting whether children are linearly arranged, handling overlapping nodes, rotated elements). Most modern Figma designs use auto-layout. The `layoutAlign` and `layoutGrow` properties (item 5 above) will have far more impact on spacing accuracy than inferring spacing from absolute positions.

**Confidence:** MEDIUM on the skip recommendation -- if user testing reveals many non-auto-layout spacing issues, this should be revisited.

## Integration Points with Existing Pipeline

### Change 1: Collect IMAGE Fills from Inside INSTANCE Subtrees

**Best approach:** Add a new function (e.g., `collectAllImageFills`) that walks the **raw Figma API response** before normalization. This function recursively traverses all nodes including INSTANCE children, collecting every `fills[].type === 'IMAGE'` it finds as an `ImageFillRef`.

**Where to add:** New utility, called from `extractLayout` in `src/layout/extract.ts` after the API response is received but before `normalizeTree` is called. The resulting `ImageFillRef[]` replaces (or supplements) what `collectTokens` currently finds.

**Why not modify normalize.ts:** The normalization contract (INSTANCE = leaf) is used by brief generation, layout tree rendering, and composition detection. Changing it has a wide blast radius. A separate pre-normalization walk is safer.

**Files affected:**
- New: `src/assets/collect-image-fills.ts` (or similar)
- Modified: `src/layout/extract.ts` (call the new function, pass results through)
- Modified: `src/assets/export.ts` (receives more complete `imageFills` list)

### Change 2: Walk INSTANCE Children in Asset Identification

**File:** `src/assets/identify.ts`
**Current:** Lines 76-88 return early on INSTANCE.
**Needed:** After creating the `png-render` entry for the INSTANCE, continue walking its children looking ONLY for IMAGE fills. Do NOT export child vectors/shapes as separate SVGs.

**Implementation sketch:**
```typescript
if (node.type === 'INSTANCE' && node.componentRef) {
    const key = instanceDedupKey(node);
    if (!seenInstances.has(key)) {
        seenInstances.add(key);
        entries.push({ /* png-render entry */ });
    }
    // NEW: scan instance children for IMAGE fills only
    if (node.children) {
        walkForImageFills(node, imageFillMap, matchedNodeIds, entries);
    }
    return;
}
```

### Change 3: Add layoutAlign and layoutGrow to Normalization

**File:** `src/layout/normalize.ts`
**Add after line 107 (positioning):**
```typescript
if ('layoutAlign' in node && node.layoutAlign != null && node.layoutAlign !== 'INHERIT') {
    result.layoutAlign = node.layoutAlign;
}
if ('layoutGrow' in node && node.layoutGrow != null && node.layoutGrow !== 0) {
    result.layoutGrow = node.layoutGrow;
}
```

**File:** `src/layout/types.ts`
**Add to LayoutNode interface:**
```typescript
layoutAlign?: 'STRETCH' | 'MIN' | 'CENTER' | 'MAX';
layoutGrow?: 0 | 1;
```

### Change 4: Surface New Properties in Brief

**File:** `src/brief/generate.ts`
**In `buildInlineStyles`:** Add `layoutAlign: STRETCH` as `{align-self:stretch}` and `layoutGrow: 1` as `{flex-grow:1}`.

### Change 5 (Optional): strokesIncludedInLayout

**File:** `src/layout/flexbox-map.ts`
**Add to AutoLayoutProps output:**
```typescript
if (frame.strokesIncludedInLayout) {
    result.boxSizing = 'border-box';
}
```

**File:** `src/layout/types.ts` -- add `boxSizing?: 'border-box'` to `AutoLayoutProps`.

## Existing API Endpoints (No Changes Needed)

| Endpoint | Used For | Already Implemented |
|----------|----------|---------------------|
| `GET /v1/files/:key/nodes?ids=X` | Fetch node subtree (includes INSTANCE children) | `fetchFileNodes` in `figma-api.ts` |
| `GET /v1/files/:key` | Fetch full file | `fetchFullFile` in `figma-api.ts` |
| `GET /v1/images/:key?ids=X&format=png&scale=2` | Render nodes as PNG | `fetchImages` in `figma-api.ts` |
| `GET /v1/images/:key?ids=X&format=svg` | Export SVGs | `fetchImages` in `figma-api.ts` |
| `GET /v1/files/:key/images` | Resolve imageRef to download URLs | `fetchImageFills` in `figma-api.ts` |

## What NOT to Add

- **No new npm packages.** `@figma/rest-api-spec` already has all needed types.
- **No new API endpoints.** The five endpoints above cover everything.
- **No Figma Plugin API.** Ship Studio plugins run outside Figma via shell.
- **No image processing.** Assets download as-is from Figma CDN.
- **No non-auto-layout spacing inference for v1.3.** Focus on getting auto-layout spacing right first.

## Sources

- [`@figma/rest-api-spec` types (local)](https://github.com/figma/rest-api-spec/blob/main/dist/api_types.ts) -- verified InstanceNode extends FrameTraits with HasChildrenTrait and MinimalFillsTrait (HIGH confidence)
- [Figma REST API file endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- depth parameter, image fills endpoint, subtree response structure (HIGH confidence)
- [Figma REST API introduction](https://developers.figma.com/docs/rest-api/) -- full subtree returned in response including INSTANCE children (HIGH confidence)
- [Figma forum: component instance children](https://forum.figma.com/ask-the-community-7/can-t-get-file-nodes-of-component-instance-children-19465) -- confirms children present but with "I"-prefixed node IDs (MEDIUM confidence)
- [Figma forum: imageRef resolution](https://forum.figma.com/t/can-i-get-images-using-imageref/14448) -- imageRef resolved via GET image fills endpoint (HIGH confidence)
- [Figma Plugin API: layoutAlign](https://www.figma.com/plugin-docs/api/properties/nodes-layoutalign/) -- child alignment in auto-layout (HIGH confidence)
- [Figma Plugin API: layoutGrow](https://www.figma.com/plugin-docs/api/properties/nodes-layoutgrow/) -- child flex-grow in auto-layout (HIGH confidence)
- [Figma Plugin API: strokesIncludedInLayout](https://developers.figma.com/docs/plugins/api/properties/nodes-strokesincludedinlayout/) -- box-sizing behavior (HIGH confidence)
- Local codebase: `src/assets/identify.ts`, `src/layout/normalize.ts`, `src/layout/flexbox-map.ts`, `src/tokens/collect.ts`, `src/layout/types.ts` -- verified current behavior and exact line-level gaps (HIGH confidence)
