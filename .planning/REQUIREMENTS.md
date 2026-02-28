# Requirements: Ship Studio Figma Plugin

**Defined:** 2026-02-28
**Core Value:** Turn any Figma design into a structured, complete design brief that gives Claude Code everything it needs to build the component accurately

## v1.1 Requirements

Requirements for v1.1 milestone. Each maps to roadmap phases.

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

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Asset Refinement

- **ASSET-05**: Progressive asset disclosure in results UI -- group by type (icons, illustrations, photos)
- **ASSET-06**: Collapsible tree preview in results screen

### Brief Enhancements

- **INST-04**: Executable verification loop -- checklist tied to actual extracted tokens and assets

### UX Polish

- **UX-03**: Advanced options behind progressive disclosure toggle for power users

## Out of Scope

| Feature | Reason |
|---------|--------|
| Code generation with framework targets | Plugin prepares context; Claude Code generates code in project context |
| Automatic component detection from structure | Over/under-detects without designer naming intent from Figma |
| Real-time design sync | Polling/webhook complexity not justified for per-session use case |
| Multi-file batch extraction | Scope explosion; extract one frame at a time |
| W3C DTCG token format export | Deferred to v2+ |
| Visual annotations / Dev Mode data | Deferred to v2+ |
| Brief templates / customization | Deferred to v2+ |
| SVGO optimization | Evaluate only if raw SVG quality is insufficient |
| Zod runtime validation | Decide later based on API error noise |

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

**Coverage:**
- v1.1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 after roadmap creation*
