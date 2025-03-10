import { Transaction } from "sequelize";
import { BillboardEntity } from "../../domain/entities/billboard.entity";
import { BillboardRepository } from "../../domain/repositories/billboard.repository";
import { BaseId } from "../../domain/values-objects/base.ov";

export class BillboardService {
    constructor(private readonly repository: BillboardRepository) { }

    public getAll():Promise<BillboardEntity[]> {
        return this.repository.getAll()
    }

    public save(billboard: BillboardEntity, transaction: Transaction):Promise<void> {
        return this.repository.save(billboard, transaction);
    }

    public cancel(billboard: BillboardEntity, transaction: Transaction): Promise<void> {
        return this.repository.cancel(billboard, transaction)
    }

    public delete(id: BaseId, transaction: Transaction): Promise<void> {
        return this.repository.delete(id, transaction)
    }

    public getById(id: BaseId):Promise<BillboardEntity> {
        return this.repository.getById(id);
    }

    getByFilters(filters: {startDate?: Date; endDate?: Date; categories?: string[];}): Promise<BillboardEntity[]> {
        return this.repository.getByFilters(filters);
    }
}