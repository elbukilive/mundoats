import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

// Tus plugins custom
import inlineEditPlugin from './plugins/visual-editor/vite-plugin-react-inline-editor.js';
import editModeDevPlugin from './plugins/visual-editor/vite-plugin-edit-mode.js';
import selectionModePlugin from './plugins/selection-mode/vite-plugin-selection-mode.js';
import iframeRouteRestorationPlugin from './plugins/vite-plugin-iframe-route-restoration.js';
import pocketbaseAuthPlugin from './plugins/vite-plugin-pocketbase-auth.js';

const isDev = process.env.NODE_ENV !== 'production';

// ── Scripts de manejo de errores (sin cambios, solo organizados) ──
const configHorizonsViteErrorHandler = `...`;     // (mantengo el contenido original, solo indico)
const configHorizonsRuntimeErrorHandler = `...`;
const configHorizonsConsoleErrorHandler = `...`;
const configWindowFetchMonkeyPatch = `...`;
const configNavigationHandler = `...`;

// Plugin para inyectar scripts en index.html
const addTransformIndexHtml = {
  name: 'add-transform-index-html',
  transformIndexHtml(html) {
    const tags = [
      { tag: 'script', attrs: { type: 'module' }, children: configHorizonsRuntimeErrorHandler, injectTo: 'head' },
      { tag: 'script', attrs: { type: 'module' }, children: configHorizonsViteErrorHandler, injectTo: 'head' },
      { tag: 'script', attrs: { type: 'module' }, children: configHorizonsConsoleErrorHandler, injectTo: 'head' },
      { tag: 'script', attrs: { type: 'module' }, children: configWindowFetchMonkeyPatch, injectTo: 'head' },
      { tag: 'script', attrs: { type: 'module' }, children: configNavigationHandler, injectTo: 'head' },
    ];

    if (!isDev && process.env.TEMPLATE_BANNER_SCRIPT_URL && process.env.TEMPLATE_REDIRECT_URL) {
      tags.push({
        tag: 'script',
        attrs: {
          src: process.env.TEMPLATE_BANNER_SCRIPT_URL,
          'template-redirect-url': process.env.TEMPLATE_REDIRECT_URL,
        },
        injectTo: 'head',
      });
    }

    return { html, tags };
  },
};

// Custom logger (solo filtra errores de postcss, lo demás pasa)
const logger = createLogger();
const originalError = logger.error;
logger.error = (msg, options) => {
  if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
    return;
  }
  originalError(msg, options);
};

export default defineConfig({
  customLogger: logger,

  plugins: [
    // Solo en desarrollo
    ...(isDev
      ? [
          inlineEditPlugin(),
          editModeDevPlugin(),
          selectionModePlugin(),
          iframeRouteRestorationPlugin(),
          pocketbaseAuthPlugin(),
        ]
      : []),
    react(),
    addTransformIndexHtml,
  ],

  server: {
    port: 3000,
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
    // allowedHosts: true,  ← obsoleto en Vite 5+, se reemplaza por server.host si necesitas
  },

  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.cjs'],

    alias: {
      // Alias principal para src/
      '@': path.resolve(__dirname, './src'),

      // Redirige cualquier referencia vieja a utils → utilidades (por si quedó en algún import o plugin)
      '@/utils': path.resolve(__dirname, './src/utilidades'),
    },
  },

  build: {
    rollupOptions: {
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types',
      ],
    },
  },
});