import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import { randomUUID } from 'crypto';
export class CreateMaintenance {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const id = randomUUID();
        const now = new Date();
        const props = {
            id,
            assetId: request.assetId,
            ticketId: request.ticketId || null,
            type: request.type,
            description: request.description,
            scheduledDate: request.scheduledDate,
            completedDate: null,
            status: MaintenanceStatus.SCHEDULED,
            assignedTechId: null,
            createdBy: request.actorId,
            updatedBy: request.actorId,
            createdAt: now,
            updatedAt: now,
        };
        const maintenance = new Maintenance(props);
        await this.repository.save(maintenance);
        return maintenance;
    }
}
//# sourceMappingURL=CreateMaintenance.js.map