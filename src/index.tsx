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
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" />
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
