import type { DetectedAsset, ManualAsset } from './types';

/**
 * Convert detected @S- assets to the ManualAsset format consumed by exportAssets().
 * Position metadata (depth, parentPath) is dropped; lifecycle status is set to 'valid'.
 */
export function detectedToManual(detected: DetectedAsset[]): ManualAsset[] {
  return detected.map(d => ({
    nodeId: d.nodeId,
    nodeName: d.nodeName,
    filename: d.filename,
    format: d.format,
    status: 'valid' as const,
  }));
}
