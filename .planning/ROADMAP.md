# Roadmap: Ship Studio Figma Plugin

## Milestones

- ✅ **v1.0 Ship Studio Figma Plugin** -- Phases 1-5 (shipped 2026-02-28)
- ✅ **v1.1 Brief Quality & UX** -- Phases 6-8 (shipped 2026-02-28)
- ✅ **v1.2 Brief Quality Overhaul** -- Phases 9-11 (shipped 2026-03-01, outside GSD workflow)
- ✅ **v1.3 Asset Completeness & Polish** -- Phases 12-14 (shipped 2026-03-01)

## Phases

<details>
<summary>✅ v1.0 Ship Studio Figma Plugin (Phases 1-5) -- SHIPPED 2026-02-28</summary>

- [x] Phase 1: Plugin Foundation & Figma Connection (3/3 plans) -- completed 2026-02-28
- [x] Phase 2: Layout Extraction (2/2 plans) -- completed 2026-02-28
- [x] Phase 3: Design Data Extraction (2/2 plans) -- completed 2026-02-28
- [x] Phase 4: Image & Asset Export (2/2 plans) -- completed 2026-02-28
- [x] Phase 5: Brief Assembly & Output (2/2 plans) -- completed 2026-02-28

See: `.planning/milestones/v1.0-ROADMAP.md` for full details.

</details>

<details>
<summary>✅ v1.1 Brief Quality & UX (Phases 6-8) -- SHIPPED 2026-02-28</summary>

- [x] Phase 6: Brief Instructions & Terminology (2/2 plans) -- completed 2026-02-28
- [x] Phase 7: Smart Asset Detection & Layout Mapping (2/2 plans) -- completed 2026-02-28
- [x] Phase 8: UX Flow Simplification (1/1 plans) -- completed 2026-02-28

</details>

<details>
<summary>✅ v1.2 Brief Quality Overhaul (Phases 9-11) -- SHIPPED 2026-03-01</summary>

- [x] Phase 9: Smart Illustration Detection -- completed 2026-03-01
- [x] Phase 10: Layout Tree Quality -- completed 2026-03-01
- [x] Phase 11: UI Fixes -- completed 2026-03-01

</details>

### v1.3 Asset Completeness & Polish (In Progress)

**Milestone Goal:** Make asset detection bulletproof -- every visible asset in a Figma design gets exported -- and tighten spacing accuracy so Claude Code builds match the design on first attempt.

- [x] **Phase 12: Instance Asset Detection** - Recurse into component instances to find and export all IMAGE fills; filter out noise SVGs (completed 2026-03-01)
- [x] **Phase 13: Spacing & Layout Accuracy** - Extract absolute positioning, flex-grow, and align-self so spacing in the brief matches Figma (completed 2026-03-01)
- [x] **Phase 14: Plugin Icon** - Display Figma logo SVG in Ship Studio toolbar (completed 2026-03-01)

## Phase Details

<details>
<summary>Phase 6: Brief Instructions & Terminology (v1.1)</summary>

**Goal**: Users get a brief that tells Claude Code how to behave (plan first, use only provided assets, verify against preview) and a plugin UI that speaks plain language
**Depends on**: Phase 5 (v1.0 brief assembly complete)
**Requirements**: INST-01, INST-02, INST-03, UX-01

Plans:
- [x] 06-01-PLAN.md -- Add "How to Use This Brief" instructions section to generated brief (TDD)
- [x] 06-02-PLAN.md -- Replace developer jargon with human-friendly terminology in plugin UI

</details>

<details>
<summary>Phase 7: Smart Asset Detection & Layout Mapping (v1.1)</summary>

**Goal**: Complex illustrations are automatically detected and exported as single images, and every exported asset is mapped to its exact position in the layout tree
**Depends on**: Phase 6
**Requirements**: ASSET-01, ASSET-02, ASSET-03, ASSET-04

Plans:
- [x] 07-01-PLAN.md -- Composition detection heuristic and breadcrumb path builder (TDD pure functions + type extensions)
- [x] 07-02-PLAN.md -- Pipeline integration: wire detection into export, extend brief Assets table with Type and Location columns

</details>

<details>
<summary>Phase 8: UX Flow Simplification (v1.1)</summary>

**Goal**: Users experience a streamlined plugin flow with fewer steps and less overwhelming results
**Depends on**: Phase 7
**Requirements**: UX-02

Plans:
- [x] 08-01-PLAN.md -- Merge 3 result sections into single result card and replace 3 spinners with single progress indicator

</details>

<details>
<summary>Phase 9: Smart Illustration Detection (v1.2)</summary>

**Goal**: Vector-only groups (GROUPs/FRAMEs where ALL descendants are primitives -- no TEXT or INSTANCE) are detected and exported as single PNGs instead of dozens of individual SVGs
**Depends on**: Phase 7 (composition detection)
**Changes**:
  - `detect-composition.ts` -- Added vector-only group detection heuristic
  - `identify.ts` -- LINE nodes excluded from SVG export (they're CSS borders)
  - SVG deduplication by sanitized filename -- one `linkedin.svg` instead of six copies
  - Warning messages now distinguish "composition" (visual effects) from "illustration" (vector-only group)

</details>

<details>
<summary>Phase 10: Layout Tree Quality (v1.2)</summary>

**Goal**: Layout tree output is cleaner and more useful for Claude Code
**Depends on**: Phase 9
**Changes**:
  - Composition/illustration subtrees collapsed to single line: `[Illustration] 'Hero' 500x400 -> hero.png`
  - INSTANCE tree lines show `-> filename.png` when matching asset exists (cross-referencing)
  - Text content truncation increased from 60 to 200 chars
  - Component names cleaned: `"Property 1=Green"` -> `"Green"` (strips generic Figma property prefixes)
  - Components table uses same cleaning logic

</details>

<details>
<summary>Phase 11: UI Fixes (v1.2)</summary>

**Goal**: Fix minor bugs in the plugin UI
**Depends on**: Phase 10
**Changes**:
  - `MainView.tsx` -- Defensive `String(w)` wrapper for warning rendering
  - `download.ts` -- `downloadAllAssets` type updated to include `'component'` in assetType union

</details>

### Post-milestone Fixes (applied outside GSD workflow)

- **Temp directory migration (2026-03-01):** Assets and brief now written to OS temp dir (`mktemp -d`) instead of `${projectPath}/.shipstudio/assets/`. Eliminates risk of `rm -rf` destroying user files. Files changed: `download.ts`, `types.ts`, `export.ts`, `io.ts`, `MainView.tsx`. All 276 tests pass.

### Phase 12: Instance Asset Detection
**Goal**: Every visible image asset in a Figma design is detected and exported, regardless of how deeply it is nested inside component instances
**Depends on**: Phase 11 (v1.2 complete)
**Requirements**: ASSET-05, ASSET-06, ASSET-07
**Success Criteria** (what must be TRUE):
  1. When a Figma design contains an image (photo, hero image, avatar) nested inside a component instance, that image appears in the exported assets directory as a PNG file
  2. When a component instance node itself has an IMAGE fill override (e.g., a card background image), that image is exported as a PNG file
  3. Simple solid-color RECTANGLE nodes (no strokes, no gradients, no image fills) are NOT exported as SVG -- only rectangles with visual complexity are exported
  4. The layout tree in the brief cross-references instance child images with their exported filenames (e.g., `-> hero-image.png`)
**Plans**: 2 plans

Plans:
- [x] 12-01-PLAN.md -- TDD: Instance asset detection and rectangle filtering in identifyAssets (isSimpleRectangle, findImageFillsInChildren, instance IMAGE fill override)
- [x] 12-02-PLAN.md -- Pipeline integration: raw tree image fill collection, layout tree cross-referencing, export pipeline threading

### Phase 13: Spacing & Layout Accuracy
**Goal**: The design brief provides Claude Code with accurate spacing, positioning, and flex properties so builds match the Figma design without manual CSS tweaking
**Depends on**: Phase 12
**Requirements**: SPACE-01, SPACE-02, SPACE-03
**Success Criteria** (what must be TRUE):
  1. When an element in Figma is absolutely positioned (not in an auto-layout frame), the brief includes its top/left offset relative to its parent
  2. When a flex child in Figma has `layoutGrow: 1`, the brief includes `flex-grow: 1` for that element
  3. When a flex child in Figma has `layoutAlign: STRETCH`, the brief includes `align-self: stretch` for that element
**Plans**: 1 plan

Plans:
- [x] 13-01-PLAN.md -- TDD: Add layoutGrow, layoutAlign, absoluteOffset to normalize pipeline and render in brief layout tree

### Phase 14: Plugin Icon
**Goal**: The plugin has proper visual identity in the Ship Studio toolbar
**Depends on**: Nothing (independent of Phases 12-13)
**Requirements**: POLISH-01
**Success Criteria** (what must be TRUE):
  1. The Ship Studio toolbar displays the Figma logo SVG icon next to the plugin name
  2. The icon renders correctly at the toolbar's standard icon size
**Plans**: 1 plan

Plans:
- [x] 14-01-PLAN.md -- Replace generic grid icon with Figma logo SVG in toolbar button

## Progress

**Execution Order:**
Phases execute in numeric order: 12 -> 12.x -> 13 -> 13.x -> 14

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
