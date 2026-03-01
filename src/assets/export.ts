/**
 * Top-level asset export orchestrator.
 *
 * Ties together: identify assets -> batch Figma API calls for render URLs ->
 * sequential download to disk -> return result with progress feedback.
 *
 * Flow:
 * 1. Clean and recreate assets directory
 * 2. Identify exportable assets from LayoutNode tree
 * 3. Batch API calls: preview PNG (2x), SVG renders, image fills resolution
 * 4. Build download list mapping each asset to its resolved URL
 * 5. Sequential download with progress callback
 */

import type { Shell } from '../types';
import type { LayoutNode } from '../layout/types';
import type { ImageFillRef } from '../tokens/types';
import type { AssetExportProgress, ExportResult } from './types';
import { identifyAssets } from './identify';
import { detectCompositions } from './detect-composition';
import { fetchImages, fetchImageFills } from '../figma-api';
import { prepareAssetsDir, downloadFile, downloadAllAssets } from './download';

export interface ExportAssetsOptions {
  shell: Shell;
  token: string;
  fileKey: string;
  /** The node ID for preview rendering */
  selectedNodeId: string;
  /** Project root path — assets are saved to ${projectPath}/.shipstudio/assets/ */
  projectPath: string;
  rootNodes: LayoutNode[];
  imageFills: ImageFillRef[];
  onProgress?: (progress: AssetExportProgress) => void;
}

export async function exportAssets(options: ExportAssetsOptions): Promise<ExportResult> {
  const { shell, token, fileKey, selectedNodeId, projectPath, rootNodes, imageFills, onProgress } = options;
  const warnings: string[] = [];

  // 1. Create fresh assets directory inside the project
  const assetsDir = await prepareAssetsDir(shell, projectPath);

  // 2. Detect compositions and identify exportable assets
  const { compositionNodeIds, warnings: compositionWarnings } = detectCompositions(rootNodes);
  warnings.push(...compositionWarnings);
  const assetEntries = identifyAssets(rootNodes, imageFills, compositionNodeIds);

  // 3. Batch API calls for render URLs
  //    - One call for preview PNG (2x scale)
  //    - One call for all SVG assets (if any)
  //    - One call for image fills resolution (if any raster assets)
  //    - One call for png-render compositions (2x scale PNG)

  // 3a. Preview PNG
  if (onProgress) onProgress({ current: 0, total: assetEntries.length + 1, currentAsset: 'preview.png', phase: 'preview' });
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

  // 3b. SVG render URLs (batch all SVG node IDs into one API call)
  const svgEntries = assetEntries.filter(a => a.exportType === 'svg');
  let svgUrls: Record<string, string | null> = {};
  if (svgEntries.length > 0) {
    try {
      svgUrls = await fetchImages(shell, token, fileKey, svgEntries.map(a => a.nodeId), 'svg');
    } catch (err: any) {
      warnings.push(`SVG render API failed: ${err?.message || 'Unknown error'}`);
    }
  }

  // 3c. Image fills resolution (batch -- returns ALL file images, filter to our refs)
  const fillEntries = assetEntries.filter(a => a.exportType === 'png-fill');
  let fillUrls: Record<string, string> = {};
  if (fillEntries.length > 0) {
    try {
      fillUrls = await fetchImageFills(shell, token, fileKey);
    } catch (err: any) {
      warnings.push(`Image fills API failed: ${err?.message || 'Unknown error'}`);
    }
  }

  // 3d. PNG render URLs for compositions (batch at 2x scale)
  const pngRenderEntries = assetEntries.filter(a => a.exportType === 'png-render');
  let pngRenderUrls: Record<string, string | null> = {};
  if (pngRenderEntries.length > 0) {
    try {
      pngRenderUrls = await fetchImages(shell, token, fileKey, pngRenderEntries.map(a => a.nodeId), 'png', 2);
    } catch (err: any) {
      warnings.push(`Composition PNG render failed: ${err?.message || 'Unknown error'}`);
    }
  }

  // 4. Build download list: map each asset to its resolved URL
  // Track which png-render entries are composition vs component
  const compositionNodeIdSet = new Set(compositionNodeIds);
  // Note: Instance child entries always have exportType 'png-fill' and route through
  // fillEntries (resolved via imageRef). Their I-prefix node IDs (e.g., I5912:74596;5912:74456)
  // must NEVER be sent to fetchImages (/v1/images render endpoint) -- they return null.
  const downloadList: Array<{ filename: string; url: string; nodeId?: string; assetType?: 'icon' | 'image' | 'composition' | 'component'; parentInstanceId?: string }> = [];

  for (const entry of svgEntries) {
    const url = svgUrls[entry.nodeId];
    if (url) {
      downloadList.push({ filename: entry.filename, url, nodeId: entry.nodeId, assetType: 'icon' });
    } else {
      warnings.push(`No render URL for ${entry.filename} (node ${entry.nodeId})`);
    }
  }

  for (const entry of fillEntries) {
    if (entry.imageRef && fillUrls[entry.imageRef]) {
      const item: (typeof downloadList)[number] = { filename: entry.filename, url: fillUrls[entry.imageRef], nodeId: entry.nodeId, assetType: 'image' };
      if (entry.parentInstanceId) item.parentInstanceId = entry.parentInstanceId;
      downloadList.push(item);
    } else {
      warnings.push(`No download URL for image fill ${entry.filename} (ref: ${entry.imageRef})`);
    }
  }

  for (const entry of pngRenderEntries) {
    const url = pngRenderUrls[entry.nodeId];
    if (url) {
      const type = compositionNodeIdSet.has(entry.nodeId) ? 'composition' : 'component';
      downloadList.push({ filename: entry.filename, url, nodeId: entry.nodeId, assetType: type });
    } else {
      warnings.push(`No render URL for ${entry.filename} (node ${entry.nodeId})`);
    }
  }

  // 5. Sequential download with progress
  const { downloaded, warnings: dlWarnings } = await downloadAllAssets(
    shell, assetsDir, downloadList, onProgress,
  );
  warnings.push(...dlWarnings);

  return {
    assetsDir,
    previewPath,
    assets: downloaded,
    warnings,
  };
}
