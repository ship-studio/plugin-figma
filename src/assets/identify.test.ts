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

    it('identifies RECTANGLE without image fills as SVG', () => {
      const result = identifyAssets([root([
        node({ id: '1:7', name: 'Box', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } }] }),
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
});
