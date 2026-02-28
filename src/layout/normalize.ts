/**
 * Recursive tree normalization from Figma Node to LayoutNode.
 *
 * Walks the Figma API node tree, dispatching on node type to build a
 * normalized LayoutNode tree expressed in CSS flexbox terms. Handles
 * component instances as leaf nodes, boolean operations as leaf nodes,
 * hidden nodes as visible=false, and SLICE nodes as filtered out.
 */

import type { LayoutNode, ComponentRef, ExtractionResult } from './types';
import { mapToFlexbox } from './flexbox-map';

/**
 * Build a ComponentRef from a Figma INSTANCE node and the components map.
 *
 * @param instance - Figma INSTANCE node
 * @param components - Components map from API response (keyed by componentId)
 */
function buildComponentRef(instance: any, components: Record<string, any>): ComponentRef {
  const meta = components[instance.componentId];

  // Extract variant properties from componentProperties
  let variantProperties: Record<string, string | boolean> | undefined;
  if (instance.componentProperties) {
    const props: Record<string, string | boolean> = {};
    for (const [key, prop] of Object.entries<any>(instance.componentProperties)) {
      if (prop.type === 'VARIANT' || prop.type === 'BOOLEAN' || prop.type === 'TEXT') {
        props[key] = prop.value;
      }
    }
    if (Object.keys(props).length > 0) {
      variantProperties = props;
    }
  }

  const ref: ComponentRef = {
    componentId: instance.componentId,
    componentName: meta?.name ?? instance.name,
    isRemote: meta?.remote ?? false,
    source: meta?.remote ? 'library' : 'local',
  };

  // Only include description if it's a non-empty string
  if (meta?.description) {
    ref.description = meta.description;
  }

  if (variantProperties) {
    ref.variantProperties = variantProperties;
  }

  // Include overrides if present
  if (instance.overrides) {
    ref.overrides = instance.overrides;
  }

  return ref;
}

/**
 * Normalize a single Figma node into a LayoutNode.
 *
 * @param figmaNode - Raw Figma API node object
 * @param components - Components map from API response
 * @param depth - Current recursion depth
 * @returns Normalized LayoutNode, or null for skipped node types (SLICE)
 */
export function normalizeNode(
  figmaNode: any,
  components: Record<string, any>,
  depth: number,
): LayoutNode | null {
  const node = figmaNode;

  // Skip SLICE nodes (export regions, not layout)
  if (node.type === 'SLICE') return null;

  // Build base LayoutNode
  const result: LayoutNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible !== false, // defaults to true when undefined
  };

  // Dimensions from absoluteBoundingBox (may be null for hidden nodes)
  if (node.absoluteBoundingBox != null) {
    result.width = node.absoluteBoundingBox.width;
    result.height = node.absoluteBoundingBox.height;
  } else if (node.size != null) {
    // Fallback to size property (Vector with x, y = width, height)
    result.width = node.size.x;
    result.height = node.size.y;
  }

  // Sizing modes from HasLayoutTrait
  if ('layoutSizingHorizontal' in node) {
    result.widthMode = node.layoutSizingHorizontal;
  }
  if ('layoutSizingVertical' in node) {
    result.heightMode = node.layoutSizingVertical;
  }

  // Absolute positioning flag (LYOT-05)
  if ('layoutPositioning' in node && node.layoutPositioning != null) {
    result.positioning = node.layoutPositioning;
  }

  // Auto-layout properties from HasFramePropertiesTrait
  if ('layoutMode' in node && node.layoutMode && node.layoutMode !== 'NONE') {
    result.autoLayout = mapToFlexbox(node);
  }

  // Constraints from HasLayoutTrait
  if ('constraints' in node && node.constraints != null) {
    result.constraints = node.constraints;
  }

  // Min/max dimensions
  if ('minWidth' in node && node.minWidth != null) result.minWidth = node.minWidth;
  if ('maxWidth' in node && node.maxWidth != null) result.maxWidth = node.maxWidth;
  if ('minHeight' in node && node.minHeight != null) result.minHeight = node.minHeight;
  if ('maxHeight' in node && node.maxHeight != null) result.maxHeight = node.maxHeight;
  if ('preserveRatio' in node && node.preserveRatio != null) result.preserveRatio = node.preserveRatio;

  // Style data capture (Phase 3 -- design token extraction)
  if ('fills' in node && Array.isArray(node.fills)) {
    result.fills = node.fills;
  }
  if ('strokes' in node && Array.isArray(node.strokes)) {
    result.strokes = node.strokes;
  }
  if ('strokeWeight' in node && node.strokeWeight != null) {
    result.strokeWeight = node.strokeWeight;
  }
  if ('effects' in node && Array.isArray(node.effects)) {
    result.effects = node.effects;
  }
  if ('cornerRadius' in node && node.cornerRadius != null) {
    result.cornerRadius = node.cornerRadius;
  }
  if ('rectangleCornerRadii' in node && Array.isArray(node.rectangleCornerRadii)) {
    result.rectangleCornerRadii = node.rectangleCornerRadii;
  }
  if ('opacity' in node && node.opacity != null && node.opacity !== 1) {
    result.opacity = node.opacity;
  }
  if ('styles' in node && node.styles) {
    result.styleRefs = node.styles;
  }

  // Dispatch by type for specialized handling
  switch (node.type) {
    case 'TEXT':
      result.textContent = node.characters;
      if (node.style) {
        result.textStyle = node.style;
      }
      if (node.styleOverrideTable && Object.keys(node.styleOverrideTable).length > 0) {
        result.textStyleOverrides = node.styleOverrideTable;
      }
      break;

    case 'INSTANCE':
      result.componentRef = buildComponentRef(node, components);
      // Do NOT recurse into children -- instances are leaf nodes
      return result;

    case 'BOOLEAN_OPERATION':
      // Treat as leaf node -- don't recurse into constituent shapes
      return result;
  }

  // Recurse into children for FRAME, GROUP, COMPONENT, SECTION, etc.
  if ('children' in node && Array.isArray(node.children)) {
    const normalizedChildren = node.children
      .map((child: any) => normalizeNode(child, components, depth + 1))
      .filter((n: LayoutNode | null): n is LayoutNode => n !== null);

    result.children = deduplicateChildren(normalizedChildren);
  }

  return result;
}

/**
 * Count all nodes in a tree (raw Figma node, before normalization).
 *
 * @param node - Any node with optional children array
 * @returns Total number of nodes including the root
 */
export function countNodes(node: any): number {
  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

/**
 * Build a fingerprint for a component instance, used for deduplication.
 * Combines componentId with sorted variant properties.
 */
function buildInstanceFingerprint(node: LayoutNode): string {
  const ref = node.componentRef!;
  const variantKey = ref.variantProperties
    ? JSON.stringify(ref.variantProperties, Object.keys(ref.variantProperties).sort())
    : '';
  return `${ref.componentId}::${variantKey}`;
}

/**
 * Deduplicate repeated identical component instances.
 *
 * Groups of 3+ identical instances (same componentId + same variant properties)
 * are collapsed to a single representative with repeatCount set.
 * Preserves original array order.
 *
 * @param children - Array of normalized LayoutNodes
 * @returns Deduplicated array
 */
export function deduplicateChildren(children: LayoutNode[]): LayoutNode[] {
  if (children.length === 0) return [];

  // Track component instance groups
  const seen = new Map<string, { node: LayoutNode; count: number; indices: number[] }>();

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.componentRef) {
      const key = buildInstanceFingerprint(child);
      const existing = seen.get(key);
      if (existing) {
        existing.count++;
        existing.indices.push(i);
      } else {
        seen.set(key, { node: child, count: 1, indices: [i] });
      }
    }
  }

  // Determine which indices to skip (duplicates in groups of 3+)
  const skipIndices = new Set<number>();

  for (const entry of seen.values()) {
    if (entry.count >= 3) {
      entry.node.repeatCount = entry.count;
      // Skip all but the first occurrence
      for (let i = 1; i < entry.indices.length; i++) {
        skipIndices.add(entry.indices[i]);
      }
    }
  }

  // Build result preserving original order
  const result: LayoutNode[] = [];
  for (let i = 0; i < children.length; i++) {
    if (!skipIndices.has(i)) {
      result.push(children[i]);
    }
  }

  return result;
}

/**
 * Normalize multiple root nodes into an ExtractionResult.
 *
 * Counts total raw nodes, normalizes each root, filters nulls,
 * and returns the extraction result.
 *
 * @param rootNodes - Raw Figma API root nodes
 * @param components - Components map from API response
 * @returns ExtractionResult with normalized nodes and count
 */
export function normalizeTree(
  rootNodes: any[],
  components: Record<string, any>,
): ExtractionResult {
  // Count total raw nodes across all roots
  let nodeCount = 0;
  for (const root of rootNodes) {
    nodeCount += countNodes(root);
  }

  // Normalize each root
  const normalized = rootNodes
    .map((root) => normalizeNode(root, components, 0))
    .filter((n): n is LayoutNode => n !== null);

  return {
    rootNodes: normalized,
    nodeCount,
    truncated: false,
  };
}
