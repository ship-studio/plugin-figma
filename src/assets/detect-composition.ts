/**
 * Composition detection pure function.
 *
 * Walks a LayoutNode tree and identifies nodes that are complex visual
 * compositions requiring PNG export (rather than individual SVG parts).
 *
 * A node is flagged as a composition when it has BOTH:
 * - Structural complexity (child count >= threshold, deep nesting, or BOOLEAN_OPERATION)
 * - Visual effects (non-default blendMode, isMask child, or opacity layering)
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
    warnings.push(`Auto-detected "${node.name}" as a composition`);
    return; // Outer wins -- don't recurse
  }

  if (node.children) {
    for (const child of node.children) {
      detectInNode(child, compositions, warnings);
    }
  }
}

/**
 * A node is a composition if it has BOTH structural complexity
 * AND visual effect signals.
 */
function isComposition(node: LayoutNode): boolean {
  return hasStructuralComplexity(node) && hasVisualEffects(node, 0);
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
