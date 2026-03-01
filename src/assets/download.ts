/**
 * Asset download utilities.
 *
 * Handles filesystem lifecycle (clean/create assets directory) and
 * binary file downloads via shell.exec('curl', ...) with retry-once
 * and 30-second timeout per download.
 */

import type { Shell } from '../types';
import type { AssetExportProgress } from './types';

/**
 * Create a fresh .shipstudio/assets directory inside the project.
 * Removes any previous assets and recreates the directory so agents
 * can find assets relative to the project root.
 */
export async function prepareAssetsDir(shell: Shell, projectPath: string): Promise<string> {
  const assetsDir = `${projectPath}/.shipstudio/assets`;
  const rmResult = await shell.exec('rm', ['-rf', assetsDir]);
  if (rmResult.exit_code !== 0) {
    throw new Error(`Failed to clean assets directory: ${rmResult.stderr}`);
  }
  const mkdirResult = await shell.exec('mkdir', ['-p', assetsDir]);
  if (mkdirResult.exit_code !== 0) {
    throw new Error(`Failed to create assets directory: ${mkdirResult.stderr}`);
  }
  return assetsDir;
}

/**
 * Download a single file from URL to disk using curl -o.
 * Retries once on failure. Returns success/error status.
 * Uses -L to follow redirects (S3 URLs may redirect).
 */
export async function downloadFile(
  shell: Shell,
  url: string,
  outputPath: string,
): Promise<{ success: boolean; error?: string }> {
  const args = ['-sS', '-o', outputPath, '--max-time', '30', '-L', url];

  const result = await shell.exec('curl', args, { timeout: 35000 });
  if (result.exit_code === 0) return { success: true };

  // Retry once
  const retry = await shell.exec('curl', args, { timeout: 35000 });
  if (retry.exit_code === 0) return { success: true };

  return {
    success: false,
    error: retry.stderr || `curl exit code ${retry.exit_code}`,
  };
}

/**
 * Download all assets sequentially, calling onProgress for each.
 * Returns list of successfully downloaded assets and warnings for failures.
 */
export async function downloadAllAssets(
  shell: Shell,
  assetsDir: string,
  assets: Array<{ filename: string; url: string; nodeId?: string; assetType?: 'icon' | 'image'; parentInstanceId?: string }>,
  onProgress?: (progress: AssetExportProgress) => void,
): Promise<{ downloaded: { filename: string; path: string; nodeId?: string; assetType?: 'icon' | 'image'; parentInstanceId?: string }[]; warnings: string[] }> {
  const downloaded: { filename: string; path: string; nodeId?: string; assetType?: 'icon' | 'image'; parentInstanceId?: string }[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < assets.length; i++) {
    const { filename, url, nodeId, assetType, parentInstanceId } = assets[i];
    const outputPath = `${assetsDir}/${filename}`;

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: assets.length,
        currentAsset: filename,
        phase: 'assets',
      });
    }

    const result = await downloadFile(shell, url, outputPath);
    if (result.success) {
      const item: { filename: string; path: string; nodeId?: string; assetType?: 'icon' | 'image'; parentInstanceId?: string } = { filename, path: outputPath };
      if (nodeId !== undefined) item.nodeId = nodeId;
      if (assetType !== undefined) item.assetType = assetType;
      if (parentInstanceId !== undefined) item.parentInstanceId = parentInstanceId;
      downloaded.push(item);
    } else {
      warnings.push(`Failed to download ${filename}: ${result.error}`);
    }
  }

  return { downloaded, warnings };
}
