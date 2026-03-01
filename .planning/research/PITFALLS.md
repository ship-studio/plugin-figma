# Domain Pitfalls: v1.3 Asset Completeness & Spacing Accuracy

**Domain:** Figma design extraction -- instance asset traversal, spacing accuracy, and API reliability
**Researched:** 2026-03-01
**Confidence:** HIGH (direct codebase analysis + Figma API documentation + forum reports)

---

## Critical Pitfalls

Mistakes that cause regressions, incorrect briefs, or broken asset pipelines.

### Pitfall 1: Instance Traversal Stops Too Early -- Missing Assets Inside Components

**What goes wrong:** The current code treats INSTANCE nodes as leaf nodes (`return; // Don't recurse into instance children` in both `identify.ts` line 88 and `normalize.ts` line 173). This means **every image fill, background image, and nested illustration inside a component instance is invisible to the asset pipeline**. A card component with a hero image, an avatar component with a user photo, a banner with a background image -- none of these inner assets get detected or exported.

**Why it happens:** The REST API *does* return children for INSTANCE nodes in the full file JSON response. The children array is present and populated (confirmed via the `@figma/rest-api-spec` types: InstanceNode extends FrameTraits). The code chose not to recurse into it, treating the entire instance as a single PNG render. This was a valid v1.0 trade-off but is the primary gap for v1.3.

**Consequences:**
- Hero images inside card instances missing from the brief
- Background fills (imageRef paints) on nested frames within instances never found by `collectTokens` or `identifyAssets`
- Claude Code sees the component PNG render but has no individual image assets to place, leading it to fabricate or omit images
- The `imageFills` array from token collection only finds IMAGE paints on nodes that ARE walked, so instance-internal images never appear

**Prevention:**
1. Modify `walkTree` in `identify.ts` to recurse into INSTANCE children *specifically for image fill detection* while still exporting the instance itself as a PNG render
2. Keep the instance as a leaf node in the layout tree (for brief clarity) -- the `generate.ts` guard at line 163 (`if (node.componentRef) return;`) must be preserved
3. Use `imageRef` (file-global key) for image fills found within instance children -- never use child node IDs for rendering (see Pitfall 2)
4. The instance itself still gets its existing `png-render` entry -- no change to that behavior

**Detection:** After extraction, compare the count of IMAGE fills found vs. a manual count of nodes with IMAGE-type fills in the raw API response tree. If the raw response has more, the scan missed assets inside instances.

**Phase mapping:** Core work of the asset detection phase. Address first because all other asset improvements build on complete traversal.

---

### Pitfall 2: Instance Child Node IDs with "I" Prefix Break Image Rendering API

**What goes wrong:** When you traverse into INSTANCE node children via the REST API response, the child node IDs have a compound format like `I360:21745;1269:159559` (the `I` prefix plus semicolon-separated segments). These IDs reference nodes *within* an instance context, not first-class file nodes. The Figma `GET /v1/files/:key/nodes` endpoint returns empty children for these IDs, and the `GET /v1/images` endpoint returns `null` render URLs for them.

**Why it happens:** Figma's internal node model distinguishes between a component definition's nodes and an instance's "view" of those nodes. The compound IDs are context-dependent references. The REST API's rendering endpoints work with top-level node IDs only. This is documented in Figma forum threads and confirmed by community testing.

**Consequences:**
- Passing `I`-prefixed node IDs to `fetchImages` returns `null` URLs, generating warnings but no downloads
- The download list inflates with unresolvable entries
- If SVG export is attempted for vectors inside instances, the API call succeeds but returns nulls

**Prevention:**
1. For IMAGE fills inside instances: use the `imageRef` approach exclusively. `fetchImageFills` (`GET /v1/files/:key/images`) returns all image fills for the entire file keyed by imageRef -- works regardless of where the image lives
2. For SVG/vector assets inside instances: do NOT try to extract them individually. The parent instance's PNG render already captures them visually
3. Never pass compound IDs to `fetchImages`. Add a guard: `if (nodeId.includes(';'))` to filter them before batching
4. Log filtered IDs at debug level so missing assets can be investigated

**Detection:** Before any `fetchImages` call, count node IDs containing `;`. If any exist, the code is attempting to render instance sublayers directly.

**Phase mapping:** Inseparable from Pitfall 1. The traversal strategy and API strategy must be designed together.

---

### Pitfall 3: Duplicate Asset Explosion from Instance Traversal

**What goes wrong:** Recursing into INSTANCE children for image fills discovers the same IMAGE fill reference across every instance of that component. 20 card instances with the same hero image pattern produce 20 identical `png-fill` entries. But worse: instances of the same component with *different* image overrides must NOT be deduplicated -- they genuinely have different images.

**Why it happens:** Two competing requirements:
- Same `imageRef` across instances = same image, must deduplicate (download once)
- Different `imageRef` across instances of same component = different images via overrides, must NOT deduplicate

The existing `instanceDedupKey` (componentId + variant) deduplicates the *instance PNG renders* correctly. But if line 78 skips the instance entirely (`if (!seenInstances.has(key))`) and returns without scanning children, the second instance's overridden images are never discovered.

**Consequences:**
- Without imageRef deduplication: 20 identical downloads, `hero-image.png` through `hero-image-19.png`
- Without scanning deduped instances: overridden images (different photos in different card instances) are lost

**Prevention:**
1. Deduplicate IMAGE fills by `imageRef` globally: add `seenImageRefs: Set<string>` to walk state
2. Always scan instance children for IMAGE fills, **even when the instance itself is deduplicated** for PNG render purposes
3. Structure the INSTANCE branch as: `push png-render if not deduped` -> `always scan children for IMAGE fills regardless of dedup`
4. The instance's own PNG render is still deduplicated by componentId+variant (existing behavior, unchanged)

**Detection:** After identification, compare unique `imageRef` count vs. total `png-fill` entries. If entries >> unique imageRefs, deduplication is failing. If unique imageRefs < expected overrides, scanning is incomplete.

**Phase mapping:** Same phase as Pitfalls 1-2.

---

### Pitfall 4: Figma API Rate Limits + 120s Shell Timeout

**What goes wrong:** More detected assets means more API calls and larger batches. Figma's rate limits (November 2025 update: 10-20 req/min for Tier 1 on Starter/Pro plans, up to 100/min on Enterprise) trigger 429 responses with severe retry-after values. Forum reports document lockouts with retry-after headers of ~400,000 seconds (4+ days) after burst patterns of fetching large subtrees followed by dozens of image requests. The 120s shell timeout kills long-running render batches mid-flight.

**Why it happens:**
- The images endpoint processing time scales with node count and complexity
- CloudFront CDN adds its own rate limiting layer on top of Figma's API limits
- Current code detects 429 in `figmaApiCall` and throws immediately -- no wait-and-retry
- `downloadFile` does retry once, but `fetchImages` does not
- A single batch of 50+ node IDs can take 60+ seconds to render server-side

**Consequences:**
- 429 errors surface as "Rate limited by Figma API. Try again in a moment." -- no actionable guidance
- Shell timeout kills large render batches silently
- Starter plan users (10 req/min) hit limits much sooner
- After a burst-triggered lockout, the user cannot use the plugin for days

**Prevention:**
1. Batch node IDs in groups of 20-30 for `fetchImages` calls (forum evidence: >30 IDs per call risks timeouts)
2. Add 2-second pauses between sequential `fetchImages` calls to stay under rate limits
3. Add 429 handling with wait-and-retry: wait 60 seconds, retry once. If still 429, show clear error: "Rate limited by Figma. Please wait N minutes before retrying"
4. Prioritize asset types: preview PNG first, then compositions/components (PNG renders), then image fills, then SVG icons. If rate limited mid-way, user still gets the most valuable assets
5. Treat 120s shell timeout as hard constraint: proactively split batches >30 IDs into sub-batches of 15-20
6. Consider that `fetchImageFills` returns ALL file images in one call -- this is efficient, don't split it

**Detection:** Log response times from `fetchImages`. >60s means batch too large. 429 means stop immediately.

**Phase mapping:** Dedicated phase or sub-task after asset detection is correct. Separable from detection logic.

---

## Moderate Pitfalls

### Pitfall 5: Background Fill Images on Frames with Children -- Early Return Loses Child Assets

**What goes wrong:** `walkTree` in `identify.ts` checks for IMAGE fills and returns immediately (line 103: `return;`). A FRAME with a background image AND foreground children (text, buttons, icons) exports the background but never walks the children. All child assets are lost.

**Why it happens:** The walk treats IMAGE fill detection as terminal. This is correct for leaf nodes (RECTANGLE with image fill) but wrong for containers with both a background fill and children.

**Consequences:**
- Hero section with background photo and foreground CTA: photo exported, CTA icon lost
- Card with background gradient image and foreground content: background only

**Prevention:**
1. After detecting an IMAGE fill on a node, check if `node.children` exists and is non-empty. If so, export the fill AND continue recursing into children
2. Remove the `return` after line 103 for container-type nodes only
3. The imageRef approach handles the fill; recursion finds additional assets in children

**Detection:** Any FRAME node with IMAGE-type fill AND non-empty `children` array where `walkTree` returns early.

**Phase mapping:** Asset detection phase. Small control flow change in `walkTree`, same function as Pitfall 1 changes.

---

### Pitfall 6: Token Collection Inflates Counts from Instance Internals

**What goes wrong:** After enabling INSTANCE child traversal in normalize.ts for asset detection, `collect.ts` walks into instance children and discovers fills, strokes, text styles from component internals. A Button component used 20 times inflates its internal color and typography tokens by 20x in the usage counts.

**Why it happens:** Token collection walks the normalized tree. If instances now have children, the walk enters them. Deduplication handles unique values, but usage counts spike because the same color appears once per instance.

**Consequences:**
- Color table shows a button-text color with usageCount: 60 instead of 3
- Typography tokens show inflated counts
- Brief size increases; may trigger the TOKEN_WARNING_THRESHOLD (12,000 tokens)

**Prevention:**
- Option A: Accept inflated counts as technically accurate (the colors ARE used that many times)
- **Option B (recommended):** Keep token collection's existing behavior -- add explicit guard in `collect.ts` walk: `if (node.componentRef) { /* accumulate component inventory, skip children */ return; }`. This preserves the existing behavior. The guard currently works because children are absent, but after normalization changes it must be explicit
- Option B is compatible with Pitfall 1's approach: `identify.ts` does its own independent scan of instance children for IMAGE fills, separate from the `collect.ts` walk

**Detection:** Token counts significantly higher than before. Compare brief output before/after the change.

**Phase mapping:** Asset detection phase. The guard in `collect.ts` should be added at the same time as the normalize.ts changes.

---

### Pitfall 7: Composition Detection Enters Instance Internals

**What goes wrong:** After instance children become visible, `detect-composition.ts` recurses into them and finds groups of nested vectors that qualify as compositions. These are flagged for separate PNG export even though the parent instance is already exported as PNG.

**Why it happens:** `detectInNode` recurses into all children. If an instance has children with structural complexity (5+ children, depth >= 3) and visual effects, they qualify.

**Consequences:**
- Same visual region exported twice: once as part of the instance PNG, once as a separate composition PNG
- Wasted API calls and downloads
- Confusing brief entries (two assets covering the same area)

**Prevention:**
- Add early return in `detectInNode` for INSTANCE nodes: `if (node.componentRef) return;`
- Instance internals are covered by the instance's PNG render -- no need for separate composition detection

**Detection:** Composition warnings mentioning nodes inside component instances. Duplicate PNG exports for the same visual region.

**Phase mapping:** Asset detection phase. One-line guard.

---

### Pitfall 8: Negative `itemSpacing` Maps to Invalid CSS `gap`

**What goes wrong:** Figma allows negative `itemSpacing` in auto-layout frames for overlapping effects (avatar stacks, stacked cards). `mapToFlexbox` passes it directly: `gap: frame.itemSpacing ?? 0`. CSS `gap` does not accept negative values. The brief outputs `gap: -8` which is invalid CSS.

**Why it happens:** Figma's auto-layout is a superset of CSS flexbox in this area. The API documentation explicitly states `itemSpacing` "can be negative." The mapping function has no validation.

**Consequences:**
- Brief shows invalid CSS
- Claude Code either ignores it or attempts negative margins (possibly correct but fragile)
- Additional edge case: Figma has a bug where negative gap with zero-width child elements silently resets to 0

**Prevention:**
1. Detect negative `itemSpacing` and emit as annotation: `gap: 0` with `[overlap: -8px]` note
2. In spacing tokens, skip negative values or flag as "overlap" type
3. Add a brief annotation: "This frame uses overlapping elements. Use CSS negative margins to achieve this effect."

**Detection:** Any `autoLayout.gap < 0` after `mapToFlexbox`.

**Phase mapping:** Spacing accuracy phase.

---

### Pitfall 9: `SPACE_BETWEEN` Reports `itemSpacing: 0` -- Visual Gap Invisible

**What goes wrong:** Auto-layout frames with `primaryAxisAlignItems: SPACE_BETWEEN` report `itemSpacing: 0`. The actual visual spacing is computed dynamically at render time. The brief shows `gap: 0, justify: space-between`.

**Why it happens:** `space-between` is a distribution mode, not a fixed gap. The API correctly reports `itemSpacing: 0`.

**Consequences:**
- This IS correct CSS mapping. `justify-content: space-between` with `gap: 0` produces the right result in CSS
- No bug, but could be confusing if not understood

**Prevention:**
1. Recognize this as **correct behavior**. No code change needed
2. Optionally compute effective spacing as a comment: `justify: space-between (~24px at 1200px width)` -- but this is fragile and changes with container width

**Detection:** `primaryAxisAlignItems === 'SPACE_BETWEEN'` + `itemSpacing === 0`. Not a bug.

**Phase mapping:** Spacing accuracy phase. Awareness only.

---

### Pitfall 10: Absolute-Positioned Children Don't Participate in Parent Spacing

**What goes wrong:** Elements with `layoutPositioning: 'ABSOLUTE'` within auto-layout frames are removed from flow. They don't receive `gap` spacing. The brief shows `gap: 16` but an absolute badge/overlay is unaffected.

**Why it happens:** By design in both Figma and CSS. Absolute-positioned elements are outside normal flow.

**Consequences:**
- Claude Code might apply gap to all children including absolute ones
- If many children are absolute, the gap value is misleading

**Prevention:**
1. Current `[absolute]` annotation in the layout tree is already sufficient
2. Ensure absolute-positioned children include position information from `absoluteBoundingBox` relative to parent

**Detection:** Count children with `positioning === 'ABSOLUTE'` in auto-layout frames.

**Phase mapping:** Spacing accuracy phase. Current handling is close.

---

### Pitfall 11: Spacing Only From Auto-Layout -- Manual Layouts Have No Spacing Data

**What goes wrong:** `collectTokens` only captures spacing from `autoLayout.padding` and `autoLayout.gap`. Frames without auto-layout produce zero spacing tokens. Designs mixing auto-layout and manual positioning have partial spacing data.

**Why it happens:** Figma stores spacing as auto-layout properties only. Manually positioned elements have `absoluteBoundingBox` coordinates but no explicit spacing.

**Consequences:**
- Partial spacing data for mixed designs
- Claude Code guesses spacing in manual-layout areas

**Prevention:**
1. Accept this limitation explicitly in the brief
2. Optionally compute "implied padding" for manual-layout containers using `absoluteBoundingBox` math (frame edge to nearest child edge)
3. Do NOT try to infer gap between manually positioned siblings -- heuristics are wrong more often than right

**Detection:** Count FRAME/GROUP nodes with children but no `autoLayout`. If significant, flag spacing data as incomplete.

**Phase mapping:** Spacing accuracy phase. Limitation to document.

---

## Minor Pitfalls

### Pitfall 12: `absoluteBoundingBox` vs. `absoluteRenderBounds` for Position/Spacing

**What goes wrong:** If computing spacing from element positions, `absoluteBoundingBox` gives geometric bounds while `absoluteRenderBounds` includes shadows and thick strokes. Using the wrong one produces spacing that doesn't match the design.

**Prevention:** Use `absoluteBoundingBox` for spacing calculations. Designers set spacing based on frame edges, not shadow edges. Current code already uses `absoluteBoundingBox` for width/height.

**Phase mapping:** Spacing accuracy phase, if manual spacing computation is added.

---

### Pitfall 13: `absoluteBoundingBox` Null on Hidden Nodes

**What goes wrong:** Hidden nodes (`visible: false`) may have `absoluteBoundingBox: null`. Computing spacing with null boxes causes runtime errors.

**Prevention:** Filter to visible nodes with non-null `absoluteBoundingBox` before computing spacing. Already handled in normalize.ts for width/height (line 87).

**Phase mapping:** Spacing accuracy phase.

---

### Pitfall 14: Inferred Spacing on Rotated Frames

**What goes wrong:** A rotated frame has an `absoluteBoundingBox` representing the axis-aligned box AFTER rotation, which is larger than the visual frame. Computing spacing from this inflated box produces incorrect values.

**Prevention:** Check for `node.rotation` -- if non-zero, skip inferred spacing. Rotated frames are uncommon in layout containers.

**Phase mapping:** Spacing accuracy phase.

---

### Pitfall 15: Plugin Icon Confusion with Asset Pipeline

**What goes wrong:** Adding a Figma logo SVG to the plugin UI is unrelated to asset extraction but could create import/naming confusion if implemented carelessly in the same milestone.

**Prevention:** Keep as static SVG or inline JSX, completely separate from `assets/` module. Implement last.

**Phase mapping:** Final polish phase, independent.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Instance children for asset detection | **Pitfalls 1, 2, 3** (traversal + API + dedup form a tightly coupled chain) | Design complete strategy first: walk into instances only for IMAGE fills, use imageRef (not node rendering), deduplicate by imageRef globally, always scan deduped instances for overridden images |
| Instance children for asset detection | **Pitfall 5** (background fills on frames with children) | Fix early-return in `walkTree` simultaneously -- same function, same control flow changes |
| Instance children for asset detection | **Pitfalls 6, 7** (token inflation + composition false positives) | Add explicit `componentRef` guards in `collect.ts` and `detect-composition.ts` to preserve existing behavior |
| API batch optimization | **Pitfall 4** (rate limits + timeout) | Batch node IDs in groups of 20-30, add 2s pauses between calls, handle 429 with wait-and-retry, split batches proactively for 120s timeout |
| Spacing accuracy | **Pitfalls 8, 9, 10, 11** | Negative gap (Pitfall 8) is the only required code change. Others are documentation or awareness. Decide upfront which edge cases need code vs. annotations |
| Spacing inference (if attempted) | **Pitfalls 12, 13, 14** | Use `absoluteBoundingBox`, filter hidden nodes, skip rotated frames |
| Plugin icon | **Pitfall 15** | Implement last, keep separate from extraction code |

---

## Key Integration Risk

**Pitfalls 1-4 form a tightly coupled chain.** You cannot fix instance traversal (Pitfall 1) without immediately encountering the I-prefix problem (Pitfall 2) and the duplication explosion (Pitfall 3), which then pushes into API rate limit territory (Pitfall 4). These must be addressed as a single design decision.

**Recommended strategy (before writing any code):**
1. Walk into instance children **only to find IMAGE fills** via `imageRef` -- never try to render instance sublayers
2. Do NOT export individual SVGs or sub-components from within instances -- the instance PNG render covers them
3. Always scan instance children for IMAGE fills, even for deduped instances (to catch image overrides)
4. Deduplicate by `imageRef` using a single `Set<string>` across the entire tree walk
5. The instance itself still gets a `png-render` entry (unchanged existing behavior)
6. Add guards in `collect.ts` and `detect-composition.ts` to prevent entering instance subtrees
7. Batch API calls with 20-30 node limit, 2s pauses, 429 retry logic

This avoids the I-prefix problem entirely, captures missing image fills via the file-global imageRef mechanism, handles image overrides correctly, and controls API usage.

---

## Sources

**HIGH confidence (official documentation + direct codebase analysis):**
- [Figma REST API Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) -- Tier-based limits, per-minute quotas
- [Figma REST API Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- Images endpoint, file nodes, depth parameter
- [Figma rest-api-spec TypeScript types](https://github.com/figma/rest-api-spec/blob/main/dist/api_types.ts) -- InstanceNode extends FrameTraits (has children), ImagePaint.imageRef, HasLayoutTrait (itemSpacing "can be negative")
- [Figma Guide to Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout) -- Negative spacing, absolute positioning, SPACE_BETWEEN
- Codebase: `src/assets/identify.ts`, `src/assets/detect-composition.ts`, `src/assets/export.ts`, `src/assets/download.ts`, `src/layout/normalize.ts`, `src/layout/flexbox-map.ts`, `src/layout/types.ts`, `src/tokens/collect.ts`, `src/brief/generate.ts`, `src/figma-api.ts`

**MEDIUM confidence (community reports, consistent across multiple sources):**
- [Figma Forum: Images API 429 + CloudFront](https://forum.figma.com/report-a-problem-6/rest-api-rate-limit-images-api-returns-429-after-10-requests-cloudfront-49021) -- Multi-day lockouts from burst patterns, ~400,000s retry-after values
- [Figma Forum: Node IDs with I Prefix](https://forum.figma.com/ask-the-community-7/can-t-get-node-with-prefix-i-9560) -- Instance sublayer IDs return empty children, null render URLs
- [Figma Forum: Component Instance Children](https://forum.figma.com/ask-the-community-7/can-t-get-file-nodes-of-component-instance-children-19465) -- Confirmed limitation with instance sublayer access
- [Figma Forum: Negative Gap Bug](https://forum.figma.com/report-a-problem-6/auto-layout-bug-negative-gap-with-zero-width-element-falls-back-to-zero-42350) -- Zero-width elements reset negative gap to 0
- [Figma Forum: absoluteBoundingBox vs absoluteRenderBounds](https://forum.figma.com/ask-the-community-7/in-api-response-render-bound-bounding-box-but-no-difference-is-seen-in-figma-10161) -- Geometric vs visual bounds difference
- [Figma Forum: counterAxisSpacing auto value](https://forum.figma.com/ask-the-community-7/counteraxisspacing-and-auto-value-24483) -- null syncs with itemSpacing

---

*Pitfalls research for: Ship Studio Figma Plugin v1.3 (Asset Completeness, Spacing Accuracy, Plugin Icon)*
*Researched: 2026-03-01*
