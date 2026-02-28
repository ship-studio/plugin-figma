import type { PluginContextValue } from './types';

const React = (window as any).__SHIPSTUDIO_REACT__;
const { useRef } = React;

/**
 * Hook that reads the plugin context from the Ship Studio host.
 * The host sets window.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__ as a React ref
 * whose .current always holds the latest context value.
 */
export function usePluginContext(): PluginContextValue {
  const contextRef = (window as any).__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  return contextRef.current;
}
