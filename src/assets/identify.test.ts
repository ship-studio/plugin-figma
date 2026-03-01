import { describe, it, expect } from 'vitest';
import { identifyAssets } from './identify';
import type { LayoutNode } from '../layout/types';
import type { ImageFillRef } from '../tokens/types';

/** Minimal LayoutNode factory with sensible defaults. */
function node(overrides: Partial<LayoutNode> & { id: string; name: string; type: string }): LayoutNode {
  return { visible: true, ...overrides };
}

/** Wrap children in a root FRAME node (identifyAssets expects rootNodes). */
function root(children: LayoutNode[]): LayoutNode {
  return node({ id: '0:0', name: 'Frame', type: 'FRAME', children });
}

describe('identifyAssets', () => {
  describe('SVG candidates', () => {
    it('identifies VECTOR node at top level as SVG', () => {
      const result = identifyAssets([root([
        node({ id: '1:1', name: 'Arrow', type: 'VECTOR' }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
      expect(result[0].filename).toBe('arrow.svg');
      expect(result[0].nodeId).toBe('1:1');
    });

    it('identifies BOOLEAN_OPERATION as SVG', () => {
      const result = identifyAssets([root([
        node({ id: '1:2', name: 'Union', type: 'BOOLEAN_OPERATION' }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('skips LINE nodes (CSS borders, not exportable assets)', () => {
      const result = identifyAssets([root([
        node({ id: '1:3', name: 'Divider', type: 'LINE' }),
      ])], []);
      expect(result).toHaveLength(0);
    });

    it('identifies STAR as SVG', () => {
      const result = identifyAssets([root([
        node({ id: '1:4', name: 'Star', type: 'STAR' }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('identifies POLYGON as SVG', () => {
      const result = identifyAssets([root([
        node({ id: '1:5', name: 'Triangle', type: 'POLYGON' }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('identifies ELLIPSE as SVG', () => {
      const result = identifyAssets([root([
        node({ id: '1:6', name: 'Circle', type: 'ELLIPSE' }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('skips simple RECTANGLE with only solid fills (ASSET-07: CSS-reproducible)', () => {
      const result = identifyAssets([root([
        node({ id: '1:7', name: 'Box', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } }] }),
      ])], []);
      expect(result).toHaveLength(0);
    });

    it('exports complex RECTANGLE (with stroke) as SVG', () => {
      const result = identifyAssets([root([
        node({
          id: '1:7b', name: 'Complex Box', type: 'RECTANGLE',
          fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } }],
          strokes: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('identifies INSTANCE with componentRef as png-render', () => {
      const result = identifyAssets([root([
        node({
          id: '1:8', name: 'Button', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-1', componentName: 'Button',
            isRemote: false, source: 'local',
          },
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-render');
      expect(result[0].filename).toBe('button.png');
    });
  });

  describe('png-fill entries (image fills)', () => {
    it('identifies RECTANGLE with IMAGE fill as png-fill', () => {
      const result = identifyAssets([root([
        node({
          id: '2:1',
          name: 'Photo',
          type: 'RECTANGLE',
          fills: [{ type: 'IMAGE', imageRef: 'abc123', scaleMode: 'FILL' }],
        }),
      ])], [{ imageRef: 'abc123', scaleMode: 'FILL', nodeId: '2:1', nodeName: 'Photo' }]);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-fill');
      expect(result[0].imageRef).toBe('abc123');
      expect(result[0].filename).toBe('photo.png');
    });

    it('matches ImageFillRef by nodeId and uses imageRef from it', () => {
      const imageFills: ImageFillRef[] = [
        { imageRef: 'ref-from-fills', scaleMode: 'FILL', nodeId: '2:2', nodeName: 'Banner' },
      ];
      const result = identifyAssets([root([
        node({
          id: '2:2',
          name: 'Banner',
          type: 'RECTANGLE',
          fills: [{ type: 'IMAGE', imageRef: 'ref-from-fills', scaleMode: 'FILL' }],
        }),
      ])], imageFills);
      expect(result).toHaveLength(1);
      expect(result[0].imageRef).toBe('ref-from-fills');
    });

    it('extracts imageRef from fill paint when not in ImageFillRef list', () => {
      const result = identifyAssets([root([
        node({
          id: '2:3',
          name: 'Orphan Image',
          type: 'RECTANGLE',
          fills: [{ type: 'IMAGE', imageRef: 'direct-ref', scaleMode: 'FIT' }],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-fill');
      expect(result[0].imageRef).toBe('direct-ref');
    });
  });

  describe('depth control', () => {
    it('scans direct children of root nodes (top-level)', () => {
      const result = identifyAssets([root([
        node({ id: '3:1', name: 'Icon A', type: 'VECTOR' }),
        node({ id: '3:2', name: 'Icon B', type: 'VECTOR' }),
      ])], []);
      expect(result).toHaveLength(2);
    });

    it('recurses one level into FRAME children (component-level)', () => {
      const result = identifyAssets([root([
        node({
          id: '3:3',
          name: 'Icon Group',
          type: 'FRAME',
          children: [
            node({ id: '3:4', name: 'Nested Icon', type: 'VECTOR' }),
          ],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].nodeId).toBe('3:4');
      expect(result[0].filename).toBe('nested-icon.svg');
    });

    it('recurses into nested containers (full-depth walk)', () => {
      const result = identifyAssets([root([
        node({
          id: '3:5',
          name: 'Card',
          type: 'FRAME',
          children: [
            node({
              id: '3:6',
              name: 'Inner Group',
              type: 'GROUP',
              children: [
                node({ id: '3:7', name: 'Deep Vector', type: 'VECTOR' }),
              ],
            }),
          ],
        }),
      ])], []);
      // Full-depth walk finds deeply nested vectors
      expect(result).toHaveLength(1);
      expect(result[0].nodeId).toBe('3:7');
    });

    it('does NOT recurse into INSTANCE children', () => {
      const result = identifyAssets([root([
        node({
          id: '3:8',
          name: 'Button Instance',
          type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-btn', componentName: 'Button',
            isRemote: false, source: 'local',
          },
          children: [
            node({ id: '3:9', name: 'Internal Vector', type: 'VECTOR' }),
            node({ id: '3:10', name: 'Internal Text', type: 'TEXT' }),
          ],
        }),
      ])], []);
      // INSTANCE exported as png-render, children NOT individually exported
      expect(result).toHaveLength(1);
      expect(result[0].nodeId).toBe('3:8');
      expect(result[0].exportType).toBe('png-render');
    });
  });

  describe('multiple root nodes', () => {
    it('scans all root nodes', () => {
      const result = identifyAssets([
        root([node({ id: '4:1', name: 'A', type: 'VECTOR' })]),
        root([node({ id: '4:2', name: 'B', type: 'ELLIPSE' })]),
      ], []);
      expect(result).toHaveLength(2);
    });
  });

  describe('hidden nodes', () => {
    it('still exports hidden nodes (visible: false)', () => {
      const result = identifyAssets([root([
        node({ id: '5:1', name: 'Hidden Icon', type: 'VECTOR', visible: false }),
      ])], []);
      expect(result).toHaveLength(1);
    });
  });

  describe('orphan image fills', () => {
    it('adds orphan imageFills not matched by any walked node', () => {
      const imageFills: ImageFillRef[] = [
        { imageRef: 'orphan-ref', scaleMode: 'FILL', nodeId: '99:99', nodeName: 'Background' },
      ];
      const result = identifyAssets([root([
        node({ id: '6:1', name: 'Icon', type: 'VECTOR' }),
      ])], imageFills);
      // 1 SVG icon + 1 orphan image fill
      expect(result).toHaveLength(2);
      const orphan = result.find((e) => e.nodeId === '99:99');
      expect(orphan).toBeDefined();
      expect(orphan!.exportType).toBe('png-fill');
      expect(orphan!.imageRef).toBe('orphan-ref');
      expect(orphan!.filename).toBe('background.png');
    });
  });

  describe('SVG deduplication', () => {
    it('deduplicates SVGs with the same sanitized name', () => {
      const result = identifyAssets([root([
        node({ id: '7:1', name: 'Icon', type: 'VECTOR' }),
        node({ id: '7:2', name: 'Icon', type: 'VECTOR' }),
        node({ id: '7:3', name: 'Icon', type: 'VECTOR' }),
      ])], []);
      // Only the first occurrence is exported
      expect(result).toHaveLength(1);
      expect(result[0].filename).toBe('icon.svg');
      expect(result[0].nodeId).toBe('7:1');
    });

    it('exports SVGs with different names', () => {
      const result = identifyAssets([root([
        node({ id: '7:4', name: 'Arrow', type: 'VECTOR' }),
        node({ id: '7:5', name: 'Star', type: 'STAR' }),
        node({ id: '7:6', name: 'Arrow', type: 'VECTOR' }),
      ])], []);
      expect(result).toHaveLength(2);
      expect(result.map(e => e.filename)).toEqual(['arrow.svg', 'star.svg']);
    });
  });

  describe('sanitized filenames', () => {
    it('applies sanitizeFilename to node names', () => {
      const result = identifyAssets([root([
        node({ id: '8:1', name: 'Icon / Arrow Right', type: 'VECTOR' }),
      ])], []);
      expect(result[0].filename).toBe('icon-arrow-right.svg');
    });
  });

  describe('composition detection (compositionIds)', () => {
    it('classifies a top-level node in compositionIds as png-render', () => {
      const compositionIds = new Set(['9:1']);
      const result = identifyAssets([root([
        node({ id: '9:1', name: 'Illustration', type: 'FRAME', children: [
          node({ id: '9:2', name: 'Shape', type: 'VECTOR' }),
          node({ id: '9:3', name: 'Mask', type: 'ELLIPSE' }),
        ] }),
      ])], [], compositionIds);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-render');
      expect(result[0].filename).toBe('illustration.png');
      expect(result[0].nodeId).toBe('9:1');
    });

    it('does NOT recurse into children of composition nodes', () => {
      const compositionIds = new Set(['9:4']);
      const result = identifyAssets([root([
        node({ id: '9:4', name: 'Complex', type: 'FRAME', children: [
          node({ id: '9:5', name: 'Inner Vector', type: 'VECTOR' }),
          node({ id: '9:6', name: 'Inner Image', type: 'RECTANGLE', fills: [{ type: 'IMAGE', imageRef: 'ref1', scaleMode: 'FILL' }] }),
        ] }),
      ])], [], compositionIds);
      // Only the composition parent, not its children
      expect(result).toHaveLength(1);
      expect(result[0].nodeId).toBe('9:4');
    });

    it('composition check happens BEFORE INSTANCE classification', () => {
      const compositionIds = new Set(['9:7']);
      const result = identifyAssets([root([
        node({ id: '9:7', name: 'Widget', type: 'INSTANCE' }),
      ])], [], compositionIds);
      // Should be png-render, not svg (INSTANCE default)
      expect(result[0].exportType).toBe('png-render');
      expect(result[0].filename).toBe('widget.png');
    });

    it('composition check works at component-level (inside a container)', () => {
      const compositionIds = new Set(['9:10']);
      const result = identifyAssets([root([
        node({ id: '9:8', name: 'Card', type: 'FRAME', children: [
          node({ id: '9:9', name: 'Icon', type: 'VECTOR' }),
          node({ id: '9:10', name: 'Nested Comp', type: 'FRAME', children: [
            node({ id: '9:11', name: 'Deep Vector', type: 'VECTOR' }),
          ] }),
        ] }),
      ])], [], compositionIds);
      expect(result).toHaveLength(2); // Icon SVG + Nested Comp png-render
      const comp = result.find(e => e.nodeId === '9:10');
      expect(comp).toBeDefined();
      expect(comp!.exportType).toBe('png-render');
    });

    it('existing tests still pass with default empty compositionIds', () => {
      // Verify backward compat: identifyAssets without third param
      const result = identifyAssets([root([
        node({ id: '10:1', name: 'Arrow', type: 'VECTOR' }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });
  });

  describe('ASSET-07: simple rectangle filtering', () => {
    it('silently skips a simple solid-color rectangle (no strokes, no gradients, no effects)', () => {
      const result = identifyAssets([root([
        node({
          id: '11:1', name: 'Background', type: 'RECTANGLE',
          fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }],
        }),
      ])], []);
      expect(result).toHaveLength(0);
    });

    it('silently skips a rectangle with no fills at all', () => {
      const result = identifyAssets([root([
        node({ id: '11:2', name: 'Empty Box', type: 'RECTANGLE', fills: [] }),
      ])], []);
      expect(result).toHaveLength(0);
    });

    it('silently skips a rectangle with undefined fills', () => {
      const result = identifyAssets([root([
        node({ id: '11:3', name: 'No Fills', type: 'RECTANGLE' }),
      ])], []);
      expect(result).toHaveLength(0);
    });

    it('exports rectangle with visible stroke as SVG', () => {
      const result = identifyAssets([root([
        node({
          id: '11:4', name: 'Bordered Box', type: 'RECTANGLE',
          fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } }],
          strokes: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 }, visible: true }],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('exports rectangle with gradient fill as SVG', () => {
      const result = identifyAssets([root([
        node({
          id: '11:5', name: 'Gradient Box', type: 'RECTANGLE',
          fills: [{ type: 'GRADIENT_LINEAR', visible: true }],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('exports rectangle with visible effects (shadow) as SVG', () => {
      const result = identifyAssets([root([
        node({
          id: '11:6', name: 'Shadow Box', type: 'RECTANGLE',
          fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }],
          effects: [{ type: 'DROP_SHADOW', visible: true }],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('skips rectangle with stroke that has visible: false (invisible stroke)', () => {
      const result = identifyAssets([root([
        node({
          id: '11:7', name: 'Hidden Stroke Box', type: 'RECTANGLE',
          fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }],
          strokes: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 }, visible: false }],
        }),
      ])], []);
      expect(result).toHaveLength(0);
    });

    it('skips rectangle with effect that has visible: false (invisible effect)', () => {
      const result = identifyAssets([root([
        node({
          id: '11:8', name: 'Hidden Effect Box', type: 'RECTANGLE',
          fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }],
          effects: [{ type: 'DROP_SHADOW', visible: false }],
        }),
      ])], []);
      expect(result).toHaveLength(0);
    });

    it('still exports rectangle with IMAGE fill as png-fill (not filtered)', () => {
      const result = identifyAssets([root([
        node({
          id: '11:9', name: 'Image Rect', type: 'RECTANGLE',
          fills: [{ type: 'IMAGE', imageRef: 'img-ref', scaleMode: 'FILL' }],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-fill');
    });

    it('exports rectangle with GRADIENT_RADIAL fill as SVG', () => {
      const result = identifyAssets([root([
        node({
          id: '11:10', name: 'Radial Box', type: 'RECTANGLE',
          fills: [{ type: 'GRADIENT_RADIAL', visible: true }],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('svg');
    });

    it('skips rectangle where fill has visible: false gradient (hidden gradient is simple)', () => {
      const result = identifyAssets([root([
        node({
          id: '11:11', name: 'Hidden Gradient', type: 'RECTANGLE',
          fills: [{ type: 'GRADIENT_LINEAR', visible: false }],
        }),
      ])], []);
      expect(result).toHaveLength(0);
    });
  });

  describe('ASSET-06: instance IMAGE fill override', () => {
    it('exports instance with IMAGE fill as png-fill using instance name', () => {
      const result = identifyAssets([root([
        node({
          id: '12:1', name: 'Hero Banner', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-card', componentName: 'Card',
            isRemote: false, source: 'local',
          },
          fills: [{ type: 'IMAGE', imageRef: 'hero-ref', scaleMode: 'FILL' }],
        }),
      ])], []);
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-fill');
      expect(result[0].filename).toBe('hero-banner.png');
      expect(result[0].nodeName).toBe('Hero Banner');
      expect(result[0].imageRef).toBe('hero-ref');
    });

    it('does NOT also export as png-render when instance has IMAGE fill', () => {
      const result = identifyAssets([root([
        node({
          id: '12:2', name: 'Avatar Override', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-avatar', componentName: 'Avatar',
            isRemote: false, source: 'local',
          },
          fills: [{ type: 'IMAGE', imageRef: 'avatar-ref', scaleMode: 'FILL' }],
        }),
      ])], []);
      // Only png-fill, no png-render
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-fill');
      const pngRender = result.find(e => e.exportType === 'png-render');
      expect(pngRender).toBeUndefined();
    });

    it('uses imageRef from imageFillMap when available', () => {
      const imageFills: ImageFillRef[] = [
        { imageRef: 'map-ref', scaleMode: 'FILL', nodeId: '12:3', nodeName: 'Card Image' },
      ];
      const result = identifyAssets([root([
        node({
          id: '12:3', name: 'Card Image', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-card-img', componentName: 'CardImage',
            isRemote: false, source: 'local',
          },
          fills: [{ type: 'IMAGE', imageRef: 'fill-ref', scaleMode: 'FILL' }],
        }),
      ])], imageFills);
      expect(result).toHaveLength(1);
      expect(result[0].imageRef).toBe('map-ref');
    });

    it('deduplicates instance IMAGE fill by imageRef (same imageRef exported once)', () => {
      const result = identifyAssets([root([
        node({
          id: '12:4', name: 'Card A', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-card', componentName: 'Card',
            isRemote: false, source: 'local',
          },
          fills: [{ type: 'IMAGE', imageRef: 'shared-ref', scaleMode: 'FILL' }],
        }),
        node({
          id: '12:5', name: 'Card B', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-card', componentName: 'Card',
            isRemote: false, source: 'local',
          },
          fills: [{ type: 'IMAGE', imageRef: 'shared-ref', scaleMode: 'FILL' }],
        }),
      ])], []);
      // Same imageRef -- only first exported
      expect(result).toHaveLength(1);
      expect(result[0].nodeId).toBe('12:4');
    });
  });

  describe('ASSET-05: instance child IMAGE fill detection', () => {
    // Child IMAGE fills are now pre-collected from the raw Figma tree (before normalization)
    // and passed via the imageFills parameter with parentInstanceId set.
    // The normalized tree's instance children are stripped by normalization.

    it('finds IMAGE fills in instance children (via imageFills with parentInstanceId) and exports as png-fill', () => {
      const result = identifyAssets([root([
        node({
          id: '13:1', name: 'Card Instance', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-card', componentName: 'Card',
            isRemote: false, source: 'local',
          },
        }),
      ])], [
        { imageRef: 'hero-child-ref', scaleMode: 'FILL', nodeId: 'I13:1;13:2', nodeName: 'Hero Image', parentInstanceId: '13:1' },
      ]);
      // Should find the child image, not export instance as png-render
      const pngFill = result.find(e => e.exportType === 'png-fill');
      expect(pngFill).toBeDefined();
      expect(pngFill!.nodeName).toBe('Hero Image');
      expect(pngFill!.imageRef).toBe('hero-child-ref');
      expect(pngFill!.filename).toBe('hero-image.png');
    });

    it('does NOT export instance as png-render when child images are found', () => {
      const result = identifyAssets([root([
        node({
          id: '13:4', name: 'Card', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-card2', componentName: 'ProductCard',
            isRemote: false, source: 'local',
          },
        }),
      ])], [
        { imageRef: 'product-ref', scaleMode: 'FILL', nodeId: 'I13:4;13:5', nodeName: 'Product Photo', parentInstanceId: '13:4' },
      ]);
      const pngRender = result.find(e => e.exportType === 'png-render');
      expect(pngRender).toBeUndefined();
    });

    it('skips instance with text descendants (code-reproducible) when no child images', () => {
      const instancesWithText = new Set(['13:6']);
      const result = identifyAssets([root([
        node({
          id: '13:6', name: 'Button', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-btn', componentName: 'Button',
            isRemote: false, source: 'local',
          },
        }),
      ])], [], new Set(), instancesWithText);
      // Button has text → code-reproducible → skipped entirely
      expect(result).toHaveLength(0);
    });

    it('exports decorative instance as png-render when no child images and no text', () => {
      const result = identifyAssets([root([
        node({
          id: '13:6b', name: 'Logo', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-logo', componentName: 'Logo',
            isRemote: false, source: 'local',
          },
        }),
      ])], []);
      // No child images, no text → decorative → png-render
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-render');
      expect(result[0].filename).toBe('logo.png');
    });

    it('uses pre-collected imageFills with parentInstanceId for deep nested images', () => {
      const result = identifyAssets([root([
        node({
          id: '13:9', name: 'Deep Card', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-deep', componentName: 'DeepCard',
            isRemote: false, source: 'local',
          },
        }),
      ])], [
        { imageRef: 'deep-ref', scaleMode: 'FILL', nodeId: 'I13:9;13:12', nodeName: 'Deep Nested Image', parentInstanceId: '13:9' },
      ]);
      const pngFill = result.find(e => e.exportType === 'png-fill');
      expect(pngFill).toBeDefined();
      expect(pngFill!.nodeName).toBe('Deep Nested Image');
      expect(pngFill!.imageRef).toBe('deep-ref');
    });

    it('deduplicates child images by imageRef across instances', () => {
      const result = identifyAssets([root([
        node({
          id: '13:13', name: 'Card 1', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-c', componentName: 'Card',
            isRemote: false, source: 'local',
          },
        }),
        node({
          id: '13:15', name: 'Card 2', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-c', componentName: 'Card',
            isRemote: false, source: 'local',
          },
        }),
      ])], [
        { imageRef: 'same-hero-ref', scaleMode: 'FILL', nodeId: 'I13:13;13:14', nodeName: 'Hero', parentInstanceId: '13:13' },
        { imageRef: 'same-hero-ref', scaleMode: 'FILL', nodeId: 'I13:15;13:16', nodeName: 'Hero', parentInstanceId: '13:15' },
      ]);
      // Same imageRef across two instances -- only one exported
      const pngFills = result.filter(e => e.exportType === 'png-fill');
      expect(pngFills).toHaveLength(1);
      expect(pngFills[0].imageRef).toBe('same-hero-ref');
    });

    it('only extracts IMAGE fills from instance children (no SVGs)', () => {
      // Instance children are not walked in normalized tree, so SVGs inside
      // instances never appear. Only IMAGE fills come via imageFills param.
      const result = identifyAssets([root([
        node({
          id: '13:17', name: 'Widget', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-w', componentName: 'Widget',
            isRemote: false, source: 'local',
          },
        }),
      ])], [
        { imageRef: 'widget-photo', scaleMode: 'FILL', nodeId: 'I13:17;13:20', nodeName: 'Photo', parentInstanceId: '13:17' },
      ]);
      // Only the image -- no SVGs from instance children
      const svgs = result.filter(e => e.exportType === 'svg');
      expect(svgs).toHaveLength(0);
      const pngFills = result.filter(e => e.exportType === 'png-fill');
      expect(pngFills).toHaveLength(1);
      expect(pngFills[0].nodeName).toBe('Photo');
    });

    it('exports child images from both instances even when same componentId (imageRef dedup handles file dedup)', () => {
      const result = identifyAssets([root([
        node({
          id: '13:21', name: 'Card A', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-dup', componentName: 'DupCard',
            isRemote: false, source: 'local',
          },
        }),
        node({
          id: '13:23', name: 'Card B', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-dup', componentName: 'DupCard',
            isRemote: false, source: 'local',
          },
        }),
      ])], [
        { imageRef: 'unique-ref-a', scaleMode: 'FILL', nodeId: 'I13:21;13:22', nodeName: 'Image A', parentInstanceId: '13:21' },
        { imageRef: 'unique-ref-b', scaleMode: 'FILL', nodeId: 'I13:23;13:24', nodeName: 'Image B', parentInstanceId: '13:23' },
      ]);
      // unique-ref-a and unique-ref-b are different imageRefs -- both exported
      const pngFills = result.filter(e => e.exportType === 'png-fill');
      expect(pngFills).toHaveLength(2);
      expect(pngFills.map(e => e.imageRef)).toContain('unique-ref-a');
      expect(pngFills.map(e => e.imageRef)).toContain('unique-ref-b');
      // No png-render for either instance
      const pngRenders = result.filter(e => e.exportType === 'png-render');
      expect(pngRenders).toHaveLength(0);
    });

    it('handles instance with both own IMAGE fill and child IMAGE fills (own fill takes priority)', () => {
      const result = identifyAssets([root([
        node({
          id: '13:25', name: 'Bg Instance', type: 'INSTANCE',
          componentRef: {
            componentId: 'comp-bg', componentName: 'BgCard',
            isRemote: false, source: 'local',
          },
          fills: [{ type: 'IMAGE', imageRef: 'bg-ref', scaleMode: 'FILL' }],
        }),
      ])], [
        { imageRef: 'inner-ref', scaleMode: 'FILL', nodeId: 'I13:25;13:26', nodeName: 'Inner Photo', parentInstanceId: '13:25' },
      ]);
      // Instance's own IMAGE fill takes priority, no child recursion
      expect(result).toHaveLength(1);
      expect(result[0].exportType).toBe('png-fill');
      expect(result[0].imageRef).toBe('bg-ref');
      expect(result[0].nodeName).toBe('Bg Instance');
    });
  });
});
