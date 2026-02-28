import { useState, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { usePluginContext } from '../context';
import { validateToken } from '../figma-api';
import type { FigmaUser } from '../types';

interface SetupViewProps {
  onTokenSaved: (token: string, user: FigmaUser) => void;
}

/**
 * First-time token entry view.
 * Shown when no Figma token is stored. Provides PAT instructions,
 * input field, validation via GET /v1/me, and inline feedback.
 */
export function SetupView({ onTokenSaved }: SetupViewProps) {
  const ctx = usePluginContext();
  const shell = ctx?.shell ?? null;
  const [tokenValue, setTokenValue] = useState('');
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null as string | null);

  const handleConnect = useCallback(async () => {
    if (!shell) return;
    const trimmed = tokenValue.trim();
    if (!trimmed || validating) return;

    setValidating(true);
    setError(null);

    try {
      const user = await validateToken(shell, trimmed);
      onTokenSaved(trimmed, user);
    } catch (err: any) {
      setError(err?.message || 'Failed to validate token. Please check and try again.');
    } finally {
      setValidating(false);
    }
  }, [tokenValue, validating, shell, onTokenSaved]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleConnect();
      }
    },
    [handleConnect]
  );

  return (
    <div>
      <div className="figma-plugin-section">
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0' }}>
          Connect to Figma
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
          To get started, you need a Figma Personal Access Token.{' '}
          <a
            href="https://www.figma.com/developers/api#access-tokens"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent, #0d99ff)' }}
          >
            Generate one here
          </a>
          . Make sure "File content (Read)" scope is enabled.
        </p>
      </div>

      <div className="figma-plugin-section">
        <label className="figma-plugin-label">Personal Access Token</label>
        <input
          className="figma-plugin-input"
          type="password"
          placeholder="figd_xxxxxxxxxxxxxxxx"
          value={tokenValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTokenValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={validating}
        />
        {error && <div className="figma-plugin-error">{error}</div>}
        <div className="figma-plugin-hint">Token is stored locally in this project only.</div>
      </div>

      <button
        className="btn-primary"
        onClick={handleConnect}
        disabled={!tokenValue.trim() || validating}
        style={{ width: '100%', marginTop: '4px' }}
      >
        {validating ? (
          <>
            <span className="figma-plugin-spinner" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Connecting...
          </>
        ) : (
          'Connect'
        )}
      </button>
    </div>
  );
}
