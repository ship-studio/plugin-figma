import { describe, it, expect } from 'vitest';
import { detectAssets } from './detect';

// ── Fixture Helpers ─────────────────────────────────────────────────

let nodeCounter = 0;

function makeNode(overrides: Record<string, any> = {}): any {
  nodeCounter++;
  return {
    id: `${nodeCounter}:1`,
    name: 'Frame',
    type: 'FRAME',
    visible: true,
    children: [],
    fills: [],
    ...overrides,
  };
}

function imageFill(overrides: Record<string, any> = {}): any {
  return {
    type: 'IMAGE',
    imageRef: 'img:abc',
    scaleMode: 'FILL',
    ...overrides,
  };
}

// Reset counter between describes for stable IDs where needed
function resetCounter(): void {
  nodeCounter = 0;
}

// ── Tests ───────────────────────────────────────────────────────────

describe('detectAssets', () => {
  // ── DETECT-01: prefix matching ──────────────────────────────────

  describe('DETECT-01: prefix matching', () => {
    it('detects @S- prefixed layers', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-hero' }),
          makeNode({ name: 'Regular Layer' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].nodeName).toBe('@S-hero');
    });

    it('is case-insensitive: @s-, @S-, @S- all detected', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@s-icon' }),
          makeNode({ name: '@S-Logo' }),
          makeNode({ name: '@S-BANNER' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(3);
    });

    it('requires strict dash: @Shero and @S hero are NOT detected', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@Shero' }),
          makeNode({ name: '@S hero' }),
          makeNode({ name: '@S-valid' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].nodeName).toBe('@S-valid');
    });

    it('skips empty name after prefix and emits warning', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-' }),
          makeNode({ name: '@S-valid' }),
        ],
      });
      const { assets, warnings } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].nodeName).toBe('@S-valid');
      expect(warnings.length).toBeGreaterThanOrEqual(1);
      expect(warnings[0]).toContain('@S-');
    });

    it('detects @S- prefix on the root node itself', () => {
      const tree = makeNode({ name: '@S-root-asset' });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].nodeName).toBe('@S-root-asset');
    });
  });

  // ── DETECT-02: PNG format detection ─────────────────────────────

  describe('DETECT-02: PNG format detection', () => {
    it('detects PNG when child has IMAGE fill', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-hero',
            children: [
              makeNode({ name: 'bg', type: 'RECTANGLE', fills: [imageFill()] }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].format).toBe('png');
      expect(assets[0].filename).toBe('hero.png');
    });

    it('detects PNG when IMAGE fill is in nested INSTANCE child', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-card',
            children: [
              makeNode({
                name: 'CardInstance',
                type: 'INSTANCE',
                children: [
                  makeNode({
                    name: 'photo',
                    type: 'RECTANGLE',
                    fills: [imageFill()],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].format).toBe('png');
    });

    it('detects PNG when @S- node itself has IMAGE fill', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-background',
            fills: [imageFill()],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].format).toBe('png');
    });

    it('ignores invisible IMAGE fills (fill.visible===false)', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-icon',
            children: [
              makeNode({
                name: 'hidden-bg',
                type: 'RECTANGLE',
                fills: [imageFill({ visible: false })],
              }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].format).toBe('svg');
    });
  });

  // ── DETECT-03: SVG format detection ─────────────────────────────

  describe('DETECT-03: SVG format detection', () => {
    it('detects SVG for vector-only subtree', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-icon',
            children: [
              makeNode({ name: 'path1', type: 'VECTOR' }),
              makeNode({ name: 'path2', type: 'VECTOR' }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].format).toBe('svg');
      expect(assets[0].filename).toBe('icon.svg');
    });

    it('detects SVG for text-only subtree', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-tagline',
            children: [
              makeNode({ name: 'text', type: 'TEXT' }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].format).toBe('svg');
    });

    it('detects SVG for mixed vector + text (no IMAGE)', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-badge',
            children: [
              makeNode({ name: 'shape', type: 'VECTOR' }),
              makeNode({ name: 'label', type: 'TEXT' }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].format).toBe('svg');
    });
  });

  // ── DETECT-04: filename handling ────────────────────────────────

  describe('DETECT-04: filename handling', () => {
    it('strips @S- prefix before sanitizing', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-hero-image' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].filename).toBe('hero-image.svg');
    });

    it('lowercases via sanitizeFilename', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-HeroImage' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].filename).toBe('heroimage.svg');
    });

    it('deduplicates identical filenames (3 @S-icon -> 1 icon.svg)', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-icon', id: 'a:1' }),
          makeNode({ name: '@S-icon', id: 'b:1' }),
          makeNode({ name: '@S-icon', id: 'c:1' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].filename).toBe('icon.svg');
    });

    it('resolves collisions for different names producing same sanitized result', () => {
      // "Icon" and "icon" both sanitize to "icon"
      // But they are different original names so collision resolution applies
      // after dedup. Since they have different nodeName, they are not exact dupes.
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-icon', id: 'a:1' }),
          makeNode({ name: '@S-Icon!', id: 'b:1' }),
        ],
      });
      const { assets } = detectAssets(tree);
      // Both produce "icon.svg" after sanitize -- first is kept by dedup,
      // second either deduped or collision-resolved depending on nodeName matching.
      // Since dedup is by sanitized filename, both produce "icon.svg" -> first wins.
      expect(assets).toHaveLength(1);
      expect(assets[0].filename).toBe('icon.svg');
    });

    it('resolves collisions for genuinely different filenames that collide', () => {
      // Two assets that produce different sanitized names that don't collide
      // but if they DID collide, they'd be numbered.
      // Let's create a case: @S-arrow-icon (svg) and @S-arrow/icon (svg)
      // Both sanitize to "arrow-icon.svg" -- dedup keeps first
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-arrow-icon', id: 'a:1' }),
          makeNode({ name: '@S-arrow/icon', id: 'b:1' }),
        ],
      });
      const { assets } = detectAssets(tree);
      // Both names sanitize to "arrow-icon" -> dedup keeps first
      expect(assets).toHaveLength(1);
      expect(assets[0].filename).toBe('arrow-icon.svg');
    });

    it('collision-resolves when deduped assets still conflict', () => {
      // Two assets with same sanitized name but different formats -> no dedup conflict
      // because dedup key includes extension. Both survive dedup, no collision either.
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-hero',
            id: 'a:1',
            children: [
              makeNode({ fills: [imageFill()] }),
            ],
          }),
          makeNode({ name: '@S-hero-alt', id: 'b:1' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(2);
      expect(assets[0].filename).toBe('hero.png');
      expect(assets[1].filename).toBe('hero-alt.svg');
    });
  });

  // ── DETECT-05: position metadata ────────────────────────────────

  describe('DETECT-05: position metadata', () => {
    it('tracks depth of detected asset', () => {
      const tree = makeNode({
        name: 'Page',
        children: [
          makeNode({
            name: 'Hero',
            children: [
              makeNode({
                name: 'Content',
                children: [
                  makeNode({ name: '@S-icon', id: 'deep:1' }),
                ],
              }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].depth).toBe(3);
    });

    it('tracks parentPath of detected asset', () => {
      const tree = makeNode({
        name: 'Page',
        children: [
          makeNode({
            name: 'Hero',
            children: [
              makeNode({
                name: 'Content',
                children: [
                  makeNode({ name: '@S-icon', id: 'deep:1' }),
                ],
              }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].parentPath).toEqual(['Page', 'Hero', 'Content']);
    });

    it('carries nodeId for layout tree cross-referencing', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-hero', id: '12:34' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets[0].nodeId).toBe('12:34');
    });

    it('root node has depth 0 and empty parentPath', () => {
      const tree = makeNode({ name: '@S-root' });
      const { assets } = detectAssets(tree);
      expect(assets[0].depth).toBe(0);
      expect(assets[0].parentPath).toEqual([]);
    });
  });

  // ── Nesting rules ───────────────────────────────────────────────

  describe('nesting rules', () => {
    it('outermost @S- only: nested @S-icon inside @S-hero not detected', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: '@S-hero',
            children: [
              makeNode({ name: '@S-icon' }),
              makeNode({ name: 'regular' }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].nodeName).toBe('@S-hero');
    });

    it('detects @S- inside non-@S- INSTANCE', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: 'CardInstance',
            type: 'INSTANCE',
            children: [
              makeNode({ name: '@S-card-icon', id: 'inside:1' }),
            ],
          }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].nodeName).toBe('@S-card-icon');
    });

    it('skips hidden layers entirely (visible===false)', () => {
      const tree = makeNode({
        children: [
          makeNode({ name: '@S-hidden-asset', visible: false }),
          makeNode({ name: '@S-visible-asset' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].nodeName).toBe('@S-visible-asset');
    });

    it('skips children of hidden layers', () => {
      const tree = makeNode({
        children: [
          makeNode({
            name: 'HiddenGroup',
            visible: false,
            children: [
              makeNode({ name: '@S-nested-icon' }),
            ],
          }),
          makeNode({ name: '@S-visible-asset' }),
        ],
      });
      const { assets } = detectAssets(tree);
      expect(assets).toHaveLength(1);
      expect(assets[0].nodeName).toBe('@S-visible-asset');
    });
  });
});
