import { useState } from 'react';
import type { BriefResult } from '../brief/types';
import type { ExtractionResult, LayoutNode } from '../layout/types';
import type { ExportResult } from '../assets/types';
import { TOKEN_WARNING_THRESHOLD } from '../brief/generate';

interface ExtractionStats {
  frames: number;
  components: { name: string; count: number }[];
  textNodes: number;
  hiddenNodes: number;
}

export interface ResultsModalProps {
  briefResult: BriefResult;
  extractionResult: ExtractionResult;
  extractionStats: ExtractionStats;
  exportResult: ExportResult;
  onCopyBrief: () => void;
  onNewBrief: () => void;
}

function TreePreview({ nodes, depth = 0, maxDepth = 2 }: { nodes: LayoutNode[]; depth?: number; maxDepth?: number }) {
  if (depth >= maxDepth) return null;
  return (
    <div style={{ paddingLeft: depth > 0 ? '12px' : '0', borderLeft: depth > 0 ? '1px solid var(--border)' : 'none' }}>
      {nodes.map((node, i) => {
        const label = node.componentRef
          ? `<${node.componentRef.componentName}${node.repeatCount ? ` x${node.repeatCount}` : ''}>`
          : node.type === 'TEXT'
            ? `"${(node.textContent ?? '').slice(0, 30)}${(node.textContent ?? '').length > 30 ? '...' : ''}"`
            : node.name;
        const tag = node.autoLayout
          ? `${node.autoLayout.flexDirection}`
          : node.type === 'INSTANCE'
            ? 'component'
            : node.type.toLowerCase();
        return (
          <div key={node.id || i} style={{ fontSize: '11px', lineHeight: 1.7 }}>
            <span style={{ color: 'var(--text-muted)' }}>{tag} </span>
            <span style={{ color: node.visible === false ? 'var(--text-muted)' : 'var(--text-primary)' }}>
              {label}
            </span>
            {node.visible === false && <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>(hidden)</span>}
            {node.children && node.children.length > 0 && depth + 1 < maxDepth && (
              <TreePreview nodes={node.children} depth={depth + 1} maxDepth={maxDepth} />
            )}
            {node.children && node.children.length > 0 && depth + 1 >= maxDepth && (
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '12px' }}>
                ({node.children.length} children)
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Results view component that replaces the MainView form after brief generation.
 * Shows success message, copy button, guidance, refinement encouragement,
 * and an expandable details section with assets, tree, and token summary.
 */
export function ResultsModal({
  briefResult,
  extractionResult,
  extractionStats,
  exportResult,
  onCopyBrief,
  onNewBrief,
}: ResultsModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  const tokenK = Math.round(briefResult.stats.estimatedTokens / 1000);
  const isLargeBrief = briefResult.stats.estimatedTokens > TOKEN_WARNING_THRESHOLD;

  return (
    <div>
      {/* 1. Success header */}
      <div className="figma-plugin-results-success">
        <span className="figma-plugin-results-success-icon">&#10003;</span>
        <span style={{ fontWeight: 600, fontSize: '13px' }}>Brief ready</span>
        {extractionResult.truncated && (
          <span style={{ color: '#f59e0b', fontSize: '11px' }}>(truncated)</span>
        )}
      </div>

      {/* 2. Copy button -- most prominent element */}
      <button
        className="btn-primary"
        onClick={onCopyBrief}
        style={{ width: '100%', marginBottom: '12px' }}
      >
        Copy Brief to Clipboard
      </button>

      {/* 3. Guidance text */}
      <p className="figma-plugin-results-guidance">
        Paste into Claude Code (or your AI coding agent) to start building.
      </p>

      {/* 4. Refinement encouragement */}
      <p className="figma-plugin-results-refinement">
        The build may not be perfect on the first try -- refine iteratively by giving your agent feedback on what to adjust.
      </p>

      {/* 5. Stats row */}
      <div className="figma-plugin-results-stats">
        {briefResult.stats.nodeCount} layers &middot;{' '}
        {briefResult.stats.assetCount} assets &middot;{' '}
        <span style={{ color: isLargeBrief ? '#f59e0b' : 'inherit' }}>
          ~{tokenK}K tokens
        </span>
      </div>

      {/* Zero-asset info line */}
      {briefResult.stats.assetCount === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '8px' }}>
          No assets exported -- Claude Code will create placeholders for visual elements
        </div>
      )}

      {/* 6. Token warning */}
      {isLargeBrief && (
        <div className="figma-plugin-warning" style={{ marginBottom: '8px' }}>
          <strong>This brief is large</strong>
          <p>Consider extracting a smaller section for better results.</p>
        </div>
      )}

      {/* 7. View details toggle */}
      <button
        className="figma-plugin-results-details-toggle"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide details' : 'View details'}
      </button>

      {/* 8. Expandable details panel */}
      {showDetails && (
        <div className="figma-plugin-results-details">
          {/* 8a. Assets */}
          <h4>Assets ({exportResult.assets.length})</h4>
          {exportResult.assets.length > 0 ? (
            <ul className="figma-plugin-results-asset-list">
              {exportResult.assets.map((asset, i) => (
                <li key={i}>
                  {asset.filename}
                  {asset.assetType && (
                    <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>
                      ({asset.assetType})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              No assets exported
            </div>
          )}

          {/* 8b. Layout tree */}
          <h4>Layout tree</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <TreePreview nodes={extractionResult.rootNodes} maxDepth={3} />
          </div>

          {/* 8c. Tokens summary */}
          <h4>Design tokens</h4>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {briefResult.stats.colorCount} colors, {briefResult.stats.fontCount} fonts
            {extractionStats.components.length > 0 && (
              <span> &middot; {extractionStats.components.length} component types</span>
            )}
          </div>
        </div>
      )}

      {/* 9. File save note */}
      <div className="figma-plugin-results-footer">
        Also saved to .shipstudio/assets/brief.md
      </div>

      {/* 10. Get New Brief button */}
      <button
        className="btn-secondary"
        onClick={onNewBrief}
        style={{ width: '100%', marginTop: '8px' }}
      >
        Get New Brief
      </button>
    </div>
  );
}
