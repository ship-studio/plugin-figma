# Phase 24: Detection Foundation - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Pure function that walks a raw Figma tree to find `@S-` prefixed layers, auto-determines their export format (PNG vs SVG), and returns a typed array of detected assets with clean filenames and node IDs. No UI, no API calls, no pipeline integration -- those are Phase 25-26.

</domain>

<decisions>
## Implementation Decisions

### Format detection logic
- Full recursive descendant walk to determine format -- if ANY descendant has an image fill, export as PNG; otherwise SVG
- Walk enters INSTANCE subtrees the same as any other node -- instances are not opaque
- PNG wins in mixed cases (image fill + vector content) -- safe default since PNG captures everything
- TEXT-only layers: Claude's discretion on whether PNG or SVG is the better default

### Nested @S- handling
- Outermost @S- layer only -- when `@S-hero` contains `@S-icon`, only `@S-hero` is detected; inner `@S-icon` is part of the parent export
- Hidden layers (visible=false) with @S- prefix are skipped entirely
- @S- layers inside non-@S- INSTANCE nodes ARE detected -- the walk enters all subtrees
- Deduplicate by sanitized filename -- if 3 instances each contain `@S-icon`, produce one `icon.svg` not three numbered copies (matches Phase 9 SVG dedup pattern)

### Output type design
- New standalone `DetectedAsset` type -- does not extend ManualAsset or AssetEntry
- Fields: nodeId, nodeName, filename, format, plus position metadata for layout tree mapping (DETECT-05)
- Module location: `src/assets/detect.ts` with `detect.test.ts` alongside
- Input: raw Figma API node (untyped `any`) -- detector handles its own type narrowing internally

### Naming conventions
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

</decisions>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches. The function should be pure (no side effects, no API calls) and easily testable with fixture data.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sanitizeFilename` (src/assets/sanitize.ts): Lowercase, hyphenated, filesystem-safe names -- reuse directly for @S- name stripping
- `resolveFilenameCollision` (src/assets/resolve.ts): Appends `-2`, `-3` suffixes for duplicate filenames -- reuse for post-dedup collisions
- `resolveCollisions` (src/assets/sanitize.ts): Alternative collision resolver that works on AssetEntry arrays
- `VECTOR_NODE_TYPES` (src/assets/resolve.ts): Set of vector node types -- reference for format detection (though this phase uses content-based detection instead)
- `GENERIC_NAME_PATTERN` (src/assets/breadcrumb.ts): Regex for Figma auto-generated names -- could warn about generic @S- layer names

### Established Patterns
- Asset types in `src/assets/types.ts`: AssetEntry, ManualAsset, ExportResult -- DetectedAsset will be a new peer type in this file
- Pure function pattern: `sanitizeFilename`, `resolveCollisions` are pure functions with test files -- detection follows same pattern
- Tree walking: `normalizeTree` in `src/layout/normalize.ts` already walks the full Figma tree -- similar recursive structure

### Integration Points
- `src/assets/types.ts`: New DetectedAsset type exported here alongside existing types
- `src/assets/detect.ts`: New module consumed by Phase 25 (pipeline integration)
- Raw Figma tree comes from `fetchFileNodes` / `fetchFullFile` in `src/figma-api.ts` -- detection receives their output

</code_context>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 24-detection-foundation*
*Context gathered: 2026-03-01*
