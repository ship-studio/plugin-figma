# Technology Stack

**Project:** Ship Studio Figma Plugin v2.2 -- @S- Asset Detection & Results UX
**Researched:** 2026-03-01

## Executive Summary

No new npm dependencies are needed. The v2.2 features -- `@S-` prefix layer detection and results modal redesign -- are entirely achievable with the existing stack. The `@S-` detection is a tree-walking filter over data already fetched from the Figma API. The results modal reuses the existing `Modal` component shell with new child content. Zero libraries to add, zero libraries to remove.

What changes is **where asset discovery happens** (tree walk instead of user input) and **what the results view renders** (modal instead of inline card). Both are pure application logic changes within the existing React + TypeScript + Figma REST API stack.

## Recommended Stack (No Changes from v2.1)

### Core Framework (unchanged)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TypeScript | 5.x | Type safety | Already in use |
| React 18 | (host-provided) | Plugin UI | Ship Studio provides React instance |
| Vite | 6.x | Build | Already in use |
| Vitest | latest | Testing | Already in use |

### Figma API (unchanged)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@figma/rest-api-spec` | latest | Type definitions | Provides node types used by tree walker |
| `curl` via `shell.exec` | N/A | HTTP requests | Existing Figma API access pattern |

### No New Dependencies

Every v2.2 requirement maps to existing capabilities:

| Requirement | Solved By | Why No Library Needed |
|-------------|-----------|----------------------|
| `@S-` prefix detection in tree | Walk raw Figma nodes from `fetchFileNodes`/`fetchFullFile` response | String prefix check on `node.name` -- trivial JS |
| Image fill detection for format | Check `node.fills` array for `paint.type === 'IMAGE'` | Already done in `tokens/collect.ts`; reuse same pattern |
| Filename derivation | Existing `sanitizeFilename()` in `sanitize.ts` with prefix stripping | Strip `@S-` before calling sanitize |
| Filename collision resolution | Existing `resolveFilenameCollision()` in `resolve.ts` | Already handles `-2`, `-3` suffixes |
| Export pipeline | Existing `exportAssets()` with `ManualAsset[]` input | `@S-` detected assets produce same `ManualAsset[]` shape |
| Results modal | Existing `Modal` component in `components/Modal.tsx` | Has overlay, header, body, escape-to-close; just new children |
| Expandable details toggle | React `useState<boolean>` | One boolean per section; no accordion library needed |
| Zero-asset warning UI | React conditional rendering | JSX with two buttons; no dialog library needed |
| "Try again" re-fetch | Call existing `extractLayout()` again | Already used by the "Get New Brief" flow |
| Copy to clipboard | Existing `copyToClipboard()` in `brief/io.ts` | No changes |

## What Changes (Code, Not Dependencies)

### 1. New Module: `@S-` Prefix Scanner

**Purpose:** Walk a raw Figma node tree (the JSON already fetched by `extractLayout`) and collect all nodes whose `name` starts with `@S-`.

**Location:** New file `src/assets/scan-prefixed.ts` (pure function, no side effects).

**Key design decisions:**

- **Scan raw Figma nodes, not normalized `LayoutNode` tree.** The normalized tree collapses INSTANCE children, so scanning it would miss `@S-` layers inside component instances. The raw API response (available in `extractLayout` before `normalizeTree`) has the full tree.
- **Recursive walk, no depth limit.** `@S-` layers may appear at any nesting depth -- inside components, inside frames, inside groups.
- **Format detection: check fills for IMAGE type.** If any visible fill has `type === 'IMAGE'`, export as PNG. Otherwise SVG. This reuses the pattern from `tokens/collect.ts` line 147.
- **Prefix stripping before sanitization.** `@S-hero-image` must become `hero-image.png`, not `s-hero-image.png`. Strip the `@S-` prefix BEFORE passing to `sanitizeFilename()`. Current sanitize strips `@` (non-alphanumeric) but keeps `s-`, producing wrong filenames.
- **Output: `ManualAsset[]`.** The scan produces the same type the export pipeline already consumes. No type changes needed downstream.

**Why not scan the normalized tree:**
The normalized tree (from `normalizeTree`) treats INSTANCE nodes as leaf nodes -- it does NOT recurse into their children (see `normalize.ts` line 193-194: "Do NOT recurse into children -- instances are leaf nodes"). A designer might place `@S-` layers inside component instances. Scanning raw nodes is the only way to find them.

**Integration point:** The scanner runs AFTER `extractLayout` returns (which already fetches the raw Figma data) but BEFORE `exportAssets`. The raw nodes are available in the `ExtractLayoutResult` -- specifically, the nodes returned by `fetchFileNodes` or `fetchFullFile`. The scanner needs access to these raw nodes, which means either:
- (a) Storing raw nodes on `ExtractLayoutResult` (preferred -- one extra field), or
- (b) Re-fetching from the API (wasteful; avoid).

### 2. Prefix Stripping Before Sanitization

**The problem:** `sanitizeFilename('@S-hero-image')` returns `s-hero-image` because `@` is stripped by the `[^a-z0-9-]` regex but `s-` remains. The filename should be `hero-image`.

**The fix:** Strip the `@S-` prefix from `node.name` before passing to `sanitizeFilename()`. This is a one-liner in the scanner:

```typescript
const cleanName = node.name.replace(/^@S-/i, '');
const baseName = sanitizeFilename(cleanName);
```

This belongs in the scanner, NOT in `sanitizeFilename` itself. `sanitizeFilename` is a general-purpose utility that shouldn't know about `@S-` conventions.

### 3. Image Fill Detection for Format Auto-Suggestion

**Current state:** `suggestFormat()` in `resolve.ts` uses node TYPE to choose format (VECTOR types -> SVG, everything else -> PNG). This is insufficient for `@S-` detection because:
- A FRAME with an image fill should export as PNG (it's a photo/illustration)
- A FRAME with only solid fills and vector children should export as SVG (it's an icon)

**New logic:** Check `node.fills` for any visible paint with `type === 'IMAGE'`. If found, format is PNG. If not, check whether ALL descendants are vector primitives (VECTOR, LINE, STAR, ELLIPSE, REGULAR_POLYGON, BOOLEAN_OPERATION, TEXT). If yes, SVG. Otherwise PNG (safe default for mixed content).

```typescript
function hasImageFill(node: any): boolean {
  if (Array.isArray(node.fills)) {
    for (const paint of node.fills) {
      if (paint.visible !== false && paint.type === 'IMAGE') return true;
    }
  }
  // Check children recursively for image fills
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (hasImageFill(child)) return true;
    }
  }
  return false;
}
```

### 4. Raw Node Preservation in ExtractLayoutResult

**Current state:** `extractLayout()` fetches raw Figma nodes, normalizes them, and discards the raw data. The scanner needs the raw data.

**Change:** Add a `rawNodes: any[]` field to `ExtractLayoutResult`. Set it to the raw Figma API response nodes before normalization. Cost: one extra reference (no deep copy needed).

```typescript
export interface ExtractLayoutResult {
  extraction: ExtractionResult;
  tokens: DesignTokens;
  fileKey: string;
  rawNodes: any[];  // NEW: raw Figma nodes for @S- scanning
  largeTreeWarning?: { nodeCount: number; message: string };
}
```

### 5. Remove ManualAsset URL Workflow

**What gets removed:**
- `AssetListPanel` component (`src/components/AssetListPanel.tsx`) -- entire file
- `manualAssets` state and all its handlers in `MainView.tsx`
- Asset URL input section in MainView render
- `resolveNode()` async function in `resolve.ts` (the scan replaces it)
- `isInstanceChildId()` and `extractParentInstanceId()` in `resolve.ts` (I-prefix validation was for manual URLs)

**What stays:**
- `sanitizeFilename()` -- still needed for name cleaning
- `resolveFilenameCollision()` -- still needed for dedup
- `deriveAssetFromNode()` -- may be repurposed or replaced by scanner logic
- `suggestFormat()` -- stays but image-fill-aware version replaces it for @S- assets
- Export pipeline (`exportAssets()`) -- unchanged; still consumes `ManualAsset[]`

### 6. Results Modal Redesign

**Current state:** Results are rendered inline in `MainView.tsx` as a `figma-plugin-file-info` div with stats, copy button, warnings, and tree preview toggle.

**New design:** A `Modal` (from `components/Modal.tsx`) that opens when the brief is ready. Contents:
1. Success message: "Your brief is ready"
2. Copy button (primary action)
3. Instruction text: "Paste this brief into Claude Code (or your preferred AI agent)"
4. Refinement encouragement: "The brief captures your design's structure. You may want to iterate with your agent to refine the output."
5. Expandable "View details" toggle with:
   - Assets list (count + filenames)
   - Layout tree preview (existing `TreePreview` component)
   - Token summary (color count, font count, etc.)

**What the Modal component already provides:**
- Overlay with backdrop blur
- Header with Figma logo + title
- Body with scroll
- Escape-to-close
- Click-outside-to-close
- CSS injection/cleanup

**What needs adding:** The modal body content. This is just JSX -- no new components or libraries.

**CSS additions:** Minimal. A few new classes for the details toggle and success state. Added to the existing `styles.ts` string.

### 7. Zero-Asset Warning Flow

**When:** The `@S-` scanner finds zero matching layers in the tree.

**UI:** Shown INSTEAD of proceeding to export. Two buttons:
- "Try again" -- re-runs `extractLayout()` from scratch (new API call, so designer can fix their Figma file in between)
- "Continue anyway" -- proceeds with zero assets (brief will have all placeholder references)

**Implementation:** A new state `zeroAssetWarning: boolean` in MainView. Set to true when scanner returns empty array. Renders a warning div (using existing `.figma-plugin-warning` CSS class). Buttons reset the warning and either re-extract or proceed.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Tree scanning location | Raw Figma nodes before normalization | Normalized LayoutNode tree | Normalized tree collapses INSTANCE children; would miss @S- layers inside components |
| Format detection | Image fill check on node + descendants | Node type only (current `suggestFormat`) | Node type misses FRAMEs with image fills; a photo in a FRAME would export as SVG |
| Prefix convention | `@S-` (case-insensitive `@S-`) | `[ship]`, `#export`, or Figma component property | `@S-` is short, distinctive, easy to type, and won't collide with design naming conventions |
| Results view | Modal overlay | Inline card redesign | Modal creates clear separation between "working" and "done" states; matches PROJECT.md requirements |
| Accordion library | `useState<boolean>` per section | react-collapsed, @radix-ui/accordion | Three toggles with no animation needed; a library adds bundle weight for nothing |
| State management | React useState (existing) | useReducer, Zustand | Milestone removes state (manualAssets), net simpler; useState remains appropriate |

## Existing Code Reuse Map

Every existing module is either reused as-is or lightly modified:

| Module | v2.2 Role | Change Level |
|--------|-----------|-------------|
| `figma-api.ts` | Unchanged -- all API calls already exist | None |
| `layout/extract.ts` | Add `rawNodes` field to result type | Minimal |
| `layout/normalize.ts` | Unchanged | None |
| `tokens/collect.ts` | Unchanged | None |
| `assets/sanitize.ts` | Unchanged -- `sanitizeFilename` reused | None |
| `assets/resolve.ts` | Remove `resolveNode`, `isInstanceChildId`, `extractParentInstanceId`. Keep `resolveFilenameCollision`, `suggestFormat` | Moderate (deletion) |
| `assets/export.ts` | Unchanged -- still consumes `ManualAsset[]` | None |
| `assets/types.ts` | Unchanged -- `ManualAsset` type still used | None |
| `assets/download.ts` | Unchanged | None |
| `assets/breadcrumb.ts` | Unchanged | None |
| `components/Modal.tsx` | Reused for results modal | None |
| `components/AssetListPanel.tsx` | **Deleted** -- manual workflow removed | Full removal |
| `views/MainView.tsx` | Major refactor: remove manual asset state, add scanner integration, add results modal, add zero-asset warning | Heavy |
| `styles.ts` | Add CSS for results modal content, details toggle | Moderate (additions only) |
| `brief/generate.ts` | Unchanged | None |
| `brief/io.ts` | Unchanged | None |
| `url-parser.ts` | Unchanged | None |

## New Files

| File | Purpose | Estimated Size |
|------|---------|---------------|
| `src/assets/scan-prefixed.ts` | Pure function: walk raw Figma nodes, find `@S-` layers, return `ManualAsset[]` | ~80 lines |
| `src/assets/scan-prefixed.test.ts` | Unit tests for prefix scanner | ~150 lines |
| `src/components/ResultsModal.tsx` | Results modal body content (success message, copy button, expandable details) | ~120 lines |

## Key Integration Points

### Data Flow (v2.2)

```
User pastes Figma URL
  -> extractLayout() fetches raw nodes + normalizes
  -> rawNodes stored on ExtractLayoutResult    [NEW]
  -> scanPrefixedAssets(rawNodes) returns ManualAsset[]  [NEW]
  -> if assets.length === 0: show zero-asset warning  [NEW]
  -> exportAssets({ manualAssets: scannedAssets })  [unchanged pipeline]
  -> generateBrief()  [unchanged]
  -> ResultsModal opens with brief  [NEW - was inline card]
```

### What NOT to Add

| Don't Add | Why |
|-----------|-----|
| Component library (Radix, Headless UI) | Modal already exists; three toggles don't need an accordion |
| State management library (Zustand, Jotai) | Removing manual asset state makes things simpler, not more complex |
| Animation library (Framer Motion) | No animations specified in requirements |
| Form library (React Hook Form) | No forms in the new flow (URL input is unchanged) |
| CSS framework (Tailwind, styled-components) | Plugin uses Ship Studio's theme CSS variables; adding a framework would conflict |
| Testing library additions | Vitest + existing patterns sufficient for new pure functions |
| Figma Plugin API / Figma Plugin SDK | This plugin uses REST API via curl, not the Figma Plugin SDK (different architecture) |

## Installation

No changes to `package.json`. No `npm install` needed.

```bash
# Existing setup continues to work
npm install          # existing deps only
npm run build        # vite build
npm run test         # vitest run
```

## Sources

- Codebase analysis (HIGH confidence): All findings verified against actual source code in `/src/`
- Figma REST API behavior (HIGH confidence): `fetchFileNodes` and `fetchFullFile` return raw node trees with `name` and `fills` properties -- verified in `figma-api.ts` and `@figma/rest-api-spec` types
- `sanitizeFilename` behavior with `@S-` prefix (HIGH confidence): Tested locally -- `sanitizeFilename('@S-hero-image')` returns `s-hero-image`, confirming prefix must be stripped before sanitization
- `normalizeTree` INSTANCE handling (HIGH confidence): Verified in `normalize.ts` line 193-194 -- INSTANCE nodes return early without recursing into children
