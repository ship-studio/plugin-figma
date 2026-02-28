# Phase 2: Layout Extraction - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract a complete, normalized layout tree from any Figma selection via the Figma API. The tree preserves hierarchy, auto-layout semantics, dimensions, and layer names. This phase produces the structured data that Phase 3 (design tokens), Phase 4 (asset export), and Phase 5 (brief assembly) consume. It does NOT render output or extract visual styles — only structural layout data.

</domain>

<decisions>
## Implementation Decisions

### Component Instance Handling
- Treat component instances as **named references** (leaf nodes), not expanded trees
- Include: component name, variant properties, description (when available)
- Include **override values** — text overrides, icon swaps, nested instance replacements
- Tag source as **local** or **library: [library name]** so Claude Code knows whether it's a custom or design-system component

### Node Filtering
- **Hidden layers**: Include in the tree but mark as hidden (designers use hidden layers for alternate states like hover, error, loading)
- **Boolean operations and masks**: Treat as leaf nodes with a descriptive name (e.g., "icon-shape [boolean]") — don't expose constituent shapes
- **Text nodes**: Include the actual text content string (e.g., "Text: 'Sign up for free'") — essential for Claude Code to generate matching UI
- **Structural groups/wrappers**: Claude's discretion on collapsing single-child frames with no auto-layout

### Auto-layout Language
- Express direction and alignment using **CSS flexbox terms** (flex-direction, justify-content, align-items, gap)
- Express sizing modes using **semantic labels with resolved values**: e.g., "width: hug (240px)", "height: fill"
- Report spacing values as **exact pixels** from Figma (padding: 12px 16px, gap: 8px) — no rounding to scales
- **Capture constraints**: min/max width/height and aspect ratio locks alongside auto-layout props (important for responsive behavior)

### Large Tree Handling
- **Truncation strategy**: Claude's discretion on depth limits vs node count limits and thresholds
- **Warn before extracting large trees**: After API fetch, check node count; if large, prompt user: "This selection has ~N nodes. Extract anyway or narrow your scope?"
- **Deduplicate repeated instances**: When multiple identical component instances appear (e.g., 20 list items), show one representative instance with "repeated N more times"
- **API fetching strategy**: Claude's discretion on single call with depth param vs incremental fetching

### Claude's Discretion
- Structural group collapsing heuristic (single-child frames with no auto-layout)
- Truncation thresholds and strategy (depth limit vs node count)
- API fetching approach (single call vs incremental)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `figmaApiCall<T>()` in `src/figma-api.ts`: Generic typed wrapper for Figma API calls via curl. Handles errors, rate limits, JSON parsing. Layout extraction will use this for deeper file fetches.
- `validateFileAccess()` in `src/figma-api.ts`: Already fetches file with `depth=1`. Layout extraction needs similar calls with higher depth or node-specific endpoints.
- `FigmaUrlParts` type in `src/types.ts`: Provides fileKey and nodeId from parsed URL — inputs to the extraction API calls.
- `ExtractionScope` type in `src/types.ts`: `'node' | 'frame' | 'page'` — determines what part of the tree to extract.

### Established Patterns
- All API calls go through `shell.exec('curl', ...)` — no direct fetch/XMLHttpRequest. Layout extraction must follow this pattern.
- Plugin context (`usePluginContext`) provides shell, storage, actions — extraction logic will need shell access.
- Error handling follows a pattern of user-friendly messages with specific checks for 403, 404, 429 status codes.

### Integration Points
- `MainView.tsx` has a placeholder `handleExtract` callback — this is where layout extraction hooks in
- The extract button is gated on `parsedUrl && fileInfo && !validating` — extraction starts from a validated URL + scope selection
- Output of this phase (layout tree data structure) feeds into Phase 3 (design tokens), Phase 4 (assets), and Phase 5 (brief)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-layout-extraction*
*Context gathered: 2026-02-28*
