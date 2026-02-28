# Phase 3: Design Data Extraction - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract design tokens (colors, typography, spacing, borders, shadows) and component identification from the normalized layout tree built in Phase 2. Produces a structured token collection that Phase 5 will format into the design brief. Does NOT export images (Phase 4) or format the brief (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Token structure
- Separate token collection alongside the layout tree (not inline on each node)
- Tokens grouped by type: colors, typography, spacing, borders, shadows
- Each token includes back-references to which nodes use it
- Extend normalizeNode to capture style data (fills, strokes, effects) on LayoutNode during the existing tree walk, then collect/deduplicate tokens from the enriched tree
- Include spacing tokens extracted from auto-layout padding/gap values as a deduplicated "spacing scale" (e.g., 4px, 8px, 16px) with usage counts

### Color handling
- Output hex (#RRGGBB) for opaque colors, rgba(R,G,B,A) for alpha < 1
- Convert Figma 0-1 floats to 0-255 integers
- Full CSS gradient syntax for gradient fills: `linear-gradient(135deg, #fff 0%, #000 100%)`
- Capture all fills in stack order with blend mode and opacity (not just top fill)
- Image fills noted as placeholders with scale mode (fill/fit/crop) — actual export is Phase 4

### Typography
- Extract: font family, font size, font weight, line height, letter spacing
- Full style match for deduplication (family + size + weight + line height + letter spacing must all match to be same token)

### Border & shadow extraction
- Border: corner radius (per-corner if different), stroke color, stroke weight
- Shadows: drop shadow and inner shadow parameters (color, offset, blur, spread)

### Component handling
- Phase 2's componentRef already satisfies COMP-01/02/03 — no additional extraction needed
- Component inventory list in token output: deduplicated, showing name, variants, usage count, local/library tag
- Library components tagged but treated the same as local components (not separate sections)

### Deduplication strategy
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

</decisions>

<specifics>
## Specific Ideas

- The token collection should feel like a design system spec: colors palette, type scale, spacing scale, border tokens, shadow tokens
- Usage counts help Claude Code identify primary vs secondary colors, heading vs body text styles
- Figma style names (when present) make the output more meaningful: "Brand/Primary" is better than "blue-1"

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LayoutNode` (src/layout/types.ts): Core normalized tree type — will be extended with style fields (fills, strokes, effects)
- `normalizeNode` (src/layout/normalize.ts): Tree walker that can be extended to capture style data in same pass
- `deduplicateChildren` (src/layout/normalize.ts): Existing dedup pattern for component instances — similar approach for tokens
- `mapToFlexbox` (src/layout/flexbox-map.ts): Pattern for Figma-to-CSS value mapping — same approach for colors and typography
- `ExtractionResult` (src/layout/types.ts): Will be extended or paralleled with a TokenResult
- `@figma/rest-api-spec` types: Already installed — provides typed Fill, Effect, TypeStyle, Paint interfaces

### Established Patterns
- Pure functions with type imports from @figma/rest-api-spec
- TDD approach (47 tests for Phase 2 normalization)
- Figma API data accessed via raw `any` nodes in normalizeNode, typed at boundaries

### Integration Points
- `normalizeNode` in src/layout/normalize.ts — either extend or create parallel walker
- `extractLayout` in src/layout/extract.ts — orchestrator that calls normalizeTree, will need to also trigger token collection
- `MainView.tsx` — stores ExtractionResult in state, will also need to store/display token data
- `collectStats` in MainView.tsx — already walks LayoutNode tree for UI summary, similar pattern for tokens

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-design-data-extraction*
*Context gathered: 2026-02-28*
