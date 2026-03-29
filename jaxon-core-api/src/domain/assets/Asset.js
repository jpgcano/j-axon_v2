export var AssetStatus;
(function (AssetStatus) {
    AssetStatus["ACTIVE"] = "ACTIVE";
    AssetStatus["MAINTENANCE"] = "MAINTENANCE";
    AssetStatus["RETIRED"] = "RETIRED";
})(AssetStatus || (AssetStatus = {}));
export class Asset {
    props;
    constructor(props) {
        this.props = props;
    }
    get id() { return this.props.id; }
    get description() { return this.props.description; }
    get category() { return this.props.category; }
    get status() { return this.props.status; }
    get assignedTo() { return this.props.assignedTo; }
    changeStatus(newStatus, updatedBy) {
        this.props.status = newStatus;
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    assignTo(userId, updatedBy) {
        this.props.assignedTo = userId;
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    unassign(updatedBy) {
        this.props.assignedTo = null;
        this.props.updatedBy = updatedBy;
        this.props.updatedAt = new Date();
    }
    toPrimitives() {
        return { ...this.props };
    }
}
//# sourceMappingURL=Asset.js.map