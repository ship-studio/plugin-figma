import { vi, describe, it, expect, beforeEach } from 'vitest';
import { exportAssets } from './export';
import type { ManualAsset, AssetExportProgress } from './types';

// Mock the external dependencies
vi.mock('../figma-api', () => ({
  fetchImages: vi.fn(),
}));
vi.mock('./download', () => ({
  prepareAssetsDir: vi.fn(),
  downloadFile: vi.fn(),
}));

import { fetchImages } from '../figma-api';
import { prepareAssetsDir, downloadFile } from './download';

const mockFetchImages = vi.mocked(fetchImages);
const mockPrepareAssetsDir = vi.mocked(prepareAssetsDir);
const mockDownloadFile = vi.mocked(downloadFile);

const mockShell = {} as any;

const baseOptions = {
  shell: mockShell,
  token: 'test-token',
  fileKey: 'test-file-key',
  selectedNodeId: '0:1',
  projectPath: '/tmp/project',
};

function makeAsset(overrides: Partial<ManualAsset> = {}): ManualAsset {
  return {
    nodeId: '1:1',
    nodeName: 'Test Asset',
    filename: 'test-asset.png',
    format: 'png' as const,
    status: 'valid' as const,
    ...overrides,
  };
}

describe('exportAssets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrepareAssetsDir.mockResolvedValue('/tmp/assets');
    mockDownloadFile.mockResolvedValue({ success: true });
    // Default: preview renders successfully
    mockFetchImages.mockResolvedValue({ '0:1': 'https://preview-url.com/preview.png' });
  });

  // ── Preview-only export ──────────────────────────────────────────

  describe('preview-only export (no manual assets)', () => {
    it('generates preview and returns empty assets when no manualAssets provided', async () => {
      const result = await exportAssets(baseOptions);

      expect(result.previewPath).toBe('/tmp/assets/preview.png');
      expect(result.assets).toEqual([]);
      expect(result.assetsDir).toBe('/tmp/assets');
      expect(mockFetchImages).toHaveBeenCalledTimes(1);
      expect(mockFetchImages).toHaveBeenCalledWith(
        mockShell, 'test-token', 'test-file-key', ['0:1'], 'png', 2,
      );
    });

    it('generates preview and returns empty assets when manualAssets is empty array', async () => {
      const result = await exportAssets({ ...baseOptions, manualAssets: [] });

      expect(result.previewPath).toBe('/tmp/assets/preview.png');
      expect(result.assets).toEqual([]);
      expect(mockFetchImages).toHaveBeenCalledTimes(1);
    });
  });

  // ── Format partitioning ──────────────────────────────────────────

  describe('mixed format export', () => {
    it('makes two fetchImages calls -- one PNG at scale=2, one SVG without scale', async () => {
      const pngAsset = makeAsset({ nodeId: '1:1', filename: 'hero.png', format: 'png' });
      const svgAsset = makeAsset({ nodeId: '2:2', filename: 'icon.svg', format: 'svg' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' }) // preview
        .mockResolvedValueOnce({ '1:1': 'https://cdn.figma.com/hero.png' }) // PNG batch
        .mockResolvedValueOnce({ '2:2': 'https://cdn.figma.com/icon.svg' }); // SVG batch

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [pngAsset, svgAsset],
      });

      // 3 calls: preview + PNG batch + SVG batch
      expect(mockFetchImages).toHaveBeenCalledTimes(3);

      // PNG batch call: format='png', scale=2
      expect(mockFetchImages).toHaveBeenCalledWith(
        mockShell, 'test-token', 'test-file-key', ['1:1'], 'png', 2,
      );

      // SVG batch call: format='svg', no scale
      expect(mockFetchImages).toHaveBeenCalledWith(
        mockShell, 'test-token', 'test-file-key', ['2:2'], 'svg',
      );

      expect(result.assets).toHaveLength(2);
      expect(result.warnings).toHaveLength(0);
    });
  });

  // ── Only valid assets exported ───────────────────────────────────

  describe('status filtering', () => {
    it('only exports assets with status=valid, skips error and resolving', async () => {
      const validAsset = makeAsset({ nodeId: '1:1', filename: 'valid.png', status: 'valid' });
      const errorAsset = makeAsset({ nodeId: '2:2', filename: 'error.png', status: 'error' });
      const resolvingAsset = makeAsset({ nodeId: '3:3', filename: 'resolving.png', status: 'resolving' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' }) // preview
        .mockResolvedValueOnce({ '1:1': 'https://cdn.figma.com/valid.png' }); // PNG batch (only valid)

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [validAsset, errorAsset, resolvingAsset],
      });

      // Only the valid asset's nodeId should be passed to fetchImages
      expect(mockFetchImages).toHaveBeenCalledTimes(2); // preview + 1 PNG batch
      expect(mockFetchImages).toHaveBeenCalledWith(
        mockShell, 'test-token', 'test-file-key', ['1:1'], 'png', 2,
      );
      expect(result.assets).toHaveLength(1);
      expect(result.assets[0].filename).toBe('valid.png');
    });
  });

  // ── Null URL warning ─────────────────────────────────────────────

  describe('null URL handling', () => {
    it('produces warning for null URL and skips download, does not throw', async () => {
      const asset = makeAsset({ nodeId: '3:3', filename: 'broken.png' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' })
        .mockResolvedValueOnce({ '3:3': null }); // null URL for this node

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [asset],
      });

      expect(result.warnings).toContainEqual(
        expect.stringContaining('Failed to render broken.png'),
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining('node 3:3'),
      );
      expect(result.assets).toHaveLength(0);
      // downloadFile should NOT have been called for this asset (only for preview)
      expect(mockDownloadFile).toHaveBeenCalledTimes(1); // preview only
    });
  });

  // ── Download failure warning ─────────────────────────────────────

  describe('download failure handling', () => {
    it('produces warning for failed download and continues, does not throw', async () => {
      const goodAsset = makeAsset({ nodeId: '1:1', filename: 'good.png' });
      const badAsset = makeAsset({ nodeId: '2:2', filename: 'bad.png' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' })
        .mockResolvedValueOnce({
          '1:1': 'https://cdn.figma.com/good.png',
          '2:2': 'https://cdn.figma.com/bad.png',
        });

      mockDownloadFile
        .mockResolvedValueOnce({ success: true }) // preview
        .mockResolvedValueOnce({ success: true }) // good asset
        .mockResolvedValueOnce({ success: false, error: 'timeout' }); // bad asset

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [goodAsset, badAsset],
      });

      expect(result.assets).toHaveLength(1);
      expect(result.assets[0].filename).toBe('good.png');
      expect(result.warnings).toContainEqual(
        expect.stringContaining('Failed to download bad.png'),
      );
      expect(result.warnings).toContainEqual(
        expect.stringContaining('timeout'),
      );
    });
  });

  // ── All assets fail to render ────────────────────────────────────

  describe('all assets fail', () => {
    it('returns empty assets and collects all warnings when every URL is null', async () => {
      const asset1 = makeAsset({ nodeId: '1:1', filename: 'a.png' });
      const asset2 = makeAsset({ nodeId: '2:2', filename: 'b.png' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' })
        .mockResolvedValueOnce({ '1:1': null, '2:2': null });

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [asset1, asset2],
      });

      expect(result.assets).toHaveLength(0);
      expect(result.warnings).toHaveLength(2);
      expect(result.warnings[0]).toContain('Failed to render a.png');
      expect(result.warnings[1]).toContain('Failed to render b.png');
    });
  });

  // ── fetchImages throws for one format partition ──────────────────

  describe('fetchImages batch failure', () => {
    it('catches fetchImages error for one partition and still processes other partition', async () => {
      const pngAsset = makeAsset({ nodeId: '1:1', filename: 'hero.png', format: 'png' });
      const svgAsset = makeAsset({ nodeId: '2:2', filename: 'icon.svg', format: 'svg' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' }) // preview OK
        .mockRejectedValueOnce(new Error('Network error')) // PNG batch fails
        .mockResolvedValueOnce({ '2:2': 'https://cdn.figma.com/icon.svg' }); // SVG batch OK

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [pngAsset, svgAsset],
      });

      // PNG batch failed entirely -- warning added
      expect(result.warnings).toContainEqual(
        expect.stringContaining('batch render failed'),
      );
      // PNG asset should have null URL (batch failed), so another warning
      expect(result.warnings).toContainEqual(
        expect.stringContaining('Failed to render hero.png'),
      );
      // SVG asset should have been downloaded successfully
      expect(result.assets.some(a => a.filename === 'icon.svg')).toBe(true);
    });
  });

  // ── Preview failure does not block manual assets ─────────────────

  describe('preview failure isolation', () => {
    it('exports manual assets even when preview fails', async () => {
      const asset = makeAsset({ nodeId: '1:1', filename: 'hero.png' });

      mockFetchImages
        .mockRejectedValueOnce(new Error('Preview render error')) // preview fails
        .mockResolvedValueOnce({ '1:1': 'https://cdn.figma.com/hero.png' }); // PNG batch OK

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [asset],
      });

      expect(result.previewPath).toBe('');
      expect(result.warnings).toContainEqual(
        expect.stringContaining('Preview render failed'),
      );
      expect(result.assets).toHaveLength(1);
      expect(result.assets[0].filename).toBe('hero.png');
    });
  });

  // ── Progress callbacks ───────────────────────────────────────────

  describe('progress callbacks', () => {
    it('fires preview at current=0 and assets at current=1..N with correct total', async () => {
      const asset1 = makeAsset({ nodeId: '1:1', filename: 'a.png' });
      const asset2 = makeAsset({ nodeId: '2:2', filename: 'b.svg', format: 'svg' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' })
        .mockResolvedValueOnce({ '1:1': 'https://cdn.figma.com/a.png' })
        .mockResolvedValueOnce({ '2:2': 'https://cdn.figma.com/b.svg' });

      const progressCalls: AssetExportProgress[] = [];
      const onProgress = (p: AssetExportProgress) => progressCalls.push({ ...p });

      await exportAssets({
        ...baseOptions,
        manualAssets: [asset1, asset2],
        onProgress,
      });

      // Total = 2 assets + 1 preview = 3
      expect(progressCalls[0]).toEqual({
        current: 0,
        total: 3,
        currentAsset: 'preview.png',
        phase: 'preview',
      });

      // Asset progress calls
      const assetCalls = progressCalls.filter(p => p.phase === 'assets');
      expect(assetCalls).toHaveLength(2);
      expect(assetCalls[0].current).toBe(1);
      expect(assetCalls[0].total).toBe(3);
      expect(assetCalls[1].current).toBe(2);
      expect(assetCalls[1].total).toBe(3);
    });
  });

  // ── ExportResult shape ───────────────────────────────────────────

  describe('result asset shape', () => {
    it('produces correct nodeId, filename, path, and assetType for PNG and SVG', async () => {
      const pngAsset = makeAsset({ nodeId: '1:1', filename: 'hero.png', format: 'png' });
      const svgAsset = makeAsset({ nodeId: '2:2', filename: 'icon.svg', format: 'svg' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' })
        .mockResolvedValueOnce({ '1:1': 'https://cdn.figma.com/hero.png' })
        .mockResolvedValueOnce({ '2:2': 'https://cdn.figma.com/icon.svg' });

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [pngAsset, svgAsset],
      });

      const pngResult = result.assets.find(a => a.filename === 'hero.png');
      expect(pngResult).toEqual({
        filename: 'hero.png',
        path: '/tmp/assets/hero.png',
        nodeId: '1:1',
        assetType: 'image',
      });

      const svgResult = result.assets.find(a => a.filename === 'icon.svg');
      expect(svgResult).toEqual({
        filename: 'icon.svg',
        path: '/tmp/assets/icon.svg',
        nodeId: '2:2',
        assetType: 'icon',
      });
    });
  });

  // ── Node ID encoding fallback ────────────────────────────────────

  describe('node ID encoding fallback', () => {
    it('finds URL when fetchImages returns encoded variant of nodeId', async () => {
      const asset = makeAsset({ nodeId: '1:1', filename: 'encoded.png' });

      // fetchImages returns URL under the encoded key "1%3A1" instead of "1:1"
      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' })
        .mockResolvedValueOnce({ '1%3A1': 'https://cdn.figma.com/encoded.png' });

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [asset],
      });

      expect(result.assets).toHaveLength(1);
      expect(result.assets[0].filename).toBe('encoded.png');
      expect(result.warnings).toHaveLength(0);
    });

    it('finds URL when asset has encoded nodeId but fetchImages returns decoded', async () => {
      const asset = makeAsset({ nodeId: '1%3A1', filename: 'decoded.png' });

      // fetchImages returns URL under the decoded key "1:1"
      mockFetchImages
        .mockResolvedValueOnce({ '0:1': 'https://preview-url.com/preview.png' })
        .mockResolvedValueOnce({ '1:1': 'https://cdn.figma.com/decoded.png' });

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [asset],
      });

      expect(result.assets).toHaveLength(1);
      expect(result.assets[0].filename).toBe('decoded.png');
    });
  });

  // ── Preview failure + asset success isolation ────────────────────

  describe('preview null URL does not block assets', () => {
    it('adds preview warning and still exports assets when preview URL is null', async () => {
      const asset = makeAsset({ nodeId: '1:1', filename: 'hero.png' });

      mockFetchImages
        .mockResolvedValueOnce({ '0:1': null }) // preview returns null
        .mockResolvedValueOnce({ '1:1': 'https://cdn.figma.com/hero.png' }); // PNG batch OK

      const result = await exportAssets({
        ...baseOptions,
        manualAssets: [asset],
      });

      expect(result.previewPath).toBe('');
      expect(result.warnings.some(w => w.includes('preview'))).toBe(true);
      expect(result.assets).toHaveLength(1);
    });
  });
});
