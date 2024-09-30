import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import baseConfig from '../../vite.config';
import { resolve } from 'path';

export default defineConfig(() => {
  return {
    ...baseConfig,
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.vercel-edge.tsx', '@qwik-city-plan'],
      },
    },
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
    ],
    resolve: {
      alias: {
        '~': resolve(__dirname, '../../src'),
      },
    },
  };
});
