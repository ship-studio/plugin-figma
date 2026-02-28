# Technology Stack

**Project:** Ship Studio Figma Plugin
**Researched:** 2026-02-28
**Overall Confidence:** HIGH

## Critical Constraint

This plugin runs inside Ship Studio (a Tauri-based desktop app). It **cannot make direct HTTP requests** (no `fetch`, no `axios`, no Node.js `http`). All network calls go through `shell.exec` + `curl`. This eliminates standard Figma API client libraries as runtime dependencies -- they all use built-in HTTP clients internally. We use Figma's official types for type safety, but build our own thin curl-based API layer.

## Recommended Stack

### Core Framework (Inherited from Ship Studio Plugin Starter)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| React | (host-provided) | UI framework | Ship Studio provides React as a shared host instance; plugins do not bundle their own React | HIGH |
| TypeScript | 5.x | Type safety | Required for consuming `@figma/rest-api-spec` types; catches Figma API response shape errors at compile time | HIGH |
| Vite | (starter config) | Build tool | Ship Studio plugin starter uses Vite to produce `dist/index.js`; do not change | HIGH |

These are not choices -- they are constraints from the Ship Studio plugin starter template. Do not deviate.

### Figma API Types

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `@figma/rest-api-spec` | ^0.36.0 | TypeScript types for all Figma REST API responses, parameters, and node types | Official package from Figma. Zero dependencies. Actively maintained (last published Jan 2026). Provides `GetFileResponse`, `GetFileNodesResponse`, `GetImagesResponse`, and all node type discriminated unions. Far superior to hand-typing API responses. | HIGH |

This is the single most important dependency for this project. It gives us type-safe access to:
- All node types (FRAME, TEXT, COMPONENT, INSTANCE, VECTOR, etc.) with their full property sets
- Auto-layout properties (`layoutMode`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `layoutSizingHorizontal`, `layoutSizingVertical`, `itemSpacing`, `paddingLeft/Right/Top/Bottom`)
- Paint types (SOLID, GRADIENT_LINEAR, IMAGE, etc.)
- TypeStyle (font family, size, weight, line height, letter spacing, text alignment)
- Effect types (DROP_SHADOW, INNER_SHADOW, LAYER_BLUR, BACKGROUND_BLUR)
- Response shapes for every endpoint

### API Layer (Custom -- No Client Library)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `shell.exec` + `curl` | (Ship Studio API) | HTTP requests to Figma REST API | The only way to make network requests from a Ship Studio plugin. curl is available on macOS (and Linux). All API calls go through this path. | HIGH |

**Why not use `figma-api` or `figma-js`?**
- `figma-api` (v2.1.2-beta) depends on axios and makes HTTP requests internally. Since we cannot use direct HTTP, wrapping it would require monkey-patching its transport -- fragile and pointless.
- `figma-js` (v1.16.1-0) is effectively abandoned (last real release Aug 2022). Also uses its own HTTP client.
- Both libraries are thin wrappers around REST endpoints. Building a curl-based wrapper with `@figma/rest-api-spec` types gives us the same type safety with full control over the transport.

### Data Processing

| Library | Version | Purpose | Why | Confidence |
|---------|---------|---------|-----|------------|
| No external parsing libraries | -- | Figma node tree processing | The Figma node tree is already JSON from the REST API. Parsing it is straightforward recursive tree traversal. Adding a library for this adds bundle weight without value. Write utility functions that recursively walk the tree, extracting layout/style/component data into a structured brief format. | HIGH |

### Validation (Optional but Recommended)

| Library | Version | Purpose | Why | Confidence |
|---------|---------|---------|-----|------------|
| `zod` | ^4.3.6 | Runtime validation of Figma API responses | Validates that curl responses are actually valid JSON and match expected shapes before processing. Catches malformed responses, auth errors, and API changes gracefully. Zod 4 is 57% smaller than v3 with 14x faster string parsing. At ~2KB gzipped (`@zod/mini`), the bundle cost is minimal. | MEDIUM |

**Rationale for MEDIUM confidence:** Zod is genuinely useful for validating curl output (which comes back as raw strings), but you could also get by with simple try/catch on JSON.parse + type assertions. If bundle size is critical, skip Zod and use manual validation. The `@figma/rest-api-spec` types provide compile-time safety; Zod adds runtime safety.

### SVG Optimization (Deferred)

| Library | Version | Purpose | Why | Confidence |
|---------|---------|---------|-----|------------|
| `svgo` | ^4.0.0 | Optimize exported SVG assets | SVGs from Figma's image export endpoint contain redundant metadata. SVGO strips it down. However, this is a build-time/processing concern, not a core extraction concern. **Defer to a later phase** -- extract raw SVGs first, optimize later. | LOW |

**Rationale for LOW confidence:** SVGO runs in Node.js. The plugin runs in a browser-like Tauri webview. Using SVGO would require running it via `shell.exec` (e.g., `npx svgo`), which adds complexity. Evaluate whether raw SVGs are good enough before adding this dependency.

## Figma REST API Endpoints Used

These are the specific endpoints the plugin will call, in order of priority:

### Tier 1: Core Extraction

| Endpoint | Tier | Purpose | Rate Limit (Pro) |
|----------|------|---------|-----------------|
| `GET /v1/files/:key/nodes?ids=X` | Tier 2 | Fetch specific node subtrees for extraction | 50/min |
| `GET /v1/images/:key?ids=X&format=png` | Tier 2 | Render selected frames as PNG | 50/min |
| `GET /v1/images/:key?ids=X&format=svg` | Tier 2 | Export SVG assets from vector nodes | 50/min |

### Tier 2: File Structure

| Endpoint | Tier | Purpose | Rate Limit (Pro) |
|----------|------|---------|-----------------|
| `GET /v1/files/:key?depth=1` | Tier 1 | Get page list and top-level structure | 15/min |
| `GET /v1/files/:key/images` | Tier 2 | Get image fill download URLs | 50/min |

### Tier 3: Enterprise-Only (Out of Scope)

| Endpoint | Tier | Purpose | Why Skip |
|----------|------|---------|----------|
| `GET /v1/files/:key/variables/local` | Tier 2 | Figma Variables (design tokens) | Enterprise-only. Extract tokens from node styles instead. |

**Key constraint:** The Variables REST API requires Enterprise organization membership. Since this plugin targets all Figma users, we extract design tokens from node style properties (fills, effects, text styles) rather than the Variables endpoint. This covers 90%+ of use cases.

## Authentication

| Aspect | Value | Notes |
|--------|-------|-------|
| Method | Personal Access Token (PAT) | Simpler than OAuth; sufficient for read-only |
| Header | `X-Figma-Token: <token>` | Passed via curl `-H` flag |
| Required Scopes | `file_content:read` | Covers GET files, GET file nodes, GET images |
| Token Expiry | Max 90 days | Users must regenerate periodically |
| Storage | Ship Studio plugin storage | Persisted per-project via plugin API |

## Figma URL Parsing

Figma URLs follow multiple formats that must be parsed to extract `file_key` and `node_id`:

```
https://www.figma.com/design/<file_key>/<file_name>?node-id=<node_id>
https://www.figma.com/file/<file_key>/<file_name>?node-id=<node_id>
https://www.figma.com/proto/<file_key>/...
https://www.figma.com/board/<file_key>/...
```

**Recommended regex** (handles both old `file/` and new `design/` format):
```typescript
const FIGMA_URL_RE = /https:\/\/[\w.-]*\.?figma\.com\/(file|design|proto|board)\/([0-9a-zA-Z]{22,128})(?:\/[^?]*)?(?:\?.*node-id=([^&]*))?/;
// Groups: [1] = type, [2] = file_key, [3] = node_id (optional, URL-encoded)
```

Node IDs in URLs are URL-encoded (e.g., `1%3A2` for `1:2`). Decode with `decodeURIComponent()`.

## Rate Limit Handling Strategy

| Concern | Strategy |
|---------|----------|
| 429 responses | Read `Retry-After` header, wait, retry |
| Batching image exports | Request multiple node IDs in a single `GET /v1/images/:key?ids=A,B,C` call |
| Large files | Use `depth` parameter to limit response size; use `ids` parameter to fetch only needed nodes |
| Shell timeout | Ship Studio has 120s shell timeout; large files may approach this. Use node-specific endpoints, not full file fetch |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Figma Types | `@figma/rest-api-spec` | `figma-api` types | `figma-api` re-exports `@figma/rest-api-spec` types anyway, plus bundles axios we cannot use |
| Figma Client | Custom curl wrapper | `figma-api` / `figma-js` | Cannot use HTTP clients in Ship Studio plugins; must use `shell.exec` + `curl` |
| Figma Client | Custom curl wrapper | `@zemd/figma-rest-api` | Uses `fetch` internally; same transport problem |
| Validation | `zod` (or none) | `io-ts` / `ajv` | Zod has the best TypeScript DX and smallest bundle via `@zod/mini` |
| SVG Processing | Defer (raw SVGs) | `svgo` | Adds complexity via `shell.exec`; evaluate if needed later |
| Node Tree Parsing | Custom utilities | FigmaToCode's approach | FigmaToCode uses a Plugin API (not REST API) intermediate layer; not applicable to REST API consumption |

## Installation

```bash
# Types only (zero runtime dependencies)
npm install -D @figma/rest-api-spec

# Optional: runtime validation
npm install zod
# OR for minimal bundle:
npm install @zod/mini
```

That is the entire dependency list. Everything else is custom code.

## Key Auto-Layout to CSS Mapping Reference

This mapping is essential for the node tree parser:

| Figma Property | CSS Equivalent | Values |
|----------------|---------------|--------|
| `layoutMode: "HORIZONTAL"` | `flex-direction: row` | |
| `layoutMode: "VERTICAL"` | `flex-direction: column` | |
| `primaryAxisAlignItems: "MIN"` | `justify-content: flex-start` | |
| `primaryAxisAlignItems: "CENTER"` | `justify-content: center` | |
| `primaryAxisAlignItems: "MAX"` | `justify-content: flex-end` | |
| `primaryAxisAlignItems: "SPACE_BETWEEN"` | `justify-content: space-between` | |
| `counterAxisAlignItems: "MIN"` | `align-items: flex-start` | |
| `counterAxisAlignItems: "CENTER"` | `align-items: center` | |
| `counterAxisAlignItems: "MAX"` | `align-items: flex-end` | |
| `counterAxisAlignItems: "BASELINE"` | `align-items: baseline` | |
| `layoutSizingHorizontal: "FIXED"` | `width: <absoluteBoundingBox.width>px` | |
| `layoutSizingHorizontal: "HUG"` | `width: fit-content` | |
| `layoutSizingHorizontal: "FILL"` | `flex: 1` / `width: 100%` | |
| `itemSpacing` | `gap` | |
| `paddingLeft/Right/Top/Bottom` | `padding` | |
| `layoutWrap: "WRAP"` | `flex-wrap: wrap` | |

## Sources

- [Figma REST API Documentation](https://developers.figma.com/docs/rest-api/) -- HIGH confidence
- [Figma REST API File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- HIGH confidence
- [Figma REST API Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) -- HIGH confidence
- [Figma REST API Scopes](https://developers.figma.com/docs/rest-api/scopes/) -- HIGH confidence
- [Figma REST API Authentication](https://developers.figma.com/docs/rest-api/authentication/) -- HIGH confidence
- [Figma REST API Variables Endpoints](https://developers.figma.com/docs/rest-api/variables-endpoints/) -- HIGH confidence (Enterprise restriction verified)
- [Figma REST API File Node Types](https://developers.figma.com/docs/rest-api/file-node-types/) -- HIGH confidence
- [Figma REST API File Property Types](https://developers.figma.com/docs/rest-api/file-property-types/) -- HIGH confidence
- [Figma REST API Changelog](https://developers.figma.com/docs/rest-api/changelog/) -- HIGH confidence
- [@figma/rest-api-spec on npm](https://www.npmjs.com/package/@figma/rest-api-spec) -- HIGH confidence (v0.36.0, published 2026-01-21)
- [@figma/rest-api-spec on GitHub](https://github.com/figma/rest-api-spec) -- HIGH confidence
- [figma-api on npm](https://www.npmjs.com/package/figma-api) -- MEDIUM confidence (v2.1.2-beta, actively maintained but uses axios)
- [figma-js on npm](https://www.npmjs.com/package/figma-js) -- HIGH confidence (v1.16.1-0, effectively abandoned since Aug 2022)
- [Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) -- MEDIUM confidence (architecture reference for node tree simplification)
- [FigmaToCode](https://github.com/bernaferrari/FigmaToCode) -- MEDIUM confidence (architecture reference for Figma-to-CSS conversion)
- [Figma URL parsing patterns](https://community.latenode.com/t/validate-figma-url-and-extract-file-node-ids-using-regex/20893) -- MEDIUM confidence
- [Zod v4](https://zod.dev/) -- HIGH confidence (v4.3.6 verified via npm)
- [SVGO](https://svgo.dev/) -- MEDIUM confidence (v4.0.0, may not be needed)
