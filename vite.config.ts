import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { miaodaDevPlugin } from "miaoda-sc-plugin";

// Custom plugin to ensure React is available globally
function reactGlobalPlugin() {
  return {
    name: 'react-global',
    transformIndexHtml(html: string) {
      return html;
    },
    config() {
      return {
        define: {
          'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'development',
          ),
        },
      };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
      jsxRuntime: 'automatic',
    }), reactGlobalPlugin(), svgr({
      svgrOptions: {
        icon: true, exportType: 'named', namedExport: 'ReactComponent', }, }), miaodaDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ],
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
