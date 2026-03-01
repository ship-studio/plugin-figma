# Feature Landscape

**Domain:** Manual asset control for Figma design extraction plugin (v2.0)
**Researched:** 2026-03-01
**Confidence:** HIGH (codebase analysis + Figma REST API documentation + URL format investigation)

## Table Stakes

Features users expect for a manual asset selection workflow. Missing any of these makes the feature feel broken or incomplete.

### Asset Addition via Figma URL

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| Paste a single-node Figma URL to add an asset | This is the core interaction model. Users right-click an element in Figma, "Copy link to selection", paste it into the plugin. The plugin parses it, extracts the node ID, and adds it to the asset list. | Low | Reuses existing `parseFigmaUrl()` from `url-parser.ts` which already handles `?node-id=` extraction. Need to validate the fileKey matches the main design URL's fileKey. | The URL parser already normalizes dash-to-colon format (`0-1` to `0:1`) and handles URL-encoding (`%3A`). No parser changes needed for single-node URLs. |
| Format picker (PNG or SVG) per asset | Users must choose the export format when adding each asset. Icons/vectors need SVG; photos/illustrations/complex compositions need PNG. Default should be PNG (safest for any node type). SVG only works well for vector-based nodes. | Low | New UI element (dropdown or toggle) alongside the URL input. Maps directly to existing `fetchImages()` which already accepts `format: 'png' \| 'svg'`. | SVG export has constraints: text is outlined by default, 1x scale only. PNG supports scale parameter (use 2x). These constraints should inform the default but not restrict the choice -- users know their designs. |
| Validate that asset URL belongs to same file | If the user pastes a URL from a different Figma file, the asset cannot be exported in the same API batch. The plugin should reject it immediately with a clear error. | Low | Compare `parsedUrl.fileKey` of the asset URL against the main design URL's fileKey. Instant client-side check, no API call needed. | Critical for avoiding confusing errors later. The Figma images API (`/v1/images/:key`) is scoped to a single file key. |
| Validate that URL contains a node ID | A Figma URL without `?node-id=` points to an entire file or page. That is not a valid asset target. The plugin should show "Select a specific element in Figma and copy its link" when `nodeId` is null. | Low | Already handled by `parseFigmaUrl()` -- check `result.nodeId !== null`. | File-level URLs are valid for the main design input, but not for individual assets. |
| Auto-derived filename from Figma layer name | After adding a URL, the plugin needs to resolve the layer name from the Figma API (`/v1/files/:key/nodes?ids=:nodeId`) and use `sanitizeFilename()` to generate the filename. Users should see the derived name (e.g., "hero-image.png") before exporting. | Medium | Requires a lightweight API call to `fetchFileNodes()` for each added asset to get the node name. Could batch these calls or fetch lazily. Reuses existing `sanitizeFilename()` from `assets/sanitize.ts`. | The API call is the same one used for layout extraction but with a single node ID. Response includes the node `name` field. Consider batching: collect URLs first, resolve names in one batch via comma-separated IDs in `/v1/files/:key/nodes?ids=a,b,c`. |
| Duplicate filename resolution | When two assets derive the same filename (e.g., two layers both named "icon"), the second should become "icon-2.png". | Low | Reuses existing `resolveCollisions()` from `assets/sanitize.ts`. Already handles this exact case with `-2`, `-3` suffixes. | No new code needed for the collision logic itself. Just need to apply it to the manual asset list before export. |

### Asset List Management

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| Display a list of added assets | Users need to see what they have queued for export. Each row should show: derived filename, format (PNG/SVG), and a remove button. | Low | New React state: `AssetItem[]` where `AssetItem = { nodeId, nodeName, filename, format, figmaUrl }`. Rendered as a simple list in the UI. | Keep it minimal. This is a toolbar-slot plugin with limited vertical space. Each item should be a single compact row. |
| Remove individual assets from the list | Users must be able to remove mistakenly added assets before exporting. A trash icon or X button per row. | Low | Filter the state array by nodeId. Re-run `resolveCollisions()` on the remaining list to recalculate filenames in case a collision suffix is no longer needed. | Recalculating collisions on remove is important. If "icon.png" and "icon-2.png" exist and user removes "icon.png", "icon-2.png" should NOT be renamed -- keep names stable once shown to the user. Actually, simpler: just keep the derived name as-is on remove. |
| Clear all assets | A "Clear all" action to start over. Less critical than individual remove but expected for lists with more than 3-4 items. | Low | Reset the asset list state to empty. | Could be a link-style button below the list, not a prominent button. |
| Prevent duplicate node IDs | If the user pastes the same URL twice, the second add should be rejected with a toast: "This element is already in the list." | Low | Check `assetList.some(a => a.nodeId === newNodeId)` before adding. | Simple dedup by node ID. |

### Export and Brief Integration

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| Export all listed assets in one batch | The user clicks "Get Brief" and all assets are exported alongside the layout tree and design tokens. The asset export should use the existing `fetchImages()` API for PNG/SVG renders, batching all node IDs into a single API call per format. | Medium | Replaces the current `identifyAssets()` + `detectCompositions()` pipeline. Instead, the manual asset list IS the asset list. Feed it directly into the download pipeline. Group by format: one `fetchImages()` call for all PNGs, one for all SVGs. | The Figma Images API supports comma-separated node IDs in a single call, so batching is free. Current `fetchImages()` in `figma-api.ts` already accepts `nodeIds: string[]`. |
| Layout tree cross-referencing by node ID | Each exported asset should appear in the layout tree with `-> filename.ext` annotation, exactly as the current system does. This ties the visual hierarchy to the exported files. | Low | The existing brief generator already does this via `assetNodeMap` (maps nodeId to filename). Manual assets provide nodeId directly, so this works without changes to `generate.ts`. | Already built. The manual asset list just needs to provide `nodeId` in the export result. |
| Full-page preview PNG auto-generated | The preview.png (2x render of the selected frame/page) should remain automatic. Only individual assets are manual. | None | Already exists. No changes needed to preview generation in `exportAssets()`. | This is explicitly in the requirements: "Full-page preview PNG remains auto-generated." |

## Differentiators

Features that set this workflow apart from auto-detection. Not strictly required, but significantly improve the experience.

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|--------------|-------|
| Inline name editing | Let users rename the derived filename before export. Useful when Figma layer names are generic ("Frame 427") or when the user wants a semantic name ("hero-background.png"). | Low | Add an editable text field to each asset row, pre-filled with the derived name. Override `filename` in the asset entry. Still run through `sanitizeFilename()` on edit. | Nice-to-have. The auto-derived name is usually good enough. If added, should still enforce sanitization rules (lowercase, no spaces, no special chars). |
| Multi-node URL support | Figma's "Copy link to selection" with multiple elements selected does NOT produce a multi-node URL (it links to the parent frame). However, the Figma REST API `/v1/files/:key/nodes?ids=a,b,c` supports multiple comma-separated IDs. A power-user feature could let users paste comma-separated node IDs or multiple URLs at once. | Medium | Extend the URL parser or add a separate "batch add" input. Parse multiple node IDs, resolve all names in one API call, add all to the list. | LOW PRIORITY. Figma's copy-link UX produces single-node URLs. Multi-select in Figma does not produce a URL the user can copy with multiple node IDs. This would only benefit users who manually construct URLs or use third-party Figma plugins like "Batch Copy Link" or "Copy Node IDs". |
| Drag-to-reorder asset list | Let users reorder assets. Affects the order in the brief's Assets table. | Low-Medium | React drag-and-drop library or manual implementation. Overkill for a toolbar plugin. | Skip unless users request it. Order in the brief is cosmetic. |
| Asset preview thumbnails | Show a small thumbnail of each added asset in the list. Would require rendering each node via the API before the user clicks "Get Brief". | High | Extra API call per asset to `fetchImages()` just for thumbnails. Adds latency and API usage. The Figma Images API returns S3 URLs that expire in 30 days, so caching is limited. | Not worth the API cost and complexity. The filename + format indicator gives enough context. |
| Format auto-suggestion | When the user adds a URL, check the node type via the API and suggest SVG for vectors, PNG for everything else. | Medium | Requires fetching node data on add (which we may already do for the name). Check `node.type` -- if in `['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'ELLIPSE']`, suggest SVG; otherwise default PNG. | Nice-to-have but adds complexity. Default to PNG is fine -- SVG is a deliberate choice by users who know they want vectors. |
| Persisted asset list | Save the asset list to plugin storage so it survives toolbar close/reopen. | Low | Use existing `storage.write()` / `storage.read()` API. Serialize the asset list. | Only useful if users frequently close and reopen the plugin mid-workflow. Probably not common enough to prioritize for v2.0. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Auto-detection fallback | The entire point of v2.0 is replacing unreliable auto-detection. Adding a "also auto-detect" toggle would keep the old complexity alive and confuse users about which assets will be exported. | Remove all auto-detection code: `identify.ts`, `detect-composition.ts`, and their test files. The manual list IS the source of truth. |
| Drag-and-drop from Figma | Would require a Figma plugin (not REST API) architecture. Ship Studio uses the REST API via shell/curl. There is no browser-to-plugin drag-and-drop channel. | Paste URL is the interaction model. Fast enough for typical workflows (3-10 assets per design). |
| Asset grouping/folders | Creating folder hierarchies for assets adds complexity with no benefit. Claude Code reads a flat asset directory. | Flat list with clear filenames. The brief's layout tree provides the structural context. |
| Image fill extraction via imageRef | The old pipeline used `fetchImageFills()` to get original uploaded images by `imageRef`. With manual control, users point at the node they want exported. If they point at a FRAME with an IMAGE fill, they get a PNG render of that frame (which includes the image). If they want the raw uploaded image, they need to point at the specific image-fill node. | Use `fetchImages()` (render endpoint) for all manual assets. Simpler pipeline, one API pattern. Users get what they see in Figma, not a behind-the-scenes image reference. |
| SVG optimization/minification | Post-processing SVGs (removing metadata, optimizing paths) adds a build dependency and can break SVGs that rely on specific attributes. | Export SVG as Figma renders it. Figma's SVG export is already reasonably clean with `svg_outline_text=true` and `svg_simplify_stroke=true`. |
| Batch URL paste (v2.0) | Multi-line paste of several URLs at once adds parsing complexity and error handling for mixed valid/invalid URLs. | Single URL input, add one at a time. Fast enough for typical use. Consider for v2.1 if users request it. |

## Feature Dependencies

```
Main Design URL (already built)
  |
  v
Asset URL Input + Format Picker
  |
  v
URL Validation (same file, has node ID)
  |
  v
Node Name Resolution (API call)
  |
  v
Asset List State (add, remove, display)
  |
  v
Filename Derivation + Collision Resolution
  |
  v
"Get Brief" Button (already built)
  |
  +-- Preview PNG (unchanged, auto-generated)
  |
  +-- Manual Assets Export (replaces identify + detect-composition pipeline)
  |     |
  |     +-- Batch fetchImages() for PNGs (2x scale)
  |     +-- Batch fetchImages() for SVGs
  |     +-- Sequential download (reuse existing download.ts)
  |
  +-- Layout Tree Extraction (unchanged)
  |
  +-- Brief Generation (minor changes: asset table uses manual list)
  |
  v
Result Card with Copy Brief (unchanged)
```

## MVP Recommendation

Prioritize (must-have for v2.0):

1. **Asset URL input with format picker** -- The core interaction. URL paste + PNG/SVG toggle.
2. **URL validation** -- Same file check + node ID required. Prevents confusing errors downstream.
3. **Node name resolution** -- Fetch layer name from API, derive filename.
4. **Asset list display with remove** -- Users need to see and manage their queued assets.
5. **Duplicate prevention** -- Reject same node ID added twice.
6. **Collision-safe filenames** -- Reuse existing `resolveCollisions()`.
7. **Batch export via fetchImages()** -- Replace the identify/detect pipeline.
8. **Layout tree cross-referencing** -- Already works, just needs manual list to provide nodeIds.
9. **Remove all auto-detection code** -- `identify.ts`, `detect-composition.ts`, and related tests. Clean slate.

Defer to v2.1:

- **Inline name editing**: Users can live with auto-derived names for now.
- **Multi-node URL support**: Figma does not produce multi-node URLs from its UI. Power-user feature only.
- **Format auto-suggestion**: Default PNG is safe enough. Users who want SVG know they want SVG.
- **Persisted asset list**: Low value for a workflow that takes 2-5 minutes total.

## Edge Cases to Handle

| Edge Case | Expected Behavior | Notes |
|-----------|-------------------|-------|
| URL from a different Figma file | Reject with error: "This URL is from a different file. Assets must be from the same file as your design." | Compare fileKey values. Instant, no API call. |
| URL without node-id | Reject with error: "Select a specific element in Figma and copy its link." | Check `parsedUrl.nodeId !== null`. |
| Node ID that doesn't exist (deleted layer) | The Figma API returns the node data or null. If null, show error: "This element was not found. It may have been deleted." | Detect during name resolution API call. |
| Instance child node ID (I-prefix, e.g., I5912:74596;5912:74456) | These I-prefix node IDs do NOT work with the `/v1/images` render endpoint (returns null). Show warning: "Instance child elements cannot be exported directly. Select the parent component instead." | Detect by checking if nodeId starts with "I" or contains ";". Alternatively, attempt the render and handle null gracefully. |
| SVG export of a node with raster images | Figma embeds raster images as base64 data URIs in SVG output. The SVG will be valid but potentially very large. | No special handling needed -- just works, but could warn if SVG file is > 100KB. |
| Non-renderable node (e.g., a SECTION or CANVAS node) | Figma's images API returns null for nodes that cannot be rendered. | Handle null URL from `fetchImages()` with a warning. |
| Rate limiting (429) | Figma rate limits at ~30 requests/minute for the images endpoint. With manual assets (typically 3-10), this is unlikely to hit limits. | Existing error handling in `figmaApiCall()` already catches 429s. |
| Empty asset list at export time | If user clicks "Get Brief" with no assets, the brief should still generate with layout tree + tokens + preview, just with an empty Assets section. | This is valid and useful -- not all designs need individually exported assets. |

## Figma API Constraints Relevant to This Feature

| Constraint | Impact | Source |
|------------|--------|--------|
| Images endpoint: max 32 megapixel export | Very large nodes may be downscaled. Unlikely for individual assets but possible for full-page exports. | [Figma REST API docs](https://developers.figma.com/docs/rest-api/file-endpoints/) |
| Image URLs expire after 30 days | Not relevant -- assets are downloaded immediately to disk. | Figma REST API docs |
| SVG export: 1x scale only | SVG assets are always 1x. This is fine -- SVGs scale by definition. | [Figma Help Center](https://help.figma.com/hc/en-us/articles/13402894554519-Export-formats-and-settings) |
| PNG export: scale 0.01 to 4x | Use 2x for manual assets (matches current preview behavior). | Figma REST API docs |
| I-prefix node IDs: cannot be rendered | Instance children have composite IDs (e.g., `I5912:74596;5912:74456`) that the render endpoint rejects. | [Figma Forum](https://forum.figma.com/ask-the-community-7/can-t-get-node-with-prefix-i-9560) |
| Figma "Copy link to selection": single node only | When multiple elements are selected in Figma, "Copy link" points to the parent frame, not individual nodes. No multi-node URL is generated by Figma's native UI. | Figma Forum discussion, confirmed via testing |
| `/v1/files/:key/nodes?ids=a,b,c`: supports batch | Can resolve names for multiple assets in a single API call by comma-separating node IDs. | Figma REST API docs |

## Sources

- [Figma REST API - File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- HIGH confidence
- [Figma Export Formats and Settings](https://help.figma.com/hc/en-us/articles/13402894554519-Export-formats-and-settings) -- HIGH confidence
- [Figma Forum - I-prefix node IDs](https://forum.figma.com/ask-the-community-7/can-t-get-node-with-prefix-i-9560) -- MEDIUM confidence
- [Figma Forum - Copy link to selection](https://forum.figma.com/suggest-a-feature-11/share-to-selection-links-should-be-consistent-34807) -- MEDIUM confidence
- Codebase analysis of `url-parser.ts`, `figma-api.ts`, `identify.ts`, `detect-composition.ts`, `sanitize.ts`, `export.ts`, `download.ts`, `generate.ts` -- HIGH confidence
