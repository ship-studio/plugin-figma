import { describe, it, expect } from 'vitest';
import {
  detectCompositions,
  CHILD_COUNT_THRESHOLD,
  NESTING_DEPTH_THRESHOLD,
  SCAN_DEPTH_LIMIT,
} from './detect-composition';
import type { LayoutNode } from '../layout/types';

// ── Test helpers ──────────────────────────────────────────────────────

/** Build a minimal LayoutNode with overrides. */
function node(overrides: Partial<LayoutNode> & { id: string; name: string; type: string }): LayoutNode {
  return {
    visible: true,
    ...overrides,
  };
}

/** Build a root frame containing given children. */
function root(children: LayoutNode[]): LayoutNode {
  return node({
    id: 'root',
    name: 'Root',
    type: 'FRAME',
    children,
  });
}

/** Generate N simple vector children (no visual effects). */
function vectors(count: number): LayoutNode[] {
  return Array.from({ length: count }, (_, i) =>
    node({ id: `v${i}`, name: `Vector ${i}`, type: 'VECTOR' }),
  );
}

/** Build a deeply nested chain of frames. */
function nestedChain(depth: number, leaf: LayoutNode): LayoutNode {
  let current = leaf;
  for (let i = depth - 1; i >= 0; i--) {
    current = node({
      id: `nest-${i}`,
      name: `Nest ${i}`,
      type: 'FRAME',
      children: [current],
    });
  }
  return current;
}

// ── Threshold exports ────────────────────────────────────────────────

describe('composition detection constants', () => {
  it('exports expected threshold values', () => {
    expect(CHILD_COUNT_THRESHOLD).toBe(5);
    expect(NESTING_DEPTH_THRESHOLD).toBe(3);
    expect(SCAN_DEPTH_LIMIT).toBe(3);
  });
});

// ── detectCompositions ───────────────────────────────────────────────

describe('detectCompositions', () => {
  it('returns empty set for simple icon group (3 vectors, no effects)', () => {
    const group = node({
      id: 'icon-group',
      name: 'Arrow Icon',
      type: 'GROUP',
      children: vectors(3),
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.size).toBe(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('flags group with 6+ vectors AND a blendMode child as composition', () => {
    const children = vectors(6);
    children[0] = node({ ...children[0], blendMode: 'MULTIPLY' });

    const group = node({
      id: 'illustration',
      name: 'Hero Illustration',
      type: 'GROUP',
      children,
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.has('illustration')).toBe(true);
    expect(result.warnings).toContain('Auto-detected "Hero Illustration" as a composition');
  });

  it('flags group with mask child AND nesting depth >= 3', () => {
    // Build 3 levels of nesting with a mask at the bottom
    const maskChild = node({ id: 'mask-node', name: 'Mask', type: 'RECTANGLE', isMask: true });
    const nested = nestedChain(2, maskChild); // 2 extra levels + mask = depth 3

    const group = node({
      id: 'masked-group',
      name: 'Masked Illustration',
      type: 'GROUP',
      children: [nested],
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.has('masked-group')).toBe(true);
  });

  it('flags BOOLEAN_OPERATION with non-normal blendMode child', () => {
    const boolOp = node({
      id: 'bool-op',
      name: 'Complex Shape',
      type: 'BOOLEAN_OPERATION',
      children: [
        node({ id: 'b1', name: 'Shape1', type: 'VECTOR', blendMode: 'SCREEN' }),
        node({ id: 'b2', name: 'Shape2', type: 'VECTOR' }),
      ],
    });

    const result = detectCompositions([root([boolOp])]);
    expect(result.compositionNodeIds.has('bool-op')).toBe(true);
  });

  it('does NOT flag standalone BOOLEAN_OPERATION without visual effects', () => {
    const boolOp = node({
      id: 'simple-bool',
      name: 'Simple Union',
      type: 'BOOLEAN_OPERATION',
      children: [
        node({ id: 'c1', name: 'Circle', type: 'ELLIPSE' }),
        node({ id: 'c2', name: 'Square', type: 'RECTANGLE' }),
      ],
    });

    const result = detectCompositions([root([boolOp])]);
    expect(result.compositionNodeIds.size).toBe(0);
  });

  it('outer composition wins -- nested composition not flagged separately', () => {
    // Inner group qualifies as composition
    const innerChildren = vectors(6);
    innerChildren[0] = node({ ...innerChildren[0], blendMode: 'OVERLAY' });
    const inner = node({
      id: 'inner-comp',
      name: 'Inner',
      type: 'GROUP',
      children: innerChildren,
    });

    // Outer group also qualifies (6+ children incl inner + visual effect)
    const outerChildren = [...vectors(5), inner];
    outerChildren[0] = node({ ...outerChildren[0], blendMode: 'MULTIPLY' });
    const outer = node({
      id: 'outer-comp',
      name: 'Outer',
      type: 'GROUP',
      children: outerChildren,
    });

    const result = detectCompositions([root([outer])]);
    expect(result.compositionNodeIds.has('outer-comp')).toBe(true);
    expect(result.compositionNodeIds.has('inner-comp')).toBe(false);
    expect(result.compositionNodeIds.size).toBe(1);
  });

  it('generates warning for each flagged composition', () => {
    // Two sibling compositions
    const compA = node({
      id: 'comp-a',
      name: 'Comp A',
      type: 'GROUP',
      children: [
        ...vectors(5),
        node({ id: 'mask-a', name: 'Mask', type: 'RECTANGLE', isMask: true }),
      ],
    });
    const compB = node({
      id: 'comp-b',
      name: 'Comp B',
      type: 'GROUP',
      children: [
        ...vectors(5),
        node({ id: 'blend-b', name: 'Blend', type: 'VECTOR', blendMode: 'DARKEN' }),
      ],
    });

    const result = detectCompositions([root([compA, compB])]);
    expect(result.compositionNodeIds.size).toBe(2);
    expect(result.warnings).toHaveLength(2);
    expect(result.warnings).toContain('Auto-detected "Comp A" as a composition');
    expect(result.warnings).toContain('Auto-detected "Comp B" as a composition');
  });

  it('flags vector-only group (5+ primitives, no visual effects) as illustration', () => {
    // 6 vectors, no visual effects — now detected as vector-only illustration
    const group = node({
      id: 'illustration',
      name: 'Hero Illustration',
      type: 'GROUP',
      children: vectors(6),
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.has('illustration')).toBe(true);
    expect(result.warnings).toContain(
      'Auto-detected "Hero Illustration" as an illustration (vector-only group)',
    );
  });

  it('does NOT flag vector-only group below child count threshold', () => {
    // 3 vectors — below CHILD_COUNT_THRESHOLD, no nesting
    const group = node({
      id: 'small-group',
      name: 'Simple Icon',
      type: 'GROUP',
      children: vectors(3),
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.size).toBe(0);
  });

  it('does NOT flag group with TEXT children as vector-only illustration', () => {
    // 6 children but includes a TEXT node → not vector-only
    const children = [
      ...vectors(5),
      node({ id: 'txt', name: 'Label', type: 'TEXT' }),
    ];

    const group = node({
      id: 'mixed-group',
      name: 'Card With Text',
      type: 'GROUP',
      children,
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.size).toBe(0);
  });

  it('does NOT flag group with INSTANCE children as vector-only illustration', () => {
    // 6 children but includes an INSTANCE → not vector-only
    const children = [
      ...vectors(5),
      node({ id: 'inst', name: 'Button', type: 'INSTANCE' }),
    ];

    const group = node({
      id: 'mixed-group',
      name: 'Section With Component',
      type: 'GROUP',
      children,
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.size).toBe(0);
  });

  it('requires visual effects for non-vector-only groups (visual only = not flagged)', () => {
    // 3 vectors with blend mode (below child count threshold, no nesting)
    const children = vectors(3);
    children[0] = node({ ...children[0], blendMode: 'MULTIPLY' });

    const group = node({
      id: 'visual-only',
      name: 'Small Blended',
      type: 'GROUP',
      children,
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.size).toBe(0);
  });

  it('detects opacity < 1 as visual effect signal', () => {
    const children = vectors(6);
    children[0] = node({ ...children[0], opacity: 0.5 });

    const group = node({
      id: 'opacity-comp',
      name: 'Opacity Layered',
      type: 'GROUP',
      children,
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.has('opacity-comp')).toBe(true);
  });

  it('scans visual effects up to SCAN_DEPTH_LIMIT levels deep', () => {
    // Blend mode buried 3 levels deep should still be detected
    const deepBlend = node({ id: 'deep-blend', name: 'Deep', type: 'VECTOR', blendMode: 'MULTIPLY' });
    const nested = nestedChain(2, deepBlend); // 2 wrappers + 1 leaf = 3 levels from group

    const group = node({
      id: 'deep-scan',
      name: 'Deep Scan Group',
      type: 'GROUP',
      children: [...vectors(5), nested], // 6 direct children total, plus nesting for visual
    });

    const result = detectCompositions([root([group])]);
    expect(result.compositionNodeIds.has('deep-scan')).toBe(true);
  });

  it('handles empty root nodes array', () => {
    const result = detectCompositions([]);
    expect(result.compositionNodeIds.size).toBe(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('handles root with no children', () => {
    const result = detectCompositions([
      node({ id: 'empty-root', name: 'Empty', type: 'FRAME' }),
    ]);
    expect(result.compositionNodeIds.size).toBe(0);
    expect(result.warnings).toHaveLength(0);
  });
});
