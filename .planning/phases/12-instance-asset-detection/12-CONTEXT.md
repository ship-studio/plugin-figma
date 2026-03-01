# Phase 12: Instance Asset Detection - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Ensure every visible image asset in a Figma design is detected and exported, regardless of how deeply it is nested inside component instances. Filter out simple solid-color rectangles that are CSS-reproducible. Cross-reference instance child images in the layout tree. New asset types, progressive asset disclosure, and tree preview features are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Instance image naming
- Use the image node's own Figma name for the exported filename (e.g., `hero-image.png`, `avatar.png`)
- For name collisions, use the existing `resolveCollisions()` suffix pattern (`hero-image.png`, `hero-image-2.png`)
- For instance-level IMAGE fill overrides (ASSET-06), use the instance node's name as the filename

### Instance-level IMAGE fill overrides (ASSET-06)
- Export as png-fill (extract just the image), NOT png-render (component screenshot)
- This replaces the component render — don't export both
- The layout tree and style tokens provide the component's framing context

### Rectangle filtering (ASSET-07)
- Never export simple solid-color rectangles as SVG assets — they are always CSS-reproducible
- Silent omission: no warnings or notes in the brief about skipped rectangles
- The layout tree still shows rectangle nodes with their style tokens (color, border-radius, size)

### Layout tree presentation
- Annotate instance lines with asset references: `[INSTANCE] Card (x3) 320x240 -> hero-image.png`
- Same annotation pattern as existing compositions (`-> filename.png`)
- For deduplicated instance groups, mention the image once (not per-instance)
- Assets table treats instance-child images the same as any other image — breadcrumb path shows context

### Deduplication
- Identical images across instances (same imageRef) exported once
- Full-depth recursion into instance children to find IMAGE fills — no depth limit
- Instance dedup by componentId+variant continues to work; image dedup layers on top

### Claude's Discretion
- Exact rectangle "simplicity" threshold (what combination of fills/strokes/effects/gradients triggers export)
- Whether rectangle filtering applies inside instances or only in the non-instance tree
- Whether to differentiate fill-image vs child-image annotations in the tree (e.g., `[fill]` prefix)
- Whether instances with detected child images should still get a component png-render alongside the extracted images

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `resolveCollisions()` in `sanitize.ts`: Already handles filename dedup with numeric suffix — reuse for instance child image naming
- `hasImageFill()` / `getImageRefFromFills()` in `identify.ts`: IMAGE fill detection logic ready to reuse inside instance recursion
- `detectCompositions()` in `detect-composition.ts`: "Outer wins" pattern and composition ID set can inform how instance image detection integrates

### Established Patterns
- `walkTree()` in `identify.ts`: Central asset identification loop — instance recursion will modify the early-return at line 87
- `normalizeNode()` in `normalize.ts`: INSTANCE as leaf node (line 172) — layout tree annotation may need the instance's child image data passed through
- Asset dedup: SVG dedup by sanitized name, instance dedup by componentId+variant — image dedup by imageRef follows the same pattern
- Brief cross-referencing: Compositions already annotate tree lines with `-> filename.png` — same pattern extends to instance images

### Integration Points
- `identify.ts:76-88`: INSTANCE early-return must be changed to recurse for IMAGE fill detection
- `identify.ts:124-137`: RECTANGLE export must add filtering for simple solid-color nodes
- Layout tree renderer in `generate.ts`: Must thread instance child image filenames into tree line output
- `tokens/collect.ts`: ImageFillRef collection may need to include instance-interior nodes

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-instance-asset-detection*
*Context gathered: 2026-03-01*
