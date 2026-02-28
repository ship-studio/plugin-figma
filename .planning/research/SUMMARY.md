# Project Research Summary

**Project:** Ship Studio Figma Plugin
**Domain:** Figma design extraction for AI-assisted code generation
**Researched:** 2026-02-28
**Confidence:** HIGH

## Executive Summary

The Ship Studio Figma plugin is a design extraction tool that runs inside the Ship Studio desktop app (Tauri-based) and produces framework-agnostic design briefs for Claude Code to consume. Unlike competitors (Locofy, Anima, Builder.io) that generate framework-specific code divorced from project context, this plugin produces a structured markdown brief containing layout structure, design tokens, component inventory, and asset references — letting Claude Code generate code that fits the user's actual project. The competitive landscape has clearly bifurcated into code generators (poor production fit) and context providers (the emerging pattern), and this plugin sits in the context-provider category with a simpler workflow than Figma MCP (no server setup, no framework assumptions, paste-and-go).

The recommended approach is a six-stage linear pipeline: URL Parser -> API Client -> Node Tree Parser -> Token Extractor -> Asset Exporter -> Brief Formatter. Each stage produces typed intermediate data structures consumed by the next. The most critical architectural constraint is that the plugin cannot make direct HTTP requests — all Figma REST API calls must go through `shell.exec` + `curl`. This eliminates third-party Figma client libraries and requires a custom curl-based API client. The stack is lean: TypeScript 5.x with `@figma/rest-api-spec` for type safety, React and Vite inherited from the Ship Studio plugin starter, and optionally Zod for runtime validation of curl output.

The key risks are front-loaded in the API layer: fetching full file trees instead of targeted nodes causes timeouts and memory exhaustion; rate limits are severe on non-Enterprise plans (as low as 10 req/min); and Figma's color format (0-1 float range, not 0-255) will produce silently wrong output if not handled from the start. These pitfalls are all addressable by building the right patterns into Phase 1 before any extraction logic is written. The Node Tree Parser is the highest-complexity component and the critical path for the entire pipeline — everything else depends on its normalized output.

## Key Findings

### Recommended Stack

The stack is tightly constrained by the Ship Studio plugin platform. React (host-provided), Vite, and TypeScript 5.x are not choices — they come from the plugin starter template. The only meaningful dependency decision is `@figma/rest-api-spec` (v0.36.0, published January 2026), which provides official TypeScript types for every Figma REST API response shape and eliminates the need to hand-write Figma types. No Figma API client library can be used because all network access must go through `shell.exec` + `curl`.

**Core technologies:**
- **TypeScript 5.x**: Type safety — required for consuming `@figma/rest-api-spec` types; catches Figma API response shape errors at compile time
- **`@figma/rest-api-spec` v0.36.0**: Figma API types — official Figma package, zero dependencies, covers all node types, auto-layout, paint, typography, and effect types
- **`shell.exec` + `curl`**: HTTP transport — the only way to make network requests from a Ship Studio plugin; all Figma REST API calls go through this path
- **Zod v4 (optional)**: Runtime validation — validates curl response JSON before processing; `@zod/mini` at ~2KB gzipped if bundle size is a concern

Defer `svgo` for SVG optimization — it requires `shell.exec` to run and adds complexity; evaluate only if raw SVG quality is insufficient.

### Expected Features

The feature landscape is well-defined. Competitors Locofy, Anima, Builder.io, and Figma MCP all extract layout structure and design tokens — these are table stakes. The differentiator is the framework-agnostic brief format rather than framework-specific code output.

**Must have (table stakes — v1):**
- **Figma URL input + PAT authentication** — foundational; nothing works without this
- **Layout structure extraction** — auto-layout hierarchy, sizing modes, spacing, alignment; the core differentiator and highest-complexity task
- **Design token extraction** — colors, typography, spacing, radii, shadows; AI needs these to avoid hardcoded values
- **Rendered PNG of selection** — visual reference alongside structured data; critical for AI accuracy
- **Component identification** — detect INSTANCE nodes, surface component names and basic variant info
- **Structured brief formatting** — combine all data into a coherent markdown brief under ~12K tokens
- **Clipboard output** — paste-ready workflow into Claude Code; friction kills adoption

**Should have (v1.x — add after core proves valuable):**
- **Asset export (SVG icons, PNG images)** — needed when Claude Code cannot reference icons from descriptions
- **Component property mapping** — full variant/boolean/text props for accurate code generation
- **Design token tiering** — primitive/semantic/component hierarchy produces more consistent code
- **Brief size awareness and chunking** — prevents degraded AI output for large selections
- **Scope selection (frame/page/node)** — allows extracting more than individual frames
- **Accessibility data extraction** — alt text, aria-hidden markers, semantic HTML hints

**Defer (v2+):**
- Visual annotations / Dev Mode data
- W3C DTCG token format export
- Batch extraction, brief templates, Figma Variables API integration (Enterprise-only anyway)

**Anti-features to avoid:** code generation with framework targets, OAuth, real-time sync, full design system import, responsive breakpoint stitching.

### Architecture Approach

The architecture is a linear six-component pipeline with clear component boundaries and typed intermediate data structures. No component calls back to a previous stage. The pipeline is naturally organized into three phases: Foundation (URL Parser + API Client), Core Extraction (Node Tree Parser + Token Extractor), and Assets + Output (Asset Exporter + Brief Formatter). Assets can be parallelized with token extraction since both consume API Client output independently.

**Major components:**
1. **URL Parser** — Pure function; extracts `fileKey` and `nodeIds` from Figma URLs (both `/file/` legacy and `/design/` current formats); handles URL-encoded node IDs
2. **API Client** — Wraps all `shell.exec` + `curl` calls with auth headers, JSON parsing, error handling, and rate-limit retry; typed with `@figma/rest-api-spec` response types
3. **Node Tree Parser** — Depth-first traversal of raw Figma JSON; produces normalized `DesignTree` with flat node list and hierarchy metadata; classifies nodes by role (container, shape, text, component, vector)
4. **Token Extractor** — Walks parsed tree; deduplicates and categorizes colors (0-1 float converted to hex/rgba), typography, spacing, radii, and shadows
5. **Asset Exporter** — Requests image renders and downloads assets to `/.figma-assets/` directory via curl; returns file path manifest; must download immediately (S3 URLs expire)
6. **Brief Formatter** — Assembles `DesignTree` + `DesignTokens` + `ExportedAsset[]` into a markdown design brief under ~12K tokens; outputs to clipboard

Key patterns: shell-based API client with retry, depth-first tree walker with visitor, progressive extraction (fail-forward with warnings), file-based asset pipeline with predictable naming.

### Critical Pitfalls

1. **Fetching entire file trees without `ids`/`depth` parameters** — Figma files can be tens of megabytes; Figma enforces a 55-second processing limit; the Ship Studio shell timeout is 120 seconds. Always use `GET /v1/files/:key/nodes?ids=X` when node IDs are available. Never fetch the full file as a first resort.

2. **Ignoring rate limits** — Starter plan users get only 10 req/min on Tier 1 endpoints; View/Collab seats are 6 requests per *month*. The image rendering endpoint triggers CloudFront throttling after ~10 sequential requests. Batch all image export node IDs into a single API call; implement `Retry-After` header-respecting backoff from day one.

3. **Mishandling auto-layout to CSS mapping** — Children with `layoutPositioning: "ABSOLUTE"` are taken out of flex flow while remaining visually nested. `FILL` sizing maps to `flex: 1` only when the parent has auto-layout in that axis, not unconditionally. Check `layoutPositioning` on every child, not just `layoutMode` on the parent. Output layout intent (not CSS) and let Claude Code translate.

4. **Figma colors use 0-1 float range, not 0-255** — Passing raw Figma color values to CSS output silently produces nearly-black or nearly-invisible colors. Alpha is on the paint's `opacity` property, not the color object for solid paints. Build and test the color conversion utility before anything else in token extraction.

5. **Image URLs expire; S3 URLs must be downloaded immediately** — `GET /v1/images` returns temporary S3 URLs (14-30 day expiration). Never store these URLs in the brief — download all assets to local paths during extraction and reference local paths only.

6. **Styles require two-step lookup** — `GET /v1/files/:key/styles` returns only metadata (name, type), not values. Style values (fill colors, font properties, shadow parameters) live on associated nodes. Must batch-fetch those nodes with a second API call to get actual token values.

## Implications for Roadmap

Based on research, the architecture's natural build-order dependency chain maps directly to a three-phase roadmap. All critical pitfalls cluster in Phase 1 (API infrastructure) and Phase 2 (extraction logic). Phase 3 is integration and output.

### Phase 1: Foundation — API Infrastructure and Auth

**Rationale:** URL Parser and API Client have zero dependencies on each other and zero dependencies on any other component. They must exist before any extraction work can begin. All the most severe pitfalls (timeouts, rate limits, URL parsing failures, token security) must be addressed here — retrofitting these patterns later is expensive.

**Delivers:** Working Figma API client with auth, rate-limit retry, targeted node fetching, and URL parsing for all Figma URL formats. Validated against real Figma files.

**Addresses (from FEATURES.md):** Figma URL input, personal access token management, foundational API access enabling everything else.

**Avoids (from PITFALLS.md):** Full-file fetch timeouts, rate limit blocking, URL parsing failures, token security mistakes, curl exit-code vs HTTP-status-code confusion, node ID `-` to `:` conversion.

**Research flag:** Standard patterns — well-documented in official Figma REST API docs. No additional research needed.

### Phase 2: Core Extraction — Layout, Tokens, and Assets

**Rationale:** Node Tree Parser depends on API Client output (Phase 1). Token Extractor depends on Node Tree Parser output. Asset Exporter reuses the API Client. These three components together produce all the raw data the brief needs. This is the highest-complexity phase (layout extraction is the hardest technical problem in the project) and should not be split — the outputs are tightly coupled.

**Delivers:** Normalized design tree with auto-layout semantics, deduplicated design tokens (colors correctly converted from 0-1 float, typography, spacing), and asset files downloaded to project directory.

**Implements (from ARCHITECTURE.md):** Node Tree Parser (depth-first visitor pattern), Token Extractor (progressive extraction with warnings), Asset Exporter (file-based asset pipeline).

**Addresses (from FEATURES.md):** Layout structure extraction, design token extraction, rendered PNG of selection, asset export, component identification.

**Avoids (from PITFALLS.md):** Auto-layout absolute children mishandling, color 0-1 float conversion errors, style two-step lookup for token values, image URL expiration (download immediately), SVG black squares for raster-filled nodes, null node handling.

**Research flag:** Needs deeper research on auto-layout edge cases (absolute positioning within auto-layout, `FILL` sizing across axes, `layoutWrap` with `counterAxisSpacing`). Well-documented patterns exist for tree walking and token extraction, but real-world Figma file variation requires testing against diverse files.

### Phase 3: Brief Formatting and UI

**Rationale:** Brief Formatter is explicitly the last component — it depends on all upstream outputs. The plugin UI wraps the entire pipeline and can only be finalized once the data shape is known. Building UI early risks rebuilding it when data shapes change.

**Delivers:** Structured markdown brief under ~12K tokens, clipboard output, progress indication during multi-step extraction, clear error messages mapped from HTTP status codes, brief preview before copy.

**Implements (from ARCHITECTURE.md):** Brief Formatter (markdown assembly from `DesignTree` + `DesignTokens` + `ExportedAsset[]`).

**Addresses (from FEATURES.md):** Structured brief formatting, clipboard output, semantic layer naming hints in the brief, brief size awareness (warn if >12K tokens estimated).

**Avoids (from PITFALLS.md):** Raw JSON dumped to clipboard (50K+ token noise), no progress indication (user thinks plugin frozen), cryptic error messages, no brief preview before copy.

**Research flag:** Standard patterns — markdown templating with string interpolation is well-understood. No additional research needed. Token count estimation is straightforward (character count / 4 approximation is sufficient for warnings).

### Phase 4: Polish and v1.x Features

**Rationale:** After the core pipeline is validated (users confirm the brief format produces better Claude Code output than screenshots), add the v1.x differentiating features. These are independent additions on top of the stable pipeline.

**Delivers:** Component property mapping (full variant/boolean/text props), token tiering (primitive/semantic/component), scope selection (frame/page/node), accessibility data extraction, brief chunking for large selections.

**Addresses (from FEATURES.md):** All P2 features from the prioritization matrix.

**Avoids:** Premature optimization — these features add value only after the core extraction is proven. Building them before the core is validated risks building the wrong thing.

**Research flag:** Component property mapping may need research into Figma component property API shape (variant properties, boolean properties, text properties, instance swap properties). The `@figma/rest-api-spec` types cover this but real-world component structures vary.

### Phase Ordering Rationale

- **Foundation first:** Every other component depends on the API Client and URL Parser. The pitfalls that require the most careful design (rate limits, targeted fetching, token security) all live here. Getting this right before writing any extraction logic saves major refactoring cost.
- **Core Extraction as a unit:** The Node Tree Parser, Token Extractor, and Asset Exporter share a common data flow (tree -> tokens/assets). Building them together allows the data types to evolve with real Figma API data before they are locked in by the Brief Formatter.
- **Brief Formatting last among core components:** The Brief Formatter is the integration point for all upstream data. Its markdown schema cannot be finalized until the upstream types stabilize. Building it last avoids rework.
- **v1.x features as a separate phase:** The core thesis (structured brief beats screenshot for Claude Code) must be validated before investing in differentiating features. Real user feedback determines which P2 features matter most.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** Auto-layout edge cases (absolute positioning within auto-layout frames, `layoutWrap` + `counterAxisSpacing` interaction, `FILL` sizing on non-auto-layout axes). Test against at least 5 diverse real-world Figma files before considering layout extraction done.
- **Phase 4:** Figma component property schema for variant properties, boolean properties, text properties, and instance swap properties — ensure `@figma/rest-api-spec` types cover these adequately before designing the component property mapping output.

Phases with standard patterns (skip research-phase):
- **Phase 1:** URL parsing and curl-based API clients are well-documented. The Figma API docs cover all authentication, rate limits, and endpoint parameters comprehensively.
- **Phase 3:** Markdown brief formatting is standard string templating. No novel patterns needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All key decisions verified against official Figma docs and npm registry. `@figma/rest-api-spec` v0.36.0 confirmed active as of January 2026. Shell transport constraint verified against Ship Studio platform docs. |
| Features | HIGH | Table stakes validated by cross-referencing 5+ real products (Locofy, Anima, Builder.io, Figma MCP, Figma Dev Mode). MVP definition is clear. Anti-features grounded in architectural rationale, not opinion. |
| Architecture | HIGH | Six-component pipeline matches patterns from reference implementations (figma-extractor, monday.com production pipeline). Data types derived from official `@figma/rest-api-spec` types. Build order rationale is dependency-driven, not arbitrary. |
| Pitfalls | HIGH | Critical pitfalls verified against official Figma REST API documentation and community forum reports. Color format (0-1 float), rate limits, and style two-step lookup are all confirmed in official docs. |

**Overall confidence:** HIGH

### Gaps to Address

- **Zod adoption decision:** MEDIUM confidence. Whether to use `@zod/mini` for runtime validation of curl output vs. manual try/catch + type assertions is unresolved. Decide in Phase 1 implementation based on how noisy real Figma API error responses turn out to be.
- **SVGO necessity:** LOW confidence. Raw SVG quality from Figma's export endpoint is untested. Evaluate in Phase 2 (Asset Exporter) with real exported SVGs before committing to the complexity of running SVGO via `shell.exec`.
- **Brief token count thresholds:** The 12K token limit for AI accuracy comes from a practitioner report (MEDIUM confidence). Validate with real briefs and Claude Code during Phase 3. May need adjustment up or down.
- **Auto-layout edge cases in production files:** The `layoutWrap` + `counterAxisSpacing` interaction and absolute-positioned children within auto-layout are documented but their frequency in real user files is unknown. Phase 2 testing with real files will surface any additional edge cases not covered in research.

## Sources

### Primary (HIGH confidence)
- [Figma REST API Documentation](https://developers.figma.com/docs/rest-api/) — endpoints, rate limits, authentication, errors
- [Figma REST API File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) — `ids`, `depth` parameters, node response structure
- [Figma REST API Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) — leaky bucket algorithm, plan-tier limits, Retry-After headers
- [Figma REST API Scopes](https://developers.figma.com/docs/rest-api/scopes/) — `file_content:read` scope coverage
- [Figma REST API Variables](https://developers.figma.com/docs/rest-api/variables/) — Enterprise-only restriction confirmed
- [Figma REST API Changelog](https://developers.figma.com/docs/rest-api/changelog/) — API currency verified
- [@figma/rest-api-spec on npm](https://www.npmjs.com/package/@figma/rest-api-spec) — v0.36.0, published 2026-01-21
- [@figma/rest-api-spec on GitHub](https://github.com/figma/rest-api-spec) — official Figma TypeScript types
- [Figma Dev Mode](https://www.figma.com/dev-mode/) — competitive feature analysis
- [Figma MCP Server Guide](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) — competitive analysis, output format comparison
- [Figma Plugin API: layoutPositioning](https://www.figma.com/plugin-docs/api/properties/nodes-layoutpositioning/) — ABSOLUTE vs AUTO behavior
- [Figma Plugin API: RGB/RGBA](https://www.figma.com/plugin-docs/api/RGB/) — 0-1 float color format, opacity vs alpha
- [Figma Accessibility Features](https://help.figma.com/hc/en-us/articles/31242789265431-Improve-the-accessibility-of-your-site) — alt text, aria-hidden support
- [W3C Design Tokens Spec Stable](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) — DTCG format confirmed stable October 2025
- [Figma OpenAI Codex Partnership](https://openai.com/index/figma-partnership/) — competitive landscape context
- [Figma-Anthropic Claude Code to Figma](https://www.figma.com/blog/introducing-claude-code-to-figma/) — market validation for context-provider approach
- [Zod v4](https://zod.dev/) — v4.3.6, 57% smaller than v3, verified via npm

### Secondary (MEDIUM confidence)
- [Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) — architecture reference for node tree simplification
- [FigmaToCode](https://github.com/bernaferrari/FigmaToCode) — AltNode intermediate representation pattern, Figma-to-CSS conversion approach
- [figma-extractor by kataras](https://github.com/kataras/figma-extractor) — extraction pipeline structure, recursive tree traversal patterns
- [monday.com design-to-code pipeline](https://engineering.monday.com/how-we-use-ai-to-turn-figma-designs-into-production-code/) — production architecture reference
- [Figma Forum: Images API 429](https://forum.figma.com/report-a-problem-6/rest-api-rate-limit-images-api-returns-429-after-10-requests-cloudfront-49021) — CloudFront throttling on image endpoint, ~10 request limit
- [Figma Forum: File endpoint timeout](https://forum.figma.com/ask-the-community-7/figma-api-file-endpoint-request-timeout-13231) — 55-second processing limit
- [Figma Forum: REST API color values](https://forum.figma.com/t/trying-to-make-sense-of-the-rgb-values-returned-by-node-fills/10852) — 0-1 float range for RGB
- [Figma Forum: Styles metadata vs values](https://forum.figma.com/t/get-values-associated-with-styles-with-files-styles-api-call/1778) — two-step lookup requirement
- [AI Code Generation Token Limits](https://medium.com/@reuvenaor85/the-way-to-figma-mcp-pixel-perfect-code-generation-for-react-tailwind-1623fd5383b8) — ~12K token threshold for near pixel-perfect accuracy
- [Design Tokens for AI](https://learn.thedesignsystem.guide/p/design-tokens-that-ai-can-actually) — three-tier token hierarchy rationale

### Tertiary (LOW confidence)
- [Locofy.ai](https://www.locofy.ai/) — competitive feature list (marketing material, cross-referenced with community listing)
- [Anima](https://www.animaapp.com/figma) — competitive feature list (marketing material)
- [Builder.io Visual Copilot](https://www.builder.io/blog/figma-to-code-visual-copilot) — competitive feature list (official blog)
- [SVGO v4](https://svgo.dev/) — may not be needed; evaluate in Phase 2

---
*Research completed: 2026-02-28*
*Ready for roadmap: yes*
