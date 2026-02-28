# Project Research Summary

**Project:** Ship Studio Figma Plugin — v1.1 (Smart Asset Detection, Brief Instructions, UX Simplification)
**Domain:** Figma design extraction for AI-assisted code generation
**Researched:** 2026-02-28
**Confidence:** HIGH

## Executive Summary

This plugin is a Ship Studio toolbar plugin that extracts structured design data from Figma files and assembles a markdown brief for Claude Code to generate implementation-ready code. The core thesis — proven by v1.0 — is that a structured design brief outperforms a raw screenshot for AI code generation because it carries layout semantics, design tokens, and component identity that images cannot convey. v1.1 targets the remaining 20% failure rate caused by three specific v1.0 gaps: complex illustrations being described textually instead of exported as images (causing Claude Code to fabricate replacements), assets lacking positional context in the brief, and a UX flow that confused non-technical users with jargon and too many steps.

The recommended approach for v1.1 is strictly additive to the existing v1.0 six-stage linear pipeline: insert composition analysis before asset identification, insert asset-to-layout mapping after export, and add an instructions section to the brief template. No refactoring of core infrastructure is required. The architecture is a clean layered pipeline (URL Parser → API Client → Layout Normalization → Token Extraction → Asset Export → Brief Assembly) with new modules slotting in at well-defined integration points. All new components are pure functions — testable independently, no side effects, deterministic output.

The primary risks for v1.1 are heuristic calibration (composition detection that is either too aggressive, bloating the asset directory, or too conservative, still missing complex illustrations) and brief instruction engineering (instructions must be 2-3 behaviors maximum — beyond that, Claude Code compliance degrades). Both risks are addressable through incremental validation against real Figma files before shipping. The transport constraint — all HTTP must go through `shell.exec` + `curl`, no native fetch — is already solved by v1.0 and poses no new risk for v1.1 changes.

## Key Findings

### Recommended Stack

The stack is entirely constrained by the Ship Studio plugin environment. React, TypeScript 5.x, and Vite are inherited from the Ship Studio plugin starter and cannot be changed. The only meaningful dependency additions are `@figma/rest-api-spec` (official Figma types, zero runtime dependencies, actively maintained as of January 2026) for compile-time safety, and optionally `zod` for runtime validation of curl responses. All Figma REST API calls go through `shell.exec` + `curl` — the only transport available in Ship Studio plugins. Client libraries like `figma-api` and `figma-js` are excluded because they use HTTP clients that do not exist in this environment.

For v1.1 specifically, no new dependencies are needed. The new `compose.ts` and `asset-mapping.ts` modules are pure TypeScript utility functions with zero external dependencies beyond LayoutNode types already defined in the codebase.

**Core technologies:**
- `@figma/rest-api-spec` ^0.36.0: Official Figma REST API types — all node types, auto-layout properties, paint types, and response shapes at compile time; zero runtime dependencies
- `shell.exec` + `curl`: The only HTTP transport available in Ship Studio plugins — all Figma API calls go through this path
- React (host-provided): UI framework — Ship Studio injects React as a shared instance; plugins do not bundle their own
- TypeScript 5.x: Type safety — required for consuming `@figma/rest-api-spec` and catching API response shape errors at compile time
- `zod` ^4.3.6 (optional): Runtime validation of curl string responses — catches malformed JSON, auth errors, and API changes; `@zod/mini` at ~2KB gzipped if bundle size is critical

**Critical constraint notes:**
- Figma Variables REST API is Enterprise-only; extract design tokens from node style properties instead (covers 90%+ of use cases)
- Rate limits: Tier 2 endpoints at 50 req/min; batch image export node IDs in a single `/v1/images` call to stay within limits
- Figma URLs exist in both `figma.com/file/KEY/...` and `figma.com/design/KEY/...` formats; URL parser must handle both
- Ship Studio shell timeout is 120s; use node-specific endpoints with `ids` parameter, never full-file fetches on large designs

### Expected Features

Research identified a clear v1 (ship), v1.x (add after validation), and v2+ (defer) split. The v1.1 milestone specifically targets features that v1.0 user testing proved necessary to close the 80% → ~100% accuracy gap.

**Must have for v1.1 (table stakes):**
- Smarter asset detection — v1.0 gap: complex nested illustrations described as text caused Claude Code to fabricate replacements; users expect "if it looks like an image, export as image"
- Asset-to-layout mapping — v1.0 gap: flat asset list without positional context left Claude Code guessing which asset belongs where in the layout tree
- Brief instructions (plan mode, asset-only rule, verification checklist) — explicit 2-3 behavior guidance for Claude Code reduces hallucination and improves first-build accuracy
- Human-friendly UX terminology — v1.0 jargon ("Extraction Scope", "Single Node") confused non-technical users; plain language reduces cognitive load

**Should have for v1.1 (differentiators):**
- Smart composition detection with complexity scoring (child count, nesting depth, vector path count, blend/mask presence)
- Breadcrumb asset mapping in brief (e.g., "Card > Header > Icon") — eliminates placement guesswork for Claude Code
- Executable verification loop — checklist tied to actual extracted tokens and assets, not vague instructions
- Progressive asset disclosure in results UI — group by type (icons, illustrations, photos); show count upfront before extraction

**Firm anti-features (explicitly out of scope for v1.1):**
- Code generation with framework targets — the entire Ship Studio thesis is that Claude Code generates better code in project context
- Automatic component detection from structure alone — over/under-detects without designer naming intent from Figma
- Real-time design sync — polling/webhook complexity not justified by per-session use case
- Multi-file batch extraction — explodes scope; extract one frame at a time

**Defer to v2+:**
- W3C DTCG token format export
- Visual annotations / Dev Mode data inclusion
- Brief templates / customization
- Integration with Figma Variables API (Enterprise-only)

### Architecture Approach

The v1.0 baseline is a six-stage linear pipeline: URL Parser → Figma API Client → Layout Normalization → Token Extraction → Asset Export → Brief Assembly. This pipeline is sound and v1.1 extends it without any refactoring. Two new pure-function modules are inserted at well-defined seams: `assets/compose.ts` (composition analysis, runs before `identify.ts`) and `brief/asset-mapping.ts` (layout-to-asset linking, runs after `export.ts`). Four existing modules receive targeted modifications: `identify.ts`, `export.ts`, `generate.ts`, and `MainView.tsx`. All other modules are untouched.

The key architectural pattern for v1.1 is **metadata augmentation before classification**: analyze node complexity first (compose.ts), then use that metadata when classifying assets (identify.ts). This enables early UI warnings about composition export count before expensive API calls begin, and keeps asset classification logic clean and independently testable.

**Major components for v1.1:**
1. `assets/compose.ts` (NEW) — Walk LayoutNode tree, score composition complexity (vectorCount, nesting depth, blend/mask presence), return `CompositionCandidate[]` for use in asset classification
2. `brief/asset-mapping.ts` (NEW) — Traverse layout tree, build nodeId → breadcrumb map, match exported assets to their tree position, return `AssetMapping[]` for brief inclusion
3. `assets/identify.ts` (MODIFIED) — Accept `CompositionCandidate[]` as input; route complex compositions to `png-render` export type instead of SVG text description; backward compatible
4. `assets/export.ts` (MODIFIED) — Route `png-render` entries through the same `/v1/images` batch endpoint as SVG exports; split results by type post-call
5. `brief/generate.ts` (MODIFIED) — Add `buildInstructionsSection()` (plan mode, asset-only rule, verification) and `buildAssetMappingTable()`; update section order (Metadata → Instructions → Preview → Tree → Tokens → Components → Asset Mapping)
6. `views/MainView.tsx` (MODIFIED) — Surface composition count warning before extraction starts; simplify terminology ("What to extract?" not "Extraction Scope"); make tree preview collapsible; add "Rendering compositions..." progress phase label

**Key patterns:**
- Pure function data transformation throughout — all new modules are side-effect free, fully testable, deterministic
- Composition analysis at identification time (not export time) — enables early warnings and clean API batching
- Breadcrumb depth capped at 3 levels — preserves useful context without overwhelming the brief reader
- Modular brief section builders — each section is an independent function, testable in isolation, easy to add/remove

### Critical Pitfalls

1. **Over-exporting everything as images** — Heuristic too aggressive bloats the asset directory (50+ files) and confuses Claude Code with irrelevant choices. Prevention: define explicit complexity thresholds before implementation (3+ nested children AND at least one: gradient, mask, blur, or complex path); measure "% of exported assets used in Claude Code output" and target >80%; add debug mode logging why each node was exported.

2. **Under-exporting complex compositions** — Heuristic too conservative and v1.0's core failure persists. Prevention: collect 5-10 real Figma files where v1.0 failed (Claude Code fabricated replacements); build the heuristic from these concrete examples, not from theory; specifically verify that all known problem cases now export as images.

3. **Too many brief instructions — Claude Code compliance degrades** — More than 2-3 behaviors in an instruction list causes model compliance to drop. Instructions that conflict or cannot be executed (e.g., "verify against PNG" when Claude Code cannot open files) are actively harmful. Prevention: limit to 2-3 core behaviors; use positive framing not imperatives; A/B test before shipping; treat the instruction template as versioned code.

4. **Asset mapping misaligned with actual export filenames** — Asset filename in brief does not match the file actually written to disk, or breadcrumb is stale because it was computed before the export step renamed the file. Prevention: derive filenames from Figma layer names at classification time (before export); use nodeId as the stable foreign key to join mapping and export results; validate with an unfamiliar user ("can you identify where each asset belongs?").

5. **API rate limiting causes mid-extraction failures on complex designs** — Complex designs with many assets can require 50-150 API calls; hitting 429 partway through breaks the extraction with a poor error message. Prevention: batch all image export node IDs in a single `/v1/images` call; implement retry with exponential backoff on 429 (read `Retry-After` header); show progress count during extraction; surface a clear "rate limited — retry in X seconds" message.

6. **UX simplification removes power user workflows** — Hiding advanced options without a disclosure path alienates users who extract subsets, manage token deduplication, or need to verify what was exported before using the brief. Prevention: progressive disclosure (hide, do not remove); quick path by default, advanced options behind a toggle; test with both new users and power users before shipping.

7. **Composition heuristic breaks on Figma edge cases: masks, rotations, boolean operations** — Standard child-count and depth heuristics miss visually complex nodes that use rotation transforms, MaskMixin clipping, or boolean path operations. Prevention: study Figma API VectorNode, BlendMixin, MaskMixin, and InstanceNode types; add explicit checks for these properties in classifyNode(); build a regression test suite for each edge case discovered during testing.

## Implications for Roadmap

This is a targeted improvement milestone, not a ground-up build. The phase structure follows the implementation dependency chain identified in ARCHITECTURE.md, with the first phase addressing zero-backend changes (instructions text, UX copy) to validate brief format improvements before investing in backend complexity.

### Phase 1: Brief Instructions and Terminology Cleanup

**Rationale:** Zero backend risk — all changes are text in the brief template and UI copy. Ships value immediately and establishes a measurable success baseline for whether instruction engineering alone improves Claude Code accuracy. A/B test results from Phase 1 inform how to attribute Phase 2 impact. Delivers before any complex heuristic work begins.

**Delivers:** Updated brief template with plan-mode instruction, asset-only rule, and verification checklist (2-3 behaviors max); human-friendly UI terminology throughout; collapsible tree preview in results screen; clarified progress labels.

**Addresses:** Asset-only rule instruction, plan mode instruction, brief verification instruction, human-friendly terminology (all LOW complexity, Phase 1 per FEATURES.md v1.1 table stakes)

**Avoids:** Pitfall 3 (too many instructions — limit to 2-3 and test for compliance), Pitfall 6 (instructions Claude Code cannot execute — verify each instruction is actionable)

**Research flag:** Standard patterns — brief instruction engineering follows established prompt engineering guidelines (positive framing, 2-3 behaviors, no conflicts). Validate with A/B test before committing to template. No technical deep-dive needed.

### Phase 2: Smarter Asset Detection and Asset-to-Layout Mapping

**Rationale:** This is the highest-value and highest-risk work in v1.1. The composition detection heuristic is the core technical bet — must be validated against real v1.0 problem cases before merging. All four new/modified backend modules (`compose.ts`, `identify.ts`, `export.ts`, `asset-mapping.ts`) are tightly coupled and should ship together. Building them as a unit reduces integration testing complexity.

**Delivers:** `assets/compose.ts` (composition complexity analysis); updated `identify.ts` (composition-aware classification with `png-render` type); updated `export.ts` (batch PNG render support via `/v1/images`); `brief/asset-mapping.ts` (breadcrumb mapping with 3-level cap); updated `generate.ts` (asset mapping table section); updated `assets/types.ts` (add `png-render` to exportType union); updated `brief/types.ts` (add `AssetMapping[]` to `BriefInput`).

**Addresses:** Smarter asset detection, asset-to-layout mapping, smart composition detection, breadcrumb asset mapping in brief (all Phase 2 per FEATURES.md v1.1)

**Avoids:** Pitfall 1 (over-export — define explicit thresholds first), Pitfall 2 (under-export — validate against v1.0 problem cases), Pitfall 4 (asset mapping misalignment — use nodeId as stable key), Pitfall 7 (edge cases: masks, rotations, boolean ops — study Figma API node types first)

**Research flag:** Needs research/validation. Heuristic thresholds (vectorCount > 5 = complex, > 2 = moderate) are theoretical starting points — must be tuned against at least 5 diverse real Figma files including known v1.0 failure cases before shipping. Additionally: verify Figma `/v1/images` endpoint batching behavior for mixed-format requests (SVG + PNG render in one call) before implementing the batch in `export.ts`; have a fallback to separate calls if the endpoint does not support mixed formats.

### Phase 3: UX Simplification and Results Screen Polish

**Rationale:** UI changes wrap the backend behavior from Phase 2. The composition count warning in `MainView.tsx` requires `compose.ts` to be complete. Results screen simplification and progressive asset disclosure are independent of backend but benefit from having real asset counts and types to design around. Placing UX changes last prevents rebuilding the UI when the data model is still evolving in Phase 2.

**Delivers:** Composition count warning before extraction starts ("This design has 5 complex compositions — they will export as PNG"); simplified results screen with progressive disclosure (quick view default, expandable details); grouped asset display by type (icons, illustrations, photos); "Rendering compositions..." progress phase label.

**Addresses:** Simplified UX flow, progressive asset disclosure (Phase 3 per FEATURES.md v1.1)

**Avoids:** Pitfall 5 (UX simplification breaking power user workflows — hide with a toggle, do not remove; test with power users before shipping)

**Research flag:** Standard patterns — progressive disclosure is well-documented UX. Test with both new and power users before shipping. No technical research needed.

### Phase Ordering Rationale

- Phase 1 before Phase 2: instructions are zero-risk and establish a measurable success baseline; A/B test from Phase 1 provides attribution context for Phase 2 improvements
- Phase 2 as a single phase: `compose.ts`, `identify.ts`, `export.ts`, `asset-mapping.ts`, and `generate.ts` are tightly coupled — ship together to avoid partial states that are hard to test
- Phase 3 last: `MainView.tsx` composition warning depends on `compose.ts` (Phase 2); results screen design is more informed with real asset data from Phase 2 completed
- Backend phases (1, 2) before UX polish (3): underlying data model should be stable before final UX layer is built

### Research Flags

Phases needing deeper research during planning:
- **Phase 2 — Composition heuristic:** The threshold values (vectorCount > 5 = complex) are theoretical hypotheses. Collect v1.0 failure cases before implementing. Test on at minimum: simple app UI, complex illustration page, design system file, file with masks/rotations/boolean operations. Build the heuristic from failure cases, not from theory.
- **Phase 2 — Figma API mixed-format batching:** Whether `/v1/images` handles mixed SVG + PNG render node IDs in a single request is not explicitly confirmed in official docs. Verify with a test call before implementing the combined batch in `export.ts`. Have a separate-calls fallback ready.
- **Phase 2 — Figma node type edge cases:** Study `VectorNode` (vectorNetwork, complex paths), `BlendMixin` (effects: gradients, blur, shadows), `MaskMixin` (clipping), and `InstanceNode` behavior in the Figma plugin API docs before writing `classifyNode()`. These are the most common sources of heuristic edge case failures.

Phases with standard patterns (skip deeper research):
- **Phase 1:** Brief instruction engineering follows established Claude prompt engineering guidelines. No novel patterns needed — validate with A/B test not research.
- **Phase 3:** Progressive disclosure and results screen grouping are well-understood UX patterns. Validate with users, not research.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All constraints verified against Ship Studio plugin environment; Figma API endpoints and rate limits confirmed against official docs; `@figma/rest-api-spec` v0.36.0 confirmed active (published 2026-01-21); no new dependencies needed for v1.1 |
| Features | HIGH | v1.1 gap analysis based on actual v1.0 user testing results (80% accuracy); feature dependencies clearly mapped; anti-features are well-reasoned; competitive landscape cross-referenced across 5+ real products |
| Architecture | HIGH | v1.0 codebase reviewed; all integration points validated as additive with zero breaking changes; component boundaries and data flow defined with code-level interface detail; implementation order follows dependency chain |
| Pitfalls | HIGH | Pitfalls grounded in real v1.0 failure modes and Figma API behavior; rate limiting thresholds verified against official docs; instruction engineering pitfalls verified against Claude prompt engineering docs; Figma node type edge cases are documented in official plugin API docs |

**Overall confidence:** HIGH

### Gaps to Address

- **Composition heuristic thresholds:** The specific values (vectorCount > 5 = complex, > 2 = moderate) are starting hypotheses based on reasoning, not empirical validation. Plan a validation sprint against at least 5 diverse Figma files — including real v1.0 failure cases — before finalizing thresholds. Treat first threshold as a hypothesis to tune.

- **Figma API mixed-format image batching:** Whether `/v1/images` accepts mixed SVG + PNG render node IDs in a single call is unconfirmed. Verify with a test call before implementing the combined batch in `export.ts`. Have separate-calls-per-format as a fallback implementation ready.

- **Brief instruction A/B baseline:** Phase 1 should establish a measurable success baseline (first-build accuracy %, Claude Code compliance rate on asset-only and plan-mode instructions) before Phase 2 ships. Define "improved" quantitatively so Phase 2 impact can be attributed correctly.

- **SVG optimization (SVGO):** Deferred from v1.0 and still unaddressed. Raw SVG exports from Figma contain redundant metadata. If users report large SVG asset sizes, evaluate SVGO via `shell.exec` in a future v1.x. Do not add for v1.1.

- **Zod adoption decision:** Whether to use `@zod/mini` for runtime validation of curl output vs. manual try/catch + type assertions is still unresolved. Decide in Phase 2 implementation based on how noisy Figma API error responses turn out to be with real mixed-format batching.

## Sources

### Primary (HIGH confidence)
- [Figma REST API Documentation](https://developers.figma.com/docs/rest-api/) — endpoints, rate limits, authentication, node types, response shapes
- [Figma REST API Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) — tier limits, 429 handling, Retry-After
- [Figma REST API Scopes](https://developers.figma.com/docs/rest-api/scopes/) — PAT scope requirements confirmed
- [Figma REST API Variables Endpoints](https://developers.figma.com/docs/rest-api/variables-endpoints/) — Enterprise-only restriction verified
- [Figma REST API — Image Endpoint](https://www.figma.com/developers/api#get_images) — batch export, format parameters
- [@figma/rest-api-spec on npm](https://www.npmjs.com/package/@figma/rest-api-spec) — v0.36.0, published 2026-01-21
- [@figma/rest-api-spec on GitHub](https://github.com/figma/rest-api-spec) — official Figma TypeScript types
- [Guide to Figma MCP Server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) — competitive landscape, output format comparison
- [Figma Dev Mode](https://www.figma.com/dev-mode/) — competitive feature analysis
- [Figma-Anthropic Claude Code to Figma](https://www.figma.com/blog/introducing-claude-code-to-figma/) — Figma-Anthropic integration and context-provider pattern validation
- [Figma OpenAI Codex Partnership](https://openai.com/index/figma-partnership/) — industry direction as of Feb 2026
- [Claude Prompt Engineering Best Practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) — instruction engineering constraints (2-3 behaviors, positive framing)
- [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices) — plan mode and agentic behavior patterns
- [W3C Design Tokens Spec Stable](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) — DTCG format confirmed stable October 2025
- [Figma Accessibility Features](https://help.figma.com/hc/en-us/articles/31242789265431-Improve-the-accessibility-of-your-site) — alt text, aria-hidden support
- [Zod v4](https://zod.dev/) — v4.3.6, 57% smaller than v3, 14x faster string parsing; verified via npm

### Secondary (MEDIUM confidence)
- [Locofy.ai](https://www.locofy.ai/), [Anima](https://www.animaapp.com/figma), [Builder.io Visual Copilot](https://www.builder.io/blog/figma-to-code-visual-copilot) — competitive feature analysis (marketing material cross-referenced with plugin community listings)
- [Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) — architecture reference for node tree simplification approach
- [FigmaToCode](https://github.com/bernaferrari/FigmaToCode) — architecture reference for Figma-to-CSS conversion; AltNode intermediate representation pattern
- [figma-extractor by kataras](https://github.com/kataras/figma-extractor) — extraction pipeline structure reference
- [Extracting SVGs Using Figma API — Jacob Tan](https://blog.jacobtan.co/extracting-svgs-using-figma-api) — SVG export patterns and common issues
- [Figma Forum: Nested Vectors in SVG Export](https://forum.figma.com/t/exporting-svg-elements-using-figma-api-issue/37188) — known edge case with nested vector groups
- [Exporting Vectors with Figma API — iAdvize Engineering](https://medium.com/iadvize-engineering/using-figma-api-to-extract-illustrations-and-icons-34e0c7c230fa) — complex illustration detection heuristics
- [AI Code Generation Token Limits](https://medium.com/@reuvenaor85/the-way-to-figma-mcp-pixel-perfect-code-generation-for-react-tailwind-1623fd5383b8) — ~12K token threshold for near pixel-perfect accuracy (practitioner report)
- [Design Tokens for AI](https://learn.thedesignsystem.guide/p/design-tokens-that-ai-can-actually) — three-tier token hierarchy rationale
- [Norman's Law in UX](https://www.ux-bulletin.com/normans-law-ux/) — progressive disclosure and simplification pitfalls
- [Plan Mode in Claude Code — ClaudeLog](https://claudelog.com/mechanics/plan-mode/) — plan mode behavior reference

### Tertiary (LOW confidence)
- [Figma URL parsing patterns](https://community.latenode.com/t/validate-figma-url-and-extract-file-node-ids-using-regex/20893) — URL regex patterns (community post; cross-referenced with official docs)
- [SVGO v4](https://svgo.dev/) — deferred dependency; may not be needed; evaluate if raw SVG quality is insufficient
- [Codespell.ai](https://www.codespell.ai/) — competitive landscape reference (single source, marketing material)

---
*Research completed: 2026-02-28*
*Ready for roadmap: yes*
