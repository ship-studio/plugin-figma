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
import type { ExportResult, AssetExportProgress, DetectionResult } from '../assets/types';
import { detectAssets } from '../assets/detect';
import { detectedToManual } from '../assets/adapt';
import { generateBrief } from '../brief/generate';
import { ResultsModal } from '../components/ResultsModal';
import type { BriefResult } from '../brief/types';
import { saveBrief, copyToClipboard } from '../brief/io';

type BriefMode = 'best' | 'pixel' | 'inspiration';

const BRIEF_MODES: { id: BriefMode; name: string; description: string }[] = [
  {
    id: 'best',
    name: 'Copy (Best results)',
    description: 'Faithfully reproduce the design with clean, responsive code',
  },
  {
    id: 'pixel',
    name: 'Copy (Pixel for pixel)',
    description: 'Match the design exactly — fixed sizes, no responsive abstractions',
  },
  {
    id: 'inspiration',
    name: 'Use as inspiration',
    description: 'Adapt the design patterns and style to fit your existing site',
  },
];

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

  // Asset export state
  const [exportingAssets, setExportingAssets] = useState(false);
  const [assetProgress, setAssetProgress] = useState(null as AssetExportProgress | null);
  const [exportResult, setExportResult] = useState(null as ExportResult | null);

  // Brief generation state
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [briefResult, setBriefResult] = useState(null as BriefResult | null);
  const [briefError, setBriefError] = useState(null as string | null);

  // Zero-asset warning state (mirrors large-tree warning pattern)
  const [zeroAssetWarning, setZeroAssetWarning] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Loom embed loading state
  const [loomLoaded, setLoomLoaded] = useState(false);

  // Brief mode selection (persists across URL changes within session)
  const [briefMode, setBriefMode] = useState<BriefMode>('best');
  const [inspirationText, setInspirationText] = useState('');

  const extractionStats = useMemo(
    () => extractionResult ? collectStats(extractionResult.rootNodes) : null,
    [extractionResult],
  );

  // Store pending extraction result while awaiting large tree confirmation
  const pendingResultRef = useRef(null as ExtractLayoutResult | null);

  // Store detection result for passing through to export
  const detectionResultRef = useRef<DetectionResult | null>(null);

  // Stable ref for shell so the validation effect doesn't re-fire on context re-renders
  const shellRef = useRef(shell);
  shellRef.current = shell;

  // Counter to discard stale validation responses
  const requestIdRef = useRef(0);

  // Counter to discard stale extraction responses
  const extractRequestIdRef = useRef(0);

  const runAssetExport = useCallback(async (result: ExtractLayoutResult, detection?: DetectionResult) => {
    if (!shellRef.current || !parsedUrl) return;

    setExportingAssets(true);
    setAssetProgress(null);
    setExportResult(null);

    // Convert detected @S- assets to export format
    const detectedAsManual = detection ? detectedToManual(detection.assets) : [];

    try {
      const exportRes = await exportAssets({
        shell: shellRef.current,
        token,
        fileKey: result.fileKey,
        selectedNodeId: parsedUrl.nodeId || result.extraction.rootNodes[0]?.id || '0:0',
        projectPath: ctx?.project?.path ?? '.',
        manualAssets: detectedAsManual,
        onProgress: setAssetProgress,
      });

      // Merge detection warnings into export result
      if (detection?.warnings.length) {
        exportRes.warnings.push(...detection.warnings);
      }

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
            mode: briefMode,
            inspirationText: briefMode === 'inspiration' ? inspirationText : undefined,
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
  }, [token, parsedUrl, ctx, actions, fileInfo, urlInput, briefMode, inspirationText]);

  const runDetectionAndExport = useCallback(async (result: ExtractLayoutResult) => {
    // Wrap multiple roots in synthetic parent for detection
    const syntheticRoot = result.rawRootNodes.length === 1
      ? result.rawRootNodes[0]
      : { name: '__root__', children: result.rawRootNodes, visible: true };
    const detection = detectAssets(syntheticRoot);
    detectionResultRef.current = detection;

    if (detection.assets.length === 0) {
      // Zero assets -- show blocking warning
      pendingResultRef.current = result;
      setZeroAssetWarning(true);
      setExtracting(false);
      return;
    }

    // Assets found -- silently continue to export
    setExtractionResult(result.extraction);
    if (actions) {
      actions.showToast(`Extracted ${result.extraction.nodeCount} layers`, 'success');
    }
    runAssetExport(result, detection);
  }, [actions, runAssetExport]);

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
        pendingResultRef.current = null;
        // Clear asset export state
        setExportResult(null);
        setExportingAssets(false);
        setAssetProgress(null);
        // Clear brief state
        setBriefResult(null);
        setGeneratingBrief(false);
        setBriefError(null);
        // Clear detection state
        setZeroAssetWarning(false);
        setRetryCount(0);
        detectionResultRef.current = null;
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
      pendingResultRef.current = null;
      // Clear asset export state
      setExportResult(null);
      setExportingAssets(false);
      setAssetProgress(null);
      // Clear brief state
      setBriefResult(null);
      setGeneratingBrief(false);
      setBriefError(null);
      // Clear detection state
      setZeroAssetWarning(false);
      setRetryCount(0);
      detectionResultRef.current = null;

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
    // Clear detection state (do NOT reset retryCount -- it accumulates across retries)
    setZeroAssetWarning(false);
    detectionResultRef.current = null;

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

        // No warning -- run detection then export
        runDetectionAndExport(result);
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
  }, [parsedUrl, token, scope, actions, runDetectionAndExport]);

  const handleConfirmLargeTree = useCallback(() => {
    const pending = pendingResultRef.current;
    if (!pending) return;

    // Use the already-fetched and normalized result -- no second API call needed
    setAwaitingLargeTreeConfirm(false);
    setLargeTreeWarning(null);
    // Don't clear pendingResultRef yet -- runDetectionAndExport may need it for zero-asset path
    runDetectionAndExport(pending);
  }, [runDetectionAndExport]);

  const handleCancelLargeTree = useCallback(() => {
    setAwaitingLargeTreeConfirm(false);
    setLargeTreeWarning(null);
    pendingResultRef.current = null;
  }, []);

  const handleRetryDetection = useCallback(() => {
    setZeroAssetWarning(false);
    setRetryCount(prev => prev + 1);
    pendingResultRef.current = null;
    detectionResultRef.current = null;
    // Re-trigger full extraction pipeline (re-fetches from Figma API)
    handleExtract();
  }, [handleExtract]);

  const handleContinueWithoutAssets = useCallback(() => {
    const pending = pendingResultRef.current;
    if (!pending) return;

    setZeroAssetWarning(false);
    pendingResultRef.current = null;
    setExtractionResult(pending.extraction);
    if (actions) {
      actions.showToast(`Extracted ${pending.extraction.nodeCount} layers`, 'success');
    }
    // Proceed without assets (no @S- layers found)
    runAssetExport(pending, detectionResultRef.current ?? undefined);
  }, [actions, runAssetExport]);

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

  const handleNewBrief = useCallback(() => {
    setBriefResult(null);
    setExtractionResult(null);
    setExportResult(null);
    // extractionStats is derived from extractionResult via useMemo, so it clears automatically.
    // Do NOT clear urlInput, parsedUrl, fileInfo -- user likely wants same page
    // Do NOT clear briefMode or inspirationText -- user likely wants same mode
  }, []);

  const extractDisabled = !parsedUrl || !fileInfo || validating || extracting || exportingAssets || generatingBrief || zeroAssetWarning;

  // View replacement: when all results are ready, show ResultsModal instead of form
  if (briefResult && extractionResult && extractionStats && exportResult) {
    return (
      <ResultsModal
        briefResult={briefResult}
        extractionResult={extractionResult}
        extractionStats={extractionStats}
        exportResult={exportResult}
        onCopyBrief={handleCopyBrief}
        onNewBrief={handleNewBrief}
      />
    );
  }

  return (
    <div>
      {/* Asset naming hint */}
      <div className="figma-plugin-section" style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
        Prefix layer names with <code style={{ background: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: '3px' }}>@S-</code> to export them as assets.
        {' '}Example: <code style={{ background: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: '3px' }}>@S-hero-image</code>
        <div style={{ marginTop: '6px' }}>
          <button
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '4px 10px' }}
            onClick={() => {
              if (shellRef.current) {
                copyToClipboard(shellRef.current, '@S-').then(() => {
                  if (actions) actions.showToast('Copied @S- to clipboard', 'success');
                }).catch(() => {});
              }
            }}
          >
            Copy @S-
          </button>
        </div>
        <div style={{ marginTop: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Watch this video before you start!
        </div>
        <div style={{ marginTop: '6px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
          {!loomLoaded && (
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '12px',
            }}>
              <span className="figma-plugin-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
              Loading video...
            </div>
          )}
          <iframe
            src="https://www.loom.com/embed/f83f51d9d9ae4aa78fc288b01592ed1e"
            frameBorder="0"
            allowFullScreen
            onLoad={() => setLoomLoaded(true)}
            style={{ width: '100%', aspectRatio: '16/9', display: loomLoaded ? 'block' : 'none' }}
          />
        </div>
      </div>

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

      {/* Brief Mode Selector -- visible after URL validation, hidden during results */}
      {parsedUrl && fileInfo && !validating && !briefResult && (
        <div className="figma-plugin-mode-section">
          <span className="figma-plugin-mode-label">Brief mode</span>
          <div className="figma-plugin-mode-group">
            {BRIEF_MODES.map((mode) => (
              <div
                key={mode.id}
                className={`figma-plugin-mode-card${briefMode === mode.id ? ' selected' : ''}`}
                onClick={() => setBriefMode(mode.id)}
                role="radio"
                aria-checked={briefMode === mode.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setBriefMode(mode.id);
                  }
                }}
              >
                <div className="figma-plugin-mode-card-name">{mode.name}</div>
                <div className="figma-plugin-mode-card-desc">{mode.description}</div>
              </div>
            ))}
          </div>
          {briefMode === 'inspiration' && (
            <textarea
              className="figma-plugin-input figma-plugin-inspiration-textarea"
              placeholder="Describe what to take from this design (e.g., 'Use the color palette and card layout pattern, but adapt spacing and typography to match our existing design system')"
              value={inspirationText}
              onChange={(e) => setInspirationText(e.target.value)}
              rows={3}
            />
          )}
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

      {/* Zero-Asset Warning */}
      {zeroAssetWarning && (
        <div className="figma-plugin-section">
          <div className="figma-plugin-warning">
            <strong>No @S- asset layers found</strong>
            <p>
              Prefix layer names with <code>@S-</code> to mark them for export.{' '}
              Example: <code>@S-hero-image</code> becomes <code>hero-image.png</code>.{' '}
              PNG or SVG format is auto-detected from layer content.
            </p>
            {retryCount > 0 && (
              <p style={{ fontStyle: 'italic', marginTop: '4px' }}>
                Still no @S- layers found. Check your layer names in Figma.
              </p>
            )}
            <div className="figma-plugin-warning-actions">
              <button className="btn-primary" onClick={handleRetryDetection}>
                Try again
              </button>
              <button className="btn-secondary" onClick={handleContinueWithoutAssets}>
                Continue anyway
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
              : 'Get Brief';
        return (
          <button
            className="btn-primary"
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
