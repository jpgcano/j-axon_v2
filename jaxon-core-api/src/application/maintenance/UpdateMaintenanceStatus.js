import { Maintenance } from '../../domain/maintenance/Maintenance.js';
import { NotFoundException } from '../../domain/core/exceptions.js';
export class UpdateMaintenanceStatus {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(request) {
        const maintenance = await this.repository.findById(request.id);
        if (!maintenance) {
            throw new NotFoundException('Maintenance', request.id);
        }
        maintenance.updateStatus(request.status, request.actorId);
        await this.repository.save(maintenance);
        return maintenance;
    }
}
//# sourceMappingURL=UpdateMaintenanceStatus.js.map