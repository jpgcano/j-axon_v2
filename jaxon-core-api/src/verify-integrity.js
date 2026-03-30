import { auditRepository } from './infrastructure/di/container.js';
import { HashService } from './infrastructure/security/HashService.js';
async function verifyAuditChain() {
    console.log('--- J-axon Forensic Integrity Verification ---');
    const logs = await auditRepository.findAll();
    // Sort by date ascending to verify the chain
    const sortedLogs = logs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    let isValid = true;
    let lastHash = '0'.repeat(64);
    for (const log of sortedLogs) {
        const calculatedHash = HashService.chain(log.hashPrev, log.payloadAfter);
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
    }
    else {
        console.error('[CRITICAL] Forensic chain has been COMPROMISED.');
        process.exit(1);
    }
}
verifyAuditChain().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=verify-integrity.js.map