# Phase 4: Image & Asset Export - Research

**Researched:** 2026-02-28
**Domain:** Figma REST API image rendering/export, binary file download via shell, filesystem operations
**Confidence:** HIGH

## Summary

Phase 4 builds the asset export pipeline: rendering the selected node as a PNG preview, exporting vector nodes as SVGs, and downloading raster image fills as PNGs -- all saved to `.shipstudio/assets/` in the project directory. The Figma REST API provides two distinct endpoints for this: `GET /v1/images/{file_key}` for rendering nodes to PNG/SVG, and `GET /v1/files/{file_key}/images` for resolving image fill references to download URLs.

The existing codebase provides strong foundations: `figmaApiCall<T>()` for typed API calls, `shell.exec('curl', [...])` as the only network path, `ImageFillRef` already collected by Phase 3's token pipeline, and `project.path` from the plugin context for output directory. The main new work is: (1) two new Figma API endpoint wrappers, (2) asset identification logic that walks the normalized tree, (3) filename sanitization, (4) sequential download with progress feedback, and (5) directory lifecycle management (clean + create + write).

**Primary recommendation:** Build this as a `src/assets/` module with pure-function asset identification (testable), API wrappers added to `figma-api.ts`, and an orchestrator function that the MainView calls after extraction completes. Use `curl -o <file>` for binary downloads (no stdout capture needed for binary data).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Single flat folder at `.shipstudio/assets/` inside the project directory
- All assets (preview, icons, images) in one folder -- no subdirectories by type
- Clean (wipe) the assets folder before each export run -- ensures assets match current Figma state, no stale files
- Filenames derived from sanitized Figma layer names: lowercase, slashes and spaces become hyphens, special characters stripped (e.g., "Icon / Arrow Right" becomes `icon-arrow-right.svg`)
- Render the selected node as a single PNG at 2x scale for retina clarity
- Preview file named `preview.png` -- predictable, one preview per extraction
- Full frame render, no size cap -- user chose the scope, trust it
- Selected node only -- no separate renders of child components
- SVG export: nodes of type VECTOR, BOOLEAN_OPERATION, LINE, STAR, POLYGON, ELLIPSE, RECTANGLE (without image fills)
- Raster export: any node with a paint of type IMAGE -- download via Figma image fills API, save as PNG
- Component instances (INSTANCE nodes) exported as SVG -- captures icons, buttons, and reusable components as complete vector graphics
- Depth: top-level and component-level only -- skip deeply nested decorative shapes inside components
- Exclude deeply nested internal vector parts of components
- Sequential downloads (one at a time via shell.exec curl) -- avoids Figma rate limits, acceptable speed for typical 10-30 assets
- Retry each download once on failure, then skip with a warning -- don't block entire export for one failed asset
- 30-second timeout per download -- matches existing Figma API timeout
- Per-asset progress feedback to user: "Downloading icon-arrow.svg (3/12)..."

### Claude's Discretion
- Exact error message wording and warning format
- How to handle filename collisions from duplicate layer names (append suffix, short node ID, etc.)
- Internal download queue implementation details
- Whether to log a summary of skipped assets at the end

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ASST-01 | Plugin renders the selected frame/component as PNG via Figma images API and saves to project | `GET /v1/images/{file_key}?ids={nodeId}&format=png&scale=2` endpoint; `curl -o` for binary save; preview always named `preview.png` |
| ASST-02 | Plugin identifies vector/icon nodes and exports them as SVG files to project directory | Asset identification walks normalized LayoutNode tree; type-based SVG rules (VECTOR, BOOLEAN_OPERATION, etc.); `GET /v1/images` with `format=svg`; INSTANCE nodes also exported as SVG |
| ASST-03 | Plugin identifies raster image nodes and exports them as PNG files to project directory | `ImageFillRef[]` already collected by Phase 3 token pipeline; `GET /v1/files/{file_key}/images` resolves imageRef to URL; `curl -o` to download |
| ASST-04 | Plugin generates sensible filenames from Figma layer names for exported assets | Sanitization function: lowercase, slashes/spaces to hyphens, strip special chars; collision handling via suffix |
| ASST-05 | Plugin downloads image URLs immediately (not stored as references) | Sequential download loop with per-asset progress; all URLs fetched fresh from API and downloaded in same operation |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@figma/rest-api-spec` | latest (already installed) | TypeScript types for `GetImagesResponse`, `GetImageFillsResponse` | Official Figma types, already used in Phase 1-3 |
| `vitest` | latest (already installed) | Unit testing for pure asset identification and filename logic | Project standard, 133+ tests already passing |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| N/A | -- | No new dependencies needed | All work uses existing shell.exec + curl pattern |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| curl -o (binary download) | curl stdout + shell write | `curl -o` is simpler for binary; stdout capture would corrupt binary data or require base64 encoding |
| Sequential downloads | Parallel downloads | User explicitly chose sequential to avoid rate limits; parallel would be faster but risks 429s |

**Installation:**
```bash
# No new packages needed -- all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/              # NEW: Phase 4 asset export module
│   ├── types.ts         # AssetEntry, ExportResult types
│   ├── identify.ts      # Pure function: walk tree → asset list (testable)
│   ├── sanitize.ts      # Filename sanitization (testable)
│   ├── download.ts      # Download orchestrator (shell.exec curl)
│   ├── export.ts        # Top-level orchestrator: identify → API → download → save
│   ├── identify.test.ts # Tests for asset identification
│   └── sanitize.test.ts # Tests for filename sanitization
├── figma-api.ts         # MODIFIED: add fetchImages(), fetchImageFills()
└── views/
    └── MainView.tsx     # MODIFIED: wire asset export after extraction
```

### Pattern 1: Two-Phase Image Export (Render URLs then Download)
**What:** The Figma API requires two steps: (1) request render URLs via API, (2) download rendered images from the returned S3 URLs. Both steps must happen in the same operation because URLs expire.
**When to use:** Always -- this is how the Figma images API works.
**Example:**
```typescript
// Source: Figma REST API official docs
// Step 1: Get render URLs for multiple nodes in one API call
// GET /v1/images/{file_key}?ids=1:2,3:4,5:6&format=svg&scale=2
const response = await figmaApiCall<GetImagesResponse>(
  shell,
  `/images/${fileKey}?ids=${nodeIds.join(',')}&format=svg`,
  token,
);
// response.images = { "1:2": "https://s3-url...", "3:4": "https://s3-url...", ... }

// Step 2: Download each URL to local file
for (const [nodeId, url] of Object.entries(response.images)) {
  if (!url) continue; // null = render failure
  const filePath = `${assetsDir}/${filename}`;
  await shell.exec('curl', ['-sS', '-o', filePath, '--max-time', '30', url]);
}
```

### Pattern 2: Batch API Calls, Sequential Downloads
**What:** The `GET /v1/images` endpoint accepts multiple node IDs in a single request (comma-separated `ids` parameter). This means we can batch all SVG node IDs into one API call and all PNG node IDs into another, getting all render URLs with just 2-3 API requests. The actual file downloads happen sequentially as decided by the user.
**When to use:** Always -- minimizes API calls (the rate-limited part), keeps downloads sequential (the user decision).
**Example:**
```typescript
// Batch: one call for preview (PNG), one for SVG assets, image fills separate
const previewUrls = await fetchImages(shell, token, fileKey, [selectedNodeId], 'png', 2);
const svgUrls = await fetchImages(shell, token, fileKey, svgNodeIds, 'svg');
const fillUrls = await fetchImageFills(shell, token, fileKey);

// Then download each file sequentially
```

### Pattern 3: Asset Identification as Pure Function
**What:** Walking the LayoutNode tree to identify exportable assets is a pure function: input = tree + imageFills, output = list of AssetEntry objects. No side effects, fully testable.
**When to use:** For the identification step, separate from downloading.
**Example:**
```typescript
interface AssetEntry {
  nodeId: string;
  nodeName: string;
  exportType: 'svg' | 'png-render' | 'png-fill';
  filename: string;
  // For image fills: the imageRef to resolve via GET /v1/files/{key}/images
  imageRef?: string;
}

function identifyAssets(
  rootNodes: LayoutNode[],
  imageFills: ImageFillRef[],
): AssetEntry[] {
  // Walk tree, apply type rules, sanitize filenames, handle collisions
}
```

### Pattern 4: Directory Lifecycle via Shell
**What:** Use `shell.exec` for all filesystem operations: `rm -rf` to clean, `mkdir -p` to create, `curl -o` to write files. No Node.js fs module needed.
**When to use:** All directory and file operations in this plugin.
**Example:**
```typescript
// Clean and recreate assets directory
const assetsDir = `${projectPath}/.shipstudio/assets`;
await shell.exec('rm', ['-rf', assetsDir]);
await shell.exec('mkdir', ['-p', assetsDir]);

// Download binary file
await shell.exec('curl', ['-sS', '-o', `${assetsDir}/preview.png`, '--max-time', '30', url]);
```

### Anti-Patterns to Avoid
- **Storing URLs for later download:** URLs expire (14-30 days) -- always download immediately in the same operation.
- **One API call per node:** The `ids` parameter accepts comma-separated values. Batching all SVG nodes into one call dramatically reduces API usage.
- **Capturing binary in stdout:** Using `curl` without `-o` would capture binary in `result.stdout`, which may corrupt data or blow up memory. Always use `-o <filepath>`.
- **Deep recursion into component internals:** The user decision says top-level and component-level only. Walking into INSTANCE children would export internal vector parts that aren't meaningful as standalone assets.
- **Parallel downloads:** User explicitly chose sequential to avoid rate limits.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP downloads | Custom HTTP client | `shell.exec('curl', ['-o', ...])` | Project pattern; curl handles redirects, retries, timeouts |
| Directory cleanup | Manual file-by-file deletion | `shell.exec('rm', ['-rf', dir])` | Atomic, handles nested content, standard Unix |
| Directory creation | Check-then-create logic | `shell.exec('mkdir', ['-p', dir])` | Idempotent, creates parents, no race conditions |
| Figma API calls | Raw curl construction | `figmaApiCall<T>()` wrapper | Already handles auth headers, error parsing, typed responses |
| Image fill resolution | Manual URL construction | `GET /v1/files/{key}/images` API | Only reliable way to resolve imageRef to downloadable URL |

**Key insight:** This phase is almost entirely plumbing: connecting existing Figma API wrappers with shell-based file operations. The only genuinely new logic is asset identification (which nodes to export) and filename sanitization. Everything else follows established patterns.

## Common Pitfalls

### Pitfall 1: Null Values in Image Render Response
**What goes wrong:** The `GET /v1/images` response maps node IDs to URLs, but a value can be `null` if Figma couldn't render that node (e.g., empty frame, unsupported node type).
**Why it happens:** Figma returns `null` for nodes it can't render rather than erroring the whole request.
**How to avoid:** Check each URL for null before attempting download. Log a warning and skip.
**Warning signs:** Downloads failing with "empty URL" or curl error on empty string.

### Pitfall 2: Rate Limits on Images Endpoint (Tier 1)
**What goes wrong:** The `GET /v1/images` endpoint is Tier 1 -- the most restrictive tier. On Starter plans, View/Collab seats get only 6 calls per MONTH. Even Dev/Full seats on Professional plans get only 15/min.
**Why it happens:** Image rendering is expensive for Figma's infrastructure.
**How to avoid:** Batch all node IDs into as few API calls as possible. The `ids` parameter accepts comma-separated values. Aim for 2-3 total API calls (1 for preview PNG, 1 for SVG batch, 1 for image fills) regardless of asset count.
**Warning signs:** 429 responses with large `Retry-After` headers.

### Pitfall 3: Image Fills API Returns ALL File Images
**What goes wrong:** `GET /v1/files/{file_key}/images` returns image fill URLs for the ENTIRE file, not just the selected scope. You must filter the results to only download images referenced by nodes in your extraction.
**Why it happens:** The endpoint doesn't accept node ID filters -- it's file-scoped.
**How to avoid:** Cross-reference the API response with the `ImageFillRef[]` collected by Phase 3. Only download images whose `imageRef` appears in the extraction's `imageFills` array.
**Warning signs:** Downloading dozens of irrelevant images, slow exports, wasted disk space.

### Pitfall 4: Filename Collisions from Duplicate Layer Names
**What goes wrong:** Multiple nodes can have the same layer name (e.g., two "Icon" layers), producing identical filenames that overwrite each other.
**Why it happens:** Figma doesn't enforce unique layer names.
**How to avoid:** Track used filenames during identification. On collision, append a short suffix (e.g., `-2`, `-3`, or a truncated node ID).
**Warning signs:** Fewer exported files than expected; assets silently overwritten.

### Pitfall 5: Encoding Node IDs in URL Query Parameters
**What goes wrong:** Node IDs contain colons (e.g., `12:34`). When passed as query parameters, they need proper URL encoding.
**Why it happens:** Colons are special characters in URLs.
**How to avoid:** Use `encodeURIComponent()` for individual node IDs, but note the `ids` parameter uses comma-separated values so only the node IDs themselves need encoding, not the commas.
**Warning signs:** 404 or empty responses from the images API.

### Pitfall 6: RECTANGLE Nodes with Image Fills
**What goes wrong:** A RECTANGLE node with an IMAGE fill should be exported as a raster PNG (via image fills API), not as an SVG. Exporting it as SVG would produce an empty rectangle without the image content.
**Why it happens:** The SVG export rules include RECTANGLE, but the user decision explicitly says "RECTANGLE (without image fills)".
**How to avoid:** Check node fills before classifying as SVG. If any fill has `type === 'IMAGE'`, treat as raster, not vector.
**Warning signs:** SVG files containing empty rectangles where images should be.

### Pitfall 7: Binary Data Corruption via stdout
**What goes wrong:** If curl output is captured in `result.stdout` (the default shell.exec behavior), binary PNG data may be corrupted by string encoding or truncated.
**Why it happens:** `shell.exec` returns stdout as a string, which mangles binary data.
**How to avoid:** Always use `curl -o <filepath>` to write directly to disk. The download function should check `exit_code` for success, not parse stdout.
**Warning signs:** Corrupted PNG files, images that won't open.

## Code Examples

Verified patterns from official sources and existing codebase:

### Figma Images API Wrapper (for rendering nodes as PNG/SVG)
```typescript
// New function in src/figma-api.ts
// Source: Figma REST API docs (GET /v1/images/{file_key})
import type { GetImagesResponse } from '@figma/rest-api-spec';

export async function fetchImages(
  shell: Shell,
  token: string,
  fileKey: string,
  nodeIds: string[],
  format: 'png' | 'svg' = 'png',
  scale?: number,
): Promise<Record<string, string | null>> {
  const ids = nodeIds.map(id => encodeURIComponent(id)).join(',');
  let endpoint = `/images/${fileKey}?ids=${ids}&format=${format}`;
  if (scale != null) {
    endpoint += `&scale=${scale}`;
  }
  const response = await figmaApiCall<GetImagesResponse>(shell, endpoint, token);
  return response.images;
}
```

### Figma Image Fills API Wrapper
```typescript
// New function in src/figma-api.ts
// Source: Figma REST API docs (GET /v1/files/{file_key}/images)
import type { GetImageFillsResponse } from '@figma/rest-api-spec';

export async function fetchImageFills(
  shell: Shell,
  token: string,
  fileKey: string,
): Promise<Record<string, string>> {
  const response = await figmaApiCall<GetImageFillsResponse>(
    shell,
    `/files/${fileKey}/images`,
    token,
  );
  return response.meta.images;
}
```

### Filename Sanitization
```typescript
// Source: User decision in CONTEXT.md
export function sanitizeFilename(layerName: string): string {
  return layerName
    .toLowerCase()
    .replace(/\//g, '-')     // slashes become hyphens
    .replace(/\s+/g, '-')    // spaces become hyphens
    .replace(/[^a-z0-9\-]/g, '') // strip special characters
    .replace(/-+/g, '-')     // collapse multiple hyphens
    .replace(/^-|-$/g, '');  // trim leading/trailing hyphens
}
// "Icon / Arrow Right" → "icon-arrow-right"
```

### Binary File Download with Retry
```typescript
// Source: Existing shell.exec pattern from figma-api.ts
async function downloadFile(
  shell: Shell,
  url: string,
  outputPath: string,
): Promise<{ success: boolean; error?: string }> {
  const args = ['-sS', '-o', outputPath, '--max-time', '30', '-L', url];

  const result = await shell.exec('curl', args, { timeout: 35000 });
  if (result.exit_code === 0) {
    return { success: true };
  }

  // Retry once
  const retry = await shell.exec('curl', args, { timeout: 35000 });
  if (retry.exit_code === 0) {
    return { success: true };
  }

  return {
    success: false,
    error: retry.stderr || `curl exit code ${retry.exit_code}`,
  };
}
```

### Asset Identification (depth-limited tree walk)
```typescript
// Walk the normalized tree to find exportable assets
// Respects: top-level + component-level only (no deep nesting)
const SVG_TYPES = new Set([
  'VECTOR', 'BOOLEAN_OPERATION', 'LINE', 'STAR', 'POLYGON', 'ELLIPSE',
]);

function isRectangleWithImageFill(node: LayoutNode): boolean {
  if (node.type !== 'RECTANGLE') return false;
  return node.fills?.some((f: any) => f.type === 'IMAGE') ?? false;
}

function isSvgCandidate(node: LayoutNode): boolean {
  if (SVG_TYPES.has(node.type)) return true;
  if (node.type === 'RECTANGLE' && !isRectangleWithImageFill(node)) return true;
  if (node.type === 'INSTANCE') return true;  // component instances as SVG
  return false;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Figma image URLs never expire | URLs expire: 14 days (fills) / 30 days (renders) | Unknown, current behavior | Must download immediately, never store URLs |
| Flat rate limits | Tiered rate limits by plan + seat + endpoint tier | November 2025 | Tier 1 (images) is most restrictive; batching IDs is critical |
| No typed API spec | `@figma/rest-api-spec` provides TypeScript types | Available | `GetImagesResponse`, `GetImageFillsResponse` types for type-safe responses |

**Deprecated/outdated:**
- None relevant to this phase.

## Open Questions

1. **Maximum node IDs per `GET /v1/images` request**
   - What we know: The `ids` parameter accepts comma-separated node IDs. No documented limit.
   - What's unclear: Whether there's a practical limit (URL length, server processing time).
   - Recommendation: Start with batching all IDs in one call. If it fails for large sets, split into chunks of ~50. For typical designs (10-30 assets), this is unlikely to be an issue.

2. **SVG export options (text rendering, stroke simplification)**
   - What we know: The API offers `svg_outline_text`, `svg_include_id`, `svg_simplify_stroke` options.
   - What's unclear: Which combination produces the best SVGs for Claude Code's reference.
   - Recommendation: Use `svg_outline_text=true` (default, ensures visual accuracy), `svg_include_id=true` (adds layer names as id attributes for readability), `svg_simplify_stroke=true` (default, cleaner SVGs).

3. **How shell.exec handles `curl -o` for binary files**
   - What we know: shell.exec returns `{ exit_code, stdout, stderr }`. With `-o`, stdout should be empty and the file written directly to disk.
   - What's unclear: Whether the Ship Studio shell.exec implementation has any issues with `-o` flag or file paths with special characters.
   - Recommendation: Test with a simple download first. Quote file paths. Use `-L` flag to follow redirects (S3 URLs may redirect).

## Sources

### Primary (HIGH confidence)
- Figma REST API official docs: [GET /v1/images endpoint](https://developers.figma.com/docs/rest-api/file-endpoints/) -- render parameters, response format, 30-day URL expiry
- Figma REST API official docs: [GET /v1/files/{key}/images endpoint](https://developers.figma.com/docs/rest-api/file-endpoints/) -- image fills resolution, 14-day URL expiry
- `@figma/rest-api-spec` package (node_modules) -- `GetImagesResponse`, `GetImageFillsResponse`, `GetImagesQueryParams` TypeScript types verified in source
- Figma REST API rate limits docs: [Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) -- Tier 1 for images endpoint, leaky bucket algorithm, per-plan budgets

### Secondary (MEDIUM confidence)
- Figma Forum discussion on images API rate limits: [429 after ~10 requests](https://forum.figma.com/report-a-problem-6/rest-api-rate-limit-images-api-returns-429-after-10-requests-cloudfront-49021) -- practical rate limit observations
- Existing codebase patterns (`figma-api.ts`, `collect.ts`, `MainView.tsx`) -- verified by reading source code directly

### Tertiary (LOW confidence)
- Maximum node IDs per request: No official documentation found. Community consensus suggests "as many as you want" within URL length limits, but this is unverified.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies; all patterns verified in existing codebase
- Architecture: HIGH -- clear separation of concerns; pure identification + API wrappers + download orchestrator
- Pitfalls: HIGH -- API response format, rate limits, and binary handling verified against official docs and typed API spec
- Asset identification rules: HIGH -- directly from user decisions in CONTEXT.md, cross-referenced with Figma node type system

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable domain, Figma API rarely changes endpoints)
