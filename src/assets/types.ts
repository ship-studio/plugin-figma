/**
 * Asset export types.
 *
 * These types define the structured asset entries identified for export
 * and the result of the export process. Consumed by the download orchestrator
 * (Plan 02) and brief assembly (Phase 5).
 */

/** An asset identified for export from the Figma design tree. */
export interface AssetEntry {
  nodeId: string;
  nodeName: string;
  exportType: 'svg' | 'png-render' | 'png-fill';
  /** Sanitized filename WITH extension (e.g., "icon-arrow.svg") */
  filename: string;
  /** For png-fill: the Figma imageRef to resolve via image fills API */
  imageRef?: string;
}

/** Progress update emitted during asset export. */
export interface AssetExportProgress {
  current: number;
  total: number;
  /** Filename being downloaded */
  currentAsset: string;
  phase: 'preview' | 'assets';
}

/** Result of the complete asset export operation. */
export interface ExportResult {
  /** Temp directory containing all exported assets and brief */
  assetsDir: string;
  /** Path to preview.png */
  previewPath: string;
  /** Successfully exported assets */
  assets: {
    filename: string;
    path: string;
    /** Stable key for breadcrumb lookup (populated when pipeline threads nodeId) */
    nodeId?: string;
    /** Asset classification for Type column in brief */
    assetType?: 'icon' | 'image' | 'composition' | 'component';
  }[];
  /** Skipped assets, failed downloads */
  warnings: string[];
}
