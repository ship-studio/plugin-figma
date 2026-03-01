# Roadmap: Ship Studio Figma Plugin

## Milestones

- ✅ **v1.0 Ship Studio Figma Plugin** -- Phases 1-5 (shipped 2026-02-28)
- ✅ **v1.1 Brief Quality & UX** -- Phases 6-8 (shipped 2026-02-28)
- ✅ **v1.2 Brief Quality Overhaul** -- Phases 9-11 (shipped 2026-03-01, outside GSD workflow)
- ✅ **v1.3 Asset Completeness & Polish** -- Phases 12-14 (shipped 2026-03-01)
- **v2.0 Manual Asset Control** -- Phases 15-19 (in progress)

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

### v2.0 Manual Asset Control

**Milestone Goal:** Replace unreliable automatic asset detection with explicit user-driven asset selection -- users specify exactly which Figma elements to export and in what format, producing a perfect brief every time.

- [x] **Phase 15: Strip Auto-Detection** - Remove all automatic asset detection code, tests, and brief logic to create a clean base (completed 2026-03-01)
- [ ] **Phase 16: Asset Types & Node Resolution** - Define ManualAsset types, resolve node names via API, auto-derive filenames
- [ ] **Phase 17: Export Pipeline Rebuild** - Rewrite export to accept ManualAsset[] with format-aware batching
- [ ] **Phase 18: Brief Generator Updates** - Rewire asset-to-layout cross-referencing for manual assets, simplify type labels
- [ ] **Phase 19: Asset List UI & Integration** - Build the user-facing asset management workflow and wire everything together

## Phase Details

### Phase 15: Strip Auto-Detection
**Goal**: The codebase compiles and all tests pass with zero auto-detection code remaining -- preview-only export and empty-asset briefs work correctly
**Depends on**: Phase 14
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03, EXPT-03, EXPT-04
**Success Criteria** (what must be TRUE):
  1. `identify.ts` and `detect-composition.ts` no longer exist in the codebase
  2. All tests pass -- no references to deleted modules or removed types (`'composition'`, `'component'` asset types)
  3. Running the plugin with a Figma URL produces a brief containing layout tree, design tokens, and preview PNG but zero auto-detected assets
  4. The brief generator produces valid output when given an empty asset list
**Plans**: 1 plan
Plans:
- [ ] 15-01-PLAN.md -- Delete auto-detection modules, hollow out asset pipeline, strip brief generator composition logic, update MainView

### Phase 16: Asset Types & Node Resolution
**Goal**: A user can resolve any Figma node URL to a validated asset entry with auto-derived filename and suggested format
**Depends on**: Phase 15
**Requirements**: NAME-01, NAME-02, AINP-05, AINP-06
**Success Criteria** (what must be TRUE):
  1. Given a Figma node URL, the plugin resolves the node name via API and derives a sanitized filename (e.g., "Hero Image" becomes `hero-image.png`)
  2. When two assets would produce the same filename, the second is auto-numbered (`icon.png`, `icon-2.png`)
  3. Node URLs with I-prefix instance-child IDs are detected and produce a clear warning telling the user to select the parent component instead
  4. The plugin suggests SVG format for vector-type nodes and PNG for everything else
**Plans**: TBD

### Phase 17: Export Pipeline Rebuild
**Goal**: The export pipeline accepts a list of manual assets and produces correctly downloaded files, batched by format
**Depends on**: Phase 16
**Requirements**: EXPT-01
**Success Criteria** (what must be TRUE):
  1. Given a `ManualAsset[]` list, the plugin makes one `fetchImages` call per format (one for all PNGs, one for all SVGs) and downloads every asset to disk
  2. Preview PNG is still auto-generated alongside the manual assets
  3. Assets that fail to render (Figma returns null URL) produce per-asset warnings without blocking the rest of the export
**Plans**: TBD

### Phase 18: Brief Generator Updates
**Goal**: The generated brief correctly maps every manually-added asset to its position in the layout tree
**Depends on**: Phase 17
**Requirements**: EXPT-02
**Success Criteria** (what must be TRUE):
  1. Each asset in the brief's Assets table shows its location in the layout tree (derived from the asset's node ID matching a tree node)
  2. Asset type labels are simplified to "Icon" (SVG) and "Image" (PNG) with no composition/illustration terminology
  3. Instance-child node IDs that cannot be located in the tree show a dash for location (graceful degradation)
**Plans**: TBD

### Phase 19: Asset List UI & Integration
**Goal**: Users can build, review, edit, and export an asset list through a complete end-to-end workflow
**Depends on**: Phase 18
**Requirements**: AINP-01, AINP-02, AINP-03, AINP-04, LIST-01, LIST-02, LIST-03, LIST-04, LIST-05
**Success Criteria** (what must be TRUE):
  1. User can paste a Figma URL into an input field, choose PNG or SVG format, and add it to the asset list -- the plugin validates the URL contains a node ID and belongs to the same Figma file as the design URL
  2. User can see all queued assets showing derived filename, format, and status (resolving/valid/error) -- and can remove individual assets or clear the entire list
  3. User can edit the auto-derived filename for any asset before exporting
  4. Pasting a URL whose node ID is already in the list shows an error instead of creating a duplicate
  5. Clicking "Get Brief" with the asset list triggers export, brief generation, and copy-to-clipboard -- producing a complete brief with all listed assets mapped into the layout tree
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 15 -> 16 -> 17 -> 18 -> 19

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
| 15. Strip Auto-Detection | 1/1 | Complete    | 2026-03-01 | - |
| 16. Asset Types & Node Resolution | v2.0 | 0/TBD | Not started | - |
| 17. Export Pipeline Rebuild | v2.0 | 0/TBD | Not started | - |
| 18. Brief Generator Updates | v2.0 | 0/TBD | Not started | - |
| 19. Asset List UI & Integration | v2.0 | 0/TBD | Not started | - |
