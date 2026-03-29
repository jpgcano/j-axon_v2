export var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MODERATE"] = "MODERATE";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["EXTREME"] = "EXTREME";
})(RiskLevel || (RiskLevel = {}));
export var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["RESOLVED"] = "RESOLVED";
})(TicketStatus || (TicketStatus = {}));
export class Ticket {
    props;
    constructor(props) {
        this.props = props;
    }
    get id() { return this.props.id; }
    get assetId() { return this.props.assetId; }
    get status() { return this.props.status; }
    get inherentRiskLevel() { return this.props.inherentRiskLevel; }
    assignTo(techId, updatedBy) {
        this.props.assignedTechId = techId;
        this.props.status = TicketStatus.IN_PROGRESS;
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    resolve(updatedBy) {
        this.props.status = TicketStatus.RESOLVED;
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    toPrimitives() {
        return { ...this.props };
    }
}
//# sourceMappingURL=Ticket.js.map