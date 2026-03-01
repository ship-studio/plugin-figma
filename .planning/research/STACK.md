# Technology Stack

**Project:** Ship Studio Figma Plugin v2.0 -- Manual Asset Control
**Researched:** 2026-03-01

## Executive Summary

No new npm dependencies are needed. The v2.0 manual asset control features are entirely achievable with the existing stack: React 18 (host-provided), TypeScript 5.x, Vite, Vitest, `@figma/rest-api-spec`, and `curl` via `shell.exec`.

The three capability gaps -- multi-select URL parsing, asset list management UI, and filename conflict resolution -- are all small enough to implement as plain TypeScript functions and React state. Adding a library for any of these would be over-engineering.

What changes is **how the existing tools are used**, not **which tools are available**.

## Recommended Stack (No Changes from v1.3)

### Core Framework (unchanged)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TypeScript | 5.x | Type safety | Already in use |
| React 18 | (host-provided) | Plugin UI | Ship Studio provides React; useState + useCallback sufficient for asset list state |
| Vite | 6.x | Build | Already in use |
| Vitest | latest | Testing | Already in use |

### Figma API (unchanged)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@figma/rest-api-spec` | latest | Type definitions | Already provides `GetFileNodesResponse`, `Node` types with `name` field |
| `curl` via `shell.exec` | N/A | HTTP requests | Already the API access pattern for all Figma endpoints |

### No New Dependencies

Every v2.0 requirement maps to existing capabilities:

| Requirement | Solved By | Why No Library Needed |
|-------------|-----------|----------------------|
| Multi-node URL parsing | Extend `parseFigmaUrl()` in `url-parser.ts` | Comma-split on a query parameter -- 3 lines of code |
| Node name resolution | Existing `fetchFileNodes()` (already calls `/v1/files/:key/nodes?ids=`) | API accepts comma-separated IDs, response includes `document.name` per node |
| Asset list state | React `useState<AssetItem[]>` + `useCallback` | List of <20 items; no virtualization or complex state management needed |
| Filename sanitization | Existing `sanitizeFilename()` in `sanitize.ts` | Already converts Figma layer names to filesystem-safe strings |
| Filename collision resolution | Existing `resolveCollisions()` in `sanitize.ts` | Already appends `-2`, `-3` suffixes; fully tested |
| Asset download | Existing `downloadFile()` and `downloadAllAssets()` | No changes to download pipeline |
| Preview PNG | Existing `fetchImages()` with format='png', scale=2 | No changes |
| Format picker (PNG/SVG) | HTML `<select>` element | Two options, no component library needed |

## What Changes (Code, Not Dependencies)

### 1. URL Parser: Support Multiple Node IDs

**Current behavior:** `parseFigmaUrl()` returns a single `nodeId: string | null`.

**Figma URL reality:**
- Single selection: `?node-id=123-456`
- Multi-selection: Not natively supported by Figma's "Copy link" feature. Figma generates one link per selected element, not a comma-separated list.

**Implication for v2.0:** Users will paste one URL at a time to add assets. Each URL has one `node-id`. The parser does NOT need multi-node support in a single URL. The "multi-select" feature is the asset LIST (add multiple URLs over time), not multiple node IDs in one URL.

**Evidence:** Figma's "Copy link to selection" (Cmd+L) generates a link to the single focused node. Multi-Link Copy and Batch Copy Link community plugins exist precisely because Figma does NOT support multi-node URLs natively. The REST API's `/v1/files/:key/nodes?ids=` endpoint does accept comma-separated IDs, but this is for the API, not for URLs the user copies from Figma.

**No parser changes needed.** The existing single-nodeId parser is correct for user-pasted URLs.

**Confidence:** HIGH -- verified through Figma forum discussions, community plugin existence patterns, and manual URL testing knowledge.

### 2. Node Name Fetching

**Need:** When a user pastes a Figma URL for an asset, we need the layer name to auto-derive the filename.

**Existing capability:** `fetchFileNodes()` in `figma-api.ts` already calls `GET /v1/files/:key/nodes?ids=X` and returns `{ rootNode, components, styles }`. The `rootNode` is the full `Node` type from `@figma/rest-api-spec`, which includes a `name: string` field (part of `IsLayerTrait` inherited by all visual nodes).

**Integration:** Create a lightweight wrapper:
```typescript
async function fetchNodeName(shell: Shell, token: string, fileKey: string, nodeId: string): Promise<string> {
  const { rootNode } = await fetchFileNodes(shell, token, fileKey, nodeId);
  return rootNode.name;
}
```

This can be batched if needed -- the `/nodes` endpoint accepts comma-separated IDs: `?ids=1:2,3:4`. But since users add assets one at a time (paste URL, see name, confirm), individual fetches are fine.

**Confidence:** HIGH -- verified from `@figma/rest-api-spec` types (local), `GetFileNodesResponse.nodes[id].document` is type `Node` which extends `IsLayerTrait` with `name: string`.

### 3. Asset List State Management

**Pattern:** Simple React state array. No Redux, Zustand, or external state management.

```typescript
interface ManualAsset {
  id: string;          // Unique ID for React keys (crypto.randomUUID or counter)
  nodeId: string;      // Figma node ID (e.g., "123:456")
  nodeName: string;    // Layer name from Figma API (e.g., "Hero Image")
  format: 'png' | 'svg';  // User-selected export format
  filename: string;    // Auto-derived: sanitizeFilename(nodeName) + extension
}

const [assets, setAssets] = useState<ManualAsset[]>([]);
```

**Operations (all trivial with useState):**
- **Add:** `setAssets(prev => [...prev, newAsset])`
- **Remove:** `setAssets(prev => prev.filter(a => a.id !== id))`
- **Change format:** `setAssets(prev => prev.map(a => a.id === id ? { ...a, format, filename: sanitizeFilename(a.nodeName) + (format === 'svg' ? '.svg' : '.png') } : a))`

**Why not useReducer:** Three operations, all simple transforms. useState is clearer.

**Why not external state lib:** The asset list is local to one view, never shared across components, and is discarded after export. External state management would add complexity for zero benefit.

**Confidence:** HIGH -- standard React patterns, no novel requirements.

### 4. Filename Derivation and Conflict Resolution

**Existing utilities already solve this:**

1. `sanitizeFilename(layerName)` in `src/assets/sanitize.ts` -- converts "Icon / Arrow Right" to "icon-arrow-right"
2. `resolveCollisions(entries)` in `src/assets/sanitize.ts` -- appends `-2`, `-3` for duplicate filenames

**Integration for v2.0:** When the user adds an asset, auto-derive the filename:
```typescript
const baseName = sanitizeFilename(nodeName);
const filename = `${baseName}.${format === 'svg' ? 'svg' : 'png'}`;
```

Run `resolveCollisions()` at export time (not on add) to handle the case where multiple assets resolve to the same sanitized name. This matches the existing pattern in `identifyAssets()`.

**Confidence:** HIGH -- functions exist, are tested (10 tests for sanitize, 5 for collisions), and handle all edge cases.

### 5. Simplified Export Pipeline

**What changes in `export.ts`:**

The current `exportAssets()` function does:
1. Clean/create assets directory
2. Detect compositions via `detectCompositions()` -- **REMOVED in v2.0**
3. Identify assets via `identifyAssets()` -- **REMOVED in v2.0**
4. Batch API calls for render URLs (SVG, PNG, image fills)
5. Build download list
6. Sequential download

In v2.0, steps 2-3 are replaced by the user-provided `ManualAsset[]` list. Steps 4-6 remain the same with minor adaptation:

```typescript
// v2.0: User provides the asset list directly
// No identifyAssets(), no detectCompositions()
// Just batch the user's assets by format and download
```

The existing `fetchImages()` and `downloadFile()` functions are used as-is. The only difference is the source of the download list (user-curated vs auto-detected).

**Confidence:** HIGH -- the download pipeline is format-agnostic; it doesn't care where the asset list came from.

### 6. Layout Tree Cross-Referencing

**Current:** `buildTreeLines()` in `generate.ts` checks `exportResult.assets` for matching `nodeId` to show `-> filename.png` in the layout tree.

**v2.0:** Same pattern, different source. The `ManualAsset[]` list maps `nodeId -> filename`. The brief generator receives the export result with the same `{ nodeId, filename }` structure. No changes needed to the cross-referencing logic in `generate.ts`.

**Confidence:** HIGH -- the brief generator already handles arbitrary `nodeId -> filename` mappings.

## Figma REST API: Endpoints Used (No New Endpoints)

| Endpoint | Used For | v2.0 Change |
|----------|----------|-------------|
| `GET /v1/files/:key?depth=1` | Validate file access, get file name | None |
| `GET /v1/files/:key/nodes?ids=X` | Fetch node subtree (for layout extraction) | Also used to fetch node name for asset URL validation |
| `GET /v1/files/:key` | Fetch full file (page-level extraction) | None |
| `GET /v1/images/:key?ids=X&format=png&scale=2` | Render nodes as PNG | Same -- user-specified PNG assets |
| `GET /v1/images/:key?ids=X&format=svg` | Export SVGs | Same -- user-specified SVG assets |
| `GET /v1/files/:key/images` | Resolve imageRef to download URLs | May be unused if no auto-detected image fills |
| `GET /v1/me` | Validate personal access token | None |

**Note on image fills:** The `GET /v1/files/:key/images` endpoint (image fill resolution) may not be needed in v2.0. In v1.x, it resolves `imageRef` values from auto-detected IMAGE fills. In v2.0, users specify assets by node ID and format. For PNG assets, we render via `GET /v1/images/:key?ids=X&format=png` (node render, not fill resolution). The image fills endpoint is only needed if we want to support "export the original uploaded image" vs "export a rendered snapshot" -- this is a UX decision, not a stack decision.

## What NOT to Add

| Category | What | Why Not |
|----------|------|---------|
| State management | Redux, Zustand, Jotai | Overkill for a single list of <20 items in one component |
| UI component library | Radix, shadcn, Headless UI | Plugin uses Ship Studio theme system; adding a component library creates style conflicts and increases bundle size |
| Form library | React Hook Form, Formik | One text input and one select per asset add; no validation complexity |
| Drag-and-drop | react-beautiful-dnd, dnd-kit | Asset order doesn't matter for export; alphabetical or insertion order is fine |
| UUID generation | uuid package | `crypto.randomUUID()` is available in all modern JS runtimes, or use a simple counter |
| URL validation | url-parse, valid-url | `parseFigmaUrl()` already validates Figma URLs with a regex |
| List virtualization | react-window, react-virtuoso | Asset list will have <20 items; rendering all is fine |
| CSS-in-JS | styled-components, emotion | Plugin uses inline styles + Ship Studio CSS variables; consistent with existing codebase |

## Existing Utilities to Reuse

| Utility | Location | Reuse For |
|---------|----------|-----------|
| `parseFigmaUrl()` | `src/url-parser.ts` | Validate pasted asset URLs, extract fileKey + nodeId |
| `sanitizeFilename()` | `src/assets/sanitize.ts` | Convert layer names to filenames |
| `resolveCollisions()` | `src/assets/sanitize.ts` | Handle duplicate filenames at export time |
| `fetchFileNodes()` | `src/figma-api.ts` | Fetch node name for auto-derived filename |
| `fetchImages()` | `src/figma-api.ts` | Render PNG/SVG for user-specified nodes |
| `downloadFile()` | `src/assets/download.ts` | Download rendered assets to disk |
| `downloadAllAssets()` | `src/assets/download.ts` | Sequential download with progress |
| `prepareAssetsDir()` | `src/assets/download.ts` | Clean/create assets directory |
| `generateBrief()` | `src/brief/generate.ts` | Assemble markdown brief (receives export result) |

## Code to Remove

The v2.0 milestone explicitly removes all auto-detection code. These files/functions become dead code:

| File | What | Why Remove |
|------|------|------------|
| `src/assets/identify.ts` | Auto-detection of exportable assets | Replaced by user-curated list |
| `src/assets/identify.test.ts` | Tests for auto-detection | Dead code |
| `src/assets/detect-composition.ts` | Vector-only group / composition detection | Replaced by user-curated list |
| `src/assets/detect-composition.test.ts` | Tests for composition detection | Dead code |
| `src/assets/breadcrumb.ts` | Layout tree breadcrumb for auto-detected assets | May still be useful if kept; evaluate during implementation |
| `src/assets/breadcrumb.test.ts` | Tests for breadcrumb | Depends on breadcrumb decision |

**Net effect:** Significant codebase simplification. The `identify.ts` walkTree function (247 lines) and `detect-composition.ts` are the most complex parts of the asset pipeline. Removing them reduces maintenance burden and eliminates entire categories of bugs (false positive/negative detection, dedup edge cases, composition heuristic failures).

## Sources

- [`@figma/rest-api-spec` types (local)](https://github.com/figma/rest-api-spec) -- `GetFileNodesResponse.nodes[id].document` is type `Node` extending `IsLayerTrait` with `name: string`; verified locally at `node_modules/@figma/rest-api-spec/dist/api_types.ts` (HIGH confidence)
- [Figma REST API file endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- `/v1/files/:key/nodes` accepts comma-separated IDs in `ids` parameter (HIGH confidence)
- [Figma forum: copy link to selection](https://forum.figma.com/suggest-a-feature-11/share-to-selection-links-should-be-consistent-34807) -- Cmd+L generates link to single focused node, not multi-node URL (MEDIUM confidence)
- [Multi-Link Copy Figma plugin](https://www.figma.com/community/plugin/1423324569458473026/multi-link-copy) -- existence of this plugin confirms Figma lacks native multi-node URL support (MEDIUM confidence)
- Local codebase: `src/url-parser.ts`, `src/assets/sanitize.ts`, `src/assets/export.ts`, `src/figma-api.ts`, `src/views/MainView.tsx` -- verified existing utility functions, API wrappers, and UI patterns (HIGH confidence)
