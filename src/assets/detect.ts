/**
 * @S- prefix asset detection.
 *
 * Walks a raw Figma tree, finds layers whose names start with @S-
 * (case-insensitive), auto-determines PNG vs SVG format based on
 * descendant content, and returns a typed array of detected assets
 * with clean filenames and position metadata.
 *
 * Pure function: no side effects, no API calls.
 */

import { sanitizeFilename } from './sanitize';
import { resolveFilenameCollision } from './sanitize';
import type { DetectedAsset, DetectionResult } from './types';

// ── Constants ───────────────────────────────────────────────────────

/** Matches layer names starting with @S- (case-insensitive, strict dash). */
const ASSET_PREFIX_REGEX = /^@s-/i;

// ── Internal Types ──────────────────────────────────────────────────

/** Raw detection before dedup/collision resolution. */
interface RawDetection {
  nodeId: string;
  nodeName: string;
  nameAfterPrefix: string;
  format: 'png' | 'svg';
  depth: number;
  parentPath: string[];
}

// ── Helpers ─────────────────────────────────────────────────────────

/** Check if a layer name starts with the @S- asset prefix. */
function isAssetMarker(name: string): boolean {
  return ASSET_PREFIX_REGEX.test(name);
}

/** Strip the @S- prefix from a layer name. */
function stripAssetPrefix(name: string): string {
  return name.replace(ASSET_PREFIX_REGEX, '');
}

/**
 * Check if any node in a subtree has a fill with type === 'IMAGE'.
 *
 * Recursive -- enters INSTANCE subtrees. Skips fills where
 * fill.visible === false. Fills without a visible property are
 * treated as visible (Figma API default).
 */
function subtreeHasImageFill(node: any): boolean {
  // Check this node's fills
  if (node.fills && Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.visible !== false && fill.type === 'IMAGE') {
        return true;
      }
    }
  }

  // Recurse into children (enters INSTANCE subtrees per user decision)
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (subtreeHasImageFill(child)) return true;
    }
  }

  return false;
}

// ── Tree Walker ─────────────────────────────────────────────────────

/**
 * Recursively walk the Figma tree collecting @S- prefixed layers.
 *
 * - Skips hidden layers (visible === false) entirely
 * - Tracks insideDetected to prevent nested @S- double-detection
 * - Determines format via subtreeHasImageFill check
 */
function walkForAssets(
  node: any,
  depth: number,
  parentPath: string[],
  insideDetected: boolean,
  results: RawDetection[],
  warnings: string[],
): void {
  // Skip hidden layers entirely (including all children)
  if (node.visible === false) return;

  if (isAssetMarker(node.name) && !insideDetected) {
    const nameAfterPrefix = stripAssetPrefix(node.name);

    if (!nameAfterPrefix.trim()) {
      // Empty name after prefix -- warn and skip
      warnings.push(`Skipped layer "${node.name}": empty name after @S- prefix`);
    } else {
      const format = subtreeHasImageFill(node) ? 'png' : 'svg';
      results.push({
        nodeId: node.id,
        nodeName: node.name,
        nameAfterPrefix,
        format,
        depth,
        parentPath: [...parentPath],
      });
    }

    // Mark children as inside detected subtree
    insideDetected = true;
  }

  // Recurse into children (including INSTANCE children)
  if (node.children && Array.isArray(node.children)) {
    const nextPath = [...parentPath, node.name];
    for (const child of node.children) {
      walkForAssets(child, depth + 1, nextPath, insideDetected, results, warnings);
    }
  }
}

// ── Deduplication & Collision Resolution ─────────────────────────────

/**
 * Deduplicate by sanitized filename (first wins, duplicates dropped silently),
 * then resolve remaining collisions from different original names.
 */
function deduplicateAndResolve(raws: RawDetection[]): DetectedAsset[] {
  // Phase 1: Group by sanitized filename+extension for dedup (first wins)
  const seen = new Map<string, RawDetection>();

  for (const raw of raws) {
    const baseName = sanitizeFilename(raw.nameAfterPrefix);
    const candidateFilename = `${baseName}.${raw.format}`;

    if (!seen.has(candidateFilename)) {
      seen.set(candidateFilename, raw);
    }
    // Duplicates silently dropped (per Phase 9 SVG dedup pattern)
  }

  // Phase 2: Resolve remaining collisions (different original names -> same filename)
  const filenames: string[] = [];
  const results: DetectedAsset[] = [];

  for (const [candidateFilename, raw] of seen) {
    const filename = resolveFilenameCollision(candidateFilename, filenames);
    filenames.push(filename);
    results.push({
      nodeId: raw.nodeId,
      nodeName: raw.nodeName,
      filename,
      format: raw.format,
      depth: raw.depth,
      parentPath: raw.parentPath,
    });
  }

  return results;
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Scan a raw Figma tree for @S- prefixed layers and return detected assets.
 *
 * Pure function: no side effects, no API calls. Suitable for unit testing
 * with inline fixture data.
 *
 * @param rootNode - Raw Figma API node (untyped)
 * @returns Detected assets with auto-determined formats and clean filenames
 */
export function detectAssets(rootNode: any): DetectionResult {
  const raws: RawDetection[] = [];
  const warnings: string[] = [];

  walkForAssets(rootNode, 0, [], false, raws, warnings);

  const assets = deduplicateAndResolve(raws);

  return { assets, warnings };
}
