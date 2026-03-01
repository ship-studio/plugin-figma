# Requirements: Ship Studio Figma Plugin

**Defined:** 2026-03-01
**Core Value:** Turn any Figma design into a structured, complete design brief that gives Claude Code everything it needs to build the component accurately.

## v2.1 Requirements

Requirements for Brief Modes & Placeholders milestone. Each maps to roadmap phases.

### Brief Modes

- [x] **MODE-01**: User can choose between three brief modes: "Copy (Best results)", "Copy (Pixel for pixel)", "Use as inspiration"
- [x] **MODE-02**: Each mode has clear explanatory text in the UI describing its behavior
- [x] **MODE-03**: "Copy (Best results)" mode instructs Claude Code to faithfully reproduce the design with clean, responsive development practices
- [x] **MODE-04**: "Copy (Pixel for pixel)" mode instructs Claude Code to match the Figma design as exactly as possible
- [x] **MODE-05**: "Use as inspiration" mode shows a text area for the user to describe what to take from the design
- [x] **MODE-06**: "Use as inspiration" mode instructs Claude Code to adapt design patterns to the user's site, incorporating their custom context

### Placeholders

- [ ] **PLCH-01**: Brief instructs Claude Code to compare the preview against provided assets and identify visual elements that need assets but don't have them
- [ ] **PLCH-02**: Brief instructs Claude Code to create visible placeholder boxes for missing assets
- [ ] **PLCH-03**: Each placeholder has a unique reference name (e.g. `[asset-ref-1]`)
- [ ] **PLCH-04**: Users can reference placeholders in follow-up prompts (e.g. "Replace asset-ref-1 with this file")

### Asset Clarity

- [x] **ASTC-01**: Brief clearly distinguishes provided assets from non-asset elements
- [x] **ASTC-02**: Brief explicitly lists all provided assets with their intended usage context

## Previous Milestone Requirements (v2.0 -- Complete)

All 20 v2.0 requirements completed. See `.planning/milestones/` for details.

## Future Requirements

Deferred to future milestones. Tracked but not in current roadmap.

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
| Plugin-side placeholder detection | Claude Code can see the preview + assets; no need to rebuild auto-detection for flagging |
| Auto-detection fallback | Replaced by manual control in v2.0; not bringing it back |
| Mode-specific extraction | All three modes use the same extracted data; only the brief instructions change |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MODE-01 | Phase 20 | Complete |
| MODE-02 | Phase 20 | Complete |
| MODE-03 | Phase 21 | Complete |
| MODE-04 | Phase 21 | Complete |
| MODE-05 | Phase 21 | Complete |
| MODE-06 | Phase 21 | Complete |
| PLCH-01 | Phase 23 | Pending |
| PLCH-02 | Phase 23 | Pending |
| PLCH-03 | Phase 23 | Pending |
| PLCH-04 | Phase 23 | Pending |
| ASTC-01 | Phase 22 | Complete |
| ASTC-02 | Phase 22 | Complete |

**Coverage:**
- v2.1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0

---
*Requirements defined: 2026-03-01*
*Last updated: 2026-03-01 after roadmap creation*
