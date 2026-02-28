# Stack Additions for v1.1: Smart Asset Detection & Improved Brief Instructions

**Project:** Ship Studio Figma Plugin
**Milestone:** v1.1 Brief Quality & UX
**Researched:** 2026-02-28
**Baseline Stack:** See STACK.md (v1.0 core technologies)
**Confidence:** HIGH for asset detection approach, MEDIUM for UX patterns

---

## Context: v1.1 Features

v1.1 targets three improvements to move from 80% to near-100% accuracy on first Claude Code build:

1. **Smarter asset detection** — Detect complex compositions (nested groups) and export as images
2. **Improved brief instructions** — Plan mode guidance, verification instructions, asset-to-layout mapping
3. **UX simplification** — Fewer steps, clearer terminology, less overwhelming results

The existing v1.0 stack (React 18, TypeScript, Vite, Vitest, @figma/rest-api-spec, custom curl wrapper) is sufficient. **Only minimal additions are needed.**

---

## New Library Requirements

### MANDATORY: `zod` ^4.3.6

**Purpose:** Schema validation for asset detection heuristics and brief instruction templating

**Why it's needed:**
- Detects complex compositions programmatically (heuristic: GROUP with >5 descendants, or containing only VECTOR/BOOLEAN_OPERATION children)
- Validates asset metadata before export (nodeId, filename, dimensions, layoutPath)
- Ensures brief instruction templates conform to expected shape before serialization
- Validates composition detection results before rendering via Figma API

**Code example (composition detection):**
```typescript
import { z } from 'zod';

// Define what a detected composition looks like
const CompositionSchema = z.object({
  nodeId: z.string(),
  nodeName: z.string(),
  childCount: z.number().min(3),
  containsVectorOnly: z.boolean(),
  estimatedComplexity: z.enum(['simple', 'moderate', 'complex']),
  shouldExportAsImage: z.boolean(),
});

// In detectComplexCompositions():
const detected = traverseAndDetect(nodes);
const validated = detected.map(item => CompositionSchema.parse(item));
// If validation fails, log warning instead of rendering malformed asset
```

**Bundle impact:** ~8 KB (v4.3.6 is 57% smaller than v3, 14x faster)

**Alternative:** Skip zod and use try-catch on JSON.parse + type assertions. Works but less safe for runtime validation of tree traversal results.

**Status:** Already in v1.0 stack (noted as MEDIUM confidence). Elevate to MANDATORY for v1.1.

---

### OPTIONAL: `clsx` ^2.0.0

**Purpose:** Classname utility for UX redesign conditional styling

**Why it helps (not critical):**
- New UI states: "extracting" (loading), "ready" (success), "error", "warning"
- Reduces ternary-heavy className expressions
- Industry standard for Tailwind/conditional classes
- If project uses Tailwind CSS (likely, given Ship Studio design system)

**Code example:**
```typescript
import clsx from 'clsx';

<div className={clsx(
  'extraction-result',
  { 'is-loading': isExtracting },
  { 'has-warnings': warnings.length > 0 },
  { 'has-errors': error !== null }
)}>
  {/* content */}
</div>
```

**Alternative (no clsx):** Use inline conditionals
```typescript
<div className={`extraction-result ${isExtracting ? 'is-loading' : ''} ${warnings.length > 0 ? 'has-warnings' : ''}`}>
```

**Bundle impact:** ~0.7 KB (negligible)

**Recommendation:** Include if redesigning UI. Skip if constraints are tight.

---

## NO NEW LIBRARIES NEEDED FOR:

### Asset Detection Breakthrough

The key insight: **Figma REST API already supports rendering arbitrary node IDs** (`GET /v1/images/:key?ids=nodeId1,nodeId2&format=png`). The v1.0 limitation isn't API capability—it's detection logic.

**v1.1 algorithm (pure logic, no new libraries):**

1. **Traverse layout tree** to identify GROUP nodes
2. **Heuristic detection:**
   - GROUP with >5 children
   - GROUP containing only VECTOR/BOOLEAN_OPERATION/LINE/STAR/POLYGON/ELLIPSE children
   - GROUP with complex nesting (>2 levels deep)
3. **Mark for export as PNG** instead of attempting SVG
4. **Use existing `fetchImages()` + `downloadAssets()`** to render and download as PNG
5. **Build asset-to-layout mapping** (document each asset's position in layout tree)

**Code location:** Enhance `/src/assets/identify.ts`

```typescript
// New function (uses zod for validation)
function detectComplexCompositions(nodes: LayoutNode[]): CompositionMetadata[] {
  const compositions: CompositionMetadata[] = [];

  function traverse(node: LayoutNode, depth: number) {
    // Heuristic 1: GROUP with many children
    if (node.type === 'GROUP' && node.children) {
      const childCount = node.children.length;
      const vectorCount = node.children.filter(c =>
        ['VECTOR', 'BOOLEAN_OPERATION', 'LINE', 'STAR', 'POLYGON', 'ELLIPSE'].includes(c.type)
      ).length;

      if (childCount > 5 && vectorCount / childCount > 0.7) {
        compositions.push({
          nodeId: node.id,
          nodeName: node.name,
          childCount,
          containsVectorOnly: vectorCount === childCount,
          estimatedComplexity: childCount > 20 ? 'complex' : 'moderate',
          shouldExportAsImage: true,
        });
      }
    }

    // Continue traversal
    if (node.children) {
      for (const child of node.children) {
        traverse(child, depth + 1);
      }
    }
  }

  for (const root of nodes) {
    traverse(root, 0);
  }

  return compositions.map(c => CompositionSchema.parse(c));
}
```

### Improved Brief Instructions

**No new libraries needed.** This is purely **prose enhancement** informed by [official Claude Code best practices](https://code.claude.com/docs/en/best-practices).

**Add to brief generation** (in `/src/brief/generate.ts`):

```markdown
## How to Use This Brief with Claude Code

This brief is designed for Claude Code. For best results:

### 1. Enter Plan Mode
Read-only mode where Claude explores the design without making changes.

Before you start coding:
- Claude Code: Use **Ctrl+G** to open and edit the plan
- Ask clarifying questions about anything ambiguous
- Don't exit Plan Mode until the approach is clear

### 2. Ask Clarifying Questions
Examples:
- "What's the responsive behavior on mobile?"
- "How should the spacing scale on smaller screens?"
- "Are these colors exact or approximate?"

**Don't start coding until the plan is clear.**

### 3. Use Only Provided Assets
Never fabricate replacements. Each asset below is mapped to its exact position in the layout.

If you need an asset that's missing, ask instead of creating a substitute.

### 4. Verify Your Output
When done, compare your build against the preview.png in the assets folder:
- Visual check: Does it match the preview?
- Colors accurate?
- Spacing correct?
- All assets in place?

If anything differs, ask for clarification and iterate.

---

## Asset-to-Layout Mapping

Each exported asset is tied to its position in the design:

| Asset | Layout Path | Purpose | Dimensions |
| --- | --- | --- | --- |
| [asset name] | Frame "X" > Group "Y" | [description] | [W x H px] |

Use the layout path to understand exactly where each asset belongs. Don't guess placement.
```

**Validation with zod (optional):**
```typescript
const BriefInstructionSchema = z.object({
  assetId: z.string(),
  layoutPath: z.string(),
  purpose: z.string(),
  dimensions: z.object({ width: z.number(), height: z.number() }).optional(),
});

// In generateBrief():
const instructions = buildBriefInstructions(assets);
instructions.forEach(i => BriefInstructionSchema.parse(i)); // Validate before markdown
```

### UX Simplification

**No new libraries strictly required.** This is **React component refactoring**:

**Current flow (v1.0):**
```
1. Paste URL
2. Choose "Extraction Scope" (Single Node / Entire Page)
3. Configure "Export Options" (which asset types, preview scale)
4. Click "Extract"
5. Review results (6 separate sections: metadata, preview, layout, tokens, components, assets)
```

**Proposed flow (v1.1):**
```
1. Paste URL
2. Click "Extract" (defaults to "Just this component")
3. Review brief in one panel with tabs: Preview | Layout | Assets | Instructions
```

**Terminology mapping:**
- "Extraction Scope" → "What to extract?"
- "Single Node" → "Just this component"
- "Entire Page" → "The whole page"
- "Analyze Layout" → (remove, default behavior)
- "Preview Image Scale" → (move to advanced options, defaults to 2x)

**Optional: Use clsx for state styling**
```typescript
import clsx from 'clsx';

<div className={clsx(
  'result-container',
  { 'is-loading': isExtracting },
  { 'has-warnings': warnings.length > 0 },
)}>
```

**Or fallback (no clsx, no new dependencies):**
```typescript
<div className={`result-container ${isExtracting ? 'is-loading' : ''} ${warnings.length > 0 ? 'has-warnings' : ''}`}>
```

---

## Integration Points with v1.0

### Asset Identification Pipeline

**Existing (v1.0):**
```
identifyAssets(rootNodes, imageFills)
  → AssetEntry[] (SVG + PNG candidates)
  → fetchImages() + downloadAssets()
```

**Enhanced (v1.1):**
```
detectComplexCompositions(rootNodes) [NEW]
  → CompositionMetadata[] (validated with zod)

identifyAssets(rootNodes, imageFills)
  → [existing logic] + [append complex compositions marked for PNG export]
  → AssetEntry[] (SVG + PNG + detected compositions as PNG)

fetchImages(nodeIds, 'png') [existing]
  → Renders compositions + original assets in one batch call

downloadAssets() [existing]
  → Downloads all URLs to disk
```

### Brief Generation

**Existing (v1.0):**
```
generateBrief(extraction, exportResult, projectPath)
  → Sections: Metadata, Preview, Layout Tree, Design Tokens, Components, Assets
  → Returns markdown string
```

**Enhanced (v1.1):**
```
generateBrief(extraction, exportResult, projectPath)
  → Existing sections +
  → NEW: "How to Use This Brief" (Claude Code instructions)
  → NEW: Enhanced "Assets" section with layout-to-asset mapping

[validate instruction template with zod before serializing]

  → Returns markdown string
```

### UI Components

**Existing (v1.0):**
```
<ExtractionFlow>
  <URLInput />
  <ExtractionOptions /> (Scope dropdown, asset filters, preview scale)
  <ExtractButton />
  <ResultPanel>
    <MetadataSection />
    <PreviewSection />
    <LayoutTreeSection />
    <DesignTokensSection />
    <ComponentsSection />
    <AssetsSection />
  </ResultPanel>
</ExtractionFlow>
```

**Refactored (v1.1):**
```
<ExtractionFlow>
  <URLInput />
  <QuickExtractButton /> (defaults to "just this component")

  {isExtracting && <LoadingState />}
  {extractionComplete && (
    <ResultPanel>
      <Tabs>
        <Tab label="Preview" />
        <Tab label="Layout" />
        <Tab label="Assets" /> (now with layout paths)
        <Tab label="Instructions" /> (Claude Code guidance)
      </Tabs>
      <CopyButton /> (top-right)
    </ResultPanel>
  )}
</ExtractionFlow>
```

---

## Version Compatibility

| Package | Version | Notes |
|---------|---------|-------|
| **zod** | ^4.3.6 | Works with TypeScript 5.x. No breaking changes in 4.x. Required for v1.1. |
| **clsx** | ^2.0.0 | Optional. Works with React 18. No breaking changes in 2.x. |
| @figma/rest-api-spec | ^1.0 | Unchanged from v1.0. Supports all node types including GROUP, VECTOR, BOOLEAN_OPERATION. |
| React | 18.x | Unchanged from v1.0. |
| TypeScript | 5.x | Unchanged from v1.0. |

---

## Installation

```bash
# Add zod (MANDATORY for v1.1)
npm install zod@^4.3.6

# Add clsx (OPTIONAL, recommended if redesigning UI)
npm install clsx@^2.0.0

# Verify types still resolve
npx tsc --noEmit

# Check bundle impact
npm run build && du -h dist/index.js
# Expected: < 100 KB total (was 66.54 KB in v1.0)
```

---

## What NOT to Add for v1.1

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Image processing libraries** (sharp, jimp, canvas) | Plugin runs in browser-like Tauri webview, not Node.js. Figma API already renders composition as PNG—no processing needed locally. | Use Figma's `GET /v1/images` endpoint directly |
| **LLM libraries** (openai, anthropic SDK) | Plugin prepares context only; Claude Code generates code. No API calls to Claude. | Manual prose in brief (validated with zod) |
| **Form state libraries** (react-hook-form, formik) | UX simplification means fewer form fields (URL + one button). React's native useState() is sufficient. | useState() + useCallback() hooks |
| **Tree visualization** (react-flow, reactflow) | Plugin renders layout tree as indented markdown text, not a visual tree component. | Existing markdown formatting (see v1.0 `buildLayoutTreeSection`) |
| **Markdown parsers** (marked, remark) | Plugin generates markdown only (doesn't parse it). Markdown is output format, not input. | String concatenation (existing approach) |

---

## Files to Modify for v1.1

### Modified (Existing v1.0 Files)

| File | Change | Reason |
|------|--------|--------|
| `/src/assets/identify.ts` | Add `detectComplexCompositions()` function | Detect GROUP nodes for image export |
| `/src/assets/export.ts` | Include compositions in asset list | Render compositions as PNG via Figma API |
| `/src/brief/generate.ts` | Add instruction and asset-to-layout sections | Document Claude Code best practices |
| `/src/UI/*.tsx` | Refactor extraction flow, simplify options | Fewer steps, clearer terminology |
| `package.json` | Add zod ^4.3.6, optionally clsx ^2.0.0 | New dependencies |

### New (v1.1 Files)

| File | Purpose |
|------|---------|
| `/src/assets/composition.ts` | Types and utilities for composition detection |
| `/src/brief/instructions.ts` | Claude Code instruction template builder |

---

## High-Confidence Recommendations

1. **Add zod** (MANDATORY)
   - Risk of not having it: Silent validation failures in asset detection
   - Alternative: Manual try-catch validation (less safe, harder to maintain)
   - Confidence: HIGH (industry standard, well-documented)

2. **Implement composition detection** (no new libraries)
   - Algorithm is straightforward tree traversal with heuristics
   - Use existing Figma API endpoints (no new capability needed)
   - Confidence: HIGH (Figma REST API supports arbitrary node rendering)

3. **Add Claude Code best practices to brief** (no new libraries)
   - Informed by official documentation (code.claude.com/docs)
   - Pure prose enhancement to brief generation
   - Confidence: HIGH (official guidance, tested patterns)

4. **Refactor UX** (optional clsx)
   - Reduces form steps and terminology complexity
   - Works with or without clsx (fallback to inline conditionals)
   - Confidence: MEDIUM (UX improvements are subjective, test with users)

---

## Success Criteria for v1.1

- [ ] Complex compositions (nested GROUPs) are detected and exported as PNG (not described as text)
- [ ] Each exported asset includes its layout path in the brief
- [ ] Brief includes "How to Use with Claude Code" section with plan mode guidance
- [ ] Brief explicitly states "use only provided assets" rule
- [ ] Brief includes verification instructions (compare output to preview.png)
- [ ] Extraction flow reduced from 5 steps to 2-3 steps
- [ ] UI terminology uses plain language (no "Extraction Scope", "Single Node", etc.)
- [ ] Bundle size remains < 100 KB (66.54 KB v1.0 + ~9 KB additions = ~75 KB)
- [ ] All existing tests pass
- [ ] New tests for composition detection, instruction validation

---

## Sources

- [Figma REST API: Image Rendering](https://developers.figma.com/docs/rest-api/file-endpoints/) — Verified 2026-02-28, supports arbitrary node IDs
- [Figma Plugin API: GroupNode](https://developers.figma.com/docs/plugins/api/GroupNode/) — Verified node tree traversal methods
- [Claude Code Best Practices (Official)](https://code.claude.com/docs/en/best-practices) — Plan mode, verification, asset-only rules
- [Zod v4 Documentation](https://zod.dev/) — Schema validation library
- [clsx Documentation](https://www.npmjs.com/package/clsx) — Classname utility

---

*Stack additions research for v1.1 milestone (Brief Quality & UX)*
*Researched: 2026-02-28*
