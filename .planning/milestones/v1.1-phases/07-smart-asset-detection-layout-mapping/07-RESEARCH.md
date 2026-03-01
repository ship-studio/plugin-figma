# Phase 7: Smart Asset Detection & Layout Mapping - Research

**Researched:** 2026-02-28
**Domain:** Figma node tree analysis, composition heuristics, asset export pipeline, breadcrumb mapping
**Confidence:** HIGH

## Summary

Phase 7 adds two capabilities to the existing asset pipeline: (1) detecting complex visual compositions in the Figma node tree and exporting them as single PNG images instead of individual SVG parts, and (2) mapping every exported asset to its position in the layout tree via breadcrumb paths.

The codebase is well-structured for these changes. The `identifyAssets()` function in `src/assets/identify.ts` already walks `LayoutNode[]` and classifies nodes by type -- composition detection is a pre-pass that intercepts nodes before they reach the existing SVG/png-fill classification. The `AssetEntry` type already includes `'png-render'` as an `exportType` value but it is currently unused. The `fetchImages()` API wrapper already supports PNG rendering with a scale parameter. The `ExportResult.assets` array currently carries only `{ filename, path }` but needs extension to carry `nodeId` and asset type for breadcrumb mapping.

The Figma REST API `/v1/images` endpoint accepts a single `format` parameter per call (confirmed by official docs), so composition PNGs require a separate batch call from SVG assets. The existing pipeline already makes separate calls for SVG renders and image fills, so adding a third call for composition PNGs follows the established pattern.

**Primary recommendation:** Add a `detectCompositions()` pre-pass before `identifyAssets()` that marks nodes as compositions based on structural + visual signals, then integrate composition detection into the identify/export pipeline and extend the brief's Assets table with Type and Location columns.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use a heuristic combination approach -- require multiple signals together (e.g., child count threshold AND at least one mask or blend mode) to reduce false positives
- Per-child detection -- each direct child of a container is evaluated independently, not the whole container
- If a node meets structural signals (high child count, deep nesting, BOOLEAN_OPERATION) AND visual effect signals (blend modes, masks, opacity layering), it is flagged as a composition
- Detected compositions export as a single PNG only -- do NOT also export individual SVG parts for children within the composition
- Export at 2x scale (consistent with preview image)
- Filenames use the same convention as existing assets: sanitized node name + .png (e.g., "hero-illustration.png")
- The brief's Assets section adds a type indicator column to distinguish compositions from simple icons and images
- Arrow path format: "Hero > Header > Logo"
- Smart truncation for paths longer than 4 levels -- show first, "...", then last 2 (e.g., "Root > ... > Parent > Asset")
- Skip generic auto-generated layer names ("Frame 427", "Group 12") from the breadcrumb path -- only show intentionally named layers
- Add a "Location" column to the existing Assets table: File | Type | Location | Path
- Log a warning note in the brief when an asset is auto-detected as a composition (transparency for Claude Code / user review)
- No changes to existing SVG and PNG-fill export behavior -- composition detection is purely additive
- Outer composition wins for nested compositions -- if a composition contains another composition, export the outer one as a single PNG
- Existing asset types (simple SVG icons, INSTANCE nodes, image fills) remain untouched

### Claude's Discretion
- Exact child count threshold for composition detection (research typical Figma design patterns)
- Scan depth for detecting buried masks/blend modes
- Whether to cap PNG dimensions for very large compositions
- Exact generic name detection regex (what patterns count as "auto-named")

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ASSET-01 | Plugin detects complex compositions (nested groups/vectors with high child count, masks, blend modes) and flags them for image export | Composition detection heuristic using `blendMode`, `isMask`, child count, and nesting depth signals from raw Figma API data. LayoutNode type needs extension to carry these signals. |
| ASSET-02 | Plugin exports detected complex compositions as single PNG images instead of describing their individual parts | Use existing `fetchImages()` with format `'png'` and scale `2` for composition nodes. Composition entries use `exportType: 'png-render'`. Separate API batch call from SVG renders. |
| ASSET-03 | Brief maps each exported asset to its exact position in the layout tree via breadcrumb paths (e.g., "Hero > Header > Icon") | Build a `nodeId -> breadcrumb` map by walking the `rootNodes` tree. Arrow format with smart truncation and generic name filtering. Add Location column to Assets table. |
| ASSET-04 | Asset-to-layout mapping uses nodeId as stable key to prevent filename/path misalignment | Extend `ExportResult.assets` to carry `nodeId` alongside `filename` and `path`. Use `nodeId` as the join key between asset entries and the breadcrumb map. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @figma/rest-api-spec | latest | Figma API type definitions (BlendMode, HasMaskTrait) | Already in project; provides official types for blendMode and isMask |
| vitest | latest | Test framework | Already in project; all existing tests use vitest |

### Supporting
No new libraries needed. All functionality is built from existing project primitives:
- `fetchImages()` from `src/figma-api.ts` -- already supports PNG at 2x scale
- `sanitizeFilename()` and `resolveCollisions()` from `src/assets/sanitize.ts`
- `LayoutNode` from `src/layout/types.ts` -- the tree structure to walk

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom heuristic | ML-based detection | Massive complexity for marginal gain; heuristic is tunable and transparent |
| Walking LayoutNode for signals | Walking raw Figma nodes | LayoutNode is already normalized; need to add blendMode/isMask during normalization |

**Installation:**
No new packages needed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/
│   ├── identify.ts          # Add composition detection pre-pass
│   ├── detect-composition.ts # NEW: Pure composition heuristic function
│   ├── breadcrumb.ts         # NEW: Pure breadcrumb path builder
│   ├── export.ts             # Add png-render batch + pass nodeId through
│   ├── types.ts              # Extend AssetEntry, ExportResult
│   ├── sanitize.ts           # Unchanged
│   └── download.ts           # Unchanged
├── layout/
│   ├── types.ts              # Add blendMode, isMask to LayoutNode
│   └── normalize.ts          # Capture blendMode, isMask from raw nodes
├── brief/
│   └── generate.ts           # Extend buildAssetsSection with Type + Location
└── views/
    └── MainView.tsx          # Pass rootNodes to generateBrief for breadcrumbs
```

### Pattern 1: Composition Detection as Pure Pre-Pass
**What:** A pure function `detectCompositions(rootNodes: LayoutNode[])` that walks the tree and returns a `Set<string>` of nodeIds flagged as compositions. This set is consumed by `identifyAssets()` to classify those nodes as `'png-render'` instead of recursing into their children.
**When to use:** Before asset identification, after layout normalization.
**Why:** Keeps detection logic isolated, testable, and independent of the export pipeline. The identify function stays focused on classification.
**Example:**
```typescript
// src/assets/detect-composition.ts
export interface CompositionDetectionResult {
  compositionNodeIds: Set<string>;
  warnings: string[]; // "Auto-detected Hero Illustration as composition"
}

export function detectCompositions(rootNodes: LayoutNode[]): CompositionDetectionResult {
  const compositionNodeIds = new Set<string>();
  const warnings: string[] = [];

  for (const root of rootNodes) {
    if (!root.children) continue;
    for (const child of root.children) {
      detectInNode(child, compositionNodeIds, warnings);
    }
  }

  return { compositionNodeIds, warnings };
}

function detectInNode(
  node: LayoutNode,
  compositions: Set<string>,
  warnings: string[],
): void {
  // Per-child detection: evaluate each child independently
  if (isComposition(node)) {
    compositions.add(node.id);
    warnings.push(`Auto-detected "${node.name}" as a composition`);
    return; // Outer composition wins -- don't look deeper
  }

  // Recurse into container children
  if (node.children) {
    for (const child of node.children) {
      detectInNode(child, compositions, warnings);
    }
  }
}
```

### Pattern 2: Heuristic Combination for Composition Detection
**What:** A node is flagged as a composition only when it has BOTH structural AND visual effect signals. This reduces false positives compared to single-signal detection.
**When to use:** Inside the `isComposition()` function.
**Example:**
```typescript
// Structural signals (at least one required)
const CHILD_COUNT_THRESHOLD = 5; // Claude's discretion -- see research below
const NESTING_DEPTH_THRESHOLD = 3;

function hasStructuralComplexity(node: LayoutNode): boolean {
  const childCount = countDescendants(node);
  if (childCount >= CHILD_COUNT_THRESHOLD) return true;
  if (node.type === 'BOOLEAN_OPERATION') return true;
  if (getMaxDepth(node) >= NESTING_DEPTH_THRESHOLD) return true;
  return false;
}

// Visual effect signals (at least one required)
function hasVisualEffects(node: LayoutNode): boolean {
  if (hasNonNormalBlendMode(node)) return true;
  if (hasMaskChild(node)) return true;
  if (hasOpacityLayering(node)) return true;
  return false;
}

function isComposition(node: LayoutNode): boolean {
  // Must have BOTH structural AND visual complexity
  return hasStructuralComplexity(node) && hasVisualEffects(node);
}
```

### Pattern 3: Breadcrumb Path Builder as Pure Function
**What:** Build a `Map<string, string>` of `nodeId -> breadcrumb` by walking the layout tree once.
**When to use:** After asset identification, before brief generation.
**Example:**
```typescript
// src/assets/breadcrumb.ts
const GENERIC_NAME_PATTERN = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance)\s*\d*$/i;

export function buildBreadcrumbMap(rootNodes: LayoutNode[]): Map<string, string> {
  const map = new Map<string, string>();

  for (const root of rootNodes) {
    const pathParts = isGenericName(root.name) ? [] : [root.name];
    walkForBreadcrumbs(root, pathParts, map);
  }

  return map;
}

function walkForBreadcrumbs(
  node: LayoutNode,
  ancestorPath: string[],
  map: Map<string, string>,
): void {
  // Record this node's breadcrumb
  map.set(node.id, formatBreadcrumb(ancestorPath));

  if (!node.children) return;

  for (const child of node.children) {
    const childPath = isGenericName(child.name)
      ? ancestorPath  // Skip generic names
      : [...ancestorPath, child.name];
    walkForBreadcrumbs(child, childPath, map);
  }
}

function formatBreadcrumb(parts: string[]): string {
  if (parts.length === 0) return '';
  if (parts.length <= 4) return parts.join(' > ');
  // Smart truncation: first + "..." + last 2
  return `${parts[0]} > ... > ${parts[parts.length - 2]} > ${parts[parts.length - 1]}`;
}

function isGenericName(name: string): boolean {
  return GENERIC_NAME_PATTERN.test(name);
}
```

### Pattern 4: Extended ExportResult with Asset Metadata
**What:** Extend `ExportResult.assets` to carry `nodeId` and `assetType` so the brief generator can look up breadcrumbs and display type labels.
**Example:**
```typescript
// In src/assets/types.ts
export interface ExportResult {
  previewPath: string;
  assets: {
    filename: string;
    path: string;
    nodeId: string;              // NEW: stable key for breadcrumb lookup
    assetType: 'icon' | 'image' | 'composition';  // NEW: for Type column
  }[];
  warnings: string[];
}
```

### Anti-Patterns to Avoid
- **Modifying the LayoutNode tree during detection:** Detection should produce a `Set<string>` of IDs, not mutate the tree. The tree is shared with token extraction and brief generation.
- **Detecting compositions too eagerly:** A GROUP with 3 VECTORs (simple icon) should NOT be flagged. Require both structural AND visual signals.
- **Recursing into detected compositions:** Once a node is flagged as a composition, do NOT recurse into its children for asset detection. The outer composition wins.
- **Breaking existing SVG/png-fill pipeline:** Composition detection is additive. The `classifyNode()` function should check the composition set FIRST and short-circuit if matched, before falling through to existing SVG/image classification.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Filename sanitization | Custom regex | `sanitizeFilename()` from `src/assets/sanitize.ts` | Already handles slashes, whitespace, special chars, collapse, fallback |
| Collision resolution | Manual suffix logic | `resolveCollisions()` from `src/assets/sanitize.ts` | Already handles duplicate filenames with numeric suffixes |
| PNG rendering | Custom image processing | `fetchImages(shell, token, fileKey, nodeIds, 'png', 2)` from `src/figma-api.ts` | Already batches node IDs and handles error responses |
| Node tree walking | Separate recursion logic | Follow existing `classifyNode()` pattern from `src/assets/identify.ts` | Consistent depth control, same recursion boundaries |

**Key insight:** This phase adds new detection logic and extends existing data flow, but almost all infrastructure (API calls, file download, filename handling, brief table rendering) already exists. The main work is the heuristic itself and the data plumbing to carry composition flags and breadcrumbs through the pipeline.

## Common Pitfalls

### Pitfall 1: False Positive Compositions
**What goes wrong:** Simple icon groups (3 vectors making an arrow) get flagged as compositions and exported as blurry PNGs instead of crisp SVGs.
**Why it happens:** Child count threshold too low, or only checking structural signals without requiring visual effects.
**How to avoid:** Require BOTH structural complexity (child count >= threshold, deep nesting, BOOLEAN_OPERATION) AND visual effects (non-normal blendMode, isMask, opacity layering). Start with a conservative threshold (e.g., 5+ direct children) and validate against real designs.
**Warning signs:** SVG icon assets disappearing from output, PNG count increasing unexpectedly.

### Pitfall 2: Missing blendMode/isMask Data on LayoutNode
**What goes wrong:** Detection heuristic can't check visual effects because `normalizeNode()` doesn't capture `blendMode` or `isMask` from the raw Figma API response.
**Why it happens:** These properties were not needed for previous phases, so they were never added to `LayoutNode`.
**How to avoid:** Add `blendMode?: string` and `isMask?: boolean` to `LayoutNode` interface and capture them in `normalizeNode()` alongside existing style data (fills, strokes, effects, opacity).
**Warning signs:** `node.blendMode` is always undefined in detection code.

### Pitfall 3: Figma API Cannot Mix SVG and PNG in One Call
**What goes wrong:** Attempting to batch SVG and PNG renders in a single `/v1/images` call fails or returns wrong format.
**Why it happens:** The `format` parameter is per-request, not per-node. One call = one format.
**How to avoid:** Make separate API calls: one for SVG renders (existing), one for composition PNG renders (new). This follows the existing pattern of separate calls for SVG, image fills, and preview.
**Warning signs:** Composition entries in the download list have SVG URLs instead of PNG URLs.

### Pitfall 4: ExportResult.assets Losing nodeId
**What goes wrong:** Breadcrumb mapping fails because `ExportResult.assets` only carries `{ filename, path }` -- no `nodeId` to join with the breadcrumb map.
**Why it happens:** The `downloadAllAssets()` function strips metadata and only returns filename + path.
**How to avoid:** Thread `nodeId` and `assetType` through the download pipeline. Either extend the download list to carry metadata, or build a `filename -> nodeId` lookup from `AssetEntry[]` after download.
**Warning signs:** Location column in brief is empty or shows "unknown".

### Pitfall 5: Nested Composition Double-Export
**What goes wrong:** An illustration inside a hero section both get flagged as compositions, causing the inner illustration to be exported twice (once as itself, once as part of the hero).
**Why it happens:** Detection recurses into children of a node that was already flagged.
**How to avoid:** "Outer composition wins" rule: once a node is flagged, do not recurse into its children for further composition detection. The `detectInNode()` function should return immediately after flagging.
**Warning signs:** Duplicate assets in output, nested composition PNGs that contain other exported PNGs.

### Pitfall 6: Generic Name Regex Too Aggressive
**What goes wrong:** Intentionally named layers like "Frame Header" or "Group Actions" get stripped from breadcrumbs.
**Why it happens:** Regex matches the prefix without requiring a trailing number.
**How to avoid:** Pattern should match ONLY `Type + optional space + digits`: `/^(Frame|Group|Rectangle|Ellipse|Vector|Section)\s*\d+$/i`. Layers named just "Frame" (no number) are likely auto-generated too, but "Frame Header" is not.
**Warning signs:** Breadcrumb paths that are too short or empty for obviously named layers.

## Code Examples

### Extending LayoutNode for Composition Signals
```typescript
// In src/layout/types.ts -- add to LayoutNode interface
export interface LayoutNode {
  // ... existing fields ...

  /** Node-level blend mode (for composition detection) */
  blendMode?: string;
  /** Whether this node is a mask (for composition detection) */
  isMask?: boolean;
}
```

### Capturing Composition Signals in Normalization
```typescript
// In src/layout/normalize.ts -- add to normalizeNode() after existing style capture
if ('blendMode' in node && node.blendMode && node.blendMode !== 'PASS_THROUGH' && node.blendMode !== 'NORMAL') {
  result.blendMode = node.blendMode;
}
if ('isMask' in node && node.isMask === true) {
  result.isMask = true;
}
```

### Composition Detection Integration with identifyAssets
```typescript
// In src/assets/identify.ts -- modified classifyNode
function classifyNode(
  child: LayoutNode,
  imageFillMap: Map<string, string>,
  matchedNodeIds: Set<string>,
  entries: AssetEntry[],
  compositionIds: Set<string>,  // NEW parameter
): void {
  // Composition check FIRST -- before any other classification
  if (compositionIds.has(child.id)) {
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'png-render',
      filename: sanitizeFilename(child.name) + '.png',
    });
    return; // Do NOT recurse into children
  }

  // ... existing classification logic unchanged ...
}
```

### PNG-Render Batch in Export Pipeline
```typescript
// In src/assets/export.ts -- add after SVG batch (step 3b)

// 3d. Composition PNG render URLs (separate API call -- format is per-request)
const pngRenderEntries = assetEntries.filter(a => a.exportType === 'png-render');
let pngRenderUrls: Record<string, string | null> = {};
if (pngRenderEntries.length > 0) {
  try {
    pngRenderUrls = await fetchImages(
      shell, token, fileKey,
      pngRenderEntries.map(a => a.nodeId),
      'png', 2  // 2x scale, consistent with preview
    );
  } catch (err: any) {
    warnings.push(`Composition PNG render API failed: ${err?.message || 'Unknown error'}`);
  }
}

// Add to download list
for (const entry of pngRenderEntries) {
  const url = pngRenderUrls[entry.nodeId];
  if (url) {
    downloadList.push({ filename: entry.filename, url });
  } else {
    warnings.push(`No render URL for composition ${entry.filename} (node ${entry.nodeId})`);
  }
}
```

### Extended Assets Table in Brief
```typescript
// In src/brief/generate.ts -- modified buildAssetsSection
function buildAssetsSection(
  previewPath: string,
  assets: ExportResult['assets'],  // Now includes nodeId and assetType
  projectPath: string,
  breadcrumbMap: Map<string, string>,  // NEW parameter
): string {
  if (!previewPath && assets.length === 0) return '';

  const rows: string[] = [];

  if (previewPath) {
    const relPreview = toRelativePath(previewPath, projectPath);
    const filename = relPreview.split('/').pop() ?? relPreview;
    rows.push(`| ${filename} | Preview | -- | ${relPreview} |`);
  }

  for (const asset of assets) {
    const relPath = toRelativePath(asset.path, projectPath);
    const typeLabel = asset.assetType === 'composition' ? 'Composition'
      : asset.assetType === 'image' ? 'Image'
      : 'Icon';
    const location = breadcrumbMap.get(asset.nodeId) || '--';
    rows.push(`| ${asset.filename} | ${typeLabel} | ${location} | ${relPath} |`);
  }

  return [
    '## Assets',
    '',
    '| File | Type | Location | Path |',
    '|------|------|----------|------|',
    ...rows,
  ].join('\n');
}
```

## Discretion Recommendations

### Child Count Threshold: 5 direct children
**Reasoning:** Common Figma icon patterns use 2-4 vector shapes (arrow: 2, hamburger: 3, close: 2). A threshold of 5 avoids false positives on simple icons. Illustrations typically have 8-20+ direct vector/shape children within their groups. Starting at 5 is conservative; can be tuned later based on real-world testing.
**Confidence:** MEDIUM -- needs validation against real v1.0 failure cases as noted in STATE.md.

### Scan Depth: 3 levels deep for visual effect signals
**Reasoning:** Masks and blend modes in compositions are often on direct children or grandchildren of the composition root. Scanning deeper than 3 levels adds diminishing value while increasing false positive risk. The structural signal (child count) is checked on direct children only; visual signals (blendMode, isMask) are checked recursively up to 3 levels.
**Confidence:** MEDIUM -- depth vs. accuracy tradeoff needs real-world validation.

### PNG Dimension Cap: 4096x4096 (Figma API limit)
**Reasoning:** The Figma API itself caps exports at 32 megapixels (approximately 5657x5657 at 1x). At 2x scale, nodes larger than ~2828x2828 pixels may be downscaled by the API. No additional capping needed beyond what Figma enforces. The export pipeline should log a warning if a composition's dimensions exceed 2000x2000 at 1x (indicating it may be a full-page composition rather than a contained illustration).
**Confidence:** HIGH -- based on official Figma API documentation.

### Generic Name Detection Regex
**Reasoning:** Figma auto-generates names in the format "Type NNN" where Type is the node type and NNN is an incrementing number. The regex should match:
- `Frame 427`, `Group 12`, `Rectangle 3`, `Ellipse 1`, `Vector 55`, `Section 2`
- Also match bare type names without numbers: `Frame`, `Group` (default names before user edits)
- Do NOT match: `Frame Header`, `Group Actions`, `Hero Section` (intentionally named)

```typescript
const GENERIC_NAME_PATTERN = /^(Frame|Group|Rectangle|Ellipse|Vector|Section|Instance|Line|Star|Polygon)\s*\d*$/i;
```

**Confidence:** HIGH -- based on observed Figma naming conventions.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| All vectors exported as individual SVGs | Composition detection exports complex groups as single PNGs | Phase 7 | Complex illustrations render correctly in builds |
| Flat asset table (File, Type, Path) | Asset table with Location breadcrumbs | Phase 7 | Claude Code knows where each asset belongs in the layout |
| ExportResult.assets = { filename, path } | ExportResult.assets = { filename, path, nodeId, assetType } | Phase 7 | Stable join key for asset-to-layout mapping |

**Deprecated/outdated:**
- None -- this is new functionality building on the existing pipeline.

## Open Questions

1. **Threshold Validation Against Real Designs**
   - What we know: Child count threshold of 5 and nesting depth of 3 are reasonable based on common Figma patterns.
   - What's unclear: Whether these thresholds correctly classify the specific v1.0 failure cases (complex illustrations that were described textually). STATE.md explicitly calls this out as a concern.
   - Recommendation: Implement with configurable constants (exported for tests), validate against real extraction outputs, adjust if needed. The heuristic is pure and testable, so tuning is low-risk.

2. **BOOLEAN_OPERATION as Structural Signal**
   - What we know: BOOLEAN_OPERATION nodes are currently treated as leaf nodes in normalization. They represent union/subtract/intersect operations on shapes.
   - What's unclear: Whether a standalone BOOLEAN_OPERATION (without other signals) should count as a composition. Currently it is exported as SVG.
   - Recommendation: Only flag BOOLEAN_OPERATION as structural signal when combined with visual effects (per the locked heuristic combination approach). Standalone BOOLEAN_OPERATIONs remain SVG exports.

## Sources

### Primary (HIGH confidence)
- `@figma/rest-api-spec` types -- BlendMode enum (20 values), HasMaskTrait (isMask, maskType), HasBlendModeAndOpacityTrait
- Official Figma REST API docs (https://developers.figma.com/docs/rest-api/file-endpoints/) -- `/v1/images` endpoint: single format per request, scale 0.01-4, 32MP limit, 30-day URL expiry
- Existing codebase: `src/assets/identify.ts`, `src/assets/export.ts`, `src/assets/types.ts`, `src/layout/types.ts`, `src/layout/normalize.ts`, `src/brief/generate.ts`

### Secondary (MEDIUM confidence)
- Child count threshold of 5 -- based on common Figma design patterns (icons: 2-4 shapes, illustrations: 8-20+ shapes). Not validated against project-specific failure cases.
- Generic name regex -- based on observed Figma auto-naming conventions.

### Tertiary (LOW confidence)
- Scan depth of 3 levels -- reasonable heuristic but not validated against real complex illustrations. May need adjustment.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries needed, all infrastructure exists
- Architecture: HIGH -- pure function composition detection, established patterns, clear integration points
- Pitfalls: HIGH -- identified from codebase analysis and Figma API constraints
- Heuristic thresholds: MEDIUM -- need validation against real designs

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable -- Figma API and project codebase unlikely to change significantly)
