import { Transaction } from "sequelize";
import { RoomEntity } from "../entities/room.entity";
import { SeatEntity } from "../entities/seat.entity";
import { BaseId } from "../values-objects/base.ov";

export interface RoomRepository {
    getAll(): Promise<RoomEntity[]>;
    save(room: RoomEntity, transaction: Transaction): Promise<void>;
    getById(id: BaseId): Promise<RoomEntity | null>;
    delete(id: BaseId, transaction: Transaction): Promise<void>;

}
