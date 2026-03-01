/**
 * Asset identification pure function.
 *
 * Walks a LayoutNode tree (full depth) and produces an AssetEntry[] list of
 * nodes to export.
 *
 * - INSTANCE nodes with IMAGE fill override -> png-fill (ASSET-06)
 * - INSTANCE nodes with child IMAGE fills -> png-fill for each child image (ASSET-05)
 * - INSTANCE nodes without images -> png-render (2x), deduplicated by componentId+variant
 * - Nodes with IMAGE fills -> png-fill
 * - SVG types (VECTOR, BOOLEAN_OPERATION, etc.) -> svg
 * - Simple RECTANGLE nodes (solid-only, no strokes/effects) -> silently skipped (ASSET-07)
 * - Complex RECTANGLE nodes -> svg
 * - Composition nodes -> png-render (2x)
 */

import type { LayoutNode } from '../layout/types';
import type { ImageFillRef } from '../tokens/types';
import type { AssetEntry } from './types';
import { sanitizeFilename, resolveCollisions } from './sanitize';

const SVG_TYPES = new Set([
  'VECTOR',
  'BOOLEAN_OPERATION',
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
 * Check if a RECTANGLE node is CSS-reproducible (simple) and should be skipped.
 *
 * Returns true when: no visible strokes, no gradient fills, no image fills,
 * no visible effects, and all remaining fills are SOLID or empty.
 */
function isSimpleRectangle(node: LayoutNode): boolean {
  // Has visible strokes? Not simple
  if (node.strokes?.some((s: any) => s.visible !== false)) return false;
  // Has visible gradient fill? Not simple
  if (node.fills?.some((f: any) => f.visible !== false && f.type?.startsWith('GRADIENT_'))) return false;
  // Has image fill? Not simple
  if (hasImageFill(node)) return false;
  // Has visible effects (shadows, blurs)? Not simple
  if (node.effects?.some((e: any) => e.visible !== false)) return false;
  // All remaining fills are SOLID or empty -- simple, CSS-reproducible
  return true;
}

/**
 * Recursively find IMAGE fills in instance children at full depth.
 * Only collects IMAGE fills -- no SVGs, rectangles, or other asset types.
 * Deduplicates by imageRef via the shared seenImageRefs set.
 */
function findImageFillsInChildren(
  node: LayoutNode,
  imageFillMap: Map<string, string>,
  matchedNodeIds: Set<string>,
  seenImageRefs: Set<string>,
): AssetEntry[] {
  const results: AssetEntry[] = [];
  if (!node.children) return results;

  for (const child of node.children) {
    if (hasImageFill(child)) {
      const imageRef = imageFillMap.get(child.id) ?? getImageRefFromFills(child);
      // Dedup by imageRef -- same image across instances exported once
      if (imageRef && !seenImageRefs.has(imageRef)) {
        seenImageRefs.add(imageRef);
        if (imageFillMap.has(child.id)) matchedNodeIds.add(child.id);
        results.push({
          nodeId: child.id,
          nodeName: child.name,
          exportType: 'png-fill',
          filename: sanitizeFilename(child.name) + '.png',
          imageRef,
        });
      }
    }
    // Recurse deeper (full depth, no limit)
    results.push(...findImageFillsInChildren(child, imageFillMap, matchedNodeIds, seenImageRefs));
  }

  return results;
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
  seenSvgNames: Set<string>,
  seenImageRefs: Set<string>,
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

  // INSTANCE nodes -- check for IMAGE fills before falling back to png-render
  if (node.type === 'INSTANCE' && node.componentRef) {
    // ASSET-06: Check instance node itself for IMAGE fill override
    if (hasImageFill(node)) {
      const imageRef = imageFillMap.get(node.id) ?? getImageRefFromFills(node);
      if (imageFillMap.has(node.id)) matchedNodeIds.add(node.id);
      // Dedup by imageRef
      if (imageRef && seenImageRefs.has(imageRef)) return;
      if (imageRef) seenImageRefs.add(imageRef);
      entries.push({
        nodeId: node.id,
        nodeName: node.name,
        exportType: 'png-fill',
        filename: sanitizeFilename(node.name) + '.png',
        imageRef,
      });
      // Don't also export as png-render -- fill override replaces component render
      return;
    }

    // ASSET-05: Recurse into children to find IMAGE fills
    const childImages = findImageFillsInChildren(node, imageFillMap, matchedNodeIds, seenImageRefs);
    // Tag child images with parentInstanceId for layout tree cross-referencing
    for (const img of childImages) {
      img.parentInstanceId = node.id;
    }

    // Instance component dedup
    const key = instanceDedupKey(node);
    if (!seenInstances.has(key)) {
      seenInstances.add(key);
      // Only export as png-render if no child images found (existing behavior)
      if (childImages.length === 0) {
        entries.push({
          nodeId: node.id,
          nodeName: node.componentRef.componentName,
          exportType: 'png-render',
          filename: sanitizeFilename(node.componentRef.componentName) + '.png',
        });
      }
    }

    // Add child image entries
    for (const img of childImages) {
      entries.push(img);
    }

    return;
  }

  // Nodes with IMAGE fills -> png-fill
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

  // LINE nodes are CSS borders -- skip as assets
  if (node.type === 'LINE') return;

  // SVG types (simple vectors) -- deduplicate by sanitized name
  if (SVG_TYPES.has(node.type)) {
    const filename = sanitizeFilename(node.name) + '.svg';
    if (!seenSvgNames.has(filename)) {
      seenSvgNames.add(filename);
      entries.push({
        nodeId: node.id,
        nodeName: node.name,
        exportType: 'svg',
        filename,
      });
    }
    return;
  }

  // RECTANGLE -- skip simple (CSS-reproducible), export complex as SVG (ASSET-07)
  if (node.type === 'RECTANGLE') {
    if (isSimpleRectangle(node)) return; // Silent omission
    const filename = sanitizeFilename(node.name) + '.svg';
    if (!seenSvgNames.has(filename)) {
      seenSvgNames.add(filename);
      entries.push({
        nodeId: node.id,
        nodeName: node.name,
        exportType: 'svg',
        filename,
      });
    }
    return;
  }

  // Recurse into children for container types
  if (node.children) {
    for (const child of node.children) {
      walkTree(child, imageFillMap, matchedNodeIds, entries, compositionIds, seenInstances, seenSvgNames, seenImageRefs);
    }
  }
}

/**
 * Walk a LayoutNode tree and produce a list of assets to export.
 * Full-depth recursive walk. Instances deduplicated by componentId+variant.
 * Instance children recursed for IMAGE fill detection (ASSET-05).
 * Instance IMAGE fill overrides exported as png-fill (ASSET-06).
 * Simple rectangles silently skipped (ASSET-07).
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
  const seenSvgNames = new Set<string>();
  const seenImageRefs = new Set<string>();

  for (const rootNode of rootNodes) {
    if (!rootNode.children) continue;
    for (const child of rootNode.children) {
      walkTree(child, imageFillMap, matchedNodeIds, entries, compositionIds, seenInstances, seenSvgNames, seenImageRefs);
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
