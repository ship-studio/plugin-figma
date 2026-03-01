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
  /** For instance child images: the parent INSTANCE node's ID, enabling layout tree cross-referencing */
  parentInstanceId?: string;
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
    assetType?: 'icon' | 'image';
    /** For instance child images: parent INSTANCE node ID for layout tree cross-referencing */
    parentInstanceId?: string;
  }[];
  /** Skipped assets, failed downloads */
  warnings: string[];
}

/**
 * A manually-added asset entry for v2.0 manual asset control.
 *
 * Created when a user adds a Figma node URL. Auto-derives filename
 * and format from the node's layer name and type. Consumed by the
 * export pipeline, brief generator, and asset list UI.
 */
export interface ManualAsset {
  /** Figma node ID (e.g., "12:34") */
  nodeId: string;
  /** Original Figma layer name, for display */
  nodeName: string;
  /** Sanitized filename WITH extension (e.g., "hero-image.png") */
  filename: string;
  /** User-selected or auto-suggested format */
  format: 'png' | 'svg';
  /** Lifecycle status */
  status: 'resolving' | 'valid' | 'error';
  /** Error message when status is 'error' */
  error?: string;
  /** Warning message (e.g., "Auto-named: frame-427.png -- consider renaming") */
  warning?: string;
}
