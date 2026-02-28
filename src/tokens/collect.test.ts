import { describe, it, expect } from 'vitest';
import { collectTokens } from './collect';
import type { DesignTokens } from './types';
import type { LayoutNode } from '../layout/types';

// ────────────────────────────────────────────────────────────────────
// Helper functions to build mock LayoutNodes
// ────────────────────────────────────────────────────────────────────

let nodeIdCounter = 0;
function makeNode(overrides: Partial<LayoutNode> = {}): LayoutNode {
  nodeIdCounter++;
  return {
    id: `node-${nodeIdCounter}`,
    name: `Node ${nodeIdCounter}`,
    type: 'FRAME',
    visible: true,
    ...overrides,
  };
}

function makeTextNode(
  textStyle: any,
  overrides: Partial<LayoutNode> = {},
): LayoutNode {
  return makeNode({
    type: 'TEXT',
    textContent: 'Sample text',
    textStyle,
    ...overrides,
  });
}

function solidFill(
  r: number, g: number, b: number, a = 1,
  opts: { visible?: boolean } = {},
): any {
  return {
    type: 'SOLID',
    color: { r, g, b, a },
    visible: opts.visible ?? true,
  };
}

function gradientFill(
  type = 'GRADIENT_LINEAR',
  opts: { visible?: boolean } = {},
): any {
  return {
    type,
    visible: opts.visible ?? true,
    gradientHandlePositions: [
      { x: 0, y: 0.5 },
      { x: 1, y: 0.5 },
      { x: 0, y: 0 },
    ],
    gradientStops: [
      { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
      { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
    ],
  };
}

function imageFill(imageRef = 'img:abc', scaleMode = 'FILL'): any {
  return {
    type: 'IMAGE',
    visible: true,
    imageRef,
    scaleMode,
  };
}

function dropShadow(
  overrides: Partial<{
    color: { r: number; g: number; b: number; a: number };
    offset: { x: number; y: number };
    radius: number;
    spread: number;
    visible: boolean;
  }> = {},
): any {
  return {
    type: 'DROP_SHADOW',
    visible: overrides.visible ?? true,
    color: overrides.color ?? { r: 0, g: 0, b: 0, a: 0.25 },
    offset: overrides.offset ?? { x: 0, y: 4 },
    radius: overrides.radius ?? 8,
    spread: overrides.spread ?? 0,
  };
}

function innerShadow(
  overrides: Partial<{
    color: { r: number; g: number; b: number; a: number };
    offset: { x: number; y: number };
    radius: number;
    spread: number;
    visible: boolean;
  }> = {},
): any {
  return {
    type: 'INNER_SHADOW',
    visible: overrides.visible ?? true,
    color: overrides.color ?? { r: 0, g: 0, b: 0, a: 0.1 },
    offset: overrides.offset ?? { x: 0, y: 2 },
    radius: overrides.radius ?? 4,
    spread: overrides.spread ?? 0,
  };
}

// Reset counter between tests
import { beforeEach } from 'vitest';
beforeEach(() => {
  nodeIdCounter = 0;
});

// ────────────────────────────────────────────────────────────────────
// Color extraction
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - colors', () => {
  it('extracts a solid fill as a color token', () => {
    const root = makeNode({
      fills: [solidFill(1, 0, 0, 1)],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.colors).toHaveLength(1);
    expect(tokens.colors[0].value).toBe('#ff0000');
    expect(tokens.colors[0].usageCount).toBe(1);
    expect(tokens.colors[0].source).toContain('fill');
  });

  it('deduplicates same color from two nodes', () => {
    const node1 = makeNode({ fills: [solidFill(1, 0, 0, 1)] });
    const node2 = makeNode({ fills: [solidFill(1, 0, 0, 1)] });
    const root = makeNode({ children: [node1, node2] });
    const tokens = collectTokens([root], {});
    const reds = tokens.colors.filter((c) => c.value === '#ff0000');
    expect(reds).toHaveLength(1);
    expect(reds[0].usageCount).toBe(2);
    expect(reds[0].nodeIds).toContain(node1.id);
    expect(reds[0].nodeIds).toContain(node2.id);
  });

  it('extracts semi-transparent color as rgba', () => {
    const root = makeNode({
      fills: [solidFill(1, 1, 1, 0.5)],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.colors[0].value).toBe('rgba(255, 255, 255, 0.5)');
  });

  it('skips invisible paints', () => {
    const root = makeNode({
      fills: [solidFill(1, 0, 0, 1, { visible: false })],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.colors).toHaveLength(0);
  });

  it('extracts stroke color with source "stroke"', () => {
    const root = makeNode({
      strokes: [solidFill(0, 0, 0, 1)],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.colors).toHaveLength(1);
    expect(tokens.colors[0].value).toBe('#000000');
    expect(tokens.colors[0].source).toContain('stroke');
  });

  it('merges fill and stroke sources for same color from different nodes', () => {
    const node1 = makeNode({ fills: [solidFill(1, 0, 0, 1)] });
    const node2 = makeNode({ strokes: [solidFill(1, 0, 0, 1)] });
    const root = makeNode({ children: [node1, node2] });
    const tokens = collectTokens([root], {});
    const reds = tokens.colors.filter((c) => c.value === '#ff0000');
    expect(reds).toHaveLength(1);
    expect(reds[0].source).toContain('fill');
    expect(reds[0].source).toContain('stroke');
  });

  it('sorts colors by usageCount descending', () => {
    const n1 = makeNode({ fills: [solidFill(1, 0, 0, 1)] });
    const n2 = makeNode({ fills: [solidFill(0, 0, 1, 1)] });
    const n3 = makeNode({ fills: [solidFill(0, 0, 1, 1)] });
    const n4 = makeNode({ fills: [solidFill(0, 0, 1, 1)] });
    const root = makeNode({ children: [n1, n2, n3, n4] });
    const tokens = collectTokens([root], {});
    expect(tokens.colors[0].value).toBe('#0000ff'); // 3 uses
    expect(tokens.colors[1].value).toBe('#ff0000'); // 1 use
  });
});

// ────────────────────────────────────────────────────────────────────
// Gradient extraction
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - gradients', () => {
  it('extracts a linear gradient from fills', () => {
    const root = makeNode({
      fills: [gradientFill('GRADIENT_LINEAR')],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.gradients).toHaveLength(1);
    expect(tokens.gradients[0].value).toContain('linear-gradient');
    expect(tokens.gradients[0].gradientType).toBe('GRADIENT_LINEAR');
    expect(tokens.gradients[0].usageCount).toBe(1);
  });
});

// ────────────────────────────────────────────────────────────────────
// Image fill extraction
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - imageFills', () => {
  it('extracts image fill with ref and scale mode', () => {
    const root = makeNode({
      name: 'Hero Image',
      fills: [imageFill('img:abc', 'FILL')],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.imageFills).toHaveLength(1);
    expect(tokens.imageFills[0].imageRef).toBe('img:abc');
    expect(tokens.imageFills[0].scaleMode).toBe('FILL');
    expect(tokens.imageFills[0].nodeName).toBe('Hero Image');
  });

  it('does not produce a color token for IMAGE fill', () => {
    const root = makeNode({
      fills: [imageFill('img:abc', 'FILL')],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.colors).toHaveLength(0);
    expect(tokens.imageFills).toHaveLength(1);
  });
});

// ────────────────────────────────────────────────────────────────────
// Typography extraction
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - typography', () => {
  it('extracts typography from TEXT node textStyle', () => {
    const root = makeTextNode({
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 600,
      lineHeightPx: 24,
      letterSpacing: 0,
    });
    const tokens = collectTokens([root], {});
    expect(tokens.typography).toHaveLength(1);
    expect(tokens.typography[0].fontFamily).toBe('Inter');
    expect(tokens.typography[0].fontSize).toBe(16);
    expect(tokens.typography[0].fontWeight).toBe(600);
    expect(tokens.typography[0].lineHeight).toBe(24);
    expect(tokens.typography[0].letterSpacing).toBe(0);
  });

  it('deduplicates identical text styles', () => {
    const style = {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 600,
      lineHeightPx: 24,
      letterSpacing: 0,
    };
    const n1 = makeTextNode(style);
    const n2 = makeTextNode(style);
    const root = makeNode({ children: [n1, n2] });
    const tokens = collectTokens([root], {});
    expect(tokens.typography).toHaveLength(1);
    expect(tokens.typography[0].usageCount).toBe(2);
  });

  it('creates separate tokens for different text styles', () => {
    const n1 = makeTextNode({
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 400,
      lineHeightPx: 24,
      letterSpacing: 0,
    });
    const n2 = makeTextNode({
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 700,
      lineHeightPx: 32,
      letterSpacing: 0,
    });
    const root = makeNode({ children: [n1, n2] });
    const tokens = collectTokens([root], {});
    expect(tokens.typography).toHaveLength(2);
  });

  it('extracts text style overrides as separate tokens', () => {
    const n = makeTextNode(
      {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 400,
        lineHeightPx: 24,
        letterSpacing: 0,
      },
      {
        textStyleOverrides: {
          '0': {
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: 700,
            lineHeightPx: 28,
            letterSpacing: 0.5,
          },
        },
      },
    );
    const root = makeNode({ children: [n] });
    const tokens = collectTokens([root], {});
    expect(tokens.typography.length).toBeGreaterThanOrEqual(2);
  });

  it('uses null for lineHeight when lineHeightPx is undefined', () => {
    const root = makeTextNode({
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 400,
      letterSpacing: 0,
      // lineHeightPx intentionally omitted
    });
    const tokens = collectTokens([root], {});
    expect(tokens.typography[0].lineHeight).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────────────
// Spacing extraction
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - spacing', () => {
  it('extracts spacing from auto-layout padding and gap', () => {
    const root = makeNode({
      autoLayout: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 8,
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
        flexWrap: 'nowrap',
      },
    });
    const tokens = collectTokens([root], {});
    const values = tokens.spacing.map((s) => s.value);
    expect(values).toContain(8);
    expect(values).toContain(16);
  });

  it('deduplicates symmetric padding into one token', () => {
    const root = makeNode({
      autoLayout: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 0,
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
        flexWrap: 'nowrap',
      },
    });
    const tokens = collectTokens([root], {});
    // Only one spacing token for value 16 (not 4 duplicates)
    const sixteens = tokens.spacing.filter((s) => s.value === 16);
    expect(sixteens).toHaveLength(1);
  });

  it('increments usageCount for same gap value across nodes', () => {
    const n1 = makeNode({
      autoLayout: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 8,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        flexWrap: 'nowrap',
      },
    });
    const n2 = makeNode({
      autoLayout: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 8,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        flexWrap: 'nowrap',
      },
    });
    const root = makeNode({ children: [n1, n2] });
    const tokens = collectTokens([root], {});
    const eights = tokens.spacing.filter((s) => s.value === 8);
    expect(eights).toHaveLength(1);
    expect(eights[0].usageCount).toBe(2);
  });

  it('includes rowGap as spacing token', () => {
    const root = makeNode({
      autoLayout: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 8,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        flexWrap: 'wrap',
        rowGap: 12,
      },
    });
    const tokens = collectTokens([root], {});
    const values = tokens.spacing.map((s) => s.value);
    expect(values).toContain(12);
  });

  it('does not include zero values as spacing tokens', () => {
    const root = makeNode({
      autoLayout: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 0,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        flexWrap: 'nowrap',
      },
    });
    const tokens = collectTokens([root], {});
    expect(tokens.spacing).toHaveLength(0);
  });

  it('sorts spacing by value ascending', () => {
    const n1 = makeNode({
      autoLayout: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 24,
        padding: { top: 8, right: 16, bottom: 8, left: 16 },
        flexWrap: 'nowrap',
      },
    });
    const root = makeNode({ children: [n1] });
    const tokens = collectTokens([root], {});
    const values = tokens.spacing.map((s) => s.value);
    // Should be [8, 16, 24] ascending
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });
});

// ────────────────────────────────────────────────────────────────────
// Border extraction
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - borders', () => {
  it('extracts border with cornerRadius and stroke', () => {
    const root = makeNode({
      cornerRadius: 8,
      strokes: [solidFill(0, 0, 0, 1)],
      strokeWeight: 1,
    });
    const tokens = collectTokens([root], {});
    expect(tokens.borders).toHaveLength(1);
    expect(tokens.borders[0].radius).toBe(8);
    expect(tokens.borders[0].strokeColor).toBe('#000000');
    expect(tokens.borders[0].strokeWeight).toBe(1);
  });

  it('extracts per-corner radii with cornerRadii', () => {
    const root = makeNode({
      rectangleCornerRadii: [4, 4, 8, 8],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.borders).toHaveLength(1);
    expect(tokens.borders[0].cornerRadii).toEqual([4, 4, 8, 8]);
    expect(tokens.borders[0].radius).toBeNull();
  });

  it('extracts cornerRadius without strokes', () => {
    const root = makeNode({
      cornerRadius: 8,
    });
    const tokens = collectTokens([root], {});
    expect(tokens.borders).toHaveLength(1);
    expect(tokens.borders[0].radius).toBe(8);
    expect(tokens.borders[0].strokeColor).toBeNull();
    expect(tokens.borders[0].strokeWeight).toBeNull();
  });

  it('deduplicates identical borders', () => {
    const n1 = makeNode({ cornerRadius: 8 });
    const n2 = makeNode({ cornerRadius: 8 });
    const root = makeNode({ children: [n1, n2] });
    const tokens = collectTokens([root], {});
    expect(tokens.borders).toHaveLength(1);
    expect(tokens.borders[0].usageCount).toBe(2);
  });
});

// ────────────────────────────────────────────────────────────────────
// Shadow extraction
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - shadows', () => {
  it('extracts a drop shadow', () => {
    const root = makeNode({
      effects: [dropShadow()],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.shadows).toHaveLength(1);
    expect(tokens.shadows[0].type).toBe('drop-shadow');
    expect(tokens.shadows[0].offsetX).toBe(0);
    expect(tokens.shadows[0].offsetY).toBe(4);
    expect(tokens.shadows[0].blur).toBe(8);
    expect(tokens.shadows[0].spread).toBe(0);
  });

  it('extracts an inner shadow', () => {
    const root = makeNode({
      effects: [innerShadow()],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.shadows).toHaveLength(1);
    expect(tokens.shadows[0].type).toBe('inner-shadow');
  });

  it('skips invisible effects', () => {
    const root = makeNode({
      effects: [dropShadow({ visible: false })],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.shadows).toHaveLength(0);
  });

  it('ignores non-shadow effects (LAYER_BLUR, BACKGROUND_BLUR)', () => {
    const root = makeNode({
      effects: [
        { type: 'LAYER_BLUR', visible: true, radius: 4 },
        { type: 'BACKGROUND_BLUR', visible: true, radius: 8 },
      ],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.shadows).toHaveLength(0);
  });

  it('deduplicates identical shadows', () => {
    const n1 = makeNode({ effects: [dropShadow()] });
    const n2 = makeNode({ effects: [dropShadow()] });
    const root = makeNode({ children: [n1, n2] });
    const tokens = collectTokens([root], {});
    expect(tokens.shadows).toHaveLength(1);
    expect(tokens.shadows[0].usageCount).toBe(2);
  });
});

// ────────────────────────────────────────────────────────────────────
// Component inventory
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - components', () => {
  it('creates component entry from INSTANCE node', () => {
    const root = makeNode({
      children: [
        makeNode({
          type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-1',
            componentName: 'Button',
            isRemote: false,
            source: 'local',
          },
        }),
      ],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.components).toHaveLength(1);
    expect(tokens.components[0].componentName).toBe('Button');
    expect(tokens.components[0].source).toBe('local');
    expect(tokens.components[0].usageCount).toBe(1);
  });

  it('sums usageCount for multiple instances of same component', () => {
    const root = makeNode({
      children: [
        makeNode({
          type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-1',
            componentName: 'Button',
            isRemote: false,
            source: 'local',
          },
        }),
        makeNode({
          type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-1',
            componentName: 'Button',
            isRemote: false,
            source: 'local',
          },
        }),
      ],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.components).toHaveLength(1);
    expect(tokens.components[0].usageCount).toBe(2);
  });

  it('uses repeatCount in usageCount accumulation', () => {
    const root = makeNode({
      children: [
        makeNode({
          type: 'INSTANCE',
          repeatCount: 5,
          componentRef: {
            componentId: 'comp-1',
            componentName: 'ListItem',
            isRemote: false,
            source: 'local',
          },
        }),
      ],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.components[0].usageCount).toBe(5);
  });

  it('includes description in component entry', () => {
    const root = makeNode({
      children: [
        makeNode({
          type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-1',
            componentName: 'Button',
            description: 'Primary button component',
            isRemote: false,
            source: 'local',
          },
        }),
      ],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.components[0].description).toBe('Primary button component');
  });

  it('includes variant properties in component entry', () => {
    const root = makeNode({
      children: [
        makeNode({
          type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-1',
            componentName: 'Button',
            isRemote: false,
            source: 'local',
            variantProperties: { size: 'large', disabled: false },
          },
        }),
      ],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.components[0].variantProperties).toEqual({ size: 'large', disabled: false });
  });

  it('tags library components correctly', () => {
    const root = makeNode({
      children: [
        makeNode({
          type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-1',
            componentName: 'Icon',
            isRemote: true,
            source: 'library',
          },
        }),
      ],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.components[0].source).toBe('library');
  });
});

// ────────────────────────────────────────────────────────────────────
// Named style resolution
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - named styles', () => {
  it('resolves fill style name from stylesMap', () => {
    const root = makeNode({
      fills: [solidFill(1, 0, 0, 1)],
      styleRefs: { fill: 'S:abc' },
    });
    const stylesMap = {
      'S:abc': { name: 'Brand/Primary', styleType: 'FILL' },
    };
    const tokens = collectTokens([root], stylesMap);
    expect(tokens.colors[0].name).toBe('Brand/Primary');
  });

  it('auto-generates name when no styleRef exists', () => {
    const root = makeNode({
      fills: [solidFill(1, 0, 0, 1)],
    });
    const tokens = collectTokens([root], {});
    expect(tokens.colors[0].name).toBe('color-ff0000');
  });

  it('resolves text style name from stylesMap', () => {
    const root = makeTextNode(
      {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 400,
        lineHeightPx: 24,
        letterSpacing: 0,
      },
      {
        styleRefs: { text: 'S:text1' },
      },
    );
    const stylesMap = {
      'S:text1': { name: 'Heading/H3', styleType: 'TEXT' },
    };
    const tokens = collectTokens([root], stylesMap);
    expect(tokens.typography[0].name).toBe('Heading/H3');
  });
});

// ────────────────────────────────────────────────────────────────────
// Edge cases
// ────────────────────────────────────────────────────────────────────

describe('collectTokens - edge cases', () => {
  it('returns empty arrays for empty tree', () => {
    const tokens = collectTokens([], {});
    expect(tokens.colors).toEqual([]);
    expect(tokens.gradients).toEqual([]);
    expect(tokens.typography).toEqual([]);
    expect(tokens.spacing).toEqual([]);
    expect(tokens.borders).toEqual([]);
    expect(tokens.shadows).toEqual([]);
    expect(tokens.imageFills).toEqual([]);
    expect(tokens.components).toEqual([]);
  });

  it('handles node with empty fills array', () => {
    const root = makeNode({ fills: [] });
    const tokens = collectTokens([root], {});
    expect(tokens.colors).toHaveLength(0);
  });

  it('handles node with no style-related properties', () => {
    const root = makeNode({});
    const tokens = collectTokens([root], {});
    expect(tokens.colors).toHaveLength(0);
    expect(tokens.typography).toHaveLength(0);
    expect(tokens.spacing).toHaveLength(0);
    expect(tokens.borders).toHaveLength(0);
    expect(tokens.shadows).toHaveLength(0);
  });

  it('processes deeply nested tree (3+ levels)', () => {
    const deep = makeNode({
      fills: [solidFill(0, 1, 0, 1)],
    });
    const mid = makeNode({ children: [deep] });
    const root = makeNode({ children: [mid] });
    const tokens = collectTokens([root], {});
    expect(tokens.colors).toHaveLength(1);
    expect(tokens.colors[0].value).toBe('#00ff00');
  });
});
