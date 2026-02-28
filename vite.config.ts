import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        paths: {
          'react': 'data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export default R;export const{useState,useEffect,useCallback,useRef,useMemo,useContext,createContext,createElement,Fragment}=R;',
          'react-dom': 'data:text/javascript,export default window.__SHIPSTUDIO_REACT_DOM__',
          'react/jsx-runtime': 'data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;',
        },
      },
    },
  },
});
