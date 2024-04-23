import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Base64 としてインライン化されないようにする : https://ja.vitejs.dev/config/build-options.html#build-assetsinlinelimit
    assetsInlineLimit: 0
  },
  // GitHub Pages へデプロイする際のパス設定 : https://ja.vitejs.dev/guide/static-deploy.html#github-pages
  base: '/practice-phaser-ts/'
});
