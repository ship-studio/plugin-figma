# Phase 13: Spacing & Layout Accuracy - Research

**Researched:** 2026-03-01
**Domain:** Figma REST API layout properties -> CSS flexbox brief output
**Confidence:** HIGH

## Summary

Phase 13 adds three specific spacing/layout properties to the design brief: absolute position offsets (top/left), flex-grow, and align-self: stretch. All three Figma REST API properties (`layoutPositioning`, `layoutGrow`, `layoutAlign`) are already documented in `@figma/rest-api-spec`'s `HasLayoutTrait` and confirmed present in the installed package. The codebase already partially handles absolute positioning (captures `layoutPositioning` onto `LayoutNode.positioning` and renders `[absolute]` in the brief) but does not yet compute the top/left offset or read `layoutGrow`/`layoutAlign` at all.

The work is straightforward: (1) extend `normalizeNode` to read `layoutGrow` and `layoutAlign` from raw Figma nodes, (2) compute absolute position offsets by subtracting the parent's `absoluteBoundingBox.x/y` from the child's, (3) add new fields to the `LayoutNode` type, and (4) update `renderNodeLine` in `generate.ts` to output these properties in the brief's layout tree.

**Primary recommendation:** Add `layoutGrow`, `layoutAlign`, and absolute offsets (top/left) to the normalization pipeline and render them inline in the layout tree -- no new files, just extending existing `normalize.ts`, `types.ts`, `generate.ts`, and their tests.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SPACE-01 | Brief includes absolute position offsets (top/left relative to parent) for absolutely-positioned elements | Figma REST API `absoluteBoundingBox` provides absolute x/y for every node. Offset = child.absoluteBoundingBox.{x,y} - parent.absoluteBoundingBox.{x,y}. Must also subtract parent padding. `normalizeNode` needs parent bbox passed in. |
| SPACE-02 | Brief includes flex-grow: 1 when a flex child has layoutGrow: 1 | Figma REST API `layoutGrow` property on `HasLayoutTrait`, type `0 | 1`. Already in `@figma/rest-api-spec`. Not currently read anywhere in codebase. |
| SPACE-03 | Brief includes align-self: stretch when a flex child has layoutAlign: STRETCH | Figma REST API `layoutAlign` property on `HasLayoutTrait`, type `'INHERIT' | 'STRETCH' | 'MIN' | 'CENTER' | 'MAX'`. Already in `@figma/rest-api-spec`. Not currently read anywhere in codebase. |
</phase_requirements>

## Standard Stack

### Core (already installed, no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @figma/rest-api-spec | latest | Figma REST API TypeScript types | Official Figma type definitions; already used for `LayoutConstraint` |
| vitest | (installed) | Unit testing | Already used for all test files in project |

No new libraries needed. All three requirements are addressed by reading existing Figma REST API properties and formatting them in the brief output.

## Architecture Patterns

### Affected Files (all modifications, no new files)

```
src/
  layout/
    types.ts           # Add layoutGrow, layoutAlign, absoluteOffset fields to LayoutNode
    normalize.ts       # Read layoutGrow, layoutAlign from raw nodes; compute absoluteOffset
    normalize.test.ts  # Tests for new normalization behavior
  brief/
    generate.ts        # Render new properties in renderNodeLine
    generate.test.ts   # Tests for new brief output format
```

### Pattern 1: Extending LayoutNode with New Flex Child Properties

**What:** Add optional fields to `LayoutNode` for the three new properties.
**When to use:** When a Figma node has `layoutGrow: 1`, `layoutAlign: 'STRETCH'`, or `positioning: 'ABSOLUTE'` with computable offsets.

```typescript
// In types.ts -- add to LayoutNode interface
export interface LayoutNode {
  // ... existing fields ...

  /** flex-grow: 1 when Figma layoutGrow is 1 (SPACE-02) */
  layoutGrow?: 0 | 1;

  /** layoutAlign from Figma -- only STRETCH is actionable for CSS (SPACE-03) */
  layoutAlign?: 'INHERIT' | 'STRETCH';

  /** Absolute position offset relative to parent (SPACE-01) */
  absoluteOffset?: { top: number; left: number };
}
```

### Pattern 2: Computing Absolute Offset in normalizeNode

**What:** Pass parent's `absoluteBoundingBox` into `normalizeNode` so that when a child has `positioning === 'ABSOLUTE'`, the offset can be computed.
**When to use:** Only for nodes with `layoutPositioning: 'ABSOLUTE'`.

```typescript
// In normalize.ts -- modify normalizeNode signature to accept parent bbox
export function normalizeNode(
  figmaNode: any,
  components: Record<string, any>,
  depth: number,
  parentBBox?: { x: number; y: number } | null,  // NEW parameter
): LayoutNode | null {
  // ... existing code ...

  // Compute absolute offset when positioned absolutely (SPACE-01)
  if (result.positioning === 'ABSOLUTE' && parentBBox && node.absoluteBoundingBox) {
    result.absoluteOffset = {
      top: Math.round(node.absoluteBoundingBox.y - parentBBox.y),
      left: Math.round(node.absoluteBoundingBox.x - parentBBox.x),
    };
  }

  // When recursing into children, pass this node's bbox
  if ('children' in node && Array.isArray(node.children)) {
    const myBBox = node.absoluteBoundingBox
      ? { x: node.absoluteBoundingBox.x, y: node.absoluteBoundingBox.y }
      : null;
    const normalizedChildren = node.children
      .map((child: any) => normalizeNode(child, components, depth + 1, myBBox))
      .filter((n: LayoutNode | null): n is LayoutNode => n !== null);
    result.children = deduplicateChildren(normalizedChildren);
  }
}
```

### Pattern 3: Rendering in Brief Layout Tree

**What:** Add inline annotations for the new properties in `renderNodeLine`.
**When to use:** When rendering layout tree lines in the brief.

```typescript
// In generate.ts -- inside renderNodeLine, after existing [absolute] tag

// Absolute offset (SPACE-01) -- show after [absolute]
if (node.absoluteOffset) {
  parts.push(`top:${node.absoluteOffset.top} left:${node.absoluteOffset.left}`);
}

// Flex-grow (SPACE-02) -- inside style annotations
if (node.layoutGrow === 1) {
  props.push('flex-grow:1');
}

// Align-self: stretch (SPACE-03) -- inside style annotations
if (node.layoutAlign === 'STRETCH') {
  props.push('align-self:stretch');
}
```

### Anti-Patterns to Avoid

- **Do NOT use relativeTransform for offset calculation:** `relativeTransform` requires `geometry=paths` query parameter on the API call and is a 2D affine matrix. The plugin does not currently pass this parameter. Using `absoluteBoundingBox` subtraction is simpler and already available.
- **Do NOT include padding offset in brief position values:** The top/left offset from `absoluteBoundingBox` subtraction already accounts for padding in the parent's coordinate space. Subtracting padding separately would double-count it. However, be aware that the `absoluteBoundingBox` x/y values are canvas-absolute, so the offset includes the parent's padding area. The raw offset (child.x - parent.x) gives the position relative to the parent's top-left corner, which is what CSS `top`/`left` means with `position: absolute` -- this is the correct behavior since CSS absolute positioning is relative to the padding box.
- **Do NOT render layoutAlign: INHERIT:** Only `STRETCH` is actionable CSS information. `INHERIT` is the default and adds noise.
- **Do NOT render layoutGrow: 0:** Only `1` (stretch/grow) is actionable. `0` is the fixed-size default.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Position offset calculation | Complex transform matrix math | Simple `absoluteBoundingBox` subtraction | Figma provides absolute coordinates for every node; subtraction gives parent-relative offset |
| Flex child property mapping | Custom Figma-to-CSS mapping layer | Direct property read + rename | `layoutGrow: 1` -> `flex-grow: 1` and `layoutAlign: STRETCH` -> `align-self: stretch` are 1:1 mappings |

## Common Pitfalls

### Pitfall 1: Forgetting to Pass Parent BBox Down the Recursion
**What goes wrong:** `normalizeNode` currently doesn't receive parent context. Adding a parameter changes the function signature, which affects the recursive call site and the entry point in `normalizeTree`.
**Why it happens:** The function was designed without parent-relative calculations.
**How to avoid:** Make the new `parentBBox` parameter optional with a default of `null/undefined`. Update all call sites: (1) `normalizeTree` calls with `null` for root nodes, (2) recursive calls pass `node.absoluteBoundingBox`.
**Warning signs:** Tests fail because root nodes have no parent bbox and the parameter is required.

### Pitfall 2: Offset Calculation on Nodes Without absoluteBoundingBox
**What goes wrong:** Hidden nodes can have `absoluteBoundingBox: null`. Attempting to subtract from null crashes.
**Why it happens:** Figma sets `absoluteBoundingBox` to null for invisible nodes.
**How to avoid:** Guard: only compute offset when both child AND parent have non-null `absoluteBoundingBox`. Already filtered by the existing `node.absoluteBoundingBox != null` check.
**Warning signs:** TypeError on null access in production with hidden elements.

### Pitfall 3: Rounding Offset Values
**What goes wrong:** Figma can return fractional pixel values (e.g., `x: 123.456`). Without rounding, the brief shows noisy decimals.
**Why it happens:** Figma uses floating-point coordinates internally.
**How to avoid:** Apply `Math.round()` to offset values, consistent with how `width` and `height` are already rounded in `renderNodeLine`.

### Pitfall 4: layoutAlign Values Beyond STRETCH
**What goes wrong:** The REST API can return `MIN`, `CENTER`, `MAX` for `layoutAlign` in older auto-layout versions. These map to cross-axis alignment, which is already handled by the parent's `counterAxisAlignItems` -> `alignItems` mapping.
**Why it happens:** `layoutAlign` has two semantic meanings depending on auto-layout version.
**How to avoid:** Only capture `STRETCH` as the interesting value. The parent's `alignItems` already covers `MIN`/`CENTER`/`MAX` alignment. Storing the full value on the child is redundant except for `STRETCH` (which overrides the parent).

### Pitfall 5: Offset Includes Parent Padding But That Is Correct
**What goes wrong:** Developer subtracts parent padding from the offset, thinking CSS `position: absolute` is relative to the content box.
**Why it happens:** CSS `position: absolute` positions relative to the padding box (not content box), and Figma's `absoluteBoundingBox` represents the full frame including padding area. So `child.x - parent.x` gives the correct CSS `left` value.
**How to avoid:** Do NOT subtract parent padding. The raw subtraction gives the correct CSS value.

## Code Examples

### Reading layoutGrow and layoutAlign in normalizeNode

```typescript
// Source: @figma/rest-api-spec HasLayoutTrait (confirmed in node_modules)
// In normalize.ts, add after the layoutPositioning block (line ~107):

// Flex child: layoutGrow (SPACE-02)
if ('layoutGrow' in node && node.layoutGrow === 1) {
  result.layoutGrow = 1;
}

// Flex child: layoutAlign (SPACE-03)
if ('layoutAlign' in node && node.layoutAlign === 'STRETCH') {
  result.layoutAlign = 'STRETCH';
}
```

### Computing Absolute Offset

```typescript
// In normalize.ts, after positioning capture:
if (result.positioning === 'ABSOLUTE' && parentBBox && node.absoluteBoundingBox) {
  result.absoluteOffset = {
    top: Math.round(node.absoluteBoundingBox.y - parentBBox.y),
    left: Math.round(node.absoluteBoundingBox.x - parentBBox.x),
  };
}
```

### Rendering in Brief Output

```typescript
// In generate.ts renderNodeLine, modify the positioning block:

// Current code (line ~269):
if (node.positioning === 'ABSOLUTE') {
  parts.push('[absolute]');
}

// Updated:
if (node.positioning === 'ABSOLUTE') {
  if (node.absoluteOffset) {
    parts.push(`[absolute] top:${node.absoluteOffset.top} left:${node.absoluteOffset.left}`);
  } else {
    parts.push('[absolute]');
  }
}

// In the buildInlineStyles function, add flex child props:
if (node.layoutGrow === 1) props.push('flex-grow:1');
if (node.layoutAlign === 'STRETCH') props.push('align-self:stretch');
```

### Expected Brief Output Examples

```
Frame 'Hero Section' (column, gap: 24, padding: 32) 1200x800
  Frame 'Badge' 50x50 [absolute] top:16 left:16
  Text 'Title' (Inter 48/700) 800x60 {flex-grow:1}
  Frame 'Content Row' (row, gap: 16) 800x400 {align-self:stretch}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `[absolute]` tag only | `[absolute] top:N left:N` | Phase 13 | Claude Code can now set exact CSS position values |
| No flex-grow info | `{flex-grow:1}` inline | Phase 13 | Claude Code knows which elements stretch along primary axis |
| No align-self info | `{align-self:stretch}` inline | Phase 13 | Claude Code knows which elements stretch along cross axis |

**Note:** `layoutGrow` and `layoutAlign` are stable Figma REST API properties in `HasLayoutTrait`. They have been available since at least the `@figma/rest-api-spec` package version installed in this project.

## Open Questions

1. **Should `layoutAlign` values beyond STRETCH (MIN, CENTER, MAX) be surfaced?**
   - What we know: The parent frame's `counterAxisAlignItems` already communicates the default cross-axis alignment for all children. Individual child `layoutAlign` values of MIN/CENTER/MAX only matter when they differ from the parent default.
   - What's unclear: Whether surfacing per-child alignment overrides (MIN/CENTER/MAX) would help Claude Code. These map to `align-self: flex-start/center/flex-end`.
   - Recommendation: Start with STRETCH only (requirement scope). Consider adding MIN/CENTER/MAX in a future phase if real-world briefs show alignment mismatches.

2. **Should offsets account for parent padding?**
   - What we know: CSS `position: absolute` positions relative to the padding box. Figma's `absoluteBoundingBox` gives the frame's outer edge coordinates. The raw subtraction gives the correct CSS `left`/`top` value.
   - What's unclear: Nothing -- this is well-understood CSS behavior.
   - Recommendation: Use raw subtraction. Do NOT subtract padding. This matches CSS semantics.

## Sources

### Primary (HIGH confidence)
- `@figma/rest-api-spec` installed package (`node_modules/@figma/rest-api-spec/dist/api_types.ts` lines 172-241) -- confirmed `layoutGrow`, `layoutAlign`, `layoutPositioning`, `absoluteBoundingBox` in `HasLayoutTrait`
- Existing codebase files: `src/layout/normalize.ts`, `src/layout/types.ts`, `src/brief/generate.ts` -- confirmed current handling of positioning and where to add new logic

### Secondary (MEDIUM confidence)
- [Figma Plugin API: layoutPositioning](https://developers.figma.com/docs/plugins/api/properties/nodes-layoutpositioning/) -- confirmed ABSOLUTE positioning takes node out of auto-layout flow, explicit x/y control
- [Figma Plugin API: layoutAlign](https://developers.figma.com/docs/plugins/api/properties/nodes-layoutalign/) -- confirmed STRETCH fills parent counter axis
- [Figma Plugin API: layoutGrow](https://developers.figma.com/docs/plugins/api/properties/nodes-layoutgrow/) -- confirmed 0=fixed, 1=stretch along primary axis
- [Figma REST API spec on GitHub](https://github.com/figma/rest-api-spec/blob/main/dist/api_types.ts) -- confirmed REST API types match Plugin API semantics

### Tertiary (LOW confidence)
- None -- all findings verified against official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all properties confirmed in installed @figma/rest-api-spec
- Architecture: HIGH - extending existing normalize/generate pipeline with well-understood pattern
- Pitfalls: HIGH - edge cases identified from direct codebase inspection (null bbox, rounding, padding)

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable Figma API, no expected changes)
