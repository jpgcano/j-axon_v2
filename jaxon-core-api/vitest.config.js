import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/application/**/*.ts'],
            exclude: ['src/application/**/*.spec.ts'],
        },
    },
});
//# sourceMappingURL=vitest.config.js.map