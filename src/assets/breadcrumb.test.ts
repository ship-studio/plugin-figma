import { describe, it, expect } from 'vitest';
import { buildBreadcrumbMap, GENERIC_NAME_PATTERN } from './breadcrumb';
import type { LayoutNode } from '../layout/types';

// ── Test helpers ──────────────────────────────────────────────────────

/** Build a minimal LayoutNode with overrides. */
function node(overrides: Partial<LayoutNode> & { id: string; name: string; type: string }): LayoutNode {
  return {
    visible: true,
    ...overrides,
  };
}

// ── GENERIC_NAME_PATTERN ─────────────────────────────────────────────

describe('GENERIC_NAME_PATTERN', () => {
  it('matches "Frame 427" (type + number)', () => {
    expect(GENERIC_NAME_PATTERN.test('Frame 427')).toBe(true);
  });

  it('matches "Group 12"', () => {
    expect(GENERIC_NAME_PATTERN.test('Group 12')).toBe(true);
  });

  it('matches bare "Group" (no number)', () => {
    expect(GENERIC_NAME_PATTERN.test('Group')).toBe(true);
  });

  it('matches bare "Frame"', () => {
    expect(GENERIC_NAME_PATTERN.test('Frame')).toBe(true);
  });

  it('matches "Vector 55"', () => {
    expect(GENERIC_NAME_PATTERN.test('Vector 55')).toBe(true);
  });

  it('matches "Rectangle 3"', () => {
    expect(GENERIC_NAME_PATTERN.test('Rectangle 3')).toBe(true);
  });

  it('matches "Instance 1"', () => {
    expect(GENERIC_NAME_PATTERN.test('Instance 1')).toBe(true);
  });

  it('matches "Line 4"', () => {
    expect(GENERIC_NAME_PATTERN.test('Line 4')).toBe(true);
  });

  it('matches "Star 2"', () => {
    expect(GENERIC_NAME_PATTERN.test('Star 2')).toBe(true);
  });

  it('matches "Polygon 1"', () => {
    expect(GENERIC_NAME_PATTERN.test('Polygon 1')).toBe(true);
  });

  it('does NOT match "Frame Header" (intentionally named)', () => {
    expect(GENERIC_NAME_PATTERN.test('Frame Header')).toBe(false);
  });

  it('does NOT match "Group Actions" (intentionally named)', () => {
    expect(GENERIC_NAME_PATTERN.test('Group Actions')).toBe(false);
  });

  it('does NOT match "Hero Section" (custom name)', () => {
    expect(GENERIC_NAME_PATTERN.test('Hero Section')).toBe(false);
  });

  it('is case insensitive', () => {
    expect(GENERIC_NAME_PATTERN.test('frame 1')).toBe(true);
    expect(GENERIC_NAME_PATTERN.test('GROUP')).toBe(true);
  });
});

// ── buildBreadcrumbMap ───────────────────────────────────────────────

describe('buildBreadcrumbMap', () => {
  it('returns empty Map for empty root nodes array', () => {
    const result = buildBreadcrumbMap([]);
    expect(result.size).toBe(0);
  });

  it('builds paths for named children', () => {
    const root = node({
      id: 'r1',
      name: 'Hero',
      type: 'FRAME',
      children: [
        node({ id: 'c1', name: 'Header', type: 'FRAME' }),
        node({ id: 'c2', name: 'Logo', type: 'VECTOR' }),
      ],
    });

    const result = buildBreadcrumbMap([root]);
    expect(result.get('r1')).toBe('Hero');
    expect(result.get('c1')).toBe('Hero > Header');
    expect(result.get('c2')).toBe('Hero > Logo');
  });

  it('skips generic names from path', () => {
    const root = node({
      id: 'r1',
      name: 'Hero',
      type: 'FRAME',
      children: [
        node({
          id: 'g1',
          name: 'Frame 427',
          type: 'FRAME',
          children: [
            node({ id: 'c1', name: 'Logo', type: 'VECTOR' }),
          ],
        }),
      ],
    });

    const result = buildBreadcrumbMap([root]);
    // Frame 427 is generic, skipped from path
    expect(result.get('g1')).toBe('Hero');
    expect(result.get('c1')).toBe('Hero > Logo');
  });

  it('root node with generic name gets empty breadcrumb', () => {
    const root = node({
      id: 'r1',
      name: 'Frame 1',
      type: 'FRAME',
      children: [
        node({ id: 'c1', name: 'Logo', type: 'VECTOR' }),
      ],
    });

    const result = buildBreadcrumbMap([root]);
    expect(result.get('r1')).toBe('');
    expect(result.get('c1')).toBe('Logo');
  });

  it('root node with real name gets its own name as breadcrumb', () => {
    const root = node({
      id: 'r1',
      name: 'Login Card',
      type: 'FRAME',
      children: [],
    });

    const result = buildBreadcrumbMap([root]);
    expect(result.get('r1')).toBe('Login Card');
  });

  it('path with <= 4 segments shows full path', () => {
    const root = node({
      id: 'r1',
      name: 'A',
      type: 'FRAME',
      children: [
        node({
          id: 'c1',
          name: 'B',
          type: 'FRAME',
          children: [
            node({
              id: 'c2',
              name: 'C',
              type: 'FRAME',
              children: [
                node({ id: 'c3', name: 'D', type: 'VECTOR' }),
              ],
            }),
          ],
        }),
      ],
    });

    const result = buildBreadcrumbMap([root]);
    expect(result.get('c3')).toBe('A > B > C > D');
  });

  it('path with 5+ segments uses smart truncation', () => {
    const root = node({
      id: 'r1',
      name: 'A',
      type: 'FRAME',
      children: [
        node({
          id: 'c1',
          name: 'B',
          type: 'FRAME',
          children: [
            node({
              id: 'c2',
              name: 'C',
              type: 'FRAME',
              children: [
                node({
                  id: 'c3',
                  name: 'D',
                  type: 'FRAME',
                  children: [
                    node({ id: 'c4', name: 'E', type: 'VECTOR' }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const result = buildBreadcrumbMap([root]);
    // 5 segments: A > B > C > D > E -> A > ... > D > E
    expect(result.get('c4')).toBe('A > ... > D > E');
  });

  it('deeply nested under generic parents inherits only named ancestors', () => {
    const root = node({
      id: 'r1',
      name: 'Page',
      type: 'FRAME',
      children: [
        node({
          id: 'g1',
          name: 'Group 1',
          type: 'GROUP',
          children: [
            node({
              id: 'g2',
              name: 'Frame 42',
              type: 'FRAME',
              children: [
                node({ id: 'c1', name: 'Icon', type: 'VECTOR' }),
              ],
            }),
          ],
        }),
      ],
    });

    const result = buildBreadcrumbMap([root]);
    // Both Group 1 and Frame 42 are generic, only "Page" and "Icon" in path
    expect(result.get('c1')).toBe('Page > Icon');
  });

  it('keeps "Frame Header" as named (not generic)', () => {
    const root = node({
      id: 'r1',
      name: 'Page',
      type: 'FRAME',
      children: [
        node({
          id: 'fh',
          name: 'Frame Header',
          type: 'FRAME',
          children: [
            node({ id: 'logo', name: 'Logo', type: 'VECTOR' }),
          ],
        }),
      ],
    });

    const result = buildBreadcrumbMap([root]);
    expect(result.get('fh')).toBe('Page > Frame Header');
    expect(result.get('logo')).toBe('Page > Frame Header > Logo');
  });

  it('handles multiple roots', () => {
    const root1 = node({
      id: 'r1',
      name: 'Page 1',
      type: 'FRAME',
      children: [
        node({ id: 'c1', name: 'Header', type: 'FRAME' }),
      ],
    });
    const root2 = node({
      id: 'r2',
      name: 'Page 2',
      type: 'FRAME',
      children: [
        node({ id: 'c2', name: 'Footer', type: 'FRAME' }),
      ],
    });

    const result = buildBreadcrumbMap([root1, root2]);
    expect(result.get('c1')).toBe('Page 1 > Header');
    expect(result.get('c2')).toBe('Page 2 > Footer');
  });

  it('handles root with no children', () => {
    const root = node({
      id: 'r1',
      name: 'Empty Page',
      type: 'FRAME',
    });

    const result = buildBreadcrumbMap([root]);
    expect(result.get('r1')).toBe('Empty Page');
    expect(result.size).toBe(1);
  });
});
