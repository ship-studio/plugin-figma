/**
 * AssetListPanel -- self-contained UI for adding, viewing, editing, and removing
 * manual assets. Controlled component: receives assets via props, communicates
 * changes via callbacks.
 *
 * Responsibilities:
 * - URL input with validation (same-file, node-id presence, duplicate, I-prefix)
 * - Optimistic add with async node resolution
 * - Inline filename editing with collision detection
 * - Format toggle (PNG <-> SVG) with filename extension update
 * - Remove individual / clear all
 */

import { useState, useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { parseFigmaUrl } from '../url-parser';
import { isInstanceChildId, resolveNode, resolveFilenameCollision } from '../assets/resolve';
import { sanitizeFilename } from '../assets/sanitize';
import type { ManualAsset } from '../assets/types';
import type { Shell } from '../types';

interface AssetListPanelProps {
  /** File key from the main design URL -- for same-file validation (AINP-03) */
  designFileKey: string | null;
  /** Current list of manual assets */
  assets: ManualAsset[];
  /** Callback when user adds an asset (optimistic placeholder) */
  onAdd: (asset: ManualAsset) => void;
  /** Callback when user removes an asset by nodeId */
  onRemove: (nodeId: string) => void;
  /** Callback when user clears all assets */
  onClear: () => void;
  /** Callback when user renames an asset */
  onRename: (nodeId: string, newFilename: string) => void;
  /** Callback when async resolution completes */
  onResolved: (nodeId: string, resolved: ManualAsset) => void;
  /** Callback when user toggles format (also updates filename extension) */
  onFormatChange: (nodeId: string, newFormat: 'png' | 'svg', newFilename: string) => void;
  /** Whether the export pipeline is running (disables all interactions) */
  disabled?: boolean;
  /** Shell for API calls */
  shell: Shell;
  /** Figma API token */
  token: string;
}

export function AssetListPanel({
  designFileKey,
  assets,
  onAdd,
  onRemove,
  onClear,
  onRename,
  onResolved,
  onFormatChange,
  disabled,
  shell,
  token,
}: AssetListPanelProps) {
  const [assetUrlInput, setAssetUrlInput] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Track in-flight resolution nodeIds to prevent duplicate race condition (Pitfall 2)
  const inflightRef = useRef<Set<string>>(new Set());

  // ── Add Asset ──────────────────────────────────────────────────────

  const handleAddAsset = useCallback(async () => {
    if (!assetUrlInput.trim() || !designFileKey || disabled) return;

    const parsed = parseFigmaUrl(assetUrlInput);

    // Validate in order, return on first failure
    if (!parsed) {
      setAddError('Invalid Figma URL');
      return;
    }
    if (!parsed.nodeId) {
      setAddError('URL must point to a specific element (include node-id)');
      return;
    }
    if (parsed.fileKey !== designFileKey) {
      setAddError('Asset must be from the same Figma file');
      return;
    }
    if (assets.some((a) => a.nodeId === parsed.nodeId) || inflightRef.current.has(parsed.nodeId)) {
      setAddError('This element is already in the list');
      return;
    }
    if (isInstanceChildId(parsed.nodeId)) {
      setAddError('This is an instance child -- select the parent component instead');
      return;
    }

    const nodeId = parsed.nodeId;

    // Track in-flight to prevent duplicates during async resolution
    inflightRef.current.add(nodeId);

    // Optimistic add: placeholder with 'resolving' status
    const placeholder: ManualAsset = {
      nodeId,
      nodeName: '',
      filename: '',
      format: 'png',
      status: 'resolving',
    };
    onAdd(placeholder);

    // Clear input and error
    setAssetUrlInput('');
    setAddError(null);

    // Async resolve
    try {
      const resolved = await resolveNode(shell, token, designFileKey, nodeId, assets);
      onResolved(nodeId, resolved);
    } finally {
      inflightRef.current.delete(nodeId);
    }
  }, [assetUrlInput, designFileKey, assets, shell, token, disabled, onAdd, onResolved]);

  // ── Format Toggle ──────────────────────────────────────────────────

  const handleFormatToggle = useCallback(
    (asset: ManualAsset) => {
      const newFormat: 'png' | 'svg' = asset.format === 'png' ? 'svg' : 'png';

      // Strip old extension, add new one
      const dotIndex = asset.filename.lastIndexOf('.');
      const baseName = dotIndex !== -1 ? asset.filename.slice(0, dotIndex) : asset.filename;
      const candidate = `${baseName}.${newFormat}`;

      // Collision detection against other assets
      const otherFilenames = assets
        .filter((a) => a.nodeId !== asset.nodeId)
        .map((a) => a.filename);
      const newFilename = resolveFilenameCollision(candidate, otherFilenames);

      onFormatChange(asset.nodeId, newFormat, newFilename);
    },
    [assets, onFormatChange],
  );

  // ── Inline Filename Edit ───────────────────────────────────────────

  const startEdit = useCallback((nodeId: string, currentFilename: string) => {
    setEditingNodeId(nodeId);
    // Strip extension for editing
    const dotIndex = currentFilename.lastIndexOf('.');
    setEditValue(dotIndex !== -1 ? currentFilename.slice(0, dotIndex) : currentFilename);
  }, []);

  const saveEdit = useCallback(
    (nodeId: string, format: 'png' | 'svg') => {
      const sanitized = sanitizeFilename(editValue);
      const candidate = `${sanitized}.${format}`;

      // Collision detection against other assets
      const otherFilenames = assets
        .filter((a) => a.nodeId !== nodeId)
        .map((a) => a.filename);
      const finalFilename = resolveFilenameCollision(candidate, otherFilenames);

      onRename(nodeId, finalFilename);
      setEditingNodeId(null);
    },
    [editValue, assets, onRename],
  );

  // ── Key Handlers ───────────────────────────────────────────────────

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleAddAsset();
      }
    },
    [handleAddAsset],
  );

  const handleEditKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, nodeId: string, format: 'png' | 'svg') => {
      if (e.key === 'Enter') {
        saveEdit(nodeId, format);
      }
    },
    [saveEdit],
  );

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="figma-plugin-section">
      <label className="figma-plugin-label">Assets</label>

      {/* URL input row -- only show when designFileKey is set */}
      {designFileKey && (
        <div className="figma-plugin-asset-input-row">
          <input
            className="figma-plugin-input"
            type="text"
            placeholder="Paste Figma element URL to add asset..."
            value={assetUrlInput}
            onChange={(e) => {
              setAssetUrlInput(e.target.value);
              setAddError(null);
            }}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
          />
          <button
            className="figma-plugin-asset-add-btn"
            onClick={handleAddAsset}
            disabled={disabled || !assetUrlInput.trim()}
          >
            Add
          </button>
        </div>
      )}

      {/* Inline error */}
      {addError && <div className="figma-plugin-error">{addError}</div>}

      {/* No design URL hint */}
      {!designFileKey && (
        <div className="figma-plugin-hint">
          Paste a design URL above first, then add assets here
        </div>
      )}

      {/* Asset list */}
      {assets.length > 0 && (
        <>
          <div className="figma-plugin-asset-list-header">
            <span>{assets.length} asset{assets.length !== 1 ? 's' : ''}</span>
            <button
              className="figma-plugin-asset-clear-btn"
              onClick={onClear}
              disabled={disabled}
            >
              Clear all
            </button>
          </div>

          {assets.map((asset) => (
            <div key={asset.nodeId} className="figma-plugin-asset-row">
              {/* Status indicator */}
              {asset.status === 'resolving' && (
                <span className="figma-plugin-asset-status-resolving">
                  <span
                    className="figma-plugin-spinner"
                    style={{ width: 12, height: 12, borderWidth: '1.5px' }}
                  />
                </span>
              )}
              {asset.status === 'valid' && (
                <span className="figma-plugin-asset-status-valid">&#10003;</span>
              )}
              {asset.status === 'error' && (
                <span className="figma-plugin-asset-status-error" title={asset.error}>
                  &#10007;
                </span>
              )}

              {/* Format badge (clickable toggle) */}
              {asset.status === 'valid' && (
                <span
                  className="figma-plugin-format-badge"
                  onClick={() => !disabled && handleFormatToggle(asset)}
                  title="Click to toggle PNG/SVG"
                >
                  {asset.format}
                </span>
              )}

              {/* Filename (click-to-edit for valid assets) */}
              {editingNodeId === asset.nodeId ? (
                <input
                  className="figma-plugin-asset-edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveEdit(asset.nodeId, asset.format)}
                  onKeyDown={(e) => handleEditKeyDown(e, asset.nodeId, asset.format)}
                  autoFocus
                />
              ) : (
                <span
                  className="figma-plugin-asset-filename"
                  onClick={() =>
                    asset.status === 'valid' && !disabled && startEdit(asset.nodeId, asset.filename)
                  }
                  title={
                    asset.status === 'valid'
                      ? 'Click to rename'
                      : asset.error || 'Resolving...'
                  }
                >
                  {asset.status === 'resolving'
                    ? 'Resolving...'
                    : asset.status === 'error'
                      ? asset.error || 'Failed to resolve'
                      : asset.filename}
                </span>
              )}

              {/* Warning */}
              {asset.warning && (
                <span className="figma-plugin-asset-warning" title={asset.warning}>
                  &#9888;
                </span>
              )}

              {/* Remove button */}
              <button
                className="figma-plugin-asset-remove-btn"
                onClick={() => onRemove(asset.nodeId)}
                disabled={disabled}
                title="Remove asset"
              >
                &times;
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
