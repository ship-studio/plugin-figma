# Project Research Summary

**Project:** Ship Studio Figma Plugin v2.0 -- Manual Asset Control
**Domain:** Figma REST API plugin refactoring (replacing auto-detection with user-driven asset selection)
**Researched:** 2026-03-01
**Confidence:** HIGH

## Executive Summary

The v2.0 milestone replaces the plugin's unreliable automatic asset detection pipeline with a manual, user-driven asset list. The user pastes Figma URLs for specific design elements, chooses PNG or SVG format, and the plugin exports exactly what was requested. This eliminates the entire class of false-positive/negative detection bugs from v1.x (composition heuristics, SVG dedup edge cases, illustration detection failures) and significantly simplifies the codebase by deleting approximately 500 lines of the most complex code.

The recommended approach requires zero new dependencies. The existing stack (TypeScript, React 18, Vite, Figma REST API via curl) already provides every capability needed. The core work is a pipeline restructuring: splitting the current single-button flow into a two-phase interaction (Extract layout, then Build asset list + Get Brief), rewiring `export.ts` to accept a user-provided `ManualAsset[]` instead of auto-detected entries, and simplifying the brief generator by removing composition collapse logic. Four files are deleted entirely, three are modified significantly, and one new file (~15 lines) is created.

The primary risk is the deletion sequence: 68 tests directly reference the modules being removed, and 63 more tests use type fixtures that will change. The safe path is incremental deletion -- hollow out auto-detection functions first, delete their tests, build the new pipeline alongside the old one, then remove the dead code. At no point should the developer be fighting both build errors and logic errors simultaneously. Secondary risks include unvalidated node IDs (Figma API returns null for unrenderable nodes) and MainView.tsx state complexity (already 673 lines with 15+ state variables).

## Key Findings

### Recommended Stack

No dependency changes. Every v2.0 requirement maps to an existing capability in the codebase. The URL parser, filename sanitizer, collision resolver, Figma API client, download pipeline, and brief generator all survive with minor modifications. Adding any library (state management, UI components, form handling, drag-and-drop) would be over-engineering for a feature that manages a list of fewer than 20 items.

**Core technologies (unchanged):**
- **TypeScript 5.x**: Type safety, already in use
- **React 18 (host-provided)**: `useState` + `useCallback` sufficient for asset list state
- **Vite 6.x / Vitest**: Build and test, already in use
- **`@figma/rest-api-spec`**: Type definitions for API responses, already in use
- **`curl` via `shell.exec`**: HTTP requests to Figma API, already the access pattern

**Code to remove (net simplification):**
- `identify.ts` (~307 lines), `detect-composition.ts` (~209 lines), and their test files
- `fetchImageFills` call path (no more imageRef resolution)
- Composition/illustration heuristics throughout the pipeline

### Expected Features

**Must have (table stakes):**
- Paste single-node Figma URL to add an asset (reuses existing `parseFigmaUrl`)
- Format picker (PNG/SVG) per asset with PNG as default
- Same-file validation (asset URL fileKey must match design URL fileKey)
- Node ID presence validation (reject file-level URLs without node selection)
- Auto-derived filename from Figma layer name via API + `sanitizeFilename()`
- Duplicate filename collision resolution via existing `resolveCollisions()`
- Asset list display with individual remove and clear-all
- Duplicate node ID prevention
- Batch export via `fetchImages()` replacing the identify/detect pipeline
- Layout tree cross-referencing (already works, just needs manual list to provide nodeIds)
- Full-page preview PNG remains auto-generated
- Complete removal of all auto-detection code

**Should have (differentiators, strong candidates for v2.0):**
- Inline filename editing (override auto-derived names)
- Format auto-suggestion based on node type (SVG for vectors, PNG for everything else)

**Defer to v2.1+:**
- Multi-node URL support (Figma does not produce multi-node URLs from its native UI)
- Drag-to-reorder asset list (order is cosmetic)
- Asset preview thumbnails (expensive API calls for marginal UX benefit)
- Persisted asset list across sessions (workflow is 2-5 minutes total)
- Batch URL paste (parsing complexity for minimal benefit)

**Anti-features (explicitly do not build):**
- Auto-detection fallback (defeats the purpose of v2.0)
- Drag-and-drop from Figma (requires plugin architecture, not REST API)
- Asset grouping/folders (Claude Code reads flat directories)
- SVG optimization/minification (can break SVGs)

### Architecture Approach

The pipeline splits from one continuous sequence into two user-triggered phases. Phase 1 (Extract) runs layout extraction and makes the asset list UI available. The user then builds their asset list by pasting URLs. Phase 2 (Get Brief) exports the user-specified assets and generates the brief. The boundary between these phases is clean because the existing architecture already separates layout extraction from asset export. The auto-detection layer sits exactly at this boundary and is the code being removed.

**Major components:**
1. **URL Parser (`url-parser.ts`)** -- Unchanged; reused to parse both design and asset URLs
2. **Node Resolver (`assets/resolve.ts`)** -- NEW; lightweight wrapper around `fetchFileNodes()` to get layer name
3. **Asset List State (in `MainView.tsx` or extracted `AssetList.tsx`)** -- NEW; React state for `ManualAsset[]` with add/remove/validate
4. **Export Pipeline (`assets/export.ts`)** -- MODIFIED; accepts `ManualAsset[]` instead of auto-detecting; two API calls (one PNG batch, one SVG batch)
5. **Brief Generator (`brief/generate.ts`)** -- SIMPLIFIED; removes composition collapse, simplifies asset type labels to icon/image
6. **Download Pipeline (`assets/download.ts`)** -- Unchanged; format-agnostic sequential downloads

**Key new type:**
```typescript
interface ManualAsset {
  id: string;
  nodeId: string;
  nodeName: string;
  format: 'png' | 'svg';
  filename: string;
  status: 'resolving' | 'valid' | 'error';
  error?: string;
}
```

### Critical Pitfalls

1. **Import graph breakage from auto-detection removal** -- `export.ts` and `generate.ts` import from the deleted modules. Map the full import graph first, delete incrementally, and run tests after each step. Never fight build errors and logic errors simultaneously.

2. **Layout tree cross-referencing breaks silently** -- The `assetNodeMap` in `generate.ts` must be rewired to use user-provided node IDs. Drop `compositionNodeIds` entirely. Instance-child node IDs (I-prefix compound IDs) will show `--` for location in the assets table -- acceptable for v2.0.

3. **Figma API returns null for unrenderable nodes** -- Users can paste URLs to hidden, deleted, or non-visual nodes. Validate at add time (during name resolution), not at export time. Show per-asset status in the UI.

4. **Test cascade from type changes** -- 68 tests reference deleted modules, 63 more use changed type fixtures. Delete tests before modules. Update `makeExportResult` fixtures in `generate.test.ts` to use the new type shape. Maintain green tests at every step.

5. **MainView.tsx state explosion** -- Already 673 lines with 15+ state variables. Extract asset list into a separate `AssetList.tsx` component with its own state management to keep complexity manageable.

## Implications for Roadmap

Based on research, the work naturally divides into 5 phases with strict downward dependencies. Each phase is independently testable and ends with all tests passing.

### Phase 1: Strip Auto-Detection (Foundation Cleanup)

**Rationale:** All subsequent work builds on a codebase without dead code. Doing deletions first minimizes merge conflicts and eliminates the risk of building new features on top of modules that will be removed. This is the highest-risk phase because it touches the most files and has the most potential for test cascade failures.

**Delivers:** A compiling, green-test codebase with auto-detection hollowed out. Preview-only export still works. Brief generation still works with empty asset lists.

**Addresses:** Remove all auto-detection code (table stakes item), codebase simplification

**Avoids:** Pitfalls 1 (import graph breakage), 7 (incomplete pipeline removal), 8 (test cascade)

**Specific work:**
- Delete `identify.ts`, `identify.test.ts`, `detect-composition.ts`, `detect-composition.test.ts`
- Remove `collectImageFillsFromRawTree()`, `collectInstancesWithText()` from `extract.ts`
- Stub `exportAssets()` to skip auto-detection (preview only)
- Remove `compositionNodeIds` and `[Illustration]` collapse from `generate.ts`
- Update `generate.test.ts` fixtures to remove `'composition'` and `'component'` asset types

### Phase 2: Manual Asset Types + Node Resolution

**Rationale:** Pure data types and a single API function with no UI. Fully testable in isolation. Required before the export pipeline can accept the new input shape.

**Delivers:** `ManualAsset` type definition, `resolveNodeName()` function, filename derivation integration with existing `sanitizeFilename()`.

**Addresses:** Auto-derived filename (table stakes), format picker data model

**Avoids:** Pitfall 4 (unrenderable nodes -- validation starts here with error handling on resolve)

**Specific work:**
- Create `assets/resolve.ts` with `resolveNodeName()`
- Add `ManualAsset` type to `assets/types.ts`
- Simplify `ExportResult.assets` type (drop `'composition'`/`'component'`)
- Unit test resolve + filename derivation

### Phase 3: Rebuild Export Pipeline

**Rationale:** The export pipeline must work before any UI can trigger it. Depends on Phase 2 types. This is the functional core of the v2.0 change.

**Delivers:** A working `exportAssets()` that accepts `ManualAsset[]`, batches by format, downloads to disk.

**Addresses:** Batch export via fetchImages (table stakes), format-aware batching

**Avoids:** Pitfalls 6 (shell timeout -- batch 10-15 nodes per API call), 7 (pipeline rewrite completeness), 13 (imageRef removal -- use render API for everything)

**Specific work:**
- Rewrite `exportAssets()` signature to accept `ManualAsset[]`
- Split assets by format, one `fetchImages()` call per format
- Preserve preview PNG generation
- Remove `fetchImageFills` call path
- Handle null render URLs with per-asset warnings

### Phase 4: Brief Generator Updates

**Rationale:** Depends on Phase 3 (new `ExportResult` shape). Pure function, fully testable. The brief is the core deliverable -- it must be correct.

**Delivers:** Updated brief generation with simplified asset type labels, working cross-referencing via user-provided node IDs, no composition collapse.

**Addresses:** Layout tree cross-referencing (table stakes), brief quality

**Avoids:** Pitfall 2 (cross-referencing breakage -- wire up nodeId from manual assets, accept `--` for instance-child locations)

**Specific work:**
- Simplify `assetTypeLabel` to `'Icon'` (SVG) / `'Image'` (PNG)
- Remove `compositionNodeIds` parameter threading
- Update `BriefInput` type
- Update all test fixtures in `generate.test.ts`

### Phase 5: MainView UI Rewrite

**Rationale:** Depends on all previous phases. The UI wires together resolve.ts (Phase 2), export.ts (Phase 3), and generate.ts (Phase 4). Best done when all pieces are stable and tested.

**Delivers:** Two-phase user flow (Extract, then Build asset list + Get Brief). Asset URL input with format picker. Asset list with add/remove/validate. Complete end-to-end workflow.

**Addresses:** Asset URL input (table stakes), asset list management (table stakes), URL validation (table stakes), duplicate prevention (table stakes)

**Avoids:** Pitfalls 3 (multi-select URL ambiguity -- one URL per asset), 5 (filename collisions -- show derived names in UI), 9 (cross-file URLs -- validate fileKey at add time), 10 (state complexity -- extract AssetList into separate component)

**Specific work:**
- Split "Get Brief" into "Extract" and "Get Brief" buttons
- Add asset URL input + format picker + "Add Asset" button
- Add asset list display with per-asset status, filename preview, and remove button
- Implement validate-then-add pattern (optimistic UI with resolving/valid/error states)
- Same-file enforcement at add time
- Duplicate node ID prevention
- Wire "Get Brief" to new export pipeline
- Remove composition-related UI elements

### Phase Ordering Rationale

- **Deletion first (Phase 1)** because building on dead code creates merge conflicts and false confidence in test counts
- **Types and resolution second (Phase 2)** because the export pipeline and UI both depend on `ManualAsset` and `resolveNodeName()`
- **Export pipeline third (Phase 3)** because it is the functional core and must work before the UI can call it
- **Brief generator fourth (Phase 4)** because it depends on the new `ExportResult` shape from Phase 3
- **UI last (Phase 5)** because it integrates all previous pieces and is the highest-churn code -- building it on stable foundations reduces rework

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Needs careful import graph analysis before any deletion. Run `grep -r` to map all consumers. The PITFALLS research provides a safe deletion strategy but the exact line numbers and test counts should be verified at implementation time.
- **Phase 5:** UI design decisions (two-button vs single-button with state, asset list layout in constrained toolbar space, error message wording) may benefit from mockup review before implementation.

Phases with standard patterns (skip research-phase):
- **Phase 2:** Standard API wrapper + TypeScript types. Well-documented Figma API. Existing `fetchFileNodes()` already does the work.
- **Phase 3:** Straightforward pipeline simplification. Remove code paths, keep the ones that work.
- **Phase 4:** Pure function updates with comprehensive existing test coverage to guide changes.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | No new dependencies; all capabilities verified in local codebase and Figma API docs |
| Features | HIGH | Feature list derived from codebase analysis + Figma API constraints + PROJECT.md requirements |
| Architecture | HIGH | Full codebase analysis with line-level specificity; data flow traced through all modules |
| Pitfalls | HIGH | 325 tests analyzed, import graph mapped, Figma API edge cases documented from official docs + forum reports |

**Overall confidence:** HIGH

The unusually high confidence across all areas is because this is a refactoring of an existing, well-understood codebase rather than greenfield development. The researchers had direct access to every source file, test file, and API type definition. The one area of lower confidence is the multi-select URL format (LOW confidence, undocumented by Figma) -- but the recommendation is to not rely on it, sidestepping the uncertainty entirely.

### Gaps to Address

- **Instance-child node IDs (I-prefix):** These compound IDs (`I5912:74596;5912:74456`) cannot be rendered by the Figma images API. Detection and user-facing error messaging need to be designed during Phase 2/5 implementation.
- **Optimal batch size for fetchImages:** Research suggests 10-15 nodes per call to stay under Figma's 55s server-side render timeout, but the exact threshold depends on node complexity. Monitor during Phase 3 testing and tune the constant.
- **MainView.tsx component extraction boundary:** Whether to extract just the asset list or also the extraction flow into separate components is a design decision for Phase 5. The 800-line / 18-state-variable threshold from PITFALLS.md is a good heuristic.
- **Empty asset list behavior:** Should "Get Brief" require at least one asset, or allow layout-only briefs? FEATURES.md says empty is valid. Confirm this UX decision before Phase 5.

## Sources

### Primary (HIGH confidence)
- Local codebase: all files in `src/` -- verified utility functions, API wrappers, types, tests, UI patterns
- `@figma/rest-api-spec` types (local `node_modules`) -- `GetFileNodesResponse`, `Node`, `IsLayerTrait`
- [Figma REST API - File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) -- images endpoint, nodes endpoint, batch IDs
- [Figma Export Formats and Settings](https://help.figma.com/hc/en-us/articles/13402894554519-Export-formats-and-settings) -- SVG 1x constraint, PNG scale range

### Secondary (MEDIUM confidence)
- [Figma Forum - I-prefix node IDs](https://forum.figma.com/ask-the-community-7/can-t-get-node-with-prefix-i-9560) -- instance child rendering limitations
- [Figma Forum - Copy link to selection](https://forum.figma.com/suggest-a-feature-11/share-to-selection-links-should-be-consistent-34807) -- single-node URL confirmed
- [Figma Forum - Rate limits](https://forum.figma.com/report-a-problem-6/rest-api-rate-limit-images-api-returns-429-after-10-requests-cloudfront-49021) -- burst pattern lockouts
- [Multi-Link Copy Figma plugin](https://www.figma.com/community/plugin/1423324569458473026/multi-link-copy) -- confirms Figma lacks native multi-node URLs

### Tertiary (LOW confidence)
- Multi-select URL format (comma-separated `node-id` values) -- observed in the wild, undocumented, may change. Recommendation: do not rely on it.

---
*Research completed: 2026-03-01*
*Ready for roadmap: yes*
