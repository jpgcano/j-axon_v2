import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../index.js';
describe('AssetController Integration', () => {
    const app = createApp();
    it('GET /api/assets returns 200', async () => {
        const response = await request(app).get('/api/assets');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('GET /api/v1/health returns ok', async () => {
        const response = await request(app).get('/api/v1/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok', service: 'jaxon-core-api' });
    });
    it('GET /api/assets/:id returns 404 for non-existent', async () => {
        const response = await request(app).get('/api/assets/non-existent');
        expect(response.status).toBe(404);
    });
});
//# sourceMappingURL=AssetController.integration.spec.js.map