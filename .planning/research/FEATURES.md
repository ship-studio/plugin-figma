# Feature Research

**Domain:** Figma design extraction for AI code generation
**Researched:** 2026-02-28
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Figma URL input + node selection** | Every Figma tool works via URL or selection. Users expect to paste a link or pick a frame and go. | LOW | Parse file key and node ID from URLs in formats like `figma.com/file/KEY/...?node-id=X`, `figma.com/design/KEY/...`. Figma REST API requires file key + node ID. |
| **Layout structure extraction** | The entire point of structured extraction vs screenshots. Locofy, Anima, Builder.io, and Figma MCP all extract component hierarchy, auto-layout direction, spacing, sizing, and alignment. | HIGH | Must recursively walk the Figma node tree. Extract `layoutMode` (HORIZONTAL/VERTICAL/GRID), padding (top/right/bottom/left), `itemSpacing`, `counterAxisSpacing`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `primaryAxisSizingMode`, `counterAxisSizingMode`, `layoutWrap`. This is the hardest extraction task and the most valuable. |
| **Design token extraction (colors, typography, spacing)** | All competitors extract tokens. Figma MCP's `get_variable_defs` returns colors, spacing, and typography. Without tokens, AI generates hardcoded values instead of system-consistent code. | MEDIUM | Extract fill colors, stroke colors, font family/size/weight/line-height/letter-spacing, border radius, shadow effects (drop shadow, inner shadow, layer blur). Output as CSS custom properties or structured JSON. W3C DTCG format (stable since 2025.10) is the emerging standard. |
| **Rendered image (PNG) of the selection** | Visual reference is critical for AI accuracy. Both Figma MCP's approach and the figma-extractor tool provide screenshots alongside structured data. The AI needs "three things to stay on-brand: tokens, config, and a visual reference." | LOW | Figma REST API `/v1/images` endpoint renders any node as PNG/SVG/PDF at configurable scale. Simple API call. Save to project directory. |
| **Clipboard output of the design brief** | The workflow is: extract in plugin, paste into Claude Code. If users have to find and open a file, friction kills adoption. | LOW | Format the complete brief as text, copy to clipboard. User pastes into Claude Code prompt. |
| **Personal access token management** | Every Figma REST API integration requires authentication. Users expect to enter their token once and have it persist. | LOW | Store via Ship Studio plugin storage (per-project persistence). Validate token on entry with a simple API call (e.g., `/v1/me`). |
| **Asset export (SVG icons, images)** | Locofy, Anima, and Builder.io all export assets alongside code. Claude Code needs actual asset files to reference -- it cannot generate SVG icons from descriptions. | MEDIUM | Use Figma REST API to identify image/vector nodes, export as SVG (for vectors/icons) and PNG (for raster images). Apply SVGO optimization for SVGs. Save to project directory with sensible filenames derived from Figma layer names. |
| **Component identification** | When a node is an instance of a Figma component, the brief should say "this is a Button component" not just describe raw rectangles and text. All serious tools preserve component identity. | MEDIUM | Detect `INSTANCE` node types, resolve their `componentId` to component names and descriptions. Include variant property values (e.g., `variant=primary`, `size=large`). |
| **Structured output format** | The brief must be machine-readable enough for Claude Code to parse effectively. Research shows components under ~12K tokens generate with near pixel-perfect accuracy. | MEDIUM | Output as structured markdown with clear sections: metadata, layout tree, tokens, component mapping, asset references. Keep individual component briefs under 12K tokens for optimal AI accuracy. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI-optimized brief format (not raw code)** | Every competitor generates framework-specific code (React, Vue, HTML). Ship Studio does NOT generate code -- it produces a structured brief that Claude Code interprets in the context of the user's actual project. This means the output adapts to whatever framework, styling system, and component library the project uses, without the plugin needing to know. Figma MCP's `get_design_context` returns "a structured React + Tailwind representation" -- we should return a framework-agnostic representation instead. | MEDIUM | Design a brief schema that captures layout intent (flex direction, gap, alignment) rather than framework-specific properties. Include enough detail for precise code generation without prescribing the technology. |
| **Semantic layer naming as hints** | Most tools ignore layer names or treat them as CSS class names. Layer names often encode semantic meaning ("hero-section", "nav-primary", "cta-button") that helps AI generate semantic HTML and meaningful component names. | LOW | Preserve and surface Figma layer names prominently in the brief. Encourage AI to use them for component naming, CSS classes, and semantic HTML element choices. |
| **Design token tiering (primitive/semantic/component)** | Research shows AI generates better code when tokens are organized in three tiers: primitives (raw values), semantic (purpose-mapped), and component-level (context-specific). Most tools dump flat color/spacing lists. | MEDIUM | If the Figma file uses Variables with modes and collections, extract the token hierarchy. If not, attempt intelligent categorization: group colors by role (primary, text, background, border), spacing by scale, typography by role (heading, body, caption). |
| **Scope-appropriate extraction (frame vs page)** | Let users extract a single component, a frame, or an entire page. Most tools are either "select one thing" or "export everything" with no middle ground. | LOW | Support three scopes: single node (from URL with node-id), frame (a top-level frame on a page), and page (all top-level frames). Adapt brief structure per scope. |
| **Component property mapping with variant context** | Extract not just "this is a Button" but "this is a Button with variant=primary, size=lg, iconLeft=true". Maps directly to how the user's code components accept props. | MEDIUM | Parse Figma component properties: variant properties (string enums), boolean properties (show/hide toggles), text properties (slot content), instance swap properties (nested component slots). Output as a prop table in the brief. |
| **Brief size awareness and chunking** | Research shows AI code generation quality degrades above ~12K tokens per component. The plugin should warn users or auto-chunk large selections. | LOW | Estimate token count of the generated brief. If a selection would produce >12K tokens, suggest extracting sub-sections individually or automatically chunk the brief with cross-references. |
| **Include visual annotations / descriptions** | Figma Dev Mode supports annotations where designers add "instructions, style considerations, and accessibility info." Extracting these gives the AI designer intent, not just visual structure. | LOW | If the Figma file contains Dev Mode annotations or component descriptions, include them in the brief as contextual notes. These are high-signal, low-noise additions. |
| **Accessibility data extraction** | Figma supports alt text on images, aria-hidden on decorative elements, and semantic HTML tags via plugins like "HTML Tags & Attributes." Extracting this data means the generated code is accessible by default. | LOW | Check for alt text on image nodes, aria-hidden markers, and any accessibility annotations. Include in the brief so Claude Code generates semantic HTML with proper ARIA attributes and alt text. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Code generation (React/Vue/HTML output)** | "Just give me the code" seems faster than a brief. Every competitor does it. | This is the entire Ship Studio thesis: code generation divorced from project context produces throwaway code. Locofy, Anima, and Builder.io all generate code that needs heavy editing because they cannot know the user's component library, styling system, or conventions. Claude Code with project context generates far better code. | Generate a rich design brief. Let Claude Code generate code in the user's actual project context with their actual component library. |
| **Framework-specific output options** | Users ask for "React output" or "Tailwind output." | Every framework option multiplies maintenance surface. The brief format is framework-agnostic by design -- Claude Code adapts the brief to whatever the project uses. Adding framework targets defeats the purpose. | The brief includes layout semantics (flex, gap, alignment) that map naturally to any framework. Document this in the plugin UI so users understand the workflow. |
| **Real-time Figma sync / live watching** | "Auto-update when the design changes." | Massively complex (requires webhooks or polling), creates state management headaches, and the use case is weak -- users extract when they are ready to build, not continuously. The Figma API has rate limits that make live sync impractical anyway. | On-demand extraction. User decides when to extract. Fast enough that re-extracting is trivial. |
| **Figma plugin API (in-Figma plugin)** | Running inside Figma as a native plugin gives access to more data. | Ship Studio is a desktop app, not Figma. Building a Figma plugin is an entirely separate product. The REST API provides everything needed: node trees, properties, images, variables, components. | Use the Figma REST API via `shell.exec` + `curl`. It provides complete design data access with personal access tokens. |
| **OAuth / Figma login flow** | "More secure" and "better UX" than personal access tokens. | OAuth requires a registered Figma app, callback server, token refresh logic, and adds significant complexity. Personal access tokens are simpler, work offline, and are sufficient for read-only extraction. Ship Studio already solved this in PROJECT.md. | Personal access token stored in plugin storage. One-time setup. Validate on entry. |
| **Responsive breakpoint extraction** | "Extract the mobile, tablet, and desktop versions." | Most Figma files have separate frames for each breakpoint, not a single responsive component. Extracting three frames and stitching them into one "responsive brief" requires understanding which frames correspond to which breakpoints -- this is AI-hard and error-prone. | Let users extract each breakpoint frame individually. Include frame dimensions in the brief so Claude Code understands the viewport context. Users can paste multiple briefs for different breakpoints. |
| **Full design system import** | "Import our entire design system from Figma." | Design systems in Figma are massive (hundreds of components, thousands of tokens). Extracting everything produces an unusable brief. The value is in targeted extraction of what you are building right now. | Extract the specific components and tokens used in the selected frame. Reference the broader system by name but do not dump it all. |
| **Diff / change detection** | "Show me what changed since last extraction." | Requires storing previous extraction state, diffing complex tree structures, and the UI complexity of presenting diffs. Premature optimization for v1. | Re-extract the whole selection. Briefs are cheap to generate. Users can use their own diff tools on the output if needed. |

## Feature Dependencies

```
[Figma URL Input + Token Auth]
    |
    +--requires--> [Figma REST API Access Layer]
    |                  |
    |                  +--enables--> [Layout Structure Extraction]
    |                  |                 |
    |                  |                 +--enables--> [Component Identification]
    |                  |                 |                 |
    |                  |                 |                 +--enhances--> [Component Property Mapping]
    |                  |                 |
    |                  |                 +--enables--> [Semantic Layer Naming]
    |                  |
    |                  +--enables--> [Design Token Extraction]
    |                  |                 |
    |                  |                 +--enhances--> [Token Tiering]
    |                  |
    |                  +--enables--> [Asset Export (SVG/PNG)]
    |                  |
    |                  +--enables--> [Rendered Image (PNG screenshot)]
    |                  |
    |                  +--enables--> [Accessibility Data Extraction]
    |
    +--enables--> [Scope Selection (frame/page/node)]

[Layout Structure] + [Design Tokens] + [Component ID] + [Assets] + [Rendered Image]
    |
    +--feeds-into--> [Structured Brief Formatting]
                         |
                         +--enables--> [Brief Size Awareness]
                         |
                         +--enables--> [Clipboard Output]
                         |
                         +--enhances--> [Visual Annotations Inclusion]
```

### Dependency Notes

- **Everything requires Figma REST API Access Layer:** Token auth + URL parsing + API client are foundational. Nothing works without them.
- **Layout Structure is the critical path:** It is the highest-complexity, highest-value extraction. Component identification and semantic naming both depend on the node tree traversal that layout extraction performs.
- **Design Token Extraction is independent of Layout:** Tokens come from Figma Variables and style definitions, not from the node tree. Can be built in parallel with layout extraction.
- **Brief Formatting depends on all extraction features:** The brief combines layout, tokens, components, assets, and the rendered image. It is the integration point.
- **Asset Export requires identifying exportable nodes:** Which comes from the layout tree walk, but the actual export uses separate Figma API endpoints (`/v1/images`).
- **Accessibility Data is a lightweight addition:** It reads existing properties from nodes already being traversed. Low marginal cost once layout extraction works.

## MVP Definition

### Launch With (v1)

Minimum viable product -- what is needed to validate that a structured brief is more useful than a screenshot for Claude Code.

- [ ] **Figma URL input + token auth** -- foundational; without this nothing works
- [ ] **Layout structure extraction** -- the core differentiator; auto-layout properties, hierarchy, sizing
- [ ] **Design token extraction (colors, typography, spacing)** -- AI needs these to avoid hardcoded values
- [ ] **Rendered PNG of selection** -- visual reference for the AI alongside structured data
- [ ] **Component identification** -- surface component names and basic variant info
- [ ] **Structured brief formatting** -- combine everything into a coherent markdown brief
- [ ] **Clipboard output** -- paste-ready workflow into Claude Code

### Add After Validation (v1.x)

Features to add once core extraction proves valuable.

- [ ] **Asset export (SVG icons, images)** -- trigger: users report Claude Code cannot reference icons/images
- [ ] **Component property mapping (full variant/boolean/text props)** -- trigger: basic component names are insufficient for accurate code generation
- [ ] **Design token tiering (primitive/semantic/component)** -- trigger: flat token lists produce inconsistent code
- [ ] **Brief size awareness and chunking** -- trigger: users extract large pages and get degraded AI output
- [ ] **Scope selection (frame vs page vs node)** -- trigger: users need to extract more than individual frames
- [ ] **Accessibility data extraction** -- trigger: users care about generating accessible code from briefs

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Visual annotations / Dev Mode data inclusion** -- requires Figma files that use Dev Mode annotations (not universal)
- [ ] **W3C DTCG token format export** -- standardized token format for interop with other tools
- [ ] **Batch extraction (multiple frames at once)** -- optimization for power users
- [ ] **Brief templates / customization** -- let users tune what data appears in the brief for their workflow
- [ ] **Integration with Figma Variables API** -- deeper token extraction when files use the Variables system

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Figma URL input + token auth | HIGH | LOW | P1 |
| Layout structure extraction | HIGH | HIGH | P1 |
| Design token extraction | HIGH | MEDIUM | P1 |
| Rendered PNG of selection | HIGH | LOW | P1 |
| Component identification | HIGH | MEDIUM | P1 |
| Structured brief formatting | HIGH | MEDIUM | P1 |
| Clipboard output | HIGH | LOW | P1 |
| Asset export (SVG/PNG) | MEDIUM | MEDIUM | P2 |
| Component property mapping | MEDIUM | MEDIUM | P2 |
| Semantic layer naming hints | MEDIUM | LOW | P2 |
| Token tiering | MEDIUM | MEDIUM | P2 |
| Brief size awareness | MEDIUM | LOW | P2 |
| Scope selection (frame/page/node) | MEDIUM | LOW | P2 |
| Accessibility data extraction | MEDIUM | LOW | P2 |
| Visual annotations inclusion | LOW | LOW | P3 |
| W3C DTCG token format | LOW | MEDIUM | P3 |
| Batch extraction | LOW | MEDIUM | P3 |
| Brief templates | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch -- validates the core thesis
- P2: Should have, add after core proves valuable
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Locofy | Anima | Builder.io Visual Copilot | Figma MCP Server | Figma Dev Mode | **Ship Studio Plugin (Our Approach)** |
|---------|--------|-------|---------------------------|-------------------|----------------|---------------------------------------|
| **Output type** | Framework-specific code (React, Vue, Angular, Flutter, HTML) | Framework-specific code (React, Vue, HTML, Tailwind, MUI) | Framework-specific code (React, Vue, Svelte, Angular + styling libs) | Structured React+Tailwind representation | CSS snippets, design tokens, component details | Framework-agnostic design brief for Claude Code |
| **Layout extraction** | Yes, converts to flexbox/grid code | Yes, maps auto-layout to responsive code | Yes, AI-driven hierarchy reconstruction | Yes, via `get_design_context` | Yes, inspect panel shows layout properties | Yes, structured layout tree with auto-layout semantics |
| **Design tokens** | Detects similarly-styled elements, generates shared CSS | Extracts layout, spacing, typography, responsiveness | Trained on 2M+ data points for style extraction | Yes, via `get_variable_defs` for colors, spacing, typography | Shows variables and design tokens | Yes, extracted as CSS custom properties / structured JSON |
| **Component awareness** | Splits into reusable components with props | Supports MUI, Ant Design, shadcn mapping | Maps to your component library via custom config | Returns component names + Code Connect snippets | Code Connect links Figma components to production code | Extracts component names, variant properties, descriptions |
| **Asset handling** | Exports images/icons within generated code | Exports assets as part of code package | Included in generated code output | Can export images from selections | Export formats configurable in inspect panel | Exports SVGs and PNGs to project directory |
| **Visual reference** | N/A (generates code directly) | N/A (generates code directly) | N/A (generates code directly) | Can capture rendered UI | N/A (live design view) | PNG screenshot included in brief |
| **Responsive** | Generates responsive code for multiple screens | Multi-screen import with linked navigation | Responsive output with breakpoint support | Not explicit | Shows constraints and layout properties | Frame dimensions included; users extract per-breakpoint |
| **IDE integration** | GitHub, VS Code, Storybook export | Playground environment for iteration | Cursor integration, GitHub sync | Claude Code, Cursor, Codex via MCP | Jira, Linear, VS Code plugins | Ship Studio plugin (toolbar slot) |
| **Pricing model** | Free tier + paid plans | Free tier + paid plans | Free tier + paid plans | Included with Figma (Dev Mode seat) | Requires paid Figma seat | Free (part of Ship Studio) |
| **Key differentiator** | Large Design Models trained on millions of UIs | Multi-screen flow import + playground | Open-source Mitosis compiler + LLM refinement | Native Figma integration, bidirectional (code-to-design) | Official first-party handoff tool | Brief format adapts to any project context via Claude Code |

### Competitive Position Summary

The landscape breaks into two categories:

1. **Code generators** (Locofy, Anima, Builder.io, Codespell): Generate framework-specific code that rarely matches your project's conventions. Good for prototyping, poor for production. They compete with each other on framework breadth and code quality.

2. **Context providers** (Figma MCP, Figma Dev Mode, our plugin): Provide design data that an AI agent or developer uses to write code in context. This is the emerging pattern as of 2026, driven by the Figma-OpenAI Codex partnership and the Figma-Anthropic Claude Code integration.

Ship Studio's plugin sits squarely in category 2 but with a critical difference: the Figma MCP server returns a React+Tailwind-biased representation and requires MCP infrastructure. Our plugin produces a framework-agnostic brief that works via simple clipboard paste into Claude Code -- no MCP server setup, no framework assumptions, works with any project.

## Sources

- [Locofy.ai - Design to Code](https://www.locofy.ai/) -- MEDIUM confidence (marketing material, cross-referenced with Figma community listing)
- [Anima - Figma to Code](https://www.animaapp.com/figma) -- MEDIUM confidence (marketing material + community plugin listing)
- [Builder.io Visual Copilot](https://www.builder.io/blog/figma-to-code-visual-copilot) -- MEDIUM confidence (official blog post)
- [Figma Dev Mode](https://www.figma.com/dev-mode/) -- HIGH confidence (official Figma documentation)
- [Guide to Figma MCP Server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) -- HIGH confidence (official Figma help center)
- [Figma REST API - layoutMode](https://www.figma.com/plugin-docs/api/properties/nodes-layoutmode/) -- HIGH confidence (official Figma API docs)
- [W3C Design Tokens Spec Stable](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) -- HIGH confidence (W3C official announcement)
- [figma-extractor by kataras](https://github.com/kataras/figma-extractor) -- HIGH confidence (open source, reviewed code/README)
- [Figma OpenAI Codex Partnership](https://openai.com/index/figma-partnership/) -- HIGH confidence (official OpenAI announcement, Feb 2026)
- [Figma-Anthropic Claude Code to Figma](https://www.figma.com/blog/introducing-claude-code-to-figma/) -- HIGH confidence (official Figma blog)
- [Codespell.ai](https://www.codespell.ai/) -- LOW confidence (single source, marketing material)
- [AI Code Generation Token Limits](https://medium.com/@reuvenaor85/the-way-to-figma-mcp-pixel-perfect-code-generation-for-react-tailwind-1623fd5383b8) -- MEDIUM confidence (practitioner report, aligns with multiple sources)
- [Design Tokens for AI](https://learn.thedesignsystem.guide/p/design-tokens-that-ai-can-actually) -- MEDIUM confidence (industry newsletter, aligns with W3C spec direction)
- [Figma Accessibility Features](https://help.figma.com/hc/en-us/articles/31242789265431-Improve-the-accessibility-of-your-site) -- HIGH confidence (official Figma help center)
- [Must-Have Figma to Code Tools 2026](https://www.codespell.ai/blog/10-best-figma-to-code-tools-in-2025-why-codespell-ai-is-the-enterprise-choice) -- LOW confidence (biased source, but useful for landscape overview)

---
*Feature research for: Figma design extraction for AI code generation (Ship Studio plugin)*
*Researched: 2026-02-28*

---

## v1.1 Feature Roadmap: Smart Asset Detection, Brief Instructions, UX Simplification

**Context:** v1.0 user testing (80% first-build accuracy) identified three critical gaps:
1. **Complex illustrations** (nested vector groups) were described textually instead of exported as images, causing Claude Code to fabricate replacements
2. **Assets lacked location context** — brief listed assets in a flat table without showing where each belonged in the layout tree
3. **UX had too many steps** and used jargon ("Extraction Scope", "Single Node") that confused users
4. **No explicit guidance** for Claude Code on planning, using only provided assets, or verifying output

**Goal for v1.1:** Improve first-build accuracy from 80% → near 100% by fixing asset detection, adding instruction guidance, and simplifying UX.

---

### v1.1 Table Stakes

| Feature | Why Expected | Complexity | Notes | Phase |
|---------|--------------|------------|-------|-------|
| **Smarter Asset Detection** | v1.0 gap: complex illustrations described instead of exported, causing fabrication. v1.1 MUST fix this. Users expect "if it looks like an image, export as image". | MEDIUM | Heuristics detect groups with high child count, deep nesting, or many vector paths; export as PNG when complexity exceeds threshold. Figma API provides node structure; plugin infers exportability. | 2 |
| **Asset-to-Layout Mapping** | v1.0 gap: assets listed without context. Users expect "this asset goes here in the layout" not "here's a pile of 30 files". | HIGH | Each exported asset tracks parent path (breadcrumb: "Card > Header > Icon") and position. Requires traversing layout tree during extraction, maintaining parent context per node. | 2 |
| **Asset-Only Rule Instruction** | v1.0 problem: Claude Code sometimes creates custom SVGs instead of using provided assets when ambiguous. Brief must prevent this. | LOW | Pure instruction text in brief: "Use ONLY the provided assets. Do not create custom SVGs or graphics not in the assets folder." No backend work. | 1 |
| **Plan Mode / Clarifying Questions Instruction** | Modern AI pattern: before building, the AI should ask clarifying questions about ambiguities. v1.0 never prompts for this. | LOW | Instruction text: "Before you start building, enter plan mode and ask up to 2 clarifying questions." Guides Claude Code behavior. | 1 |
| **Brief Verification Instruction** | v1.0 problem: when Claude Code's output differs from design, no clear verification path. Users need explicit step. | LOW | Instruction text: "After building, compare your output against the PNG preview. Check text matches, colors match, asset placement matches." Structured checklist. | 1 |
| **Human-Friendly Terminology** | v1.0 uses jargon ("Extraction Scope", "Single Node", "transform group"). Users expect natural language. | LOW | UX text only; no backend changes. "What do you want to extract?" → "Just this screen" / "Everything on this page". Reduces cognitive load. | 1 |
| **Simplified UX Flow** | v1.0 has multiple modal steps; users get lost. v1.1 should reduce steps and use progressive disclosure. | LOW | UX/workflow refactor. Fewer modals, clearer question-answer flow, grouped asset results. No backend changes. | 3 |

---

### v1.1 Differentiators

| Feature | Value Proposition | Complexity | Notes | Phase |
|---------|-------------------|------------|-------|-------|
| **Smart Composition Detection** | Intelligently decide: "This is a complex illustration → export as image" vs "This is a layout structure → describe as components". Competitors export either all-as-vectors or all-as-descriptions; hybrid approach is rare. | HIGH | Score complexity: child count, nesting depth, path count, visual density. Figma API provides structure; plugin infers intent. Threshold tuning required. | 2 |
| **Breadcrumb Asset Mapping in Brief** | Each asset shows exact location in design tree (e.g., "photo-hero.png (Card > Image Section > Featured Image)"). Eliminates guesswork on asset placement. | HIGH | Requires layout tree traversal, maintaining parent path for exportable nodes. High value for Claude Code clarity. | 2 |
| **Executable Verification Loop** | Brief includes actionable verification checklist tied to extracted tokens/assets: "Check if all text matches, all colors match, all asset placements match." Not vague, but executable. | MEDIUM | Verification instructions reference specific extracted design tokens and asset list. Actionable and concrete. | 1 |
| **Intelligent Instruction Sequencing** | Brief guides Claude Code through explicit sequence: (1) Plan, (2) Ask questions, (3) Build using only assets, (4) Verify. Rarely explicit in design-to-code tools. | LOW | Ordering of instruction sections in brief template. High impact on Claude Code success rate. | 1 |
| **Progressive Asset Disclosure** | In results screen, don't overwhelm with 30+ assets. Group by type (Icons, Illustrations, Photos) or show only "important" assets upfront. | MEDIUM | Light clustering logic (file type, size, name patterns) or AI classification. Primarily UI/UX. | 3 |

---

### v1.1 Anti-Features to Avoid

| Feature | Why Requested | Why Problematic | Better Alternative |
|---------|---------------|-----------------|-------------------|
| **Automatic Component Detection** | "Detect repeated patterns and extract as components." Sounds smart. | Plugin can't infer component intent from Figma structure alone. Over/under-detects. Component naming in Figma is how intent is expressed. | Brief includes guidance: "If you see repeated patterns (buttons, cards), extract them as components. Check the provided component list." Claude Code uses human intent from Figma naming. |
| **Real-time Design Sync** | "Keep brief updated as design changes." | Expensive (polling/webhook). Most users extract once per session. Adds fragility. | "Extract on demand." User pastes new URL if design changes. Fast, simple, aligns with workflow. |
| **Automatic Code Generation** | "Why stop at brief? Generate code too!" | Plugin environment is limited; code quality poor. Shifts focus from extraction (plugin's strength) to generation (Claude Code's strength). | Keep plugin focused on extraction. Claude Code generates code. Clear separation. |
| **Custom Brief Formats** | "Support HTML, JSON, YAML output." | Brief format must be normalized for Claude Code. Fragments the interface. | Brief is markdown (universal, Claude-friendly). If users need JSON, they pipe through Claude. |
| **Multi-File Batch Extraction** | "Extract 10 screens at once." | Explodes scope. Shared components across files? Cross-file references? Performance degrades. | v1.1 extracts one page/frame at a time. Users repeat if needed. Simple, scoped. |

---

### v1.1 Feature Dependencies

```
[Smarter Asset Detection]
    ├── requires → [Figma API node traversal]
    │
    ├── enhances → [Asset-to-Layout Mapping]
    │
    └── enables → [Smart Composition Detection]

[Asset-to-Layout Mapping]
    ├── requires → [Smarter Asset Detection]
    │
    ├── requires → [Layout Tree Traversal with parent tracking]
    │
    └── enables → [Breadcrumb Asset Mapping in Brief]

[Asset-Only Rule Instruction]
    ├── requires → [Asset-to-Layout Mapping] (users must know what assets are)
    │
    └── no code changes (pure instruction text)

[Plan Mode / Clarifying Questions Instruction]
    ├── no dependencies (pure instruction text)
    │
    └── enhances → [Brief Verification Instruction]

[Brief Verification Instruction]
    ├── requires → [PNG Preview Export] (users need visual reference)
    │
    └── enhances → [Asset-Only Rule Instruction]

[Human-Friendly Terminology]
    ├── no dependencies (UX text only)
    │
    └── enhances → [Simplified UX Flow]

[Simplified UX Flow]
    ├── requires → [Human-Friendly Terminology]
    │
    ├── enhances → [Plan Mode Instruction] (fewer setup steps → fewer questions)
    │
    └── no hard code dependencies

[Breadcrumb Asset Mapping in Brief]
    ├── requires → [Asset-to-Layout Mapping]
    │
    └── enhances → [Asset-Only Rule Instruction]

[Executable Verification Loop]
    ├── requires → [Brief Verification Instruction]
    │
    ├── requires → [PNG Preview Export]
    │
    └── enhances → [Plan Mode Instruction]

[Progressive Asset Disclosure]
    ├── enhances → [Simplified UX Flow] (fewer assets shown at once)
    │
    └── no hard dependencies
```

**Dependency Critical Path:**
1. **Phase 1 (Instruction Improvements)** — All are pure text, no dependencies. Can launch independently.
2. **Phase 2 (Asset Detection + Mapping)** — Smarter Detection blocks Mapping; both block Breadcrumb text. Highest complexity, highest impact.
3. **Phase 3 (UX Simplification)** — Polish; depends on earlier phases but doesn't block them.

---

### v1.1 MVP Definition

#### Phase 1: Brief Instruction Improvements (Low Risk, High Impact)

**Launch with these** — all are instruction/text changes:

- [ ] Plan Mode / Clarifying Questions instruction
- [ ] Asset-Only Rule instruction
- [ ] Brief Verification instruction with actionable checklist
- [ ] Human-Friendly Terminology (UX text update)

**Rationale:** Addresses v1.0's biggest problems (fabrication, no verification loop) at zero backend cost. Instructions guide Claude Code behavior. Can launch independently.

**Success Metric:** User testing shows improved accuracy and fewer fabricated components when using Phase 1 instructions.

**Validation Test:**
- Extract a design with ambiguities (missing some assets, unclear layout intent)
- Build with Claude Code using Phase 1 brief
- Verify: (a) Claude Code asks clarifying questions, (b) no custom assets created, (c) verification catches differences

#### Phase 2: Asset Detection + Mapping (Medium Risk, High Impact)

**Add after Phase 1 validation** — core technical work:

- [ ] Smarter Asset Detection (heuristics for complex compositions)
- [ ] Asset-to-Layout Mapping (breadcrumb tracking in brief)
- [ ] Smart Composition Detection (differentiator)

**Rationale:** Phase 1 fixes instructions; Phase 2 fixes asset quality. Even with instructions, v1.0 fails because illustrations aren't exported as images and assets lack context.

**Trigger for adding:** Phase 1 testing shows remaining failures are because:
- Complex illustrations still described as layout, not exported as images
- Assets listed without location context

**Success Metric:** Extract a design with 15+ assets and complex nested vectors. Verify all complex shapes export as images; each asset shows breadcrumb location.

**Complexity:** HIGH — requires Figma API traversal, complexity scoring, threshold tuning, brief restructuring.

#### Phase 3: UX Simplification (Low Risk, Medium Impact)

**Add in parallel with Phase 2 or after** — improves experience without blocking:

- [ ] Simplified UX Flow (fewer steps, progressive disclosure)
- [ ] Progressive Asset Disclosure (group assets by category in results)

**Rationale:** Polish. Users can use plugin with current UX; simplification is QoL. Doesn't block core functionality.

**Complexity:** LOW to MEDIUM — mostly UI/UX refactor.

**Out of Scope for v1.1:**
- Real-time Sync, Automatic Code Generation, Batch Extraction, Design System Mapping, Custom Output Formats

---

### v1.1 Feature Prioritization

| Feature | User Value | Implementation Cost | Priority | Phase | Rationale |
|---------|------------|---------------------|----------|-------|-----------|
| Asset-Only Rule instruction | HIGH | LOW | P1 | 1 | Directly fixes "Claude fabricates assets" problem; pure text |
| Plan Mode instruction | HIGH | LOW | P1 | 1 | Guides Claude Code to ask clarifying questions upfront |
| Brief Verification instruction | HIGH | LOW | P1 | 1 | Closes verification loop; actionable checklist |
| Human-Friendly Terminology | HIGH | LOW | P1 | 1 | Reduces cognitive load; UX text only |
| Smarter Asset Detection | HIGH | HIGH | P1 | 2 | Fixes "illustrations exported as text" core problem |
| Asset-to-Layout Mapping | HIGH | HIGH | P1 | 2 | Fixes "assets without context" gap |
| Breadcrumb Asset Mapping in Brief | HIGH | MEDIUM | P1 | 2 | Makes asset placement explicit to Claude Code |
| Executable Verification Loop | MEDIUM | MEDIUM | P2 | 1 | Makes verification actionable, not vague |
| Smart Composition Detection | MEDIUM | HIGH | P2 | 2 | Differentiator; intelligent detection |
| Simplified UX Flow | MEDIUM | MEDIUM | P2 | 3 | Polish; reduces user confusion |
| Progressive Asset Disclosure | MEDIUM | MEDIUM | P2 | 3 | Polish; less overwhelming results |
| Real-time Sync | MEDIUM | HIGH | P3+ | DEFER | Complexity, weak use case |
| Automatic Code Generation | LOW | VERY HIGH | P3+ | NEVER | Out of scope; Claude Code handles this |
| Automatic Component Detection | MEDIUM | HIGH | P3+ | DEFER | Plugin can't infer intent reliably |
| Multi-File Batch Extraction | LOW | HIGH | P3+ | DEFER | Feature creep; users can repeat extraction |
| Design System Mapping | MEDIUM | MEDIUM | P3+ | DEFER | Let Claude Code do it with project context |

**Priority Rationale:**
- **P1:** Must have for v1.1. Directly address v1.0 gaps (fabrication, no mapping, no verification).
- **P2:** Should have. Enhance value and UX; add when core is solid.
- **P3+:** Nice to have. Defer to v2+. Either scope creep or unclear demand.

---

### v1.1 Implementation Patterns

#### Pattern 1: Asset Detection Heuristics

**Complexity Scoring (Figma API):**

```typescript
function scoreComplexity(node: SceneNode): number {
  if (!isExportCandidate(node)) return 0;
  
  let score = 0;
  const childCount = node.children?.length ?? 0;
  let pathCount = 0;
  let depth = 0;

  // Count paths in nested vectors
  function countPaths(n: SceneNode, level: number) {
    depth = Math.max(depth, level);
    if ('vectorPaths' in n) {
      pathCount += n.vectorPaths?.length ?? 0;
    }
    if (n.children) {
      for (const child of n.children) {
        countPaths(child, level + 1);
      }
    }
  }

  countPaths(node, 0);

  // Weighted heuristic
  score = (childCount * 0.2) + (pathCount * 0.3) + (depth * 0.2);
  
  // Bonus for "looks like illustration" patterns
  if (childCount > 10 && pathCount > 20) score += 5;
  
  return score;
}

const THRESHOLD = 15; // Tunable; start conservative
if (scoreComplexity(node) > THRESHOLD) {
  exportAsImage(node); // PNG or SVG as fallback
}
```

**Figma API Details:**
- `node.children` — immediate children (count for simple heuristic)
- `node.vectorPaths` — available on `VectorNode`; use for path counting
- Recursively traverse to get total path count and depth
- Threshold starts at 15; tune down if too many vectors stay as descriptions, up if too many groups export as images

**Validation:** Manually extract 3-5 designs with varying complexity; verify threshold correctly identifies illustrations vs layout structures.

---

#### Pattern 2: Breadcrumb Asset Tracking

**Implementation (TypeScript):**

```typescript
interface AssetWithBreadcrumb {
  id: string;
  name: string;
  type: 'icon' | 'image' | 'illustration';
  breadcrumb: string; // "Card > Header > Icon"
  position: { x: number; y: number };
  size: { width: number; height: number };
}

function buildAssetMap(node: SceneNode, parentPath: string[] = []): AssetWithBreadcrumb[] {
  const assets: AssetWithBreadcrumb[] = [];
  const currentPath = [...parentPath, node.name];

  if (node.children) {
    for (const child of node.children) {
      if (isExportableAsset(child)) {
        assets.push({
          id: child.id,
          name: child.name,
          type: classifyAsset(child), // 'icon', 'image', 'illustration'
          breadcrumb: currentPath.join(' > '),
          position: { x: child.x, y: child.y },
          size: { width: child.width, height: child.height },
        });
      }

      // Recurse into children
      if (child.children) {
        assets.push(...buildAssetMap(child, currentPath));
      }
    }
  }

  return assets;
}
```

**Brief Template Integration:**

```markdown
## Assets

Each asset is located in the layout tree as shown below. Use the breadcrumb path to understand where each asset belongs in your component structure.

| Asset Name | Type | Location | Size | Export Path |
|------------|------|----------|------|-------------|
| button-primary.svg | Icon | Button Bar > Primary Actions > Icon | 24×24 | assets/button-primary.svg |
| hero-photo.png | Photo | Header Section > Featured Image | 1200×600 | assets/hero-photo.png |
| empty-state-illustration.png | Illustration | Empty State > Graphic | 400×300 | assets/empty-state-illustration.png |
```

**Performance:** Path tracking has negligible overhead (string concatenation during traversal). Memory cost: one string per asset (typically <5KB for 50 assets).

---

#### Pattern 3: Brief Instruction Sequencing

**Structure in Brief:**

```markdown
# Design Brief: [Component Name]

## How to Use This Brief

### Step 1: Plan
Before you start building, **enter plan mode and ask 1-2 clarifying questions** about any ambiguities in this brief. Examples:
- "Is the 'featured image' always user-uploaded or a fixed design asset?"
- "Should the card expand on click or navigate somewhere?"

### Step 2: Build (Asset-Only Rule)
Use **ONLY the provided assets** listed below. Do not create custom SVGs, illustrations, or graphics that are not in the assets folder. If you cannot build something with the provided assets, ask a clarifying question instead.

### Step 3: Verify
After building, compare your output against the PNG preview below:
- ✓ Do all text labels match exactly?
- ✓ Do all colors match the design tokens?
- ✓ Are all asset placements and sizes correct?
- If anything differs, ask for clarification or request the missing asset.

## Layout Structure

[structured tree here]

## Design Tokens

[tokens here]

## Assets

[breadcrumb asset table here]

## PNG Preview

[image here]
```

**Why This Sequence:**
1. **Plan** — Claude Code thinks before building; catches ambiguities upfront
2. **Asset-Only Rule** — Prevents fabrication (v1.0's #1 problem)
3. **Verify** — Closes the loop if something's off

**Instruction Placement:** Instructions come BEFORE layout/tokens/assets so Claude Code reads them first.

---

#### Pattern 4: Progressive Asset Disclosure in UX

**Current v1.0 Results Screen:** Flat list of 50+ assets, overwhelming.

**v1.1 Progressive Approach:**

```
Extract Complete ✓

Results Summary:
  15 Icons
  3 Illustrations
  2 Photos
  1 Custom font family

Assets (grouped by type):

▶ Icons (15)
    Show/Hide
    ▼ button-primary.svg [24×24]
    ▼ button-secondary.svg [24×24]
    ▼ icon-check.svg [20×20]
    ...

▶ Illustrations (3)
    Show/Hide
    ▼ hero-scene.png [1200×600]
    ▼ empty-state.png [400×300]

▶ Photos (2)
    Show/Hide
    ▼ photo-1.jpg [600×400]

Ready to copy?
[Copy Brief to Clipboard]
[View Detailed Report]
```

**Benefits:**
- Users see high-level summary first (15 icons, 3 illustrations)
- Assets grouped by category; users quickly find what they need
- Collapsed groups avoid information overload
- Still includes all data in the brief; just doesn't show it all at once

**Implementation:** Simple categorization logic (file type, size, name patterns) or AI classification if adding complexity is acceptable.

---

### v1.1 Testing & Validation Strategy

#### Phase 1 Testing (Brief Instructions)

**Setup:** Extract a real, moderately-complex design (button component with variants, dropdown, etc.).

**Test Cases:**
1. **Plan Mode Prompt:** Does Claude Code ask clarifying questions?
2. **Asset-Only Rule:** When assets are missing or incomplete, does Claude Code ask instead of fabricate?
3. **Verification:** Does the verification checklist catch real differences between Claude Code's output and the design?

**Success Criteria:**
- ✓ Claude Code asks 1-2 clarifying questions before building
- ✓ No fabricated assets appear in the output
- ✓ Verification checklist identifies 80%+ of differences

#### Phase 2 Testing (Asset Detection & Mapping)

**Setup:** Extract a design with:
- 5+ simple icon vectors
- 1-2 complex illustrations (nested groups with 10+ children, 20+ paths)
- 2-3 photos
- Mixed layout structure

**Test Cases:**
1. **Complexity Scoring:** Are complex illustrations exported as images? Are simple layout groups kept as structure?
2. **Breadcrumb Mapping:** Does each asset show correct location path?
3. **Brief Quality:** Is the brief still under 12K tokens? Does Claude Code generate accurate code?

**Success Criteria:**
- ✓ All complex illustrations export as PNG/SVG; no false positives
- ✓ Breadcrumb paths are correct (verified manually)
- ✓ Brief is <12K tokens and Claude Code builds with 90%+ accuracy

#### Phase 3 Testing (UX Simplification)

**Setup:** User study with 3-5 users unfamiliar with plugin.

**Test Cases:**
1. **Terminology:** Do users understand "What do you want to extract?" without jargon?
2. **Steps:** Can users complete extraction without getting lost?
3. **Results Screen:** Is the grouped asset view less overwhelming?

**Success Criteria:**
- ✓ All users complete extraction without asking for help
- ✓ Users report clearer UI terminology
- ✓ Results screen feels organized, not overwhelming

---

### v1.1 Sources

**Asset Detection & Figma Heuristics:**
- [Figma VectorNode API Docs](https://developers.figma.com/docs/plugins/api/VectorNode/)
- [Figma TransformGroupNode API Docs](https://developers.figma.com/docs/plugins/api/TransformGroupNode/)
- [Top Figma Plugins for 2026 - Muzli](https://muz.li/blog/best-figma-plugins-for-designers-in-2026/) — mentions asset detection heuristics
- [Best Figma Plugins for Designers 2026 - Clay](https://clay.global/blog/web-design-guide/figma-plugin) — asset detection patterns

**Design Token & Asset Mapping:**
- [Design Token-Based UI Architecture - Martin Fowler](https://martinfowler.com/articles/design-token-based-ui-architecture.html) — hierarchical token structure
- [Figma Tokens, Variables, and Styles Update](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles) — semantic vs component tokens
- [Material Design 3 - Design Tokens](https://m3.material.io/foundations/design-tokens/) — token tiering patterns
- [SAP Design System - Design Tokens](https://www.sap.com/design-system/digital/foundations/tokens/design-tokens/) — asset-to-component mapping

**UX Simplification & Cognitive Load:**
- [Ultimate Guide to Cognitive Load Reduction in UX Design - DeveloperUX](https://developerux.com/2025/04/18/ultimate-guide-to-cognitive-load-reduction-in-ux-design/) — progressive disclosure, chunking
- [Simplifying UX/UI Design: Tips for Reducing Cognitive Load - Medium](https://bootcamp.uxdesign.cc/simplifying-ux-ui-design-tips-for-reducing-cognitive-load-f28fce98a4b2) — accordion/tooltip patterns
- [Why Simplicity in UX Design Matters - Unosquare](https://www.unosquare.com/blog/why-simplicity-in-ux-design-matters-the-impacts-and-steps-to-simplify-your-product/) — reduced steps, clear language
- [Achieve Better UX by Reducing Cognitive Load - Kellton Design](https://design.kellton.com/achieve-better-ux) — chunking, progressive disclosure

**Brief Instructions & AI Planning:**
- [Creating Plans Before Working - Goose](https://block.github.io/goose/docs/guides/creating-plans/) — plan mode pattern, clarifying questions
- [Best Practices for Claude Code - Claude Code Docs](https://code.claude.com/docs/en/best-practices) — brief format, instruction sequencing
- [Claude Code Best Practices 2026 - Morph](https://www.morphllm.com/claude-code-best-practices) — context management, instruction ordering
- [Your 2026 Guide to Prompt Engineering - The AI Corner](https://www.the-ai-corner.com/p/your-2026-guide-to-prompt-engineering) — concise, contextual instructions

---

*v1.1 feature research: Smart Asset Detection, Brief Instruction Engineering, UX Simplification*
*Researched: 2026-02-28*
