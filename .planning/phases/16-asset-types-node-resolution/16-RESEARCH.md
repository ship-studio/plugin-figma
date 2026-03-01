# Phase 16: Asset Types & Node Resolution - Research

**Researched:** 2026-03-01
**Domain:** Figma REST API node resolution, TypeScript type design, filename sanitization
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- ManualAsset type shape: `format: 'png' | 'svg'` (two options only, no "auto"), `status: 'resolving' | 'valid' | 'error'`, stores both `nodeName` (display) and `filename` (sanitized filesystem name), filename mutable for Phase 19 edits
- Filename derivation: use existing `sanitizeFilename` (lowercase-hyphenated), leaf node name only, generic Figma auto-names produce a warning, collisions resolved at add-time (not export-time)
- Instance-child detection: soft rejection (don't add, show warning), client-side I-prefix check on node ID string before any API call
- Format suggestion: pre-selected based on node type from the resolve API call, user can override silently

### Claude's Discretion
- Which Figma node types map to SVG vs PNG suggestion
- Whether to parse I-prefix to extract and suggest parent instance ID, or use generic "select the parent" message
- Whether to add broader node ID format validation beyond I-prefix detection
- Internal type design details (optional fields, error message field, etc.)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAME-01 | Plugin auto-derives filenames from Figma layer names via API | Existing `fetchFileNodes` returns `document.name` + `document.type`; existing `sanitizeFilename` handles conversion; new `resolveNode` function composes them |
| NAME-02 | Duplicate filenames are auto-numbered (icon.png, icon-2.png) | Existing `resolveCollisions` works on `{ filename }[]` arrays; needs thin adapter from `ManualAsset[]` or a generalized version that accepts any `{ filename }` |
| AINP-05 | Plugin detects I-prefix instance-child node IDs and warns | I-prefix format is `I{parentId};{childId}` -- simple regex `/^I/` on the node ID string; parent ID extractable by splitting on `;` and stripping `I` prefix |
| AINP-06 | Plugin auto-suggests format based on node type (SVG for vector nodes, PNG for everything else) | Figma REST API returns `type` field on every node; vector primitives (VECTOR, LINE, STAR, ELLIPSE, REGULAR_POLYGON, BOOLEAN_OPERATION) map to SVG; everything else maps to PNG |
</phase_requirements>

## Summary

Phase 16 defines the `ManualAsset` type and builds the pure-function resolve/validate logic that converts a Figma node URL into a validated asset entry. The existing codebase already provides 80% of the building blocks: `parseFigmaUrl` extracts file key and node ID, `fetchFileNodes` retrieves node name and type from the API, `sanitizeFilename` converts layer names to filesystem-safe strings, and `resolveCollisions` handles duplicate numbering. The new work is:

1. A `ManualAsset` type definition with status tracking for the UI pipeline
2. A `resolveNode` function that calls `fetchFileNodes`, reads `document.name` and `document.type`, derives filename and format
3. An I-prefix detector that checks the node ID string client-side before any API call
4. A format suggestion map from Figma node types to `'svg' | 'png'`
5. Collision resolution adapted from the existing `resolveCollisions` to work with `ManualAsset[]`

**Primary recommendation:** Build a single `src/assets/resolve.ts` module containing the `ManualAsset` type (or put it in `src/assets/types.ts`), the resolve function, the I-prefix check, and the format suggestion map. Keep these as pure functions that the UI (Phase 19) will call.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ^5.6.0 | Type definitions and logic | Already in project |
| @figma/rest-api-spec | latest | Type-safe Figma API responses (`GetFileNodesResponse`, `Node`) | Already in project, provides `Node` union type with all node types |
| Vitest | latest | Unit tests | Already in project, used for all existing tests |

### Supporting
No new libraries needed. All functionality is built from existing project utilities and Figma API types.

### Alternatives Considered
None -- this phase uses only existing project infrastructure.

**Installation:**
No new packages required.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/
│   ├── types.ts          # Add ManualAsset type alongside existing AssetEntry
│   ├── resolve.ts         # NEW: resolveNode(), isInstanceChild(), suggestFormat()
│   ├── resolve.test.ts    # NEW: unit tests for resolve logic
│   ├── sanitize.ts        # EXISTING: sanitizeFilename(), resolveCollisions()
│   ├── sanitize.test.ts   # EXISTING: may need new tests for ManualAsset collision adapter
│   ├── breadcrumb.ts      # EXISTING: kept for Phase 18
│   ├── export.ts          # EXISTING: preview-only, Phase 17 will expand
│   └── download.ts        # EXISTING: unchanged
├── figma-api.ts           # EXISTING: fetchFileNodes already serves this phase
└── url-parser.ts          # EXISTING: parseFigmaUrl already serves this phase
```

### Pattern 1: ManualAsset Type Definition
**What:** A discriminated status type that tracks the lifecycle of a user-added asset
**When to use:** Whenever the UI or logic needs to know what state an asset is in
**Example:**
```typescript
// src/assets/types.ts

export interface ManualAsset {
  /** Figma node ID (e.g., "12:34") */
  nodeId: string;
  /** Original Figma layer name, for display */
  nodeName: string;
  /** Sanitized filename WITH extension (e.g., "hero-image.png") */
  filename: string;
  /** User-selected or auto-suggested format */
  format: 'png' | 'svg';
  /** Lifecycle status */
  status: 'resolving' | 'valid' | 'error';
  /** Error message when status is 'error' */
  error?: string;
  /** Warning message (e.g., "Auto-named: frame-427.png -- consider renaming") */
  warning?: string;
}
```

### Pattern 2: Node Resolution as Pure Function + API Call
**What:** Separate the API call from the pure derivation logic
**When to use:** Keeps resolve logic testable without mocking the API
**Example:**
```typescript
// src/assets/resolve.ts

/** Pure: derive ManualAsset fields from API response data */
export function deriveAssetFromNode(
  nodeId: string,
  nodeName: string,
  nodeType: string,
  existingAssets: ManualAsset[],
): ManualAsset {
  const format = suggestFormat(nodeType);
  const baseName = sanitizeFilename(nodeName);
  const filename = `${baseName}.${format}`;
  // Resolve collisions against existing list
  const finalFilename = resolveFilenameCollision(filename, existingAssets);
  const warning = isGenericFigmaName(nodeName)
    ? `Auto-named: ${finalFilename} -- consider renaming`
    : undefined;

  return {
    nodeId,
    nodeName,
    filename: finalFilename,
    format,
    status: 'valid',
    warning,
  };
}

/** Async: fetch node from API then derive asset */
export async function resolveNode(
  shell: Shell,
  token: string,
  fileKey: string,
  nodeId: string,
  existingAssets: ManualAsset[],
): Promise<ManualAsset> {
  const { rootNode } = await fetchFileNodes(shell, token, fileKey, nodeId);
  return deriveAssetFromNode(nodeId, rootNode.name, rootNode.type, existingAssets);
}
```

### Pattern 3: I-Prefix Detection with Parent ID Extraction
**What:** Client-side string check before any API call, with optional parent ID extraction
**When to use:** When user pastes a URL containing an instance-child node ID
**Example:**
```typescript
/** Check if a node ID is an instance-child (I-prefix format: "I{parentId};{childId}") */
export function isInstanceChildId(nodeId: string): boolean {
  return nodeId.startsWith('I');
}

/** Extract the parent instance ID from an I-prefix node ID */
export function extractParentInstanceId(nodeId: string): string | null {
  if (!isInstanceChildId(nodeId)) return null;
  // Format: "I{parentId};{childId}" e.g., "I20:1;20:2" -> "20:1"
  const withoutPrefix = nodeId.slice(1); // Remove "I"
  const semicolonIndex = withoutPrefix.indexOf(';');
  if (semicolonIndex === -1) return null;
  return withoutPrefix.slice(0, semicolonIndex);
}
```

### Pattern 4: Format Suggestion Map
**What:** Static mapping from Figma node type strings to suggested export format
**When to use:** After resolving a node, to pre-select the format
**Example:**
```typescript
/** Figma node types that are pure vector primitives -> suggest SVG */
const VECTOR_NODE_TYPES = new Set([
  'VECTOR',
  'LINE',
  'STAR',
  'ELLIPSE',
  'REGULAR_POLYGON',
  'BOOLEAN_OPERATION',
]);

export function suggestFormat(nodeType: string): 'png' | 'svg' {
  return VECTOR_NODE_TYPES.has(nodeType) ? 'svg' : 'png';
}
```

### Anti-Patterns to Avoid
- **Putting API logic in type definitions:** Keep `types.ts` for interfaces only. Resolution logic goes in `resolve.ts`.
- **Collision resolution at export time:** Per CONTEXT.md, collisions must be resolved at add-time so the user sees the final filename immediately. Never defer to export.
- **Using node type for validation:** Node type tells us SVG vs PNG suggestion, not whether the node is valid. A FRAME is perfectly valid to export as PNG.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Filename sanitization | Custom regex | Existing `sanitizeFilename()` in `src/assets/sanitize.ts` | Already tested with 10 test cases, handles edge cases (empty string, special chars, hyphens) |
| Filename collision resolution | Custom counter | Existing `resolveCollisions()` in `src/assets/sanitize.ts` | Already tested, handles -2/-3 suffix pattern with extension preservation |
| Figma URL parsing | Custom regex | Existing `parseFigmaUrl()` in `src/url-parser.ts` | Already tested with 11 test cases, handles all URL formats |
| Node fetching | Custom fetch | Existing `fetchFileNodes()` in `src/figma-api.ts` | Already handles API errors, URL encoding, key matching |
| Generic name detection | New regex | Existing `GENERIC_NAME_PATTERN` in `src/assets/breadcrumb.ts` | Already covers Frame, Group, Rectangle, Ellipse, Vector, Section, Instance, Line, Star, Polygon |

**Key insight:** Phase 16 is primarily a composition phase -- it wires together existing utilities behind a new type and a thin resolve layer. Very little new logic is needed.

## Common Pitfalls

### Pitfall 1: I-Prefix Check Must Happen on the Node ID, Not the URL
**What goes wrong:** Checking the URL string for "I" characters catches false positives (e.g., the file name "Icons" in the URL path).
**Why it happens:** The I-prefix is on the node ID after parsing, not in the raw URL.
**How to avoid:** First call `parseFigmaUrl()` to extract the node ID, then check the extracted node ID with `isInstanceChildId()`.
**Warning signs:** URLs with "I" in the file name path being rejected.

### Pitfall 2: Node ID Encoding Mismatch
**What goes wrong:** The URL parser converts dashes to colons (`0-1` -> `0:1`), but the I-prefix might contain semicolons which could be URL-encoded differently.
**Why it happens:** Figma uses multiple encoding schemes in URLs vs API responses.
**How to avoid:** The existing `parseFigmaUrl` already handles `%3A` -> `:` decoding. For I-prefix IDs, the semicolon appears as `;` in the decoded node ID. Work with the decoded node ID from `parseFigmaUrl`, not the raw URL.
**Warning signs:** Node IDs like `I20%3A1%3B20%3A2` not being decoded properly.

### Pitfall 3: Collision Resolution Must Consider the Full Existing List
**What goes wrong:** Only checking against other assets being added in the same batch, missing collisions with previously added assets.
**Why it happens:** The existing `resolveCollisions` operates on an array, but for add-time resolution we need to check against the existing list.
**How to avoid:** Pass the full `existingAssets` array to the collision resolver. The simplest approach: build a "would-be filename" and scan existing assets for matches, incrementing the suffix counter.
**Warning signs:** Duplicate filenames appearing in the asset list after multiple adds.

### Pitfall 4: `resolveCollisions` Shape Mismatch
**What goes wrong:** The existing `resolveCollisions` takes `AssetEntry[]` (with `exportType` field), but Phase 16 uses `ManualAsset[]` (with `format` field).
**Why it happens:** Type evolution between v1.x and v2.0.
**How to avoid:** Either (a) write a new `resolveManualCollision` function that takes a filename and a list of existing filenames, or (b) generalize `resolveCollisions` to accept any `{ filename: string }[]`. Option (a) is simpler since add-time resolution works one asset at a time, not in batch.
**Warning signs:** TypeScript compile errors when passing ManualAsset[] to resolveCollisions.

### Pitfall 5: Generic Name Warning Must Use the FINAL Filename (After Collision Resolution)
**What goes wrong:** Warning says "Auto-named: frame-427.png" but the actual filename is "frame-427-2.png" after collision resolution.
**Why it happens:** Warning generated before collision resolution runs.
**How to avoid:** Generate the warning string after collision resolution, using the final filename.
**Warning signs:** Warning text doesn't match the actual filename in the asset list.

## Code Examples

Verified patterns from the existing codebase:

### Resolving a Node via Existing API
```typescript
// Source: src/figma-api.ts (fetchFileNodes)
// Returns { rootNode, components, styles } where rootNode has .name and .type
const { rootNode } = await fetchFileNodes(shell, token, fileKey, nodeId);
const nodeName: string = rootNode.name; // e.g., "Hero Image"
const nodeType: string = rootNode.type; // e.g., "FRAME", "VECTOR", "INSTANCE"
```

### Sanitizing Filenames
```typescript
// Source: src/assets/sanitize.ts
import { sanitizeFilename } from './sanitize';

sanitizeFilename('Hero Image');     // "hero-image"
sanitizeFilename('Frame 427');      // "frame-427"
sanitizeFilename('Icon / Arrow');   // "icon-arrow"
sanitizeFilename('');               // "unnamed"
```

### Detecting Generic Figma Names
```typescript
// Source: src/assets/breadcrumb.ts (GENERIC_NAME_PATTERN)
import { GENERIC_NAME_PATTERN } from './breadcrumb';

GENERIC_NAME_PATTERN.test('Frame 427');     // true
GENERIC_NAME_PATTERN.test('Vector 12');     // true
GENERIC_NAME_PATTERN.test('Hero Section');  // false
GENERIC_NAME_PATTERN.test('Group');         // true (no number needed)
```

### Parsing Figma URLs
```typescript
// Source: src/url-parser.ts
import { parseFigmaUrl } from '../url-parser';

const parts = parseFigmaUrl('https://figma.com/design/ABC/Name?node-id=0-1');
// { fileKey: 'ABC', nodeId: '0:1', fileType: 'design' }
```

### I-Prefix Node ID Examples (from existing tests)
```typescript
// Source: src/brief/generate.test.ts lines 721, 785
// Instance child IDs follow pattern: I{parentId};{childId}
'I20:1;20:2'   // parent is 20:1, child is 20:2
'I22:1;22:2'   // parent is 22:1, child is 22:2
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Auto-detect assets from tree walk | User manually adds assets by URL | v2.0 (Phase 15 stripped auto-detection) | ManualAsset type replaces the implicit detection pipeline |
| `AssetEntry.exportType: 'svg' \| 'png-render' \| 'png-fill'` | `ManualAsset.format: 'png' \| 'svg'` | v2.0 (this phase) | Simpler format field -- no render/fill distinction needed |
| Collision resolution at export time on full list | Collision resolution at add-time, incremental | v2.0 (this phase) | User sees final filename immediately |

**Deprecated/outdated:**
- `AssetEntry` type: Still exists in `src/assets/types.ts` but was marked for replacement by CONTEXT.md. Keep it for now (Phase 17/18 may still reference it during transition), but `ManualAsset` is the new canonical type.
- `identify.ts`, `detect-composition.ts`: Deleted in Phase 15. Gone.

## Figma Node Type to Format Mapping

Based on the `@figma/rest-api-spec` `Node` union type, here is the complete mapping:

| Node Type | Suggested Format | Rationale |
|-----------|-----------------|-----------|
| VECTOR | SVG | Pure vector path |
| LINE | SVG | Pure vector primitive |
| STAR | SVG | Pure vector shape |
| ELLIPSE | SVG | Pure vector shape |
| REGULAR_POLYGON | SVG | Pure vector shape |
| BOOLEAN_OPERATION | SVG | Vector boolean composition |
| FRAME | PNG | Container -- may have raster content |
| GROUP | PNG | Container -- may have raster content |
| COMPONENT | PNG | Container -- may have raster content |
| COMPONENT_SET | PNG | Variant set -- likely complex |
| INSTANCE | PNG | Component instance -- likely complex |
| SECTION | PNG | Figma section -- container |
| TEXT | PNG | Text rendering needs rasterization for accuracy |
| TEXT_PATH | PNG | Text on path -- rasterize for accuracy |
| RECTANGLE | PNG | May have image fills |
| TABLE | PNG | Complex layout |
| TABLE_CELL | PNG | Part of table |
| SLICE | PNG | Export region |
| TRANSFORM_GROUP | PNG | Transform applied -- rasterize |
| SHAPE_WITH_TEXT | PNG | FigJam shape -- rasterize |
| STICKY | PNG | FigJam sticky |
| CONNECTOR | PNG | FigJam connector |
| WASHI_TAPE | PNG | FigJam element |
| WIDGET | PNG | Widget -- rasterize |

**Note:** This mapping is a suggestion default. The user can always override to the other format.

## Open Questions

1. **Should `resolveCollisions` be generalized or should a new function be written?**
   - What we know: `resolveCollisions` takes `AssetEntry[]` which has a different shape than `ManualAsset[]`. Add-time resolution is one-at-a-time, not batch.
   - What's unclear: Whether future phases will need the old `resolveCollisions` for `AssetEntry[]`.
   - Recommendation: Write a new `resolveFilenameCollision(candidateFilename: string, existingFilenames: string[]): string` helper that works at the filename level. Simpler, more reusable. Keep old `resolveCollisions` for now -- Phase 17 may clean it up.

2. **Should we parse the I-prefix to extract and suggest the parent instance ID?**
   - What we know: The format `I{parentId};{childId}` is consistent across all observed examples. Parsing is trivial: `nodeId.slice(1).split(';')[0]`.
   - What's unclear: Whether there are edge cases (deeply nested instances with multiple semicolons like `I1:1;2:2;3:3`).
   - Recommendation: Parse and suggest the parent ID. The warning message is more actionable: "This is a child element inside component instance '20:1'. Select the parent instance instead." If parsing fails (unexpected format), fall back to generic message.

3. **Should there be broader node ID format validation?**
   - What we know: Valid Figma node IDs follow the pattern `{number}:{number}`. I-prefix IDs follow `I{id};{id}` possibly with deeper nesting.
   - What's unclear: Whether there are other non-renderable ID formats beyond I-prefix.
   - Recommendation: Keep it simple -- only validate I-prefix for now. The API call itself validates the node ID exists; a 404 from `fetchFileNodes` is sufficient error handling for malformed IDs.

## Sources

### Primary (HIGH confidence)
- `@figma/rest-api-spec` dist/api_types.ts -- Complete `Node` union type with all node type string literals (VECTOR, FRAME, COMPONENT, etc.) and `IsLayerTrait` (id + name on every node)
- `src/assets/sanitize.ts` + `sanitize.test.ts` -- Existing sanitization and collision logic, verified working
- `src/figma-api.ts` -- Existing `fetchFileNodes` implementation and `GetFileNodesResponse` usage
- `src/url-parser.ts` + `url-parser.test.ts` -- Existing URL parser, verified working
- `src/assets/breadcrumb.ts` -- `GENERIC_NAME_PATTERN` regex for detecting auto-generated Figma names
- `src/brief/generate.test.ts` -- I-prefix node ID examples: `I20:1;20:2`, `I22:1;22:2`

### Secondary (MEDIUM confidence)
- [Figma Forum: Can't Get Node with Prefix I](https://forum.figma.com/ask-the-community-7/can-t-get-node-with-prefix-i-9560) -- Confirms I-prefix IDs don't work with `/files/{key}/nodes` endpoint
- [Figma Forum: Retrieving parent nodes from nested instance/child IDs](https://forum.figma.com/ask-the-community-7/retrieving-information-about-parent-nodes-from-nested-instance-child-ids-4773) -- Confirms I-prefix format is `I{parentId};{childId}`, parent ID extractable by stripping prefix
- [Figma Developer Docs: File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- Official endpoint documentation

### Tertiary (LOW confidence)
- None -- all findings verified against primary or secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, all existing project infrastructure
- Architecture: HIGH -- straightforward composition of existing utilities behind a new type
- Pitfalls: HIGH -- pitfalls verified against actual codebase code and test patterns

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable domain -- Figma REST API and TypeScript patterns don't change frequently)
