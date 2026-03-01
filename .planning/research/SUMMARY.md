# Project Research Summary

**Project:** Ship Studio Figma Plugin v2.2 — @S- Asset Detection & Results UX
**Domain:** Convention-based asset detection and results UX redesign in an existing Figma plugin
**Researched:** 2026-03-01
**Confidence:** HIGH

## Executive Summary

This milestone (v2.2) replaces the manual URL-based asset workflow with a convention-based `@S-` prefix system: designers name Figma layers with the `@S-` prefix, the plugin tree-walks the raw Figma API response and automatically detects those layers as assets to export. Simultaneously, the inline results card is replaced with a modal overlay that guides designers toward the "paste into Claude Code" next step. Both changes are achievable with zero new npm dependencies — the entire milestone is application logic on top of the existing React + TypeScript + Vite + Figma REST API stack.

The recommended approach is a clean four-phase build ordered by data flow: detection foundation first (pure function, fully testable), pipeline wiring second (adapter changes connecting detection to export), MainView rewiring third (where the feature becomes functional end-to-end), and results modal last (pure presentation, can be cut if scope demands). The single most important architectural decision is that detection MUST walk the raw Figma API tree, not the normalized LayoutNode tree — the normalized tree strips INSTANCE subtrees, making any `@S-` layers inside component instances invisible. This is the highest-consequence design decision in the milestone.

The key risk is incomplete cleanup during removal of the manual asset workflow. The old system (AssetListPanel, resolve.ts, manualAssets state, 6 callbacks) is spread across 5+ files. If deletion is partial, the codebase is left with orphaned types and broken function signatures. The mitigation is strict build-before-remove discipline: get the `@S-` pipeline working and tested first, then delete the old code file by file, running the test suite after each deletion.

## Key Findings

### Recommended Stack

No new dependencies are required. The v2.2 features map entirely to existing capabilities: raw Figma node data already fetched by `extractLayout()`, filename utilities already in `sanitize.ts` and `resolve.ts`, the existing `Modal` component shell for the results overlay, and React `useState` for expandable toggle state. Adding any library (accordion, animation, state management) would add bundle weight for problems that do not exist.

**Core technologies:**
- TypeScript 5.x: type safety — already in use; the new `DetectedAsset` type is a 4-field minimal interface
- React 18 (host-provided): plugin UI — `useState` is sufficient for all new state (detected assets, zero-asset warning, modal open/close, details expanded)
- Vite 6.x: build — no changes to build config
- Vitest: testing — pure functions (detectAssets, hasImageFills, prefix stripping) are directly testable; expect ~150 new test lines
- `@figma/rest-api-spec`: Figma node types — raw nodes have `name`, `fills`, `children`, `id`, `type`, `visible` fields needed for detection

### Expected Features

**Must have (table stakes):**
- `@S-` prefix tree scan — core promise of the milestone; designers expect zero manual URL pasting
- Prefix stripped from filenames — `@S-hero` must become `hero.png`, not `s-hero.png`
- Auto-detect PNG vs SVG format — image fill on node or any descendant = PNG; pure vectors = SVG
- Duplicate `@S-` name handling — `icon.svg` and `icon-2.svg`, not silent overwrite
- Remove manual asset URL workflow — keeping both creates confusion; `AssetListPanel.tsx` deleted entirely
- Zero-asset warning with "Continue anyway" and "Try again" — prevents silent failure when no `@S-` layers exist
- Results modal showing success state, copy button, and paste instructions — closes the "now what?" gap

**Should have (differentiators):**
- Paste instructions in results modal — "Paste this into Claude Code" closes the knowledge gap for new users
- Refinement encouragement message — sets correct expectations; brief is a starting point, not pixel-perfection
- "View details" expandable toggle — power users verify extraction; defaults collapsed for clean success state
- Stats summary line (N assets, N tokens, N layers) — high information density, immediate confidence signal
- Case-insensitive `@S-` matching (`/^@s-/i`) — forgiving of designer typos at zero implementation cost
- Token count warning visible outside details section — critical UX signal that must not be hidden

**Defer (v2+):**
- Nested instance `@S-` scanning — document that scanning stops at `@S-` node boundary
- Per-asset format override — auto-detection should be correct; overrides reintroduce removed complexity
- Asset preview thumbnails in results — extra API calls, extra latency; existing preview PNG provides visual reference
- Breadcrumb disambiguation for duplicate names — useful but a v2.3 enhancement
- Near-miss detection for prefix typos (`@s icon`) — helpful but not required for v2.2

### Architecture Approach

The v2.2 architecture inserts one new pure-function module (`detect.ts`) between extraction and export, replaces the user-driven asset accumulation loop (AssetListPanel + async resolveNode per URL) with a single synchronous tree-walk, and replaces the inline results card with a controlled `ResultsModal` component. The overall layered architecture (API fetch → normalize → detect → export → brief → display) becomes more uniform: every step is a data transformation, not an interactive loop.

**Major components:**
1. `src/assets/detect.ts` (NEW) — pure synchronous function; walks raw Figma nodes, finds `@S-` prefixed layers, derives format from image fill detection, returns `DetectedAsset[]`
2. `src/assets/detect.test.ts` (NEW) — ~150 lines covering basic detection, case insensitivity, image fill detection, vector detection, nested detection, duplicate name resolution, empty result, hidden node skipping
3. `src/components/ResultsModal.tsx` (NEW) — composes existing `Modal` shell; success header, copy button (primary), paste instructions, refinement message, stats row, expandable details (asset list, TreePreview, token summary, warnings), "Get New Brief" secondary button
4. `src/layout/extract.ts` (MODIFIED, 3 lines) — adds `rawRootNodes: any[]` field to `ExtractLayoutResult` so detection has access to the pre-normalization tree
5. `src/assets/types.ts` (MODIFIED, ~8 lines) — adds `DetectedAsset` interface; minimal 4-field type with no lifecycle fields
6. `src/assets/export.ts` (MODIFIED, ~10 lines) — accepts `DetectedAsset[]` instead of `ManualAsset[]`; removes `status` filter (all detected assets are always valid)
7. `src/views/MainView.tsx` (MODIFIED heavily) — removes ~200 lines of manual asset state and callbacks; adds detectAssets() call, zeroAssetWarning state, showResults state, ResultsModal rendering; net ~100 line reduction
8. `src/components/AssetListPanel.tsx` (DELETE) — entire manual URL workflow replaced
9. `src/assets/resolve.ts` (DELETE) — per-URL node resolution no longer needed
10. `src/assets/resolve.test.ts` (DELETE) — 21 tests for deleted module

### Critical Pitfalls

1. **Detection on normalized tree instead of raw tree** — INSTANCE subtrees are stripped in the normalized tree; any `@S-` layer inside a component instance is invisible. Prevention: pass `rawRootNodes` from `ExtractLayoutResult` to `detectAssets()`; never call detection on `extractionResult.rootNodes`.

2. **Image fill check not recursive** — checking only `node.fills` on the top-level `@S-` node misses image fills on descendant children. A `@S-hero` FRAME containing a child RECTANGLE with an IMAGE fill would export as SVG (wrong). Prevention: `hasImageFills()` must recurse into `node.children` down the full subtree.

3. **Incomplete removal of manual asset workflow** — the old system spans 5+ files; partial deletion leaves orphaned types, broken imports, and dead callbacks. Prevention: build new pipeline first, verify it works, then delete old code file by file, running `npx vitest --run` after each step.

4. **Re-fetch ("Try again") uses cached tree** — if "Try again" re-scans the in-memory tree without re-calling `extractLayout()`, the designer cannot fix their Figma file and retry. Prevention: mirror the `awaitingLargeTreeConfirm` pattern; store pending result in a ref, resume on "Continue" or call `handleExtract()` fresh on "Try again".

5. **NodeId corruption at pipeline boundary** — Figma node IDs contain colons (`12:34`); if detection normalizes or URL-encodes the ID before passing to `exportAssets()`, the `fetchImages` response map lookup breaks silently. Prevention: preserve raw `node.id` string exactly from the raw Figma tree through to the export pipeline.

## Implications for Roadmap

Based on research, four phases ordered by data flow dependency:

### Phase 1: Detection Foundation
**Rationale:** The `DetectedAsset` type and `detectAssets()` pure function have zero dependencies on UI or pipeline changes. They can be fully specified, implemented, and tested with fixture node trees before any other code changes. Everything downstream depends on this type contract being stable.
**Delivers:** `src/assets/detect.ts`, `src/assets/detect.test.ts`, `DetectedAsset` type in `assets/types.ts`. The full logic of @S- detection is verified and locked.
**Addresses:** @S- prefix tree scan, format auto-detection (image fill check), prefix stripping, duplicate name handling, case-insensitive matching, hidden node skipping.
**Avoids:** Pitfalls 1 (normalized tree), 2 (image fill recursion), 3 (prefix stripping order), 9 (duplicate names), 10 (case sensitivity), 12 (hidden layers).

### Phase 2: Pipeline Integration
**Rationale:** Minimal adapter changes (~15 lines) that wire Phase 1 output into the existing pipeline. Must happen before MainView changes so the integration surface is stable before the orchestrator is rewritten.
**Delivers:** `layout/extract.ts` exposes `rawRootNodes`; `assets/export.ts` accepts `DetectedAsset[]` instead of `ManualAsset[]`. The pipeline compiles and the data flow is connected.
**Uses:** Existing `exportAssets()`, `downloadAllAssets()`, Figma API batch fetch — no changes to those functions.
**Avoids:** Pitfall 8 (type shape mismatch), Pitfall 5 (nodeId corruption at pipeline boundary).

### Phase 3: MainView Rewiring + Zero-Asset Warning + Cleanup
**Rationale:** After Phases 1 and 2, the plugin can be made functionally correct end-to-end. This is the high-change phase: wiring detection into the orchestrator, removing all manual asset state, adding the zero-asset warning checkpoint, and deleting the old code. Results still display as the existing inline card (safe fallback) until Phase 4.
**Delivers:** Plugin works end-to-end with @S- detection. Manual URL workflow is gone. Zero-asset warning with "Continue anyway" and "Try again" is functional. `AssetListPanel.tsx`, `resolve.ts`, `resolve.test.ts` deleted.
**Implements:** Zero-asset warning as state machine checkpoint (pattern from `awaitingLargeTreeConfirm`), `detectedAssets` state replacing `manualAssets`, detection call inserted after `extractLayout()` returns.
**Avoids:** Pitfall 4 (incomplete removal), Pitfall 5 (re-fetch vs re-scan distinction), Pitfall 11 (stale toggle state — reset details expansion in handleExtract).

### Phase 4: Results Modal
**Rationale:** Pure presentation change with stable data from Phase 3. Can be iterated independently; if scope is cut, the inline results card still works. This is the highest UX value change but has zero functional dependency for core correctness.
**Delivers:** `src/components/ResultsModal.tsx` — success message, copy button (primary), paste instructions, refinement message, stats row, expandable details (asset list, TreePreview, token summary, warnings), token count warning visible outside collapse, "Get New Brief" secondary button.
**Avoids:** Pitfall 7 (lost brief context — token warning and asset warnings must be visible without expanding details), Pitfall 11 (details toggle defaults to collapsed, resets on new brief generation).

### Phase Ordering Rationale

- Phase 1 before everything else: the `DetectedAsset` type is the contract between detection and export; changing it after consumers exist is expensive.
- Phase 2 before Phase 3: the export pipeline must accept `DetectedAsset[]` before MainView can pass detected assets to it.
- Phase 3 before Phase 4: the results modal needs stable brief result data and state shape from the rewired MainView.
- Cleanup (deleting AssetListPanel, resolve.ts) belongs in Phase 3, not deferred: old and new asset workflows should not coexist across a phase boundary.
- This ordering follows the existing codebase pattern: all other tree walkers (normalizeTree, collectTokens, buildBreadcrumbMap) are pure functions built before their consumers.

### Research Flags

Phases with standard patterns (research-phase not needed):
- **Phase 1 (Detection Foundation):** Pure function tree walker following the exact same pattern as `normalizeNode()`, `collectTokens()`, `buildBreadcrumbMap()`. Pattern is well-established in this codebase.
- **Phase 2 (Pipeline Integration):** Adapter changes only. Pattern mirrors the existing `largeTreeWarning` field extension of `ExtractLayoutResult`.
- **Phase 3 (MainView Rewiring):** Pattern mirrors existing `awaitingLargeTreeConfirm` state machine. State cleanup is mechanical.
- **Phase 4 (Results Modal):** Composing an existing `Modal` shell with new JSX children. No novel patterns.

No phases require additional research. All patterns are directly verified in the existing codebase. Confidence is HIGH because research was codebase-driven, not documentation-driven.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All findings verified against actual source files. Zero new dependencies confirmed by mapping each requirement to existing code. |
| Features | HIGH | Feature list derived from codebase analysis of existing capabilities and gaps. Figma REST API `name` field confirmed globally present. UX patterns (empty state design) sourced from NN/g, Cloudscape, Carbon. |
| Architecture | HIGH | Direct codebase inspection of 780-line MainView, full export pipeline, normalize.ts INSTANCE behavior confirmed at specific line numbers. Data flow diagrams reflect actual code paths. |
| Pitfalls | HIGH | 313 passing tests provide baseline. INSTANCE leaf node behavior verified in normalize.ts lines 185-200. `sanitizeFilename('@S-hero-image')` returns `s-hero-image` confirmed locally. nodeId encoding variants confirmed in export.ts lines 40-42. |

**Overall confidence:** HIGH

### Gaps to Address

- **Component instance naming policy:** When a master COMPONENT is named `@S-icon`, all instances inherit the prefix, potentially producing 20+ exports from one component definition. Research recommends warning the user but not changing the detection policy. Validate this UX choice early in Phase 1 planning.
- **Near-miss detection scope:** Detecting `@s icon` (space instead of dash) as a near-miss is explicitly deferred. If designer feedback during testing reveals frequent confusion, this can be added to Phase 1 as a warning-only feature.
- **Placeholder text in generate.ts:** The v2.1 placeholder system references "manually added assets" in framing text. Phase 3 or 4 should include a pass over `buildPlaceholdersSection()` and `buildInstructionsSection()` to update framing to reference `@S-` assets naturally. Low effort, flagged to not overlook.

## Sources

### Primary (HIGH confidence)
- Codebase analysis — `src/views/MainView.tsx` (780 lines), `src/assets/export.ts`, `src/assets/resolve.ts`, `src/components/AssetListPanel.tsx` (340 lines), `src/layout/extract.ts`, `src/layout/normalize.ts`, `src/assets/types.ts`, `src/assets/sanitize.ts`, `src/assets/breadcrumb.ts`, `src/components/Modal.tsx`, `src/brief/generate.ts`, `src/brief/types.ts`, `src/tokens/collect.ts`, `src/figma-api.ts`, `src/styles.ts`
- Figma REST API documentation — confirms `name` field globally present on all node types; `fills` array present on all non-group nodes; `visible` field present
- Test suite — 313 passing tests across 9 files provide ground truth for existing behavior

### Secondary (MEDIUM confidence)
- [Figma REST API - Global Properties](https://developers.figma.com/docs/rest-api/files/) — name field on all node types
- [NN/g Empty State Design](https://www.nngroup.com/articles/empty-state-interface-design/) — "always provide an action" for zero-results states
- [Cloudscape Empty States Pattern](https://cloudscape.design/patterns/general/empty-states/) — zero-results UX with action buttons
- [Carbon Design System Empty States](https://carbondesignsystem.com/patterns/empty-states-pattern/) — empty state messaging
- [Figma Layer Naming Conventions](https://www.figma.com/community/file/1064955840810792842/guide-layer-naming-conventions) — naming convention ecosystem patterns

### Tertiary (LOW confidence)
- Instance naming behavior (instance-local name vs inherited master name) — Figma help documentation and API response format observation; validate during Phase 1 testing with real Figma files

---
*Research completed: 2026-03-01*
*Ready for roadmap: yes*
