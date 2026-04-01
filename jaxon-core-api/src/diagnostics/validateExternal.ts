import { JwtTokenService } from '../infrastructure/security/JwtTokenService.js';
import { McpClient } from '../infrastructure/external/McpClient.js';

async function validateJwt(): Promise<boolean> {
  const jwtSecret = process.env.JWT_SECRET || null;
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY || null;
  const jwtPublicKey = process.env.JWT_PUBLIC_KEY || null;

  const service = new JwtTokenService(
    jwtSecret,
    jwtPrivateKey,
    jwtPublicKey,
    '1h',
    '7d'
  );

  const tokens = await service.generateToken({ userId: 'diagnostic-user', role: 'ADMIN' });
  const payload = await service.verifyToken(tokens.accessToken);

  return payload.userId === 'diagnostic-user' && payload.role === 'ADMIN';
}

async function validateMcp(): Promise<boolean> {
  const client = new McpClient();
  const result = await client.getPrediction({
    asset: { id: 'diagnostic-asset' },
    ticket: null,
    historyLength: 1,
  });

  return Boolean(result && result.prediction);
}

async function main(): Promise<void> {
  let ok = true;

  try {
    const jwtOk = await validateJwt();
    console.log(`[VALIDATE] JWT: ${jwtOk ? 'OK' : 'FAILED'}`);
    ok = ok && jwtOk;
  } catch (err) {
    console.error('[VALIDATE] JWT: FAILED', err);
    ok = false;
  }

  try {
    const mcpOk = await validateMcp();
    console.log(`[VALIDATE] MCP: ${mcpOk ? 'OK' : 'FAILED'}`);
    ok = ok && mcpOk;
  } catch (err) {
    console.error('[VALIDATE] MCP: FAILED', err);
    ok = false;
  }

  if (!ok) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[VALIDATE] Unexpected failure', err);
  process.exitCode = 1;
});
