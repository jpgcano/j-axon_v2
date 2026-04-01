import { test, expect, describe } from 'vitest';
import request from 'supertest';
import { createApp } from './index.js';
describe('Core API QA', () => {
    const app = createApp();
    test('GET /api/v1/health retorna payload esperado', async () => {
        const response = await request(app).get('/api/v1/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok', service: 'jaxon-core-api' });
    });
    test('Rutas desconocidas retornan 404', async () => {
        const response = await request(app).get('/api/v1/no-existe');
        expect(response.status).toBe(404);
    });
});
//# sourceMappingURL=index.qa.test.js.map