import { usePluginContext } from '../context';
import { parseFigmaUrl } from '../url-parser';
import { validateFileAccess } from '../figma-api';
import type { FigmaUrlParts, ExtractionScope, FigmaFileInfo } from '../types';

const React = (window as any).__SHIPSTUDIO_REACT__;
const { useState, useEffect, useCallback, useRef } = React;

interface MainViewProps {
  token: string;
}

/**
 * Main view for URL input, scope selection, and file validation.
 * Users paste a Figma URL, see it parsed, choose extraction scope,
 * and confirm file accessibility before extraction.
 */
export function MainView({ token }: MainViewProps) {
  const { shell, actions } = usePluginContext();

  const [urlInput, setUrlInput] = useState('');
  const [parsedUrl, setParsedUrl] = useState(null as FigmaUrlParts | null);
  const [scope, setScope] = useState('page' as ExtractionScope);
  const [fileInfo, setFileInfo] = useState(null as FigmaFileInfo | null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null as string | null);

  // Counter to discard stale validation responses
  const requestIdRef = useRef(0);

  /**
   * Handle URL input change: parse and trigger validation.
   */
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUrlInput(value);

      if (!value.trim()) {
        // Clear everything when input is empty
        setParsedUrl(null);
        setFileInfo(null);
        setError(null);
        setValidating(false);
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

      // Auto-set scope default based on nodeId presence
      if (parsed.nodeId) {
        setScope('node');
      } else {
        setScope('page');
      }
    },
    []
  );

  /**
   * Validate file access whenever parsedUrl changes.
   * Uses a request ID counter to discard stale responses.
   */
  useEffect(() => {
    if (!parsedUrl) return;

    const currentRequestId = ++requestIdRef.current;
    setValidating(true);
    setFileInfo(null);
    setError(null);

    (async () => {
      try {
        const info = await validateFileAccess(shell, token, parsedUrl.fileKey);
        // Only apply result if this is still the latest request
        if (requestIdRef.current === currentRequestId) {
          setFileInfo(info);
          setValidating(false);
        }
      } catch (err: any) {
        if (requestIdRef.current === currentRequestId) {
          const message = err?.message || 'Failed to validate file access.';
          // Map error messages to user-friendly versions
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
  }, [parsedUrl, shell, token]);

  const handleExtract = useCallback(() => {
    actions.showToast('Extraction coming in next update', 'info');
  }, [actions]);

  const extractDisabled = !parsedUrl || !fileInfo || validating;

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

      {/* Extract Button */}
      <button
        className="btn-primary"
        onClick={handleExtract}
        disabled={extractDisabled}
        style={{ width: '100%' }}
      >
        Extract Design Brief
      </button>
    </div>
  );
}
