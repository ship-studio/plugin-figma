import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { usePluginContext } from '../context';
import { parseFigmaUrl } from '../url-parser';
import { validateFileAccess } from '../figma-api';
import { extractLayout } from '../layout/extract';
import type { ExtractLayoutResult } from '../layout/extract';
import type { ExtractionResult } from '../layout/types';
import type { FigmaUrlParts, ExtractionScope, FigmaFileInfo } from '../types';

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
  const [scope, setScope] = useState('page' as ExtractionScope);
  const [fileInfo, setFileInfo] = useState(null as FigmaFileInfo | null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null as string | null);

  // Extraction state
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null as ExtractionResult | null);
  const [largeTreeWarning, setLargeTreeWarning] = useState(null as { nodeCount: number; message: string } | null);
  const [awaitingLargeTreeConfirm, setAwaitingLargeTreeConfirm] = useState(false);

  // Store pending extraction result while awaiting large tree confirmation
  const pendingResultRef = useRef(null as ExtractLayoutResult | null);

  // Stable ref for shell so the validation effect doesn't re-fire on context re-renders
  const shellRef = useRef(shell);
  shellRef.current = shell;

  // Counter to discard stale validation responses
  const requestIdRef = useRef(0);

  // Counter to discard stale extraction responses
  const extractRequestIdRef = useRef(0);

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

      if (parsed.nodeId) {
        setScope('node');
      } else {
        setScope('page');
      }
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
          actions.showToast(`Extracted ${result.extraction.nodeCount} nodes`, 'success');
        }
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
  }, [parsedUrl, token, scope, actions]);

  const handleConfirmLargeTree = useCallback(() => {
    const pending = pendingResultRef.current;
    if (!pending) return;

    // Use the already-fetched and normalized result -- no second API call needed
    setAwaitingLargeTreeConfirm(false);
    setLargeTreeWarning(null);
    setExtractionResult(pending.extraction);
    pendingResultRef.current = null;

    if (actions) {
      actions.showToast(`Extracted ${pending.extraction.nodeCount} nodes`, 'success');
    }
  }, [actions]);

  const handleCancelLargeTree = useCallback(() => {
    setAwaitingLargeTreeConfirm(false);
    setLargeTreeWarning(null);
    pendingResultRef.current = null;
  }, []);

  const extractDisabled = !parsedUrl || !fileInfo || validating || extracting;

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

      {/* Scope Selection */}
      {parsedUrl && (
        <div className="figma-plugin-section">
          <label className="figma-plugin-label">Extraction Scope</label>
          <div className="figma-plugin-radio-group">
            <label className="figma-plugin-radio-label" style={!parsedUrl.nodeId ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>
              <input
                type="radio"
                name="scope"
                value="node"
                checked={scope === 'node'}
                onChange={() => setScope('node')}
                disabled={!parsedUrl.nodeId}
              />
              Single Node
              {!parsedUrl.nodeId && (
                <span className="figma-plugin-hint" style={{ marginTop: 0, marginLeft: '4px' }}>
                  Paste a URL with a node-id to use this option
                </span>
              )}
            </label>
            <label className="figma-plugin-radio-label">
              <input
                type="radio"
                name="scope"
                value="frame"
                checked={scope === 'frame'}
                onChange={() => setScope('frame')}
              />
              Frame
            </label>
            <label className="figma-plugin-radio-label">
              <input
                type="radio"
                name="scope"
                value="page"
                checked={scope === 'page'}
                onChange={() => setScope('page')}
              />
              Entire Page
            </label>
          </div>
        </div>
      )}

      {/* Extraction Spinner */}
      {extracting && (
        <div className="figma-plugin-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="figma-plugin-spinner" />
            <span style={{ color: 'var(--text-secondary)' }}>Extracting layout...</span>
          </div>
        </div>
      )}

      {/* Large Tree Warning */}
      {awaitingLargeTreeConfirm && largeTreeWarning && (
        <div className="figma-plugin-section">
          <div className="figma-plugin-warning">
            <strong>{largeTreeWarning.nodeCount} nodes detected</strong>
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

      {/* Extraction Result Summary */}
      {extractionResult && (
        <div className="figma-plugin-section">
          <div className="figma-plugin-file-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: '#38a169' }}>&#10003;</span>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Layout extracted</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {extractionResult.nodeCount} nodes &middot; {extractionResult.rootNodes.length} top-level {extractionResult.rootNodes.length === 1 ? 'frame' : 'frames'}
              {extractionResult.truncated && ' (truncated)'}
            </div>
          </div>
        </div>
      )}

      {/* Extract Button */}
      <button
        className="btn-primary"
        onClick={handleExtract}
        disabled={extractDisabled}
        style={{ width: '100%' }}
      >
        {extracting ? 'Extracting...' : 'Extract Design Brief'}
      </button>
    </div>
  );
}
