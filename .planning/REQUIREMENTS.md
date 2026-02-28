# Requirements: Ship Studio Figma Plugin

**Defined:** 2026-02-28
**Core Value:** Turn any Figma design into a structured, complete design brief that gives Claude Code everything it needs to build the component accurately.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can enter their Figma personal access token in the plugin settings
- [ ] **AUTH-02**: Plugin validates the token against the Figma API (`/v1/me`) on entry
- [ ] **AUTH-03**: Plugin persists the token via Ship Studio plugin storage (survives sessions)
- [ ] **AUTH-04**: User can update or remove their stored token

### Input

- [ ] **INPT-01**: User can paste a Figma URL (file, frame, or component link)
- [ ] **INPT-02**: Plugin parses file key and node ID from Figma URLs (`/file/`, `/design/`, `/proto/`, `/board/` formats)
- [ ] **INPT-03**: User can choose extraction scope: single node (from URL node-id), frame, or entire page
- [ ] **INPT-04**: Plugin validates that the URL points to an accessible Figma file before extraction

### Layout Extraction

- [ ] **LYOT-01**: Plugin extracts component hierarchy (parent-child node tree) from selected scope
- [ ] **LYOT-02**: Plugin extracts auto-layout properties (direction, spacing, padding, alignment, sizing modes, wrap)
- [ ] **LYOT-03**: Plugin extracts node dimensions (width, height, constraints)
- [ ] **LYOT-04**: Plugin preserves Figma layer names as semantic hints in the extracted tree
- [ ] **LYOT-05**: Plugin handles absolute-positioned children within auto-layout frames correctly

### Design Tokens

- [ ] **TOKN-01**: Plugin extracts fill colors (solid, gradient) with proper 0-1 to 0-255 conversion
- [ ] **TOKN-02**: Plugin extracts typography properties (font family, size, weight, line height, letter spacing)
- [ ] **TOKN-03**: Plugin extracts spacing values (padding, gap, margin) from auto-layout properties
- [ ] **TOKN-04**: Plugin extracts border properties (radius, stroke color, stroke weight)
- [ ] **TOKN-05**: Plugin extracts shadow effects (drop shadow, inner shadow parameters)

### Component Identification

- [ ] **COMP-01**: Plugin detects INSTANCE node types and resolves their component name
- [ ] **COMP-02**: Plugin extracts component descriptions when available
- [ ] **COMP-03**: Plugin extracts basic variant property values (e.g., variant=primary, size=large)

### Image & Asset Export

- [ ] **ASST-01**: Plugin renders the selected frame/component as PNG via Figma images API and saves to project
- [ ] **ASST-02**: Plugin identifies vector/icon nodes and exports them as SVG files to project directory
- [ ] **ASST-03**: Plugin identifies raster image nodes and exports them as PNG files to project directory
- [ ] **ASST-04**: Plugin generates sensible filenames from Figma layer names for exported assets
- [ ] **ASST-05**: Plugin downloads image URLs immediately (not stored as references, since URLs expire)

### Brief Formatting

- [ ] **BREF-01**: Plugin formats extracted data into a structured markdown brief with clear sections (metadata, layout tree, tokens, components, asset references)
- [ ] **BREF-02**: Brief is framework-agnostic — describes layout intent rather than framework-specific code
- [ ] **BREF-03**: Brief references exported assets by their local file paths in the project
- [ ] **BREF-04**: Plugin estimates token count and warns if brief exceeds ~12K tokens for a single component
- [ ] **BREF-05**: Plugin copies the formatted brief to clipboard

### Plugin UI

- [ ] **PLUI-01**: Plugin renders a toolbar button that opens the main plugin modal
- [ ] **PLUI-02**: Plugin uses Ship Studio's theme system for consistent styling
- [ ] **PLUI-03**: Plugin shows extraction progress during API calls
- [ ] **PLUI-04**: Plugin shows clear error messages for common failures (invalid token, inaccessible file, rate limit)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Extraction

- **EEXT-01**: Plugin extracts full component property mapping (variant, boolean, text, instance-swap properties)
- **EEXT-02**: Plugin organizes tokens in three tiers (primitive/semantic/component)
- **EEXT-03**: Plugin extracts accessibility data (alt text, aria-hidden markers)
- **EEXT-04**: Plugin includes visual annotations / Dev Mode data when present

### Enhanced Output

- **EOUT-01**: Plugin auto-chunks large briefs with cross-references when exceeding token limits
- **EOUT-02**: Plugin supports batch extraction of multiple frames at once
- **EOUT-03**: Plugin offers brief templates / customization for different workflows

## Out of Scope

| Feature | Reason |
|---------|--------|
| Code generation (React/Vue/HTML output) | Plugin prepares context; Claude Code generates code in project context |
| Framework-specific output | Brief is framework-agnostic by design; Claude Code adapts to the project |
| Real-time Figma sync | On-demand extraction is simpler and sufficient |
| Figma plugin (runs inside Figma) | This is a Ship Studio plugin; REST API provides full access |
| OAuth / Figma login flow | Personal access token is simpler and sufficient for read-only access |
| Responsive breakpoint stitching | Users extract per-breakpoint frame; include dimensions for context |
| Full design system import | Extract what's needed for the current selection, not everything |
| Diff / change detection | Re-extract is cheap; defer to v2+ |
| Figma Variables API (Enterprise-only) | Extract tokens from node properties instead; works for all users |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | — | Pending |
| AUTH-02 | — | Pending |
| AUTH-03 | — | Pending |
| AUTH-04 | — | Pending |
| INPT-01 | — | Pending |
| INPT-02 | — | Pending |
| INPT-03 | — | Pending |
| INPT-04 | — | Pending |
| LYOT-01 | — | Pending |
| LYOT-02 | — | Pending |
| LYOT-03 | — | Pending |
| LYOT-04 | — | Pending |
| LYOT-05 | — | Pending |
| TOKN-01 | — | Pending |
| TOKN-02 | — | Pending |
| TOKN-03 | — | Pending |
| TOKN-04 | — | Pending |
| TOKN-05 | — | Pending |
| COMP-01 | — | Pending |
| COMP-02 | — | Pending |
| COMP-03 | — | Pending |
| ASST-01 | — | Pending |
| ASST-02 | — | Pending |
| ASST-03 | — | Pending |
| ASST-04 | — | Pending |
| ASST-05 | — | Pending |
| BREF-01 | — | Pending |
| BREF-02 | — | Pending |
| BREF-03 | — | Pending |
| BREF-04 | — | Pending |
| BREF-05 | — | Pending |
| PLUI-01 | — | Pending |
| PLUI-02 | — | Pending |
| PLUI-03 | — | Pending |
| PLUI-04 | — | Pending |

**Coverage:**
- v1 requirements: 35 total
- Mapped to phases: 0
- Unmapped: 35

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 after initial definition*
