---
phase: 07-smart-asset-detection-layout-mapping
verified: 2026-02-28T22:46:00Z
status: passed
score: 11/11 must-haves verified
gaps: []
human_verification:
  - test: "Run plugin against a real Figma file containing nested vector groups with blend modes"
    expected: "Plugin auto-detects those groups as compositions, exports them as single PNG images rather than individual SVG paths, and the brief Assets table shows 'Composition' in the Type column with a valid breadcrumb in Location"
    why_human: "Requires a live Figma connection, real design data, and visual inspection of the brief output"
  - test: "Verify composition warnings appear in the exported brief warnings section"
    expected: "Brief (or UI toast) shows 'Auto-detected <name> as a composition' messages when compositions are detected"
    why_human: "Requires a live Figma file with qualifying complex nodes; cannot be verified by static analysis alone"
---

# Phase 7: Smart Asset Detection & Layout Mapping Verification Report

**Phase Goal:** Complex illustrations (nested groups of vectors, masks, blend modes) are automatically detected and exported as single images, and every exported asset is mapped to its exact position in the layout tree
**Verified:** 2026-02-28T22:46:00Z
**Status:** PASSED
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | detectCompositions returns nodeIds for nodes with BOTH structural signals AND visual effect signals | VERIFIED | `detect-composition.ts` lines 86-88 require both `hasStructuralComplexity` AND `hasVisualEffects`; 14 tests pass |
| 2 | detectCompositions does NOT flag simple icon groups (2-4 vectors without visual effects) as compositions | VERIFIED | Test "returns empty set for simple icon group (3 vectors, no effects)" passes; structural-only and visual-only tests both pass |
| 3 | Outer composition wins -- once flagged, children not recursed for further detection | VERIFIED | `detect-composition.ts` line 72: `return;` immediately after adding to set; "outer composition wins" test passes |
| 4 | buildBreadcrumbMap produces arrow-path breadcrumbs for every node, skipping generic auto-generated names | VERIFIED | `breadcrumb.ts` fully implemented with `GENERIC_NAME_PATTERN`; 25 breadcrumb tests pass |
| 5 | Breadcrumb smart truncation kicks in at 5+ path segments, showing first > ... > last 2 | VERIFIED | `formatBreadcrumb` at lines 74-79; "path with 5+ segments uses smart truncation" test passes |
| 6 | LayoutNode carries blendMode and isMask from Figma API data | VERIFIED | `layout/types.ts` lines 74-77; `normalize.ts` lines 148-153 captures both from raw nodes |
| 7 | ExportResult.assets carries nodeId and assetType for downstream breadcrumb lookup and type display | VERIFIED | `assets/types.ts` lines 36-41: optional `nodeId` and `assetType` on ExportResult.assets |
| 8 | Detected compositions exported as single PNG images at 2x scale via separate fetchImages API call | VERIFIED | `export.ts` lines 98-106: `fetchImages` called for `png-render` entries with `'png', 2`; separate from SVG batch |
| 9 | identifyAssets checks composition set FIRST, classifies matched nodes as png-render, skipping child recursion | VERIFIED | `identify.ts` lines 54-63 and 133-142: composition check before INSTANCE check, `return` without recursion |
| 10 | Brief Assets table has 4 columns: File, Type, Location, Path with correct labels | VERIFIED | `generate.ts` lines 361-365: header `\| File \| Type \| Location \| Path \|`; `assetTypeLabel` returns Composition/Icon/Image |
| 11 | Asset-to-layout mapping uses nodeId as join key between ExportResult.assets and breadcrumbMap | VERIFIED | `generate.ts` line 355: `breadcrumbMap.get(asset.nodeId) \|\| '--'`; MainView passes rootNodes to generateBrief (line 183) which calls buildBreadcrumbMap internally |

**Score:** 11/11 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/assets/detect-composition.ts` | Pure composition detection function | VERIFIED | 161 lines; exports `detectCompositions`, `CompositionDetectionResult`, `CHILD_COUNT_THRESHOLD=5`, `NESTING_DEPTH_THRESHOLD=3`, `SCAN_DEPTH_LIMIT=3` |
| `src/assets/detect-composition.test.ts` | Composition detection test suite (min 80 lines) | VERIFIED | 268 lines; 14 tests covering all detection scenarios |
| `src/assets/breadcrumb.ts` | Pure breadcrumb path builder | VERIFIED | 87 lines; exports `buildBreadcrumbMap`, `GENERIC_NAME_PATTERN` |
| `src/assets/breadcrumb.test.ts` | Breadcrumb builder test suite (min 60 lines) | VERIFIED | 301 lines; 25 tests covering paths, generic filtering, truncation |
| `src/layout/types.ts` | Extended LayoutNode with blendMode and isMask | VERIFIED | Lines 74-77: `blendMode?: string` and `isMask?: boolean` present |
| `src/assets/types.ts` | Extended ExportResult with nodeId and assetType | VERIFIED | Lines 36-41: optional `nodeId` and `assetType` on assets array |
| `src/assets/identify.ts` | Composition-aware asset identification | VERIFIED | Contains `compositionIds` parameter; composition-first check in both classifyNode and classifyNodeLeaf |
| `src/assets/export.ts` | PNG-render batch for compositions | VERIFIED | Contains `png-render` filter and fetchImages call at 2x scale (lines 98-106) |
| `src/brief/generate.ts` | Extended Assets table with Type and Location columns | VERIFIED | Contains `breadcrumbMap`; 4-column table with assetTypeLabel helper |
| `src/assets/download.ts` | Extended download pipeline threading nodeId and assetType | VERIFIED | Contains `nodeId` pass-through (lines 62, 76-78); both input and output types carry nodeId/assetType |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/assets/detect-composition.ts` | `src/layout/types.ts` | imports LayoutNode | WIRED | Line 15: `import type { LayoutNode } from '../layout/types'` |
| `src/assets/breadcrumb.ts` | `src/layout/types.ts` | imports LayoutNode | WIRED | Line 10: `import type { LayoutNode } from '../layout/types'` |
| `src/assets/export.ts` | `src/assets/detect-composition.ts` | imports detectCompositions | WIRED | Line 20: `import { detectCompositions } from './detect-composition'`; called at line 44 |
| `src/assets/identify.ts` | `src/assets/detect-composition.ts` | receives compositionIds Set parameter | WIRED | Lines 52, 131, 206: `compositionIds: Set<string>` in classifyNode, classifyNodeLeaf, identifyAssets |
| `src/brief/generate.ts` | `src/assets/breadcrumb.ts` | imports and calls buildBreadcrumbMap | WIRED | Line 15: import; line 48: `buildBreadcrumbMap(rootNodes)` called in generateBrief |
| `src/views/MainView.tsx` | `src/assets/breadcrumb.ts` | passes rootNodes to generateBrief (which calls buildBreadcrumbMap internally) | WIRED | Line 183: `rootNodes: result.extraction.rootNodes` passed to generateBrief; generateBrief calls buildBreadcrumbMap at line 48. Note: plan expected MainView to call buildBreadcrumbMap directly; actual design delegates to generateBrief -- functionally equivalent and architecturally cleaner |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| ASSET-01 | 07-01, 07-02 | Plugin detects complex compositions (nested groups/vectors with high child count, masks, blend modes) and flags them for image export | SATISFIED | `detectCompositions` implements dual-signal heuristic (structural + visual); wired into `exportAssets` |
| ASSET-02 | 07-02 | Plugin exports detected complex compositions as single PNG images instead of describing individual parts | SATISFIED | `export.ts` lines 98-106: separate `fetchImages` call for `png-render` entries at 2x scale; classifyNode does not recurse into composition children |
| ASSET-03 | 07-01, 07-02 | Brief maps each exported asset to its exact position in the layout tree via breadcrumb paths | SATISFIED | `buildBreadcrumbMap` produces nodeId->path map; `buildAssetsSection` uses it in Location column; 4-column table verified in generate.test.ts |
| ASSET-04 | 07-01, 07-02 | Asset-to-layout mapping uses nodeId as stable key to prevent filename/path misalignment | SATISFIED | nodeId threaded through identifyAssets -> export -> downloadAllAssets -> ExportResult.assets -> breadcrumbMap lookup; join is `breadcrumbMap.get(asset.nodeId)` |

All 4 requirements from REQUIREMENTS.md Phase 7 traceability are satisfied. No orphaned requirements found.

---

### Anti-Patterns Found

No anti-patterns detected in any phase 7 files:
- No TODO/FIXME/HACK/PLACEHOLDER comments
- No stub returns (return null / return {} / return [])
- No empty implementations or console.log-only handlers
- No static response returns in API handlers

---

### Human Verification Required

#### 1. Live Composition Detection End-to-End

**Test:** Open the plugin against a Figma file containing a complex illustration (e.g., a frame with 6+ nested vector layers, at least one with multiply/screen blend mode or a mask layer). Run extraction.
**Expected:** The brief's Assets table shows a row for the illustration with Type = "Composition" and a valid Location breadcrumb (e.g., "Hero > Illustration"). The downloaded file is a single PNG, not individual SVG parts. The plugin UI warnings section lists "Auto-detected <name> as a composition".
**Why human:** Requires a live Figma API connection, real design data with qualifying complex nodes, and visual inspection of both the downloaded files and the generated brief markdown.

#### 2. Simple Icon Group Not Flagged

**Test:** Run the plugin against a design containing simple icon groups (2-4 vector paths, no blend modes or masks). Verify these icons are exported as SVGs, not PNGs.
**Expected:** Brief Assets table shows Type = "Icon" with `.svg` filenames for icon nodes. No "Auto-detected ... as a composition" warnings appear.
**Why human:** Requires a real Figma file and verification that the heuristic thresholds work correctly against actual Figma data vs. synthetic test nodes.

---

### Gaps Summary

No gaps found. All 11 observable truths are verified, all 4 requirement IDs (ASSET-01 through ASSET-04) are satisfied by substantive implementations with complete wiring.

One design deviation from the plan is noted but is not a gap: the plan's `key_links` expected `MainView.tsx` to call `buildBreadcrumbMap` directly, but the actual implementation has `generateBrief` call it internally after receiving `rootNodes` from `MainView.tsx`. This is architecturally cleaner (keeps breadcrumb computation co-located with brief generation) and fully achieves the stated goal.

---

_Verified: 2026-02-28T22:46:00Z_
_Verifier: Claude (gsd-verifier)_
