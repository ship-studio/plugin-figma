import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { usePluginContext } from './context';
import { Modal } from './components/Modal';
import { SetupView } from './views/SetupView';
import { SettingsView } from './views/SettingsView';
import { MainView } from './views/MainView';
import type { FigmaUser } from './types';

/**
 * Gear icon button for the modal header — opens settings view.
 */
function GearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Settings"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </button>
  );
}

/**
 * FigmaToolbarButton - Renders in Ship Studio's toolbar slot.
 * Manages modal state, token persistence, and view routing.
 */
function FigmaToolbarButton() {
  const ctx = usePluginContext();
  const storage = ctx?.storage ?? null;
  const actions = ctx?.actions ?? null;

  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(null as string | null);
  const [figmaUser, setFigmaUser] = useState(null as FigmaUser | null);
  const [loaded, setLoaded] = useState(false);
  const [currentView, setCurrentView] = useState('main' as 'main' | 'settings');

  // Read stored token on mount (once storage is available)
  useEffect(() => {
    if (!storage) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await storage.read();
        if (!cancelled && typeof data.figmaToken === 'string') {
          setToken(data.figmaToken);
          if (typeof data.figmaUserHandle === 'string') {
            setFigmaUser({ id: '', handle: data.figmaUserHandle, img_url: '' } as FigmaUser);
          }
        }
      } catch (err) {
        console.error('[figma] Failed to read storage:', err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [storage]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setCurrentView('main');
  }, []);

  const handleTokenSaved = useCallback(async (newToken: string, user: FigmaUser) => {
    if (!storage || !actions) return;
    try {
      const data = await storage.read();
      await storage.write({ ...data, figmaToken: newToken, figmaUserHandle: user.handle });
      setToken(newToken);
      setFigmaUser(user);
      setCurrentView('main');
      actions.showToast(`Connected as ${user.handle}`, 'success');
    } catch (err) {
      actions.showToast('Failed to save token. Please try again.', 'error');
    }
  }, [storage, actions]);

  const handleTokenUpdated = useCallback(async (newToken: string, user: FigmaUser) => {
    if (!storage || !actions) return;
    try {
      const data = await storage.read();
      await storage.write({ ...data, figmaToken: newToken, figmaUserHandle: user.handle });
      setToken(newToken);
      setFigmaUser(user);
      setCurrentView('main');
      actions.showToast(`Token updated — connected as ${user.handle}`, 'success');
    } catch (err) {
      actions.showToast('Failed to save token. Please try again.', 'error');
    }
  }, [storage, actions]);

  const handleTokenRemoved = useCallback(async () => {
    if (!storage || !actions) return;
    try {
      const data = await storage.read();
      const { figmaToken, figmaUserHandle, ...rest } = data as Record<string, unknown>;
      await storage.write(rest);
      setToken(null);
      setFigmaUser(null);
      setCurrentView('main');
      actions.showToast('Disconnected from Figma', 'info');
    } catch (err) {
      actions.showToast('Failed to remove token. Please try again.', 'error');
    }
  }, [storage, actions]);

  // Determine modal title and headerRight based on state
  const modalTitle = 'Figma';
  const headerRight = token ? (
    <GearButton onClick={() => setCurrentView('settings')} />
  ) : undefined;

  // Determine which view to render inside the modal
  let modalContent: ReactNode = null;
  if (loaded) {
    if (!token) {
      modalContent = <SetupView onTokenSaved={handleTokenSaved} />;
    } else if (currentView === 'settings' && figmaUser) {
      modalContent = (
        <SettingsView
          currentUser={figmaUser}
          onTokenUpdated={handleTokenUpdated}
          onTokenRemoved={handleTokenRemoved}
          onBack={() => setCurrentView('main')}
        />
      );
    } else {
      modalContent = <MainView token={token} />;
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        title="Figma Design Brief"
        className="toolbar-icon-btn"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 15 15"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.00005 2.04999H5.52505C4.71043 2.04999 4.05005 2.71037 4.05005 3.52499C4.05005 4.33961 4.71043 4.99999 5.52505 4.99999H7.00005V2.04999ZM7.00005 1.04999H8.00005H9.47505C10.842 1.04999 11.95 2.15808 11.95 3.52499C11.95 4.33163 11.5642 5.04815 10.9669 5.49999C11.5642 5.95184 11.95 6.66836 11.95 7.475C11.95 8.8419 10.842 9.95 9.47505 9.95C8.92236 9.95 8.41198 9.76884 8.00005 9.46266V9.95L8.00005 11.425C8.00005 12.7919 6.89195 13.9 5.52505 13.9C4.15814 13.9 3.05005 12.7919 3.05005 11.425C3.05005 10.6183 3.43593 9.90184 4.03317 9.44999C3.43593 8.99814 3.05005 8.28163 3.05005 7.475C3.05005 6.66836 3.43594 5.95184 4.03319 5.5C3.43594 5.04815 3.05005 4.33163 3.05005 3.52499C3.05005 2.15808 4.15814 1.04999 5.52505 1.04999H7.00005ZM8.00005 2.04999V4.99999H9.47505C10.2897 4.99999 10.95 4.33961 10.95 3.52499C10.95 2.71037 10.2897 2.04999 9.47505 2.04999H8.00005ZM5.52505 8.94998H7.00005L7.00005 7.4788L7.00005 7.475L7.00005 7.4712V6H5.52505C4.71043 6 4.05005 6.66038 4.05005 7.475C4.05005 8.28767 4.70727 8.94684 5.5192 8.94999L5.52505 8.94998ZM4.05005 11.425C4.05005 10.6123 4.70727 9.95315 5.5192 9.94999L5.52505 9.95H7.00005L7.00005 11.425C7.00005 12.2396 6.33967 12.9 5.52505 12.9C4.71043 12.9 4.05005 12.2396 4.05005 11.425ZM8.00005 7.47206C8.00164 6.65879 8.66141 6 9.47505 6C10.2897 6 10.95 6.66038 10.95 7.475C10.95 8.28962 10.2897 8.95 9.47505 8.95C8.66141 8.95 8.00164 8.29121 8.00005 7.47794V7.47206Z"
          />
        </svg>
      </button>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={modalTitle}
        headerRight={headerRight}
      >
        {modalContent}
      </Modal>
    </>
  );
}

export const name = 'Figma';

export const slots = {
  toolbar: FigmaToolbarButton,
};

export function onActivate() {
  console.log('[figma] Plugin activated');
}

export function onDeactivate() {
  console.log('[figma] Plugin deactivated');
}
