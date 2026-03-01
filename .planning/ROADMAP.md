# Roadmap: Ship Studio Figma Plugin

## Milestones

- ✅ **v1.0 Ship Studio Figma Plugin** -- Phases 1-5 (shipped 2026-02-28)
- ✅ **v1.1 Brief Quality & UX** -- Phases 6-8 (shipped 2026-02-28)
- ✅ **v1.2 Brief Quality Overhaul** -- Phases 9-11 (shipped 2026-03-01, outside GSD workflow)
- ✅ **v1.3 Asset Completeness & Polish** -- Phases 12-14 (shipped 2026-03-01)
- ✅ **v2.0 Manual Asset Control** -- Phases 15-19 (shipped 2026-03-01)
- ✅ **v2.1 Brief Modes & Placeholders** -- Phases 20-23 (shipped 2026-03-01)
- **v2.2 Designer Asset Workflow & Results UX** -- Phases 24-27 (in progress)

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

<details>
<summary>v2.1 Brief Modes & Placeholders (Phases 20-23) -- SHIPPED 2026-03-01</summary>

- [x] Phase 20: Mode Selector UI (1/1 plans) -- completed 2026-03-01
- [x] Phase 21: Mode-Specific Brief Instructions (1/1 plans) -- completed 2026-03-01
- [x] Phase 22: Asset Clarity in Brief (1/1 plans) -- completed 2026-03-01
- [x] Phase 23: Placeholder System (1/1 plans) -- completed 2026-03-01

</details>

### v2.2 Designer Asset Workflow & Results UX

**Milestone Goal:** Replace the manual asset URL workflow with convention-based `@S-` prefix detection, and transform the results screen into a clean "brief is done" experience that guides designers on next steps.

- [x] **Phase 24: Detection Foundation** - Pure function that walks the raw Figma tree to find `@S-` prefixed layers and auto-detect their export format (completed 2026-03-01)
- [ ] **Phase 25: Pipeline Integration & Zero-Asset Warning** - Wire detection output into the export pipeline and add a checkpoint warning when no assets are found
- [ ] **Phase 26: MainView Rewiring & Cleanup** - Replace manual asset state with detected assets end-to-end and delete the old manual workflow code
- [ ] **Phase 27: Results Modal** - Replace inline results card with a clean modal guiding designers to paste the brief and iterate

## Phase Details

### Phase 24: Detection Foundation
**Goal**: The plugin can scan any raw Figma tree and produce a correctly-typed list of detected assets with auto-determined export formats and clean filenames
**Depends on**: Phase 23 (v2.1 complete)
**Requirements**: DETECT-01, DETECT-02, DETECT-03, DETECT-04, DETECT-05
**Success Criteria** (what must be TRUE):
  1. Given a Figma tree containing layers named `@S-hero`, `@S-icon`, and `@S-logo`, the detection function returns exactly those three layers as detected assets (case-insensitive matching)
  2. A layer named `@S-hero` containing a child RECTANGLE with an IMAGE fill is detected as PNG format; a layer named `@S-icon` with only vector children is detected as SVG format
  3. Detected asset filenames have the `@S-` prefix stripped and are sanitized (e.g. `@S-hero-image` becomes `hero-image.png`), with duplicates auto-numbered (`icon.svg`, `icon-2.svg`)
  4. Each detected asset carries its Figma node ID, enabling downstream mapping to the layout tree position
  5. Hidden layers (visible=false) and layers inside an `@S-` subtree are not double-detected
**Plans:** 1/1 plans complete
Plans:
- [ ] 24-01-PLAN.md -- TDD: DetectedAsset type + detectAssets pure function with @S- prefix scanning, format auto-detection, and filename handling

### Phase 25: Pipeline Integration & Zero-Asset Warning
**Goal**: Detection output flows through the existing export pipeline and the user sees a clear warning when no `@S-` assets exist in their design
**Depends on**: Phase 24
**Requirements**: WARN-01, WARN-02, WARN-03, WARN-04
**Success Criteria** (what must be TRUE):
  1. The extraction pipeline exposes raw Figma nodes (pre-normalization) so detection can run on the full tree including INSTANCE subtrees
  2. When no `@S-` layers are found, the user sees a warning explaining the `@S-` naming convention with both "Continue anyway" and "Try again" options
  3. "Try again" re-fetches from the Figma API (not re-scanning in-memory data), so the designer can fix their file and retry
  4. "Continue anyway" proceeds to generate a brief with zero assets (preview-only brief)
  5. `DetectedAsset[]` flows into the existing `exportAssets()` pipeline without type errors or node ID corruption
**Plans**: TBD

### Phase 26: MainView Rewiring & Cleanup
**Goal**: The plugin works end-to-end with `@S-` detection as the sole asset workflow, with all manual URL code removed
**Depends on**: Phase 25
**Requirements**: CLNP-01, CLNP-02
**Success Criteria** (what must be TRUE):
  1. The manual asset URL workflow is completely gone -- no AssetListPanel, no "paste Figma URL" input, no manual asset state or callbacks in MainView
  2. The resolve helpers (resolve.ts, resolve.test.ts) are deleted and no imports reference them
  3. The plugin generates a correct brief with detected `@S-` assets end-to-end: extraction, detection, export, brief generation, clipboard copy all work in sequence
  4. The existing test suite passes after cleanup (no broken imports, no orphaned types)
**Plans**: TBD

### Phase 27: Results Modal
**Goal**: After brief generation, the user sees a clean modal that confirms success, guides them to paste the brief into their agent, and offers expandable details for power users
**Depends on**: Phase 26
**Requirements**: RSLT-01, RSLT-02, RSLT-03, RSLT-04, RSLT-05
**Success Criteria** (what must be TRUE):
  1. After brief generation, a modal appears with a clear success message and a primary "Copy to clipboard" button
  2. The modal tells the user to paste the brief into Claude Code (or their agent) as the next step
  3. The modal includes a message about potential mistakes and encourages the user to refine iteratively
  4. An expandable "View details" toggle reveals the asset list, layout tree, and token summary -- collapsed by default
  5. The user can dismiss the modal and start a new brief without stale state from the previous run
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 24 -> 25 -> 26 -> 27

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
| 20. Mode Selector UI | v2.1 | 1/1 | Complete | 2026-03-01 |
| 21. Mode-Specific Brief Instructions | v2.1 | 1/1 | Complete | 2026-03-01 |
| 22. Asset Clarity in Brief | v2.1 | 1/1 | Complete | 2026-03-01 |
| 23. Placeholder System | v2.1 | 1/1 | Complete | 2026-03-01 |
| 24. Detection Foundation | 1/1 | Complete   | 2026-03-01 | - |
| 25. Pipeline Integration & Zero-Asset Warning | v2.2 | 0/? | Not started | - |
| 26. MainView Rewiring & Cleanup | v2.2 | 0/? | Not started | - |
| 27. Results Modal | v2.2 | 0/? | Not started | - |
