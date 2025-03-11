import { Transaction } from "sequelize";
import { SeatEntity } from "../../domain/entities/seat.entity";
import { SeatRepository } from "../../domain/repositories/seat.rrepository";
import { BaseId } from "../../domain/values-objects/base.ov";

export class SeatService {
    constructor(private readonly repository: SeatRepository) { }

    public getAll():Promise<SeatEntity[]> {
        return this.repository.getAll()
    }
    
    public create(seat: SeatEntity, transaction: Transaction): Promise<SeatEntity> {
        return this.repository.create(seat, transaction);
    }

    public update(seat: SeatEntity, transaction: Transaction): Promise<void> {
        return this.repository.update(seat, transaction);
    }

    public getById(id: BaseId): Promise<SeatEntity> {
        return this.repository.getById(id)
    }

    public getByIdRoom(id: BaseId): Promise<SeatEntity[]> {
        return this.repository.getByIdRoom(id)
    }

    public delete(id: BaseId, transaction: Transaction): Promise<void> {
        return this.repository.delete(id, transaction)
    }

    public countSeats(id: BaseId):Promise<number[]> {
        return this.repository.countSeats(id)
    }
}