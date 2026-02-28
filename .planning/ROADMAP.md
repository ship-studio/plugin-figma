# Roadmap: Ship Studio Figma Plugin

## Milestones

- ✅ **v1.0 Ship Studio Figma Plugin** -- Phases 1-5 (shipped 2026-02-28)
- 🚧 **v1.1 Brief Quality & UX** -- Phases 6-8 (in progress)

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

### 🚧 v1.1 Brief Quality & UX (In Progress)

**Milestone Goal:** Close the 80% to near-100% first-build accuracy gap by improving brief instructions, asset detection, and plugin UX.

**Phase Numbering:**
- Integer phases (6, 7, 8): Planned milestone work
- Decimal phases (6.1, 6.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 6: Brief Instructions & Terminology** - Add Claude Code behavior instructions to brief and replace jargon with human-friendly language
- [ ] **Phase 7: Smart Asset Detection & Layout Mapping** - Detect complex compositions, export as images, and map assets to their positions in the layout tree
- [ ] **Phase 8: UX Flow Simplification** - Reduce steps and surface composition warnings for a less overwhelming experience

## Phase Details

### Phase 6: Brief Instructions & Terminology
**Goal**: Users get a brief that tells Claude Code how to behave (plan first, use only provided assets, verify against preview) and a plugin UI that speaks plain language
**Depends on**: Phase 5 (v1.0 brief assembly complete)
**Requirements**: INST-01, INST-02, INST-03, UX-01
**Success Criteria** (what must be TRUE):
  1. Generated brief contains a plan mode instruction telling Claude Code to plan its approach and ask clarifying questions before building
  2. Generated brief contains an asset-only rule telling Claude Code to use only the provided assets and never fabricate replacements
  3. Generated brief contains a verification instruction telling Claude Code to compare its output against the PNG preview when done
  4. All user-facing text in the plugin uses plain, human-friendly language -- no "Extraction Scope", "Single Node", "auto-layout frames", or other developer jargon
**Plans**: 2 plans

Plans:
- [x] 06-01-PLAN.md -- Add "How to Use This Brief" instructions section to generated brief (TDD)
- [ ] 06-02-PLAN.md -- Replace developer jargon with human-friendly terminology in plugin UI

### Phase 7: Smart Asset Detection & Layout Mapping
**Goal**: Complex illustrations (nested groups of vectors, masks, blend modes) are automatically detected and exported as single images, and every exported asset is mapped to its exact position in the layout tree
**Depends on**: Phase 6
**Requirements**: ASSET-01, ASSET-02, ASSET-03, ASSET-04
**Success Criteria** (what must be TRUE):
  1. Plugin identifies complex compositions (nodes with high child count, nested vectors, masks, or blend modes) and flags them for image export instead of textual description
  2. Detected complex compositions are exported as single PNG images alongside the existing SVG/PNG asset pipeline
  3. Generated brief includes an asset mapping section that shows each exported asset's position in the layout tree via breadcrumb paths (e.g., "Hero > Header > Icon")
  4. Asset-to-layout mapping uses nodeId as the stable key, so filenames and breadcrumb paths stay aligned even when layer names collide
  5. Previously working asset exports (SVGs, image fills, simple icons) continue to work without regression
**Plans**: 2 plans

Plans:
- [ ] 07-01-PLAN.md -- Composition detection heuristic and breadcrumb path builder (TDD pure functions + type extensions)
- [ ] 07-02-PLAN.md -- Pipeline integration: wire detection into export, extend brief Assets table with Type and Location columns

### Phase 8: UX Flow Simplification
**Goal**: Users experience a streamlined plugin flow with fewer steps and less overwhelming results
**Depends on**: Phase 7 (composition detection needed for warnings)
**Requirements**: UX-02
**Success Criteria** (what must be TRUE):
  1. Plugin flow has fewer visible steps between pasting a URL and getting the brief
  2. Results screen surfaces key information (brief size, asset count, composition count) without overwhelming the user with raw data
  3. When complex compositions are detected, user sees a clear count/warning before extraction begins (e.g., "5 compositions will export as PNG")
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 6 -> 6.x -> 7 -> 7.x -> 8 -> 8.x

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Plugin Foundation & Figma Connection | v1.0 | 3/3 | Complete | 2026-02-28 |
| 2. Layout Extraction | v1.0 | 2/2 | Complete | 2026-02-28 |
| 3. Design Data Extraction | v1.0 | 2/2 | Complete | 2026-02-28 |
| 4. Image & Asset Export | v1.0 | 2/2 | Complete | 2026-02-28 |
| 5. Brief Assembly & Output | v1.0 | 2/2 | Complete | 2026-02-28 |
| 6. Brief Instructions & Terminology | v1.1 | 2/2 | Complete | 2026-02-28 |
| 7. Smart Asset Detection & Layout Mapping | v1.1 | 0/2 | Not started | - |
| 8. UX Flow Simplification | v1.1 | 0/? | Not started | - |
