import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Использует относительные пути вместо абсолютных
  build: {
    outDir: 'dist',
    assetsDir: '.', // Ассеты будут рядом с index.html
  },
  css: {
    devSourcemap: true, // Включает source maps для CSS/SCSS в режиме разработки
  }
});