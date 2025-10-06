import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
    globals: true, // opcional: usar describe/it/expect sin importar
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src//*.{ts,tsx}'],
      exclude: ['src/server.ts']
    }
  }
});