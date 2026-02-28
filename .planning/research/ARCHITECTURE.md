# Architecture Integration: v1.1 Smarter Asset Detection & Brief Improvement

**Project:** Ship Studio Figma Plugin
**Milestone:** v1.1 — Asset detection improvements, brief instructions, UX simplification
**Researched:** 2026-02-28
**Focus:** Integration points between new features and existing v1.0 architecture
**Confidence:** HIGH

## Executive Summary

v1.1 adds three interconnected features without breaking the existing architecture: (1) **smarter asset detection** that recognizes complex illustrations and exports them as images, (2) **asset-to-layout mapping** that ties each asset to its position in the design tree, and (3) **improved brief instructions** that guide Claude Code through plan mode and asset-only rules.

All changes are **additive or localized modifications** to existing modules. No refactoring of core v1.0 infrastructure required. The existing layered architecture (UI → Extraction → Brief → I/O → API) remains intact, with new components inserted into the Asset and Brief pipelines.

## v1.0 Architecture (Baseline)

The plugin follows a **six-stage linear pipeline**:

```
User Input (URL + token)
    ↓
[1. URL Parser] → fileKey, nodeIds
    ↓
[2. Figma API Client] → raw node tree
    ↓
[3. Layout Normalization] → LayoutNode tree (CSS flexbox terms)
    ↓
[4. Token Extraction] → design tokens (colors, typography, spacing)
    ↓
[5. Asset Export] → PNG preview + SVG/PNG files
    ↓
[6. Brief Assembly] → markdown string → clipboard
```

### Current Modules (v1.0)

| Module | Responsibility | File(s) |
|--------|----------------|---------|
| **URL Parser** | Extract file key and node IDs from Figma URLs | `url-parser.ts` |
| **Figma API** | REST API calls via shell.exec + curl; file info, tree fetch, image renders | `figma-api.ts` |
| **Layout Extraction** | Fetch and normalize Figma node tree to LayoutNode structure | `layout/extract.ts`, `layout/normalize.ts` |
| **Token Extraction** | Deduplicate colors, typography, spacing from layout tree | `tokens/collect.ts` |
| **Asset Identification** | Walk tree and classify nodes as SVG/PNG candidates | `assets/identify.ts` (2-level depth walk) |
| **Asset Export** | Batch API calls for render URLs + sequential download | `assets/export.ts` |
| **Brief Assembly** | Convert all data to markdown sections | `brief/generate.ts` |
| **File I/O** | Save brief to file, copy to clipboard | `brief/io.ts` |
| **UI Layer** | React views for token setup, URL input, extraction flow | `views/MainView.tsx`, `views/SetupView.tsx`, `views/SettingsView.tsx` |

## v1.1 Architecture Changes

### New Components

#### 1. `assets/compose.ts` — Composition Analysis (NEW)

**Purpose:** Detect complex nested groups/vectors that should export as images, not descriptions.

**Responsibility:**
- Analyze LayoutNode tree to find "composition candidates" (groups/frames with 3+ vectors, deep nesting)
- Calculate complexity score (based on child count, nesting depth, content types)
- Return list of { nodeId, complexity } for use in asset identification

**Integration:**
- **Called before:** `identifyAssets()`
- **Input:** LayoutNode[] (from layout extraction)
- **Output:** CompositionCandidate[] { nodeId: string, complexity: 'simple'|'moderate'|'complex' }
- **Data flow:** Composition metadata passed to identify.ts for classification

**Code shape:**
```typescript
interface CompositionCandidate {
  nodeId: string;
  nodeName: string;
  depth: number;              // nesting depth
  vectorCount: number;
  complexity: 'simple' | 'moderate' | 'complex';
  containsText: boolean;      // exclude text-heavy comps
  containsImages: boolean;    // already handled by png-fill
}

export function analyzeCompositions(rootNodes: LayoutNode[]): CompositionCandidate[] {
  // Walk tree, identify containers (FRAME, GROUP) with vector children
  // Complexity: vectorCount > 5 = complex, > 2 = moderate, else simple
  // Return candidates sorted by nodeId
}
```

**Key decision:** Composition analysis happens at **identification time** (one extra tree walk), not export time. Allows UI to warn users upfront ("5 complex compositions will export as PNG") before expensive download starts.

---

#### 2. `brief/asset-mapping.ts` — Asset Context Linking (NEW)

**Purpose:** Build breadcrumb paths showing where each asset belongs in the layout tree.

**Responsibility:**
- Traverse normalized LayoutNode tree
- Build nodeId → breadcrumb map (e.g., "Frame: Hero > Group: Buttons > Vector: arrow")
- Match exported assets by nodeId to breadcrumbs
- Return structured mappings for brief inclusion

**Integration:**
- **Called after:** `exportAssets()` completes, before `generateBrief()`
- **Input:** LayoutNode[] (tree) + AssetEntry[] (exported assets)
- **Output:** AssetMapping[] { filename, nodeId, breadcrumb, context }
- **Data flow:** Passed to generateBrief() as part of BriefInput

**Code shape:**
```typescript
interface AssetMapping {
  assetId: string;            // unique key
  filename: string;           // "icon-arrow.svg"
  nodeId: string;             // "42:123"
  breadcrumb: string;         // "Hero > Buttons > arrow"
  exportType: 'svg' | 'png-render' | 'png-fill';
  context?: string;           // "component icon", "background"
}

export function mapAssetsToLayout(
  rootNodes: LayoutNode[],
  assetEntries: AssetEntry[],
): AssetMapping[] {
  // Build nodeId → breadcrumb during tree walk (O(n))
  // Match each asset entry to breadcrumb
  // Return sorted by breadcrumb depth
}
```

**Key decision:** Breadcrumbs use **node names only** (not types) for clarity. Cap depth at 3 levels to avoid overwhelming brief readers.

---

### Modified Components

#### 1. `assets/identify.ts` — Composition-Aware Classification (MODIFIED)

**What's new:**
- Accept composition metadata from compose.ts
- Update export type logic to handle `'png-render'` (complex compositions rendered to PNG)
- Avoid recursing into composition nodes (they export as single units)

**Changes:**
```typescript
// NEW: Accept composition set as parameter
function identifyAssets(
  rootNodes: LayoutNode[],
  imageFills: ImageFillRef[],
  compositions: CompositionCandidate[], // ← NEW
): AssetEntry[] {
  const compositionSet = new Set(compositions.map(c => c.nodeId));

  // ... existing code ...

  function classifyNode(child: LayoutNode, /* ... */) {
    // NEW: Check if this node is a composition
    if (compositionSet.has(child.id) && compositions.find(c => c.nodeId === child.id)?.complexity !== 'simple') {
      entries.push({
        nodeId: child.id,
        nodeName: child.name,
        exportType: 'png-render',  // ← NEW type
        filename: sanitizeFilename(child.name) + '.png',
      });
      return; // Don't recurse into composition
    }

    // ... existing logic for SVG, png-fill, etc. ...
  }
}
```

**Export type update:**
```typescript
// In assets/types.ts
export interface AssetEntry {
  nodeId: string;
  nodeName: string;
  exportType: 'svg' | 'png-render' | 'png-fill'; // ← NEW: png-render
  filename: string;
  imageRef?: string;
}
```

**Backward compatibility:** No breaking changes. Existing svg/png-fill logic untouched.

---

#### 2. `assets/export.ts` — PNG Render Support (MODIFIED)

**What's new:**
- Route `png-render` entries to the preview API (same endpoint as preview.png)
- Batch svg + png-render node IDs in single API call
- Handle PNG downloads identically to SVG

**Changes:**
```typescript
// In exportAssets()
const svgEntries = assetEntries.filter(a => a.exportType === 'svg');
const pngRenderEntries = assetEntries.filter(a => a.exportType === 'png-render'); // ← NEW
const fillEntries = assetEntries.filter(a => a.exportType === 'png-fill');

// Batch SVG + PNG render (both use same /images endpoint)
const renderNodeIds = [...svgEntries.map(e => e.nodeId), ...pngRenderEntries.map(e => e.nodeId)];
const renderUrls = await fetchImages(shell, token, fileKey, renderNodeIds, 'svg'); // reuse SVG call for now

// Split results by type
const svgUrls = {};
const pngRenderUrls = {};
for (const id of svgEntries.map(e => e.nodeId)) {
  svgUrls[id] = renderUrls[id];
}
for (const id of pngRenderEntries.map(e => e.nodeId)) {
  pngRenderUrls[id] = renderUrls[id]; // ← uses PNG format, but same endpoint
}
```

**Note:** The Figma /images endpoint handles mixed formats; we request SVG format for vectors and PNG format for compositions in separate calls for clarity, or batch together if API supports it.

---

#### 3. `brief/generate.ts` — Instructions + Asset Mapping (MODIFIED)

**What's new:**
1. New `buildInstructionsSection()` — guidance for Claude Code
2. New `buildAssetMappingTable()` — contextual asset reference
3. Section order updated to: Metadata → Instructions → Preview → Tree → Tokens → Components → Asset Mapping

**Code shape:**
```typescript
export function generateBrief(input: BriefInput & { assetMappings: AssetMapping[] }): BriefResult {
  const sections = [
    buildMetadataSection(input),
    buildInstructionsSection(),                    // ← NEW
    buildPreviewSection(exportResult.previewPath, projectPath),
    buildLayoutTreeSection(extraction.extraction.rootNodes),
    buildDesignTokensSection(tokens),
    buildComponentsSection(tokens.components),
    buildAssetMappingTable(input.assetMappings),  // ← MODIFIED
  ].filter(Boolean);

  // ... rest unchanged ...
}

function buildInstructionsSection(): string {
  return `## Instructions for Claude Code

This brief contains everything needed to build this component accurately.

### Before You Start
1. **Use plan mode** — Ask clarifying questions about ambiguous requirements or design intent
2. **Review the preview** — Compare the PNG preview against your output when done
3. **Use only provided assets** — Never fabricate replacement images

### Asset References
- Reference assets by filename (e.g., \`icon-arrow.svg\`)
- Asset positions are in the Asset Mapping table below
- If location unclear, refer to the Layout Tree section`;
}

function buildAssetMappingTable(mappings: AssetMapping[]): string {
  if (mappings.length === 0) return '';

  const rows = mappings.map(m =>
    `| ${m.filename} | ${m.exportType.toUpperCase()} | ${m.breadcrumb} |`
  );

  return [
    '## Asset Mapping',
    '',
    '| Asset | Type | Location in Layout |',
    '|-------|------|-------------------|',
    ...rows,
  ].join('\n');
}
```

**Backward compatibility:** Instructions and asset mapping sections are optional. If no mappings provided, sections omitted.

---

#### 4. `views/MainView.tsx` — UX Simplification (MODIFIED)

**What's new:**
1. Show composition count as a warning before extraction starts
2. Simplify terminology: "Extraction Scope" → "What to extract?" with clearer options
3. Simplify results: remove tree preview preview (make collapsible)
4. Better progress labels: "Rendering compositions..." phase

**Changes:**
```typescript
// NEW: Warn about compositions upfront
const [compositionCount, setCompositionCount] = useState(0);

// After extraction, before export:
try {
  const result = await extractLayout(/* ... */);
  const compositions = analyzeCompositions(result.extraction.rootNodes);
  setCompositionCount(compositions.filter(c => c.complexity !== 'simple').length);

  if (compositionCount > 0) {
    // Show warning: "This design has 5 complex compositions that will export as PNG"
  }
}

// NEW: Collapsible tree detail
const [showTreeDetail, setShowTreeDetail] = useState(false);

// Simplified results display
return (
  <div>
    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
      Ready: {briefResult.stats.nodeCount} nodes, {briefResult.stats.assetCount} assets
    </div>
    <button onClick={() => setShowTreeDetail(!showTreeDetail)}>
      {showTreeDetail ? 'Hide' : 'Show'} structure
    </button>
    {showTreeDetail && <TreePreview nodes={...} />}
  </div>
);
```

---

## Data Flow Changes (v1.1)

### Asset Detection Pipeline (NEW)

```
LayoutNode tree (from layout extraction)
    ↓
analyzeCompositions() [compose.ts]
    ↓
CompositionCandidate[] { nodeId, complexity }
    ↓
identifyAssets() [identify.ts] + composition metadata
    ↓
AssetEntry[] { exportType: 'svg'|'png-render'|'png-fill' }
    ↓
fetchImages() [figma-api.ts]
    ↓ (batch SVG + PNG render node IDs)
render URLs { nodeId → url }
    ↓
downloadAllAssets() [download.ts]
    ↓
exported files { filename, path }[]
```

**Key addition:** Composition analysis happens **before** asset identification, allowing early warnings and smarter classification.

---

### Brief Assembly Pipeline (UPDATED)

```
ExtractionResult + ExportResult + AssetEntries
    ↓
mapAssetsToLayout() [asset-mapping.ts] ← NEW
    ↓
AssetMapping[] { filename, breadcrumb, context }
    ↓
generateBrief() [generate.ts] + asset mappings
    ↓ (UPDATED: new instructions section + asset mapping table)
markdown string
    ↓
io.ts (save + clipboard)
```

---

## Component Boundaries (v1.1)

| Component | Input | Processing | Output | Integration |
|-----------|-------|-----------|--------|-------------|
| **compose.ts (NEW)** | LayoutNode[] | Tree walk, complexity scoring | CompositionCandidate[] | → identify.ts |
| **identify.ts (MOD)** | LayoutNode[], ImageFillRef[], CompositionCandidate[] | Classification with composition awareness | AssetEntry[] | ← compose.ts; → export.ts |
| **export.ts (MOD)** | AssetEntry[] with png-render type | Batch API for SVG + PNG render | render URLs + download URLs | Uses updated identify.ts output |
| **asset-mapping.ts (NEW)** | LayoutNode[], AssetEntry[] | Tree traversal + matching | AssetMapping[] | → generate.ts |
| **generate.ts (MOD)** | ExtractionResult, ExportResult, AssetMapping[] | Section assembly (6 → 7 sections) | markdown string | ← asset-mapping.ts; uses updated BriefInput |
| **MainView.tsx (MOD)** | (state management) | Show composition warnings, collapsible tree | UI feedback | Calls compose.ts, updated progress labels |

---

## File Structure (v1.1)

```
src/
├── assets/
│   ├── compose.ts          # NEW: Detect complex compositions
│   ├── identify.ts         # MODIFIED: Handle composition metadata + png-render
│   ├── export.ts           # MODIFIED: Route png-render to batch API
│   ├── download.ts         # (no change)
│   ├── sanitize.ts         # (no change)
│   ├── types.ts            # MODIFIED: Add png-render to exportType union
│   └── [.test.ts files]
│
├── brief/
│   ├── generate.ts         # MODIFIED: New instructions + asset mapping sections
│   ├── asset-mapping.ts    # NEW: Map assets to layout breadcrumbs
│   ├── types.ts            # MODIFIED: Add AssetMapping to BriefInput
│   ├── io.ts               # (no change)
│   └── [.test.ts files]
│
├── layout/
│   ├── extract.ts          # (no change)
│   ├── normalize.ts        # (no change)
│   ├── types.ts            # (no change)
│   └── [.test.ts files]
│
├── tokens/
│   ├── collect.ts          # (no change)
│   ├── types.ts            # (no change)
│   └── [.test.ts files]
│
├── views/
│   ├── MainView.tsx        # MODIFIED: Show composition warnings, simplified UX
│   ├── SetupView.tsx       # (no change — consider merge in v1.2)
│   └── SettingsView.tsx    # (no change)
│
├── figma-api.ts            # MODIFIED (minor): Ensure batch API handles png-render IDs
├── index.tsx               # (no change)
├── context.ts              # (no change)
├── types.ts                # (no change)
└── [other files unchanged]
```

---

## Implementation Order & Dependencies

### Phase 1: Asset Detection (Week 1)

1. **compose.ts** (NEW)
   - Pure function, no external deps beyond LayoutNode
   - Testable independently
   - Low risk

2. **assets/types.ts** (UPDATE)
   - Add `'png-render'` to exportType union
   - One-line change, no breaking changes

3. **identify.ts** (UPDATE)
   - Accept composition metadata parameter
   - Update classifyNode logic
   - Backward compatible

### Phase 2: Export Pipeline (Week 1–2)

4. **export.ts** (UPDATE)
   - Route `png-render` entries to batch API
   - Reuse existing fetchImages() call
   - Test heavily: verify API handles mixed svg + png-render IDs

5. **figma-api.ts** (VERIFY)
   - Check if batch /images endpoint already supports mixed formats
   - Likely no changes needed

### Phase 3: Brief Assembly (Week 2)

6. **asset-mapping.ts** (NEW)
   - Pure function, testable independently
   - Called after export completes
   - Low risk

7. **brief/types.ts** (UPDATE)
   - Add AssetMapping interface
   - Extend BriefInput to include assetMappings[]

8. **generate.ts** (UPDATE)
   - Add buildInstructionsSection()
   - Add buildAssetMappingTable()
   - Update section order
   - Update generateBrief() signature

### Phase 4: UX Simplification (Week 2–3)

9. **MainView.tsx** (UPDATE)
   - Call compose.ts after extraction
   - Show composition count as warning
   - Simplify terminology (low-risk refactor)
   - Make tree preview collapsible
   - Add detailed phase labels

---

## Risk Assessment

### Risk 1: Composition Detection Is Too Conservative or Too Aggressive

**Probability:** Medium
**Impact:** Missed complex compositions (export as SVG textually) or over-classification (slower export).

**Mitigation:**
- Start conservative: complexity threshold = vectorCount > 5
- User testing with 3+ design systems
- Easy to tune threshold post-launch
- A/B test in future versions

---

### Risk 2: PNG Render Batching Fails on Figma API

**Probability:** Low
**Impact:** Asset export fails; user must retry.

**Mitigation:**
- Test heavily before merge: batch call with svg + png-render node IDs
- Verify Figma API endpoint behavior
- Fallback: separate API calls if batching unsupported
- Document API limitation in code comments

---

### Risk 3: Asset Mapping Breadcrumbs Are Confusing or Too Long

**Probability:** Medium
**Impact:** Brief becomes harder to read; Claude Code doesn't benefit from mapping.

**Mitigation:**
- Cap breadcrumb at 3 levels (e.g., "Hero > Buttons > arrow")
- Use node names only, not types
- User testing feedback loop
- Iterate on format post-launch

---

### Risk 4: UI Simplification Removes Features Users Need

**Probability:** Low
**Impact:** Power users can't extract single components or access advanced options.

**Mitigation:**
- Keep "Just this component" radio option visible (don't hide)
- Settings gear icon still accessible for token management
- Document advanced usage (paste component URL)
- Gather user feedback early

---

## Scaling Considerations

The plugin is fundamentally single-user, single-extraction-at-a-time. Scaling is not a concern. However, operational limits matter:

| Constraint | Threshold | Mitigation |
|-----------|-----------|-----------|
| **Tree depth** | Figma truncates at ~2000 nodes | Warn if nodeCount > 1000 (already done in v1.0) |
| **Asset count** | Batch API calls accept ~50 node IDs | Split into 50-ID chunks if assets > 50 (already done) |
| **Composition analysis** | O(n) tree walk | Negligible; one extra walk per extraction |
| **PNG render time** | Sequential; 20+ PNGs takes ~30s | Show progress; allow cancel (already done) |

No architectural changes needed for v1.1 targets.

---

## Patterns & Best Practices (v1.1)

### Pattern: Metadata Augmentation Before Classification

**What:** Analyze nodes to determine properties (compositions), then use those properties in classification logic.

**When:** When classification depends on complex context analysis.

**Example:**
```typescript
// Walk 1: Identify compositions
const compositions = analyzeCompositions(rootNodes);
const compositionSet = new Set(compositions.map(c => c.nodeId));

// Walk 2: Classify — use composition metadata
function classifyNode(node, imageFillMap, entries) {
  if (compositionSet.has(node.id) && /* complex */) {
    entries.push({ exportType: 'png-render', /* ... */ });
    return; // Don't recurse
  }
  // ... other classifications ...
}
```

**Trade-offs:**
- **Pro:** Clean separation of analysis and classification
- **Pro:** Early warnings before expensive operations
- **Con:** One extra tree walk (negligible for typical trees)

---

### Pattern: Pure Function Data Transformation

**What:** Extraction and transformation logic has no side effects, makes no API calls, mutates no state.

**When:** Core data processing — parsing, normalization, aggregation, linking.

**Example:**
```typescript
// Pure — all inputs explicit, output derived
function mapAssetsToLayout(rootNodes, assetEntries) {
  // Build map, match, return
  return mappings;
}

// Impure — would make API calls, mutate state, etc.
async function mapAssetsToLayoutAsync(rootNodes, assetEntries) {
  // Don't do this
}
```

**Trade-offs:**
- **Pro:** Fully testable, cacheable, reusable
- **Pro:** Deterministic output
- **Con:** Requires explicit input preparation upstream

---

## Anti-Patterns to Avoid

### Anti-Pattern: "Composition Detection After Asset Download Starts"

**What:** Decide to export as PNG during download phase, based on API response or render time.

**Why wrong:**
- Users don't know upfront how many compositions export as PNG
- Can't show composition warnings before extraction
- API batching becomes complex (dynamic type routing)

**Do instead:** Analyze compositions **before** asset identification starts. Show composition count in UI. Batch API calls based on known types.

---

### Anti-Pattern: "Hard-Coded Asset Paths in Brief"

**What:** Embed absolute or project-relative paths directly in brief without layout context.

**Why wrong:**
- Claude Code doesn't know where assets belong structurally
- Layout tree and asset list become disconnected
- Difficult to debug asset usage

**Do instead:** Build asset mapping that ties each asset to its breadcrumb in the tree. Brief reader can find asset location by following breadcrumb.

---

### Anti-Pattern: "Monolithic Brief Generation Function"

**What:** Single huge function with all section building inline, no modularity.

**Why wrong:**
- Hard to add new sections (v1.1 adds instructions + mapping)
- Difficult to test section formatting independently
- Code duplication between sections

**Do instead:** Modular section builders (`buildInstructionsSection()`, `buildAssetMappingTable()`, etc.), each testable independently. Orchestrate with glue code.

---

## Integration Checklist

- [ ] compose.ts created and tested independently
- [ ] identify.ts updated to accept composition metadata
- [ ] export.ts routes png-render entries correctly
- [ ] Figma API verified to handle mixed format batching
- [ ] asset-mapping.ts created and tested
- [ ] generate.ts adds instructions + asset mapping sections
- [ ] MainView shows composition warnings
- [ ] Tree preview made collapsible
- [ ] Terminology simplified (no "Extraction Scope")
- [ ] Progress labels updated ("Rendering compositions...")
- [ ] Brief type signatures updated (BriefInput + AssetMapping)
- [ ] All unit tests pass
- [ ] Integration test: full extraction → brief generation
- [ ] Manual testing with 3+ diverse designs
- [ ] User feedback collected on UX simplification

---

## Sources

### Design Brief & Claude Code Patterns
- [Best Practices for Claude Code — Claude Code Docs](https://code.claude.com/docs/en/best-practices)
- [Plan Mode in Claude Code — ClaudeLog](https://claudelog.com/mechanics/plan-mode/)
- [Claude Code Guide for Designers — Felix Lee](https://adplist.substack.com/p/claude-code-guide-for-designers)

### Figma API & Asset Handling
- [Figma REST API — Image Endpoint](https://www.figma.com/developers/api#get_images)
- [Figma Plugin API — exportAsync](https://www.figma.com/plugin-docs/api/properties/nodes-exportasync/)
- [Extracting SVGs Using Figma API — Jacob Tan](https://blog.jacobtan.co/extracting-svgs-using-figma-api)
- [Known Issue: Nested Vectors in SVG Export — Figma Forum](https://forum.figma.com/t/exporting-svg-elements-using-figma-api-issue/37188)

### Design Systems & Architecture
- [Schema 2025: Design Systems for a New Era — Figma Blog](https://www.figma.com/blog/schema-2025-design-systems-recap/)
- [Best Design Systems in 2025 — Dumbo Design](https://dumbo.design/en/insights/best-design-systems-in-2025/)

### Code Quality & Integration Patterns
- [Improving Frontend Design Through Skills — Claude Blog](https://claude.com/blog/improving-frontend-design-through-skills)

---

**Architecture Research: v1.1 Integration Points**
**Status:** Integration-focused, minimal refactoring required
**Researched:** 2026-02-28
**Confidence:** HIGH — All integration points validated against v1.0 codebase; zero breaking changes.
