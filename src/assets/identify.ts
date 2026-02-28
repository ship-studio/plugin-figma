/**
 * Asset identification pure function.
 *
 * Walks a LayoutNode tree and produces an AssetEntry[] list of nodes to export.
 * SVG candidates: VECTOR, BOOLEAN_OPERATION, LINE, STAR, POLYGON, ELLIPSE,
 * RECTANGLE (without image fills), INSTANCE.
 * PNG candidates: nodes with IMAGE fills.
 *
 * Depth: top-level children + one level into containers (component-level).
 * INSTANCE nodes are leaf nodes for export -- children are not individually exported.
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

const CONTAINER_TYPES = new Set(['FRAME', 'GROUP', 'SECTION']);

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
 * Classify a single node and add it to the entries list if exportable.
 */
function classifyNode(
  child: LayoutNode,
  imageFillMap: Map<string, string>,
  matchedNodeIds: Set<string>,
  entries: AssetEntry[],
): void {
  // INSTANCE nodes -> SVG, do NOT recurse into children
  if (child.type === 'INSTANCE') {
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'svg',
      filename: sanitizeFilename(child.name) + '.svg',
    });
    return;
  }

  // Nodes with IMAGE fills -> png-fill
  if (hasImageFill(child)) {
    const imageRef = imageFillMap.get(child.id) ?? getImageRefFromFills(child);
    if (imageFillMap.has(child.id)) {
      matchedNodeIds.add(child.id);
    }
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'png-fill',
      filename: sanitizeFilename(child.name) + '.png',
      imageRef,
    });
    return;
  }

  // RECTANGLE without image fills -> SVG
  if (child.type === 'RECTANGLE') {
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'svg',
      filename: sanitizeFilename(child.name) + '.svg',
    });
    return;
  }

  // Other SVG types
  if (SVG_TYPES.has(child.type)) {
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'svg',
      filename: sanitizeFilename(child.name) + '.svg',
    });
    return;
  }

  // Container types (FRAME, GROUP, SECTION) -> recurse ONE level (component-level)
  // but do NOT recurse further
  if (CONTAINER_TYPES.has(child.type) && child.children) {
    for (const grandchild of child.children) {
      classifyNodeLeaf(grandchild, imageFillMap, matchedNodeIds, entries);
    }
  }
}

/**
 * Classify a node at component-level (no further recursion into containers).
 */
function classifyNodeLeaf(
  child: LayoutNode,
  imageFillMap: Map<string, string>,
  matchedNodeIds: Set<string>,
  entries: AssetEntry[],
): void {
  // INSTANCE nodes -> SVG
  if (child.type === 'INSTANCE') {
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'svg',
      filename: sanitizeFilename(child.name) + '.svg',
    });
    return;
  }

  // Nodes with IMAGE fills -> png-fill
  if (hasImageFill(child)) {
    const imageRef = imageFillMap.get(child.id) ?? getImageRefFromFills(child);
    if (imageFillMap.has(child.id)) {
      matchedNodeIds.add(child.id);
    }
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'png-fill',
      filename: sanitizeFilename(child.name) + '.png',
      imageRef,
    });
    return;
  }

  // RECTANGLE without image fills -> SVG
  if (child.type === 'RECTANGLE') {
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'svg',
      filename: sanitizeFilename(child.name) + '.svg',
    });
    return;
  }

  // Other SVG types
  if (SVG_TYPES.has(child.type)) {
    entries.push({
      nodeId: child.id,
      nodeName: child.name,
      exportType: 'svg',
      filename: sanitizeFilename(child.name) + '.svg',
    });
    return;
  }

  // At component-level, containers are NOT recursed further
}

/**
 * Walk a LayoutNode tree and produce a list of assets to export.
 *
 * @param rootNodes - Top-level layout nodes (e.g., frames, pages)
 * @param imageFills - Image fill references collected by Phase 3 token pipeline
 * @returns Deduplicated AssetEntry[] with sanitized filenames and collision resolution
 */
export function identifyAssets(
  rootNodes: LayoutNode[],
  imageFills: ImageFillRef[],
): AssetEntry[] {
  // Build lookup maps from imageFills
  const imageFillMap = new Map<string, string>();
  for (const fill of imageFills) {
    imageFillMap.set(fill.nodeId, fill.imageRef);
  }

  const entries: AssetEntry[] = [];
  const matchedNodeIds = new Set<string>();

  // Walk each root node's direct children (top-level)
  for (const rootNode of rootNodes) {
    if (!rootNode.children) continue;
    for (const child of rootNode.children) {
      classifyNode(child, imageFillMap, matchedNodeIds, entries);
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
