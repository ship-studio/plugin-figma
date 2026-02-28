import { usePluginContext } from './context';
import { STYLE_ID, PLUGIN_CSS } from './styles';

const React = (window as any).__SHIPSTUDIO_REACT__;
const { useState, useEffect, useCallback } = React;

/**
 * FigmaToolbarButton - Renders in Ship Studio's toolbar slot.
 * Clicking opens the Figma plugin modal overlay.
 */
function FigmaToolbarButton() {
  const ctx = usePluginContext();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

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
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
      {modalOpen && <FigmaModal onClose={closeModal} />}
    </>
  );
}

/**
 * FigmaModal - Full-screen overlay with themed modal shell.
 * Injects plugin CSS on mount, cleans up on unmount.
 * Closes on Escape key or overlay click.
 */
function FigmaModal({ onClose }: { onClose: () => void }) {
  // Inject CSS on mount, remove on unmount
  useEffect(() => {
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = PLUGIN_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on overlay click (not modal body)
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div className="figma-plugin-overlay" onClick={handleOverlayClick}>
      <div className="figma-plugin-modal">
        <div className="figma-plugin-modal-header">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="figma-plugin-modal-title">Figma Design Brief</span>
        </div>
        <div className="figma-plugin-modal-body">
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Figma Plugin — Loading...
          </p>
        </div>
      </div>
    </div>
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
