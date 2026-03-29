import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('page.tsx', () => {
  it('define el mensaje principal de onboarding', async () => {
    const content = await readFile(join(__dirname, 'page.tsx'), 'utf8');

    expect(content).toMatch(/To get started, edit the page\.tsx file\./i);
  });

  it('contiene enlaces de documentación y templates', async () => {
    const content = await readFile(join(__dirname, 'page.tsx'), 'utf8');

    expect(content).toMatch(/vercel\.com\/templates/i);
    expect(content).toMatch(/nextjs\.org\/docs/i);
  });
});
