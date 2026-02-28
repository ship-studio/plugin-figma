# Phase 7: Smart Asset Detection & Layout Mapping - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Detect complex compositions (nested groups of vectors, masks, blend modes) and export them as single PNG images instead of individual SVGs. Map every exported asset to its exact position in the layout tree via breadcrumb paths. Existing asset exports (SVGs, image fills) continue to work without regression.

</domain>

<decisions>
## Implementation Decisions

### Detection criteria
- Use a heuristic combination approach — require multiple signals together (e.g., child count threshold AND at least one mask or blend mode) to reduce false positives
- Per-child detection — each direct child of a container is evaluated independently, not the whole container
- If a node meets structural signals (high child count, deep nesting, BOOLEAN_OPERATION) AND visual effect signals (blend modes, masks, opacity layering), it is flagged as a composition

### Export behavior
- Detected compositions export as a single PNG only — do NOT also export individual SVG parts for children within the composition
- Export at 2x scale (consistent with preview image)
- Filenames use the same convention as existing assets: sanitized node name + .png (e.g., "hero-illustration.png")
- The brief's Assets section adds a type indicator column to distinguish compositions from simple icons and images

### Breadcrumb mapping
- Arrow path format: "Hero > Header > Logo"
- Smart truncation for paths longer than 4 levels — show first, "...", then last 2 (e.g., "Root > ... > Parent > Asset")
- Skip generic auto-generated layer names ("Frame 427", "Group 12") from the breadcrumb path — only show intentionally named layers
- Add a "Location" column to the existing Assets table: File | Type | Location | Path

### Edge cases
- Log a warning note in the brief when an asset is auto-detected as a composition (transparency for Claude Code / user review)
- No changes to existing SVG and PNG-fill export behavior — composition detection is purely additive
- Outer composition wins for nested compositions — if a composition contains another composition, export the outer one as a single PNG
- Existing asset types (simple SVG icons, INSTANCE nodes, image fills) remain untouched

### Claude's Discretion
- Exact child count threshold for composition detection (research typical Figma design patterns)
- Scan depth for detecting buried masks/blend modes
- Whether to cap PNG dimensions for very large compositions
- Exact generic name detection regex (what patterns count as "auto-named")

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `identifyAssets()` in `src/assets/identify.ts` — walks LayoutNode tree, classifies nodes by type. Composition detection logic fits here as a pre-pass or integration into the classification
- `AssetEntry` interface in `src/assets/types.ts` — already has `nodeId` and `nodeName`. Needs new `exportType` value for compositions (e.g., `'png-render'` already exists as a type)
- `exportAssets()` in `src/assets/export.ts` — orchestrates batch API calls and downloads. Composition PNG exports use the same `fetchImages()` API as preview
- `sanitizeFilename()` and `resolveCollisions()` in `src/assets/sanitize.ts` — reusable for composition filenames
- `LayoutNode` in `src/layout/types.ts` — has `id`, `name`, `type`, `children`, `fills`, `effects` — all signals needed for detection are already on this type

### Established Patterns
- Type-based classification: `SVG_TYPES` Set and `CONTAINER_TYPES` Set for node categorization
- INSTANCE nodes are leaf nodes — not recursed into
- Two-level depth in current identify logic (top-level + one container level)
- `fetchImages()` already supports both SVG and PNG formats with scale parameter
- Section builder pattern in `generate.ts` for brief assembly

### Integration Points
- `identifyAssets()` → composition detection inserts here, before or during the tree walk
- `ExportResult.assets` → currently drops `nodeId` (only carries `filename` and `path`). Must be extended to carry `nodeId` for breadcrumb mapping
- `buildAssetsSection()` in `generate.ts` → needs `rootNodes` parameter (or pre-computed breadcrumb map) to build Location column
- `ExportResult.assets` type → needs extension for asset classification (composition vs icon vs image)

</code_context>

<specifics>
## Specific Ideas

- The Assets table in the brief should look like: `File | Type | Location | Path` where Type is "Composition", "Icon", "Image", etc.
- Breadcrumb example: `Hero > Header > Logo` — skips unnamed layers, truncates with "..." if >4 levels

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-smart-asset-detection-layout-mapping*
*Context gathered: 2026-02-28*
