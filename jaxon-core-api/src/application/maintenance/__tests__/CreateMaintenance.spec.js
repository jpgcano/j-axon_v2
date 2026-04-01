import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateMaintenance } from '../CreateMaintenance.js';
import { MaintenanceStatus, MaintenanceType } from '../../../domain/maintenance/Maintenance.js';
describe('CreateMaintenance', () => {
    let maintenanceRepository;
    let wsService;
    let createMaintenance;
    beforeEach(() => {
        maintenanceRepository = { save: vi.fn().mockResolvedValue(undefined) };
        wsService = { emitEvent: vi.fn() };
        const auditService = { recordAction: vi.fn() };
        createMaintenance = new CreateMaintenance(maintenanceRepository, wsService, auditService);
    });
    it('should schedule new maintenance', async () => {
        const request = {
            assetId: 'asset-1',
            type: MaintenanceType.PREVENTIVE,
            description: 'Monthly checkup',
            scheduledDate: new Date(),
            createdBy: 'user-1'
        };
        const result = await createMaintenance.execute(request);
        const maintenance = result.unwrap();
        expect(maintenance.status).toBe(MaintenanceStatus.SCHEDULED);
        expect(maintenanceRepository.save).toHaveBeenCalled();
        expect(wsService.emitEvent).toHaveBeenCalledWith('maintenance:scheduled', expect.anything());
    });
});
//# sourceMappingURL=CreateMaintenance.spec.js.map