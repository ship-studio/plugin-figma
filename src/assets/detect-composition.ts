/**
 * Composition detection pure function.
 *
 * Walks a LayoutNode tree and identifies nodes that are complex visual
 * compositions requiring PNG export (rather than individual SVG parts).
 *
 * A node is flagged as a composition when EITHER:
 * 1. It has BOTH structural complexity AND visual effects (blendMode/mask/opacity)
 * 2. It is a "vector-only group" — a GROUP/FRAME whose entire subtree is visual
 *    primitives (no TEXT or INSTANCE children). These are illustrations/decorations
 *    that should be exported as one PNG rather than broken into dozens of SVGs.
 *
 * "Outer wins": once a node is flagged, its children are NOT recursed into
 * for further composition detection.
 */

import type { LayoutNode } from '../layout/types';

// ── Exported constants ───────────────────────────────────────────────

/** Minimum direct child count to qualify as structural complexity. */
export const CHILD_COUNT_THRESHOLD = 5;

/** Minimum nesting depth to qualify as structural complexity. */
export const NESTING_DEPTH_THRESHOLD = 3;

/** Maximum depth to scan for visual effect signals within a candidate. */
export const SCAN_DEPTH_LIMIT = 3;

/** Node types considered purely visual primitives (no semantic content). */
const VISUAL_PRIMITIVE_TYPES = new Set([
  'VECTOR',
  'ELLIPSE',
  'LINE',
  'STAR',
  'POLYGON',
  'RECTANGLE',
  'BOOLEAN_OPERATION',
  'GROUP',
  'FRAME',
]);

// ── Types ────────────────────────────────────────────────────────────

export interface CompositionDetectionResult {
  compositionNodeIds: Set<string>;
  warnings: string[];
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Detect compositions across all root nodes.
 *
 * Per the user decision, detection evaluates each direct child of each root
 * independently (per-child detection).
 */
export function detectCompositions(rootNodes: LayoutNode[]): CompositionDetectionResult {
  const compositionNodeIds = new Set<string>();
  const warnings: string[] = [];

  for (const root of rootNodes) {
    if (!root.children) continue;
    for (const child of root.children) {
      detectInNode(child, compositionNodeIds, warnings);
    }
  }

  return { compositionNodeIds, warnings };
}

// ── Internal helpers ─────────────────────────────────────────────────

/**
 * Recursively evaluate a node for composition status.
 * If flagged, adds to set and returns immediately (outer wins).
 * Otherwise recurses into children.
 */
function detectInNode(
  node: LayoutNode,
  compositions: Set<string>,
  warnings: string[],
): void {
  if (isComposition(node)) {
    compositions.add(node.id);
    // Prefer "composition" label when visual effects are present
    if (hasStructuralComplexity(node) && hasVisualEffects(node, 0)) {
      warnings.push(`Composition "${node.name}" — multi-layer group with blend/mask effects, exported as single PNG`);
    } else {
      warnings.push(`Illustration "${node.name}" — vector-only group (no text/instances), exported as single PNG`);
    }
    return; // Outer wins -- don't recurse
  }

  if (node.children) {
    for (const child of node.children) {
      detectInNode(child, compositions, warnings);
    }
  }
}

/**
 * A node is a composition if EITHER:
 * 1. It has structural complexity AND visual effects (original rule)
 * 2. It is a vector-only group (all descendants are visual primitives)
 */
function isComposition(node: LayoutNode): boolean {
  if (hasStructuralComplexity(node) && hasVisualEffects(node, 0)) return true;
  if (isVectorOnlyGroup(node)) return true;
  return false;
}

/**
 * A "vector-only group" is a GROUP or FRAME whose entire descendant tree
 * consists only of visual primitive types (no TEXT, INSTANCE, COMPONENT, etc.).
 * These are illustrations/decorations that should be exported as one PNG.
 * Requires structural complexity to avoid flagging simple 3-path icons.
 */
function isVectorOnlyGroup(node: LayoutNode): boolean {
  if (node.type !== 'GROUP' && node.type !== 'FRAME') return false;
  if (!node.children || node.children.length === 0) return false;
  if (!hasStructuralComplexity(node)) return false;
  return allDescendantsArePrimitives(node);
}

/**
 * Recursively check that ALL descendants are visual primitive types.
 */
function allDescendantsArePrimitives(node: LayoutNode): boolean {
  if (!node.children) return true;
  for (const child of node.children) {
    if (!VISUAL_PRIMITIVE_TYPES.has(child.type)) return false;
    if (!allDescendantsArePrimitives(child)) return false;
  }
  return true;
}

/**
 * Check for structural complexity signals:
 * - Direct child count >= CHILD_COUNT_THRESHOLD
 * - Node type is BOOLEAN_OPERATION
 * - Max nesting depth >= NESTING_DEPTH_THRESHOLD
 */
function hasStructuralComplexity(node: LayoutNode): boolean {
  // Direct child count
  if (node.children && node.children.length >= CHILD_COUNT_THRESHOLD) {
    return true;
  }

  // BOOLEAN_OPERATION is inherently structural
  if (node.type === 'BOOLEAN_OPERATION') {
    return true;
  }

  // Nesting depth check
  if (getMaxDepth(node, 0) >= NESTING_DEPTH_THRESHOLD) {
    return true;
  }

  return false;
}

/**
 * Check for visual effect signals by scanning the node and its descendants
 * up to SCAN_DEPTH_LIMIT levels deep.
 *
 * Visual signals:
 * - blendMode is set (already filtered to non-default during normalization)
 * - isMask === true
 * - opacity < 1 on a child
 */
function hasVisualEffects(node: LayoutNode, depth: number): boolean {
  if (depth > SCAN_DEPTH_LIMIT) return false;

  // Check this node's own visual properties
  if (node.blendMode) return true;
  if (node.isMask === true) return true;
  if (node.opacity !== undefined && node.opacity < 1) return true;

  // Recurse into children up to the scan depth limit
  if (node.children) {
    for (const child of node.children) {
      if (hasVisualEffects(child, depth + 1)) return true;
    }
  }

  return false;
}

/**
 * Compute the maximum nesting depth of a subtree.
 * A leaf node has depth 0. A node with children has depth = 1 + max child depth.
 */
function getMaxDepth(node: LayoutNode, currentDepth: number): number {
  if (!node.children || node.children.length === 0) {
    return currentDepth;
  }

  let maxDepth = currentDepth;
  for (const child of node.children) {
    const childDepth = getMaxDepth(child, currentDepth + 1);
    if (childDepth > maxDepth) {
      maxDepth = childDepth;
    }
  }

  return maxDepth;
}
