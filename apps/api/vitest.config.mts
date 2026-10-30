import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { TEST_ENV } from './test/test-env';

export default defineConfig({
  // SWC kvůli dekorátorům a emitDecoratorMetadata, které Nest pro injekci závislostí potřebuje.
  plugins: [swc.vite()],
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    globalSetup: ['test/global-setup.ts'],
    env: TEST_ENV,
    // Integrační testy sdílejí jednu databázi, proto neběží souběžně.
    fileParallelism: false,
  },
});
