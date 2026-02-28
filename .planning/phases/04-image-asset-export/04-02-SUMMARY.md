---
phase: 04-image-asset-export
plan: 02
subsystem: assets
tags: [figma, asset-export, download, curl, image-api, progress-feedback]

# Dependency graph
requires:
  - phase: 04-image-asset-export
    provides: identifyAssets() pure function, AssetEntry/ExportResult types
  - phase: 02-layout-extraction
    provides: ExtractLayoutResult, extractLayout orchestrator
  - phase: 03-design-data-extraction
    provides: ImageFillRef type and collected imageFills array
provides:
  - fetchImages() and fetchImageFills() Figma API wrappers
  - downloadFile() with retry-once and 30s timeout
  - prepareAssetsDir() directory lifecycle management
  - downloadAllAssets() sequential download loop with progress
  - exportAssets() top-level orchestrator tying all asset export together
  - MainView asset export integration with progress feedback and result display
affects: [05-brief-assembly]

# Tech tracking
tech-stack:
  added: []
  patterns: [batch-api-calls, retry-once-download, sequential-download-with-progress, directory-wipe-before-export]

key-files:
  created:
    - src/assets/download.ts
    - src/assets/export.ts
  modified:
    - src/figma-api.ts
    - src/layout/extract.ts
    - src/views/MainView.tsx

key-decisions:
  - "Used GetImagesResponse from @figma/rest-api-spec for fetchImages type safety"
  - "fetchImageFills uses inline type instead of GetImageFillsResponse to avoid status field collision with error detection"
  - "ExtractLayoutResult extended with fileKey to thread it to asset export without separate prop drilling"
  - "Asset export runs automatically after extraction -- no separate button or user action needed"

patterns-established:
  - "Batch API pattern: SVG node IDs batched into single fetchImages call, image fills resolved via single fetchImageFills call"
  - "Sequential download with retry-once: downloadFile retries exactly once on failure, 30s curl timeout"
  - "Directory wipe pattern: prepareAssetsDir cleans then recreates .shipstudio/assets/ before each export run"
  - "Progress callback pattern: onProgress fires for each asset with current/total/filename/phase"

requirements-completed: [ASST-01, ASST-05]

# Metrics
duration: 3min
completed: 2026-02-28
---

# Phase 4 Plan 02: Asset Export Pipeline Summary

**Figma images API wrappers, download orchestrator with retry and progress, and MainView auto-export wiring for complete asset pipeline**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-28T17:44:21Z
- **Completed:** 2026-02-28T17:47:46Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- fetchImages batches node IDs into single Figma GET /v1/images call for both PNG and SVG rendering
- fetchImageFills resolves all image fill references via GET /v1/files/{key}/images endpoint
- downloadFile uses curl with -L (follow redirects), -sS (silent but show errors), 30s timeout, and retry-once
- exportAssets orchestrates complete flow: clean dir, identify assets, batch 3 API calls (preview + SVG + fills), sequential download
- Preview rendered at 2x scale as preview.png, SVG assets with outline text and simplified strokes
- MainView automatically runs asset export after extraction, shows per-asset progress feedback and result summary
- Assets directory wiped before each export run to prevent stale files

## Task Commits

Each task was committed atomically:

1. **Task 1: Figma image API wrappers and download utilities** - `cd84c55` (feat)
2. **Task 2: Export orchestrator and MainView wiring with progress feedback** - `3454b62` (feat)

## Files Created/Modified
- `src/figma-api.ts` - Added fetchImages and fetchImageFills API wrappers
- `src/assets/download.ts` - Binary download with retry, directory lifecycle, sequential download loop
- `src/assets/export.ts` - Top-level asset export orchestrator
- `src/layout/extract.ts` - ExtractLayoutResult extended with fileKey field
- `src/views/MainView.tsx` - Asset export wired after extraction with progress and result UI

## Decisions Made
- Used GetImagesResponse from @figma/rest-api-spec for type-safe fetchImages response
- fetchImageFills uses inline type `{ meta: { images: Record<string, string> } }` instead of GetImageFillsResponse to avoid the `status: 200` field conflicting with figmaApiCall's error detection pattern
- Extended ExtractLayoutResult with fileKey rather than passing it separately through props, keeping the data flow clean
- Asset export runs automatically after extraction completes (no separate user action) -- this is the natural pipeline flow

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Complete asset export pipeline operational: extract -> identify -> batch API -> download -> save
- All 168 tests passing, TypeScript clean, Vite build succeeds (55.67 kB)
- Phase 4 complete -- ready for Phase 5 (brief assembly)

## Self-Check: PASSED

All 5 modified/created files verified on disk. Commits cd84c55 and 3454b62 verified in git log.

---
*Phase: 04-image-asset-export*
*Completed: 2026-02-28*
