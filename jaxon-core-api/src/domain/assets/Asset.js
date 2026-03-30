export var AssetStatus;
(function (AssetStatus) {
    AssetStatus["ACTIVE"] = "ACTIVE";
    AssetStatus["MAINTENANCE"] = "MAINTENANCE";
    AssetStatus["RETIRED"] = "RETIRED";
})(AssetStatus || (AssetStatus = {}));
export class Asset {
    _props;
    constructor(props) {
        this._props = { ...props };
    }
    get id() { return this._props.id; }
    get description() { return this._props.description; }
    get category() { return this._props.category; }
    get status() { return this._props.status; }
    get assignedTo() { return this._props.assignedTo; }
    get props() { return { ...this._props }; }
    changeStatus(newStatus, updatedBy) {
        if (!Object.values(AssetStatus).includes(newStatus)) {
            throw new Error(`Invalid asset status: ${newStatus}`);
        }
        this._props.status = newStatus;
        if (updatedBy) {
            this._props.updatedBy = updatedBy;
        }
        this._props.updatedAt = new Date();
    }
    assignTo(userId, updatedBy) {
        if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
            throw new Error('Assigned user is required');
        }
        this._props.assignedTo = userId;
        if (updatedBy) {
            this._props.updatedBy = updatedBy;
        }
        this._props.updatedAt = new Date();
    }
    unassign(updatedBy) {
        this._props.assignedTo = null;
        if (updatedBy) {
            this._props.updatedBy = updatedBy;
        }
        this._props.updatedAt = new Date();
    }
    toPrimitives() {
        return { ...this._props };
    }
}
//# sourceMappingURL=Asset.js.map