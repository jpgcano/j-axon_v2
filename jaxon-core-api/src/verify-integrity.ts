import { auditRepository } from './infrastructure/di/container.js';
import { createHash } from 'node:crypto';

async function verifyAuditChain() {
  console.log('--- J-axon Forensic Integrity Verification ---');
  
  if (!process.env.MASTER_SALT_HASH) {
    console.error('[CRITICAL] MASTER_SALT_HASH not defined. Cannot verify integrity.');
    process.exit(1);
  }

  const logs = await auditRepository.findAll();
  
  // Sort by date ascending to verify the chain
  const sortedLogs = logs.sort((a, b) => {
    const timeDiff = a.createdAt.getTime() - b.createdAt.getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.id.localeCompare(b.id);
  });
  
  let isValid = true;
  let lastHash = '0'.repeat(64);

  for (const log of sortedLogs) {
    // Tarea 3.2: Reconstrucción del hash exacto usado en AuditLoggerAdapter
    const hashInput = JSON.stringify({
      entityTable: log.entityTable,
      entityId: log.entityId,
      actionType: log.actionType,
      payloadBefore: log.payloadBefore || null,
      payloadAfter: log.payloadAfter || null,
      actorId: log.actorId,
      ipOrigin: log.ipOrigin || '127.0.0.1',
      prevHash: log.hashPrev,
      salt: process.env.MASTER_SALT_HASH || 'default_salt'
    });

    const calculatedHash = createHash('sha256')
      .update(hashInput)
      .digest('hex');
    
    if (log.hashPrev !== lastHash) {
      console.error(`[INTEGRITY ERROR] Hash prev mismatch at log ${log.id}`);
      isValid = false;
    }

    if (log.hashCurrent !== calculatedHash) {
      console.error(`[INTEGRITY ERROR] Hash current mismatch at log ${log.id}`);
      isValid = false;
    }

    lastHash = log.hashCurrent;
  }

  if (isValid) {
    console.log('[SUCCESS] Forensic chain is VALID and INTACT.');
  } else {
    console.error('[CRITICAL] Forensic chain has been COMPROMISED.');
    process.exit(1);
  }
}

verifyAuditChain().catch(err => {
  console.error(err);
  process.exit(1);
});
