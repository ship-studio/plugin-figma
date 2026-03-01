# Requirements: Ship Studio Figma Plugin

**Defined:** 2026-03-01
**Core Value:** Turn any Figma design into a structured, complete design brief that gives Claude Code everything it needs to build the component accurately.

## v2.2 Requirements

Requirements for Designer Asset Workflow & Results UX milestone. Each maps to roadmap phases.

### Detection

- [x] **DETECT-01**: Plugin scans the raw Figma tree for layers whose name starts with `@S-` (case-insensitive)
- [x] **DETECT-02**: Layers containing image fills (direct or in descendants) are exported as PNG
- [x] **DETECT-03**: Layers with only vector/text content are exported as SVG
- [x] **DETECT-04**: `@S-` prefix is stripped from filenames (e.g. `@S-hero` → `hero.png`)
- [x] **DETECT-05**: Detected assets are mapped to their position in the layout tree

### Warning

- [x] **WARN-01**: Plugin shows a warning when no `@S-` layers are found
- [x] **WARN-02**: Warning explains the `@S-` naming convention for designers
- [x] **WARN-03**: User can "Continue anyway" to proceed without assets
- [x] **WARN-04**: User can "Try again" which re-fetches from the Figma API

### Results

- [ ] **RSLT-01**: Results view is a clean modal stating the brief is ready
- [ ] **RSLT-02**: Results modal includes a copy-to-clipboard button
- [ ] **RSLT-03**: Results modal tells user to paste the brief into their agent
- [ ] **RSLT-04**: Results modal warns about potential mistakes and encourages refinement
- [ ] **RSLT-05**: Results modal has an expandable "View details" section with assets, layout tree, and tokens

### Cleanup

- [x] **CLNP-01**: Manual asset URL workflow removed (AssetListPanel, manual asset state)
- [x] **CLNP-02**: Resolve helpers for manual asset URLs removed

## Previous Milestone Requirements (v2.1 -- Complete)

### Brief Modes

- [x] **MODE-01**: User can choose between three brief modes: "Copy (Best results)", "Copy (Pixel for pixel)", "Use as inspiration"
- [x] **MODE-02**: Each mode has clear explanatory text in the UI describing its behavior
- [x] **MODE-03**: "Copy (Best results)" mode instructs Claude Code to faithfully reproduce the design with clean, responsive development practices
- [x] **MODE-04**: "Copy (Pixel for pixel)" mode instructs Claude Code to match the Figma design as exactly as possible
- [x] **MODE-05**: "Use as inspiration" mode shows a text area for the user to describe what to take from the design
- [x] **MODE-06**: "Use as inspiration" mode instructs Claude Code to adapt design patterns to the user's site, incorporating their custom context

### Placeholders

- [x] **PLCH-01**: Brief instructs Claude Code to compare the preview against provided assets and identify visual elements that need assets but don't have them
- [x] **PLCH-02**: Brief instructs Claude Code to create visible placeholder boxes for missing assets
- [x] **PLCH-03**: Each placeholder has a unique reference name (e.g. `[asset-ref-1]`)
- [x] **PLCH-04**: Users can reference placeholders in follow-up prompts (e.g. "Replace asset-ref-1 with this file")

### Asset Clarity

- [x] **ASTC-01**: Brief clearly distinguishes provided assets from non-asset elements
- [x] **ASTC-02**: Brief explicitly lists all provided assets with their intended usage context

## Future Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### UX Enhancements

- **UX-01**: Text alignment in brief (textAlignHorizontal from Figma)
- **UX-02**: Progressive asset disclosure in results UI
- **UX-03**: Collapsible tree preview
- **UX-04**: Executable verification loop/checklist

## Out of Scope

| Feature | Reason |
|---------|--------|
| Instance propagation | @S- on a master component does not auto-detect instances -- designer prefixes individual layers for full control |
| Near-miss prefix detection | e.g. `@S icon` (space instead of dash) -- deferred, strict convention is simpler |
| Plugin-side placeholder detection | Claude Code can see the preview + assets; no need for plugin-side detection |
| Mode-specific extraction | All three modes use the same extracted data; only the brief instructions change |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DETECT-01 | Phase 24 | Complete |
| DETECT-02 | Phase 24 | Complete |
| DETECT-03 | Phase 24 | Complete |
| DETECT-04 | Phase 24 | Complete |
| DETECT-05 | Phase 24 | Complete |
| WARN-01 | Phase 25 | Complete |
| WARN-02 | Phase 25 | Complete |
| WARN-03 | Phase 25 | Complete |
| WARN-04 | Phase 25 | Complete |
| RSLT-01 | Phase 27 | Pending |
| RSLT-02 | Phase 27 | Pending |
| RSLT-03 | Phase 27 | Pending |
| RSLT-04 | Phase 27 | Pending |
| RSLT-05 | Phase 27 | Pending |
| CLNP-01 | Phase 26 | Complete |
| CLNP-02 | Phase 26 | Complete |

**Coverage:**
- v2.2 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-01*
*Last updated: 2026-03-01 after roadmap creation*
