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
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'node_modules', 'dist'],
            thresholds: {
                global: {
                    branches: 85,
                    functions: 85,
                    lines: 85,
                    statements: 85,
                },
            },
        },
    },
});
//# sourceMappingURL=vitest.config.js.map