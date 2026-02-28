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
