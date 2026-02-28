# Roadmap: Ship Studio Figma Plugin

## Milestones

- ✅ **v1.0 Ship Studio Figma Plugin** -- Phases 1-5 (shipped 2026-02-28)
- ✅ **v1.1 Brief Quality & UX** -- Phases 6-8 (shipped 2026-02-28)
- ✅ **v1.2 Brief Quality Overhaul** -- Phases 9-11 (shipped 2026-03-01, outside GSD workflow)

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

See phase details below.

</details>

### ✅ v1.2 Brief Quality Overhaul (Shipped 2026-03-01)

**Milestone Goal:** Refine brief output quality — smarter illustration detection, cleaner layout tree, and bugfixes. Executed outside GSD workflow.

- [x] **Phase 9: Smart Illustration Detection** - Detect vector-only groups as illustrations, deduplicate SVGs, filter LINE nodes
- [x] **Phase 10: Layout Tree Quality** - Collapse illustration subtrees, add asset cross-references, clean component names
- [x] **Phase 11: UI Fixes** - Defensive warning rendering, component assetType support

### Post-milestone Fixes (applied outside GSD workflow)

- **Temp directory migration (2026-03-01):** Assets and brief now written to OS temp dir (`mktemp -d`) instead of `${projectPath}/.shipstudio/assets/`. Eliminates risk of `rm -rf` destroying user files. Files changed: `download.ts`, `types.ts`, `export.ts`, `io.ts`, `MainView.tsx`. All 276 tests pass.

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

### Phase 9: Smart Illustration Detection (v1.2)
**Goal**: Vector-only groups (GROUPs/FRAMEs where ALL descendants are primitives — no TEXT or INSTANCE) are detected and exported as single PNGs instead of dozens of individual SVGs
**Depends on**: Phase 7 (composition detection)
**Changes**:
  - `detect-composition.ts` — Added vector-only group detection heuristic
  - `identify.ts` — LINE nodes excluded from SVG export (they're CSS borders)
  - SVG deduplication by sanitized filename — one `linkedin.svg` instead of six copies
  - Warning messages now distinguish "composition" (visual effects) from "illustration" (vector-only group)

### Phase 10: Layout Tree Quality (v1.2)
**Goal**: Layout tree output is cleaner and more useful for Claude Code
**Depends on**: Phase 9
**Changes**:
  - Composition/illustration subtrees collapsed to single line: `[Illustration] 'Hero' 500x400 -> hero.png`
  - INSTANCE tree lines show `-> filename.png` when matching asset exists (cross-referencing)
  - Text content truncation increased from 60 to 200 chars
  - Component names cleaned: `"Property 1=Green"` → `"Green"` (strips generic Figma property prefixes)
  - Components table uses same cleaning logic

### Phase 11: UI Fixes (v1.2)
**Goal**: Fix minor bugs in the plugin UI
**Depends on**: Phase 10
**Changes**:
  - `MainView.tsx` — Defensive `String(w)` wrapper for warning rendering
  - `download.ts` — `downloadAllAssets` type updated to include `'component'` in assetType union

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
| 7. Smart Asset Detection & Layout Mapping | v1.1 | 2/2 | Complete | 2026-02-28 |
| 8. UX Flow Simplification | v1.1 | 1/1 | Complete | 2026-02-28 |
| 9. Smart Illustration Detection | v1.2 | N/A | Complete | 2026-03-01 |
| 10. Layout Tree Quality | v1.2 | N/A | Complete | 2026-03-01 |
| 11. UI Fixes | v1.2 | N/A | Complete | 2026-03-01 |
