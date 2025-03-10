import { Transaction } from "sequelize";
import { BillboardEntity } from "../entities/billboard.entity";
import { BaseId } from "../values-objects/base.ov";

export interface BillboardRepository {
    getAll():Promise<BillboardEntity[]>;
    save(billboard: BillboardEntity, transaction: Transaction): Promise<void>;
    cancel(billboard: BillboardEntity, transaction: Transaction): Promise<void>
    delete(id: BaseId, transaction: Transaction): Promise<void>;
    getById(id: BaseId):Promise<BillboardEntity>;
    
}