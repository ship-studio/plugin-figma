# Architecture Patterns

**Domain:** Figma design extraction plugin (Ship Studio toolbar plugin)
**Researched:** 2026-02-28

## Recommended Architecture

A six-component pipeline with clear data flow stages. Each component has a single responsibility and communicates through well-typed intermediate data structures. The pipeline is linear -- no component needs to call back to a previous stage.

```
User Input (Figma URL + token)
       |
  [1. URL Parser] -----> fileKey, nodeIds
       |
  [2. API Client] -----> raw Figma JSON (GetFileResponse / GetFileNodesResponse)
       |
  [3. Node Tree Parser] -----> normalized DesignTree (flat + hierarchical)
       |
  [4. Token Extractor] -----> DesignTokens (colors, typography, spacing, radii, shadows)
       |
  [5. Asset Exporter] -----> exported files on disk (PNG render, SVG icons, image fills)
       |
  [6. Brief Formatter] -----> markdown string -> clipboard
```

### Component Boundaries

| Component | Responsibility | Input | Output | Communicates With |
|-----------|---------------|-------|--------|-------------------|
| **URL Parser** | Parse Figma URLs into file key + node IDs | Raw URL string | `{ fileKey, nodeIds?, fileType }` | API Client (provides params) |
| **API Client** | Execute Figma REST API calls via shell.exec + curl | API params + token | Raw JSON responses (typed with `@figma/rest-api-spec`) | URL Parser (receives params), Node Tree Parser + Asset Exporter (provides data) |
| **Node Tree Parser** | Traverse and normalize the Figma node tree into a layout-oriented structure | Raw `GetFileResponse` or `GetFileNodesResponse` | `DesignTree` with flattened nodes + hierarchy metadata | API Client (receives data), Token Extractor + Brief Formatter (provides parsed tree) |
| **Token Extractor** | Deduplicate and categorize design values (colors, fonts, spacing) from the parsed tree | `DesignTree` | `DesignTokens` object with categorized, deduplicated values | Node Tree Parser (receives tree), Brief Formatter (provides tokens) |
| **Asset Exporter** | Request image renders and download exported assets to disk | File key + node IDs + project path | Array of `ExportedAsset` with file paths | API Client (uses for render URLs + download), Brief Formatter (provides asset manifest) |
| **Brief Formatter** | Assemble all data into a structured markdown design brief | `DesignTree` + `DesignTokens` + `ExportedAsset[]` | Markdown string (copied to clipboard) | All upstream components (receives their outputs) |

### Data Flow

**Stage 1: URL Parsing**
User pastes a Figma URL. The URL Parser extracts the file key and optional node IDs using regex. Figma URLs come in two formats:
- Legacy: `figma.com/file/{key}/{name}?node-id={id}`
- Current: `figma.com/design/{key}/{name}?node-id={id}`

The parser must handle both, plus `proto` and `board` variants. Node IDs in URLs are URL-encoded (e.g., `0-1` maps to `0:1`).

**Stage 2: API Calls**
The API Client makes 2-3 sequential calls:
1. `GET /v1/files/{key}` or `GET /v1/files/{key}/nodes?ids={ids}` -- fetch the design tree
2. `GET /v1/images/{key}?ids={ids}&format=png&scale=2` -- request a rendered PNG of the target frame
3. `GET /v1/files/{key}/images` -- get image fill URLs (if the design contains raster images)

Each call goes through `shell.exec("curl ...")` because the plugin cannot make direct HTTP requests. Responses are JSON strings parsed in JavaScript.

**Stage 3: Node Tree Parsing**
The raw Figma response contains a deeply nested node tree. The parser performs a depth-first traversal and produces:
- A flat list of nodes with computed properties (absolute position, inherited styles)
- A hierarchy map (parent-child relationships with depth)
- Classified node roles: container (FRAME/GROUP/SECTION), shape (RECTANGLE/ELLIPSE/etc.), text (TEXT), component (COMPONENT/INSTANCE), vector (VECTOR/BOOLEAN_OPERATION)

Key layout properties extracted per node:
- Auto-layout: `layoutMode`, `layoutSizingHorizontal/Vertical`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `itemSpacing`, padding
- Constraints: `constraints.horizontal`, `constraints.vertical`
- Dimensions: `absoluteBoundingBox` (x, y, width, height)
- Visual: `fills`, `strokes`, `effects`, `opacity`, `cornerRadius`, `blendMode`

**Stage 4: Token Extraction**
Walk the flat node list and collect unique values:
- **Colors**: Extract from `fills` (solid paints), `strokes`, `effects` (shadow colors). Deduplicate by RGBA value. Attempt semantic categorization (background vs text vs accent) based on usage context.
- **Typography**: Extract `TypeStyle` objects from TEXT nodes. Deduplicate by font family + size + weight. Group into a type scale.
- **Spacing**: Collect `itemSpacing`, `paddingTop/Right/Bottom/Left` values. Normalize to a spacing scale.
- **Border Radii**: Collect `cornerRadius` values. Deduplicate.
- **Shadows**: Extract `DropShadowEffect` and `InnerShadowEffect` values.

**Stage 5: Asset Export**
The API Client requests rendered images from Figma's image endpoint. The response contains temporary S3 URLs. The Asset Exporter:
1. Requests the PNG render of the target frame (visual reference)
2. Identifies exportable nodes (vectors marked as icons, image fills)
3. Requests SVG renders for vector icons via `GET /v1/images/{key}?ids={ids}&format=svg`
4. Downloads all assets via `curl` to the project directory
5. Returns a manifest of exported files with paths

**Stage 6: Brief Formatting**
Assembles everything into a markdown design brief structured for Claude Code consumption:
- Header: component name, dimensions, source URL
- Visual reference: path to the rendered PNG
- Layout structure: indented hierarchy showing flex direction, sizing, spacing
- Design tokens: colors, typography, spacing as CSS custom properties or plain values
- Component inventory: which Figma components are used and their properties
- Asset manifest: paths to exported SVGs and images
- Raw measurements: absolute positioning data for reference

The formatted string is copied to the clipboard via the browser Clipboard API.

## Core Data Types

```typescript
// URL Parser output
interface FigmaUrlParts {
  fileKey: string;
  nodeIds: string[] | null;  // null = entire file
  fileType: 'design' | 'file' | 'proto' | 'board';
}

// Node Tree Parser output
interface DesignTree {
  name: string;
  sourceUrl: string;
  rootNode: ParsedNode;
  flatNodes: ParsedNode[];
  components: Map<string, ComponentInfo>;
  styles: Map<string, StyleInfo>;
}

interface ParsedNode {
  id: string;
  name: string;
  type: string;
  depth: number;
  parentId: string | null;
  children: string[];  // IDs only, not nested objects

  // Layout
  bounds: { x: number; y: number; width: number; height: number };
  autoLayout: AutoLayoutProps | null;
  constraints: { horizontal: string; vertical: string } | null;
  layoutSizing: { horizontal: string; vertical: string } | null;

  // Visual
  fills: Paint[];
  strokes: Paint[];
  effects: Effect[];
  opacity: number;
  cornerRadius: number | number[] | null;
  blendMode: string;

  // Text (only for TEXT nodes)
  text: TextProps | null;

  // Component (only for INSTANCE nodes)
  componentId: string | null;
}

// Token Extractor output
interface DesignTokens {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: number[];        // deduplicated, sorted scale
  radii: number[];          // deduplicated, sorted
  shadows: ShadowToken[];
}

interface ColorToken {
  value: string;           // hex or rgba
  usageCount: number;
  contexts: string[];      // 'fill' | 'stroke' | 'shadow' | 'text'
  suggestedName: string;   // e.g., 'primary', 'background', 'text-muted'
}

interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number | string;
  letterSpacing: number;
  usageCount: number;
}

interface ShadowToken {
  type: 'drop' | 'inner';
  color: string;
  offset: { x: number; y: number };
  blur: number;
  spread: number;
}

// Asset Exporter output
interface ExportedAsset {
  nodeId: string;
  nodeName: string;
  type: 'render' | 'icon' | 'image';
  format: 'png' | 'svg' | 'jpg';
  filePath: string;       // relative to project root
  scale: number;
}

// Brief Formatter output
// -> string (markdown)
```

## Patterns to Follow

### Pattern 1: Shell-based API Client with Retry
**What:** Wrap all Figma API calls in a typed client that handles auth headers, JSON parsing, error handling, and rate limit retries via `shell.exec` + `curl`.
**When:** Every API interaction.
**Why:** The plugin cannot make direct HTTP requests. All network access must go through Tauri's shell.exec. Centralizing this avoids scattered curl invocations and provides consistent error handling.
**Example:**
```typescript
interface FigmaApiClient {
  getFile(fileKey: string, opts?: { nodeIds?: string[]; depth?: number }): Promise<GetFileResponse>;
  getFileNodes(fileKey: string, nodeIds: string[]): Promise<GetFileNodesResponse>;
  getImageRenders(fileKey: string, nodeIds: string[], opts: { format: string; scale: number }): Promise<Record<string, string>>;
  getImageFills(fileKey: string): Promise<Record<string, string>>;
}

async function figmaApiCall<T>(endpoint: string, token: string): Promise<T> {
  const result = await shell.exec(
    `curl -s -H "X-FIGMA-TOKEN: ${token}" "https://api.figma.com/v1${endpoint}"`
  );
  if (result.exitCode !== 0) throw new Error(`API call failed: ${result.stderr}`);

  const data = JSON.parse(result.stdout);
  if (data.status === 429) {
    // Rate limited -- wait and retry
    const retryAfter = data.retryAfter || 30;
    await delay(retryAfter * 1000);
    return figmaApiCall<T>(endpoint, token);
  }
  if (data.err) throw new Error(`Figma API error: ${data.err}`);
  return data as T;
}
```

### Pattern 2: Depth-First Tree Walker with Visitor
**What:** A generic tree walker that accepts visitor functions for different node types. Visitors accumulate results without mutating the tree.
**When:** Node tree parsing and token extraction.
**Why:** The Figma node tree is deeply nested (often 10+ levels). A single recursive walk with pluggable visitors avoids multiple traversals and keeps extraction logic modular.
**Example:**
```typescript
type NodeVisitor<T> = (node: FigmaNode, depth: number, parentId: string | null) => T | null;

function walkTree<T>(root: FigmaNode, visitor: NodeVisitor<T>): T[] {
  const results: T[] = [];

  function walk(node: FigmaNode, depth: number, parentId: string | null) {
    const result = visitor(node, depth, parentId);
    if (result !== null) results.push(result);

    if ('children' in node && node.children) {
      for (const child of node.children) {
        walk(child, depth + 1, node.id);
      }
    }
  }

  walk(root, 0, null);
  return results;
}
```

### Pattern 3: Progressive Extraction (fail-forward)
**What:** Each pipeline stage catches its own errors and produces partial results rather than failing the entire extraction. The brief formatter works with whatever data it receives.
**When:** Throughout the pipeline.
**Why:** Figma files vary wildly in structure. A missing font style or an unusual node type should not prevent the rest of the extraction from completing. Partial data is far more valuable than no data.
**Example:**
```typescript
interface ExtractionResult<T> {
  data: T;
  warnings: string[];  // non-fatal issues encountered
}

// Token extractor returns what it can, logs what it could not parse
function extractTokens(tree: DesignTree): ExtractionResult<DesignTokens> {
  const warnings: string[] = [];
  const colors: ColorToken[] = [];

  for (const node of tree.flatNodes) {
    try {
      colors.push(...extractColorsFromNode(node));
    } catch (e) {
      warnings.push(`Could not extract colors from "${node.name}": ${e.message}`);
    }
  }

  return { data: { colors, /* ... */ }, warnings };
}
```

### Pattern 4: Typed Shell Execution Wrapper
**What:** A thin wrapper around `shell.exec` that handles stdout/stderr parsing, exit code checking, timeout management, and returns typed results.
**When:** All shell.exec calls (API requests, file downloads).
**Why:** Raw shell.exec returns untyped string output. A wrapper centralizes error handling, guards against the 120s shell timeout, and makes the code testable.

### Pattern 5: File-based Asset Pipeline
**What:** Download assets to a predictable directory structure within the project, using sanitized names derived from Figma node names.
**When:** Asset export phase.
**Why:** Claude Code needs to reference these files by path. A consistent naming convention (e.g., `.figma-assets/icons/{name}.svg`, `.figma-assets/renders/{name}.png`) makes the design brief self-contained and paths predictable.
**Example directory structure:**
```
project-root/
  .figma-assets/
    renders/
      ComponentName.png          # 2x rendered PNG
    icons/
      icon-arrow-left.svg
      icon-close.svg
    images/
      hero-background.jpg
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Monolithic Extraction Function
**What:** A single function that fetches from API, parses the tree, extracts tokens, exports assets, and formats the brief.
**Why bad:** Untestable, impossible to retry individual stages, error in asset export kills the entire extraction. Cannot reuse individual stages.
**Instead:** Six distinct components with typed interfaces between them. Each can be tested and retried independently.

### Anti-Pattern 2: Fetching the Entire File When a Node ID is Available
**What:** Always calling `GET /v1/files/{key}` even when the user provided a specific frame URL with node-id.
**Why bad:** Figma files can be massive (thousands of nodes). Fetching everything wastes time, bandwidth, and risks the 120s shell timeout. Also more likely to hit rate limits.
**Instead:** When node IDs are available, use `GET /v1/files/{key}/nodes?ids={ids}` to fetch only the relevant subtree. Fall back to full file fetch only when extracting an entire page.

### Anti-Pattern 3: Preserving the Raw Figma Tree Structure for the Brief
**What:** Dumping the raw JSON or deeply nested tree structure into the design brief.
**Why bad:** The raw Figma tree contains noise (invisible nodes, internal Figma metadata, plugin data) and uses Figma-specific terminology that Claude Code does not need. A 200-node frame produces unreadable output.
**Instead:** The Node Tree Parser normalizes the tree into a flat list with hierarchy metadata. The Brief Formatter produces a concise, indented layout description using CSS/flex terminology.

### Anti-Pattern 4: Synchronous Blocking During Image Download
**What:** Downloading all assets sequentially, blocking the UI.
**Why bad:** Multiple asset downloads (render + icons + images) can take 30+ seconds if done one at a time.
**Instead:** Fire off image render requests in parallel where possible (batch node IDs in a single `GET /v1/images` call, which supports multiple IDs). Show progress in the UI.

### Anti-Pattern 5: Storing the Figma Token in the Brief or Logs
**What:** Including the personal access token in any output, debug log, or error message.
**Why bad:** Security risk. The token grants full read access to all the user's Figma files.
**Instead:** Mask the token in all logs. Store via plugin storage API only. Pass to the API client but never serialize it into output.

### Anti-Pattern 6: Ignoring Invisible and Locked Nodes
**What:** Including all nodes in the design tree regardless of visibility.
**Why bad:** Designers frequently have hidden layers for WIP, old iterations, or layout guides. Including these pollutes the brief with irrelevant data and confuses Claude Code.
**Instead:** Skip nodes where `visible === false` during tree traversal. Optionally allow users to toggle this behavior.

## Key Architecture Decisions

### Decision 1: Use `@figma/rest-api-spec` for Type Safety
Install `@figma/rest-api-spec` as a dev dependency. Import `GetFileResponse`, `GetFileNodesResponse`, `Node`, and property types. This eliminates hand-written Figma types and stays current with API changes.

**Confidence:** HIGH -- this is Figma's official TypeScript type package, published and maintained by Figma.

### Decision 2: Node-level Fetching Over Full-file Fetching
Default to `GET /v1/files/{key}/nodes?ids={ids}` when node IDs are present. This endpoint returns only the requested subtrees, dramatically reducing response size and parse time.

**Confidence:** HIGH -- documented in official Figma REST API endpoints.

### Decision 3: Batched Image Rendering
The `GET /v1/images/{key}` endpoint accepts a comma-separated list of node IDs. Batch all render requests (frame PNG + individual SVG icons) into as few calls as possible. The endpoint returns a map of `nodeId -> imageUrl`.

**Confidence:** HIGH -- documented in official Figma REST API.

### Decision 4: Markdown Brief Format
The design brief should be plain markdown, not JSON or a custom format. Markdown is:
- Directly pasteable into Claude Code (and any other LLM)
- Human-readable for verification
- Easy to template with string interpolation
- Supports code blocks for token values and indented lists for hierarchy

**Confidence:** HIGH -- this is a well-established pattern in the design-to-code tooling ecosystem (figma-extractor and others use it).

## Build Order (Dependency Chain)

The components have a strict dependency order that should guide implementation phases:

```
Phase 1: Foundation
  [URL Parser] -- no dependencies, pure function
  [API Client] -- depends on URL Parser output types only

Phase 2: Core Extraction
  [Node Tree Parser] -- depends on API Client (needs response data)
  [Token Extractor] -- depends on Node Tree Parser (needs parsed tree)

Phase 3: Assets + Output
  [Asset Exporter] -- depends on API Client (needs image endpoints)
  [Brief Formatter] -- depends on ALL upstream (final assembly)
```

**Build order rationale:**
1. **URL Parser first** because it is pure logic with no external dependencies -- easy to build and test, and every other component needs its output.
2. **API Client second** because it unlocks all data access. Once this works, you can manually inspect real Figma API responses to validate your type assumptions.
3. **Node Tree Parser third** because it transforms raw data into the normalized structure everything else consumes. Building this after the API Client means you work with real data, not guesses.
4. **Token Extractor fourth** because it walks the already-parsed tree. Straightforward once the tree structure is defined.
5. **Asset Exporter fifth** because it reuses the API Client for a different endpoint and adds file system operations. Can be developed in parallel with Token Extractor since they share no dependencies beyond the API Client.
6. **Brief Formatter last** because it consumes all upstream outputs. Cannot be meaningfully built until at least the Node Tree Parser and Token Extractor produce data.

## Scalability Considerations

| Concern | Small File (1-50 nodes) | Medium File (50-500 nodes) | Large File (500+ nodes) |
|---------|------------------------|---------------------------|------------------------|
| API Response Size | <100KB, fast | 500KB-2MB, fine | 5MB+, use node-level fetch |
| Parse Time | Instant | <1s | 2-5s, show progress |
| Token Deduplication | Trivial | Manageable | Need efficient Set-based dedup |
| Asset Export | 1-3 assets, sequential OK | 5-20 assets, batch API call | 20+, batch + progress bar |
| Shell Timeout (120s) | No risk | Low risk | Real risk -- must use node-level fetch, may need chunked requests |
| Brief Size | ~2KB, clipboard fine | ~10KB, clipboard fine | 50KB+, may need truncation strategy |

## Sources

- [Figma REST API Documentation](https://developers.figma.com/docs/rest-api/) -- HIGH confidence, official docs
- [Figma REST API File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- HIGH confidence, official docs
- [Figma REST API Node Types](https://developers.figma.com/docs/rest-api/file-node-types/) -- HIGH confidence, official docs
- [Figma REST API Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) -- HIGH confidence, official docs
- [Figma REST API Spec (TypeScript types)](https://github.com/figma/rest-api-spec) -- HIGH confidence, official Figma repo
- [figma-extractor (Go)](https://github.com/kataras/figma-extractor) -- MEDIUM confidence, reference implementation for extraction pipeline structure
- [monday.com design-to-code pipeline](https://engineering.monday.com/how-we-use-ai-to-turn-figma-designs-into-production-code/) -- MEDIUM confidence, production architecture reference
- [Component Generation with Figma API](https://dev.to/krjakbrjak/component-generation-with-figma-api-bridging-the-gap-between-development-and-design-1nho) -- MEDIUM confidence, architectural pattern reference
- [Figma URL regex patterns](https://community.latenode.com/t/validate-figma-url-and-extract-file-node-ids-using-regex/20893) -- MEDIUM confidence, community-verified patterns
- [Ship Studio Plugin Starter](https://github.com/ship-studio/plugin-starter) -- HIGH confidence, the actual platform this plugin runs on
