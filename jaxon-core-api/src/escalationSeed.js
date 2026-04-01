import { ticketRepository } from './infrastructure/di/container.js';
/**
 * Seeder de Prueba para Regla de Negocio 02 (Escalada)
 * Crea tickets de riesgo ALTO con antigüedad > 4 horas.
 */
export async function seedEscalationTestData() {
    const fiveHoursAgo = new Date();
    fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5);
    const testTicket = {
        description: 'FALLA CRÍTICA DE ENFRIAMIENTO - PRUEBA DE ESCALADA',
        riskLevel: 'HIGH',
        status: 'OPEN',
        assignedTo: 'TECH_001',
        createdAt: fiveHoursAgo,
        metadata: { test: true }
    };
    console.log('[Seeder] Insertando ticket vencido para validar SLA...');
    await ticketRepository.save(testTicket);
    console.log('[Seeder] Datos de prueba listos.');
}
if (process.argv[2] === '--run') {
    seedEscalationTestData();
}
//# sourceMappingURL=escalationSeed.js.map