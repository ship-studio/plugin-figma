/**
 * Top-level asset export orchestrator.
 *
 * Currently preview-only: generates a 2x PNG preview of the selected node.
 * Asset identification and batch download have been removed as part of the
 * manual asset pipeline migration (Phase 15). Phase 17 will refactor this
 * to accept ManualAsset[].
 *
 * Flow:
 * 1. Clean and recreate assets directory
 * 2. Fetch and download preview PNG (2x scale)
 * 3. Return result with empty assets array
 */

import type { Shell } from '../types';
import type { AssetExportProgress, ExportResult } from './types';
import { fetchImages } from '../figma-api';
import { prepareAssetsDir, downloadFile } from './download';

export interface ExportAssetsOptions {
  shell: Shell;
  token: string;
  fileKey: string;
  /** The node ID for preview rendering */
  selectedNodeId: string;
  /** Project root path — assets are saved to ${projectPath}/.shipstudio/assets/ */
  projectPath: string;
  onProgress?: (progress: AssetExportProgress) => void;
}

export async function exportAssets(options: ExportAssetsOptions): Promise<ExportResult> {
  const { shell, token, fileKey, selectedNodeId, projectPath, onProgress } = options;
  const warnings: string[] = [];

  // 1. Create fresh assets directory inside the project
  const assetsDir = await prepareAssetsDir(shell, projectPath);

  // 2. Preview PNG
  if (onProgress) onProgress({ current: 0, total: 1, currentAsset: 'preview.png', phase: 'preview' });
  let previewPath = `${assetsDir}/preview.png`;
  try {
    const previewUrls = await fetchImages(shell, token, fileKey, [selectedNodeId], 'png', 2);
    const previewUrl = previewUrls[selectedNodeId];
    if (previewUrl) {
      const result = await downloadFile(shell, previewUrl, previewPath);
      if (!result.success) {
        warnings.push(`Preview download failed: ${result.error}`);
        previewPath = '';
      }
    } else {
      warnings.push('Figma could not render preview for this node');
      previewPath = '';
    }
  } catch (err: any) {
    warnings.push(`Preview render failed: ${err?.message || 'Unknown error'}`);
    previewPath = '';
  }

  return {
    assetsDir,
    previewPath,
    assets: [],
    warnings,
  };
}
