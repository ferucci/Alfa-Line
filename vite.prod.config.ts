import fs from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));

const input = htmlFiles.reduce((acc, file) => {
  const name = file.replace('.html', '');
  acc[name] = resolve(__dirname, file);
  return acc;
}, {});

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[ext]/[name][extname]';

          const fullPath = assetInfo.name;
          const extType = assetInfo.name.split('.').pop()?.toLowerCase();

          if (extType && ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif'].includes(extType)) {
            const imagesIndex = fullPath.indexOf('images/');
            if (imagesIndex !== -1) {
              return fullPath.slice(imagesIndex);
            }
            return `assets/images/${fullPath}`;
          }

          return 'assets/[ext]/[name][extname]';
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js'
      }
    }
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace(/ type="module"/g, '')
          .replace(/ crossorigin/g, '')
          .replace(/(<script[^>]*)(>)/g, '$1 defer$2');
      }
    }
  ],
  css: {
    devSourcemap: false // Отключаем sourcemaps в production
  }
});