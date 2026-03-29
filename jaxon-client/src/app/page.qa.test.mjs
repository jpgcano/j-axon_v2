import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('page.tsx define el mensaje principal de onboarding', async () => {
  const content = await readFile(join(__dirname, 'page.tsx'), 'utf8');

  assert.match(content, /To get started, edit the page\.tsx file\./i);
});

test('page.tsx contiene enlaces de documentación y templates', async () => {
  const content = await readFile(join(__dirname, 'page.tsx'), 'utf8');

  assert.match(content, /vercel\.com\/templates/i);
  assert.match(content, /nextjs\.org\/docs/i);
});
