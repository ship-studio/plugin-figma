export const STYLE_ID = 'figma-plugin-styles';

export const PLUGIN_CSS = `
.figma-plugin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.figma-plugin-modal {
  width: 480px;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.figma-plugin-modal-header {
  display: flex;
  flex-direction: row;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  gap: 12px;
  align-items: center;
}

.figma-plugin-modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.figma-plugin-modal-title {
  font-size: 15px;
  font-weight: 600;
}

.figma-plugin-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  font-size: 13px;
  box-sizing: border-box;
}

.figma-plugin-input:focus {
  outline: none;
  border-color: var(--accent, #0d99ff);
}

.figma-plugin-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
  display: block;
}

.figma-plugin-error {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 6px;
}

.figma-plugin-success {
  color: #38a169;
  font-size: 12px;
  margin-top: 6px;
}

.figma-plugin-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.figma-plugin-section {
  margin-bottom: 16px;
}

.figma-plugin-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.figma-plugin-radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}

.figma-plugin-file-info {
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  font-size: 12px;
  margin-top: 8px;
}

.figma-plugin-warning {
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  border: 1px solid #b45309;
  font-size: 12px;
  margin-top: 8px;
}

.figma-plugin-warning strong {
  color: #f59e0b;
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
}

.figma-plugin-warning p {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
  line-height: 1.4;
}

.figma-plugin-warning-actions {
  display: flex;
  gap: 8px;
}

.figma-plugin-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--accent, #0d99ff);
  border-radius: 50%;
  animation: figma-plugin-spin 0.6s linear infinite;
}

@keyframes figma-plugin-spin {
  to { transform: rotate(360deg); }
}

/* Asset list panel */
.figma-plugin-asset-panel {
  margin-top: 8px;
}

.figma-plugin-asset-input-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.figma-plugin-asset-input-row .figma-plugin-input {
  flex: 1;
  min-width: 0;
}

/* Individual asset row */
.figma-plugin-asset-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid var(--border);
  margin-bottom: 4px;
}

.figma-plugin-asset-row:hover {
  background: var(--bg-secondary);
}

/* Format badge */
.figma-plugin-format-badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.figma-plugin-format-badge:hover {
  border-color: var(--accent, #0d99ff);
  color: var(--text-primary);
}

/* Asset filename (clickable for edit) */
.figma-plugin-asset-filename {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  color: var(--text-primary);
}

.figma-plugin-asset-filename:hover {
  text-decoration: underline;
  text-decoration-style: dotted;
}

/* Inline filename edit input */
.figma-plugin-asset-edit-input {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  padding: 1px 4px;
  border: 1px solid var(--accent, #0d99ff);
  border-radius: 3px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
}

/* Status indicators */
.figma-plugin-asset-status-resolving {
  flex-shrink: 0;
}

.figma-plugin-asset-status-valid {
  color: #38a169;
  flex-shrink: 0;
}

.figma-plugin-asset-status-error {
  color: #e53e3e;
  flex-shrink: 0;
  font-size: 11px;
}

/* Asset list header row */
.figma-plugin-asset-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  margin-top: 10px;
}

.figma-plugin-asset-list-header span {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Clear all button (text-style) */
.figma-plugin-asset-clear-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
}

.figma-plugin-asset-clear-btn:hover {
  color: #e53e3e;
}

/* Remove button on asset row */
.figma-plugin-asset-remove-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  flex-shrink: 0;
}

.figma-plugin-asset-remove-btn:hover {
  color: #e53e3e;
}

/* Add button */
.figma-plugin-asset-add-btn {
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
  font-weight: 500;
}

.figma-plugin-asset-add-btn:hover {
  border-color: var(--accent, #0d99ff);
}

.figma-plugin-asset-add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Asset warning text */
.figma-plugin-asset-warning {
  font-size: 10px;
  color: #f59e0b;
  margin-top: 2px;
}
`;
