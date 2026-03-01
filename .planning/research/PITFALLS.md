# Domain Pitfalls: v2.2 @S- Asset Detection & Results UX Redesign

**Domain:** Convention-based asset detection and results modal redesign in an existing Figma plugin
**Researched:** 2026-03-01
**Confidence:** HIGH (direct codebase analysis of 313 tests + existing pipeline code + Figma API behavior)

---

## Critical Pitfalls

Mistakes that cause broken exports, lost assets, or regressions in the 313-test suite.

### Pitfall 1: @S- Detection Runs on the Normalized Tree Instead of the Raw Figma Tree

**What goes wrong:** The @S- prefix detection walks the normalized LayoutNode tree (output of `normalizeTree`) instead of the raw Figma API response. The normalized tree strips INSTANCE subtrees -- instances become leaf nodes with a `componentRef`. Any `@S-`-prefixed layers INSIDE a component instance are invisible in the normalized tree but exist in the raw tree.

**Why it happens:** The extraction pipeline is: raw Figma JSON -> `normalizeTree()` -> LayoutNode tree. The normalized tree is what `MainView.tsx` receives via `extractionResult`. It would be natural to walk `extractionResult.rootNodes` looking for `@S-` prefixes. But `normalizeNode` (normalize.ts line 185-200) treats INSTANCE nodes as leaf nodes -- their children are not recursed into. A designer who names a child layer inside a component instance `@S-hero-image` will never be found by a walk of the normalized tree.

**Consequences:**
- Assets inside component instances are silently missed
- The zero-asset warning fires incorrectly ("No @S- assets found") when the designer DID mark assets -- they are just inside instances
- The designer renames layers in Figma, re-fetches, and gets the same zero result -- deeply confusing

**Prevention:**
1. Walk the RAW Figma API response (the `rootNodes` array from `fetchFileNodes`/`fetchFullFile`) for @S- detection, NOT the normalized LayoutNode tree
2. The raw tree is available in `extractLayout()` (extract.ts lines 66-79) before `normalizeTree()` is called. Either pass it through as part of `ExtractLayoutResult`, or run the @S- scan there
3. Specifically: add a new function `detectPrefixedAssets(rawNodes: any[])` that walks the FULL raw tree including instance subtrees
4. The raw tree has `node.name`, `node.type`, `node.id`, and `node.fills` -- everything needed for @S- detection AND auto-format detection

**Detection:** Create a test fixture with an `@S-`-prefixed layer nested 3 levels deep inside an INSTANCE. Verify it is found by the detection function. If using the normalized tree, this test will fail.

**Phase mapping:** Core detection logic phase. Must be designed correctly from the start -- retrofitting after building on the normalized tree is expensive.

---

### Pitfall 2: Auto-Format Detection Gets Image Fill Check Wrong for Instances

**What goes wrong:** The auto-format rule is "PNG if any image fills, SVG otherwise." But checking `node.fills` for IMAGE type paints is not sufficient. Instance nodes have `fillOverrideTable` and may override child fills. A component that is a vector shape by definition could have an IMAGE fill override applied to a specific instance. Conversely, a RECTANGLE with an IMAGE fill in the master component may have that fill overridden to a solid color in a specific instance.

**Why it happens:** The Figma REST API represents fills differently depending on context:
- Direct nodes: `node.fills` is an array of Paint objects
- Instance overrides: `node.overrides` may contain fill changes, but these are expressed as property overrides, not as modified `fills` arrays on the child nodes
- The raw API response for an instance DOES include the resolved fills on child nodes (unlike the plugin API), but only when `geometry=paths` is NOT used (which this plugin does not use, so this is safe)

The v1.3 image detection (`collectImageFillsFromRawTree` in collect.ts) already solved this for the token collector -- it recurses into instance children at full depth. But the @S- detection is a NEW walk and needs to replicate this same logic.

**Consequences:**
- An @S- layer with an image fill is exported as SVG instead of PNG -- the SVG contains an `<image>` tag pointing to a Figma CDN URL that expires, making the asset useless
- An @S- layer without image fills is exported as PNG when SVG would produce cleaner output -- not catastrophic but suboptimal

**Prevention:**
1. The image fill check must recurse into the @S- node's entire subtree, not just check `node.fills` on the top-level node
2. Use this logic: if the @S- node OR any descendant has a fill with `type === 'IMAGE'`, format is PNG. Otherwise SVG
3. A helper function `hasImageFill(node: any): boolean` that recursively checks `node.fills` and `node.children` is the correct approach
4. Do NOT rely on `node.type` alone. A FRAME can contain image fills. A VECTOR node never has image fills but could be inside a GROUP that does
5. Special case: TEXT nodes should always be SVG (they are vectors with text content, not raster images). If a TEXT node has the @S- prefix, it is almost certainly an icon or decorative text that should be SVG

**Detection:** Test with: (a) RECTANGLE with IMAGE fill -> expect PNG, (b) VECTOR without fills -> expect SVG, (c) GROUP containing a child RECTANGLE with IMAGE fill -> expect PNG, (d) TEXT node -> expect SVG.

**Phase mapping:** Same phase as @S- detection. The format detection is tightly coupled to the tree walk.

---

### Pitfall 3: Stripping @S- From the Node Name Breaks Layout Tree Cross-Referencing

**What goes wrong:** The filename is derived by stripping `@S-` from the node name and sanitizing. So `@S-hero-image` becomes `hero-image.png`. But the layout tree displays the ORIGINAL node name (from `LayoutNode.name`), which still says `@S-hero-image`. The `assetNodeMap` maps nodeId -> filename, and the layout tree line shows `-> hero-image.png`. This works. But if someone also strips `@S-` from the layout tree display, the cross-reference line becomes `hero-image -> hero-image.png` which is redundant. If they DON'T strip it from the layout tree, the line shows `@S-hero-image -> hero-image.png` which looks ugly but is functional.

**Why it happens:** The @S- prefix lives in the Figma layer name. It flows into two places: the LayoutNode tree (for display) and the asset pipeline (for filenames). These are different concerns that need different treatment of the prefix.

**Consequences:**
- If @S- is stripped from LayoutNode.name during normalization, the layout tree loses the visual indicator that a layer is an asset. The designer cannot see which layers were detected
- If @S- is NOT stripped from LayoutNode.name, the layout tree has @S- prefixes scattered through it, which look like noise in the brief markdown
- If the sanitize function does not handle the @S- prefix correctly, filenames may include the prefix characters (e.g., `s-hero-image.png` because `@` is stripped by the sanitizer)

**Prevention:**
1. Keep `@S-` in `LayoutNode.name` -- it is the original Figma layer name and should be preserved for accuracy
2. Strip `@S-` ONLY in the filename derivation step, before calling `sanitizeFilename()`
3. In the layout tree display (brief markdown), the cross-reference arrow `-> hero-image.png` makes it clear this layer is an asset. The `@S-` prefix in the name reinforces this
4. Test that `sanitizeFilename('@S-hero-image')` produces `s-hero-image` (because `@` is stripped by `[^a-z0-9-]`). This means the prefix stripping MUST happen before sanitization: first remove `@S-` to get `hero-image`, THEN sanitize to get `hero-image`
5. The stripping regex should be `/^@S-/i` to handle case variations (`@s-`, `@S-`). Be strict: only strip the prefix if it appears at the START of the name

**Detection:** Unit test: `stripPrefix('@S-hero-image')` -> `'hero-image'`. Unit test: `sanitizeFilename('hero-image')` -> `'hero-image'`. Combined test: the pipeline from `@S-hero-image` layer name to `hero-image.png` filename.

**Phase mapping:** Filename derivation phase, same as @S- detection. Must be tested before the export pipeline uses it.

---

### Pitfall 4: Removing ManualAsset State and AssetListPanel Without Updating All Consumers

**What goes wrong:** The v2.0 manual asset workflow added significant state and UI code that v2.2 removes:
- `ManualAsset` type in `types.ts` (69-74) -- used by `AssetListPanel`, `resolve.ts`, `export.ts`
- `manualAssets` state in `MainView.tsx` (line 147) with 6 callback handlers (153-176)
- `AssetListPanel.tsx` (340 lines) -- entire component
- `resolve.ts` -- `resolveNode()`, `deriveAssetFromNode()`, `suggestFormat()`, `isInstanceChildId()`, `extractParentInstanceId()`, `resolveFilenameCollision()`
- `export.ts` -- `ExportAssetsOptions.manualAssets` parameter, partitioning logic (lines 77-99), download logic using ManualAsset shape

**Why it happens:** v2.0 was a deliberate replacement of auto-detection with manual control. v2.2 replaces manual control with convention-based detection. The code to remove is spread across 5+ files. Partial removal leaves orphaned types, unused imports, or broken function signatures.

**Consequences:**
- TypeScript errors from imports of deleted types/functions
- `export.ts` breaks if `ManualAsset` is removed but the function signature still references it
- `resolve.test.ts` (21 tests) tests functions that may be partially or fully removed
- The `manualAssets` state in `MainView.tsx` and all 6 callback handlers become dead code

**Prevention:**
1. Map what is being REPLACED vs REMOVED vs KEPT:
   - **REMOVE entirely:** `AssetListPanel.tsx`, `manualAssets` state + handlers in `MainView.tsx`, most of `resolve.ts` (resolveNode, deriveAssetFromNode)
   - **KEEP but modify:** `sanitizeFilename()` (still needed), `resolveFilenameCollision()` (still needed for duplicate @S- names), `export.ts` (needs new asset source), `ManualAsset` type -> replaced with new `DetectedAsset` type
   - **KEEP with changes:** `suggestFormat()` might be useful for auto-format but needs modification (the @S- auto-format uses image fill detection, not node type)
   - **KEEP unchanged:** `breadcrumb.ts`, `download.ts`, `sanitize.ts`
2. The `isInstanceChildId()` and `extractParentInstanceId()` functions in resolve.ts may still be useful if @S- detection finds nodes inside instances. Evaluate before deleting
3. Delete in order: UI component -> state/handlers -> type definition -> utility functions -> tests for removed code

**Detection:** Run `npx vitest --run` after each deletion step. Track test count: should decrease intentionally from 313 by the number of tests for removed functions (21 in `resolve.test.ts` that test removed functions, plus 14 in `export.test.ts` that use ManualAsset fixtures).

**Phase mapping:** Code removal must happen AFTER the new @S- detection pipeline is working and tested. Build new, then remove old. Never leave the codebase in a state where neither workflow works.

---

### Pitfall 5: The Re-Fetch ("Try Again") Button Re-Runs the Entire Extraction Pipeline

**What goes wrong:** When zero @S- assets are found, the user sees "Try again" which should re-fetch the Figma tree so the designer can mark layers with @S- and retry. But the current flow is monolithic: `handleExtract` (MainView.tsx line 376) runs extraction -> asset export -> brief generation as a single pipeline. "Try again" needs to re-run extraction AND re-scan for @S- prefixes, but should NOT re-generate the brief yet (the user needs to see the new asset list first).

**Why it happens:** The pipeline is chained: `handleExtract` calls `extractLayout` then immediately calls `runAssetExport` (line 426), which calls `generateBrief` inside its callback (line 233). There is no breakpoint where the user can inspect intermediate results. For the zero-asset warning flow, the pipeline needs a pause point: "We found X assets, continue?" or "We found 0 assets, try again?"

**Consequences:**
- If "Try again" re-runs the full pipeline, it fetches the tree, finds zero assets again (because the designer has not yet gone back to Figma to rename layers), and shows the same warning -- an infinite loop of frustration
- If "Try again" only re-fetches the tree without re-scanning for @S-, the warning persists even after the designer fixes their file
- If the pipeline continues past zero assets without pausing, the brief is generated with no assets and the "zero asset warning" appears on the results modal instead of as an interruptible step

**Prevention:**
1. Split the pipeline into two phases with a user checkpoint between them:
   - Phase A: Extract layout + scan for @S- assets
   - Checkpoint: Show detected asset count. If zero, show warning with "Try again" and "Continue anyway"
   - Phase B: Export assets + generate brief (only runs after checkpoint)
2. "Try again" should re-run Phase A: re-call `extractLayout()` to get fresh tree data, then re-scan for @S-
3. "Continue anyway" should proceed to Phase B with an empty asset list (the brief will have the placeholder system from v2.1)
4. This is architecturally similar to the existing `largeTreeWarning` checkpoint (lines 411-418 in MainView.tsx). Model the zero-asset warning the same way: store the pending result, show the warning, let the user decide
5. IMPORTANT: "Try again" MUST re-fetch from Figma, not re-scan the cached tree. The designer needs to go back to Figma, rename their layers, and then the plugin re-fetches the updated tree

**Detection:** User test: paste URL -> get zero-asset warning -> go to Figma, rename a layer to @S-icon -> click "Try again" -> verify the asset is now detected. If "Try again" uses cached data, this test fails.

**Phase mapping:** UX flow phase. This is a state machine change in MainView.tsx. Design the state transitions before implementing.

---

## Moderate Pitfalls

### Pitfall 6: @S- Prefix on Component Instance Names vs Master Component Names

**What goes wrong:** In Figma, when a designer renames a component INSTANCE, the name change is local to that instance. The master component's name is unchanged. When a designer renames the master component, all instances that haven't been locally renamed inherit the new name. The Figma API returns `node.name` as the instance-local name (which defaults to the master component name if not overridden).

A designer might:
- Rename a master component to `@S-icon-button` -- all instances inherit the prefix
- Rename one specific instance to `@S-special-button` -- only that instance has the prefix
- Forget to rename instances after renaming the master -- instances still have the old name

**Why it happens:** The `@S-` convention is human-driven. Designers need to understand whether to prefix the master component, the instances, or individual layers within instances. There is no Figma mechanism to enforce consistency.

**Consequences:**
- If the master component is prefixed, ALL instances are detected as assets. A button component used 20 times produces 20 PNG exports -- almost certainly not what the designer wanted
- If only one instance is prefixed, only that specific instance is exported -- correct behavior
- If a layer deep inside a component is prefixed, it is exported as a standalone asset detached from its parent -- may or may not be what the designer wanted

**Prevention:**
1. When an @S- node is a COMPONENT or COMPONENT_SET, warn: "Component definitions are usually not assets. Did you mean to prefix a specific instance?"
2. When an @S- node is an INSTANCE, check if the name matches the master component name (i.e., the prefix was inherited). If so, treat it as intentional -- the designer prefixed the master
3. DO NOT deduplicate INSTANCE assets by component ID. If a designer prefixes the master component and there are 20 instances, export all 20 as separate assets (they may have different overrides/content). But show a warning: "Found 20 instances of @S-icon-button. Each will be exported as a separate asset."
4. For v2.2, keep it simple: any node with @S- in its name is an asset, regardless of type. The warning system handles edge cases. Do not try to be clever about instance vs master distinction

**Detection:** Test fixture with a COMPONENT named `@S-card`, three INSTANCE nodes referencing it, and one INSTANCE with a local override name `@S-special-card`. Verify all four are detected (or only the instances, depending on the chosen policy).

**Phase mapping:** Detection logic phase. The policy decision (component vs instance) should be made during planning, not discovered during implementation.

---

### Pitfall 7: Results Modal Loses Brief Generation Context

**What goes wrong:** The current results card in `MainView.tsx` (lines 627-748) shows: success header, copy button, stats (layers/assets/tokens), token warning, component badges, asset warnings, tree preview toggle, and file save note. Replacing this with a "clean results modal" risks losing functional elements that users depend on: the token count warning, asset export warnings, and the tree preview.

**Why it happens:** "Clean results modal" is an aesthetic goal. The existing results card is "messy" because it shows a lot of information. But some of that information is critical:
- Token count warning (>12K tokens) tells users their brief may overwhelm Claude Code
- Asset export warnings tell users that specific assets failed to download
- Component badges give users confidence that the extraction captured the right elements

A modal that says "Brief is done, paste it into your agent" without these signals removes the user's ability to diagnose problems.

**Prevention:**
1. The modal MUST include: copy button, asset count, token count (with warning if >12K)
2. Asset export warnings MUST be visible -- either inline or in the expandable details section
3. The "View details" expandable toggle should contain: asset list, warnings, tree preview, component badges
4. Do NOT move the copy button inside the expandable section. It must be immediately visible and prominent
5. The expandable section defaults to COLLAPSED. Power users expand it; designers skip it
6. Token count warning should remain at the top level (not hidden in details) because it affects whether the user should proceed at all

**Detection:** After redesign, verify that a brief with >12K tokens shows a visible warning without expanding details. Verify that a brief with failed asset downloads shows warnings without expanding details.

**Phase mapping:** Results modal redesign phase. Design the information hierarchy before implementing the layout.

---

### Pitfall 8: The Export Pipeline Receives Detected Assets in a Different Shape Than ManualAssets

**What goes wrong:** The current `exportAssets` function (export.ts) accepts `manualAssets: ManualAsset[]` with shape `{ nodeId, nodeName, filename, format, status, error, warning }`. The new @S- detection produces a different shape -- it does not have `status`, `error`, or `warning` fields because detection is synchronous and does not involve async validation. If the detected assets are shoehorned into `ManualAsset`, the type system carries dead fields. If a new type is created, `exportAssets` needs a signature change.

**Why it happens:** `ManualAsset` was designed for the async add-validate-display lifecycle. Detected assets have a simpler lifecycle: walk tree, find @S- nodes, derive filename and format, done. Forcing the new data into the old type creates semantic confusion.

**Consequences:**
- If `ManualAsset` is reused, every detected asset has `status: 'valid'`, `error: undefined`, `warning: undefined` -- these fields are meaningless noise
- If a new `DetectedAsset` type is created, `exportAssets` needs to accept either type or a common base type
- The brief generator (`generateBrief`) receives `ExportResult.assets` which has its own shape -- this is downstream and does not directly care about the input type, only the output

**Prevention:**
1. Create a minimal common type for the export pipeline input:
   ```typescript
   interface ExportableAsset {
     nodeId: string;
     nodeName: string;
     filename: string;
     format: 'png' | 'svg';
   }
   ```
2. `exportAssets` accepts `ExportableAsset[]` instead of `ManualAsset[]`
3. The @S- detection function returns `ExportableAsset[]`
4. `ExportResult` shape does not change -- it is the output type, not input
5. Delete `ManualAsset` type after the migration is complete
6. The `resolve.ts` functions that populated ManualAsset's lifecycle fields (`status`, `error`, `warning`) are no longer needed

**Detection:** After type migration, run `npx tsc --noEmit` to verify no type errors. The test suite should catch any shape mismatches in the export pipeline.

**Phase mapping:** Type definition phase, before the export pipeline is modified. Define the new type first, then migrate consumers.

---

### Pitfall 9: Duplicate @S- Names in the Same Design File

**What goes wrong:** A designer has two frames, each containing a layer named `@S-icon`. The detection finds both. After stripping the prefix and sanitizing, both produce `icon.png`. The filename collision resolution produces `icon.png` and `icon-2.png`. But the designer has no way to know which `icon.png` is which -- the names were identical in Figma.

**Why it happens:** With manual asset control (v2.0), users saw each asset in a list and could rename them. With @S- detection (v2.2), assets are auto-derived from layer names. The user does not see the asset list before export (unless they expand the details section). Duplicate names are resolved silently.

**Consequences:**
- The brief references `icon.png` and `icon-2.png` but the designer cannot correlate these back to specific Figma layers
- The layout tree cross-referencing shows which node maps to which filename, but this is in the "details" section that may be collapsed
- If the designer intended both layers to be the same asset (e.g., a reused icon), they get two exports instead of one

**Prevention:**
1. The @S- detection should deduplicate by node ID (same node = same asset), NOT by name
2. Different nodes with the same @S- name are different assets and SHOULD get collision-resolved filenames
3. The asset count in the results modal should match the number of unique @S- nodes found
4. In the "View details" expandable section, show each asset with its filename AND its location in the layout tree (breadcrumb path), so the user can distinguish duplicates
5. Consider adding the parent frame name to disambiguate: `header-icon.png` vs `footer-icon.png` (but this is a v2.3 enhancement, not a v2.2 requirement)

**Detection:** Test fixture with two nodes named `@S-icon` in different frames. Verify two assets are produced with distinct filenames. Verify breadcrumb paths are different.

**Phase mapping:** Detection logic phase. Filename collision resolution already exists in `resolveCollisions` and `resolveFilenameCollision` -- reuse these.

---

### Pitfall 10: The @S- Prefix is Case-Sensitive in an Unexpected Way

**What goes wrong:** A designer types `@s-icon` (lowercase s) or `@S -icon` (space after S) or `@S_icon` (underscore instead of dash). The strict prefix check `/^@S-/` misses these variants. The designer thinks they marked the asset correctly but the plugin does not detect it.

**Why it happens:** Naming conventions require precise character sequences. Designers are not programmers -- they may type the prefix from memory, introduce typos, or use slightly different syntax.

**Consequences:**
- Assets silently missed, zero-asset warning fires
- Designer repeatedly tries to fix their naming and re-fetches, wasting time
- Different designers on the same team may use different conventions

**Prevention:**
1. Use case-insensitive prefix matching: `/^@s-/i`
2. DO NOT try to match loose variants like `@S `, `@S_`, `@S.`, etc. A strict but case-insensitive match (`@S-` or `@s-`) is the right balance
3. When showing the zero-asset warning, include a hint: "Name layers with the prefix @S- (e.g., @S-hero-image) to mark them as assets"
4. Consider also detecting near-misses and warning: "Found layer '@s icon' -- did you mean '@S-icon'?" But this is an enhancement, not required for v2.2
5. If the Figma file contains layers starting with `@S` but not `@S-` (missing dash), this is a silent failure. The zero-asset warning text should show the exact expected format

**Detection:** Test cases: `@S-icon` (match), `@s-icon` (match), `@S icon` (no match), `@S_icon` (no match), `@S-` followed by nothing (match, produces empty name after strip). The empty-name case should fall back to the parent frame name or `unnamed`.

**Phase mapping:** Detection logic phase. Simple regex decision but high UX impact.

---

### Pitfall 11: Results Modal "View Details" Toggle Persists Incorrectly Across Brief Generations

**What goes wrong:** The user generates a brief, expands "View details" to inspect assets, then clicks "Get New Brief" (or pastes a new URL). The expanded/collapsed state of the details section persists from the previous brief, showing stale data momentarily before the new brief replaces it.

**Why it happens:** The `showTree` state (MainView.tsx line 134) controls the toggle and is not reset when a new brief is generated. The current code resets it on URL change (line 323) but not on re-extraction with the same URL.

**Consequences:**
- User sees old details from a previous brief flash momentarily
- If details include warnings from a previous export that do not apply to the new one, the user is confused
- Minor UX glitch but erodes trust in the results

**Prevention:**
1. Reset the details expanded/collapsed state when the pipeline starts (in `handleExtract` before calling `extractLayout`)
2. Default to collapsed for every new brief generation
3. The state variable for details expansion should be reset alongside the brief result: `setBriefResult(null)` should also `setDetailsExpanded(false)`
4. This is the same pattern already used for other state resets in `handleExtract` (lines 383-396)

**Detection:** User test: generate brief -> expand details -> click "Get New Brief" -> verify details is collapsed when new brief appears.

**Phase mapping:** Results modal phase. Trivial fix, add it to the state reset block.

---

## Minor Pitfalls

### Pitfall 12: @S- Prefixed Hidden Layers Are Detected But Cannot Be Rendered

**What goes wrong:** A designer prefixes a hidden layer (`visible: false`) with @S-. The detection finds it. The export sends it to `fetchImages`. Figma returns null for the render URL because the node is invisible.

**Prevention:** During @S- detection, skip nodes with `visible === false`. If a hidden node has the @S- prefix, add a warning: "Skipped hidden layer @S-icon (make it visible in Figma to export)." This is consistent with the existing behavior where hidden nodes produce null renders.

**Phase mapping:** Detection logic phase. Simple filter condition.

---

### Pitfall 13: The @S- Prefix Convention Is Not Documented for Designers

**What goes wrong:** The plugin introduces a naming convention (`@S-`) that designers must learn and remember. Without documentation, adoption fails. The plugin works perfectly but nobody uses the prefix because they do not know about it.

**Prevention:**
1. The zero-asset warning message should explain the convention: "No assets found. Name layers with @S- prefix in Figma to mark them for export (e.g., @S-hero-image, @S-logo)"
2. The main view should show a brief hint near the "Get Brief" button: "Tip: Prefix layers with @S- in Figma to include them as assets"
3. Consider showing this hint only when no assets have been detected in previous briefs (avoid nagging experienced users)
4. The "Get Brief" button label could show the detected asset count: "Get Brief (3 assets)" to give immediate feedback

**Phase mapping:** UX phase. Text-only changes, low effort but high impact for adoption.

---

### Pitfall 14: @S- Detection on Full-Page Extractions Produces Too Many Assets

**What goes wrong:** When the user extracts an entire page (no nodeId in URL), the tree walk covers every frame on the page. If multiple frames have @S- prefixed layers, all are detected. A page with 10 frames, each having 3 @S- assets, produces 30 assets -- exceeding the batch size limits for `fetchImages` and producing an overwhelming brief.

**Prevention:**
1. Apply the same batch size logic from Pitfall 6 in the v2.0 PITFALLS (split into batches of 10-15 per `fetchImages` call)
2. Show the detected asset count before export: "Found 30 @S- assets. This may take a moment." Give the user a chance to narrow their selection
3. This reinforces the existing scope recommendation: "Will extract the whole page -- select a specific element in Figma to narrow scope" (MainView.tsx line 542)
4. The asset count feedback should appear alongside the scope hint, not after export

**Phase mapping:** Detection + UX phase. The batch size limit already exists conceptually; just apply it to the new detection results.

---

### Pitfall 15: Brief Generator's Placeholder System Conflicts with @S- Detection

**What goes wrong:** The v2.1 placeholder system (brief mode) instructs Claude Code to "compare the preview against provided assets and create placeholder boxes for missing elements." With @S- detection, the set of provided assets is determined by the designer's naming convention. If a designer forgets to prefix an asset, it is absent from the brief and Claude Code creates a placeholder for it. This is correct behavior. But the v2.1 placeholder instructions reference the concept of "provided assets" which assumed manual curation. The instructions may need rewording to reference "detected @S- assets" instead.

**Prevention:**
1. Review `buildPlaceholdersSection()` in `generate.ts` and update any references to "manually added" or "user-specified" assets
2. The placeholder system's core logic does not change -- it still compares preview vs assets and creates placeholders. Only the framing text changes
3. The brief mode instructions (`buildInstructionsSection()`) should reference @S- assets naturally without explaining the convention (Claude Code does not need to know about @S-)

**Phase mapping:** Brief generator update phase. Text-only changes in the instruction templates.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| @S- tree walk detection | **Pitfalls 1, 2, 12** (wrong tree, image fill check, hidden layers) | Walk the RAW Figma tree, recurse into instances, skip hidden nodes |
| Prefix handling & filenames | **Pitfalls 3, 9, 10** (cross-ref, duplicates, case sensitivity) | Strip @S- before sanitize, case-insensitive match, reuse collision resolution |
| Manual workflow removal | **Pitfall 4** (dangling types, dead code) | Map imports, delete after new pipeline works, track test count |
| Pipeline architecture | **Pitfalls 5, 8** (re-fetch flow, type shape) | Split into two phases with checkpoint, new ExportableAsset type |
| Results modal redesign | **Pitfalls 7, 11** (lost context, stale toggle state) | Keep warnings visible, reset expand state on new brief |
| Designer experience | **Pitfalls 6, 10, 13, 14** (instance naming, case, docs, page scope) | Hints in zero-asset warning, asset count in button label |
| Brief generator updates | **Pitfall 15** (placeholder text) | Update framing text, keep core logic |

---

## Key Integration Risk

**The detection-to-export pipeline boundary is the highest-risk integration point.** The @S- detection produces a list of assets from the raw tree. The export pipeline needs these assets in a specific shape. The brief generator needs the export results with nodeId mappings intact for cross-referencing. If the nodeId from detection does not exactly match the nodeId that `fetchImages` returns in its URL map, the entire pipeline silently fails to download.

**Specifically dangerous:** Figma node IDs use colons (e.g., `12:34`). The `fetchImages` endpoint URL-encodes these as `%3A`. The response map may use either the encoded or decoded form. The existing `lookupUrl` function (export.ts lines 40-42) handles three variants. The @S- detection must preserve the EXACT node ID from the raw tree and pass it through without modification. If the detection normalizes or encodes the ID, the lookup breaks.

**Recommended integration test:**
1. Create a fixture with raw Figma tree JSON containing @S- prefixed nodes
2. Run @S- detection to produce `ExportableAsset[]`
3. Pass the assets through a mock `exportAssets` that verifies the nodeId matches the fixture
4. Pass the `ExportResult` to `generateBrief` and verify the layout tree shows `-> filename.png` annotations

This end-to-end test catches the most likely integration failure: nodeId mismatches at pipeline boundaries.

---

## Sources

**HIGH confidence (direct codebase analysis):**
- `src/layout/normalize.ts` -- INSTANCE nodes are leaf nodes (lines 185-200), children not recursed
- `src/layout/extract.ts` -- raw tree available before `normalizeTree()` call (lines 66-79, 99)
- `src/assets/export.ts` -- `lookupUrl` handles three nodeId encoding variants (lines 40-42), ManualAsset consumption (lines 44-146)
- `src/assets/types.ts` -- `ManualAsset` interface (lines 59-74), `AssetEntry` interface (lines 10-20)
- `src/assets/resolve.ts` -- `suggestFormat`, `resolveFilenameCollision`, `isInstanceChildId` (lines 18-101)
- `src/assets/sanitize.ts` -- `@` stripped by `[^a-z0-9-]` regex (line 22)
- `src/components/AssetListPanel.tsx` -- 340 lines to be removed
- `src/views/MainView.tsx` -- 780 lines, pipeline chaining (lines 376-448), state resets (lines 383-396)
- `src/brief/generate.ts` -- `assetNodeMap` construction (lines 49-58), `buildPlaceholdersSection()`
- `src/brief/types.ts` -- `BriefInput` interface, no direct ManualAsset dependency
- `src/tokens/collect.ts` -- `collectImageFillsFromRawTree` pattern for instance child image detection
- Test suite: 313 tests across 9 files, all passing as of 2026-03-01

**HIGH confidence (Figma API behavior):**
- `fetchImages` response map uses varying nodeId encoding (observed in codebase handling)
- Instance child nodes have `I`-prefix IDs (documented in resolve.ts, lines 30-55)
- `visible: false` nodes return null render URLs from Images API

**MEDIUM confidence (design workflow patterns):**
- Instance naming behavior (instance-local name vs inherited master name) -- documented in Figma help, confirmed by API response format
- Designer prefix convention adoption challenges -- based on analogous conventions (BEM naming, Zeplin tags)

---

*Pitfalls research for: Ship Studio Figma Plugin v2.2 (@S- Asset Detection & Results UX Redesign)*
*Researched: 2026-03-01*
