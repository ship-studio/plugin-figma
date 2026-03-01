# Phase 16: Asset Types & Node Resolution - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Resolve any Figma node URL to a validated asset entry with auto-derived filename and suggested format. Handle filename collisions with numeric suffixes. Detect and reject instance-child node IDs with a clear warning. This phase defines the ManualAsset type and the resolve/validate logic — it does NOT build the UI (Phase 19) or the export pipeline (Phase 17).

</domain>

<decisions>
## Implementation Decisions

### ManualAsset type shape
- Format field is `'png' | 'svg'` — two options only, no "auto" variant
- Status tracking on the type: `'resolving' | 'valid' | 'error'` — UI phases consume this
- Store both `nodeName` (original Figma layer name, for display) and `filename` (sanitized filesystem name)
- Filename is auto-derived on add, but the field is mutable — Phase 19 allows user edits

### Filename derivation rules
- Use existing `sanitizeFilename` convention: lowercase-hyphenated (e.g., "Hero Image" → `hero-image.png`)
- Use leaf node name only — no parent path in filename
- Generic Figma auto-names (e.g., "Frame 427") are used but produce a warning: "Auto-named: frame-427.png — consider renaming"
- Collisions resolved on add (not at export time) — user sees final filename immediately (e.g., `icon.png`, `icon-2.png`)

### Instance-child detection
- Soft rejection: don't add the asset to the list, show a friendly warning explaining why and suggesting the parent component
- Client-side I-prefix check on the node ID string — no wasted API call
- Check happens immediately when user pastes a URL, before any network request

### Format suggestion logic
- Format pre-selected based on node type from the resolve API call (one call returns name + type)
- User can override the suggestion — silent accept, no warnings or notes
- Pre-selected default in the UI (fastest flow — one click to change if needed)

### Claude's Discretion
- Which Figma node types map to SVG vs PNG suggestion (starting point: pure vector types → SVG, everything else → PNG)
- Whether to parse the I-prefix to extract and suggest the parent instance ID, or use a generic "select the parent" message
- Whether to add broader node ID format validation beyond I-prefix detection
- Internal type design details (optional fields, error message field, etc.)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sanitizeFilename` (src/assets/sanitize.ts): Already handles lowercase-hyphenation, special char stripping, fallback to "unnamed"
- `resolveCollisions` (src/assets/sanitize.ts): Already appends -2, -3 suffixes — needs adaptation from AssetEntry[] to ManualAsset[]
- `parseFigmaUrl` (src/url-parser.ts): Extracts fileKey and nodeId from Figma URLs — will be used to parse user-pasted asset URLs
- `fetchFileNodes` (src/figma-api.ts): Fetches node data including name and type — single call serves both name resolution and format suggestion

### Established Patterns
- Shell-based API calls via `figmaApiCall` wrapper (curl + JSON parse)
- Types defined in dedicated `types.ts` files per module
- Existing `AssetEntry` type (src/assets/types.ts) will be replaced/superseded by ManualAsset

### Integration Points
- ManualAsset type will be consumed by Phase 17 (export pipeline) and Phase 19 (UI)
- Node resolution logic will be called from the add-asset flow in Phase 19
- `fetchFileNodes` already exists and returns document tree with node types

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 16-asset-types-node-resolution*
*Context gathered: 2026-03-01*
