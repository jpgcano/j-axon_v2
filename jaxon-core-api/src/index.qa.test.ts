import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from './index.js';

test('GET /api/v1/health retorna payload esperado', async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('No fue posible resolver el puerto de pruebas');
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/health`);
    const body = (await response.json()) as { status: string; service: string };

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: 'ok', service: 'jaxon-core-api' });
  } finally {
    server.close();
  }
});

test('Rutas desconocidas retornan 404', async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('No fue posible resolver el puerto de pruebas');
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/no-existe`);

    assert.equal(response.status, 404);
  } finally {
    server.close();
  }
});
