import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react(), compression()];
  if (mode === 'development') {
    plugins.push(visualizer({ open: true }));
  }

  return {
    plugins,
    base: '/pancakes/',
  };
});
