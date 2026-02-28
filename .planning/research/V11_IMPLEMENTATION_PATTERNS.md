# v1.1 Implementation Patterns: Code Examples and Integration Guide

**Purpose:** Concrete code patterns for implementing v1.1 features
**For:** Developers implementing asset detection, brief instructions, UX redesign

---

## Pattern 1: Composition Detection with Zod Validation

### Type Definitions

```typescript
// src/assets/composition.ts
import { z } from 'zod';
import type { LayoutNode } from '../layout/types';

/**
 * Detected complex composition (illustration, nested group)
 * marked for PNG export instead of SVG description
 */
export const CompositionMetadata = z.object({
  nodeId: z.string().min(1),
  nodeName: z.string().min(1),
  type: z.literal('GROUP'),
  childCount: z.number().int().min(3),
  vectorOnlyCount: z.number().int(),
  containsVectorOnly: z.boolean(),
  nestingDepth: z.number().int().min(1),
  estimatedComplexity: z.enum(['simple', 'moderate', 'complex']),
  shouldExportAsImage: z.boolean(),
});

export type CompositionMetadata = z.infer<typeof CompositionMetadata>;

// Helper for validation errors
export function validateComposition(data: unknown): CompositionMetadata {
  try {
    return CompositionMetadata.parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(`Invalid composition: ${err.errors[0].message}`);
    }
    throw err;
  }
}
```

### Detection Function

```typescript
// src/assets/composition.ts (continued)

/**
 * Detect complex compositions in the layout tree.
 * Heuristics:
 * - GROUP nodes with >5 children
 * - GROUPs containing >70% vector nodes (likely illustrations)
 * - GROUPs with nesting depth >2 (complex hierarchies)
 */
export function detectComplexCompositions(
  rootNodes: LayoutNode[],
  minChildCount = 5,
  vectorThreshold = 0.7,
): CompositionMetadata[] {
  const compositions: Omit<CompositionMetadata, never>[] = [];

  function traverse(
    node: LayoutNode,
    depth: number,
    parentPath: string,
  ): void {
    // Only examine GROUP nodes
    if (node.type !== 'GROUP' || !node.children) {
      // Continue traversal for containers
      if (node.children && depth < 5) {
        for (const child of node.children) {
          traverse(child, depth + 1, `${parentPath} > ${node.name}`);
        }
      }
      return;
    }

    const childCount = node.children.length;
    const vectorCount = node.children.filter((c) =>
      [
        'VECTOR',
        'BOOLEAN_OPERATION',
        'LINE',
        'STAR',
        'POLYGON',
        'ELLIPSE',
      ].includes(c.type)
    ).length;

    const vectorRatio = childCount > 0 ? vectorCount / childCount : 0;
    const isComplexComposition =
      childCount >= minChildCount && vectorRatio >= vectorThreshold;

    if (isComplexComposition) {
      compositions.push({
        nodeId: node.id,
        nodeName: node.name,
        type: 'GROUP',
        childCount,
        vectorOnlyCount: vectorCount,
        containsVectorOnly: vectorRatio === 1.0,
        nestingDepth: depth,
        estimatedComplexity:
          childCount > 20 ? 'complex' : childCount > 10 ? 'moderate' : 'simple',
        shouldExportAsImage: true,
      });
    }

    // Continue traversal
    for (const child of node.children) {
      traverse(child, depth + 1, `${parentPath} > ${node.name}`);
    }
  }

  for (const root of rootNodes) {
    traverse(root, 0, '');
  }

  // Validate all detected compositions before returning
  return compositions.map((c) => validateComposition(c));
}
```

### Usage in Asset Identification

```typescript
// src/assets/identify.ts (modified)

import { detectComplexCompositions, type CompositionMetadata } from './composition';

export interface AssetEntry {
  nodeId: string;
  nodeName: string;
  exportType: 'svg' | 'png-fill' | 'png-composition'; // NEW: png-composition
  filename: string;
  imageRef?: string;
  layoutPath?: string; // NEW: position in tree
}

export function identifyAssets(
  rootNodes: LayoutNode[],
  imageFills: ImageFillRef[],
): AssetEntry[] {
  const entries: AssetEntry[] = [];

  // [Existing code for SVG and PNG-fill identification]
  // ...

  // NEW: Add detected compositions
  const compositions = detectComplexCompositions(rootNodes);
  for (const comp of compositions) {
    entries.push({
      nodeId: comp.nodeId,
      nodeName: comp.nodeName,
      exportType: 'png-composition',
      filename: sanitizeFilename(comp.nodeName) + '.png',
      layoutPath: buildLayoutPath(rootNodes, comp.nodeId), // NEW
    });
  }

  return resolveCollisions(entries);
}

// Helper: Build layout path like "Frame > Group > Illustration"
function buildLayoutPath(
  rootNodes: LayoutNode[],
  targetNodeId: string,
): string {
  const path: string[] = [];

  function findPath(node: LayoutNode): boolean {
    path.push(node.name);
    if (node.id === targetNodeId) return true;
    if (node.children) {
      for (const child of node.children) {
        if (findPath(child)) return true;
      }
    }
    path.pop();
    return false;
  }

  for (const root of rootNodes) {
    if (findPath(root)) break;
  }

  return path.join(' > ');
}
```

---

## Pattern 2: Enhanced Brief Generation with Instructions

### Instruction Template with Zod

```typescript
// src/brief/instructions.ts (NEW FILE)

import { z } from 'zod';

const AssetMapEntry = z.object({
  asset: z.string().describe('Asset filename'),
  layoutPath: z.string().describe('Position in layout tree'),
  purpose: z.string().describe('What this asset is used for'),
  dimensions: z
    .object({
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional()
    .describe('Asset dimensions'),
});

export type AssetMapEntry = z.infer<typeof AssetMapEntry>;

export const BriefInstructions = z.object({
  includeClaudeCodeGuidance: z.boolean().default(true),
  assetMapping: z.array(AssetMapEntry),
  warningCount: z.number().int().non_negative().default(0),
});

export type BriefInstructions = z.infer<typeof BriefInstructions>;

/**
 * Build the "How to Use This Brief" section
 */
export function buildClaudeCodeGuidanceSection(): string {
  return `## How to Use This Brief with Claude Code

This brief is designed for Claude Code. For best results:

### 1. Enter Plan Mode
Use **Ctrl+G** to open and edit the plan. Read-only mode lets you explore without changes.

Ask clarifying questions about:
- Responsive behavior
- Animation/interaction details
- Spacing ratios
- Color accuracy

**Don't start coding until the plan is clear.**

### 2. Use Only Provided Assets
Every asset below is mapped to its exact position in the layout.

**Never fabricate replacements.** If you need an asset:
- Check the Asset-to-Layout Mapping below
- Ask for clarification instead of creating a substitute

### 3. Verify Your Output
When done, compare your build to the preview.png:
- Visual match?
- Colors accurate?
- Spacing correct?
- All assets in place?

If anything differs, ask and iterate.

### 4. Responsive Behavior
This brief shows the design at a specific screen size. Ask about:
- Mobile layout
- Tablet layout
- Responsive breakpoints`;
}

/**
 * Build the "Asset-to-Layout Mapping" section
 */
export function buildAssetMappingSection(
  entries: AssetMapEntry[],
): string {
  if (entries.length === 0) return '';

  const rows = entries
    .map(
      (e) =>
        `| \`${e.asset}\` | ${e.layoutPath} | ${e.purpose} | ${
          e.dimensions ? `${e.dimensions.width}×${e.dimensions.height}px` : '–'
        } |`,
    )
    .join('\n');

  return `## Asset-to-Layout Mapping

Each exported asset is tied to its position in the design:

| Asset | Layout Path | Purpose | Dimensions |
|-------|-------------|---------|------------|
${rows}

Use the layout path to understand exactly where each asset belongs. Don't guess placement.`;
}

/**
 * Validate instruction data before serializing to markdown
 */
export function validateInstructions(data: unknown): BriefInstructions {
  try {
    return BriefInstructions.parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('Invalid brief instructions:', err.errors);
      // Fallback: return minimal valid instructions
      return {
        includeClaudeCodeGuidance: true,
        assetMapping: [],
        warningCount: err.errors.length,
      };
    }
    throw err;
  }
}
```

### Integration into Brief Generation

```typescript
// src/brief/generate.ts (modified)

import {
  buildClaudeCodeGuidanceSection,
  buildAssetMappingSection,
  validateInstructions,
} from './instructions';

export function generateBrief(input: BriefInput): BriefResult {
  const { extraction, exportResult, projectPath } = input;
  const tokens = extraction.tokens;

  // Build asset mapping from composition exports
  const assetMappingEntries = exportResult.assets
    .filter((a) => a.layoutPath) // Only assets with layout paths
    .map((a) => ({
      asset: a.filename,
      layoutPath: a.layoutPath || 'unknown',
      purpose: `Asset ${a.filename}`, // TODO: enhance with better descriptions
      dimensions: a.dimensions, // if available
    }));

  // Validate instructions before serializing
  const instructionsData = {
    includeClaudeCodeGuidance: true,
    assetMapping: assetMappingEntries,
    warningCount: exportResult.warnings.length,
  };
  validateInstructions(instructionsData); // Throws if invalid

  const sections = [
    buildMetadataSection(input),
    buildPreviewSection(exportResult.previewPath, projectPath),
    buildClaudeCodeGuidanceSection(), // NEW
    buildLayoutTreeSection(extraction.extraction.rootNodes),
    buildDesignTokensSection(tokens),
    buildComponentsSection(tokens.components),
    buildAssetMappingSection(assetMappingEntries), // NEW (enhanced)
    buildAssetsSection(exportResult.previewPath, exportResult.assets, projectPath),
  ].filter(Boolean);

  const markdown = sections.join('\n\n');

  // ... rest of function unchanged
}
```

---

## Pattern 3: UX Simplification with Optional clsx

### Before (v1.0)

```typescript
// src/UI/ExtractionFlow.tsx (v1.0)

export function ExtractionFlow() {
  const [scope, setScope] = useState<'single' | 'page'>('single');
  const [options, setOptions] = useState({ ... });
  const [step, setStep] = useState(0);

  return (
    <div>
      {step === 0 && (
        <>
          <URLInput onSubmit={handleURLSubmit} />
        </>
      )}
      {step === 1 && (
        <>
          <label>Extraction Scope</label>
          <select value={scope} onChange={(e) => setScope(e.target.value as any)}>
            <option value="single">Single Node</option>
            <option value="page">Entire Page</option>
          </select>
        </>
      )}
      {step === 2 && (
        <>
          <label>Export Options</label>
          {/* Many options */}
        </>
      )}
      {step === 3 && (
        <>
          <button onClick={handleExtract}>Extract</button>
        </>
      )}
      {isExtracting && <LoadingSpinner />}
      {extractionComplete && (
        <div
          className={
            isExtracting
              ? 'result-panel is-loading'
              : warnings.length > 0
                ? 'result-panel has-warnings'
                : 'result-panel'
          }
        >
          {/* 6 separate sections */}
        </div>
      )}
    </div>
  );
}
```

### After (v1.1 with clsx)

```typescript
// src/UI/ExtractionFlow.tsx (v1.1 simplified)
import clsx from 'clsx';

export function ExtractionFlow() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<BriefResult | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'layout' | 'assets' | 'instructions'>('preview');

  const handleExtract = async (url: string) => {
    setIsExtracting(true);
    try {
      const result = await performExtraction(url);
      setExtractionResult(result);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="extraction-flow">
      {/* Step 1: URL Input (always visible) */}
      {!extractionResult && (
        <URLInput onSubmit={handleExtract} disabled={isExtracting} />
      )}

      {/* Loading State */}
      {isExtracting && <LoadingState />}

      {/* Results: Tabbed UI */}
      {extractionResult && (
        <ResultPanel
          result={extractionResult}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
}

interface ResultPanelProps {
  result: BriefResult;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function ResultPanel({ result, activeTab, onTabChange }: ResultPanelProps) {
  const hasWarnings = result.warnings && result.warnings.length > 0;

  return (
    <div
      className={clsx(
        'result-panel',
        { 'has-warnings': hasWarnings },
        { 'has-large-brief': result.estimatedTokens > 8000 }
      )}
    >
      <header className="result-header">
        <div className="tabs">
          {['preview', 'layout', 'assets', 'instructions'].map((tab) => (
            <button
              key={tab}
              className={clsx('tab-button', {
                'is-active': activeTab === tab,
              })}
              onClick={() => onTabChange(tab)}
            >
              {capitalize(tab)}
            </button>
          ))}
        </div>
        <CopyButton markdown={result.markdown} />
      </header>

      <div className="result-content">
        {activeTab === 'preview' && <PreviewTab result={result} />}
        {activeTab === 'layout' && <LayoutTab result={result} />}
        {activeTab === 'assets' && <AssetsTab result={result} />}
        {activeTab === 'instructions' && <InstructionsTab result={result} />}
      </div>

      {hasWarnings && (
        <footer className="result-footer">
          <WarningsSummary warnings={result.warnings} />
        </footer>
      )}
    </div>
  );
}
```

### Alternative: Without clsx (v1.1 minimal dependencies)

```typescript
// Same component, but without clsx

function ResultPanel({ result, activeTab, onTabChange }: ResultPanelProps) {
  const hasWarnings = result.warnings && result.warnings.length > 0;
  const hasLargeBrief = result.estimatedTokens > 8000;

  const panelClassName = `result-panel ${hasWarnings ? 'has-warnings' : ''} ${hasLargeBrief ? 'has-large-brief' : ''}`;

  return (
    <div className={panelClassName}>
      {/* rest same */}
    </div>
  );
}

// In tab button:
<button
  className={`tab-button ${activeTab === tab ? 'is-active' : ''}`}
  onClick={() => onTabChange(tab)}
>
  {capitalize(tab)}
</button>
```

---

## Pattern 4: Testing Composition Detection

### Test Cases

```typescript
// src/assets/composition.test.ts

import { describe, it, expect } from 'vitest';
import {
  detectComplexCompositions,
  validateComposition,
} from './composition';
import type { LayoutNode } from '../layout/types';

describe('detectComplexCompositions', () => {
  it('should detect GROUP with >5 vector children as complex', () => {
    const node: LayoutNode = {
      id: '1:1',
      name: 'Illustration',
      type: 'GROUP',
      children: [
        { id: '1:2', name: 'Vector1', type: 'VECTOR', children: [] },
        { id: '1:3', name: 'Vector2', type: 'VECTOR', children: [] },
        { id: '1:4', name: 'Vector3', type: 'VECTOR', children: [] },
        { id: '1:5', name: 'Vector4', type: 'VECTOR', children: [] },
        { id: '1:6', name: 'Vector5', type: 'VECTOR', children: [] },
        { id: '1:7', name: 'Vector6', type: 'VECTOR', children: [] },
      ],
    };

    const compositions = detectComplexCompositions([node]);
    expect(compositions).toHaveLength(1);
    expect(compositions[0].nodeId).toBe('1:1');
    expect(compositions[0].shouldExportAsImage).toBe(true);
  });

  it('should NOT detect GROUP with <5 children', () => {
    const node: LayoutNode = {
      id: '1:1',
      name: 'SmallGroup',
      type: 'GROUP',
      children: [
        { id: '1:2', name: 'Vector1', type: 'VECTOR', children: [] },
        { id: '1:3', name: 'Vector2', type: 'VECTOR', children: [] },
      ],
    };

    const compositions = detectComplexCompositions([node]);
    expect(compositions).toHaveLength(0);
  });

  it('should validate composition metadata', () => {
    const valid = {
      nodeId: '1:1',
      nodeName: 'Illustration',
      type: 'GROUP',
      childCount: 8,
      vectorOnlyCount: 7,
      containsVectorOnly: false,
      nestingDepth: 2,
      estimatedComplexity: 'moderate',
      shouldExportAsImage: true,
    };

    expect(() => validateComposition(valid)).not.toThrow();
  });

  it('should reject invalid composition (negative child count)', () => {
    const invalid = {
      nodeId: '1:1',
      nodeName: 'Bad',
      type: 'GROUP',
      childCount: -5, // Invalid!
      vectorOnlyCount: 0,
      containsVectorOnly: false,
      nestingDepth: 1,
      estimatedComplexity: 'simple',
      shouldExportAsImage: false,
    };

    expect(() => validateComposition(invalid)).toThrow();
  });
});
```

---

## Pattern 5: Integration Tests (End-to-End)

```typescript
// src/integration.test.ts (sample)

import { describe, it, expect, beforeEach } from 'vitest';
import { identifyAssets } from './assets/identify';
import { detectComplexCompositions } from './assets/composition';
import { generateBrief } from './brief/generate';

describe('v1.1 Integration: Asset Detection + Brief Generation', () => {
  let mockRootNodes: LayoutNode[];

  beforeEach(() => {
    // Setup mock Figma nodes with a complex composition
    mockRootNodes = [
      {
        id: '1:0',
        name: 'Page',
        type: 'FRAME',
        children: [
          {
            id: '1:1',
            name: 'Card',
            type: 'FRAME',
            children: [
              {
                id: '1:2',
                name: 'Illustration',
                type: 'GROUP',
                // ... 8 vector children
              },
            ],
          },
        ],
      },
    ];
  });

  it('should detect complex composition and include in assets list', () => {
    const assets = identifyAssets(mockRootNodes, []);
    const compositionAssets = assets.filter((a) => a.exportType === 'png-composition');
    expect(compositionAssets).toHaveLength(1);
    expect(compositionAssets[0].layoutPath).toContain('Illustration');
  });

  it('should include asset mapping in generated brief', () => {
    const assets = identifyAssets(mockRootNodes, []);
    const briefInput = {
      extraction: { /* mock data */ },
      exportResult: { assets, previewPath: '', warnings: [] },
      projectPath: '/tmp',
    };

    const brief = generateBrief(briefInput);
    expect(brief.markdown).toContain('Asset-to-Layout Mapping');
    expect(brief.markdown).toContain('How to Use This Brief');
  });
});
```

---

## Key Integration Points

### Asset Export Pipeline (Modified)

```
Input: rootNodes, imageFills
   ↓
detectComplexCompositions(rootNodes)
   ↓ [zod validation]
   ↓
identifyAssets(rootNodes, imageFills, compositions)
   ↓ [includes composition metadata with layoutPath]
   ↓
fetchImages(shell, token, fileKey, [all nodeIds], 'png')
   ↓ [Figma API renders all nodes including compositions]
   ↓
downloadAssets(shell, assetsDir, urls)
   ↓
ExportResult { assets, previewPath, warnings }
   ↓
generateBrief(extraction, exportResult)
   ↓ [includes Asset-to-Layout mapping, Claude Code guidance]
   ↓
Output: BriefResult { markdown, estimatedTokens, stats }
```

### UX Flow (Simplified)

```
User pastes Figma URL
   ↓
<URLInput /> component
   ↓
User clicks "Extract" button
   ↓
[Show LoadingState]
   ↓
handleExtract() calls performExtraction()
   ↓
performExtraction() calls:
  1. parseFigmaURL(url)
  2. fetchFigmaFile(fileKey, token)
  3. identifyAssets() [now includes compositions]
  4. exportAssets()
  5. generateBrief() [now includes instructions]
   ↓
[Hide LoadingState]
[Show ResultPanel with tabs: Preview, Layout, Assets, Instructions]
   ↓
User clicks tab or "Copy to Clipboard"
```

---

## File Changes Summary

### Modified Files

1. **`src/assets/identify.ts`**
   - Add composition detection to asset identification
   - Include `layoutPath` in AssetEntry type
   - Call `detectComplexCompositions()`

2. **`src/brief/generate.ts`**
   - Add Claude Code guidance section
   - Add asset-to-layout mapping section
   - Validate instruction templates with zod

3. **`src/UI/ExtractionFlow.tsx`**
   - Simplify form (URL + single "Extract" button)
   - Implement tab-based results
   - Optionally use clsx for conditional styling

4. **`package.json`**
   - Add `zod@^4.3.6`
   - Optionally add `clsx@^2.0.0`

### New Files

1. **`src/assets/composition.ts`**
   - `CompositionMetadata` schema
   - `detectComplexCompositions()` function
   - Validation utilities

2. **`src/brief/instructions.ts`**
   - Instruction template builders
   - Claude Code guidance section
   - Asset mapping section
   - Instruction validation

3. **`src/assets/composition.test.ts`**
   - Tests for composition detection

4. **`src/brief/instructions.test.ts`**
   - Tests for instruction generation

---

## Deployment Checklist

- [ ] `npm install zod@^4.3.6`
- [ ] `npm install clsx@^2.0.0` (optional)
- [ ] `npx tsc --noEmit` (type check)
- [ ] `npm test` (all tests pass)
- [ ] `npm run build` (build succeeds)
- [ ] `du -h dist/index.js` (check bundle size < 100 KB)
- [ ] Manual testing: paste Figma URL, extract, verify layout path in brief
- [ ] User testing: 2-3 users test composition detection, brief clarity
- [ ] Code review: check zod validation, clsx usage, brief formatting

---

*v1.1 Implementation Patterns*
*Researched: 2026-02-28*
