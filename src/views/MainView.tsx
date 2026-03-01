import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { usePluginContext } from '../context';
import { parseFigmaUrl } from '../url-parser';
import { validateFileAccess } from '../figma-api';
import { extractLayout } from '../layout/extract';
import type { ExtractLayoutResult } from '../layout/extract';
import type { ExtractionResult, LayoutNode } from '../layout/types';
import type { FigmaUrlParts, ExtractionScope, FigmaFileInfo } from '../types';
import { exportAssets } from '../assets/export';
import type { ExportResult, AssetExportProgress } from '../assets/types';
import { generateBrief, TOKEN_WARNING_THRESHOLD } from '../brief/generate';
import type { BriefResult } from '../brief/types';
import { saveBrief, copyToClipboard } from '../brief/io';

interface ExtractionStats {
  frames: number;
  components: { name: string; count: number }[];
  textNodes: number;
  hiddenNodes: number;
}

function collectStats(nodes: LayoutNode[]): ExtractionStats {
  const stats: ExtractionStats = { frames: 0, components: [], textNodes: 0, hiddenNodes: 0 };
  const componentMap = new Map<string, number>();

  function walk(node: LayoutNode) {
    if (!node.visible) stats.hiddenNodes++;
    if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'SECTION') {
      stats.frames++;
    }
    if (node.type === 'TEXT') stats.textNodes++;
    if (node.componentRef) {
      const name = node.componentRef.componentName;
      const count = node.repeatCount ?? 1;
      componentMap.set(name, (componentMap.get(name) ?? 0) + count);
    }
    if (node.children) node.children.forEach(walk);
  }
  nodes.forEach(walk);

  stats.components = Array.from(componentMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return stats;
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

interface MainViewProps {
  token: string;
}

/**
 * Main view for URL input, scope selection, file validation, and layout extraction.
 * Users paste a Figma URL, see it parsed, choose extraction scope,
 * and click Extract to fetch and normalize the layout tree.
 */
export function MainView({ token }: MainViewProps) {
  const ctx = usePluginContext();
  const shell = ctx?.shell ?? null;
  const actions = ctx?.actions ?? null;

  const [urlInput, setUrlInput] = useState('');
  const [parsedUrl, setParsedUrl] = useState(null as FigmaUrlParts | null);
  // Scope is derived from URL: if nodeId present, extract that node; otherwise whole page
  const scope: ExtractionScope = parsedUrl?.nodeId ? 'node' : 'page';
  const [fileInfo, setFileInfo] = useState(null as FigmaFileInfo | null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null as string | null);

  // Extraction state
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null as ExtractionResult | null);
  const [largeTreeWarning, setLargeTreeWarning] = useState(null as { nodeCount: number; message: string } | null);
  const [awaitingLargeTreeConfirm, setAwaitingLargeTreeConfirm] = useState(false);
  const [showTree, setShowTree] = useState(false);

  // Asset export state
  const [exportingAssets, setExportingAssets] = useState(false);
  const [assetProgress, setAssetProgress] = useState(null as AssetExportProgress | null);
  const [exportResult, setExportResult] = useState(null as ExportResult | null);

  // Brief generation state
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [briefResult, setBriefResult] = useState(null as BriefResult | null);
  const [briefError, setBriefError] = useState(null as string | null);

  const extractionStats = useMemo(
    () => extractionResult ? collectStats(extractionResult.rootNodes) : null,
    [extractionResult],
  );

  // Store pending extraction result while awaiting large tree confirmation
  const pendingResultRef = useRef(null as ExtractLayoutResult | null);

  // Stable ref for shell so the validation effect doesn't re-fire on context re-renders
  const shellRef = useRef(shell);
  shellRef.current = shell;

  // Counter to discard stale validation responses
  const requestIdRef = useRef(0);

  // Counter to discard stale extraction responses
  const extractRequestIdRef = useRef(0);

  const runAssetExport = useCallback(async (result: ExtractLayoutResult) => {
    if (!shellRef.current || !parsedUrl) return;

    setExportingAssets(true);
    setAssetProgress(null);
    setExportResult(null);

    try {
      const exportRes = await exportAssets({
        shell: shellRef.current,
        token,
        fileKey: result.fileKey,
        selectedNodeId: parsedUrl.nodeId || result.extraction.rootNodes[0]?.id || '0:0',
        projectPath: ctx?.project?.path ?? '.',
        rootNodes: result.extraction.rootNodes,
        imageFills: result.tokens.imageFills,
        instancesWithText: result.instancesWithText,
        onProgress: setAssetProgress,
      });

      setExportResult(exportRes);
      if (actions) {
        const assetCount = exportRes.assets.length;
        const warnCount = exportRes.warnings.length;
        const msg = `Exported ${assetCount} asset${assetCount !== 1 ? 's' : ''}${warnCount > 0 ? ` (${warnCount} warning${warnCount !== 1 ? 's' : ''})` : ''}`;
        actions.showToast(msg, warnCount > 0 ? 'info' : 'success');
      }

      // Trigger brief generation after successful asset export
      setGeneratingBrief(true);
      setBriefResult(null);
      setBriefError(null);

      // Defer to allow spinner paint before synchronous generation
      setTimeout(() => {
        try {
          const brief = generateBrief({
            extraction: result,
            exportResult: exportRes,
            projectPath: ctx?.project?.path ?? '.',
            fileName: fileInfo?.name ?? 'Untitled',
            figmaUrl: urlInput,
            rootNodes: result.extraction.rootNodes,
          });

          setBriefResult(brief);
          setGeneratingBrief(false);

          // Save to file (non-blocking -- fire and forget with error logging)
          if (shellRef.current) {
            saveBrief(shellRef.current, exportRes.assetsDir, brief.markdown).catch(err => {
              console.error('Brief save failed:', err);
              // Non-fatal -- brief is still in memory for clipboard copy
            });
          }

          if (actions) {
            actions.showToast(
              `Brief ready: ${brief.stats.nodeCount} layers, ${brief.stats.assetCount} assets, ~${Math.round(brief.stats.estimatedTokens / 1000)}K tokens`,
              'success',
            );
          }
        } catch (err: any) {
          setBriefError(err?.message || 'Brief generation failed');
          setGeneratingBrief(false);
        }
      }, 0);
    } catch (err: any) {
      if (actions) {
        actions.showToast(`Asset export failed: ${err?.message || 'Unknown error'}`, 'error');
      }
    } finally {
      setExportingAssets(false);
      setAssetProgress(null);
    }
  }, [token, parsedUrl, ctx, actions, fileInfo, urlInput]);

  const handleUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUrlInput(value);

      if (!value.trim()) {
        setParsedUrl(null);
        setFileInfo(null);
        setError(null);
        setValidating(false);
        // Clear extraction state on URL clear
        setExtractionResult(null);
        setLargeTreeWarning(null);
        setAwaitingLargeTreeConfirm(false);
        setShowTree(false);
        pendingResultRef.current = null;
        // Clear asset export state
        setExportResult(null);
        setExportingAssets(false);
        setAssetProgress(null);
        // Clear brief state
        setBriefResult(null);
        setGeneratingBrief(false);
        setBriefError(null);
        return;
      }

      const parsed = parseFigmaUrl(value);
      if (!parsed) {
        setParsedUrl(null);
        setFileInfo(null);
        setError('Please paste a valid Figma URL (file, design, proto, or board link)');
        setValidating(false);
        return;
      }

      setParsedUrl(parsed);
      setError(null);
      setFileInfo(null);
      // Clear extraction state on URL change
      setExtractionResult(null);
      setLargeTreeWarning(null);
      setAwaitingLargeTreeConfirm(false);
      setShowTree(false);
      pendingResultRef.current = null;
      // Clear asset export state
      setExportResult(null);
      setExportingAssets(false);
      setAssetProgress(null);
      // Clear brief state
      setBriefResult(null);
      setGeneratingBrief(false);
      setBriefError(null);

    },
    []
  );

  // Validate file access whenever parsedUrl changes.
  // Uses shellRef to avoid re-firing when context re-renders.
  useEffect(() => {
    if (!parsedUrl || !shellRef.current) return;

    const currentRequestId = ++requestIdRef.current;
    const currentShell = shellRef.current;
    setValidating(true);
    setFileInfo(null);
    setError(null);

    (async () => {
      try {
        const info = await validateFileAccess(currentShell, token, parsedUrl.fileKey);
        if (requestIdRef.current === currentRequestId) {
          setFileInfo(info);
          setValidating(false);
        }
      } catch (err: any) {
        if (requestIdRef.current === currentRequestId) {
          const message = err?.message || 'Failed to validate file access.';
          if (message.includes('403') || message.includes('Invalid or expired')) {
            setError('Cannot access this file. Check that your token has File content (Read) scope.');
          } else if (message.includes('404') || message.includes('not found')) {
            setError('File not found. Check that the URL is correct.');
          } else if (message.includes('429') || message.includes('Rate limited')) {
            setError('Rate limited by Figma. Please wait a moment and try again.');
          } else {
            setError(message);
          }
          setValidating(false);
        }
      }
    })();
  }, [parsedUrl, token]);

  const handleExtract = useCallback(() => {
    const currentShell = shellRef.current;
    if (!currentShell || !parsedUrl) return;

    const currentExtractId = ++extractRequestIdRef.current;

    // Clear previous results and errors
    setExtracting(true);
    setExtractionResult(null);
    setError(null);
    setLargeTreeWarning(null);
    setAwaitingLargeTreeConfirm(false);
    pendingResultRef.current = null;
    // Clear asset export state
    setExportResult(null);
    setExportingAssets(false);
    setAssetProgress(null);
    // Clear brief state
    setBriefResult(null);
    setGeneratingBrief(false);
    setBriefError(null);

    (async () => {
      try {
        const result = await extractLayout({
          shell: currentShell,
          token,
          fileKey: parsedUrl.fileKey,
          nodeId: parsedUrl.nodeId,
          scope,
        });

        // Discard stale result if user changed URL during extraction
        if (extractRequestIdRef.current !== currentExtractId) return;

        if (result.largeTreeWarning) {
          // Store full result, show warning, let user decide
          pendingResultRef.current = result;
          setLargeTreeWarning(result.largeTreeWarning);
          setAwaitingLargeTreeConfirm(true);
          setExtracting(false);
          return;
        }

        // No warning -- set result directly
        setExtractionResult(result.extraction);
        if (actions) {
          actions.showToast(`Extracted ${result.extraction.nodeCount} layers`, 'success');
        }
        // Automatically run asset export after successful extraction
        runAssetExport(result);
      } catch (err: any) {
        if (extractRequestIdRef.current !== currentExtractId) return;

        const message = err?.message || 'Extraction failed.';
        if (message.includes('403') || message.includes('Invalid or expired')) {
          setError('Cannot access this file. Check that your token has File content (Read) scope.');
        } else if (message.includes('404') || message.includes('not found')) {
          setError('File not found. Check that the URL is correct.');
        } else if (message.includes('429') || message.includes('Rate limited')) {
          setError('Rate limited by Figma. Please wait a moment and try again.');
        } else if (message.includes('timeout') || message.includes('timed out')) {
          setError('Request timed out. Try a smaller selection or check your connection.');
        } else {
          setError(message);
        }
      } finally {
        if (extractRequestIdRef.current === currentExtractId) {
          setExtracting(false);
        }
      }
    })();
  }, [parsedUrl, token, scope, actions, runAssetExport]);

  const handleConfirmLargeTree = useCallback(() => {
    const pending = pendingResultRef.current;
    if (!pending) return;

    // Use the already-fetched and normalized result -- no second API call needed
    setAwaitingLargeTreeConfirm(false);
    setLargeTreeWarning(null);
    setExtractionResult(pending.extraction);
    pendingResultRef.current = null;

    if (actions) {
      actions.showToast(`Extracted ${pending.extraction.nodeCount} layers`, 'success');
    }
    // Automatically run asset export after large tree confirmation
    runAssetExport(pending);
  }, [actions, runAssetExport]);

  const handleCancelLargeTree = useCallback(() => {
    setAwaitingLargeTreeConfirm(false);
    setLargeTreeWarning(null);
    pendingResultRef.current = null;
  }, []);

  const handleCopyBrief = useCallback(async () => {
    if (!briefResult || !shellRef.current) return;
    try {
      await copyToClipboard(shellRef.current, briefResult.markdown);
      if (actions) {
        actions.showToast('Brief copied to clipboard', 'success');
      }
    } catch (err: any) {
      if (actions) {
        actions.showToast(`Copy failed: ${err?.message || 'Unknown error'}`, 'error');
      }
    }
  }, [briefResult, actions]);

  const extractDisabled = !parsedUrl || !fileInfo || validating || extracting || exportingAssets || generatingBrief;

  return (
    <div>
      {/* URL Input Section */}
      <div className="figma-plugin-section">
        <label className="figma-plugin-label">Figma URL</label>
        <input
          className="figma-plugin-input"
          type="text"
          placeholder="https://www.figma.com/design/..."
          value={urlInput}
          onChange={handleUrlChange}
        />
        {error && <div className="figma-plugin-error">{error}</div>}
      </div>

      {/* Parsed URL Info */}
      {parsedUrl && (
        <div className="figma-plugin-section">
          <div className="figma-plugin-file-info">
            {validating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: fileInfo ? '8px' : '0' }}>
                <span className="figma-plugin-spinner" />
                <span style={{ color: 'var(--text-secondary)' }}>Checking access...</span>
              </div>
            )}
            {fileInfo && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                  {fileInfo.name}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {fileInfo.pages.length} page{fileInfo.pages.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
            {!validating && (
              <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <div>File key: {parsedUrl.fileKey}</div>
                <div>Node: {parsedUrl.nodeId || 'None (file-level)'}</div>
                <div>Type: {parsedUrl.fileType}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scope hint -- tells user what will be extracted based on their URL */}
      {parsedUrl && fileInfo && !validating && (
        <div className="figma-plugin-section">
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            {parsedUrl.nodeId
              ? 'Will extract the selected element'
              : 'Will extract the whole page — select a specific element in Figma to narrow scope'}
          </div>
        </div>
      )}

      {/* Large Tree Warning */}
      {awaitingLargeTreeConfirm && largeTreeWarning && (
        <div className="figma-plugin-section">
          <div className="figma-plugin-warning">
            <strong>{largeTreeWarning.nodeCount} layers detected</strong>
            <p>Large selections may take longer and produce verbose output. Continue?</p>
            <div className="figma-plugin-warning-actions">
              <button className="btn-primary" onClick={handleConfirmLargeTree}>
                Continue
              </button>
              <button className="btn-secondary" onClick={handleCancelLargeTree}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brief Error */}
      {briefError && (
        <div className="figma-plugin-section">
          <div className="figma-plugin-error">{briefError}</div>
        </div>
      )}

      {/* Merged Result Card -- renders only when entire pipeline is complete */}
      {briefResult && extractionResult && extractionStats && exportResult && (
        <div className="figma-plugin-section">
          <div className="figma-plugin-file-info">
            {/* Success header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ color: '#38a169' }}>&#10003;</span>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Brief ready</span>
              {extractionResult.truncated && (
                <span style={{ color: '#f59e0b', fontSize: '11px' }}>(truncated)</span>
              )}
            </div>

            {/* Copy button -- most prominent, at top per user decision */}
            <button
              className="btn-primary"
              onClick={handleCopyBrief}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              Copy Brief to Clipboard
            </button>

            {/* Stats row */}
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6 }}>
              {briefResult.stats.nodeCount} layers &middot;{' '}
              {briefResult.stats.assetCount} assets &middot;{' '}
              <span style={{
                color: briefResult.stats.estimatedTokens > TOKEN_WARNING_THRESHOLD
                  ? '#f59e0b'
                  : 'inherit',
              }}>
                ~{Math.round(briefResult.stats.estimatedTokens / 1000)}K tokens
              </span>
            </div>

            {/* Composition count -- inline stat with amber color */}
            {(() => {
              const compCount = exportResult.assets.filter(a => a.assetType === 'composition').length;
              return compCount > 0 ? (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#f59e0b' }}>
                  {compCount} composition{compCount !== 1 ? 's' : ''} exported as PNG
                </div>
              ) : null;
            })()}

            {/* Token warning banner */}
            {briefResult.stats.estimatedTokens > TOKEN_WARNING_THRESHOLD && (
              <div className="figma-plugin-warning" style={{ marginTop: '8px' }}>
                <strong>This brief is large</strong>
                <p>Consider extracting a smaller section for better results.</p>
              </div>
            )}

            {/* Component badges */}
            {extractionStats.components.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Components</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {extractionStats.components.slice(0, 8).map((c) => (
                    <span
                      key={c.name}
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {c.name}{c.count > 1 ? ` x${c.count}` : ''}
                    </span>
                  ))}
                  {extractionStats.components.length > 8 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '2px 4px' }}>
                      +{extractionStats.components.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Asset warnings */}
            {exportResult.warnings.length > 0 && (() => {
              // Ensure we're working with real strings
              const allWarnings: string[] = Array.from(exportResult.warnings).map(w =>
                typeof w === 'string' ? w : JSON.stringify(w),
              );
              // Separate composition/illustration auto-detections (already shown above) from real warnings
              const compositionWarnings = allWarnings.filter(w => w.startsWith('Composition "') || w.startsWith('Illustration "'));
              const actionableWarnings = allWarnings.filter(w => !w.startsWith('Composition "') && !w.startsWith('Illustration "'));

              return actionableWarnings.length > 0 ? (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#f59e0b' }}>
                  {actionableWarnings.length} warning{actionableWarnings.length !== 1 ? 's' : ''}:
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {actionableWarnings.slice(0, 5).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                    {actionableWarnings.length > 5 && (
                      <li>...and {actionableWarnings.length - 5} more</li>
                    )}
                  </ul>
                </div>
              ) : null;
            })()}

            {/* Tree preview toggle */}
            <button
              onClick={() => setShowTree(!showTree)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent, #0d99ff)',
                fontSize: '11px',
                cursor: 'pointer',
                padding: '4px 0',
                marginTop: '8px',
              }}
            >
              {showTree ? 'Hide tree' : 'Show tree preview'}
            </button>
            {showTree && (
              <div style={{ marginTop: '6px', padding: '8px', background: 'var(--bg-primary)', borderRadius: '4px', border: '1px solid var(--border)', maxHeight: '200px', overflowY: 'auto' }}>
                <TreePreview nodes={extractionResult.rootNodes} />
              </div>
            )}

            {/* File save note */}
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
              Also saved to .shipstudio/assets/brief.md
            </div>
          </div>
        </div>
      )}

      {/* Extract Button */}
      {(() => {
        const isLoading = extracting || exportingAssets || generatingBrief;
        const label = extracting
          ? 'Extracting layout...'
          : exportingAssets
            ? assetProgress?.phase === 'preview'
              ? 'Rendering preview...'
              : `Exporting assets${assetProgress?.total ? ` (${assetProgress.current ?? 0}/${assetProgress.total})` : ''}...`
            : generatingBrief
              ? 'Generating brief...'
              : briefResult
                ? 'Get New Brief'
                : 'Get Brief';
        return (
          <button
            className={briefResult && !isLoading ? 'btn-secondary' : 'btn-primary'}
            onClick={handleExtract}
            disabled={extractDisabled}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isLoading && <span className="figma-plugin-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />}
            {label}
          </button>
        );
      })()}
    </div>
  );
}
