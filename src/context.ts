import type { PluginContextValue } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _w = window as any;

export function usePluginContext(): PluginContextValue | null {
  const React = _w.__SHIPSTUDIO_REACT__;
  const CtxRef = _w.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;

  if (CtxRef && React?.useContext) {
    return React.useContext(CtxRef) as PluginContextValue | null;
  }

  return null;
}
