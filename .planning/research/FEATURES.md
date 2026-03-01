# Feature Landscape

**Domain:** Figma design extraction -- asset completeness and spacing accuracy (v1.3)
**Researched:** 2026-03-01
**Confidence:** HIGH (based on codebase analysis + Figma REST API spec `@figma/rest-api-spec`)

## Table Stakes

Features users expect for a "bulletproof" asset extraction tool. Missing = Claude Code fabricates replacements or builds with wrong spacing.

### Asset Detection

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| IMAGE fills inside INSTANCE children | Component instances often contain user-uploaded photos (avatars, hero images, product shots). Currently `identify.ts` returns early at INSTANCE nodes (line 76-88) without checking children for IMAGE fills. The orphan imageFills path (line 174) catches some but relies on token collection having walked the instance -- and even then, the fills lack proper tree context. | Medium | Changes to `identify.ts` walkTree: must recurse into INSTANCE children specifically for IMAGE fill detection while still exporting the instance itself as a PNG. Also need `normalize.ts` to actually recurse into INSTANCE children (currently returns early at line 173). | This is the #1 gap. A hero section with a background photo inside a component instance will produce a component PNG render (correct) but NOT export the original high-res photo (incorrect). Claude Code gets a flattened raster of the component instead of the source image. |
| IMAGE fills on INSTANCE nodes themselves | An INSTANCE frame can have an IMAGE fill set directly on it (background image override). Current code checks INSTANCE type first (line 76) and returns before the IMAGE fill check (line 91). | Low | Move IMAGE fill check before or integrate into INSTANCE handling in `identify.ts`. | Rare but real. Designers sometimes override instance backgrounds with images. |
| IMAGE fills on FRAME/GROUP nodes | A FRAME used as a container can have an IMAGE fill as its background (e.g., a section with a background photo). Currently handled correctly by the existing `hasImageFill` check -- but only if the FRAME is not inside a composition or instance. | Low | Already works for top-level frames. Need to verify it works for nested frames that aren't inside instances. | Verify existing coverage with test cases. |
| RECTANGLE nodes with IMAGE fills already exported as PNG | Currently `identify.ts` checks IMAGE fills (line 91) before checking RECTANGLE type (line 125). This is correct -- a RECTANGLE with an IMAGE fill gets `png-fill` not `svg`. | None | Already handled. | Confirmed by code review. |

### Spacing Accuracy

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| Absolute position offsets in layout tree | Absolutely-positioned children currently show `[absolute]` tag but no coordinates. Claude Code needs `top: 24px, left: 16px` to position elements correctly. Figma provides `absoluteBoundingBox` on every node. | Low | Read `absoluteBoundingBox` in `normalize.ts`, compute offset relative to parent's `absoluteBoundingBox`. Store as `{ top, left }` on LayoutNode. Render in `generate.ts` next to `[absolute]`. | Parent's bounding box minus child's bounding box gives the offset. Simple subtraction. Already have `absoluteBoundingBox` being read for width/height. |
| Non-auto-layout sibling spacing | Frames without auto-layout have no gap/padding properties. Spacing between siblings is implicit in their `absoluteBoundingBox` positions. Claude Code currently gets no spacing information for these layouts. | Medium | Compute spacing between consecutive siblings by comparing their `absoluteBoundingBox` coordinates. Only meaningful for siblings that are visually sequential (same row or same column). | This is the second biggest spacing gap. A manually-laid-out frame with 3 cards spaced 24px apart produces no spacing info in the brief. |
| Row gap accuracy for wrap layouts | `counterAxisSpacing` is already read in `flexbox-map.ts` (line 60) and included as `rowGap` when `layoutWrap === 'WRAP'`. | None | Already handled. | Confirmed working. |
| Padding accuracy | All four padding values (top, right, bottom, left) are already read from Figma's `paddingTop/Right/Bottom/Left` in `flexbox-map.ts` (line 49-54). | None | Already handled. | Confirmed working. |
| Gap (itemSpacing) accuracy | `itemSpacing` already mapped to `gap` in `flexbox-map.ts` (line 48). | None | Already handled. | Confirmed working. Supports negative values per API spec. |

## Differentiators

Features that would set the plugin apart from basic extraction. Not expected, but would noticeably improve Claude Code's output accuracy.

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|--------------|-------|
| Absolute position as CSS inset values | Instead of raw `top/left` offsets, compute `top/right/bottom/left` based on Figma's `constraints` property (which specifies whether a node is pinned to TOP, BOTTOM, LEFT, RIGHT, CENTER, or SCALE). This maps directly to CSS `position: absolute; top: X; right: Y;` | Medium | Read `constraints` from LayoutNode (already captured in `normalize.ts` line 115-117). Combine with `absoluteBoundingBox` of node and parent to compute CSS inset values. | Figma constraints are the closest analog to CSS absolute positioning anchors. A node constrained to TOP+RIGHT should produce `top: X; right: Y;` not `top: X; left: Z;`. |
| `layoutGrow` (flex: 1) detection | Figma's `layoutGrow: 1` means the child stretches along the primary axis -- equivalent to `flex: 1` or `flex-grow: 1` in CSS. Currently not extracted. | Low | Read `layoutGrow` in `normalize.ts`. Add to LayoutNode type. Render as `flex:1` in brief tree line. | Small change, significant impact. Without it, Claude Code doesn't know which child should stretch to fill available space. |
| `layoutAlign: STRETCH` detection | When a child in an auto-layout frame has `layoutAlign: 'STRETCH'`, it fills the cross-axis. Equivalent to `align-self: stretch`. Currently not extracted. | Low | Read `layoutAlign` in `normalize.ts`. Add to LayoutNode type. Render as `align-self:stretch` in brief. | Combined with `layoutGrow`, gives Claude Code the complete flex child picture. |
| Spacing between specific node pairs | For non-auto-layout frames, compute and report the gap between each pair of adjacent visible children. Format as annotations in the layout tree. | High | Requires sorting children by position, detecting row/column groupings, computing gaps. Edge cases with overlapping nodes. | Nice-to-have but complex. The simpler version (absolute position offsets) covers 80% of the need. |
| PATTERN paint detection | Figma REST API includes a `PatternPaint` type (with `sourceNodeId`, `tileType`, `scalingFactor`). Currently not handled in `collect.ts` or `identify.ts`. Rare in practice. | Low | Add case to `collect.ts` fill processing. | Very rare. Only matters if designers use Figma's pattern fill feature, which is uncommon. |
| `counterAxisAlignContent: SPACE_BETWEEN` | For wrapped auto-layout frames, this property distributes tracks with space between them (like CSS `align-content: space-between`). Currently not extracted. | Low | Read in `flexbox-map.ts`, add to AutoLayoutProps, render in brief. | Only applies to wrapping layouts with space-between content distribution. |
| `strokesIncludedInLayout` (box-sizing) | When true, the auto-layout frame behaves like `box-sizing: border-box`. Currently not extracted. Affects spacing calculations when strokes are thick. | Low | Read in `flexbox-map.ts`. Only worth reporting when strokes exist and this is true. | Minor. Only affects spacing when combined with visible strokes. |

## Anti-Features

Features to explicitly NOT build. Would add complexity without improving Claude Code's output.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Export every RECTANGLE as SVG | Current code exports all RECTANGLE nodes without IMAGE fills as SVGs (line 125-137 in `identify.ts`). Many RECTANGLEs are just colored divs or background panels that should be CSS, not SVG files. Exporting them bloats the asset list and confuses Claude Code. | Only export RECTANGLE as SVG if it has visible strokes or complex fills (gradient). Simple solid-color rectangles should be CSS `background-color`, which is already in the design tokens. |
| Compute margins (negative spacing) | Figma has no concept of margins. Trying to infer margins from absolute positions is unreliable and produces values that don't match CSS mental models. | Report absolute position offsets and let Claude Code decide margin vs padding vs positioning. |
| Deep-recurse instance children for layout tree | Walking into INSTANCE children to show their full subtree would make the layout tree enormous and duplicate the component's internal structure. | Keep instances as leaf nodes in the tree. Only recurse into instance children for IMAGE fill detection (not for layout tree rendering). |
| Export individual vector children from compositions | When a group is detected as a composition/illustration, exporting its individual VECTOR children defeats the purpose of composition detection. | Keep current behavior: export composition as single PNG. |
| Pixel-perfect spacing from visual rendering | Using `absoluteRenderBounds` instead of `absoluteBoundingBox` for spacing calculations. Render bounds include drop shadows and thick strokes, which inflates spacing values beyond what the designer intended. | Use `absoluteBoundingBox` for spacing (represents the intended geometry). Use `absoluteRenderBounds` only if implementing visual overlap detection. |

## Feature Dependencies

```
IMAGE fills in instances --> requires walking INSTANCE children in identify.ts
  (but NOT recursing in normalize.ts layout tree -- only for asset detection)

Absolute position offsets --> requires storing parent absoluteBoundingBox during normalization
  --> requires absoluteBoundingBox to be available on LayoutNode (already stored as width/height, need x/y too)

layoutGrow detection --> independent (just read property in normalize.ts)

layoutAlign detection --> independent (just read property in normalize.ts)

Constraint-based inset values --> depends on absolute position offsets being implemented first
  --> requires constraints (already captured on LayoutNode)

RECTANGLE export filtering --> independent change to identify.ts
```

## MVP Recommendation

Prioritize in this order:

1. **IMAGE fills inside INSTANCE children** (table stakes, #1 gap) -- Walk instance children in `identify.ts` to find IMAGE fills, export them alongside the instance PNG render. This is the most impactful single change for asset completeness.

2. **Absolute position offsets** (table stakes) -- Store `absoluteBoundingBox` x/y in `normalize.ts`, compute top/left offset relative to parent. Render as `[absolute top:24 left:16]` in the brief layout tree. Critical for Claude Code to position absolute elements correctly.

3. **`layoutGrow` + `layoutAlign` detection** (differentiator, low complexity) -- Two small property reads that together give Claude Code the complete flex child behavior picture. Without these, flex layouts that use fill/stretch are under-specified.

4. **RECTANGLE export filtering** (anti-feature fix, low complexity) -- Stop exporting simple colored rectangles as SVG. Only export rectangles that have strokes or non-solid fills.

5. **Plugin icon** (requirement from PROJECT.md) -- Figma logo SVG in manifest. Trivial.

Defer:
- **Spacing between non-auto-layout siblings**: High complexity, moderate value. Absolute position offsets cover the critical path.
- **Constraint-based inset values**: Medium complexity, moderate value. Can be added after absolute offsets prove useful.
- **PATTERN paint detection**: Extremely rare in practice.

## Failure Modes and Edge Cases

### IMAGE fills in instances

- **Nested instances**: An INSTANCE containing another INSTANCE that has IMAGE fills. Need to decide depth limit (recommend: walk all depths for IMAGE fills only, stop at nested INSTANCE boundaries for everything else).
- **Overridden fills**: Instance overrides can change a solid fill to an IMAGE fill. The `overrides` array on InstanceNode indicates which fields are overridden, but the actual values are in the children. Must walk the actual children, not rely on component metadata.
- **Image fill deduplication**: Multiple instances of the same component with different image overrides should export separate images. Current dedup by componentId+variant would collapse them. Solution: for instances with IMAGE fills in children, include the imageRef in the dedup key.

### Absolute position offsets

- **Rotated nodes**: `absoluteBoundingBox` for rotated nodes is the axis-aligned bounding box AFTER rotation, which is larger than the visual element. Offsets computed from these boxes will be wrong. Mitigation: detect rotation (check for `rotation` property) and flag it rather than computing incorrect offsets.
- **Scroll containers**: Nodes inside scrolling frames may have absoluteBoundingBox positions that extend beyond the visible viewport. Mitigation: clip reported offsets to parent bounds when parent has overflow scrolling.
- **Nested frames**: Computing offset relative to the immediate parent vs the nearest positioned ancestor. Use immediate parent's absoluteBoundingBox for consistency.

### RECTANGLE filtering

- **Decorative dividers**: A RECTANGLE used as a horizontal line/divider should probably be CSS border, not SVG. But if it has a gradient fill, it might need to be an SVG. Filter by: solid fill only + no strokes = skip SVG export.
- **Rounded rectangles with complex borders**: These might be CSS-achievable but complex. Keep exporting if cornerRadius + strokes are both present.

## Sources

- Figma REST API spec: `@figma/rest-api-spec` package (local, v-current) -- HIGH confidence
- Figma REST API spec on GitHub: [rest-api-spec/dist/api_types.ts](https://github.com/figma/rest-api-spec/blob/main/dist/api_types.ts) -- HIGH confidence
- Codebase analysis: `src/assets/identify.ts`, `src/layout/normalize.ts`, `src/layout/flexbox-map.ts`, `src/tokens/collect.ts`, `src/brief/generate.ts` -- HIGH confidence (direct code review)
- Figma Forum on absoluteRenderBounds: [absoluteRenderBounds clipped by Frame](https://forum.figma.com/ask-the-community-7/absoluterenderbounds-clipped-by-the-frame-in-get-file-results-12297) -- MEDIUM confidence
- Figma Forum on counterAxisSpacing: [Differentiate vertical/horizontal item spacing](https://forum.figma.com/t/solved-differentiate-vertical-horizontal-item-spacing-values-in-rest-api-response-for-wrapping-auto-layout-frames/47830) -- MEDIUM confidence
- Figma Plugin docs on itemSpacing: [itemSpacing property](https://www.figma.com/plugin-docs/api/properties/nodes-itemspacing/) -- HIGH confidence
- Figma Plugin docs on counterAxisSpacing: [counterAxisSpacing property](https://www.figma.com/plugin-docs/api/properties/nodes-counteraxisspacing/) -- HIGH confidence
- Figma Help Center on auto layout: [Guide to auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout) -- HIGH confidence
