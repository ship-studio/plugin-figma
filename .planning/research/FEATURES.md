# Feature Landscape

**Domain:** Convention-based asset detection (@S- prefix) and results UX redesign for Figma-to-brief plugin
**Researched:** 2026-03-01
**Milestone:** v2.2

## Table Stakes

Features the designer expects from this milestone. Missing = the workflow feels broken or incomplete.

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| @S- prefix tree scan | Core promise of the milestone -- designers mark layers in Figma with `@S-`, plugin finds them automatically. No URL pasting, no manual asset management. | Low | The normalized `LayoutNode[]` tree already has `name` on every node (confirmed: Figma REST API guarantees `name` globally). A recursive walk filtering by prefix is ~40 LOC. | Walk the tree after `extractLayout` returns, before calling `exportAssets`. Collect matching nodes into an array equivalent to the old `ManualAsset[]`. |
| @S- prefix stripped from filenames | `@S-hero` must become `hero.png`, not `s-hero.png`. The prefix is a signal to the plugin, not part of the asset name. | Low | `sanitizeFilename()` already exists. Strip the `@S-` prefix (4 chars) before passing to sanitize. | The existing sanitizer handles the rest: lowercase, hyphenate, collapse, strip invalid chars. |
| Auto-detect PNG vs SVG format | Designers mark what to export; the plugin determines how. Vector-only layers export as SVG, anything with raster content exports as PNG. | Medium | Existing `suggestFormat()` in `resolve.ts` checks node type. Must enhance: also check `fills` for `type: 'IMAGE'` on the node itself. If any fill is IMAGE, force PNG regardless of node type. | Aligns with existing v1.3 image fill detection. The fills array is already on `LayoutNode` (captured during normalization). A FRAME named `@S-hero` with an IMAGE fill = PNG. A VECTOR named `@S-arrow` with solid fills = SVG. |
| Duplicate @S- name handling | Two layers named `@S-icon` must produce `icon.svg` and `icon-2.svg`, not silently overwrite. | Low | Existing `resolveFilenameCollision()` from `resolve.ts` handles this exactly. Already tested in v2.0. | Feed the derived filenames through the same dedup pipeline. No new collision logic needed. |
| Remove manual asset URL workflow | The @S- convention replaces URL-based asset addition entirely. Keeping both creates confusion about which workflow to use. | Medium | Remove `AssetListPanel` component, all `manualAssets` state/handlers in MainView (6 callbacks + state), `handleAddAsset`/`handleRemoveAsset`/etc. Keep `resolve.ts` utilities reused by @S- detection (`suggestFormat`, `resolveFilenameCollision`). | ~200 lines of removal across `AssetListPanel.tsx` (340 lines, entire file) and MainView state. Well-isolated code. |
| Zero-asset warning when no @S- layers found | Designer forgot to prefix layers or selected the wrong frame. Needs immediate, actionable feedback rather than silently generating a brief with no assets. | Low | Conditional UI after tree scan returns 0 @S- matches, before export pipeline runs. | Standard empty-state UX pattern: explain the situation, provide actions. Per NN/g and Carbon Design System: "Always provide an action." |
| "Continue anyway" on zero-asset warning | Some designs genuinely have no assets to export (pure text/layout compositions). Must not block the workflow. | Low | Button that skips asset export and proceeds to brief generation with empty asset list. | The pipeline already handles 0 assets gracefully -- brief generates with an empty Assets table, preview PNG still renders. |
| "Try again" on zero-asset warning (re-fetch) | Designer goes back to Figma, adds `@S-` prefixes, then re-fetches without re-entering the URL. | Low | Re-triggers `handleExtract()` which re-fetches from the Figma API, getting the updated tree with newly-prefixed layers. | No new logic -- just call the existing extract handler. The API call gets fresh data. |
| Results view shows success state clearly | After the pipeline completes, the designer must know: (a) it worked, (b) what to do next, (c) how to get the brief. The current inline result card works but doesn't guide next steps. | Medium | Existing `Modal` component (`Modal.tsx`) with overlay, escape-to-close, header. Existing brief state (`briefResult`, `exportResult`, `extractionResult`). | Replace the inline result card (MainView lines 627-748) with a modal. Primary action = copy brief. |
| Copy brief to clipboard in results | The core deliverable. Designer clicks one button to get the brief on their clipboard. | Already exists | `copyToClipboard()` in `brief/io.ts`, `handleCopyBrief` in MainView. | Move the button into the new results modal. No functional changes needed. |

## Differentiators

Features that elevate the experience. Not required for functional correctness, but significantly improve the designer workflow.

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|--------------|-------|
| Paste instructions in results modal | Designers often don't know what to do after copying. "Paste this into Claude Code (or any AI coding assistant)" closes the knowledge gap. | Low | Static text in the results modal, no logic needed. | This is the highest-value low-effort improvement. Removes the "now what?" moment. |
| Refinement encouragement message | Sets correct expectations: the brief is a starting point, not pixel-perfection. "Review the result and refine -- you can always paste an updated brief." | Low | Static text below the paste instructions. | Prevents disappointment when the first output isn't perfect. Encourages iteration, which is the actual workflow. |
| "View details" expandable toggle | Power users want to verify what was extracted (asset list, tree structure, token counts) without cluttering the success screen. | Medium | Reuse existing `TreePreview` component, asset count/list rendering, warning display. Wrap in a `useState<boolean>` toggle. | The detail content already exists in the current result card. Extract it into a collapsible section within the modal. ~80 LOC for the toggle + content wrapper. |
| Stats summary line in results | Quick confirmation without expanding details: "3 assets, 12 tokens, 47 layers". Builds confidence that the scan worked correctly. | Low | Already computed: `briefResult.stats.assetCount`, `briefResult.stats.nodeCount`, `briefResult.stats.colorCount + fontCount`. | One line of UI. High information density, low visual weight. |
| Case-insensitive @S- matching | Designers might type `@s-`, `@S-`, or accidentally `@s-`. Being forgiving prevents frustration. | Low | Use regex `/^@s-/i` instead of `startsWith('@S-')`. One character difference in the implementation. | Trivially easy, meaningfully helpful. Include by default. |
| Token warning in results modal | Large briefs (>12K estimated tokens) get a yellow warning suggesting a smaller selection. Already exists inline; move to modal. | Low | Already computed via `TOKEN_WARNING_THRESHOLD`. Existing warning component styling. | Prevents wasted Claude Code context window. |
| "Get New Brief" button in results modal | After copying, designer might want to re-run with changes (different URL, updated Figma file). Secondary action in the modal. | Low | Calls existing `handleExtract()` and closes the modal. | The current inline version already exists. Move to modal footer as secondary (gray) button. |

## Anti-Features

Features to explicitly NOT build for this milestone.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Writing @S- prefixes back to Figma | This plugin is read-only (REST API via curl). Writing to Figma requires Plugin API access within the Figma app, different auth, mutation risk. Completely outside the architecture. | Designers add `@S-` in Figma manually. The plugin detects, never modifies. |
| Asset preview thumbnails in results | Rendering thumbnails requires additional API calls per asset, increases load time, and the brief already includes a full-page preview PNG that shows everything in context. | Show asset filenames with format badges (PNG/SVG). The preview is the visual reference. |
| Per-asset format override in results | The v2.0 workflow had per-asset format toggles. With @S- convention, auto-detection should be correct. Overrides reintroduce the complexity we are removing. | Trust auto-detection. If wrong for an edge case, designer renames the layer in Figma or flattens it to force a different node type. |
| Inline asset renaming in results | The v2.0 workflow had click-to-rename. With @S- convention, the Figma layer name IS the canonical filename. Renaming in the plugin creates a disconnect. | Designers rename layers in Figma. Plugin reflects what is in the file. "Try again" re-fetches with updated names. |
| Drag-and-drop asset reordering | Assets are listed by tree position (depth-first walk order). Reordering adds state complexity with zero brief quality benefit. The brief's layout tree provides structural context. | List assets in tree-walk order. Matches how they appear in the layout tree section. |
| Multi-file @S- scanning | Scanning across Figma files requires multiple API calls, file key management, cross-file dedup. Plugin scope is single-URL. | One URL = one scan. Multiple files = multiple plugin runs. |
| Persistent @S- cache between extractions | Caching detected assets across runs introduces stale data risk. Each "Get Brief" should be a clean scan. | Fresh scan every time. The API call is already happening for the layout tree; @S- scan is just a filter on the same data. |
| Animated results transitions | CSS animations between the input view and results modal add visual polish but no functional value. The modal overlay handles the transition adequately. | Use the existing `Modal` component as-is with its backdrop fade. |
| Raw Figma tree scan for instance subtrees | Walking the raw API tree (before normalization) to find @S- nodes inside component instances adds complexity. Instance internals are the component author's domain, not the consuming designer's. | Scan the normalized tree only. If a designer needs an instance's asset, they prefix the INSTANCE node itself, not its internals. Document this as a known limitation. |

## Feature Dependencies

```
extractLayout() [existing, unchanged]
       |
       v
@S- tree scan (new: walk LayoutNode[], filter by prefix)
       |
       ├── Found 0 @S- nodes ──> Zero-asset warning
       |                              |
       |                    ┌─────────┴──────────┐
       |                    v                    v
       |           "Continue anyway"       "Try again"
       |           (proceed w/ 0 assets)   (re-fetch -> loop back)
       |
       ├── Found N @S- nodes ──> Format detection per node
       |                              |
       |                              v
       |                    Filename derivation (strip @S-, sanitize, dedup)
       |                              |
       v                              v
exportAssets() [existing, takes ManualAsset[]-shaped input]
       |
       v
generateBrief() [existing, unchanged]
       |
       v
Results modal (new: replaces inline result card)
       |
       ├── Copy button (primary action)
       ├── Paste instructions + refinement message
       ├── Stats summary line
       ├── View details toggle (expandable)
       |       ├── Asset list
       |       ├── Tree preview
       |       ├── Token summary
       |       └── Warnings
       ├── Get New Brief button (secondary)
       └── File save note

INDEPENDENT: Remove manual asset workflow (AssetListPanel deletion)
  Can happen before or after @S- detection, but logically:
  Build @S- detection first, verify it works, THEN remove old workflow.
  Prevents a gap where neither asset workflow exists.
```

## Key Implementation Details

### @S- Tree Scanning

The scan runs after `extractLayout()` returns the normalized tree but before `exportAssets()`. It produces an array of detected assets:

```typescript
interface DetectedAsset {
  nodeId: string;
  nodeName: string;       // original name with @S- prefix
  strippedName: string;   // name without @S- prefix
  filename: string;       // sanitized + deduped + extension
  format: 'png' | 'svg';
  node: LayoutNode;       // reference for fills/type inspection
}
```

Walk algorithm:
1. Recursive depth-first walk of `extractionResult.rootNodes`
2. At each node, check `node.name` against `/^@s-/i`
3. If match, inspect node for format detection (see below)
4. Collect into results array
5. After walk, run filename dedup (`resolveFilenameCollision`)

INSTANCE nodes are leaf nodes in the normalized tree (no children). The scan WILL check their `name` but will NOT recurse into their internal structure. This is correct behavior: a designer prefixes the instance itself, not its internal layers.

### Format Auto-Detection for @S- Nodes

Enhanced logic beyond the existing `suggestFormat()`:

```
1. If node.fills contains any fill with type === 'IMAGE' --> PNG
2. If node.type is in VECTOR_NODE_TYPES (VECTOR, LINE, STAR, etc.) --> SVG
3. If node.type is FRAME/GROUP/COMPONENT/INSTANCE --> PNG
4. Default: PNG (safest fallback)
```

Step 1 is the key addition. A FRAME named `@S-hero` with a background photo must be PNG. The `fills` array is already on `LayoutNode` (populated during normalization from the raw API data).

### Export Pipeline Adaptation

The `exportAssets()` function currently accepts `manualAssets: ManualAsset[]`. The @S- scan output maps directly:

```typescript
const detectedAsManual: ManualAsset[] = detected.map(d => ({
  nodeId: d.nodeId,
  nodeName: d.nodeName,
  filename: d.filename,
  format: d.format,
  status: 'valid' as const,
}));
```

Pass this array as `manualAssets` to `exportAssets()`. No changes to the export pipeline itself.

### Results Modal Layout

```
+---------------------------------------------+
| [Figma logo]  Brief Ready                   |
+---------------------------------------------+
|                                              |
|  [checkmark]                                 |
|  Your design brief is ready.                 |
|                                              |
|  3 assets  ·  12 tokens  ·  47 layers        |
|                                              |
|  +--------------------------------------+    |
|  |     Copy Brief to Clipboard          |    |  <-- btn-primary (green)
|  +--------------------------------------+    |
|                                              |
|  Paste this into Claude Code                 |
|  (or any AI coding assistant).               |
|  Review the result and refine --             |
|  you can always paste an updated brief.      |
|                                              |
|  > View details                              |  <-- expandable toggle
|                                              |
|  +--------------------------------------+    |
|  |         Get New Brief                |    |  <-- btn-secondary (gray)
|  +--------------------------------------+    |
|                                              |
|  Saved to .shipstudio/assets/brief.md        |  <-- muted footer
|                                              |
+---------------------------------------------+
```

Expanded details section shows:
- Asset list (filename + format badge per row, reuse `.figma-plugin-format-badge` styling)
- Tree preview (reuse `TreePreview` component at depth 2)
- Token summary ("5 colors, 3 fonts, 8 spacing values")
- Warnings (if any, reuse `.figma-plugin-warning` styling)
- Token count warning (if >12K, reuse existing threshold)

## MVP Recommendation

Build in this order:

1. **@S- tree scan + format detection + filename derivation** -- The core feature. Without this, nothing else matters.
   - New `src/assets/detect.ts` module (~60 LOC)
   - Pure function, fully testable, no side effects
   - Test cases: basic detection, case insensitivity, image fill -> PNG, vector -> SVG, dedup, no matches returns empty array

2. **Zero-asset warning with "Continue anyway" and "Try again"** -- Prevents the "it didn't do anything" confusion.
   - New state in MainView: `detectedAssets` array + `showZeroAssetWarning` boolean
   - ~40 LOC of conditional UI using existing warning component styles
   - "Try again" calls `handleExtract()`, "Continue anyway" proceeds with empty list

3. **Results modal** -- Completes the designer experience.
   - New `src/components/ResultsModal.tsx` (~120 LOC)
   - Uses existing `Modal` shell component
   - Receives `briefResult`, `exportResult`, `extractionStats` as props
   - Copy button, paste instructions, refinement message, stats summary
   - "View details" toggle with existing detail components
   - "Get New Brief" secondary button

4. **Remove manual asset workflow** -- Cleanup after @S- is working.
   - Delete `src/components/AssetListPanel.tsx` (entire file)
   - Remove `manualAssets` state and 6 callbacks from MainView
   - Remove `AssetListPanel` import and JSX
   - Keep `ManualAsset` type (reused by @S- pipeline)
   - Keep `resolve.ts` utility functions (reused by @S- pipeline)

Defer:
- **Nested instance @S- scanning**: Only if real designers hit this edge case. Document the limitation.
- **Results modal animations**: The Modal overlay handles transition. No custom animations needed.

## Complexity Budget

| Feature | Estimated LOC | Files Touched | Risk |
|---------|--------------|---------------|------|
| @S- tree scan + format detection | ~60 new | New `src/assets/detect.ts` | Low -- pure function, no async, no API calls |
| Filename derivation | ~20 new | Within `detect.ts`, reuses `sanitizeFilename` | Low |
| Zero-asset warning UI | ~40 new | `MainView.tsx` (new conditional block) | Low |
| Results modal | ~120 new | New `ResultsModal.tsx` + MainView integration | Medium -- new component, state handoff |
| Remove manual workflow | ~250 removed | `AssetListPanel.tsx` (delete), `MainView.tsx` (state cleanup) | Low -- pure removal |
| View details toggle | ~80 new | Within `ResultsModal.tsx` | Low -- self-contained |
| **Total** | ~320 new, ~250 removed | 4-5 files | Low-Medium overall |

## Sources

- [Figma REST API - Global Properties](https://developers.figma.com/docs/rest-api/files/) -- confirms `name` is present on all node types (HIGH confidence)
- [Figma Layer Naming Conventions](https://www.figma.com/community/file/1064955840810792842/guide-layer-naming-conventions) -- naming convention patterns in the ecosystem (MEDIUM confidence)
- [NN/g Empty State Design](https://www.nngroup.com/articles/empty-state-interface-design/) -- "always provide an action" for zero-results states (HIGH confidence)
- [Cloudscape Empty States Pattern](https://cloudscape.design/patterns/general/empty-states/) -- zero-results UX with action buttons (HIGH confidence)
- [Carbon Design System Empty States](https://carbondesignsystem.com/patterns/empty-states-pattern/) -- empty state messaging and action patterns (HIGH confidence)
- Codebase analysis: `MainView.tsx`, `AssetListPanel.tsx`, `Modal.tsx`, `resolve.ts`, `export.ts`, `sanitize.ts`, `normalize.ts`, `extract.ts`, `generate.ts`, `figma-api.ts`, `types.ts`, `styles.ts` (HIGH confidence -- primary source for all dependency and complexity analysis)
