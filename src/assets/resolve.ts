/**
 * Node resolution and asset derivation for manual asset control (v2.0).
 *
 * Pure functions that convert a Figma node URL into a validated ManualAsset
 * with auto-derived filename and suggested format. This is the data foundation
 * for the manual asset pipeline -- every downstream phase consumes ManualAsset.
 */

import { sanitizeFilename } from './sanitize';
import { GENERIC_NAME_PATTERN } from './breadcrumb';
import { fetchFileNodes } from '../figma-api';
import type { ManualAsset } from './types';
import type { Shell } from '../types';

// ── Constants ───────────────────────────────────────────────────────

/** Figma node types that are inherently vector and export best as SVG. */
const VECTOR_NODE_TYPES = new Set([
  'VECTOR',
  'LINE',
  'STAR',
  'ELLIPSE',
  'REGULAR_POLYGON',
  'BOOLEAN_OPERATION',
]);

// ── I-Prefix Detection (AINP-05) ───────────────────────────────────

/**
 * Check if a node ID is an instance child (I-prefix format).
 *
 * Instance child IDs look like "I20:1;20:2" -- they start with "I"
 * and contain a semicolon separating parent and child IDs.
 * These nodes cannot be rendered by the Figma Images API.
 */
export function isInstanceChildId(nodeId: string): boolean {
  return nodeId.startsWith('I');
}

/**
 * Extract the parent instance's node ID from an I-prefix child ID.
 *
 * "I20:1;20:2" -> "20:1" (the parent INSTANCE node)
 * "12:34" -> null (not an instance child)
 * "Ifoo" -> null (no semicolon, invalid format)
 */
export function extractParentInstanceId(nodeId: string): string | null {
  if (!nodeId.startsWith('I')) return null;

  const withoutPrefix = nodeId.slice(1); // strip leading 'I'
  const semiIndex = withoutPrefix.indexOf(';');
  if (semiIndex === -1) return null;

  return withoutPrefix.slice(0, semiIndex);
}

// ── Format Suggestion (AINP-06) ─────────────────────────────────────

/**
 * Suggest an export format based on the Figma node type.
 *
 * Vector primitives (VECTOR, LINE, STAR, etc.) -> 'svg'
 * Everything else (FRAME, GROUP, COMPONENT, TEXT, etc.) -> 'png'
 *
 * User can override this after derivation.
 */
export function suggestFormat(nodeType: string): 'png' | 'svg' {
  return VECTOR_NODE_TYPES.has(nodeType) ? 'svg' : 'png';
}

// ── Filename Collision Resolution (NAME-02) ─────────────────────────

/**
 * Resolve a filename collision against a list of existing filenames.
 *
 * If the candidate is unique, returns it as-is. Otherwise appends
 * -2, -3, etc. before the extension until a unique name is found.
 *
 * "icon.png" + ["icon.png"] -> "icon-2.png"
 * "icon.png" + ["icon.png", "icon-2.png"] -> "icon-3.png"
 * "icon.svg" + ["icon.png"] -> "icon.svg" (no collision)
 */
export function resolveFilenameCollision(
  candidateFilename: string,
  existingFilenames: string[],
): string {
  if (!existingFilenames.includes(candidateFilename)) {
    return candidateFilename;
  }

  const dotIndex = candidateFilename.lastIndexOf('.');
  const hasExtension = dotIndex !== -1;
  const base = hasExtension ? candidateFilename.slice(0, dotIndex) : candidateFilename;
  const ext = hasExtension ? candidateFilename.slice(dotIndex) : '';

  let counter = 2;
  while (existingFilenames.includes(`${base}-${counter}${ext}`)) {
    counter++;
  }

  return `${base}-${counter}${ext}`;
}

// ── Asset Derivation (NAME-01, NAME-02, AINP-06) ───────────────────

/**
 * Derive a ManualAsset from a Figma node's metadata.
 *
 * Auto-derives:
 * - format from node type (svg for vectors, png for everything else)
 * - filename from sanitized node name + format extension
 * - collision resolution against existing assets
 * - warning for generic Figma auto-names (Frame 427, Group, etc.)
 */
export function deriveAssetFromNode(
  nodeId: string,
  nodeName: string,
  nodeType: string,
  existingAssets: ManualAsset[],
): ManualAsset {
  const format = suggestFormat(nodeType);
  const baseName = sanitizeFilename(nodeName);
  const candidate = `${baseName}.${format}`;

  const existingFilenames = existingAssets.map((a) => a.filename);
  const filename = resolveFilenameCollision(candidate, existingFilenames);

  // Warn about generic Figma auto-generated names (use final filename per Pitfall 5)
  const warning = GENERIC_NAME_PATTERN.test(nodeName)
    ? `Auto-named: ${filename} -- consider renaming`
    : undefined;

  return {
    nodeId,
    nodeName,
    filename,
    format,
    status: 'valid',
    warning,
  };
}

// ── Node Resolution (async, uses Figma API) ─────────────────────────

/**
 * Resolve a Figma node ID into a fully populated ManualAsset.
 *
 * Calls the Figma API to fetch the node's name and type, then
 * derives the asset entry. On API failure, returns an error asset.
 */
export async function resolveNode(
  shell: Shell,
  token: string,
  fileKey: string,
  nodeId: string,
  existingAssets: ManualAsset[],
): Promise<ManualAsset> {
  try {
    const { rootNode } = await fetchFileNodes(shell, token, fileKey, nodeId);
    return deriveAssetFromNode(nodeId, rootNode.name, rootNode.type, existingAssets);
  } catch (err) {
    return {
      nodeId,
      nodeName: '',
      filename: '',
      format: 'png',
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
