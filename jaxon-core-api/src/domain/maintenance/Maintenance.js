export var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["PREVENTIVE"] = "PREVENTIVE";
    MaintenanceType["CORRECTIVE"] = "CORRECTIVE";
})(MaintenanceType || (MaintenanceType = {}));
export var MaintenanceStatus;
(function (MaintenanceStatus) {
    MaintenanceStatus["SCHEDULED"] = "SCHEDULED";
    MaintenanceStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MaintenanceStatus["COMPLETED"] = "COMPLETED";
    MaintenanceStatus["CANCELLED"] = "CANCELLED";
})(MaintenanceStatus || (MaintenanceStatus = {}));
export class Maintenance {
    props;
    constructor(props) {
        this.props = props;
    }
    get id() { return this.props.id; }
    get assetId() { return this.props.assetId; }
    get status() { return this.props.status; }
    get type() { return this.props.type; }
    updateStatus(newStatus, updatedBy) {
        if (newStatus === MaintenanceStatus.COMPLETED && this.props.status !== MaintenanceStatus.COMPLETED) {
            this.props.completedDate = new Date();
        }
        this.props.status = newStatus;
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    toPrimitives() {
        return { ...this.props };
    }
}
//# sourceMappingURL=Maintenance.js.map