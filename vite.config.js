import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from './viteEjsPlugin.js';
import sassGlobImports from 'vite-plugin-sass-glob-import';
import { globSync } from 'glob';
import liveReload from 'vite-plugin-live-reload';
import {ViteGenerateIndexPlugin} from "./viteGenerateIndexPlugin.js";

// Function to normalize paths
const normalizePath = (filePath) => {
  return filePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes for consistency
};


const jsFiles = Object.fromEntries(
  globSync('src/**/*.js', { ignore: ['node_modules/**','**/modules/**','**/dist/**']}).map(file => [
    normalizePath(path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ).replace(/^assets\//, '')),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const scssFiles = Object.fromEntries(
  globSync('src/assets/styles/**/*.scss', { ignore: ['node_modules/**','common/**','**/_*.scss'] }).map(file => [
    normalizePath(
      path.relative('src', file).replace(/^assets\//, '')
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const htmlFiles = Object.fromEntries(
  globSync('src/pages/**/*.html', { ignore: ['node_modules/**'] }).map(file => [
    normalizePath(
      path.relative('src/pages', file)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const extraFiles = {
  'index.html': fileURLToPath(new URL('./src/index.html', import.meta.url)),
};

const inputObject = { ...scssFiles, ...jsFiles, ...htmlFiles, ...extraFiles  };
console.table(inputObject)

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: 'public',
  plugins: [
    ViteEjsPlugin(),
    ViteGenerateIndexPlugin(),
    sassGlobImports(),
    liveReload(['templates/**/*.ejs'])
  ],
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      },
    ],
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: inputObject,
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      },
    },
  },
  server: {
    port: 3000,
  }
});
