# Phase 24: Detection Foundation - Research

**Researched:** 2026-03-01
**Domain:** Figma tree traversal, asset detection, format inference
**Confidence:** HIGH

## Summary

Phase 24 implements a pure function that walks a raw Figma API node tree, finds layers whose names start with `@S-` (case-insensitive), determines whether each should export as PNG or SVG based on descendant content, and returns a typed array of `DetectedAsset` objects with clean filenames and node IDs.

The existing codebase already has all the building blocks: `sanitizeFilename` for name cleaning, `resolveFilenameCollision` for deduplication, tree-walking patterns in `normalizeNode`, and image-fill detection logic in `collectTokens`. The new `detect.ts` module composes these into a focused tree scanner. No new dependencies are needed -- this is pure TypeScript with Vitest tests.

**Primary recommendation:** Build `src/assets/detect.ts` as a single pure function `detectAssets(rootNode: any): DetectedAsset[]` that recursively walks the raw Figma tree, collecting `@S-`-prefixed layers with format auto-detection and filename sanitization. Reuse `sanitizeFilename` and `resolveFilenameCollision` directly. Test with inline fixture objects (no fixtures directory needed).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Full recursive descendant walk to determine format -- if ANY descendant has an image fill, export as PNG; otherwise SVG
- Walk enters INSTANCE subtrees the same as any other node -- instances are not opaque
- PNG wins in mixed cases (image fill + vector content) -- safe default since PNG captures everything
- Outermost @S- layer only -- when `@S-hero` contains `@S-icon`, only `@S-hero` is detected; inner `@S-icon` is part of the parent export
- Hidden layers (visible=false) with @S- prefix are skipped entirely
- @S- layers inside non-@S- INSTANCE nodes ARE detected -- the walk enters all subtrees
- Deduplicate by sanitized filename -- if 3 instances each contain `@S-icon`, produce one `icon.svg` not three numbered copies (matches Phase 9 SVG dedup pattern)
- New standalone `DetectedAsset` type -- does not extend ManualAsset or AssetEntry
- Fields: nodeId, nodeName, filename, format, plus position metadata for layout tree mapping (DETECT-05)
- Module location: `src/assets/detect.ts` with `detect.test.ts` alongside
- Input: raw Figma API node (untyped `any`) -- detector handles its own type narrowing internally
- Case-insensitive prefix matching: `@S-`, `@s-`, any casing variant
- Strict dash required: only `@S-` (with dash) triggers detection; `@S hero` or `@Shero` are ignored
- Empty name after prefix (`@S-` with nothing after) is skipped with a warning
- Filenames lowercased through existing `sanitizeFilename` -- `@S-HeroImage` becomes `hero-image.png`
- Duplicate filenames auto-numbered using existing `resolveFilenameCollision` (after dedup pass)

### Claude's Discretion
- TEXT-only layer default format (PNG vs SVG)
- Exact position metadata shape (breadcrumb path, parent chain, or just depth)
- Internal type narrowing approach for raw Figma nodes
- Test fixture design and edge case coverage depth

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DETECT-01 | Plugin scans the raw Figma tree for layers whose name starts with `@S-` (case-insensitive) | Regex `/^@s-/i` on node.name; recursive walk pattern from normalizeNode; walk enters all children including INSTANCE subtrees |
| DETECT-02 | Layers containing image fills (direct or in descendants) are exported as PNG | `hasImageFill()` helper checks `paint.type === 'IMAGE'` in node.fills array; recursive descent through all children to find any IMAGE fill |
| DETECT-03 | Layers with only vector/text content are exported as SVG | Default format is SVG; only overridden to PNG when `hasImageFill` returns true for the subtree |
| DETECT-04 | `@S-` prefix is stripped from filenames (e.g. `@S-hero` -> `hero.png`) | Strip prefix BEFORE calling `sanitizeFilename()` (STATE.md decision) to avoid `s-hero` output; use `name.replace(/^@s-/i, '')` |
| DETECT-05 | Detected assets are mapped to their position in the layout tree | Position metadata on DetectedAsset: depth + parent chain or breadcrumb path; node ID enables downstream cross-referencing in layout tree |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ^5.6.0 | Type-safe implementation | Already in project |
| Vitest | latest | Unit testing | Already in project, used by all existing test files |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `sanitizeFilename` | (internal) | Name cleaning | Strip @S-, then sanitize to filesystem-safe name |
| `resolveFilenameCollision` | (internal) | Dedup collisions | After dedup pass, number remaining collisions |
| `GENERIC_NAME_PATTERN` | (internal) | Warning on auto-names | Warn when @S- layer has generic Figma name after prefix strip |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Untyped `any` input | `@figma/rest-api-spec` Node type | Typed input would be safer but adds coupling; CONTEXT.md locks `any` input with internal narrowing |
| Custom filename logic | Existing `sanitizeFilename` | No reason to hand-roll; existing function handles all edge cases |

**Installation:**
```bash
# No new packages needed -- all tools already in the project
```

## Architecture Patterns

### Recommended Project Structure
```
src/assets/
├── detect.ts          # NEW: detectAssets() pure function
├── detect.test.ts     # NEW: unit tests with inline fixtures
├── types.ts           # MODIFIED: add DetectedAsset type
├── sanitize.ts        # REUSED: sanitizeFilename()
├── resolve.ts         # REUSED: resolveFilenameCollision()
├── breadcrumb.ts      # REUSED: GENERIC_NAME_PATTERN
├── export.ts          # NOT MODIFIED (Phase 25)
└── download.ts        # NOT MODIFIED
```

### Pattern 1: Two-Phase Tree Walk (Detect then Deduplicate)
**What:** The detection function performs two distinct passes: (1) walk the tree collecting raw matches, (2) deduplicate and resolve filenames.
**When to use:** When tree walking and post-processing have different concerns.
**Example:**
```typescript
// Phase 1: Walk tree, collect raw detections
interface RawDetection {
  nodeId: string;
  nodeName: string;
  nameAfterPrefix: string;  // @S- stripped
  format: 'png' | 'svg';
  depth: number;
  parentPath: string[];      // ancestor names for position metadata
}

function walkForAssets(
  node: any,
  depth: number,
  parentPath: string[],
  insideDetected: boolean,  // tracks nesting to prevent double-detection
  results: RawDetection[],
): void {
  // Skip hidden layers entirely
  if (node.visible === false) return;

  const isDetected = isAssetMarker(node.name);

  if (isDetected && !insideDetected) {
    const nameAfterPrefix = stripAssetPrefix(node.name);
    if (nameAfterPrefix) {  // skip empty names after prefix
      const format = subtreeHasImageFill(node) ? 'png' : 'svg';
      results.push({
        nodeId: node.id,
        nodeName: node.name,
        nameAfterPrefix,
        format,
        depth,
        parentPath: [...parentPath],
      });
    }
    // Mark children as "inside detected" to prevent double-detection
    insideDetected = true;
  }

  // Recurse into children (including INSTANCE children)
  if (node.children && Array.isArray(node.children)) {
    const nextPath = [...parentPath, node.name];
    for (const child of node.children) {
      walkForAssets(child, depth + 1, nextPath, insideDetected, results);
    }
  }
}

// Phase 2: Deduplicate by filename, then resolve remaining collisions
function deduplicateAndResolve(raws: RawDetection[]): DetectedAsset[] {
  // Group by sanitized filename for dedup
  const groups = new Map<string, RawDetection>();
  const warnings: string[] = [];

  for (const raw of raws) {
    const baseName = sanitizeFilename(raw.nameAfterPrefix);
    const candidateFilename = `${baseName}.${raw.format}`;

    if (!groups.has(candidateFilename)) {
      groups.set(candidateFilename, raw);
    }
    // Duplicates silently dropped (dedup by filename, per Phase 9 pattern)
  }

  // Resolve any remaining collisions (e.g., "icon.png" and "icon.svg" are fine,
  // but same-extension collisions from different original names need numbering)
  const filenames: string[] = [];
  const results: DetectedAsset[] = [];

  for (const [candidateFilename, raw] of groups) {
    const filename = resolveFilenameCollision(candidateFilename, filenames);
    filenames.push(filename);
    results.push({
      nodeId: raw.nodeId,
      nodeName: raw.nodeName,
      filename,
      format: raw.format,
      depth: raw.depth,
      parentPath: raw.parentPath,
    });
  }

  return results;
}
```

### Pattern 2: Image Fill Detection via Recursive Descent
**What:** Check if any node in a subtree has a fill with `type === 'IMAGE'`.
**When to use:** Determining PNG vs SVG format for a detected @S- layer.
**Example:**
```typescript
// Source: Figma REST API spec -- ImagePaint has type: 'IMAGE' and imageRef: string
// Matches pattern in src/tokens/collect.ts line 147
function subtreeHasImageFill(node: any): boolean {
  // Check this node's fills
  if (node.fills && Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.visible !== false && fill.type === 'IMAGE') {
        return true;
      }
    }
  }

  // Recurse into children (enters INSTANCE subtrees per user decision)
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (subtreeHasImageFill(child)) return true;
    }
  }

  return false;
}
```

### Pattern 3: Prefix Matching with Strict Dash Requirement
**What:** Case-insensitive `@S-` detection with strict dash.
**When to use:** Identifying asset-marked layers.
**Example:**
```typescript
const ASSET_PREFIX_REGEX = /^@s-/i;

function isAssetMarker(name: string): boolean {
  return ASSET_PREFIX_REGEX.test(name);
}

function stripAssetPrefix(name: string): string {
  return name.replace(ASSET_PREFIX_REGEX, '');
}
```

### Anti-Patterns to Avoid
- **Entering detected subtrees for more detections:** When `@S-hero` contains `@S-icon`, only `@S-hero` is detected. The `insideDetected` flag prevents the walker from collecting nested @S- layers.
- **Running sanitizeFilename on the full name including @S-:** The `@` gets stripped by the sanitizer, leaving `s-hero` instead of `hero`. Always strip the prefix first, then sanitize.
- **Checking only direct fills for IMAGE type:** Must recursively check ALL descendants. A FRAME marked `@S-hero` might have a child RECTANGLE with an IMAGE fill -- that still means PNG.
- **Treating INSTANCE children as opaque:** Unlike the layout normalizer (which treats INSTANCE as a leaf), the detector must walk into INSTANCE children to check for image fills.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Filename sanitization | Custom regex chain | `sanitizeFilename()` from `src/assets/sanitize.ts` | Already handles edge cases: slashes, special chars, empty strings, collapsing hyphens |
| Filename collision | Counter logic | `resolveFilenameCollision()` from `src/assets/resolve.ts` | Already handles extension-aware numbering |
| Generic name detection | Custom pattern | `GENERIC_NAME_PATTERN` from `src/assets/breadcrumb.ts` | Already matches "Frame 427", "Group", "Vector 55" etc. |

**Key insight:** The existing codebase has mature, tested utilities for all the string operations needed. The new module's value is in the tree-walking and format-detection logic, not filename handling.

## Common Pitfalls

### Pitfall 1: @S- Prefix Not Stripped Before sanitizeFilename
**What goes wrong:** `sanitizeFilename('@S-hero')` produces `s-hero` because `@` is stripped by the `[^a-z0-9-]` regex, leaving `s-hero`.
**Why it happens:** Natural instinct is to pass the full name to sanitize. But `@` is not alphanumeric.
**How to avoid:** Always call `name.replace(/^@s-/i, '')` BEFORE `sanitizeFilename()`. This is also documented in STATE.md as a project decision.
**Warning signs:** Filenames starting with `s-` in test output.

### Pitfall 2: Double-Detection of Nested @S- Layers
**What goes wrong:** `@S-hero` contains `@S-icon`. Both are returned as separate assets, but the inner one is already part of the outer export.
**Why it happens:** Naive recursive walk doesn't track "am I already inside a detected subtree?"
**How to avoid:** Pass an `insideDetected` boolean through recursion. Once an @S- layer is found, all descendants are marked as inside and won't trigger new detections.
**Warning signs:** Asset list contains items that are visually nested inside other exported assets.

### Pitfall 3: Missing Image Fills in INSTANCE Children
**What goes wrong:** A FRAME `@S-hero` contains an INSTANCE that has a child RECTANGLE with an IMAGE fill. The detector reports SVG because it didn't walk into the INSTANCE's children.
**Why it happens:** The layout normalizer treats INSTANCE as a leaf (returns early without recursing). If the detector copies that pattern, it misses image fills inside instances.
**How to avoid:** The format detection walk (`subtreeHasImageFill`) must NOT short-circuit at INSTANCE nodes. It must walk into their children, which are available in the raw Figma API response.
**Warning signs:** Assets with photos exported as SVG.

### Pitfall 4: Visible Property Default
**What goes wrong:** A visible layer is incorrectly skipped because `node.visible` is `undefined` (not `false`).
**Why it happens:** In the Figma API, `visible` defaults to `true` when omitted. Only `visible === false` means hidden.
**How to avoid:** Check `node.visible === false` (strict equality), not `!node.visible`. The normalizer already uses this pattern: `visible: node.visible !== false`.
**Warning signs:** Missing assets that are clearly visible in the Figma design.

### Pitfall 5: Dedup vs Collision Resolution Confusion
**What goes wrong:** Three instances of `@S-icon` produce `icon.svg`, `icon-2.svg`, `icon-3.svg` instead of a single `icon.svg`.
**Why it happens:** Using collision resolution instead of deduplication. Dedup means "keep one, drop the rest". Collision resolution means "keep all, number them".
**How to avoid:** Two-step process: (1) Deduplicate by sanitized filename -- keep only the first occurrence. (2) Then run collision resolution on the deduplicated list for any remaining conflicts from different original names.
**Warning signs:** Numbered filenames for assets that should be identical.

### Pitfall 6: TEXT-Only Layers as SVG May Render Poorly
**What goes wrong:** A TEXT-only layer exported as SVG may lose font rendering fidelity if the font isn't available.
**Why it happens:** SVG text requires font availability. Figma's SVG export uses `svg_outline_text=true` (see `fetchImages` in `figma-api.ts`), which converts text to paths -- so this is actually safe for SVG.
**How to avoid:** Since the project uses `svg_outline_text=true`, SVG is safe for text-only layers. Recommend SVG as the default for TEXT-only layers (text outlines are vector paths, smaller file size than PNG).
**Warning signs:** None expected with outlined text.

## Code Examples

### DetectedAsset Type Definition
```typescript
// In src/assets/types.ts
/**
 * An asset detected by scanning the Figma tree for @S- prefixed layers.
 * Pure detection result -- no API calls, no export state.
 */
export interface DetectedAsset {
  /** Figma node ID (e.g., "12:34") for downstream API calls */
  nodeId: string;
  /** Original Figma layer name including @S- prefix */
  nodeName: string;
  /** Sanitized filename WITH extension (e.g., "hero.png") */
  filename: string;
  /** Auto-determined export format */
  format: 'png' | 'svg';
  /** Tree depth where the asset was found (0 = root) */
  depth: number;
  /** Ancestor layer names for layout tree position context (DETECT-05) */
  parentPath: string[];
}
```

### Main Detection Entry Point
```typescript
// In src/assets/detect.ts
import { sanitizeFilename } from './sanitize';
import { resolveFilenameCollision } from './resolve';
import type { DetectedAsset } from './types';

export interface DetectionResult {
  assets: DetectedAsset[];
  warnings: string[];
}

/**
 * Scan a raw Figma tree for @S- prefixed layers and return detected assets.
 *
 * Pure function: no side effects, no API calls. Suitable for unit testing
 * with inline fixture data.
 *
 * @param rootNode - Raw Figma API node (untyped)
 * @returns Detected assets with auto-determined formats and clean filenames
 */
export function detectAssets(rootNode: any): DetectionResult {
  const raws: RawDetection[] = [];
  const warnings: string[] = [];

  walkForAssets(rootNode, 0, [], false, raws, warnings);

  const assets = deduplicateAndResolve(raws);

  return { assets, warnings };
}
```

### Test Pattern (Inline Fixtures)
```typescript
// In src/assets/detect.test.ts
import { describe, it, expect } from 'vitest';
import { detectAssets } from './detect';

// Minimal fixture builder
function makeNode(overrides: Partial<any> = {}): any {
  return {
    id: '1:1',
    name: 'Frame',
    type: 'FRAME',
    visible: true,
    children: [],
    fills: [],
    ...overrides,
  };
}

function imageFill(): any {
  return { type: 'IMAGE', imageRef: 'img:abc', scaleMode: 'FILL', visible: true };
}

describe('detectAssets', () => {
  it('detects @S- prefixed layers', () => {
    const tree = makeNode({
      children: [
        makeNode({ id: '2:1', name: '@S-hero', children: [] }),
        makeNode({ id: '2:2', name: 'Regular Layer', children: [] }),
      ],
    });
    const { assets } = detectAssets(tree);
    expect(assets).toHaveLength(1);
    expect(assets[0].filename).toBe('hero.svg');
    expect(assets[0].nodeId).toBe('2:1');
  });

  it('detects PNG when subtree contains IMAGE fill', () => {
    const tree = makeNode({
      children: [
        makeNode({
          id: '2:1',
          name: '@S-hero',
          children: [
            makeNode({ id: '3:1', name: 'bg', fills: [imageFill()] }),
          ],
        }),
      ],
    });
    const { assets } = detectAssets(tree);
    expect(assets[0].format).toBe('png');
    expect(assets[0].filename).toBe('hero.png');
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual asset URL workflow | @S- prefix convention | v2.2 (this milestone) | Designers mark layers in Figma; plugin auto-detects |
| Type-based format suggestion (`suggestFormat`) | Content-based format detection (image fill walk) | v2.2 (this phase) | More accurate: a FRAME with an image fill exports as PNG regardless of node type |
| Extending ManualAsset | New DetectedAsset type | v2.2 (this phase) | Clean separation; ManualAsset carries UI state (status, error) that detection doesn't need |

**Deprecated/outdated:**
- `suggestFormat()` in `resolve.ts`: Type-based format suggestion. Still valid for manual asset workflow but NOT used by detection. Detection uses content-based (image fill) detection instead.
- `deriveAssetFromNode()` in `resolve.ts`: Manual asset derivation. Will be removed in Phase 26 (CLNP-02).

## Discretion Recommendations

### TEXT-only Layer Default Format
**Recommendation: SVG**

Rationale: The project's `fetchImages` call for SVG already uses `svg_outline_text=true` (line 198 of `figma-api.ts`), which converts text to vector paths. This means SVG export of text is visually accurate regardless of font availability, and produces smaller files than PNG. A TEXT-only @S- layer (e.g., `@S-tagline`) is likely a decorative text element that benefits from crisp vector rendering.

The format detection logic is: "if ANY descendant has IMAGE fill -> PNG, else -> SVG". TEXT nodes do not have IMAGE fills, so they naturally fall into SVG without special-casing.

### Position Metadata Shape
**Recommendation: `depth: number` + `parentPath: string[]`**

Rationale:
- `depth` (integer, 0 = root) enables quick hierarchy understanding
- `parentPath` (array of ancestor layer names) enables breadcrumb-style display like "Page > Hero Section > Content" and direct mapping to the layout tree
- Both are trivially computed during the walk (no extra passes needed)
- The breadcrumb module already exists (`src/assets/breadcrumb.ts`) but operates on LayoutNode, not raw nodes. Computing parentPath inline during the raw walk is simpler than converting to LayoutNode first.
- Node ID already provides the primary mapping key for layout tree cross-referencing (DETECT-05)

### Internal Type Narrowing
**Recommendation: Duck typing with property existence checks**

Rationale: The codebase already uses `any` for raw Figma nodes throughout (`normalizeNode`, `collectTokens`). The established pattern is duck typing:
```typescript
if (node.fills && Array.isArray(node.fills)) { ... }
if (node.children && Array.isArray(node.children)) { ... }
if (node.visible === false) { ... }
```
This is consistent, battle-tested in the existing code, and avoids coupling to `@figma/rest-api-spec` types.

### Test Fixture Design
**Recommendation: Inline builder functions, no fixture files**

Rationale: The existing test files (`sanitize.test.ts`, `resolve.test.ts`, `collect.test.ts`) all use inline data. A `makeNode()` builder with sensible defaults keeps tests readable and self-contained. Cover these edge cases at minimum:
1. Basic @S- detection (case variations)
2. PNG format when child has IMAGE fill
3. SVG format for vector-only subtree
4. Nested @S- (only outermost detected)
5. Hidden @S- layer skipped
6. Filename deduplication (3 instances -> 1 asset)
7. Empty name after prefix (warning generated)
8. @S- inside non-@S- INSTANCE (detected)
9. Strict dash requirement (`@Shero`, `@S hero` ignored)

## Open Questions

1. **Should warnings be emitted for duplicate-dropped assets?**
   - What we know: When 3 instances all contain `@S-icon`, we keep only one. The user never sees the duplicates.
   - What's unclear: Should the function emit a warning like "Deduplicated 2 copies of icon.svg" for debugging, or silently drop them?
   - Recommendation: Silent drop (matches Phase 9 SVG dedup behavior). Add a debug-level log if needed later.

2. **What about @S- on the root node itself?**
   - What we know: The root node passed to `detectAssets` is typically a FRAME or PAGE selected by the user.
   - What's unclear: If the root node itself has `@S-hero` as its name, should it be detected?
   - Recommendation: Yes, detect it. The function has no reason to treat the root differently. If `insideDetected` starts as `false`, the root can be detected.

## Sources

### Primary (HIGH confidence)
- `@figma/rest-api-spec` dist/api_types.ts -- ImagePaint type definition (`type: 'IMAGE'`, `imageRef: string`), IsLayerTrait (`visible?: boolean`), HasChildrenTrait, MinimalFillsTrait
- `src/assets/sanitize.ts` -- `sanitizeFilename()` implementation, behavior verified with test run
- `src/assets/resolve.ts` -- `resolveFilenameCollision()`, `VECTOR_NODE_TYPES`, `suggestFormat()`
- `src/assets/breadcrumb.ts` -- `GENERIC_NAME_PATTERN` regex
- `src/layout/normalize.ts` -- `normalizeNode()` tree-walking pattern, INSTANCE-as-leaf behavior
- `src/tokens/collect.ts` -- IMAGE fill detection pattern (line 147: `paint.type === 'IMAGE'`)
- `src/figma-api.ts` -- `svg_outline_text=true` in fetchImages SVG options (line 198)

### Secondary (MEDIUM confidence)
- STATE.md project decisions -- "@S- prefix stripped BEFORE sanitizeFilename()" (verified by test: `sanitizeFilename('@S-hero')` produces `s-hero`)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies; all tools already exist in the codebase
- Architecture: HIGH - Clear pattern from CONTEXT.md decisions; tree-walking well-established in normalizeNode
- Pitfalls: HIGH - Verified by reading actual code (sanitize behavior, normalizeNode INSTANCE handling, fill detection)

**Research date:** 2026-03-01
**Valid until:** 2026-03-31 (stable domain; Figma API types unlikely to change)
