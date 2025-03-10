import { Transaction } from "sequelize";
import { BookingEntity } from "../../domain/entities/booking.entity";
import { BookingRepository } from "../../domain/repositories/booking.repositrory";
import { BaseId } from "../../domain/values-objects/base.ov";


export class BookingService {
    constructor (private readonly repository: BookingRepository) {}

    public getAll():Promise<BookingEntity[]> {
        return this.repository.getAll();
    }

    public save(booking: BookingEntity, transaction: Transaction):Promise<void> {
        return this.repository.save(booking, transaction);
    }
    getByIdBillboard(id: BaseId):Promise<BookingEntity[]> {
        return this.repository.getByIdBillboard(id)
    }

    cancel(id: BaseId, transaction: Transaction):Promise<void> {
        return this.repository.cancel(id, transaction);
    }
    // public getById(id: BaseId): Promise<BookingEntity> {
    //     return this.repository.getById(id)
    // }

    // public delete(id: BaseId): Promise<void> {
    //     return this.repository.delete(id)
    // }
}