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
    get type() { return this.props.type; }
    get status() { return this.props.status; }
    start(updatedBy) {
        this.props.status = MaintenanceStatus.IN_PROGRESS;
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    complete(updatedBy) {
        this.props.status = MaintenanceStatus.COMPLETED;
        this.props.completedDate = new Date();
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    cancel(updatedBy) {
        this.props.status = MaintenanceStatus.CANCELLED;
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    toPrimitives() {
        return { ...this.props };
    }
}
//# sourceMappingURL=Maintenance.js.map