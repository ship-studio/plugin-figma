# Roadmap: Ship Studio Figma Plugin

## Milestones

- ✅ **v1.0 Ship Studio Figma Plugin** -- Phases 1-5 (shipped 2026-02-28)
- ✅ **v1.1 Brief Quality & UX** -- Phases 6-8 (shipped 2026-02-28)
- ✅ **v1.2 Brief Quality Overhaul** -- Phases 9-11 (shipped 2026-03-01, outside GSD workflow)
- ✅ **v1.3 Asset Completeness & Polish** -- Phases 12-14 (shipped 2026-03-01)
- ✅ **v2.0 Manual Asset Control** -- Phases 15-19 (shipped 2026-03-01)
- **v2.1 Brief Modes & Placeholders** -- Phases 20-23 (in progress)

## Phases

<details>
<summary>v1.0 Ship Studio Figma Plugin (Phases 1-5) -- SHIPPED 2026-02-28</summary>

- [x] Phase 1: Plugin Foundation & Figma Connection (3/3 plans) -- completed 2026-02-28
- [x] Phase 2: Layout Extraction (2/2 plans) -- completed 2026-02-28
- [x] Phase 3: Design Data Extraction (2/2 plans) -- completed 2026-02-28
- [x] Phase 4: Image & Asset Export (2/2 plans) -- completed 2026-02-28
- [x] Phase 5: Brief Assembly & Output (2/2 plans) -- completed 2026-02-28

See: `.planning/milestones/v1.0-ROADMAP.md` for full details.

</details>

<details>
<summary>v1.1 Brief Quality & UX (Phases 6-8) -- SHIPPED 2026-02-28</summary>

- [x] Phase 6: Brief Instructions & Terminology (2/2 plans) -- completed 2026-02-28
- [x] Phase 7: Smart Asset Detection & Layout Mapping (2/2 plans) -- completed 2026-02-28
- [x] Phase 8: UX Flow Simplification (1/1 plans) -- completed 2026-02-28

</details>

<details>
<summary>v1.2 Brief Quality Overhaul (Phases 9-11) -- SHIPPED 2026-03-01</summary>

- [x] Phase 9: Smart Illustration Detection -- completed 2026-03-01
- [x] Phase 10: Layout Tree Quality -- completed 2026-03-01
- [x] Phase 11: UI Fixes -- completed 2026-03-01

</details>

<details>
<summary>v1.3 Asset Completeness & Polish (Phases 12-14) -- SHIPPED 2026-03-01</summary>

- [x] Phase 12: Instance Asset Detection (2/2 plans) -- completed 2026-03-01
- [x] Phase 13: Spacing & Layout Accuracy (1/1 plans) -- completed 2026-03-01
- [x] Phase 14: Plugin Icon (1/1 plans) -- completed 2026-03-01

See: `.planning/milestones/v1.3-ROADMAP.md` for full details.

</details>

<details>
<summary>v2.0 Manual Asset Control (Phases 15-19) -- SHIPPED 2026-03-01</summary>

- [x] Phase 15: Strip Auto-Detection (1/1 plans) -- completed 2026-03-01
- [x] Phase 16: Asset Types & Node Resolution (1/1 plans) -- completed 2026-03-01
- [x] Phase 17: Export Pipeline Rebuild (1/1 plans) -- completed 2026-03-01
- [x] Phase 18: Brief Generator Updates (1/1 plans) -- completed 2026-03-01
- [x] Phase 19: Asset List UI & Integration (2/2 plans) -- completed 2026-03-01

</details>

### v2.1 Brief Modes & Placeholders

**Milestone Goal:** Give users control over how Claude Code interprets the design brief -- from pixel-perfect reproduction to loose inspiration -- and ensure every missing asset gets a named placeholder for easy follow-up.

- [x] **Phase 20: Mode Selector UI** - Add brief mode picker with three options and explanatory text (completed 2026-03-01)
- [x] **Phase 21: Mode-Specific Brief Instructions** - Generate different Claude Code instructions per mode, including inspiration text area (completed 2026-03-01)
- [ ] **Phase 22: Asset Clarity in Brief** - Clearly distinguish provided assets from non-asset elements with explicit usage context
- [ ] **Phase 23: Placeholder System** - Brief instructs Claude Code to identify missing assets and create named placeholder boxes

## Phase Details

### Phase 20: Mode Selector UI
**Goal**: Users can see and choose between three brief modes, each with clear explanatory text describing what it does
**Depends on**: Phase 19
**Requirements**: MODE-01, MODE-02
**Success Criteria** (what must be TRUE):
  1. User sees three brief mode options in the plugin UI: "Copy (Best results)", "Copy (Pixel for pixel)", and "Use as inspiration"
  2. Each mode displays explanatory text that describes its behavior in plain language (e.g., what Claude Code will do differently)
  3. The selected mode persists during the current session -- user does not need to re-select after navigating back from results
  4. The default mode is "Copy (Best results)" when no prior selection exists
**Plans**: 1 plan
Plans:
- [ ] 20-01-PLAN.md — Add mode selector CSS and UI (mode cards with state, rendering, persistence)

### Phase 21: Mode-Specific Brief Instructions
**Goal**: The generated brief contains different Claude Code instructions depending on the selected mode, and the "Use as inspiration" mode captures custom user context
**Depends on**: Phase 20
**Requirements**: MODE-03, MODE-04, MODE-05, MODE-06
**Success Criteria** (what must be TRUE):
  1. Selecting "Copy (Best results)" produces a brief that instructs Claude Code to faithfully reproduce the design with clean, responsive development practices
  2. Selecting "Copy (Pixel for pixel)" produces a brief that instructs Claude Code to match the Figma design as exactly as possible (exact pixel values, no responsive abstractions)
  3. Selecting "Use as inspiration" shows a text area where the user describes what to take from the design -- and the brief incorporates that custom context into instructions telling Claude Code to adapt the design patterns rather than copy them
  4. The mode-specific instructions replace the existing static "How to Use This Brief" section -- there is only one set of instructions, not two
**Plans**: TBD

### Phase 22: Asset Clarity in Brief
**Goal**: The brief output makes it immediately obvious which elements have provided assets and which do not, with explicit usage context for every asset
**Depends on**: Phase 21
**Requirements**: ASTC-01, ASTC-02
**Success Criteria** (what must be TRUE):
  1. The brief clearly distinguishes provided assets from non-asset elements -- a reader can tell at a glance which visual elements in the design have real files and which do not
  2. The brief includes an explicit asset manifest listing every provided asset with its filename, format, and intended usage context (e.g., "hero-image.png -- background image for the hero section")
**Plans**: TBD

### Phase 23: Placeholder System
**Goal**: The brief instructs Claude Code to create visible, named placeholder boxes for any visual element that needs an asset but does not have one -- users can reference these placeholders in follow-up prompts
**Depends on**: Phase 22
**Requirements**: PLCH-01, PLCH-02, PLCH-03, PLCH-04
**Success Criteria** (what must be TRUE):
  1. The brief instructs Claude Code to compare the preview image against the provided asset list and identify visual elements (images, icons, illustrations) that need assets but were not provided
  2. The brief instructs Claude Code to create visible colored placeholder boxes (not invisible divs) for each missing asset, sized to match the design
  3. Each placeholder has a unique, human-readable reference name (e.g., `[asset-ref-1: hero background]`) that appears both in the placeholder box and in the brief's placeholder summary
  4. Users can reference placeholders in follow-up prompts (e.g., "Replace asset-ref-1 with this file") and Claude Code knows exactly which element to update
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 20 -> 21 -> 22 -> 23

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Plugin Foundation & Figma Connection | v1.0 | 3/3 | Complete | 2026-02-28 |
| 2. Layout Extraction | v1.0 | 2/2 | Complete | 2026-02-28 |
| 3. Design Data Extraction | v1.0 | 2/2 | Complete | 2026-02-28 |
| 4. Image & Asset Export | v1.0 | 2/2 | Complete | 2026-02-28 |
| 5. Brief Assembly & Output | v1.0 | 2/2 | Complete | 2026-02-28 |
| 6. Brief Instructions & Terminology | v1.1 | 2/2 | Complete | 2026-02-28 |
| 7. Smart Asset Detection & Layout Mapping | v1.1 | 2/2 | Complete | 2026-02-28 |
| 8. UX Flow Simplification | v1.1 | 1/1 | Complete | 2026-02-28 |
| 9. Smart Illustration Detection | v1.2 | N/A | Complete | 2026-03-01 |
| 10. Layout Tree Quality | v1.2 | N/A | Complete | 2026-03-01 |
| 11. UI Fixes | v1.2 | N/A | Complete | 2026-03-01 |
| 12. Instance Asset Detection | v1.3 | 2/2 | Complete | 2026-03-01 |
| 13. Spacing & Layout Accuracy | v1.3 | 1/1 | Complete | 2026-03-01 |
| 14. Plugin Icon | v1.3 | 1/1 | Complete | 2026-03-01 |
| 15. Strip Auto-Detection | v2.0 | 1/1 | Complete | 2026-03-01 |
| 16. Asset Types & Node Resolution | v2.0 | 1/1 | Complete | 2026-03-01 |
| 17. Export Pipeline Rebuild | v2.0 | 1/1 | Complete | 2026-03-01 |
| 18. Brief Generator Updates | v2.0 | 1/1 | Complete | 2026-03-01 |
| 19. Asset List UI & Integration | v2.0 | 2/2 | Complete | 2026-03-01 |
| 20. Mode Selector UI | 1/1 | Complete    | 2026-03-01 | - |
| 21. Mode-Specific Brief Instructions | 1/1 | Complete    | 2026-03-01 | - |
| 22. Asset Clarity in Brief | v2.1 | 0/? | Not started | - |
| 23. Placeholder System | v2.1 | 0/? | Not started | - |
