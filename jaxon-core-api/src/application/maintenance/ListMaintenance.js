export class ListMaintenance {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        return await this.repository.findAll();
    }
}
//# sourceMappingURL=ListMaintenance.js.map