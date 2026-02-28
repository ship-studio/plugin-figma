# Pitfalls Research

**Domain:** Figma design extraction via REST API for AI code generation
**Researched:** 2026-02-28
**Confidence:** HIGH (verified against official Figma developer docs and community reports)

## Critical Pitfalls

### Pitfall 1: Fetching Entire File Trees Instead of Targeted Nodes

**What goes wrong:**
Calling `GET /v1/files/:key` without the `depth` or `ids` parameters on anything beyond a trivially small file returns the entire document tree. Response payloads can be tens of megabytes. The Figma API enforces a 55-second processing limit -- files exceeding this return a 400 "Request timeout, try a smaller request" or a 500 error. Even when responses succeed, piping multi-megabyte JSON through `shell.exec` with curl risks exceeding the 120-second shell timeout or consuming excessive memory in the plugin process.

**Why it happens:**
The naive approach is to fetch the whole file and filter client-side. The API defaults to returning all nodes at full depth when no constraints are specified. Developers do not realize how large real-world Figma files are until they hit timeouts in production.

**How to avoid:**
- Always use the `ids` parameter to request only the specific node(s) the user selected via their pasted Figma URL. Parse the node ID from the URL (`?node-id=X:Y` or `?node-id=X-Y`).
- Use the `depth` parameter as a safety net (e.g., `depth=50` as a ceiling) to prevent unbounded tree traversal on deeply nested designs.
- For page-level extraction, first fetch with `depth=1` to get page-level node IDs, then fetch individual frames with `ids`.
- Implement response size checks before attempting to parse JSON.

**Warning signs:**
- API calls taking more than 10 seconds for a single frame extraction.
- 400/500 errors with "Request timeout" or "Request too large" messages.
- Plugin UI freezing during extraction.
- curl process consuming hundreds of MB of memory.

**Phase to address:**
Phase 1 (Core API Layer) -- the URL parsing and API request construction must be correct from the start. Retrofitting targeted fetching onto a full-file approach requires rewriting the extraction pipeline.

---

### Pitfall 2: Ignoring Rate Limits and Getting Blocked

**What goes wrong:**
Figma uses a leaky-bucket rate limiter with per-user limits that vary by plan and seat type. On Starter plans with Dev seats, you get only 10 requests/minute for Tier 1 endpoints (GET files, GET images). View/Collab seats are far worse: 6 requests per *month* for Tier 1. Extracting a design with structure, images, and styles can easily require 5-10 API calls. A single extraction workflow can exhaust the rate limit, and back-to-back extractions will trigger 429 errors. Once rate-limited, the user's token is blocked for the duration specified in the `Retry-After` header.

**Why it happens:**
Developers test with their own Enterprise/Pro accounts and never see rate limits. Users on Starter or free plans hit them immediately. The image rendering endpoint is particularly aggressive -- community reports show 429 errors after only ~10 requests to the Images API due to CloudFront-level throttling.

**How to avoid:**
- Batch image export requests: the `GET /v1/images/:key` endpoint accepts multiple `ids` in a single call. Never request images one node at a time.
- Cache aggressively: store the file tree response and re-parse it rather than re-fetching.
- Implement exponential backoff with `Retry-After` header respect. The header returns the number of seconds to wait.
- Surface clear error messages when rate-limited, including the `X-Figma-Upgrade-Link` header value so users can upgrade if needed.
- Design the extraction pipeline to minimize total API calls (ideally: 1 file/nodes call + 1 images call + 1 image fills call = 3 total).

**Warning signs:**
- HTTP 429 responses from any Figma endpoint.
- `X-Figma-Rate-Limit-Type: low` header indicating View/Collab seat with severe limits.
- Users reporting "extraction worked once but now fails."

**Phase to address:**
Phase 1 (Core API Layer) -- rate limit handling and request batching must be built into the API client from day one. Phase 2 (Extraction Logic) should optimize for minimal API calls.

---

### Pitfall 3: Mishandling Auto-Layout to Flexbox Translation

**What goes wrong:**
Figma's auto-layout maps to CSS flexbox, but the mapping is not 1:1. Children within an auto-layout frame can have `layoutPositioning: "ABSOLUTE"` (Figma calls this "Ignore auto layout"), which takes them out of the flex flow while remaining visually nested inside the frame. Extracting this as a simple flexbox container with all children as flex items produces broken layouts. Additionally, `layoutSizingHorizontal/Vertical` values of `FIXED`, `HUG`, and `FILL` map to different CSS width/height and flex properties that are easy to get wrong.

**Why it happens:**
Auto-layout *looks* like flexbox, so developers assume a simple property mapping works. But Figma combines flexbox semantics with absolute positioning within the same container -- something CSS cannot express without wrapper elements or explicit `position: absolute` on specific children. The `FILL` sizing mode maps to `flex: 1` only when the parent is an auto-layout container in the matching axis, not unconditionally.

**How to avoid:**
- Check `layoutPositioning` on every child node, not just `layoutMode` on the parent.
- Map sizing modes carefully:
  - `FIXED` = explicit width/height in pixels.
  - `HUG` = width/height auto (content-driven).
  - `FILL` = flex: 1 (only when parent has auto-layout in that axis).
- Detect children with `layoutPositioning: "ABSOLUTE"` and flag them separately from flow children.
- Include `constraints` data for absolutely-positioned children (they use constraint-based positioning relative to the parent frame).
- Output the layout intent as a structured description rather than attempting CSS generation -- let Claude Code handle the CSS translation with full context.

**Warning signs:**
- Extracted layouts where all children appear as flex items but the visual output has overlapping elements.
- Elements appearing in unexpected positions when rendered from the extracted data.
- Components that "look right" at one size but break when resized.

**Phase to address:**
Phase 2 (Layout Extraction) -- this is the core complexity of the extraction logic and needs dedicated attention. Build test cases with real-world designs that use absolute positioning within auto-layout.

---

### Pitfall 4: Styles Require Two-Step Lookup, Not Direct Access

**What goes wrong:**
Developers expect a single endpoint to return style definitions (color values, font properties, shadow parameters). In reality, `GET /v1/files/:key/styles` returns only style *metadata* (name, key, type, node_id) -- not the actual values. To get the fill colors, font families, or shadow properties, you must make a second call to `GET /v1/files/:key/nodes?ids=<style_node_ids>` and extract the style values from those nodes' properties. Missing this two-step process results in a design brief with style names but no values.

**Why it happens:**
The API endpoint naming (`/styles`) implies it returns style data. The response structure includes `style_type` and `name` which look like useful design token data, but the actual fill/stroke/effect/text values live on the associated nodes, not in the styles metadata.

**How to avoid:**
- Implement the two-step process: fetch style metadata, then batch-fetch the associated nodes using the `ids` parameter.
- For files that use Figma Variables (the newer token system), note that the Variables REST API (`GET /v1/files/:key/variables/local`) is restricted to Enterprise plan members only. For non-Enterprise users, you must extract token values from the node tree directly.
- Parse style information from nodes' `styles` property map, which maps style types (`fill`, `stroke`, `text`, `effect`, `grid`) to style IDs.
- Build a lookup table: style_id -> style values, derived from the nodes that define those styles.

**Warning signs:**
- Design brief contains style names like "Primary/Blue" but no actual color values.
- Token extraction works in testing but fails on files without applied styles.
- Variables endpoint returning 403/404 for non-Enterprise users.

**Phase to address:**
Phase 2 (Design Token Extraction) -- must be designed with the two-step lookup from the start.

---

### Pitfall 5: Figma Colors Use 0-1 Float Range, Not 0-255

**What goes wrong:**
Figma's REST API returns colors as `{r, g, b, a}` objects where all values are floats between 0.0 and 1.0. Developers pass these values directly into hex/RGB output, producing colors like `rgb(0, 0, 1)` (which renders as nearly black in CSS) instead of `rgb(0, 0, 255)` (blue). Additionally, `SolidPaint` nodes separate `color` (RGB without alpha) from `opacity` (on the paint itself), meaning alpha must be derived from the paint's opacity, not the color object.

**Why it happens:**
Every other color API developers encounter uses 0-255 integer ranges or hex strings. The 0-1 float convention is mathematically elegant but counterintuitive. The alpha/opacity separation is a Figma-specific design choice that catches everyone.

**How to avoid:**
- Always multiply r, g, b by 255 and round before outputting to CSS formats.
- For alpha: use the paint's `opacity` property (defaults to 1.0 if absent), not a fourth channel from the color object. For non-solid paints, alpha *is* on the color object.
- Validate converted colors against the Figma design visually during development.
- Build a dedicated color conversion utility that handles all Figma paint types (SOLID, GRADIENT_LINEAR, GRADIENT_RADIAL, GRADIENT_ANGULAR, GRADIENT_DIAMOND, IMAGE, EMOJI).

**Warning signs:**
- All extracted colors appear very dark or very desaturated.
- Transparent elements appearing opaque, or opaque elements appearing transparent.
- Color values in the design brief that don't match the Figma design.

**Phase to address:**
Phase 2 (Design Token Extraction) -- color conversion should be one of the first utilities built and tested.

---

### Pitfall 6: Image URLs Expire and Must Be Downloaded Immediately

**What goes wrong:**
The `GET /v1/images/:key` endpoint returns temporary S3 URLs for rendered images. These URLs expire after 14-30 days (14 days for image fills, 30 days for rendered images). Storing these URLs in the design brief or delaying download means the images will be broken links when Claude Code tries to reference them. The URLs are publicly accessible (no auth required), which is both a convenience and a security consideration.

**Why it happens:**
The API returns URLs, not binary data. It is natural to store the URL and defer download. But these are signed S3 URLs with expiration timestamps baked into the query parameters.

**How to avoid:**
- Download all images immediately after receiving URLs from the API. Use curl to save them to the project directory as part of the extraction pipeline.
- For the rendered PNG preview: request it, download it, and save it to a known path in the project before generating the design brief.
- For SVG/PNG asset exports: batch-request all asset node IDs in a single `GET /v1/images/:key` call, then download all returned URLs.
- Never store Figma CDN URLs in the design brief -- only reference local file paths.
- Be aware of the 32-megapixel limit: images larger than this are silently scaled down.

**Warning signs:**
- Design briefs referencing `https://figma-alpha-api.s3.us-west-2.amazonaws.com/...` URLs instead of local paths.
- Images that work when extracted but show as broken after a few days.
- Excessively large PNG downloads for high-resolution frames.

**Phase to address:**
Phase 2 (Asset Export) -- the image download pipeline must be integrated with the extraction flow, not bolted on afterward.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Fetch entire file tree without `ids`/`depth` | Works for small test files | Timeouts on real files, excessive memory, slow UX | Never -- always use targeted fetching |
| Skip error handling for 429 responses | Faster initial development | Users get cryptic errors, repeated failures | Never -- rate limit handling is core infrastructure |
| Store raw Figma node JSON in the design brief | Quick to implement, maximum data | Massive clipboard content, too much noise for Claude Code | MVP only -- must be replaced with structured summary |
| Hardcode color/spacing values instead of extracting tokens | Simpler extraction | Every design needs manual token identification | Never -- token extraction is core value proposition |
| Single curl call for everything | Simple implementation | Blocks on rate limits, no recovery from partial failures | Never -- pipeline should be multi-step with checkpoints |
| Skip node type checking during traversal | Fewer conditionals | Crashes on unexpected node types (STICKY, CONNECTOR, WIDGET) | MVP only -- add type guards before public release |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Figma REST API authentication | Sending token as query parameter or Bearer token | Use `X-Figma-Token` header: `curl -H "X-Figma-Token: <token>"` |
| Figma URL parsing | Assuming node IDs always use `:` separator | Figma URLs use `-` in the `node-id` parameter (e.g., `node-id=1-2`) but the API expects `:` (e.g., `1:2`). Always convert `-` to `:` when extracting from URLs |
| Image rendering endpoint | Requesting `format=svg` for complex frames with images | SVG export embeds raster images as black squares. Use PNG for complex frames with image fills. Reserve SVG for icons and simple vector shapes |
| Variables endpoint | Assuming Variables API is available to all users | Variables REST API is Enterprise-only. Fall back to extracting values from the node tree's `fills`, `strokes`, and `effects` properties for non-Enterprise users |
| shell.exec with curl | Not handling curl errors or non-zero exit codes | Check curl exit code AND HTTP status code. curl can succeed (exit 0) but return an HTTP 400/429/500 body |
| Node ID format in API | Passing node IDs with URL encoding issues | Node IDs contain colons (e.g., `123:456`). When used in URL query params, colons must be URL-encoded as `%3A` or the IDs must be comma-separated correctly |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Requesting images one node at a time | Extraction takes minutes, frequent 429 errors | Batch all node IDs into a single `GET /v1/images/:key?ids=A,B,C` call | After 10+ sequential image requests |
| Not using `depth` parameter | API calls take 30+ seconds, occasional timeouts | Set `depth` parameter appropriate to extraction needs | Files with 1000+ nodes or deep nesting (10+ levels) |
| Downloading full-resolution PNGs for preview | 10MB+ image files, slow clipboard copy | Use `scale=1` (default) or `scale=0.5` for preview images. Reserve higher scales only if user requests it | Frames wider than 2000px at 2x scale |
| Recursively processing every node type | Extraction processes sticky notes, connectors, widgets that add no code value | Filter by relevant node types: FRAME, GROUP, COMPONENT, INSTANCE, TEXT, RECTANGLE, ELLIPSE, VECTOR, LINE | Files that use FigJam elements or have annotations |
| Parsing JSON response synchronously in plugin thread | UI freezes during extraction of medium-to-large designs | Offload JSON parsing to a background step or process incrementally | JSON responses larger than 1MB |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Logging or displaying the full Figma personal access token | Token grants read access to ALL user's Figma files with no scope restriction | Show only last 4 characters in UI. Never log full token. Store in plugin storage (persisted per-project, not globally readable) |
| Including Figma token in generated design brief | Token ends up in clipboard, pasted into Claude Code, potentially logged | Never include the token in any output. The design brief should contain zero authentication data |
| Not warning users about token scope | User does not realize the PAT accesses everything in their Figma account | Display a clear warning during token setup: "This token grants access to all files in your Figma account" |
| Storing token in plaintext in a committed file | Token exposed in git history | Use Ship Studio's plugin storage API (`storage.get`/`storage.set`), which persists per-project and is not committed to git |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No progress indication during extraction | User thinks the plugin is frozen; clicks extract again, doubling API calls | Show step-by-step progress: "Fetching design tree..." / "Rendering preview..." / "Downloading assets..." |
| Cryptic error messages from API failures | User cannot diagnose whether the issue is their token, the URL, rate limits, or file permissions | Map HTTP status codes to human-readable messages: 403 = "Check your token permissions", 429 = "Rate limited -- try again in X seconds", 404 = "File or node not found" |
| No validation of pasted Figma URL before API call | User pastes a Figma community URL, prototype link, or dev mode URL that does not resolve to an API-accessible file/node | Validate URL format before making any API calls. Extract file key and node ID with regex. Reject URLs that are not `figma.com/design/` or `figma.com/file/` patterns |
| Dumping the entire raw node tree into the design brief | Claude Code receives 50,000+ tokens of nested JSON, most of which is irrelevant metadata | Summarize the tree: extract layout structure, meaningful properties, and design tokens. Strip internal Figma metadata (plugin data, version info, change tracking) |
| Not showing extraction results before copying to clipboard | User cannot verify what was extracted before pasting into Claude Code | Show a preview/summary of the extracted design brief before the user copies it |

## "Looks Done But Isn't" Checklist

- [ ] **URL Parsing:** Often missing handling for new Figma URL formats (e.g., `/design/` paths vs. legacy `/file/` paths, branch URLs, prototype links) -- verify with 5+ real Figma URLs of different types
- [ ] **Node ID Conversion:** Often missing the `-` to `:` conversion for node IDs extracted from URLs -- verify extracted IDs work in API calls
- [ ] **Color Extraction:** Often missing opacity/alpha handling -- verify extracted colors match Figma visually, including semi-transparent colors
- [ ] **Text Styles:** Often missing mixed-style text nodes (nodes where different character ranges have different fonts/sizes/colors) -- verify with a text node that has bold and regular text
- [ ] **Nested Components:** Often missing component instance overrides (text overrides, fill overrides, visibility toggles) -- verify with a component instance that has customized properties
- [ ] **Auto-Layout Gaps:** Often missing `itemSpacing` vs. `counterAxisSpacing` distinction (gap between items vs. gap between rows in wrapped layouts) -- verify with a wrapping auto-layout frame
- [ ] **Asset Export:** Often missing that SVG export produces black squares for nodes containing raster image fills -- verify SVG output for nodes that contain photographs or image fills
- [ ] **Empty Nodes:** Often missing null checks -- the `nodes` map from `GET /v1/files/:key/nodes` can contain null values for nodes that failed to render or do not exist
- [ ] **Gradient Extraction:** Often missing that `GRADIENT_ANGULAR` has no direct CSS equivalent -- verify gradient rendering matches Figma
- [ ] **Boolean Operations:** Often missing that BOOLEAN_OPERATION nodes (union, subtract, intersect, exclude) should be exported as SVG, not decomposed into child shapes -- verify vector shapes export correctly

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Full-file fetch causing timeouts | MEDIUM | Refactor API layer to accept node IDs, add `ids` parameter to all file endpoint calls, update URL parser |
| Rate limit blocking | LOW | Add retry logic with `Retry-After` header, batch image requests, add user-facing wait indicator |
| Broken color conversion | LOW | Fix multiplication factor (x255), add test suite with known Figma-to-CSS color pairs |
| Missing auto-layout absolute children | MEDIUM | Add `layoutPositioning` check to tree traversal, restructure layout output to separate flow vs. positioned children |
| Expired image URLs in briefs | LOW | Change to download-on-extract pattern, replace URL references with local file paths |
| Token stored insecurely | HIGH | Audit all storage/logging code, rotate compromised tokens, switch to plugin storage API |
| Raw JSON dumped to clipboard | MEDIUM | Build structured brief formatter, define output schema, filter irrelevant node properties |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Full-file fetch timeouts | Phase 1: API Client | Test with a 500+ node Figma file; API call returns in under 10s |
| Rate limit errors | Phase 1: API Client | Run 3 back-to-back extractions without 429 errors; verify retry logic fires on simulated 429 |
| URL parsing failures | Phase 1: URL Parser | Test with 10+ real Figma URLs of different formats; all correctly extract file key and node ID |
| Color value conversion | Phase 2: Token Extraction | Compare 10 extracted colors against Figma picker values; all match within rounding tolerance |
| Auto-layout mishandling | Phase 2: Layout Extraction | Extract a design with absolute-positioned children inside auto-layout; brief correctly identifies both flow and positioned children |
| Style two-step lookup | Phase 2: Token Extraction | Extract styles from a file with 5+ named styles; all style values (not just names) appear in brief |
| Image URL expiration | Phase 2: Asset Export | Extract a design with images; verify all referenced files exist locally and are valid images |
| Clipboard overflow | Phase 3: Brief Formatting | Extract a complex 50+ frame page; clipboard content is under 20,000 tokens and human-readable |
| SVG black squares | Phase 2: Asset Export | Export an icon set that includes both pure vector icons and icons with image fills; verify SVG quality |
| Token security | Phase 1: Auth Setup | Verify token never appears in logs, clipboard output, or design brief; verify storage uses plugin storage API |

## Sources

- [Figma REST API Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) -- Official rate limit tiers, leaky bucket algorithm, Retry-After headers (HIGH confidence)
- [Figma REST API Errors](https://developers.figma.com/docs/rest-api/errors/) -- 400/500 timeout errors for large requests, 429 rate limiting (HIGH confidence)
- [Figma REST API File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- depth parameter, ids parameter, image size limits, node response structure (HIGH confidence)
- [Figma REST API Variables](https://developers.figma.com/docs/rest-api/variables/) -- Enterprise-only restriction for Variables API (HIGH confidence)
- [Figma REST API Changelog](https://developers.figma.com/docs/rest-api/changelog/) -- OAuth scope changes, API updates (HIGH confidence)
- [Figma Forum: Images API 429 after ~10 requests](https://forum.figma.com/report-a-problem-6/rest-api-rate-limit-images-api-returns-429-after-10-requests-cloudfront-49021) -- CloudFront throttling on image endpoint (MEDIUM confidence)
- [Figma Forum: File endpoint request timeout](https://forum.figma.com/ask-the-community-7/figma-api-file-endpoint-request-timeout-13231) -- 55-second processing limit (MEDIUM confidence)
- [Figma Forum: REST API color values](https://forum.figma.com/t/trying-to-make-sense-of-the-rgb-values-returned-by-node-fills/10852) -- 0-1 float range for RGB (MEDIUM confidence)
- [Figma Forum: Styles metadata vs values](https://forum.figma.com/t/get-values-associated-with-styles-with-files-styles-api-call/1778) -- Two-step lookup for style values (MEDIUM confidence)
- [Figma Plugin API: RGB/RGBA](https://www.figma.com/plugin-docs/api/RGB/) -- Color format specification, opacity vs alpha (HIGH confidence)
- [Figma REST API spec TypeScript types](https://github.com/figma/rest-api-spec/blob/main/dist/api_types.ts) -- Node types, layout properties, component properties (HIGH confidence)
- [FigmaToCode](https://github.com/bernaferrari/FigmaToCode) -- Multi-step conversion approach, AltNode intermediate representation (MEDIUM confidence)
- [Figma Context MCP Issue #142](https://github.com/GLips/Figma-Context-MCP/issues/142) -- Large design context window overflow, chunking strategies (MEDIUM confidence)
- [figma-extractor](https://github.com/kataras/figma-extractor) -- Recursive tree traversal, color categorization by naming convention (MEDIUM confidence)
- [Figma Forum: Auto-layout absolute positioning](https://forum.figma.com/ask-the-community-7/auto-layout-makes-contents-absolutely-positioned-32364) -- layoutPositioning AUTO vs ABSOLUTE behavior (MEDIUM confidence)
- [Figma Plugin API: layoutPositioning](https://www.figma.com/plugin-docs/api/properties/nodes-layoutpositioning/) -- Absolute position within auto-layout documentation (HIGH confidence)

---
*Pitfalls research for: Figma design extraction via REST API*
*Researched: 2026-02-28*
