import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateMaintenanceStatus } from '../UpdateMaintenanceStatus.js';
import { MaintenanceStatus, MaintenanceType } from '../../../domain/maintenance/Maintenance.js';
describe('UpdateMaintenanceStatus', () => {
    let maintenanceRepository;
    let wsService;
    let updateStatus;
    beforeEach(() => {
        maintenanceRepository = {
            findById: vi.fn(),
            save: vi.fn().mockResolvedValue(undefined),
        };
        wsService = { emitEvent: vi.fn() };
        const auditService = { recordAction: vi.fn() };
        updateStatus = new UpdateMaintenanceStatus(maintenanceRepository, wsService, auditService);
    });
    it('should start maintenance work', async () => {
        const maintenanceMock = {
            start: vi.fn(),
            toPrimitives: () => ({ id: 'm1', status: MaintenanceStatus.IN_PROGRESS }),
        };
        maintenanceRepository.findById.mockResolvedValue(maintenanceMock);
        const result = await updateStatus.execute({
            id: 'm1',
            status: MaintenanceStatus.IN_PROGRESS,
            actorId: 'user1'
        });
        const maintenance = result.unwrap();
        expect(maintenanceMock.start).toHaveBeenCalledWith('user1');
        expect(wsService.emitEvent).toHaveBeenCalledWith('maintenance:updated', expect.anything());
    });
});
//# sourceMappingURL=UpdateMaintenanceStatus.spec.js.map