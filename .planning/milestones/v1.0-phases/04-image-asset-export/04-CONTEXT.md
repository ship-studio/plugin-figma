# Phase 4: Image & Asset Export - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

The plugin renders a PNG preview of the selected design and exports all SVG icons and raster images as local files in the project directory, ready for Claude Code to reference. This phase handles identification, rendering, downloading, and saving of assets. Brief assembly and formatting is Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Asset directory structure
- Single flat folder at `.shipstudio/assets/` inside the project directory
- All assets (preview, icons, images) in one folder — no subdirectories by type
- Clean (wipe) the assets folder before each export run — ensures assets match current Figma state, no stale files
- Filenames derived from sanitized Figma layer names: lowercase, slashes and spaces become hyphens, special characters stripped (e.g., "Icon / Arrow Right" becomes `icon-arrow-right.svg`)

### Preview rendering
- Render the selected node as a single PNG at 2x scale for retina clarity
- Preview file named `preview.png` — predictable, one preview per extraction
- Full frame render, no size cap — user chose the scope, trust it
- Selected node only — no separate renders of child components

### Asset identification rules
- SVG export: nodes of type VECTOR, BOOLEAN_OPERATION, LINE, STAR, POLYGON, ELLIPSE, RECTANGLE (without image fills)
- Raster export: any node with a paint of type IMAGE — download via Figma image fills API, save as PNG
- Component instances (INSTANCE nodes) exported as SVG — captures icons, buttons, and reusable components as complete vector graphics
- Depth: top-level and component-level only — skip deeply nested decorative shapes inside components
- Exclude deeply nested internal vector parts of components

### Download behavior
- Sequential downloads (one at a time via shell.exec curl) — avoids Figma rate limits, acceptable speed for typical 10-30 assets
- Retry each download once on failure, then skip with a warning — don't block entire export for one failed asset
- 30-second timeout per download — matches existing Figma API timeout
- Per-asset progress feedback to user: "Downloading icon-arrow.svg (3/12)..."

### Claude's Discretion
- Exact error message wording and warning format
- How to handle filename collisions from duplicate layer names (append suffix, short node ID, etc.)
- Internal download queue implementation details
- Whether to log a summary of skipped assets at the end

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `figmaApiCall<T>()` in `src/figma-api.ts`: Generic Figma API wrapper with error handling (403/404/429) — add new image/export endpoints following this pattern
- `shell.exec('curl', [...])` pattern: All HTTP via shell, no direct network — use same for downloads
- `ImageFillRef` in `src/tokens/types.ts`: Phase 3 already extracts `imageFills[]` with imageRef, scaleMode, nodeId, nodeName — ready for download
- `DesignTokens.imageFills` available on `ExtractLayoutResult.tokens.imageFills` — pre-identified image fill nodes
- `project.path` from PluginContextValue: Project root directory for asset output

### Established Patterns
- TDD: All unit logic tested first (Vitest, 133 tests passing)
- Stale request guard: Counter refs for async operations (`extractRequestIdRef`)
- Result ref storage: Store full result in ref, show warning, user confirms without re-fetch
- Error typing: Typed `figmaApiCall` throws with specific messages per HTTP status

### Integration Points
- `src/layout/extract.ts` — `extractLayout()` returns `ExtractLayoutResult`; asset export extends or follows this flow
- `src/figma-api.ts` — New `fetchImages()` and `fetchImageFills()` endpoints to add
- `src/views/MainView.tsx` — Wire asset export progress into the extraction callback
- Figma Images API: `GET /v1/images/{file_key}?ids=...&format=png|svg&scale=2`
- Figma Image Fills API: `GET /v1/files/{file_key}/images` — resolves imageRef to downloadable URLs

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-image-asset-export*
*Context gathered: 2026-02-28*
