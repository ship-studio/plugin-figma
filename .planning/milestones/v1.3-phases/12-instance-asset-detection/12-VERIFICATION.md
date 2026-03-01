---
phase: 12-instance-asset-detection
verified: 2026-03-01T10:24:00Z
status: passed
score: 9/9 must-haves verified
re_verification: false
gaps: []
human_verification: []
---

# Phase 12: Instance Asset Detection Verification Report

**Phase Goal:** Every visible image asset in a Figma design is detected and exported, regardless of how deeply it is nested inside component instances
**Verified:** 2026-03-01T10:24:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

Plan 01 must-haves:

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Instance nodes with IMAGE fill overrides are exported as png-fill using the instance node's name, not as png-render | VERIFIED | `walkTree` INSTANCE branch: `if (hasImageFill(node))` at line 139, pushes `png-fill` with `node.name` as filename, returns immediately (no png-render). Confirmed by 4 ASSET-06 tests passing. |
| 2 | Instance children with IMAGE fills at any depth are discovered and exported as png-fill entries | VERIFIED | `findImageFillsInChildren` function (lines 80-110) recursively walks `node.children` at full depth, collecting only IMAGE fills. ASSET-05 tests confirm 3-level nesting found. |
| 3 | Identical images across instances (same imageRef) are exported only once | VERIFIED | `seenImageRefs: Set<string>` passed into `walkTree` and `findImageFillsInChildren`. Dedup check at line 93: `if (imageRef && !seenImageRefs.has(imageRef))`. Verified by cross-instance dedup test. |
| 4 | Simple solid-color rectangles (no strokes, no gradients, no image fills, no effects) are silently skipped | VERIFIED | `isSimpleRectangle` guard at line 222: `if (isSimpleRectangle(node)) return;`. 8 ASSET-07 tests confirm correct classification for strokes, gradients, effects, and invisible variants. |
| 5 | Instances with child images do NOT also get a png-render export | VERIFIED | Lines 168-175: `if (childImages.length === 0)` gates the `png-render` push. ASSET-05 test "does NOT export instance as png-render when child images are found" passes. |

Plan 02 must-haves:

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 6 | IMAGE fills inside instance children in the raw Figma API response are discovered and included in the imageFills list passed to identifyAssets | VERIFIED | `collectImageFillsFromRawTree` exported from `extract.ts` (line 47), called at lines 133-135 BEFORE normalization. Merged into `tokens.imageFills` at lines 149-155 with Set-based dedup. |
| 7 | Instance child images appear with correct breadcrumb location in the Assets table (using the parent instance's breadcrumb) | VERIFIED | `buildAssetsSection` at line 514: `breadcrumbMap.get(asset.nodeId) \|\| (asset.parentInstanceId ? breadcrumbMap.get(asset.parentInstanceId) \|\| '--' : '--')`. Breadcrumb fallback test passes. |
| 8 | Layout tree INSTANCE lines show -> filename.png when the instance has a detected child image or fill image | VERIFIED | `assetNodeMap` populated with `parentInstanceId -> filename` at lines 58-60 in `generate.ts`. `renderNodeLine` checks `assetNodeMap?.get(node.id)` at line 229. Confirmed by annotation test. |
| 9 | Instance child images are classified as assetType 'image' in the export pipeline | VERIFIED | `export.ts` line 126: `fillEntries` loop sets `assetType: 'image'`. `parentInstanceId` threaded via line 127. `downloadAllAssets` in `download.ts` threads both fields (lines 64, 81). |

**Score:** 9/9 truths verified

### Required Artifacts

Plan 01:

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/assets/identify.ts` | isSimpleRectangle, findImageFillsInChildren, updated walkTree with instance recursion, exports identifyAssets | VERIFIED | All three functions present. isSimpleRectangle (line 62), findImageFillsInChildren (line 80), walkTree updated INSTANCE branch (lines 137-183), RECTANGLE branch updated (lines 221-234). identifyAssets exported (line 251). |
| `src/assets/identify.test.ts` | Tests for rectangle filtering, instance IMAGE fill override, instance child image detection, imageRef dedup | VERIFIED | 50 tests total: ASSET-07 suite (10 tests, lines 354-467), ASSET-06 suite (4 tests, lines 469-547), ASSET-05 suite (8 tests, lines 549-771). All passing. |

Plan 02:

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/layout/extract.ts` | collectImageFillsFromRawTree function, merged imageFills in ExtractLayoutResult | VERIFIED | `collectImageFillsFromRawTree` exported at line 47, called at line 134 before normalization, merged at lines 149-155. |
| `src/brief/generate.ts` | Instance-to-child-image mapping for layout tree cross-referencing | VERIFIED | `parentInstanceId -> filename` populated at lines 58-60. Breadcrumb fallback at line 514. |
| `src/assets/export.ts` | Correct assetType classification for instance child images | VERIFIED | `fillEntries` classified as `assetType: 'image'` at line 126. `parentInstanceId` conditionally set at line 127. Defensive comment on I-prefix node IDs at lines 111-112. |
| `src/brief/generate.test.ts` | Tests for instance child image cross-referencing in layout tree and assets table | VERIFIED | 3 new tests added (lines 712-809): annotation test, direct asset match preservation test, breadcrumb fallback test. All passing. |

Also verified (modified in Plan 02 but not listed as primary artifacts):

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/assets/types.ts` | parentInstanceId field on AssetEntry and ExportResult assets | VERIFIED | `parentInstanceId?: string` on AssetEntry (line 19) and ExportResult assets (line 46). |
| `src/assets/download.ts` | parentInstanceId threaded through downloadAllAssets | VERIFIED | Parameter type includes `parentInstanceId` (line 57). Field destructured (line 64) and conditionally added to downloaded results (line 81). |
| `src/assets/identify.ts` | parentInstanceId set on child image entries | VERIFIED | Lines 158-161: `img.parentInstanceId = node.id` on each child image from findImageFillsInChildren. |

### Key Link Verification

Plan 01 key links:

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/assets/identify.ts` | walkTree INSTANCE branch | `hasImageFill` check before png-render fallback | VERIFIED | Line 139: `if (hasImageFill(node))` is the first check inside the `node.type === 'INSTANCE'` guard (line 137). Pattern `hasImageFill` followed by INSTANCE branch confirmed. |
| `src/assets/identify.ts` | walkTree RECTANGLE branch | `isSimpleRectangle` guard | VERIFIED | Lines 221-222: `if (node.type === 'RECTANGLE') { if (isSimpleRectangle(node)) return; }`. Pattern `isSimpleRectangle` present in RECTANGLE branch. |

Plan 02 key links:

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/layout/extract.ts` | `src/assets/export.ts` | `tokens.imageFills` includes instance child fills (via `collectImageFillsFromRawTree`) | VERIFIED | `collectImageFillsFromRawTree` called before normalization (line 134). Results merged into `tokens.imageFills` (lines 149-155). Tokens flow to `exportAssets` via `imageFills` parameter. |
| `src/assets/export.ts` | `src/brief/generate.ts` | ExportResult.assets with nodeId for instance child images | VERIFIED | `fillEntries` include `parentInstanceId` from AssetEntry (line 127). `downloadAllAssets` threads `parentInstanceId` through to downloaded results (line 81). ExportResult.assets carries the field. |
| `src/brief/generate.ts` | renderNodeLine | `assetNodeMap` populated with `parentInstanceId` mappings | VERIFIED | Lines 58-60: `assetNodeMap.set(asset.parentInstanceId, asset.filename)` — only first child per instance (first-wins guard at line 58). `renderNodeLine` reads `assetNodeMap.get(node.id)` at line 229. |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| ASSET-05 | 12-01, 12-02 | Plugin detects and exports IMAGE fills inside component instance children (hero images, avatars, product photos nested in components) | SATISFIED | `findImageFillsInChildren` walks instance children at full depth. `collectImageFillsFromRawTree` captures fills before normalization strips instance subtrees. 8 ASSET-05 tests passing including 3-level deep nesting. |
| ASSET-06 | 12-01, 12-02 | Plugin detects and exports IMAGE fills on INSTANCE nodes themselves (background image overrides) | SATISFIED | `hasImageFill(node)` check first in INSTANCE branch, emits `png-fill` with instance name, returns immediately. 4 ASSET-06 tests passing. |
| ASSET-07 | 12-01, 12-02 | Plugin skips exporting simple solid-color RECTANGLE nodes as SVG (only exports rectangles with strokes or complex fills) | SATISFIED | `isSimpleRectangle` guards RECTANGLE branch. 10 ASSET-07 tests verify all cases: solid skip, stroke export, gradient export, effect export, invisible stroke/effect skip. |

No orphaned requirements detected. REQUIREMENTS.md traceability table maps ASSET-05, ASSET-06, ASSET-07 exclusively to Phase 12, and both plans claim these requirement IDs. All three are satisfied.

### Anti-Patterns Found

No anti-patterns found in any of the 7 modified files. Scan covered:
- `src/assets/identify.ts` — clean, no TODOs, no stubs
- `src/assets/identify.test.ts` — complete tests, no skipped or placeholder cases
- `src/layout/extract.ts` — clean, defensive comment explains design intent
- `src/brief/generate.ts` — clean, breadcrumb fallback comment explains design intent
- `src/assets/export.ts` — clean, defensive comment on I-prefix node IDs is intentional documentation
- `src/assets/download.ts` — clean, straightforward field threading
- `src/brief/generate.test.ts` — complete tests, all expectations concrete

### Human Verification Required

None. All behaviors are testable programmatically:
- Detection logic verified through unit tests (50 identify tests, 57 generate tests)
- Pipeline wiring verified through code inspection
- All 303 tests passing confirms no regressions

## Full Test Run

```
Test Files: 9 passed (9)
     Tests: 303 passed (303)
  Duration: 162ms
```

Breakdown by file:
- `src/assets/identify.test.ts`: 50 tests (24 new for Phase 12 + 26 existing, 1 existing updated for ASSET-07)
- `src/brief/generate.test.ts`: 57 tests (3 new for Phase 12 + 54 existing)

## Gaps Summary

No gaps. All 9 must-haves from both plans are verified. The phase goal is fully achieved:

Every visible image asset in a Figma design is now detected and exported regardless of nesting depth inside component instances, through three coordinated mechanisms:

1. **ASSET-07** (Plan 01): Simple CSS-reproducible rectangles silently skipped, eliminating SVG noise.
2. **ASSET-06** (Plan 01): Instance-level IMAGE fill overrides detected and exported as `png-fill` (not component screenshot).
3. **ASSET-05** (Plans 01 + 02): Instance children walked for IMAGE fills at full depth, with global `imageRef` deduplication, raw-tree pre-normalization collection, `parentInstanceId` threading through the full pipeline, and layout tree annotation.

---

_Verified: 2026-03-01T10:24:00Z_
_Verifier: Claude (gsd-verifier)_
