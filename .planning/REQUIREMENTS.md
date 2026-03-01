# Requirements: Ship Studio Figma Plugin

**Defined:** 2026-03-01
**Core Value:** Turn any Figma design into a structured, complete design brief that gives Claude Code everything it needs to build the component accurately.

## v2.0 Requirements

Requirements for Manual Asset Control milestone. Each maps to roadmap phases.

### Asset Input

- [ ] **AINP-01**: User can add an asset by pasting a Figma URL that contains a node ID
- [ ] **AINP-02**: User can select PNG or SVG format for each asset
- [ ] **AINP-03**: Plugin validates that the asset URL belongs to the same Figma file as the main design URL
- [ ] **AINP-04**: Plugin validates that the pasted URL contains a node ID (rejects file/page-level URLs)
- [x] **AINP-05**: Plugin detects I-prefix instance-child node IDs and warns the user to select the parent component instead
- [x] **AINP-06**: Plugin auto-suggests format based on node type (SVG for vector nodes, PNG for everything else)

### Asset List Management

- [ ] **LIST-01**: User can see all queued assets with derived filename and format
- [ ] **LIST-02**: User can remove individual assets from the list
- [ ] **LIST-03**: User can clear all assets from the list
- [ ] **LIST-04**: Plugin prevents adding the same node ID twice
- [ ] **LIST-05**: User can edit the auto-derived filename before export

### Asset Naming

- [x] **NAME-01**: Plugin auto-derives filenames from Figma layer names via API
- [x] **NAME-02**: Duplicate filenames are auto-numbered (icon.png, icon-2.png)

### Export Pipeline

- [x] **EXPT-01**: Plugin exports all listed assets in a single batch (one fetchImages call per format)
- [x] **EXPT-02**: Plugin maps each exported asset to its position in the layout tree by node ID
- [x] **EXPT-03**: Plugin generates a brief with zero assets if the list is empty (layout + tokens + preview only)
- [x] **EXPT-04**: Full-page preview PNG remains auto-generated

### Code Cleanup

- [x] **CLEAN-01**: All automatic asset detection code is removed (identify.ts, detect-composition.ts)
- [x] **CLEAN-02**: All tests for removed auto-detection code are removed or replaced
- [x] **CLEAN-03**: Brief generator is updated to remove composition/illustration-specific logic

## Future Requirements

Deferred to v2.1+. Tracked but not in current roadmap.

### Asset Input Enhancements

- **AINP-07**: User can paste multiple URLs at once (batch add)
- **AINP-08**: Asset list persists across plugin close/reopen

### UX Enhancements

- **UX-01**: Text alignment in brief (textAlignHorizontal from Figma)
- **UX-02**: Progressive asset disclosure in results UI
- **UX-03**: Collapsible tree preview
- **UX-04**: Executable verification loop/checklist

## Out of Scope

| Feature | Reason |
|---------|--------|
| Auto-detection fallback | The entire point of v2.0 is replacing unreliable auto-detection. A toggle would keep old complexity alive. |
| Drag-and-drop from Figma | Requires Figma plugin architecture, not REST API. No browser-to-plugin channel. |
| Asset grouping/folders | Claude Code reads a flat directory. Layout tree provides structural context. |
| Asset preview thumbnails | Extra API calls per asset for marginal value. Filename + format is enough context. |
| Drag-to-reorder | Order in the brief is cosmetic, not worth the complexity. |
| Image fill extraction via imageRef | Manual control means users point at the node they want. fetchImages render is simpler and more predictable. |
| SVG optimization/minification | Adds build dependency, can break SVGs. Figma's export is clean enough. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLEAN-01 | Phase 15 | Complete |
| CLEAN-02 | Phase 15 | Complete |
| CLEAN-03 | Phase 15 | Complete |
| EXPT-03 | Phase 15 | Complete |
| EXPT-04 | Phase 15 | Complete |
| NAME-01 | Phase 16 | Complete |
| NAME-02 | Phase 16 | Complete |
| AINP-05 | Phase 16 | Complete |
| AINP-06 | Phase 16 | Complete |
| EXPT-01 | Phase 17 | Complete |
| EXPT-02 | Phase 18 | Complete |
| AINP-01 | Phase 19 | Pending |
| AINP-02 | Phase 19 | Pending |
| AINP-03 | Phase 19 | Pending |
| AINP-04 | Phase 19 | Pending |
| LIST-01 | Phase 19 | Pending |
| LIST-02 | Phase 19 | Pending |
| LIST-03 | Phase 19 | Pending |
| LIST-04 | Phase 19 | Pending |
| LIST-05 | Phase 19 | Pending |

**Coverage:**
- v2.0 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-01*
*Last updated: 2026-03-01 after roadmap creation*
