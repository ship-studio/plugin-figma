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

import type { DetectionResult } from './types';

/**
 * Scan a raw Figma tree for @S- prefixed layers and return detected assets.
 *
 * @param _rootNode - Raw Figma API node (untyped)
 * @returns Detected assets with auto-determined formats and clean filenames
 */
export function detectAssets(_rootNode: any): DetectionResult {
  return { assets: [], warnings: [] };
}
