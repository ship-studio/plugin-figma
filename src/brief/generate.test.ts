import { describe, it, expect } from 'vitest';
import { generateBrief, estimateTokens, TOKEN_WARNING_THRESHOLD } from './generate';
import type { BriefInput } from './types';
import type { ExtractLayoutResult } from '../layout/extract';
import type { ExportResult } from '../assets/types';
import type { LayoutNode } from '../layout/types';
import type { DesignTokens } from '../tokens/types';

// ── Test helpers ──────────────────────────────────────────────────────

function makeTokens(overrides: Partial<DesignTokens> = {}): DesignTokens {
  return {
    colors: [],
    gradients: [],
    typography: [],
    spacing: [],
    borders: [],
    shadows: [],
    imageFills: [],
    components: [],
    ...overrides,
  };
}

function makeExtraction(
  rootNodes: LayoutNode[],
  tokens: Partial<DesignTokens> = {},
  nodeCount = 10,
): ExtractLayoutResult {
  return {
    extraction: { rootNodes, nodeCount, truncated: false },
    tokens: makeTokens(tokens),
    fileKey: 'abc123',
  };
}

function makeExportResult(overrides: Partial<ExportResult> = {}): ExportResult {
  return {
    assetsDir: '/Users/test/project/.shipstudio/assets',
    previewPath: '/Users/test/project/.shipstudio/assets/preview.png',
    assets: [
      { filename: 'icon-arrow.svg', path: '/Users/test/project/.shipstudio/assets/icon-arrow.svg', nodeId: '2:1', assetType: 'icon' },
      { filename: 'hero.png', path: '/Users/test/project/.shipstudio/assets/hero.png', nodeId: '2:2', assetType: 'image' },
    ],
    warnings: [],
    ...overrides,
  };
}

function makeInput(overrides: Partial<BriefInput> = {}): BriefInput {
  const rootNode: LayoutNode = {
    id: '1:1',
    name: 'Login Card',
    type: 'FRAME',
    visible: true,
    width: 400,
    height: 520,
    autoLayout: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: 24,
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      flexWrap: 'nowrap',
    },
    children: [
      {
        id: '1:2',
        name: 'Welcome Back',
        type: 'TEXT',
        visible: true,
        width: 200,
        height: 32,
        textContent: 'Welcome Back',
        textStyle: { fontFamily: 'Inter', fontSize: 24, fontWeight: 700 },
      },
      {
        id: '1:3',
        name: 'Button',
        type: 'INSTANCE',
        visible: true,
        width: 360,
        height: 48,
        componentRef: {
          componentId: 'c1',
          componentName: 'Button',
          isRemote: false,
          source: 'local',
          variantProperties: { variant: 'primary', size: 'large' },
        },
      },
    ],
  };

  return {
    extraction: makeExtraction(
      [rootNode],
      {
        colors: [
          { value: '#0066ff', name: 'Primary/Blue', usageCount: 5, nodeIds: ['1:1'], source: ['fill'] },
          { value: '#1a1a1a', name: 'Text/Primary', usageCount: 8, nodeIds: ['1:2'], source: ['fill'] },
        ],
        typography: [
          { fontFamily: 'Inter', fontSize: 24, fontWeight: 700, lineHeight: 32, letterSpacing: 0, name: 'Heading/Large', usageCount: 1, nodeIds: ['1:2'] },
          { fontFamily: 'Inter', fontSize: 14, fontWeight: 400, lineHeight: 20, letterSpacing: 0, name: 'Body/Regular', usageCount: 3, nodeIds: ['1:3'] },
        ],
        spacing: [
          { value: 24, usageCount: 1, sources: ['gap'] },
          { value: 32, usageCount: 1, sources: ['padding'] },
        ],
        components: [
          { componentName: 'Button', source: 'local', usageCount: 1, variantProperties: { variant: 'primary', size: 'large' } },
        ],
      },
      47,
    ),
    exportResult: makeExportResult(),
    projectPath: '/Users/test/project',
    fileName: 'Login Screen',
    figmaUrl: 'https://www.figma.com/design/abc123/Login',
    date: '2026-02-28',
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────

describe('estimateTokens', () => {
  it('returns Math.ceil(length / 4)', () => {
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('abcde')).toBe(2);
    expect(estimateTokens('')).toBe(0);
    expect(estimateTokens('a'.repeat(100))).toBe(25);
    expect(estimateTokens('a'.repeat(101))).toBe(26);
  });
});

describe('TOKEN_WARNING_THRESHOLD', () => {
  it('is 12000', () => {
    expect(TOKEN_WARNING_THRESHOLD).toBe(12000);
  });
});

describe('generateBrief', () => {
  // ── Full brief structure ────────────────────────────────────────

  describe('full brief structure', () => {
    it('produces markdown with all 7 sections in locked order', () => {
      const result = generateBrief(makeInput());

      // All sections present
      expect(result.markdown).toContain('# Design Brief');
      expect(result.markdown).toContain('## How to Use This Brief');
      expect(result.markdown).toContain('## Preview');
      expect(result.markdown).toContain('## Layout Tree');
      expect(result.markdown).toContain('## Design Tokens');
      expect(result.markdown).toContain('## Components');
      expect(result.markdown).toContain('## Assets');

      // Order is locked: metadata before instructions before preview before layout tree before tokens before components before assets
      const metadataIdx = result.markdown.indexOf('# Design Brief');
      const instructionsIdx = result.markdown.indexOf('## How to Use This Brief');
      const previewIdx = result.markdown.indexOf('## Preview');
      const layoutIdx = result.markdown.indexOf('## Layout Tree');
      const tokensIdx = result.markdown.indexOf('## Design Tokens');
      const componentsIdx = result.markdown.indexOf('## Components');
      const assetsIdx = result.markdown.indexOf('## Assets');

      expect(metadataIdx).toBeLessThan(instructionsIdx);
      expect(instructionsIdx).toBeLessThan(previewIdx);
      expect(previewIdx).toBeLessThan(layoutIdx);
      expect(layoutIdx).toBeLessThan(tokensIdx);
      expect(tokensIdx).toBeLessThan(componentsIdx);
      expect(componentsIdx).toBeLessThan(assetsIdx);
    });

    it('returns correct stats', () => {
      const result = generateBrief(makeInput());

      expect(result.stats.nodeCount).toBe(47);
      expect(result.stats.colorCount).toBe(2);
      expect(result.stats.fontCount).toBe(2);
      expect(result.stats.assetCount).toBe(2);
      expect(result.stats.estimatedTokens).toBe(result.estimatedTokens);
    });

    it('returns correct charCount and estimatedTokens', () => {
      const result = generateBrief(makeInput());

      expect(result.charCount).toBe(result.markdown.length);
      expect(result.estimatedTokens).toBe(Math.ceil(result.markdown.length / 4));
    });
  });

  // ── Instructions section ────────────────────────────────────────

  describe('instructions section', () => {
    it('has heading "## How to Use This Brief"', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('## How to Use This Brief');
    });

    it('appears after metadata and before preview', () => {
      const result = generateBrief(makeInput());
      const metadataIdx = result.markdown.indexOf('# Design Brief');
      const instructionsIdx = result.markdown.indexOf('## How to Use This Brief');
      const previewIdx = result.markdown.indexOf('## Preview');

      expect(instructionsIdx).toBeGreaterThan(metadataIdx);
      expect(instructionsIdx).toBeLessThan(previewIdx);
    });

    it('"Before building" stage mentions studying the brief before writing code', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toMatch(/Before building.*Read this brief/i);
      expect(result.markdown).toMatch(/Before building.*before writing any code/i);
    });

    it('"During building" stage references the Assets section as complete manifest with CSS/HTML directive', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toMatch(/During building.*Assets section/);
      expect(result.markdown).toMatch(/complete manifest of provided files/i);
      expect(result.markdown).toMatch(/built with CSS or HTML/i);
      // Must warn against substituting/fabricating (negative instruction)
      const duringLine = result.markdown.split('\n').find(l => l.includes('During building'));
      expect(duringLine).toBeDefined();
      expect(duringLine).toMatch(/rather than substituting or fabricating/i);
    });

    it('"After building" stage references the preview image and verifying tokens', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toMatch(/After building.*preview image/i);
      expect(result.markdown).toMatch(/After building.*token/i);
    });

    it('instructions are static: same content regardless of input data', () => {
      const result1 = generateBrief(makeInput());
      const result2 = generateBrief(makeInput({
        fileName: 'Different File',
        figmaUrl: 'https://www.figma.com/design/xyz/Other',
        date: '2020-01-01',
      }));

      // Extract instructions section from each
      const extractInstructions = (md: string) => {
        const start = md.indexOf('## How to Use This Brief');
        const afterStart = md.indexOf('\n## ', start + 1);
        return md.slice(start, afterStart);
      };

      expect(extractInstructions(result1.markdown)).toBe(extractInstructions(result2.markdown));
    });

    it('instructions are concise: no more than 10 lines total', () => {
      const result = generateBrief(makeInput());
      const start = result.markdown.indexOf('## How to Use This Brief');
      const afterStart = result.markdown.indexOf('\n## ', start + 1);
      const section = result.markdown.slice(start, afterStart);
      const lines = section.split('\n');
      // Heading + blank line + 3-5 instruction lines = max ~10 lines
      expect(lines.length).toBeLessThanOrEqual(10);
    });
  });

  // ── Metadata section ────────────────────────────────────────────

  describe('metadata section', () => {
    it('includes file name, frame name, date, and URL', () => {
      const result = generateBrief(makeInput());

      expect(result.markdown).toContain('**File:** Login Screen');
      expect(result.markdown).toContain('**Frame:** Login Card');
      expect(result.markdown).toContain('**Extracted:** 2026-02-28');
      expect(result.markdown).toContain('**Figma URL:** https://www.figma.com/design/abc123/Login');
    });

    it('uses provided date override', () => {
      const result = generateBrief(makeInput({ date: '2025-01-15' }));
      expect(result.markdown).toContain('**Extracted:** 2025-01-15');
    });
  });

  // ── Preview section ─────────────────────────────────────────────

  describe('preview section', () => {
    it('renders markdown image link with relative path', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('![Preview](.shipstudio/assets/preview.png)');
    });

    it('omits preview section when previewPath is empty', () => {
      const result = generateBrief(makeInput({
        exportResult: makeExportResult({ previewPath: '' }),
      }));
      expect(result.markdown).not.toContain('## Preview');
    });
  });

  // ── Layout tree section ─────────────────────────────────────────

  describe('layout tree section', () => {
    it('renders frame with auto-layout props', () => {
      const result = generateBrief(makeInput());
      // column, gap: 24, padding: 32 (uniform)
      expect(result.markdown).toContain("Frame 'Login Card' (column, gap: 24, padding: 32) 400x520");
    });

    it('renders nested children with deeper indentation', () => {
      const result = generateBrief(makeInput());
      const lines = result.markdown.split('\n');
      // Root at 0 indent, children at 2-space indent
      const textLine = lines.find(l => l.includes("Text 'Welcome Back'"));
      expect(textLine).toBeDefined();
      expect(textLine!.startsWith('  ')).toBe(true);
    });

    it('renders TEXT nodes with content and font info', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain("Text 'Welcome Back' (Inter 24/700)");
    });

    it('truncates text content at 200 chars with ellipsis', () => {
      const longText = 'A'.repeat(250);
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'Long', type: 'TEXT', visible: true,
            width: 300, height: 20,
            textContent: longText,
            textStyle: { fontFamily: 'Arial', fontSize: 14, fontWeight: 400 },
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain(`Text '${longText.slice(0, 200)}...'`);
    });

    it('renders INSTANCE nodes with component name', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('Instance "Button"');
    });

    it('renders INSTANCE with repeatCount > 1', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'List', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'ListItem', type: 'INSTANCE', visible: true,
            width: 300, height: 48,
            repeatCount: 5,
            componentRef: {
              componentId: 'c2', componentName: 'ListItem',
              isRemote: false, source: 'local',
            },
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('Instance "ListItem" x5 (repeated)');
    });

    it('renders INSTANCE with variant properties', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('(variant: primary, size: large)');
    });

    it('skips hidden nodes (visible: false)', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [
            {
              id: '1:2', name: 'Visible', type: 'FRAME', visible: true,
              width: 100, height: 50,
            },
            {
              id: '1:3', name: 'Hidden', type: 'FRAME', visible: false,
              width: 100, height: 50,
            },
          ],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain("Frame 'Visible'");
      expect(result.markdown).not.toContain("Frame 'Hidden'");
    });

    it('skips default auto-layout values', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Minimal', type: 'FRAME', visible: true,
          width: 200, height: 100,
          autoLayout: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 0,
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            flexWrap: 'nowrap',
          },
        }]),
      });
      const result = generateBrief(input);
      // Should only show "column" -- no gap, no justify, no align, no padding, no wrap
      expect(result.markdown).toContain("Frame 'Minimal' (column) 200x100");
    });

    it('renders ABSOLUTE positioning suffix', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'Overlay', type: 'FRAME', visible: true,
            width: 50, height: 50,
            positioning: 'ABSOLUTE',
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain("[absolute]");
    });

    it('renders symmetric padding as two values', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Sym', type: 'FRAME', visible: true,
          width: 200, height: 100,
          autoLayout: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 0,
            padding: { top: 16, right: 24, bottom: 16, left: 24 },
            flexWrap: 'nowrap',
          },
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('padding: 16 24');
    });

    it('renders 4-value padding when all different', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Asym', type: 'FRAME', visible: true,
          width: 200, height: 100,
          autoLayout: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 0,
            padding: { top: 4, right: 8, bottom: 12, left: 16 },
            flexWrap: 'nowrap',
          },
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('padding: 4 8 12 16');
    });

    it('shows wrap when flexWrap is wrap', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Wrapping', type: 'FRAME', visible: true,
          width: 200, height: 100,
          autoLayout: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 8,
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            flexWrap: 'wrap',
          },
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('wrap');
    });
  });

  // ── Design tokens section ───────────────────────────────────────

  describe('design tokens section', () => {
    it('renders colors table with Name | Value | Usage', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('### Colors');
      expect(result.markdown).toContain('| Name | Value | Usage |');
      expect(result.markdown).toContain('| Primary/Blue | #0066ff | 5 |');
      expect(result.markdown).toContain('| Text/Primary | #1a1a1a | 8 |');
    });

    it('renders typography table with correct columns', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('### Typography');
      expect(result.markdown).toContain('| Name | Font | Size | Weight | Line Height |');
      expect(result.markdown).toContain('| Heading/Large | Inter | 24px | 700 | 32px |');
    });

    it('renders typography with null line height as auto', () => {
      const input = makeInput({
        extraction: makeExtraction([], {
          typography: [
            { fontFamily: 'Inter', fontSize: 16, fontWeight: 400, lineHeight: null, letterSpacing: 0, name: 'Body', usageCount: 1, nodeIds: ['1:1'] },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| Body | Inter | 16px | 400 | auto |');
    });

    it('renders spacing table with Value | Sources | Usage', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('### Spacing');
      expect(result.markdown).toContain('| Value | Sources | Usage |');
      expect(result.markdown).toContain('| 24px | gap | 1 |');
    });

    it('omits shadows subsection when no shadows exist', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).not.toContain('### Shadows');
    });

    it('renders shadows subsection when shadows exist', () => {
      const input = makeInput({
        extraction: makeExtraction([], {
          shadows: [
            { type: 'drop-shadow', color: 'rgba(0,0,0,0.1)', offsetX: 0, offsetY: 2, blur: 8, spread: 0, name: 'shadow-1', usageCount: 1, nodeIds: ['1:1'] },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('### Shadows');
      expect(result.markdown).toContain('| Name | Type | Value | Usage |');
      expect(result.markdown).toContain('| shadow-1 | drop-shadow | 0px 2px 8px 0px rgba(0,0,0,0.1) | 1 |');
    });

    it('omits gradients subsection when no gradients exist', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).not.toContain('### Gradients');
    });

    it('renders gradients subsection when gradients exist', () => {
      const input = makeInput({
        extraction: makeExtraction([], {
          gradients: [
            { value: 'linear-gradient(135deg, #fff 0%, #000 100%)', name: 'gradient-1', gradientType: 'GRADIENT_LINEAR', usageCount: 2, nodeIds: ['1:1'] },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('### Gradients');
      expect(result.markdown).toContain('| Name | Value | Usage |');
      expect(result.markdown).toContain('| gradient-1 | linear-gradient(135deg, #fff 0%, #000 100%) | 2 |');
    });

    it('renders borders subsection when borders exist', () => {
      const input = makeInput({
        extraction: makeExtraction([], {
          borders: [
            { radius: 8, cornerRadii: null, strokeColor: null, strokeWeight: null, name: 'border-1', usageCount: 3, nodeIds: ['1:1'] },
            { radius: 4, cornerRadii: null, strokeColor: '#cccccc', strokeWeight: 1, name: 'border-2', usageCount: 2, nodeIds: ['1:2'] },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('### Borders');
      expect(result.markdown).toContain('| Name | Radius | Stroke | Usage |');
      expect(result.markdown).toContain('| border-1 | 8px | -- | 3 |');
      expect(result.markdown).toContain('| border-2 | 4px | 1px #cccccc | 2 |');
    });

    it('omits borders subsection when no borders exist', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).not.toContain('### Borders');
    });
  });

  // ── Components section ──────────────────────────────────────────

  describe('components section', () => {
    it('renders components table with correct columns', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('## Components');
      expect(result.markdown).toContain('| Component | Source | Variants | Usage |');
      expect(result.markdown).toContain('| Button | local | variant: primary, size: large | 1 |');
    });

    it('uses -- for components with no variant properties', () => {
      const input = makeInput({
        extraction: makeExtraction([], {
          components: [
            { componentName: 'Icon', source: 'library', usageCount: 4 },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| Icon | library | -- | 4 |');
    });

    it('omits components section when no components exist', () => {
      const input = makeInput({
        extraction: makeExtraction([], { components: [] }),
      });
      const result = generateBrief(input);
      expect(result.markdown).not.toContain('## Components');
    });
  });

  // ── Assets section ──────────────────────────────────────────────

  describe('assets section', () => {
    it('renders 4-column assets table header with Usage column', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('## Assets');
      expect(result.markdown).toContain('| File | Type | Usage | Path |');
    });

    it('renders preview row with "Full-page preview screenshot" usage', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('| preview.png | Preview | Full-page preview screenshot | .shipstudio/assets/preview.png |');
    });

    it('renders Icon type for svg assets', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('| icon-arrow.svg | Icon |');
    });

    it('renders Image type for image assets', () => {
      const result = generateBrief(makeInput());
      expect(result.markdown).toContain('| hero.png | Image |');
    });

    it('renders breadcrumb location from rootNodes', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Hero Section', type: 'FRAME', visible: true,
        children: [
          { id: '2:1', name: 'Header', type: 'FRAME', visible: true,
            children: [
              { id: '3:1', name: 'ArrowIcon', type: 'VECTOR', visible: true },
            ],
          },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            { filename: 'arrow-icon.svg', path: '/Users/test/project/.shipstudio/assets/arrow-icon.svg', nodeId: '3:1', assetType: 'icon' },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| arrow-icon.svg | Icon | Icon in Hero Section > Header > ArrowIcon | .shipstudio/assets/arrow-icon.svg |');
    });

    it('renders plain type usage when nodeId has no breadcrumb match', () => {
      const input = makeInput({
        exportResult: makeExportResult({
          assets: [
            { filename: 'orphan.svg', path: '/Users/test/project/.shipstudio/assets/orphan.svg', nodeId: 'no-match', assetType: 'icon' },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| orphan.svg | Icon | Icon | .shipstudio/assets/orphan.svg |');
    });

    it('renders "Asset" usage when asset has no nodeId and no type', () => {
      const input = makeInput({
        exportResult: makeExportResult({
          assets: [
            { filename: 'legacy.svg', path: '/Users/test/project/.shipstudio/assets/legacy.svg' },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| legacy.svg | File | Asset |');
    });

    it('strips projectPath prefix from asset paths', () => {
      const result = generateBrief(makeInput());
      // Should NOT contain absolute paths
      expect(result.markdown).not.toContain('/Users/test/project/.shipstudio');
    });

    it('omits assets section when no assets and no preview', () => {
      const input = makeInput({
        exportResult: makeExportResult({ previewPath: '', assets: [] }),
      });
      const result = generateBrief(input);
      expect(result.markdown).not.toContain('## Assets');
    });
  });

  // ── Instance child image cross-referencing ─────────────────────

  describe('instance child image cross-referencing', () => {
    it('annotates instance line with -> child-image.png when child asset has matching parentInstanceId', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Card Section', type: 'FRAME', visible: true,
        children: [
          {
            id: '20:1', name: 'Card Instance', type: 'INSTANCE', visible: true,
            width: 300, height: 400,
            componentRef: {
              componentId: 'comp-card', componentName: 'Card',
              isRemote: false, source: 'local',
            },
          },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            {
              filename: 'hero-image.png',
              path: '/Users/test/project/.shipstudio/assets/hero-image.png',
              nodeId: 'I20:1;20:2',
              assetType: 'image',
              parentInstanceId: '20:1',
            },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('Instance "Card"');
      expect(result.markdown).toContain('-> hero-image.png');
    });

    it('preserves existing behavior: instance shows -> button.png for direct asset match', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Section', type: 'FRAME', visible: true,
        children: [
          {
            id: '21:1', name: 'Button', type: 'INSTANCE', visible: true,
            width: 200, height: 48,
            componentRef: {
              componentId: 'comp-btn', componentName: 'Button',
              isRemote: false, source: 'local',
            },
          },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            {
              filename: 'button.png',
              path: '/Users/test/project/.shipstudio/assets/button.png',
              nodeId: '21:1',
              assetType: 'image',
            },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('Instance "Button" -> button.png');
    });

    it('shows breadcrumb for instance child image in Assets table via parentInstanceId fallback', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Hero Section', type: 'FRAME', visible: true,
        children: [
          {
            id: '22:1', name: 'Product Card', type: 'INSTANCE', visible: true,
            width: 300, height: 400,
            componentRef: {
              componentId: 'comp-pcard', componentName: 'ProductCard',
              isRemote: false, source: 'local',
            },
          },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            {
              filename: 'product-photo.png',
              path: '/Users/test/project/.shipstudio/assets/product-photo.png',
              nodeId: 'I22:1;22:2',
              assetType: 'image',
              parentInstanceId: '22:1',
            },
          ],
        }),
      });
      const result = generateBrief(input);
      // The child node I22:1;22:2 is NOT in the normalized tree, so direct lookup fails.
      // Fallback via parentInstanceId: breadcrumb of 22:1 -> "Hero Section > Product Card"
      expect(result.markdown).toContain('| product-photo.png | Image | Image in Hero Section > Product Card |');
    });
  });

  // ── Asset usage context ────────────────────────────────────────

  describe('asset usage context', () => {
    it('derives "Icon in {location}" for icon assets with breadcrumb', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Header', type: 'FRAME', visible: true,
        children: [
          { id: '2:1', name: 'NavIcon', type: 'VECTOR', visible: true },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            { filename: 'nav.svg', path: '/Users/test/project/.shipstudio/assets/nav.svg', nodeId: '2:1', assetType: 'icon' },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| nav.svg | Icon | Icon in Header > NavIcon |');
    });

    it('derives "Image in {location}" for image assets with breadcrumb', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Hero', type: 'FRAME', visible: true,
        children: [
          { id: '2:1', name: 'Banner', type: 'RECTANGLE', visible: true },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            { filename: 'banner.png', path: '/Users/test/project/.shipstudio/assets/banner.png', nodeId: '2:1', assetType: 'image' },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| banner.png | Image | Image in Hero > Banner |');
    });

    it('derives "Icon" for icon assets without breadcrumb match', () => {
      const input = makeInput({
        exportResult: makeExportResult({
          assets: [
            { filename: 'close.svg', path: '/Users/test/project/.shipstudio/assets/close.svg', nodeId: 'no-match', assetType: 'icon' },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| close.svg | Icon | Icon |');
    });

    it('derives "Image" for image assets without breadcrumb match', () => {
      const input = makeInput({
        exportResult: makeExportResult({
          assets: [
            { filename: 'photo.png', path: '/Users/test/project/.shipstudio/assets/photo.png', nodeId: 'no-match', assetType: 'image' },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| photo.png | Image | Image |');
    });

    it('derives "Asset" for assets with no type and no breadcrumb', () => {
      const input = makeInput({
        exportResult: makeExportResult({
          assets: [
            { filename: 'unknown.bin', path: '/Users/test/project/.shipstudio/assets/unknown.bin' },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| unknown.bin | File | Asset |');
    });

    it('preview row shows "Full-page preview screenshot" usage', () => {
      const input = makeInput({
        exportResult: makeExportResult({ assets: [] }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| preview.png | Preview | Full-page preview screenshot |');
    });
  });

  // ── Empty sections ──────────────────────────────────────────────

  describe('empty sections', () => {
    it('omits components and optional token subsections when empty', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
        }], {
          colors: [],
          typography: [],
          spacing: [],
          borders: [],
          shadows: [],
          gradients: [],
          components: [],
        }),
        exportResult: makeExportResult({ previewPath: '', assets: [] }),
      });
      const result = generateBrief(input);

      // These sections should be absent
      expect(result.markdown).not.toContain('## Components');
      expect(result.markdown).not.toContain('## Assets');
      expect(result.markdown).not.toContain('### Colors');
      expect(result.markdown).not.toContain('### Typography');
      expect(result.markdown).not.toContain('### Spacing');
      expect(result.markdown).not.toContain('### Borders');
      expect(result.markdown).not.toContain('### Shadows');
      expect(result.markdown).not.toContain('### Gradients');
    });

    it('omits Design Tokens heading when all token types are empty', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
        }], {
          colors: [],
          typography: [],
          spacing: [],
          borders: [],
          shadows: [],
          gradients: [],
          components: [],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).not.toContain('## Design Tokens');
    });
  });

  // ── Spacing & flex-child brief output (Phase 13) ────────────────

  describe('spacing and flex-child brief output', () => {
    it('renders absolute offset after [absolute] tag', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'Badge', type: 'FRAME', visible: true,
            width: 50, height: 50,
            positioning: 'ABSOLUTE',
            absoluteOffset: { top: 16, left: 24 },
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('[absolute] top:16 left:24');
    });

    it('renders [absolute] without offset when absoluteOffset is missing (existing behavior)', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'Overlay', type: 'FRAME', visible: true,
            width: 50, height: 50,
            positioning: 'ABSOLUTE',
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('[absolute]');
      expect(result.markdown).not.toContain('top:');
    });

    it('renders flex-grow:1 in inline styles when layoutGrow is 1', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'Title', type: 'TEXT', visible: true,
            width: 800, height: 60,
            textContent: 'Title',
            textStyle: { fontFamily: 'Inter', fontSize: 48, fontWeight: 700 },
            layoutGrow: 1,
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('flex-grow:1');
    });

    it('renders align-self:stretch in inline styles when layoutAlign is STRETCH', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'Content Row', type: 'FRAME', visible: true,
            width: 800, height: 400,
            layoutAlign: 'STRETCH',
            children: [],
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('align-self:stretch');
    });

    it('renders both flex-grow:1 and align-self:stretch when both present', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'Expanding', type: 'FRAME', visible: true,
            width: 800, height: 400,
            layoutGrow: 1,
            layoutAlign: 'STRETCH',
            children: [],
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('flex-grow:1');
      expect(result.markdown).toContain('align-self:stretch');
    });

    it('does not render flex-grow or align-self when properties are absent', () => {
      const input = makeInput({
        extraction: makeExtraction([{
          id: '1:1', name: 'Root', type: 'FRAME', visible: true,
          children: [{
            id: '1:2', name: 'Plain', type: 'FRAME', visible: true,
            width: 200, height: 100,
            children: [],
          }],
        }]),
      });
      const result = generateBrief(input);
      expect(result.markdown).not.toContain('flex-grow');
      expect(result.markdown).not.toContain('align-self');
    });
  });

  // ── Manual asset cross-referencing (Phase 18) ─────────────────

  describe('manual asset cross-referencing (Phase 18)', () => {
    it('maps manual asset to tree node via direct nodeId match', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Page', type: 'FRAME', visible: true,
        children: [
          {
            id: '2:1', name: 'Hero', type: 'FRAME', visible: true,
            children: [
              {
                id: '3:1', name: 'Icons', type: 'FRAME', visible: true,
                children: [
                  { id: '5:1', name: 'StarIcon', type: 'VECTOR', visible: true },
                ],
              },
            ],
          },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            {
              filename: 'star.svg',
              path: '/Users/test/project/.shipstudio/assets/star.svg',
              nodeId: '5:1',
              assetType: 'icon',
            },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| star.svg | Icon | Icon in Page > Hero > Icons > StarIcon |');
    });

    it('maps manual asset to INSTANCE node with tree annotation', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Nav Bar', type: 'FRAME', visible: true,
        children: [
          {
            id: '10:1', name: 'Logo', type: 'INSTANCE', visible: true,
            width: 120, height: 40,
            componentRef: {
              componentId: 'comp-logo', componentName: 'Logo',
              isRemote: false, source: 'local',
            },
          },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            {
              filename: 'logo.png',
              path: '/Users/test/project/.shipstudio/assets/logo.png',
              nodeId: '10:1',
              assetType: 'image',
            },
          ],
        }),
      });
      const result = generateBrief(input);
      // Assets table: usage via breadcrumb
      expect(result.markdown).toContain('| logo.png | Image | Image in Nav Bar > Logo |');
      // Layout tree: instance annotation
      expect(result.markdown).toContain('Instance "Logo" -> logo.png');
    });

    it('shows Icon for SVG and Image for PNG type labels with no legacy labels', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Root', type: 'FRAME', visible: true,
        children: [
          { id: '4:1', name: 'Arrow', type: 'VECTOR', visible: true },
          { id: '4:2', name: 'Banner', type: 'RECTANGLE', visible: true },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            {
              filename: 'arrow.svg',
              path: '/Users/test/project/.shipstudio/assets/arrow.svg',
              nodeId: '4:1',
              assetType: 'icon',
            },
            {
              filename: 'banner.png',
              path: '/Users/test/project/.shipstudio/assets/banner.png',
              nodeId: '4:2',
              assetType: 'image',
            },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| Icon |');
      expect(result.markdown).toContain('| Image |');
      // No legacy type labels
      expect(result.markdown).not.toMatch(/\| Composition \|/);
      expect(result.markdown).not.toMatch(/\| Illustration \|/);
      expect(result.markdown).not.toMatch(/\| Component \|/);
    });

    it('shows -- for I-prefix instance-child nodeId without parentInstanceId', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Page', type: 'FRAME', visible: true,
        children: [
          {
            id: '20:1', name: 'Card', type: 'INSTANCE', visible: true,
            width: 300, height: 400,
            componentRef: {
              componentId: 'comp-card', componentName: 'Card',
              isRemote: false, source: 'local',
            },
          },
        ],
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            {
              filename: 'card-bg.png',
              path: '/Users/test/project/.shipstudio/assets/card-bg.png',
              nodeId: 'I20:1;20:2',
              assetType: 'image',
              // No parentInstanceId -- manual assets don't have it
            },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| card-bg.png | Image | Image |');
    });

    it('shows -- for nodeId with no tree match', () => {
      const rootNode: LayoutNode = {
        id: '1:1', name: 'Root', type: 'FRAME', visible: true,
      };
      const input = makeInput({
        extraction: makeExtraction([rootNode]),
        exportResult: makeExportResult({
          assets: [
            {
              filename: 'mystery.svg',
              path: '/Users/test/project/.shipstudio/assets/mystery.svg',
              nodeId: '999:999',
              assetType: 'icon',
            },
          ],
        }),
      });
      const result = generateBrief(input);
      expect(result.markdown).toContain('| mystery.svg | Icon | Icon |');
    });
  });
});
