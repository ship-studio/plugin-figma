# Requirements: Ship Studio Figma Plugin

**Defined:** 2026-02-28
**Core Value:** Turn any Figma design into a structured, complete design brief that gives Claude Code everything it needs to build the component accurately

## v1.3 Requirements

Requirements for v1.3 Asset Completeness & Polish. Each maps to roadmap phases.

### Asset Detection

- [x] **ASSET-05**: Plugin detects and exports IMAGE fills inside component instance children (hero images, avatars, product photos nested in components)
- [x] **ASSET-06**: Plugin detects and exports IMAGE fills on INSTANCE nodes themselves (background image overrides)
- [x] **ASSET-07**: Plugin skips exporting simple solid-color RECTANGLE nodes as SVG (only exports rectangles with strokes or complex fills)

### Spacing & Layout

- [ ] **SPACE-01**: Brief includes absolute position offsets (top/left relative to parent) for absolutely-positioned elements
- [ ] **SPACE-02**: Brief includes flex-grow: 1 when a flex child has layoutGrow: 1
- [ ] **SPACE-03**: Brief includes align-self: stretch when a flex child has layoutAlign: STRETCH

### Polish

- [ ] **POLISH-01**: Plugin displays Figma logo SVG as its icon in the Ship Studio toolbar

## v1.1 Requirements (Complete)

<details>
<summary>All 9 requirements complete</summary>

### Brief Instructions

- [x] **INST-01**: Brief includes a plan mode instruction telling Claude Code to plan and ask questions before building
- [x] **INST-02**: Brief includes an asset-only rule telling Claude Code to use only provided assets, never fabricate replacements
- [x] **INST-03**: Brief includes a verification instruction telling Claude Code to compare its output against the PNG preview when done

### Asset Detection & Mapping

- [x] **ASSET-01**: Plugin detects complex compositions (nested groups/vectors with high child count, masks, blend modes) and flags them for image export
- [x] **ASSET-02**: Plugin exports detected complex compositions as single PNG images instead of describing their individual parts
- [x] **ASSET-03**: Brief maps each exported asset to its exact position in the layout tree via breadcrumb paths (e.g., "Hero > Header > Icon")
- [x] **ASSET-04**: Asset-to-layout mapping uses nodeId as stable key to prevent filename/path misalignment

### UX Simplification

- [x] **UX-01**: Plugin uses human-friendly terminology throughout (no "Extraction Scope", "Single Node", "auto-layout frames")
- [x] **UX-02**: Plugin flow is simplified with fewer visible steps

</details>

## Future Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Spacing (Advanced)

- **SPACE-F01**: Brief includes spacing between non-auto-layout siblings (inferred from bounding box positions)
- **SPACE-F02**: Brief includes constraint-based CSS inset values (top/right/bottom/left from Figma constraints)

### UI Enhancements

- **ASSET-08**: Progressive asset disclosure in results UI — group by type (icons, illustrations, photos)
- **ASSET-09**: Collapsible tree preview in results screen
- **UX-03**: Advanced options behind progressive disclosure toggle for power users

### Brief Quality

- **INST-04**: Executable verification loop — checklist tied to actual extracted tokens and assets
- **BRIEF-F01**: Text alignment in brief (textAlignHorizontal from Figma)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Deep-recurse instance children for layout tree | Would make layout tree enormous and duplicate component internals. Only recurse for IMAGE fill detection. |
| Export individual vectors from compositions | Defeats the purpose of composition detection. Keep single PNG export. |
| Margin inference from bounding boxes | Figma has no margin concept. Unreliable and doesn't match CSS mental models. |
| Pixel-perfect spacing from visual rendering | absoluteRenderBounds includes shadows/strokes, inflating spacing beyond design intent. Use absoluteBoundingBox. |
| Non-auto-layout sibling spacing | High complexity, medium value. Absolute position offsets cover the critical path for v1.3. |
| Code generation with framework targets | Plugin prepares context; Claude Code generates code in project context |
| Real-time design sync | Polling/webhook complexity not justified for per-session use case |
| Multi-file batch extraction | Scope explosion; extract one frame at a time |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INST-01 | Phase 6 | Complete |
| INST-02 | Phase 6 | Complete |
| INST-03 | Phase 6 | Complete |
| ASSET-01 | Phase 7 | Complete |
| ASSET-02 | Phase 7 | Complete |
| ASSET-03 | Phase 7 | Complete |
| ASSET-04 | Phase 7 | Complete |
| UX-01 | Phase 6 | Complete |
| UX-02 | Phase 8 | Complete |
| ASSET-05 | Phase 12 | Complete |
| ASSET-06 | Phase 12 | Complete |
| ASSET-07 | Phase 12 | Complete |
| SPACE-01 | Phase 13 | Pending |
| SPACE-02 | Phase 13 | Pending |
| SPACE-03 | Phase 13 | Pending |
| POLISH-01 | Phase 14 | Pending |

**Coverage:**
- v1.3 requirements: 7 total
- Mapped to phases: 7/7
- Unmapped: 0

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-03-01 after v1.3 roadmap creation*
