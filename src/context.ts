import type { PluginContextValue } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _w = window as any;

export function usePluginContext(): PluginContextValue | null {
  const React = _w.__SHIPSTUDIO_REACT__;
  const CtxRef = _w.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;

  if (CtxRef && React?.useContext) {
    const ctx = React.useContext(CtxRef) as PluginContextValue | null;
    if (ctx) return ctx;
  }

  // Fall back to legacy global
  const directCtx = _w.__SHIPSTUDIO_PLUGIN_CONTEXT__ as PluginContextValue | undefined;
  if (directCtx) return directCtx;

  return null;
}
