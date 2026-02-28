# Roadmap: Ship Studio Figma Plugin

## Overview

This roadmap delivers a Ship Studio plugin that extracts structured design data from Figma and formats it as a design brief for Claude Code. The build follows the natural data pipeline: first connect to Figma and authenticate (Phase 1), then extract the layout tree (Phase 2), then extract design tokens and component data from that tree (Phase 3), then export image and SVG assets (Phase 4), and finally assemble everything into a formatted brief and copy it to clipboard (Phase 5). Each phase delivers a verifiable capability that the next phase builds on.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Plugin Foundation & Figma Connection** - Working plugin with auth, URL parsing, and API client that can fetch Figma node data
- [ ] **Phase 2: Layout Extraction** - Extract component hierarchy, auto-layout properties, and dimensions from Figma design trees
- [ ] **Phase 3: Design Data Extraction** - Extract design tokens (colors, typography, spacing, borders, shadows) and component identification from parsed nodes
- [ ] **Phase 4: Image & Asset Export** - Render PNG previews and export SVG/image assets to the project directory
- [ ] **Phase 5: Brief Assembly & Output** - Format all extracted data into a structured markdown brief and copy to clipboard with progress and error feedback

## Phase Details

### Phase 1: Plugin Foundation & Figma Connection
**Goal**: Users can connect the plugin to their Figma account, paste any Figma URL, and the plugin successfully fetches the targeted node data from the Figma API
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, INPT-01, INPT-02, INPT-03, INPT-04, PLUI-01, PLUI-02
**Success Criteria** (what must be TRUE):
  1. User can open the plugin from the Ship Studio toolbar and see a themed UI matching the Ship Studio design system
  2. User can enter a Figma personal access token, have it validated against the Figma API, and see it persisted across sessions
  3. User can update or remove their stored Figma token
  4. User can paste a Figma URL (file, frame, or component link in any format) and the plugin correctly identifies the file key and node ID
  5. User can select extraction scope (single node, frame, or entire page) and the plugin confirms the target is accessible before proceeding
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD
- [ ] 01-03: TBD

### Phase 2: Layout Extraction
**Goal**: The plugin produces a complete, normalized layout tree from any Figma selection, preserving hierarchy, auto-layout semantics, dimensions, and layer names
**Depends on**: Phase 1
**Requirements**: LYOT-01, LYOT-02, LYOT-03, LYOT-04, LYOT-05
**Success Criteria** (what must be TRUE):
  1. Plugin extracts a parent-child node tree that accurately reflects the Figma component hierarchy for the selected scope
  2. Plugin captures auto-layout properties (direction, spacing, padding, alignment, sizing modes, wrap) on every auto-layout frame
  3. Plugin correctly handles absolute-positioned children within auto-layout frames, marking them distinctly from flow children
  4. Plugin preserves Figma layer names as semantic identifiers and captures node dimensions (width, height, constraints) for every node
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Design Data Extraction
**Goal**: The plugin extracts all design tokens (colors, typography, spacing, borders, shadows) and identifies component instances with their names and variant properties from the parsed layout tree
**Depends on**: Phase 2
**Requirements**: TOKN-01, TOKN-02, TOKN-03, TOKN-04, TOKN-05, COMP-01, COMP-02, COMP-03
**Success Criteria** (what must be TRUE):
  1. Plugin extracts fill colors (solid and gradient) with correct 0-1 to 0-255 conversion, producing valid hex/rgba values
  2. Plugin extracts typography properties (font family, size, weight, line height, letter spacing), spacing values (padding, gap), border properties (radius, stroke color, weight), and shadow effects (drop shadow, inner shadow)
  3. Plugin detects component instances (INSTANCE nodes), resolves their component names, includes descriptions when available, and extracts variant property values
  4. Extracted tokens are deduplicated -- repeated colors, font stacks, and spacing values appear once each with usage counts or references
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Image & Asset Export
**Goal**: The plugin renders a PNG preview of the selected design and exports all SVG icons and raster images as local files in the project directory, ready for Claude Code to reference
**Depends on**: Phase 1 (API client), Phase 2 (node tree for identifying asset nodes)
**Requirements**: ASST-01, ASST-02, ASST-03, ASST-04, ASST-05
**Success Criteria** (what must be TRUE):
  1. Plugin renders the selected frame or component as a PNG image via the Figma images API and saves it to the project directory
  2. Plugin identifies vector/icon nodes and exports them as SVG files, and identifies raster image nodes and exports them as PNG files, all saved to the project directory
  3. Exported assets have sensible filenames derived from their Figma layer names (sanitized for filesystem use)
  4. All image URLs are downloaded immediately during extraction -- no expired S3 URLs are stored as references
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Brief Assembly & Output
**Goal**: The plugin assembles all extracted data (layout tree, design tokens, components, asset references) into a structured markdown design brief and copies it to the clipboard, with progress feedback and clear error messages throughout the extraction process
**Depends on**: Phase 2, Phase 3, Phase 4
**Requirements**: BREF-01, BREF-02, BREF-03, BREF-04, BREF-05, PLUI-03, PLUI-04
**Success Criteria** (what must be TRUE):
  1. Plugin produces a structured markdown brief with clear sections for metadata, layout tree, design tokens, components, and asset references
  2. Brief is framework-agnostic -- it describes layout intent (e.g., "vertical stack, 16px gap, children fill width") rather than framework-specific code
  3. Brief references exported assets by their local file paths in the project, and warns the user if estimated token count exceeds approximately 12K tokens
  4. User can copy the formatted brief to clipboard with a single action
  5. Plugin shows extraction progress during API calls and displays clear error messages for common failures (invalid token, inaccessible file, rate limit hit)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Plugin Foundation & Figma Connection | 0/0 | Not started | - |
| 2. Layout Extraction | 0/0 | Not started | - |
| 3. Design Data Extraction | 0/0 | Not started | - |
| 4. Image & Asset Export | 0/0 | Not started | - |
| 5. Brief Assembly & Output | 0/0 | Not started | - |
