/**
 * Asset identification pure function.
 *
 * Walks a LayoutNode tree (full depth) and produces an AssetEntry[] list of
 * nodes to export.
 *
 * - INSTANCE nodes → png-render (2x), deduplicated by componentId+variant
 * - Nodes with IMAGE fills → png-fill
 * - SVG types (VECTOR, BOOLEAN_OPERATION, etc.) → svg
 * - Composition nodes → png-render (2x)
 */

import type { LayoutNode } from '../layout/types';
import type { ImageFillRef } from '../tokens/types';
import type { AssetEntry } from './types';
import { sanitizeFilename, resolveCollisions } from './sanitize';

const SVG_TYPES = new Set([
  'VECTOR',
  'BOOLEAN_OPERATION',
  'LINE',
  'STAR',
  'POLYGON',
  'ELLIPSE',
]);

/**
 * Check if a node has an IMAGE fill.
 */
function hasImageFill(node: LayoutNode): boolean {
  return node.fills?.some((f: any) => f.type === 'IMAGE') ?? false;
}

/**
 * Extract imageRef from the first IMAGE fill paint on a node.
 */
function getImageRefFromFills(node: LayoutNode): string | undefined {
  const imageFill = node.fills?.find((f: any) => f.type === 'IMAGE');
  return imageFill?.imageRef;
}

/**
 * Build a dedup key for component instances: componentId + sorted variant string.
 */
function instanceDedupKey(node: LayoutNode): string {
  const ref = node.componentRef!;
  const variants = ref.variantProperties
    ? Object.entries(ref.variantProperties).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join(',')
    : '';
  return `${ref.componentId}|${variants}`;
}

/**
 * Recursively walk the full tree and collect exportable assets.
 */
function walkTree(
  node: LayoutNode,
  imageFillMap: Map<string, string>,
  matchedNodeIds: Set<string>,
  entries: AssetEntry[],
  compositionIds: Set<string>,
  seenInstances: Set<string>,
): void {
  // Composition check FIRST
  if (compositionIds.has(node.id)) {
    entries.push({
      nodeId: node.id,
      nodeName: node.name,
      exportType: 'png-render',
      filename: sanitizeFilename(node.name) + '.png',
    });
    return; // Don't recurse into compositions
  }

  // INSTANCE nodes → export as PNG, deduplicated by component+variant
  if (node.type === 'INSTANCE' && node.componentRef) {
    const key = instanceDedupKey(node);
    if (!seenInstances.has(key)) {
      seenInstances.add(key);
      entries.push({
        nodeId: node.id,
        nodeName: node.componentRef.componentName,
        exportType: 'png-render',
        filename: sanitizeFilename(node.componentRef.componentName) + '.png',
      });
    }
    return; // Don't recurse into instance children
  }

  // Nodes with IMAGE fills → png-fill
  if (hasImageFill(node)) {
    const imageRef = imageFillMap.get(node.id) ?? getImageRefFromFills(node);
    if (imageFillMap.has(node.id)) {
      matchedNodeIds.add(node.id);
    }
    entries.push({
      nodeId: node.id,
      nodeName: node.name,
      exportType: 'png-fill',
      filename: sanitizeFilename(node.name) + '.png',
      imageRef,
    });
    return;
  }

  // SVG types (simple vectors)
  if (SVG_TYPES.has(node.type)) {
    entries.push({
      nodeId: node.id,
      nodeName: node.name,
      exportType: 'svg',
      filename: sanitizeFilename(node.name) + '.svg',
    });
    return;
  }

  // RECTANGLE without image fills → SVG
  if (node.type === 'RECTANGLE') {
    entries.push({
      nodeId: node.id,
      nodeName: node.name,
      exportType: 'svg',
      filename: sanitizeFilename(node.name) + '.svg',
    });
    return;
  }

  // Recurse into children for container types
  if (node.children) {
    for (const child of node.children) {
      walkTree(child, imageFillMap, matchedNodeIds, entries, compositionIds, seenInstances);
    }
  }
}

/**
 * Walk a LayoutNode tree and produce a list of assets to export.
 * Full-depth recursive walk. Instances deduplicated by componentId+variant.
 */
export function identifyAssets(
  rootNodes: LayoutNode[],
  imageFills: ImageFillRef[],
  compositionIds: Set<string> = new Set(),
): AssetEntry[] {
  const imageFillMap = new Map<string, string>();
  for (const fill of imageFills) {
    imageFillMap.set(fill.nodeId, fill.imageRef);
  }

  const entries: AssetEntry[] = [];
  const matchedNodeIds = new Set<string>();
  const seenInstances = new Set<string>();

  for (const rootNode of rootNodes) {
    if (!rootNode.children) continue;
    for (const child of rootNode.children) {
      walkTree(child, imageFillMap, matchedNodeIds, entries, compositionIds, seenInstances);
    }
  }

  // Add orphan imageFills (not matched by any walked node)
  for (const fill of imageFills) {
    if (!matchedNodeIds.has(fill.nodeId)) {
      entries.push({
        nodeId: fill.nodeId,
        nodeName: fill.nodeName,
        exportType: 'png-fill',
        filename: sanitizeFilename(fill.nodeName) + '.png',
        imageRef: fill.imageRef,
      });
    }
  }

  return resolveCollisions(entries);
}
