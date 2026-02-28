import { describe, it, expect } from 'vitest';
import { mapToFlexbox, describeSizing } from './flexbox-map';
import { normalizeNode, normalizeTree, countNodes, deduplicateChildren } from './normalize';
import type { LayoutNode } from './types';

// ────────────────────────────────────────────────────────────────────
// Flexbox Mapping Tests
// ────────────────────────────────────────────────────────────────────

describe('mapToFlexbox', () => {
  it('maps horizontal layout with MIN/CENTER alignment', () => {
    const result = mapToFlexbox({
      layoutMode: 'HORIZONTAL',
      primaryAxisAlignItems: 'MIN',
      counterAxisAlignItems: 'CENTER',
      itemSpacing: 16,
      paddingTop: 12,
      paddingRight: 16,
      paddingBottom: 12,
      paddingLeft: 16,
      layoutWrap: 'NO_WRAP',
    });
    expect(result).toEqual({
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 16,
      padding: { top: 12, right: 16, bottom: 12, left: 16 },
      flexWrap: 'nowrap',
    });
  });

  it('maps vertical layout with SPACE_BETWEEN/MAX alignment', () => {
    const result = mapToFlexbox({
      layoutMode: 'VERTICAL',
      primaryAxisAlignItems: 'SPACE_BETWEEN',
      counterAxisAlignItems: 'MAX',
      itemSpacing: 8,
      layoutWrap: 'NO_WRAP',
    });
    expect(result).toEqual({
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 8,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      flexWrap: 'nowrap',
    });
  });

  it('maps wrapping layout with counterAxisSpacing as rowGap', () => {
    const result = mapToFlexbox({
      layoutMode: 'HORIZONTAL',
      layoutWrap: 'WRAP',
      counterAxisSpacing: 12,
      counterAxisAlignContent: 'MIN',
    });
    expect(result.flexWrap).toBe('wrap');
    expect(result.rowGap).toBe(12);
  });

  it('maps all primaryAxisAlignItems values', () => {
    expect(mapToFlexbox({ layoutMode: 'HORIZONTAL', primaryAxisAlignItems: 'MIN' }).justifyContent).toBe('flex-start');
    expect(mapToFlexbox({ layoutMode: 'HORIZONTAL', primaryAxisAlignItems: 'CENTER' }).justifyContent).toBe('center');
    expect(mapToFlexbox({ layoutMode: 'HORIZONTAL', primaryAxisAlignItems: 'MAX' }).justifyContent).toBe('flex-end');
    expect(mapToFlexbox({ layoutMode: 'HORIZONTAL', primaryAxisAlignItems: 'SPACE_BETWEEN' }).justifyContent).toBe('space-between');
  });

  it('maps all counterAxisAlignItems values', () => {
    expect(mapToFlexbox({ layoutMode: 'HORIZONTAL', counterAxisAlignItems: 'MIN' }).alignItems).toBe('flex-start');
    expect(mapToFlexbox({ layoutMode: 'HORIZONTAL', counterAxisAlignItems: 'CENTER' }).alignItems).toBe('center');
    expect(mapToFlexbox({ layoutMode: 'HORIZONTAL', counterAxisAlignItems: 'MAX' }).alignItems).toBe('flex-end');
    expect(mapToFlexbox({ layoutMode: 'HORIZONTAL', counterAxisAlignItems: 'BASELINE' }).alignItems).toBe('baseline');
  });

  it('defaults padding and gap to 0 when not provided', () => {
    const result = mapToFlexbox({ layoutMode: 'HORIZONTAL' });
    expect(result.gap).toBe(0);
    expect(result.padding).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });

  it('does not include rowGap when not wrapping', () => {
    const result = mapToFlexbox({ layoutMode: 'HORIZONTAL', layoutWrap: 'NO_WRAP' });
    expect(result.rowGap).toBeUndefined();
  });
});

describe('describeSizing', () => {
  it('describes HUG with resolved px', () => {
    expect(describeSizing('HUG', 240)).toBe('hug (240px)');
  });

  it('describes FILL without resolved value', () => {
    expect(describeSizing('FILL', undefined)).toBe('fill');
  });

  it('describes FIXED with resolved px', () => {
    expect(describeSizing('FIXED', 100)).toBe('100px');
  });

  it('describes undefined mode with resolved px', () => {
    expect(describeSizing(undefined, 50)).toBe('50px');
  });

  it('describes HUG without resolved value', () => {
    expect(describeSizing('HUG', undefined)).toBe('hug');
  });

  it('describes FIXED without resolved value', () => {
    expect(describeSizing('FIXED', undefined)).toBe('0px');
  });
});

// ────────────────────────────────────────────────────────────────────
// Node Normalization Tests
// ────────────────────────────────────────────────────────────────────

describe('normalizeNode', () => {
  const emptyComponents: Record<string, any> = {};

  it('normalizes a basic frame node', () => {
    const input = {
      id: '1:1',
      name: 'Container',
      type: 'FRAME',
      visible: true,
      absoluteBoundingBox: { x: 0, y: 0, width: 300, height: 200 },
      layoutSizingHorizontal: 'FIXED',
      layoutSizingVertical: 'HUG',
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('1:1');
    expect(result!.name).toBe('Container');
    expect(result!.type).toBe('FRAME');
    expect(result!.visible).toBe(true);
    expect(result!.width).toBe(300);
    expect(result!.height).toBe(200);
    expect(result!.widthMode).toBe('FIXED');
    expect(result!.heightMode).toBe('HUG');
    expect(result!.children).toEqual([]);
  });

  it('normalizes an auto-layout frame', () => {
    const input = {
      id: '1:2',
      name: 'Row',
      type: 'FRAME',
      visible: true,
      absoluteBoundingBox: { x: 0, y: 0, width: 400, height: 100 },
      layoutMode: 'HORIZONTAL',
      primaryAxisAlignItems: 'MIN',
      counterAxisAlignItems: 'CENTER',
      itemSpacing: 16,
      paddingTop: 12,
      paddingRight: 16,
      paddingBottom: 12,
      paddingLeft: 16,
      layoutWrap: 'NO_WRAP',
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.autoLayout).toEqual({
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 16,
      padding: { top: 12, right: 16, bottom: 12, left: 16 },
      flexWrap: 'nowrap',
    });
  });

  it('does not set autoLayout when layoutMode is NONE', () => {
    const input = {
      id: '1:3',
      name: 'Static',
      type: 'FRAME',
      visible: true,
      layoutMode: 'NONE',
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.autoLayout).toBeUndefined();
  });

  it('does not set autoLayout when layoutMode is undefined', () => {
    const input = {
      id: '1:4',
      name: 'NoLayout',
      type: 'FRAME',
      visible: true,
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.autoLayout).toBeUndefined();
  });

  it('normalizes a text node with content (LYOT-04)', () => {
    const input = {
      id: '2:1',
      name: 'Title',
      type: 'TEXT',
      characters: 'Sign up for free',
      absoluteBoundingBox: { x: 0, y: 0, width: 150, height: 24 },
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.textContent).toBe('Sign up for free');
    expect(result!.name).toBe('Title');
  });

  it('includes hidden nodes marked as not visible', () => {
    const input = {
      id: '3:1',
      name: 'HoverState',
      type: 'FRAME',
      visible: false,
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.visible).toBe(false);
  });

  it('defaults visible to true when undefined', () => {
    const input = {
      id: '3:2',
      name: 'Card',
      type: 'FRAME',
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.visible).toBe(true);
  });

  it('normalizes a component instance as leaf node with metadata', () => {
    const input = {
      id: '4:1',
      name: 'Button',
      type: 'INSTANCE',
      componentId: 'abc123',
      componentProperties: {
        variant: { type: 'VARIANT', value: 'primary' },
        disabled: { type: 'BOOLEAN', value: false },
      },
      absoluteBoundingBox: { x: 0, y: 0, width: 120, height: 40 },
      children: [{ id: '4:2', name: 'Label', type: 'TEXT' }],
    };

    const components = {
      abc123: {
        name: 'Button',
        description: 'Primary action button',
        remote: false,
      },
    };

    const result = normalizeNode(input, components, 0);
    expect(result).not.toBeNull();
    expect(result!.componentRef).toEqual({
      componentId: 'abc123',
      componentName: 'Button',
      description: 'Primary action button',
      isRemote: false,
      source: 'local',
      variantProperties: { variant: 'primary', disabled: false },
    });
    // Should NOT recurse into children
    expect(result!.children).toBeUndefined();
  });

  it('tags remote component instances as library source', () => {
    const input = {
      id: '4:3',
      name: 'Icon',
      type: 'INSTANCE',
      componentId: 'remote456',
      absoluteBoundingBox: { x: 0, y: 0, width: 24, height: 24 },
      children: [],
    };

    const components = {
      remote456: {
        name: 'IconComponent',
        description: '',
        remote: true,
      },
    };

    const result = normalizeNode(input, components, 0);
    expect(result).not.toBeNull();
    expect(result!.componentRef!.isRemote).toBe(true);
    expect(result!.componentRef!.source).toBe('library');
    expect(result!.children).toBeUndefined();
  });

  it('treats boolean operation as leaf node', () => {
    const input = {
      id: '5:1',
      name: 'icon-shape',
      type: 'BOOLEAN_OPERATION',
      children: [{ id: '5:2', name: 'Circle', type: 'ELLIPSE' }, { id: '5:3', name: 'Square', type: 'RECTANGLE' }],
      absoluteBoundingBox: { x: 0, y: 0, width: 16, height: 16 },
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('BOOLEAN_OPERATION');
    expect(result!.children).toBeUndefined();
  });

  it('captures absolute positioning within auto-layout (LYOT-05)', () => {
    const absChild = {
      id: '6:1',
      name: 'Floating',
      type: 'FRAME',
      layoutPositioning: 'ABSOLUTE',
      absoluteBoundingBox: { x: 0, y: 0, width: 50, height: 50 },
      children: [],
    };

    const result = normalizeNode(absChild, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.positioning).toBe('ABSOLUTE');
  });

  it('captures AUTO positioning', () => {
    const autoChild = {
      id: '6:2',
      name: 'Flow',
      type: 'FRAME',
      layoutPositioning: 'AUTO',
      absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 100 },
      children: [],
    };

    const result = normalizeNode(autoChild, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.positioning).toBe('AUTO');
  });

  it('captures constraints and min/max dimensions (LYOT-03)', () => {
    const input = {
      id: '7:1',
      name: 'Responsive',
      type: 'FRAME',
      constraints: { horizontal: 'LEFT_RIGHT', vertical: 'TOP_BOTTOM' },
      minWidth: 100,
      maxWidth: 500,
      absoluteBoundingBox: { x: 0, y: 0, width: 300, height: 200 },
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.constraints).toEqual({ horizontal: 'LEFT_RIGHT', vertical: 'TOP_BOTTOM' });
    expect(result!.minWidth).toBe(100);
    expect(result!.maxWidth).toBe(500);
  });

  it('skips SLICE nodes', () => {
    const input = {
      id: '8:1',
      name: 'export-region',
      type: 'SLICE',
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).toBeNull();
  });

  it('recursively normalizes children', () => {
    const input = {
      id: '9:1',
      name: 'Parent',
      type: 'FRAME',
      absoluteBoundingBox: { x: 0, y: 0, width: 400, height: 300 },
      children: [
        {
          id: '9:2',
          name: 'Title',
          type: 'TEXT',
          characters: 'Hello',
          absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 20 },
        },
        {
          id: '9:3',
          name: 'Inner',
          type: 'FRAME',
          absoluteBoundingBox: { x: 0, y: 0, width: 200, height: 100 },
          children: [],
        },
      ],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.children).toHaveLength(2);
    expect(result!.children![0].name).toBe('Title');
    expect(result!.children![0].textContent).toBe('Hello');
    expect(result!.children![1].name).toBe('Inner');
  });

  it('falls back to size property when absoluteBoundingBox is null', () => {
    const input = {
      id: '10:1',
      name: 'Hidden',
      type: 'FRAME',
      visible: false,
      absoluteBoundingBox: null,
      size: { x: 100, y: 50 },
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.width).toBe(100);
    expect(result!.height).toBe(50);
  });

  it('captures preserveRatio', () => {
    const input = {
      id: '11:1',
      name: 'Image',
      type: 'RECTANGLE',
      preserveRatio: true,
      absoluteBoundingBox: { x: 0, y: 0, width: 200, height: 150 },
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.preserveRatio).toBe(true);
  });

  it('captures minHeight and maxHeight', () => {
    const input = {
      id: '12:1',
      name: 'Container',
      type: 'FRAME',
      minHeight: 50,
      maxHeight: 400,
      absoluteBoundingBox: { x: 0, y: 0, width: 200, height: 200 },
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.minHeight).toBe(50);
    expect(result!.maxHeight).toBe(400);
  });

  it('handles instance with no matching component in map', () => {
    const input = {
      id: '13:1',
      name: 'UnknownBtn',
      type: 'INSTANCE',
      componentId: 'missing-id',
      absoluteBoundingBox: { x: 0, y: 0, width: 80, height: 32 },
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.componentRef!.componentName).toBe('UnknownBtn');
    expect(result!.componentRef!.isRemote).toBe(false);
    expect(result!.componentRef!.source).toBe('local');
    expect(result!.children).toBeUndefined();
  });

  it('includes overrides on component instances', () => {
    const input = {
      id: '14:1',
      name: 'Button',
      type: 'INSTANCE',
      componentId: 'btn-id',
      overrides: [{ id: '14:2', overriddenFields: ['characters'] }],
      absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 40 },
      children: [],
    };

    const components = {
      'btn-id': { name: 'Button', description: '', remote: false },
    };

    const result = normalizeNode(input, components, 0);
    expect(result).not.toBeNull();
    expect(result!.componentRef!.overrides).toEqual([{ id: '14:2', overriddenFields: ['characters'] }]);
  });

  it('filters out SLICE nodes from children', () => {
    const input = {
      id: '15:1',
      name: 'Parent',
      type: 'FRAME',
      absoluteBoundingBox: { x: 0, y: 0, width: 200, height: 200 },
      children: [
        { id: '15:2', name: 'Child', type: 'FRAME', children: [] },
        { id: '15:3', name: 'ExportSlice', type: 'SLICE' },
      ],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.children).toHaveLength(1);
    expect(result!.children![0].name).toBe('Child');
  });
});

// ────────────────────────────────────────────────────────────────────
// Node Counting Tests
// ────────────────────────────────────────────────────────────────────

describe('countNodes', () => {
  it('counts a single node with empty children', () => {
    expect(countNodes({ children: [] })).toBe(1);
  });

  it('counts nested nodes', () => {
    const tree = {
      children: [
        { children: [] },
        { children: [{ children: [] }] },
      ],
    };
    expect(countNodes(tree)).toBe(4);
  });

  it('counts a node with no children property', () => {
    expect(countNodes({})).toBe(1);
  });
});

// ────────────────────────────────────────────────────────────────────
// Deduplication Tests
// ────────────────────────────────────────────────────────────────────

describe('deduplicateChildren', () => {
  function makeInstance(componentId: string, variantProps?: Record<string, string | boolean>, name?: string): LayoutNode {
    return {
      id: `dedup-${Math.random().toString(36).slice(2)}`,
      name: name ?? 'Instance',
      type: 'INSTANCE',
      visible: true,
      componentRef: {
        componentId,
        componentName: name ?? 'Component',
        isRemote: false,
        source: 'local',
        variantProperties: variantProps,
      },
    };
  }

  it('collapses 4 identical instances to 1 with repeatCount=4', () => {
    const nonInstance: LayoutNode = { id: 'other', name: 'Divider', type: 'RECTANGLE', visible: true };
    const instances = [
      makeInstance('comp-a', { size: 'small' }),
      makeInstance('comp-a', { size: 'small' }),
      makeInstance('comp-a', { size: 'small' }),
      makeInstance('comp-a', { size: 'small' }),
    ];

    const result = deduplicateChildren([nonInstance, ...instances]);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(nonInstance);
    expect(result[1].repeatCount).toBe(4);
    expect(result[1].componentRef!.componentId).toBe('comp-a');
  });

  it('does not deduplicate when below threshold of 3', () => {
    const instances = [
      makeInstance('comp-b', { style: 'default' }),
      makeInstance('comp-b', { style: 'default' }),
    ];

    const result = deduplicateChildren(instances);
    expect(result).toHaveLength(2);
    expect(result[0].repeatCount).toBeUndefined();
    expect(result[1].repeatCount).toBeUndefined();
  });

  it('deduplicates multiple groups independently', () => {
    const groupA = [
      makeInstance('comp-a', { variant: 'primary' }),
      makeInstance('comp-a', { variant: 'primary' }),
      makeInstance('comp-a', { variant: 'primary' }),
    ];
    const groupB = [
      makeInstance('comp-b', { variant: 'secondary' }),
      makeInstance('comp-b', { variant: 'secondary' }),
      makeInstance('comp-b', { variant: 'secondary' }),
    ];
    const nonInstance: LayoutNode = { id: 'other', name: 'Spacer', type: 'RECTANGLE', visible: true };

    const result = deduplicateChildren([...groupA, nonInstance, ...groupB]);
    expect(result).toHaveLength(3); // 1 rep of A + nonInstance + 1 rep of B
    expect(result[0].repeatCount).toBe(3);
    expect(result[0].componentRef!.componentId).toBe('comp-a');
    expect(result[1]).toBe(nonInstance);
    expect(result[2].repeatCount).toBe(3);
    expect(result[2].componentRef!.componentId).toBe('comp-b');
  });

  it('does not collapse instances with different variant properties', () => {
    const instances = [
      makeInstance('comp-c', { size: 'small' }),
      makeInstance('comp-c', { size: 'small' }),
      makeInstance('comp-c', { size: 'large' }),
    ];

    const result = deduplicateChildren(instances);
    // 2 small (below threshold) + 1 large = all 3 kept
    expect(result).toHaveLength(3);
  });

  it('handles empty children array', () => {
    const result = deduplicateChildren([]);
    expect(result).toEqual([]);
  });

  it('preserves original order for non-deduplicated items', () => {
    const child1: LayoutNode = { id: '1', name: 'First', type: 'TEXT', visible: true };
    const child2: LayoutNode = { id: '2', name: 'Second', type: 'FRAME', visible: true };
    const child3: LayoutNode = { id: '3', name: 'Third', type: 'RECTANGLE', visible: true };

    const result = deduplicateChildren([child1, child2, child3]);
    expect(result).toEqual([child1, child2, child3]);
  });
});

// ────────────────────────────────────────────────────────────────────
// normalizeTree Tests
// ────────────────────────────────────────────────────────────────────

describe('normalizeTree', () => {
  it('normalizes multiple root nodes and returns ExtractionResult', () => {
    const roots = [
      {
        id: '20:1',
        name: 'Frame1',
        type: 'FRAME',
        absoluteBoundingBox: { x: 0, y: 0, width: 200, height: 100 },
        children: [
          { id: '20:2', name: 'Text1', type: 'TEXT', characters: 'Hello' },
        ],
      },
      {
        id: '20:3',
        name: 'Frame2',
        type: 'FRAME',
        absoluteBoundingBox: { x: 0, y: 0, width: 300, height: 150 },
        children: [],
      },
    ];

    const result = normalizeTree(roots, {});
    expect(result.rootNodes).toHaveLength(2);
    expect(result.nodeCount).toBe(3); // Frame1(1) + Text1(1) + Frame2(1) = 3 raw nodes
    expect(result.truncated).toBe(false);
  });

  it('filters out null nodes (SLICE roots)', () => {
    const roots = [
      { id: '21:1', name: 'Frame', type: 'FRAME', children: [] },
      { id: '21:2', name: 'Slice', type: 'SLICE' },
    ];

    const result = normalizeTree(roots, {});
    expect(result.rootNodes).toHaveLength(1);
    expect(result.rootNodes[0].name).toBe('Frame');
  });

  it('returns correct nodeCount for nested tree', () => {
    const roots = [
      {
        id: '22:1',
        name: 'Root',
        type: 'FRAME',
        children: [
          {
            id: '22:2',
            name: 'Child',
            type: 'FRAME',
            children: [
              { id: '22:3', name: 'Leaf', type: 'TEXT', characters: 'hi' },
            ],
          },
        ],
      },
    ];

    const result = normalizeTree(roots, {});
    expect(result.nodeCount).toBe(3); // Root + Child + Leaf
  });

  it('handles empty roots array', () => {
    const result = normalizeTree([], {});
    expect(result.rootNodes).toEqual([]);
    expect(result.nodeCount).toBe(0);
    expect(result.truncated).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────────────
// Style Enrichment Tests (Phase 3)
// ────────────────────────────────────────────────────────────────────

describe('normalizeNode style enrichment', () => {
  const emptyComponents: Record<string, any> = {};

  it('captures fills array from a FRAME', () => {
    const input = {
      id: 'style:1',
      name: 'Filled',
      type: 'FRAME',
      fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 }, visible: true }],
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.fills).toEqual([{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 }, visible: true }]);
  });

  it('captures strokes array from a FRAME', () => {
    const input = {
      id: 'style:2',
      name: 'Stroked',
      type: 'FRAME',
      strokes: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }],
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.strokes).toEqual([{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }]);
  });

  it('captures effects array from a FRAME', () => {
    const input = {
      id: 'style:3',
      name: 'Shadowed',
      type: 'FRAME',
      effects: [{ type: 'DROP_SHADOW', visible: true, color: { r: 0, g: 0, b: 0, a: 0.25 }, offset: { x: 0, y: 4 }, radius: 8, spread: 0 }],
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.effects).toEqual([
      { type: 'DROP_SHADOW', visible: true, color: { r: 0, g: 0, b: 0, a: 0.25 }, offset: { x: 0, y: 4 }, radius: 8, spread: 0 },
    ]);
  });

  it('captures cornerRadius from a FRAME', () => {
    const input = {
      id: 'style:4',
      name: 'Rounded',
      type: 'FRAME',
      cornerRadius: 8,
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.cornerRadius).toBe(8);
  });

  it('captures rectangleCornerRadii from a FRAME', () => {
    const input = {
      id: 'style:5',
      name: 'MixedCorners',
      type: 'FRAME',
      rectangleCornerRadii: [4, 4, 8, 8],
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.rectangleCornerRadii).toEqual([4, 4, 8, 8]);
  });

  it('captures strokeWeight from a FRAME', () => {
    const input = {
      id: 'style:6',
      name: 'Bordered',
      type: 'FRAME',
      strokeWeight: 2,
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.strokeWeight).toBe(2);
  });

  it('captures textStyle from a TEXT node', () => {
    const textStyle = {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 600,
      lineHeightPx: 24,
      letterSpacing: 0,
    };

    const input = {
      id: 'style:7',
      name: 'Heading',
      type: 'TEXT',
      characters: 'Hello',
      style: textStyle,
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.textStyle).toEqual(textStyle);
    expect(result!.textContent).toBe('Hello');
  });

  it('captures textStyleOverrides from a TEXT node', () => {
    const input = {
      id: 'style:8',
      name: 'MixedText',
      type: 'TEXT',
      characters: 'Hello World',
      style: { fontFamily: 'Inter', fontSize: 16 },
      styleOverrideTable: { '1': { fontFamily: 'Inter', fontSize: 14 } },
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.textStyleOverrides).toEqual({ '1': { fontFamily: 'Inter', fontSize: 14 } });
  });

  it('captures opacity when not 1', () => {
    const input = {
      id: 'style:9',
      name: 'Faded',
      type: 'FRAME',
      opacity: 0.5,
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.opacity).toBe(0.5);
  });

  it('does not capture opacity when it is 1 (default)', () => {
    const input = {
      id: 'style:10',
      name: 'Opaque',
      type: 'FRAME',
      opacity: 1,
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.opacity).toBeUndefined();
  });

  it('captures styleRefs from a FRAME', () => {
    const input = {
      id: 'style:11',
      name: 'Styled',
      type: 'FRAME',
      styles: { fill: 'S:abc123' },
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.styleRefs).toEqual({ fill: 'S:abc123' });
  });

  it('does not set fills on a node without fills (e.g., GROUP)', () => {
    const input = {
      id: 'style:12',
      name: 'Group',
      type: 'GROUP',
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.fills).toBeUndefined();
  });

  it('still returns componentRef on INSTANCE nodes (existing behavior)', () => {
    const input = {
      id: 'style:13',
      name: 'Button',
      type: 'INSTANCE',
      componentId: 'comp-1',
      fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 1, a: 1 }, visible: true }],
      absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 40 },
      children: [],
    };

    const components = {
      'comp-1': { name: 'Button', remote: false },
    };

    const result = normalizeNode(input, components, 0);
    expect(result).not.toBeNull();
    expect(result!.componentRef).toBeDefined();
    expect(result!.componentRef!.componentName).toBe('Button');
    // INSTANCE should still NOT recurse into children
    expect(result!.children).toBeUndefined();
    // Style data should still be captured on instances
    expect(result!.fills).toEqual([{ type: 'SOLID', color: { r: 0, g: 0, b: 1, a: 1 }, visible: true }]);
  });

  it('does not set textStyleOverrides when styleOverrideTable is empty', () => {
    const input = {
      id: 'style:14',
      name: 'SimpleText',
      type: 'TEXT',
      characters: 'Plain',
      style: { fontFamily: 'Inter', fontSize: 16 },
      styleOverrideTable: {},
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.textStyleOverrides).toBeUndefined();
  });

  it('captures blendMode when not PASS_THROUGH or NORMAL', () => {
    const input = {
      id: 'blend:1',
      name: 'Blended',
      type: 'FRAME',
      blendMode: 'MULTIPLY',
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.blendMode).toBe('MULTIPLY');
  });

  it('does not capture blendMode when PASS_THROUGH', () => {
    const input = {
      id: 'blend:2',
      name: 'PassThrough',
      type: 'FRAME',
      blendMode: 'PASS_THROUGH',
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.blendMode).toBeUndefined();
  });

  it('does not capture blendMode when NORMAL', () => {
    const input = {
      id: 'blend:3',
      name: 'Normal',
      type: 'FRAME',
      blendMode: 'NORMAL',
      children: [],
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.blendMode).toBeUndefined();
  });

  it('captures isMask when true', () => {
    const input = {
      id: 'mask:1',
      name: 'MaskNode',
      type: 'RECTANGLE',
      isMask: true,
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.isMask).toBe(true);
  });

  it('does not capture isMask when false', () => {
    const input = {
      id: 'mask:2',
      name: 'NotMask',
      type: 'RECTANGLE',
      isMask: false,
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.isMask).toBeUndefined();
  });

  it('does not capture isMask when absent', () => {
    const input = {
      id: 'mask:3',
      name: 'NoMask',
      type: 'RECTANGLE',
    };

    const result = normalizeNode(input, emptyComponents, 0);
    expect(result).not.toBeNull();
    expect(result!.isMask).toBeUndefined();
  });
});
