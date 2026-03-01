# Domain Pitfalls: v2.0 Manual Asset Control

**Domain:** Replacing automatic asset detection with user-driven asset selection in a Figma plugin
**Researched:** 2026-03-01
**Confidence:** HIGH (direct codebase analysis of 325 tests + Figma API documentation + forum reports)

---

## Critical Pitfalls

Mistakes that cause regressions, broken tests, or incorrect briefs.

### Pitfall 1: Ripping Out Auto-Detection Code That Other Modules Silently Depend On

**What goes wrong:** The PROJECT.md says "All automatic asset detection code is removed (detect-composition, identify, SVG dedup, illustration heuristics)." But these modules are imported by other files that survive the migration. Deleting them without updating consumers causes build failures.

**Why it happens:** The dependency graph is not obvious from the deletion list:
- `export.ts` imports `identifyAssets` from `./identify` and `detectCompositions` from `./detect-composition`
- `brief/generate.ts` imports `buildBreadcrumbMap` from `../assets/breadcrumb` (this one survives, but its tests reference asset types)
- `brief/types.ts` imports `ExportResult` from `../assets/types` (survives, but the `assetType` union includes `'composition'` and `'component'` which are auto-detection concepts)
- `brief/generate.ts` uses `compositionNodeIds` set to collapse illustration subtrees in the layout tree -- with manual control, this concept changes entirely

**Consequences:**
- TypeScript build errors if imports reference deleted modules
- Runtime errors if the brief generator still tries to build `compositionNodeIds` from assets that no longer have that classification
- 325 tests currently pass. Deleting `identify.ts` kills 51 tests in `identify.test.ts`. Deleting `detect-composition.ts` kills 17 tests in `detect-composition.test.ts`. That is 68 tests that must be explicitly removed, not left as dangling failures
- The `generate.test.ts` (63 tests) references `assetType: 'composition'` and `assetType: 'component'` in test fixtures -- these need updating if the type system changes

**Prevention:**
1. Map the FULL import graph before deleting anything. Run `grep -r "from.*identify\|from.*detect-composition" src/` to find all consumers
2. Delete in order: tests first, then the module, then update consumers
3. Update `AssetEntry.exportType` and `ExportResult.assetType` types to reflect the new manual-only model (likely just `'png' | 'svg'` instead of `'svg' | 'png-render' | 'png-fill'`)
4. The `breadcrumb.ts` module is NOT tied to auto-detection -- it walks the layout tree. Keep it if layout tree cross-referencing remains
5. Update `generate.ts` to stop building `compositionNodeIds` since there are no auto-detected compositions -- all nodes with assets are user-specified

**Detection:** Run `npx vitest --run` after each module deletion. Zero tolerance for test failures from import errors.

**Phase mapping:** Must be the FIRST phase. If done late, every other change builds on a broken foundation. Alternatively, do it incrementally: hollow out the auto-detection functions first (make them no-ops), then delete them after the new pipeline is working.

---

### Pitfall 2: Breaking the Brief Generator's Layout Tree Cross-Referencing

**What goes wrong:** The current brief generator uses `assetNodeMap` (nodeId -> filename) and `compositionNodeIds` to annotate the layout tree. Instance lines show `-> hero-image.png`, illustration subtrees collapse to `[Illustration] 'Hero' 500x400 -> hero.png`. After removing auto-detection, the cross-referencing mechanism must be rewired to work with user-specified assets.

**Why it happens:** Today, cross-referencing works because `identifyAssets` produces entries with `nodeId` values that match the layout tree's node IDs. The user-specified asset URLs provide node IDs directly. But the mapping logic in `generate.ts` (lines 47-61) builds `assetNodeMap` and `compositionNodeIds` from `exportResult.assets` which currently carry auto-detection metadata (`assetType`, `parentInstanceId`). With manual assets, this metadata must come from the user's input, not from auto-detection.

**Consequences:**
- If `assetNodeMap` is empty (no node IDs on user-specified assets), the layout tree loses all `-> filename.png` annotations
- If `compositionNodeIds` is empty, the `[Illustration]` collapse lines disappear -- but they SHOULD disappear since users now choose what to export
- If `parentInstanceId` is not populated, the breadcrumb fallback in `buildAssetsSection` (line 526) fails and all instance child assets show `--` location

**Prevention:**
1. User-specified assets MUST carry the node ID extracted from their Figma URL. This node ID is the key to cross-referencing
2. Drop `compositionNodeIds` entirely from the brief generator. No more `[Illustration]` collapse -- all nodes render normally in the tree
3. The `assetNodeMap` should be built from user-specified assets: `{ nodeId: filename }` pairs
4. For assets whose node ID is inside an instance (compound ID with `;`), the breadcrumb lookup will fail on the normalized tree. Accept `--` for location or parse the parent instance ID from the compound node ID format `I{parentId};{childId}`
5. Write new tests for the brief generator that verify cross-referencing with manually specified assets

**Detection:** After migration, generate a brief and verify that the Assets table has correct Location values and the layout tree shows `-> filename` annotations where expected.

**Phase mapping:** Brief generator updates must happen AFTER the new export pipeline is in place. Depends on the new `ExportResult` shape.

---

### Pitfall 3: Multi-Select URL Parsing Is Undocumented and Fragile

**What goes wrong:** PROJECT.md says "Support for both single-node URLs and multi-select URLs." Figma does not formally document the URL format for multi-node selection. When a user selects multiple nodes in Figma and copies the link, the URL format may contain comma-separated node IDs, a single node ID (of the last selected), or no node ID at all. The format has changed between Figma versions.

**Why it happens:** The current `parseFigmaUrl` (url-parser.ts) handles a single `node-id` parameter, converting dashes to colons and decoding `%3A`. Multi-select URLs observed in the wild have used formats like:
- `?node-id=123-456,789-012` (comma-separated, dash-encoded)
- `?node-id=123-456&node-id=789-012` (repeated parameter)
- `?node-id=123-456` (only one ID even with multi-select)

There is no authoritative documentation confirming which format is canonical or stable.

**Consequences:**
- If the parser only extracts the first `node-id`, multi-select silently drops all but one node
- If the parser splits on commas, a future Figma URL format change breaks it
- Users may not realize their multi-select URL only captured one node

**Prevention:**
1. DO NOT rely on multi-select URLs as the primary input mechanism. Instead, let users paste one URL per asset. This is reliable, documented, and works with the current parser
2. If multi-select support is desired, treat it as a convenience: parse comma-separated values from `node-id`, but also support repeated `node-id` parameters
3. Add validation feedback: "Found N nodes in URL" so the user knows exactly how many nodes were parsed
4. Flag this as LOW confidence behavior -- multi-select URL format is undocumented and may change

**Detection:** Test with actual Figma multi-select URLs across different Figma plan types and browser versions. The format may vary.

**Phase mapping:** URL parsing changes should be in the same phase as the asset list UI. Keep single-URL-per-asset as the primary flow; multi-select as optional enhancement.

---

### Pitfall 4: Figma API Returns Null for Unrenderable Nodes -- Silent Asset Loss

**What goes wrong:** When a user pastes a Figma URL for an asset, the node ID might reference a node that is invisible (`visible: false`), has 0% opacity, is a SLICE (export region), or simply does not exist in the file. The Figma `GET /v1/images` endpoint returns `null` for these node IDs instead of an error.

**Why it happens:** The API documentation states: "rendering of that specific node has failed... due to the node id not existing, or other reasons such as the node having no renderable components." The current `export.ts` handles this with a warning (`"No render URL for ${entry.filename}"`), but in the auto-detection pipeline, invalid nodes rarely reach this point because the tree walk only finds real, walked nodes.

With manual asset control, the user can paste ANY URL, including:
- URLs to hidden elements
- URLs to deleted elements (node no longer exists)
- URLs from a different file (wrong fileKey -- this would fail at the API level, not the node level)
- URLs with typos in the node-id
- URLs to SLICE nodes (export regions that are not visual content)

**Consequences:**
- User adds 5 assets, 2 fail silently with null render URLs, brief shows 3 assets
- User does not understand why their asset was not exported
- If the node existed when the URL was copied but was later deleted/hidden, the failure is confusing

**Prevention:**
1. Validate node IDs BEFORE export. Use `GET /v1/files/:key/nodes?ids=nodeId` to verify the node exists and has renderable content
2. Surface clear per-asset error messages: "Node not found", "Node is invisible", "Node cannot be rendered"
3. Show validation status in the asset list UI: green checkmark for valid, red X for invalid, with error reason
4. Consider a "preview thumbnail" for each asset in the list (small PNG render) so users can verify they selected the right element
5. Handle the case where the node ID's fileKey differs from the design URL's fileKey -- this is a cross-file reference that will fail

**Detection:** After export, count assets with `null` render URLs. If any, surface them prominently in the UI, not buried in warnings.

**Phase mapping:** Node validation should happen at "add asset" time, not at export time. This is a UX-critical feature.

---

## Moderate Pitfalls

### Pitfall 5: Filename Collisions When Users Name Assets From Similar Layers

**What goes wrong:** The existing `sanitizeFilename` strips everything non-alphanumeric and lowercases. The `resolveCollisions` function appends `-2`, `-3`, etc. for duplicates. But with user-specified assets, collision scenarios multiply:
- Two layers both named "Icon" in different frames produce `icon.png` and `icon-2.png`
- Layers with Unicode names (CJK, emoji, accented characters) sanitize to empty string, falling back to `unnamed.png`. Multiple such layers all become `unnamed.png`, `unnamed-2.png`, etc.
- Layer names with slashes (`Icon / Arrow Right`) become `icon-arrow-right.png` -- same as a layer named `Icon Arrow Right`

**Why it happens:** Auto-detection produced assets from a single tree walk, so name collisions were limited to siblings in the same design. Manual selection lets users pick nodes from anywhere, increasing collision likelihood. The `sanitizeFilename` regex `[^a-z0-9-]` strips ALL non-ASCII characters.

**Consequences:**
- Confusing filenames that don't match user expectations
- `unnamed.png`, `unnamed-2.png` for emoji/CJK layer names
- Brief references filenames that the user cannot identify

**Prevention:**
1. Show the derived filename in the asset list UI before export so users can see what they will get
2. Allow users to optionally rename assets in the list (override the auto-derived name)
3. Consider expanding `sanitizeFilename` to handle common Unicode characters (transliteration or at least keeping alphanumeric from other scripts)
4. For the empty-after-sanitization case, use the parent frame name or node type as fallback instead of `unnamed`
5. The existing `resolveCollisions` function works correctly for dedup -- no changes needed there

**Detection:** Test with layer names containing emoji, CJK characters, slashes, dots, and long strings. Verify that filenames are unique and recognizable.

**Phase mapping:** Filename sanitization improvements should be in the same phase as the asset list UI. User feedback (showing the derived filename) is the key mitigation.

---

### Pitfall 6: 120s Shell Timeout When Exporting Many User-Specified Assets

**What goes wrong:** Users building a comprehensive brief may add 20-30 assets. Each asset requires a Figma API render call (for PNG or SVG) plus a download. The current code batches SVG and PNG renders into separate `fetchImages` calls (one for all SVGs, one for all PNGs), each of which can take significant time. With 30 node IDs in a single batch, the 55-second Figma server-side timeout (documented) may kill the render, and the 120-second shell timeout kills the curl process.

**Why it happens:** `fetchImages` in `figma-api.ts` batches all node IDs into a single API call. The curl command has `--max-time 30` (per download) but the shell timeout is 120s for the overall operation. Large render batches hit Figma's server-side 55s rendering timeout before the shell timeout, returning partial results or errors.

**Consequences:**
- Large batches return null URLs for some nodes (server-side timeout during rendering)
- Shell timeout kills the curl process, losing all results from that batch
- Rate limiting (Tier 1: 10-20 req/min depending on plan) compounds the problem if batches are split into too many small calls

**Prevention:**
1. Split node IDs into batches of 10-15 per `fetchImages` call (conservative; keeps under 55s server render time)
2. Separate PNG and SVG batches (already done in current code)
3. Add 1-2 second delay between batches to avoid rate limiting
4. Show per-asset progress: "Exporting asset 3/15: hero-image.png"
5. The current `downloadFile` retry-once logic is adequate for individual downloads
6. Consider parallel downloads (multiple curl processes) for the download phase (after render URLs are resolved)

**Detection:** Monitor response times from `fetchImages`. If any batch takes >30s, it is too large. If 429 errors occur, add longer delays.

**Phase mapping:** Export pipeline phase. The batch size limit should be a constant, easy to tune.

---

### Pitfall 7: Removing Auto-Detection Code Without Updating the Entire Export Pipeline

**What goes wrong:** The `exportAssets` function in `export.ts` is a tightly orchestrated pipeline: detect compositions -> identify assets -> batch API calls by type (SVG, png-fill, png-render) -> build download list -> sequential download. Removing `detectCompositions` and `identifyAssets` without replacing them with a new asset list source leaves `exportAssets` with no assets to export (empty pipeline).

**Why it happens:** The function is monolithic. Steps 2-4 assume the asset list comes from `identifyAssets`. The download list construction (lines 113-146) routes assets by `exportType` (`svg`, `png-fill`, `png-render`) and calls different API endpoints for each. Manual assets have a simpler model (user chooses PNG or SVG), but the routing logic must be adapted.

**Consequences:**
- If `identifyAssets` is removed but `exportAssets` still calls it: build error
- If `identifyAssets` is replaced with an empty stub: zero assets exported, only preview PNG
- If the routing logic for `png-fill` and `png-render` is removed but some assets need image fill resolution: downloads fail

**Prevention:**
1. Redesign `exportAssets` to accept a pre-built asset list instead of deriving it from the tree. The new signature should take `assetEntries: ManualAssetEntry[]` where each entry has `{ nodeId, filename, format: 'png' | 'svg' }`
2. The preview PNG rendering (step 3a) is independent of auto-detection and must be preserved
3. Drop the three-way routing (svg/png-fill/png-render). Manual assets are either PNG or SVG. Use `fetchImages` with the appropriate format for each batch
4. Image fills (`png-fill`) are an auto-detection concept. Manual assets are always rendered via `GET /v1/images` -- the user specifies the node, the API renders it. No need for `fetchImageFills` at all
5. The `downloadAllAssets` function is generic and survives unchanged

**Detection:** After refactoring, verify that the preview PNG is still generated and that each user-specified asset is exported in the correct format.

**Phase mapping:** Core of the export pipeline refactoring phase. Must happen before any UI work that calls `exportAssets`.

---

### Pitfall 8: Test Cascade -- 68+ Tests Reference Deleted Modules, 63+ Tests Reference Changed Types

**What goes wrong:** Deleting `identify.ts` and `detect-composition.ts` immediately breaks 68 tests. But the damage is wider: `generate.test.ts` (63 tests) uses `makeExportResult()` fixtures with `assetType: 'composition'` and `assetType: 'component'`. If the `ExportResult` type changes, these fixtures need updating. The `normalize.test.ts` (82 tests) is safe since it does not reference the asset pipeline.

**Why it happens:** The test suite was built incrementally across v1.0-v1.3, with each milestone adding tests for the features it introduced. The tests are well-structured but tightly coupled to the current type definitions.

**Consequences:**
- Bulk test failures make it hard to distinguish regression from intentional deletion
- If tests are deleted carelessly, coverage for surviving code (brief generator, sanitizer, breadcrumb) is lost
- The brief generator tests are the most valuable (63 tests) -- they validate the core deliverable. Losing them during migration would be a critical regression

**Prevention:**
1. **Do not delete tests and modules in the same commit.** First: delete the module tests (identify.test.ts, detect-composition.test.ts). Second: delete the modules. Third: update consuming code and its tests
2. Keep a running `npx vitest --run` between each step -- maintain green at every step
3. For `generate.test.ts`, update the `makeExportResult` helper to use the new type shape. Most tests verify brief structure, not asset type labels -- they will pass with minimal fixture changes
4. Write NEW tests for the manual asset flow before deleting old tests for the auto-detection flow

**Detection:** Run `npx vitest --run` after every file change. The test count should decrease intentionally (from 325 down to ~240-250 after removing auto-detection tests) and then increase as new manual control tests are added.

**Phase mapping:** Test management spans every phase. Each phase should end with all tests passing.

---

### Pitfall 9: Node IDs From Different Files -- Cross-File URLs

**What goes wrong:** Users paste a Figma URL for the design page (e.g., file key `ABC123`) and then paste asset URLs from a different file (e.g., file key `XYZ789`). The `parseFigmaUrl` function extracts the file key from each URL independently. If the export pipeline uses the design page's file key to render all assets, assets from other files will fail with null render URLs or 404 errors.

**Why it happens:** The current flow uses a single `fileKey` from the design URL for all API calls. Auto-detection only finds assets within the fetched tree, so cross-file references never occurred. With manual URLs, users can paste from any Figma file.

**Consequences:**
- Node ID from file B does not exist in file A -- `fetchImages` returns null
- Error message is generic ("No render URL for asset.png") -- user does not understand the problem
- If the user has multiple Figma files open, this is an easy mistake to make

**Prevention:**
1. Parse the file key from each asset URL and compare it to the design page's file key
2. Reject (or warn) when file keys do not match: "This asset is from a different Figma file. Assets must be from the same file as your design."
3. Alternatively, support cross-file assets by making separate `fetchImages` calls per file key -- but this significantly complicates the pipeline and is likely not worth it for v2.0
4. Display the file key mismatch in the asset list UI at add time, not at export time

**Detection:** At "add asset" time, compare `parsedAssetUrl.fileKey` against `designUrl.fileKey`. Mismatch = immediate user feedback.

**Phase mapping:** URL validation in the asset list UI phase. Simple string comparison, high impact.

---

### Pitfall 10: The `MainView.tsx` State Machine Grows Unmanageably

**What goes wrong:** `MainView.tsx` is already 673 lines with 15+ state variables managing URL input, validation, extraction, asset export, brief generation, and results display. Adding an asset list (add, remove, validate, show status per asset) could push it past 1000 lines with 20+ state variables and deeply nested callbacks.

**Why it happens:** The component was designed for a linear flow: paste URL -> extract -> export -> brief -> copy. Manual asset control adds a second input loop (paste asset URL -> validate -> add to list -> repeat) that runs in parallel with the main flow. This creates a state explosion.

**Consequences:**
- State bugs: stale closures in callbacks, race conditions between validation and export
- Difficult to reason about which state resets are needed when the user changes the design URL (currently 12 state resets in `handleUrlChange`)
- Testing the component becomes impractical without refactoring

**Prevention:**
1. Extract the asset list into a separate component (`AssetList.tsx`) with its own state management
2. Use `useReducer` instead of multiple `useState` calls for the main flow state machine
3. Keep `MainView.tsx` as the orchestrator that passes data between the URL input, asset list, and results sections
4. The asset list component manages its own add/remove/validate lifecycle, emitting an `assets: ManualAssetEntry[]` array to the parent

**Detection:** If `MainView.tsx` exceeds 800 lines or 18 state variables, it needs refactoring.

**Phase mapping:** UI phase. Should be designed before implementation begins.

---

## Minor Pitfalls

### Pitfall 11: Stale Asset URLs After Design Changes

**What goes wrong:** A user adds assets, then modifies the Figma design (renames layers, deletes elements, restructures frames). The asset URLs still point to the old node IDs. If a node was deleted, the export fails. If renamed, the auto-derived filename is stale.

**Prevention:** Re-validate asset URLs at export time, not just at add time. Show a "re-validate" button or auto-validate when the user clicks "Get Brief." Accept that this is inherent to the workflow -- users must re-add assets after major design changes.

**Phase mapping:** Export phase. Add a validation pass before rendering.

---

### Pitfall 12: SVG Export of Complex Nodes Produces Unexpectedly Large Files

**What goes wrong:** When a user selects a complex frame (with many nested layers) and chooses SVG format, the Figma `GET /v1/images` endpoint renders the ENTIRE subtree as SVG. A frame with 200 children produces a massive SVG file that Claude Code cannot effectively use.

**Prevention:** Warn users when their selected node has many children: "This element has complex content. PNG may be more appropriate than SVG." Only suggest SVG for simple vector shapes (VECTOR, ELLIPSE, STAR, etc.).

**Phase mapping:** Asset list UI phase. Optional enhancement.

---

### Pitfall 13: `imageRef`-Based Export No Longer Exists -- Image Fill Nodes Must Use Render API

**What goes wrong:** The auto-detection pipeline used `fetchImageFills` (GET /v1/files/:key/images) to resolve `imageRef` values for nodes with IMAGE fills. This returned S3 URLs for the original uploaded images. With manual control, users paste the URL of the node containing the image fill, but the code tries to use `fetchImages` (render endpoint) instead. The render endpoint works -- it renders the node as PNG -- but the output is the rendered appearance (with any masks, blend modes, or sizing applied) rather than the raw source image.

**Why it happens:** The manual control model collapses three auto-detection export types (`svg`, `png-fill`, `png-render`) into two user-chosen formats (`svg`, `png`). Both use `fetchImages`. For nodes with IMAGE fills, this produces the rendered appearance, which is actually what users want (they see the design, they want that appearance).

**Prevention:** This is actually NOT a pitfall -- it is the correct behavior. The render API produces what the user sees in Figma, which is what they want to export. The `fetchImageFills` approach was needed for auto-detection because it found image references without knowing which nodes they were on. With manual control, the user points at a specific node and the render API captures it perfectly. No action needed -- just awareness that the export mechanism changes from imageRef resolution to direct rendering.

**Detection:** Compare auto-detected image fill export vs. manual node render for the same element. If they differ (e.g., the render includes a mask that the raw image did not), the render is actually more accurate.

**Phase mapping:** Awareness only. No code change needed.

---

### Pitfall 14: The "Also saved to .shipstudio/assets/brief.md" Path May Become Stale

**What goes wrong:** The `MainView.tsx` results section hardcodes the text "Also saved to .shipstudio/assets/brief.md". If the asset directory or brief filename changes during the v2.0 refactoring, this UI text becomes misleading.

**Prevention:** Derive the display path from `exportResult.assetsDir` instead of hardcoding it. Or remove the display text entirely since the primary output is clipboard copy.

**Phase mapping:** UI cleanup phase. Trivial fix.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Code removal (auto-detection) | **Pitfalls 1, 7, 8** (import graph, pipeline dependency, test cascade) | Map imports first, delete incrementally, maintain green tests at every step |
| URL parsing for assets | **Pitfalls 3, 9** (multi-select ambiguity, cross-file URLs) | One URL per asset as primary flow; validate fileKey match at add time |
| Asset list UI | **Pitfalls 5, 10, 12** (filename collisions, state complexity, SVG warnings) | Extract to separate component; show derived filenames in UI; warn on complex SVG |
| Node validation | **Pitfall 4** (unrenderable nodes) | Validate at add time, not export time; show per-asset status |
| Export pipeline refactoring | **Pitfalls 6, 7, 13** (shell timeout, pipeline rewrite, imageRef removal) | Accept new asset list as input; batch 10-15 per API call; use render API for all assets |
| Brief generator updates | **Pitfall 2** (cross-referencing) | Wire up nodeId from user-specified assets; drop compositionNodeIds; update test fixtures |
| Results UX | **Pitfall 14** (stale path text) | Derive from exportResult or remove |

---

## Key Integration Risk

**The deletion order matters more than the implementation order.** The biggest risk is not in building new features but in surgically removing old code without breaking the 257+ tests that should survive (325 total minus ~68 auto-detection tests).

**Recommended safe deletion strategy:**

1. **FIRST: Make auto-detection a no-op.** Change `identifyAssets` to return `[]` and `detectCompositions` to return `{ compositionNodeIds: new Set(), warnings: [] }`. Run tests -- only `identify.test.ts` and `detect-composition.test.ts` should fail (68 tests). All other tests (257) should pass because they use mock data, not the actual identification functions.

2. **SECOND: Delete the test files.** Remove `identify.test.ts` and `detect-composition.test.ts`. Run tests -- 257 tests should pass.

3. **THIRD: Build the new pipeline alongside the old one.** Create `exportManualAssets` as a new function. Wire it into `MainView.tsx` behind a feature flag or conditional. Get the new flow working end-to-end with new tests.

4. **FOURTH: Remove old modules.** Delete `identify.ts`, `detect-composition.ts`, and the no-op stubs in `export.ts`. Update imports. Run tests -- should be green.

5. **FIFTH: Update brief generator.** Remove `compositionNodeIds` handling, update `assetNodeMap` construction, update test fixtures in `generate.test.ts`.

This staged approach ensures that at no point are you fighting both build errors AND logic errors simultaneously.

---

## Sources

**HIGH confidence (direct codebase analysis):**
- `src/assets/export.ts` -- import graph: `identifyAssets`, `detectCompositions`, `fetchImages`, `fetchImageFills`
- `src/assets/identify.ts` -- 51 tests in `identify.test.ts`, imported by `export.ts`
- `src/assets/detect-composition.ts` -- 17 tests in `detect-composition.test.ts`, imported by `export.ts`
- `src/brief/generate.ts` -- 63 tests, imports `buildBreadcrumbMap`, uses `compositionNodeIds` and `assetNodeMap`
- `src/brief/types.ts` -- `BriefInput` depends on `ExportResult` from `../assets/types`
- `src/url-parser.ts` -- single `node-id` extraction, dash-to-colon conversion
- `src/views/MainView.tsx` -- 673 lines, 15+ state variables, single-flow architecture
- Test suite: 325 tests across 9 files, all passing as of 2026-03-01

**HIGH confidence (official Figma documentation):**
- [Figma REST API Images Endpoint](https://developers.figma.com/docs/rest-api/file-endpoints/) -- `ids` is comma-separated, null for unrenderable nodes, svg/png format options
- [Figma REST API Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) -- Tier 1 (10-20 req/min), 55s server-side render timeout, batching recommendations

**MEDIUM confidence (community reports, undocumented behavior):**
- [Figma Forum: Images API 429 + CloudFront](https://forum.figma.com/report-a-problem-6/rest-api-rate-limit-images-api-returns-429-after-10-requests-cloudfront-49021) -- rate limit lockouts from burst patterns
- [Figma Forum: Export filenames not sanitized](https://forum.figma.com/t/figma-export-filenames-are-not-sanitized/37273) -- invisible Unicode characters in layer names pass through to filenames
- [Figma Forum: Node URL format](https://forum.figma.com/ask-the-community-7/how-to-generate-url-to-specific-node-31893) -- node-id parameter with URL encoding

**LOW confidence (no official documentation):**
- Multi-select URL format (comma-separated `node-id` values) -- observed in the wild but undocumented, may change between Figma versions

---

*Pitfalls research for: Ship Studio Figma Plugin v2.0 (Manual Asset Control)*
*Researched: 2026-03-01*
