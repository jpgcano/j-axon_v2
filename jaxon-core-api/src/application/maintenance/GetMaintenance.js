import { NotFoundException } from '../../domain/core/exceptions.js';
export class GetMaintenance {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const maintenance = await this.repository.findById(id);
        if (!maintenance) {
            throw new NotFoundException('Maintenance', id);
        }
        return maintenance;
    }
}
//# sourceMappingURL=GetMaintenance.js.map