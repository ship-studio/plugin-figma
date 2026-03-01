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

/* Brief mode selector */
.figma-plugin-mode-section {
  margin-bottom: 16px;
}

.figma-plugin-mode-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: block;
}

.figma-plugin-mode-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.figma-plugin-mode-card {
  padding: 6px 8px;
  border-radius: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.figma-plugin-mode-card:hover {
  border-color: var(--text-muted);
}

.figma-plugin-mode-card.selected {
  border-color: var(--accent, #0d99ff);
}

.figma-plugin-mode-card-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.figma-plugin-mode-card-desc {
  font-size: 10px;
  color: var(--text-muted);
  line-height: 1.3;
}

/* Inspiration textarea */
.figma-plugin-inspiration-textarea {
  margin-top: 8px;
  resize: vertical;
  min-height: 60px;
  max-height: 120px;
  font-size: 12px;
  line-height: 1.4;
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

/* Results view */
.figma-plugin-results-success {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.figma-plugin-results-success-icon {
  color: #38a169;
  font-size: 18px;
  line-height: 1;
}

.figma-plugin-results-guidance {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
  margin: 12px 0 4px 0;
}

.figma-plugin-results-refinement {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.figma-plugin-results-stats {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.figma-plugin-results-details-toggle {
  background: none;
  border: none;
  color: var(--accent, #0d99ff);
  font-size: 11px;
  cursor: pointer;
  padding: 4px 0;
  margin-top: 4px;
}

.figma-plugin-results-details {
  margin-top: 8px;
  padding: 10px 12px;
  background: var(--bg-primary);
  border-radius: 4px;
  border: 1px solid var(--border);
}

.figma-plugin-results-details h4 {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.figma-plugin-results-details h4:not(:first-child) {
  margin-top: 12px;
}

.figma-plugin-results-asset-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 11px;
  color: var(--text-secondary);
}

.figma-plugin-results-asset-list li {
  padding: 2px 0;
}

.figma-plugin-results-footer {
  color: var(--text-muted);
  font-size: 11px;
  margin-top: 12px;
  text-align: center;
}
`;
