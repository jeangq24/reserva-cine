import { Transaction } from "sequelize";
import { BookingEntity } from "../entities/booking.entity";
import { BaseId } from "../values-objects/base.ov";

export interface BookingRepository {
    getAll(): Promise<BookingEntity[]>;
    save(booking: BookingEntity, transaction: Transaction): Promise<void>;
    getByIdBillboard(id: BaseId):Promise<BookingEntity[]>;
    cancel(id: BaseId, transaction: Transaction):Promise<void>;
    //delete(id: BaseId): Promise<void>;
}