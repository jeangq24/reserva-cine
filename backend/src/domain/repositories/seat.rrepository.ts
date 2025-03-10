import { Transaction } from "sequelize";
import { SeatEntity } from "../entities/seat.entity";
import { BaseId } from "../values-objects/base.ov";

export interface SeatRepository {
    //getAll(): Promise<SeatEntity[]>;
    create(seat: SeatEntity, transaction: Transaction): Promise<SeatEntity>;
    update(seat: SeatEntity, transaction: Transaction): Promise<void>;
    delete(id: BaseId, transaction: Transaction): Promise<void>;
    getById(id: BaseId): Promise<SeatEntity>;
    getByIdRoom(id: BaseId): Promise<SeatEntity[]>
    countSeats(id: BaseId):Promise<number[]>
}