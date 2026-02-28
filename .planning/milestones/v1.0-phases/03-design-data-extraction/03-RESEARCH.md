# Phase 3: Design Data Extraction - Research

**Researched:** 2026-02-28
**Domain:** Figma REST API node properties -> design token extraction & deduplication
**Confidence:** HIGH

## Summary

Phase 3 extracts design tokens (colors, typography, spacing, borders, shadows) and builds a component inventory from the normalized layout tree produced in Phase 2. The Figma REST API already returns all needed properties on every node -- fills, strokes, effects, corner radii, and typography styles are part of the standard node response. No additional API calls are required.

The core work is (1) extending `normalizeNode` to capture style properties (fills, strokes, effects, corner radii) on each LayoutNode during the existing tree walk, (2) building a post-walk token collection/deduplication pass that scans the enriched tree and produces deduplicated color, typography, spacing, border, and shadow tokens with back-references and usage counts, and (3) building a component inventory from the existing `componentRef` data already on the tree.

**Primary recommendation:** Extend LayoutNode with optional style fields, enrich normalizeNode to populate them, then write a pure `collectTokens(rootNodes)` function that walks the enriched tree to produce a `DesignTokens` collection. The styles map from the Figma API response must be plumbed through to resolve named style references.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Separate token collection alongside the layout tree (not inline on each node)
- Tokens grouped by type: colors, typography, spacing, borders, shadows
- Each token includes back-references to which nodes use it
- Extend normalizeNode to capture style data (fills, strokes, effects) on LayoutNode during the existing tree walk, then collect/deduplicate tokens from the enriched tree
- Include spacing tokens extracted from auto-layout padding/gap values as a deduplicated "spacing scale" (e.g., 4px, 8px, 16px) with usage counts
- Output hex (#RRGGBB) for opaque colors, rgba(R,G,B,A) for alpha < 1
- Convert Figma 0-1 floats to 0-255 integers
- Full CSS gradient syntax for gradient fills: `linear-gradient(135deg, #fff 0%, #000 100%)`
- Capture all fills in stack order with blend mode and opacity (not just top fill)
- Image fills noted as placeholders with scale mode (fill/fit/crop) -- actual export is Phase 4
- Typography extraction: font family, font size, font weight, line height, letter spacing
- Full style match for deduplication (family + size + weight + line height + letter spacing must all match to be same token)
- Border: corner radius (per-corner if different), stroke color, stroke weight
- Shadows: drop shadow and inner shadow parameters (color, offset, blur, spread)
- Phase 2's componentRef already satisfies COMP-01/02/03 -- no additional extraction needed
- Component inventory list in token output: deduplicated, showing name, variants, usage count, local/library tag
- Library components tagged but treated the same as local components (not separate sections)
- Exact match only for colors (no near-match grouping)
- Full style match for typography (all properties must match)
- Usage counts on every token (e.g., "#4A90D9 used 12 times")
- Use Figma's named styles as token names when available; auto-generate names for unnamed styles

### Claude's Discretion
- Exact type definitions for token interfaces
- How to structure the second tree walk vs enriching normalizeNode
- Shadow/border extraction implementation details
- Auto-generated token name format for unnamed styles
- How to handle mixed/missing style data on nodes

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TOKN-01 | Plugin extracts fill colors (solid, gradient) with proper 0-1 to 0-255 conversion | Figma node `fills: Paint[]` array provides SolidPaint (with RGBA 0-1) and GradientPaint (with gradientHandlePositions + ColorStop[]). Conversion: `Math.round(channel * 255)`. Gradient angle from handle positions via atan2. |
| TOKN-02 | Plugin extracts typography properties (font family, size, weight, line height, letter spacing) | TEXT nodes carry `style: TypeStyle` with fontFamily, fontSize, fontWeight, lineHeightPx, letterSpacing. Available directly from the API response. |
| TOKN-03 | Plugin extracts spacing values (padding, gap, margin) from auto-layout properties | Already captured by Phase 2's `autoLayout.padding` and `autoLayout.gap`. Token collector walks tree and deduplicates unique spacing values. |
| TOKN-04 | Plugin extracts border properties (radius, stroke color, stroke weight) | Nodes carry `cornerRadius`, `rectangleCornerRadii` (per-corner), `strokes: Paint[]`, `strokeWeight`. All available from API. |
| TOKN-05 | Plugin extracts shadow effects (drop shadow, inner shadow parameters) | Nodes carry `effects: Effect[]` with type `DROP_SHADOW`/`INNER_SHADOW`, each having color (RGBA), offset (Vector), radius, spread. |
| COMP-01 | Plugin detects INSTANCE node types and resolves their component name | Already done in Phase 2 via `componentRef.componentName`. Component inventory collects from existing tree data. |
| COMP-02 | Plugin extracts component descriptions when available | Already done in Phase 2 via `componentRef.description`. Component inventory includes descriptions. |
| COMP-03 | Plugin extracts basic variant property values | Already done in Phase 2 via `componentRef.variantProperties`. Component inventory includes variant info. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@figma/rest-api-spec` | latest (installed) | Typed interfaces for Paint, Effect, TypeStyle, RGBA, etc. | Already in project; provides the canonical types for Figma API data |
| vitest | latest (installed) | Unit testing for extraction and dedup logic | Already in project; TDD approach established in Phase 2 |

### Supporting
No additional libraries needed. All token extraction is pure data transformation of Figma API node properties that are already present in the API responses.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled gradient angle calc | @figma-plugin/helpers | That library is for Figma Plugin API (not REST API); REST API uses `gradientHandlePositions` not `gradientTransform`. Hand-roll is correct here. |
| Custom color conversion | chroma-js or color libraries | Overkill -- conversion is `Math.round(v * 255)` and hex formatting. No need for a dependency. |

**Installation:**
No new packages needed. Everything required is already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── layout/
│   ├── types.ts             # Extended LayoutNode with style fields + new token types
│   ├── normalize.ts         # Extended normalizeNode to capture fills/strokes/effects
│   ├── normalize.test.ts    # Extended tests for style capture
│   ├── flexbox-map.ts       # Existing (unchanged)
│   └── extract.ts           # Extended to plumb styles map, return tokens
├── tokens/
│   ├── types.ts             # DesignTokens, ColorToken, TypographyToken, etc.
│   ├── collect.ts           # collectTokens(rootNodes, stylesMap) -> DesignTokens
│   ├── collect.test.ts      # Token collection + dedup tests
│   ├── color-utils.ts       # figmaColorToHex, figmaColorToRgba, gradientToCSS
│   └── color-utils.test.ts  # Color conversion tests
├── figma-api.ts             # Extended to return styles map from API response
└── views/
    └── MainView.tsx          # Will store DesignTokens alongside ExtractionResult
```

### Pattern 1: Two-Phase Data Flow (Enrich, then Collect)
**What:** normalizeNode captures raw style data on each LayoutNode (fills, strokes, effects, typography style). A separate pure function walks the enriched tree and produces deduplicated tokens.
**When to use:** When style data lives on individual nodes but the desired output is a separate aggregated collection.
**Example:**
```typescript
// Phase A: normalizeNode enrichment (in normalize.ts)
// Add to the existing normalizeNode function:
if ('fills' in node && Array.isArray(node.fills)) {
  result.fills = node.fills;
}
if ('strokes' in node && Array.isArray(node.strokes)) {
  result.strokes = node.strokes;
}
if ('effects' in node && Array.isArray(node.effects)) {
  result.effects = node.effects;
}
if ('cornerRadius' in node) {
  result.cornerRadius = node.cornerRadius;
}
if ('rectangleCornerRadii' in node) {
  result.rectangleCornerRadii = node.rectangleCornerRadii;
}
// For TEXT nodes:
if (node.type === 'TEXT' && node.style) {
  result.textStyle = node.style;
}
// Capture style references for named style lookup
if ('styles' in node && node.styles) {
  result.styleRefs = node.styles;
}

// Phase B: collectTokens (in tokens/collect.ts)
function collectTokens(
  rootNodes: LayoutNode[],
  stylesMap: Record<string, { name: string; styleType: string }>
): DesignTokens {
  const colors = new Map<string, ColorToken>();
  const typography = new Map<string, TypographyToken>();
  // ... walk tree, deduplicate, count usage
}
```

### Pattern 2: Deduplication via Canonical Key
**What:** Each token type uses a deterministic string key built from its properties. Identical tokens collapse to one entry with incremented usage count and accumulated node references.
**When to use:** Color, typography, spacing, border, and shadow tokens all need dedup.
**Example:**
```typescript
// Color key: exact hex/rgba string
function colorKey(hex: string): string { return hex; }

// Typography key: all properties joined
function typographyKey(t: TypographyStyle): string {
  return `${t.fontFamily}|${t.fontSize}|${t.fontWeight}|${t.lineHeight}|${t.letterSpacing}`;
}

// Spacing key: the numeric value in px
function spacingKey(px: number): string { return `${px}`; }
```

### Pattern 3: Figma Color to CSS Conversion
**What:** Convert Figma RGBA (0-1 floats) to CSS hex (#RRGGBB) for opaque, rgba() for alpha < 1.
**When to use:** Every color extracted from fills, strokes, shadows.
**Example:**
```typescript
// Source: @figma/rest-api-spec RGBA type (r, g, b, a all 0-1)
function figmaColorToCSS(color: { r: number; g: number; b: number; a: number }): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);

  if (color.a >= 1) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return `rgba(${r}, ${g}, ${b}, ${parseFloat(color.a.toFixed(2))})`;
}
```

### Pattern 4: Gradient Handle Positions to CSS
**What:** Convert Figma's gradientHandlePositions (3 normalized Vector points) to CSS linear-gradient syntax.
**When to use:** GradientPaint fills (GRADIENT_LINEAR, GRADIENT_RADIAL, GRADIENT_ANGULAR, GRADIENT_DIAMOND).
**Example:**
```typescript
// gradientHandlePositions: [start, end, widthControl]
// Positions are in normalized object space (0,0 = top-left, 1,1 = bottom-right)
function gradientToCSS(paint: GradientPaint): string {
  const [start, end] = paint.gradientHandlePositions;

  // Calculate angle from start to end point
  // CSS gradient angles: 0deg = bottom-to-top, 90deg = left-to-right
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  // atan2 gives angle from positive x-axis; CSS 0deg is from bottom
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = Math.round((angleRad * 180 / Math.PI) + 90);
  // Normalize to 0-360
  const normalizedAngle = ((angleDeg % 360) + 360) % 360;

  const stops = paint.gradientStops.map(stop => {
    const color = figmaColorToCSS(stop.color);
    return `${color} ${Math.round(stop.position * 100)}%`;
  }).join(', ');

  return `linear-gradient(${normalizedAngle}deg, ${stops})`;
}
```

**Important note on gradient accuracy:** Figma gradient handle positions in normalized object space do not perfectly map to CSS linear-gradient angles for non-square elements. The conversion above works well for square elements and common angles (0, 45, 90, 135, 180). For the design brief use case, this approximation is sufficient -- Claude Code can adjust the gradient if needed during implementation.

### Anti-Patterns to Avoid
- **Mutating LayoutNode in the token collector:** The token collector should READ style data from nodes but should NOT modify the tree. It produces a separate DesignTokens object.
- **Per-node API calls for styles:** All style data is already in the node tree from the initial API response. Never make additional API calls for individual node styles.
- **Near-match color grouping:** User decision is exact match only. Do not implement fuzzy color matching (e.g., grouping #4A90D9 and #4A91DA).
- **Flattening fill stacks:** User wants all fills in stack order with blend mode and opacity, not just the "effective" or "top" fill.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Figma type definitions | Custom Paint/Effect interfaces | Import from `@figma/rest-api-spec` | Already installed; canonical types with full JSDoc |
| Color space conversion | HSL/LAB conversion | Simple `Math.round(v * 255)` + hex format | Only need 0-1 to 0-255 for this phase; no perceptual grouping |

**Key insight:** This phase is pure data transformation. Every input property comes directly from Figma's REST API response. No external services, no complex algorithms, no additional dependencies. The complexity is in correctly handling all the edge cases (missing fills, empty effects arrays, gradient types, per-corner radii, image fill placeholders).

## Common Pitfalls

### Pitfall 1: Figma Paint Visibility and Opacity
**What goes wrong:** Extracting colors from paints that are hidden or have zero opacity, producing ghost tokens.
**Why it happens:** Each Paint has `visible` (default true if undefined) and `opacity` (default 1 if undefined) properties. A fill can exist on a node but be toggled off in Figma.
**How to avoid:** Filter `paint.visible !== false` before extracting colors. Include paint-level opacity in the token data. Combine paint opacity with color alpha for the effective color.
**Warning signs:** Token output contains colors that don't visually appear in the design.

### Pitfall 2: Gradient Type Fallback
**What goes wrong:** Crashing or producing invalid CSS when encountering GRADIENT_RADIAL, GRADIENT_ANGULAR, or GRADIENT_DIAMOND fills.
**Why it happens:** Only GRADIENT_LINEAR maps cleanly to CSS. The other types need different CSS syntax or can't be represented exactly.
**How to avoid:** Handle GRADIENT_LINEAR with full CSS conversion. For GRADIENT_RADIAL, output `radial-gradient(...)`. For GRADIENT_ANGULAR and GRADIENT_DIAMOND, output a descriptive fallback (e.g., type name + color stops) since CSS has no equivalent.
**Warning signs:** `TypeError` on unexpected paint.type values.

### Pitfall 3: Image Fills Treated as Colors
**What goes wrong:** Trying to extract color data from IMAGE type paints, which have no `color` property.
**Why it happens:** Paint is a union type (`SolidPaint | GradientPaint | ImagePaint | PatternPaint`). Code that assumes all paints have `color` will fail on IMAGE.
**How to avoid:** Always check `paint.type` before accessing type-specific properties. IMAGE fills produce a placeholder token noting the scale mode, not a color token.
**Warning signs:** `undefined` colors in the token output.

### Pitfall 4: Missing Typography Data on Non-Text Nodes
**What goes wrong:** Trying to read `style` (TypeStyle) from non-TEXT nodes.
**Why it happens:** Only TEXT nodes have the TypePropertiesTrait with `style`, `characterStyleOverrides`, and `styleOverrideTable`.
**How to avoid:** Only extract typography tokens from nodes where `node.type === 'TEXT'`.
**Warning signs:** Undefined `style` property errors.

### Pitfall 5: Text Style Overrides (Mixed Styles in One Text Node)
**What goes wrong:** Treating a text node as having a single style when it actually has multiple styles (e.g., bold + italic + different sizes in one text block).
**Why it happens:** Figma TEXT nodes have `characterStyleOverrides` and `styleOverrideTable` for per-character style ranges. The `style` property is only the default style.
**How to avoid:** For Phase 3, extract the default `style` as the primary typography token. Optionally also extract overrides from `styleOverrideTable` as additional typography tokens. The user decision says "full style match for deduplication" which applies regardless of whether the style comes from the default or an override.
**Warning signs:** Missing typography tokens for styled spans within text.

### Pitfall 6: Styles Map Not Available
**What goes wrong:** Unable to resolve named style names because the `styles` map from the API response is not passed through.
**Why it happens:** Current `fetchFileNodes` and `fetchFullFile` only return `rootNode`/`rootNodes` and `components` -- they discard the `styles` map.
**How to avoid:** Extend both API functions to also return `styles` from the response. The styles map is keyed by style ID, and nodes reference it via `node.styles` (a `{ [styleType]: styleId }` map).
**Warning signs:** All tokens get auto-generated names; named Figma styles lost.

### Pitfall 7: Spacing Token Duplicates from Symmetric Padding
**What goes wrong:** A node with `padding: { top: 16, right: 16, bottom: 16, left: 16 }` generates four spacing tokens for "16" instead of one.
**Why it happens:** Naively iterating all padding sides without deduplication.
**How to avoid:** The spacing scale is just a Set of unique numeric values. Add each padding value, gap value, and rowGap value to the set. Dedup is inherent.
**Warning signs:** Inflated spacing token counts.

### Pitfall 8: Effect Visibility
**What goes wrong:** Including disabled shadow effects in the token output.
**Why it happens:** Effects have a `visible` boolean. Shadows can be present but toggled off in Figma.
**How to avoid:** Filter `effect.visible === true` (note: unlike paints, effects have `visible` as a required boolean, not optional).
**Warning signs:** Shadow tokens for effects that don't appear in the design.

## Code Examples

Verified patterns from `@figma/rest-api-spec` types (installed at `node_modules/@figma/rest-api-spec/dist/api_types.ts`):

### Figma Node Properties Available for Extraction

```typescript
// Source: @figma/rest-api-spec FrameTraits composition
// Frame/Component/Instance nodes have ALL of these via FrameTraits:
//   - fills: Paint[]           (from MinimalFillsTrait via HasGeometryTrait)
//   - strokes?: Paint[]        (from MinimalStrokesTrait via HasGeometryTrait)
//   - strokeWeight?: number    (from MinimalStrokesTrait)
//   - strokeAlign?: string     (from MinimalStrokesTrait)
//   - effects: Effect[]        (from HasEffectsTrait)
//   - cornerRadius?: number    (from CornerTrait)
//   - cornerSmoothing?: number (from CornerTrait)
//   - rectangleCornerRadii?: number[] (from CornerTrait, [TL, TR, BR, BL])
//   - styles?: { [key: string]: string } (from MinimalFillsTrait, maps styleType to styleId)
//   - opacity?: number         (from HasBlendModeAndOpacityTrait)
//   - blendMode: BlendMode     (from HasBlendModeAndOpacityTrait)
//   - individualStrokeWeights?: StrokeWeights (from IndividualStrokesTrait)

// TEXT nodes additionally have (via TypePropertiesTrait):
//   - style: TypeStyle         (font family, size, weight, line height, letter spacing)
//   - characterStyleOverrides: number[]
//   - styleOverrideTable: { [key: string]: TypeStyle }

// Shape nodes (Rectangle, Ellipse, Vector, etc.) have DefaultShapeTraits:
//   - fills, strokes, strokeWeight, effects (same as frames)
//   - Rectangle/Ellipse additionally have CornerTrait
```

### Extending LayoutNode with Style Fields

```typescript
// Add to LayoutNode interface in src/layout/types.ts
export interface LayoutNode {
  // ... existing fields ...

  /** Raw fill paints from Figma (for token extraction) */
  fills?: any[];  // Paint[] from API -- kept as any for the same reason as other Figma data

  /** Raw stroke paints from Figma */
  strokes?: any[];

  /** Stroke weight */
  strokeWeight?: number;

  /** Raw effects from Figma */
  effects?: any[];

  /** Corner radius (uniform) */
  cornerRadius?: number;

  /** Per-corner radii [TL, TR, BR, BL] */
  rectangleCornerRadii?: number[];

  /** Typography style (TEXT nodes only) */
  textStyle?: any;  // TypeStyle from API

  /** Style overrides table (TEXT nodes with mixed styles) */
  textStyleOverrides?: any;  // { [key: string]: TypeStyle }

  /** Node-level opacity */
  opacity?: number;

  /** References to named Figma styles { fill: 'S:abc', text: 'S:def', ... } */
  styleRefs?: Record<string, string>;
}
```

### Token Type Definitions

```typescript
// In src/tokens/types.ts
export interface ColorToken {
  /** CSS color value: #RRGGBB or rgba(R,G,B,A) */
  value: string;
  /** Figma style name if available, auto-generated otherwise */
  name: string;
  /** Number of nodes using this exact color */
  usageCount: number;
  /** Node IDs that use this color */
  nodeIds: string[];
  /** Where the color appears: 'fill' | 'stroke' | 'shadow' */
  source: ('fill' | 'stroke' | 'shadow')[];
}

export interface GradientToken {
  /** Full CSS gradient syntax: linear-gradient(135deg, #fff 0%, #000 100%) */
  value: string;
  /** Figma style name or auto-generated */
  name: string;
  /** Figma gradient type for reference */
  gradientType: string;
  usageCount: number;
  nodeIds: string[];
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number | null;  // null if Figma uses AUTO
  letterSpacing: number;
  /** Figma style name or auto-generated */
  name: string;
  usageCount: number;
  nodeIds: string[];
}

export interface SpacingToken {
  /** Spacing value in px */
  value: number;
  usageCount: number;
  /** Where the value appears: padding-top, gap, etc. */
  sources: string[];
}

export interface BorderToken {
  /** Uniform radius or null if per-corner */
  radius: number | null;
  /** Per-corner radii [TL, TR, BR, BL] or null if uniform */
  cornerRadii: number[] | null;
  strokeColor: string | null;
  strokeWeight: number | null;
  name: string;
  usageCount: number;
  nodeIds: string[];
}

export interface ShadowToken {
  type: 'drop-shadow' | 'inner-shadow';
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  name: string;
  usageCount: number;
  nodeIds: string[];
}

export interface ImageFillRef {
  /** Image reference key from Figma */
  imageRef: string;
  scaleMode: string;
  nodeId: string;
  nodeName: string;
}

export interface ComponentInventoryEntry {
  componentName: string;
  description?: string;
  variantProperties?: Record<string, string | boolean>;
  source: 'local' | 'library';
  usageCount: number;
}

export interface DesignTokens {
  colors: ColorToken[];
  gradients: GradientToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  borders: BorderToken[];
  shadows: ShadowToken[];
  imageFills: ImageFillRef[];
  components: ComponentInventoryEntry[];
}
```

### Extending the API Functions

```typescript
// In src/figma-api.ts -- extend return types to include styles map
export async function fetchFileNodes(
  shell: Shell, token: string, fileKey: string, nodeId: string,
): Promise<{ rootNode: any; components: Record<string, any>; styles: Record<string, any> }> {
  // ... existing logic ...
  return {
    rootNode: nodeData.document,
    components: nodeData.components,
    styles: nodeData.styles ?? {},  // NEW: pass through styles map
  };
}

export async function fetchFullFile(
  shell: Shell, token: string, fileKey: string,
): Promise<{ rootNodes: any[]; components: Record<string, any>; styles: Record<string, any> }> {
  // ... existing logic ...
  return {
    rootNodes: response.document.children,
    components: response.components,
    styles: response.styles ?? {},  // NEW: pass through styles map
  };
}
```

### Resolving Named Styles

```typescript
// The Figma API response includes a top-level `styles` map:
// styles: { "S:abc123": { key: "abc", name: "Brand/Primary", styleType: "FILL" } }
//
// Each node has a `styles` property (different from the top-level map):
// node.styles: { "fill": "S:abc123", "text": "S:def456" }
//
// To get the human-readable name:
function resolveStyleName(
  styleRefs: Record<string, string> | undefined,
  styleType: string,
  stylesMap: Record<string, { name: string; styleType: string }>
): string | undefined {
  if (!styleRefs) return undefined;
  const styleId = styleRefs[styleType];
  if (!styleId) return undefined;
  return stylesMap[styleId]?.name;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Figma Plugin API only | REST API + Plugin API both available | 2023 | REST API returns all style data; no need for plugin context |
| `gradientTransform` matrix | `gradientHandlePositions` (REST API) | REST API always used handle positions | REST API gives 3 Vector points, not a transform matrix. Plugin API uses `gradientTransform`. |
| Variables API for tokens | Node-level property extraction | N/A | Variables API is Enterprise-only (out of scope per REQUIREMENTS.md). Extract from node properties instead. |

**Deprecated/outdated:**
- `lineHeightPercent` on TypeStyle: Deprecated by Figma in favor of `lineHeightPx` and `lineHeightPercentFontSize`. Use `lineHeightPx` for the token value.

## Open Questions

1. **Text style override extraction depth**
   - What we know: TEXT nodes can have per-character style overrides via `characterStyleOverrides` and `styleOverrideTable`. The default `style` property gives the base style.
   - What's unclear: Should we extract ALL style overrides as separate typography tokens, or just the default style?
   - Recommendation: Extract the default `style` as the primary token. Also extract unique styles from `styleOverrideTable` to capture styles like bold headings within a text block. This maximizes typography token coverage without excessive complexity.

2. **Gradient angle precision for non-square elements**
   - What we know: The simple atan2 calculation from handle positions gives correct results for square elements and common angles. For non-square elements, the angle may be slightly off.
   - What's unclear: Whether the approximation is acceptable or if element dimensions need to be factored in.
   - Recommendation: Use the simple atan2 calculation. The design brief is consumed by Claude Code which can adjust CSS values. Document the limitation in the gradient token if desired.

3. **Auto-generated token name format**
   - What we know: User wants named Figma styles used when available. Unnamed styles need auto-generated names.
   - What's unclear: What naming convention to use for unnamed tokens.
   - Recommendation (Claude's Discretion): Use descriptive names based on value: colors get their hex value as the name (e.g., "color-4a90d9"), typography gets family+size (e.g., "Inter-16-600"), spacing gets "spacing-{value}" (e.g., "spacing-16"). These are readable and deterministic.

## Sources

### Primary (HIGH confidence)
- `@figma/rest-api-spec` (installed at `node_modules/@figma/rest-api-spec/dist/api_types.ts`) -- All type definitions for Paint, Effect, TypeStyle, CornerTrait, MinimalFillsTrait, MinimalStrokesTrait, HasEffectsTrait, BaseShadowEffect, DropShadowEffect, InnerShadowEffect, RGBA, ColorStop, GradientPaint, SolidPaint, ImagePaint, GetFileResponse, GetFileNodesResponse, Style
- Existing codebase (`src/layout/types.ts`, `src/layout/normalize.ts`, `src/layout/extract.ts`, `src/figma-api.ts`) -- Current implementation patterns, LayoutNode structure, normalizeNode walker, API response handling

### Secondary (MEDIUM confidence)
- [Gradient Angles in CSS, Figma & Sketch - 9elements](https://9elements.com/blog/gradient-angles-in-css-figma-and-sketch/) -- Analysis of gradient coordinate system differences between CSS and Figma
- [Demystifying Figma's Gradient Transformations - WP Converters](https://wpconverters.com/demystifying-figmas-gradient-transformations-a-developers-guide) -- Code examples for gradient angle calculation from handle positions
- [Figma Forum: Convert Figma Gradient to CSS](https://forum.figma.com/ask-the-community-7/how-to-convert-figma-gradient-to-css-gradient-7596) -- Community-verified approach using atan2 for angle calculation

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new dependencies; all data comes from existing Figma API types already installed
- Architecture: HIGH -- Pattern follows established normalizeNode enrichment + separate pure function approach; verified against existing codebase
- Pitfalls: HIGH -- All pitfalls verified against actual `@figma/rest-api-spec` type definitions (Paint union type, Effect visibility, TypeStyle structure, styles map location)
- Gradient conversion: MEDIUM -- atan2 approach is community-standard but has known precision limitations for non-square elements

**Research date:** 2026-02-28
**Valid until:** 2026-03-30 (stable domain -- Figma REST API v1 types change infrequently)
