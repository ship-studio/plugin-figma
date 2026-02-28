import { usePluginContext } from '../context';
import { validateToken } from '../figma-api';
import type { FigmaUser } from '../types';

const React = (window as any).__SHIPSTUDIO_REACT__;
const { useState, useCallback } = React;

interface SettingsViewProps {
  currentUser: FigmaUser;
  onTokenUpdated: (token: string, user: FigmaUser) => void;
  onTokenRemoved: () => void;
  onBack: () => void;
}

/**
 * Token management view.
 * Shows current connection status, allows updating token (with re-validation),
 * and removing the stored token.
 */
export function SettingsView({ currentUser, onTokenUpdated, onTokenRemoved, onBack }: SettingsViewProps) {
  const { shell } = usePluginContext();
  const [newToken, setNewToken] = useState('');
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null as string | null);

  const handleUpdate = useCallback(async () => {
    const trimmed = newToken.trim();
    if (!trimmed || validating) return;

    setValidating(true);
    setError(null);

    try {
      const user = await validateToken(shell, trimmed);
      onTokenUpdated(trimmed, user);
    } catch (err: any) {
      setError(err?.message || 'Failed to validate token. Please check and try again.');
    } finally {
      setValidating(false);
    }
  }, [newToken, validating, shell, onTokenUpdated]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleUpdate();
      }
    },
    [handleUpdate]
  );

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--accent, #0d99ff)',
          cursor: 'pointer',
          padding: '0',
          fontSize: '12px',
          marginBottom: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className="figma-plugin-section">
        <div className="figma-plugin-success" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0' }}>
          <span style={{ fontSize: '10px' }}>&#9679;</span>
          Connected as {currentUser.handle}
        </div>
      </div>

      <div className="figma-plugin-section">
        <label className="figma-plugin-label">Update Token</label>
        <input
          className="figma-plugin-input"
          type="password"
          placeholder="figd_xxxxxxxxxxxxxxxx"
          value={newToken}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewToken(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={validating}
        />
        {error && <div className="figma-plugin-error">{error}</div>}
        <button
          className="btn-primary"
          onClick={handleUpdate}
          disabled={!newToken.trim() || validating}
          style={{ width: '100%', marginTop: '8px' }}
        >
          {validating ? (
            <>
              <span className="figma-plugin-spinner" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Validating...
            </>
          ) : (
            'Update'
          )}
        </button>
      </div>

      <div className="figma-plugin-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <button
          className="btn-secondary"
          onClick={onTokenRemoved}
          style={{ width: '100%' }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
