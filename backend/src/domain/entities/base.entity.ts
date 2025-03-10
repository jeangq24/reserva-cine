import { BaseId, BaseStatus } from "../values-objects/base.ov";

export abstract class BaseEntity {
    private id: BaseId;
    private status: BaseStatus;

    constructor(id: BaseId, status: BaseStatus) {
       this.id = id;
       this.status = status
    };

    public getId(): BaseId {
        return this.id;
    }

    public getStatus():BaseStatus {
        return this.status;
    }    
};