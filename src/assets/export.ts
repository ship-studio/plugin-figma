/**
 * Top-level asset export orchestrator.
 *
 * Exports a 2x preview PNG of the selected node plus any user-specified
 * manual assets. Manual assets are partitioned by format (PNG/SVG) and
 * rendered via one Figma API call per format batch. Per-asset failures
 * (null render URLs, download errors) produce warnings without blocking
 * other assets.
 *
 * Flow:
 * 1. Clean and recreate assets directory
 * 2. Fetch and download preview PNG (2x scale)
 * 3. Partition manual assets by format, fetch render URLs per batch
 * 4. Download each asset, collecting warnings for failures
 * 5. Return ExportResult with downloaded files and warnings
 */

import type { Shell } from '../types';
import type { AssetExportProgress, ExportResult, ManualAsset } from './types';
import { fetchImages } from '../figma-api';
import { prepareAssetsDir, downloadFile } from './download';

export interface ExportAssetsOptions {
  shell: Shell;
  token: string;
  fileKey: string;
  /** The node ID for preview rendering */
  selectedNodeId: string;
  /** Project root path -- assets are saved to ${projectPath}/.shipstudio/assets/ */
  projectPath: string;
  /** User-selected assets to export alongside the preview */
  manualAssets?: ManualAsset[];
  onProgress?: (progress: AssetExportProgress) => void;
}

/**
 * Look up a render URL in a fetchImages response map, trying three key
 * variants to handle encoding mismatches from the Figma API.
 */
function lookupUrl(urlMap: Record<string, string | null>, nodeId: string): string | null {
  return urlMap[nodeId] ?? urlMap[encodeURIComponent(nodeId)] ?? urlMap[decodeURIComponent(nodeId)] ?? null;
}

export async function exportAssets(options: ExportAssetsOptions): Promise<ExportResult> {
  const { shell, token, fileKey, selectedNodeId, projectPath, manualAssets = [], onProgress } = options;
  const warnings: string[] = [];

  // Filter to only valid assets (skip error/resolving)
  const validAssets = manualAssets.filter(a => a.status === 'valid');
  const totalSteps = validAssets.length + 1; // +1 for preview

  // 1. Create fresh assets directory inside the project
  const assetsDir = await prepareAssetsDir(shell, projectPath);

  // 2. Preview PNG (step 0)
  if (onProgress) onProgress({ current: 0, total: totalSteps, currentAsset: 'preview.png', phase: 'preview' });
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

  // 3. Partition manual assets by format
  const pngAssets = validAssets.filter(a => a.format === 'png');
  const svgAssets = validAssets.filter(a => a.format === 'svg');

  // Fetch render URLs per format batch
  let pngUrlMap: Record<string, string | null> = {};
  let svgUrlMap: Record<string, string | null> = {};

  if (pngAssets.length > 0) {
    try {
      pngUrlMap = await fetchImages(shell, token, fileKey, pngAssets.map(a => a.nodeId), 'png', 2);
    } catch (err: any) {
      warnings.push(`PNG batch render failed: ${err?.message || 'Unknown error'}`);
      pngUrlMap = {};
    }
  }

  if (svgAssets.length > 0) {
    try {
      svgUrlMap = await fetchImages(shell, token, fileKey, svgAssets.map(a => a.nodeId), 'svg');
    } catch (err: any) {
      warnings.push(`SVG batch render failed: ${err?.message || 'Unknown error'}`);
      svgUrlMap = {};
    }
  }

  // 4. Download each asset
  const downloaded: ExportResult['assets'] = [];
  const allAssets = [...pngAssets, ...svgAssets];

  for (let i = 0; i < allAssets.length; i++) {
    const asset = allAssets[i];
    const urlMap = asset.format === 'png' ? pngUrlMap : svgUrlMap;

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: totalSteps,
        currentAsset: asset.filename,
        phase: 'assets',
      });
    }

    const url = lookupUrl(urlMap, asset.nodeId);
    if (!url) {
      warnings.push(`Failed to render ${asset.filename}: Figma returned no image for node ${asset.nodeId}`);
      continue;
    }

    const outputPath = `${assetsDir}/${asset.filename}`;
    const result = await downloadFile(shell, url, outputPath);
    if (!result.success) {
      warnings.push(`Failed to download ${asset.filename}: ${result.error}`);
      continue;
    }

    downloaded.push({
      filename: asset.filename,
      path: outputPath,
      nodeId: asset.nodeId,
      assetType: asset.format === 'svg' ? 'icon' : 'image',
    });
  }

  return {
    assetsDir,
    previewPath,
    assets: downloaded,
    warnings,
  };
}
