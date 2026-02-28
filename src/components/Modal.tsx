import { useEffect, useCallback } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { STYLE_ID, PLUGIN_CSS } from '../styles';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
}

/**
 * Reusable modal shell with overlay, header, body, escape-to-close.
 * Injects plugin CSS on mount and cleans up on unmount.
 */
export function Modal({ open, onClose, title, headerRight, children }: ModalProps) {
  // Inject CSS on mount, remove on unmount
  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Close on overlay click (not modal body)
  const handleOverlayClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!open) return null;

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
          <span className="figma-plugin-modal-title">{title}</span>
          {headerRight && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              {headerRight}
            </div>
          )}
        </div>
        <div className="figma-plugin-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
