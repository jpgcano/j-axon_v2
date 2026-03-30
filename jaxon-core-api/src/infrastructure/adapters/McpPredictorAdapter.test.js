import { test, expect, describe } from 'vitest';
import { McpPredictorAdapter } from './McpPredictorAdapter.js';
describe('McpPredictorAdapter - Resiliencia y Circuit Breaker', () => {
    const baseUrl = 'http://localhost:9000';
    test('debe abrir el circuito después de 3 fallos consecutivos', async () => {
        // Mocking fetch global para simular error de red
        const originalFetch = global.fetch;
        let callCount = 0;
        global.fetch = async () => {
            callCount++;
            throw new Error('Connection Refused');
        };
        const adapter = new McpPredictorAdapter(baseUrl);
        // Ejecutar 3 fallos
        await adapter.predict({ data: 'test' }); // Fallo 1
        await adapter.predict({ data: 'test' }); // Fallo 2
        await adapter.predict({ data: 'test' }); // Fallo 3 -> Aquí se abre
        expect(adapter.getStatus()).toBe('OPEN');
        expect(callCount).toBe(3);
        // Cuarto intento: El circuito está abierto, no debería llamar a fetch
        const result = await adapter.predict({ data: 'test' });
        expect(result).toBeNull();
        expect(callCount).toBe(3);
        // Restaurar fetch original
        global.fetch = originalFetch;
    });
    test('debe resetearse a CLOSED tras una petición exitosa en HALF_OPEN', async () => {
        // Para esta prueba, forzamos manualmente el estado HALF_OPEN simulando el paso del tiempo
        const adapter = new McpPredictorAdapter(baseUrl);
        // @ts-ignore: Acceso a propiedad privada para testing de estado interno
        adapter.state = 'OPEN';
        // @ts-ignore
        adapter.lastFailureTime = Date.now() - 40000; // Simulamos que pasaron > 30s
        global.fetch = async () => ({
            ok: true,
            json: async () => ({ prediction: 'OK' })
        });
        await adapter.predict({});
        expect(adapter.getStatus()).toBe('CLOSED');
    });
});
//# sourceMappingURL=McpPredictorAdapter.test.js.map