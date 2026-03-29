export class ListTickets {
    ticketRepository;
    constructor(ticketRepository) {
        this.ticketRepository = ticketRepository;
    }
    async execute() {
        return await this.ticketRepository.findAll();
    }
}
//# sourceMappingURL=ListTickets.js.map