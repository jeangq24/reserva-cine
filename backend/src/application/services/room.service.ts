import { Transaction } from "sequelize";
import { RoomEntity } from "../../domain/entities/room.entity";
import { RoomRepository } from "../../domain/repositories/room.repository";
import { BaseId, BaseStatus } from "../../domain/values-objects/base.ov";
import { NameRoom, NumberRoom } from "../../domain/values-objects/room.ov";
import { CreateRoomDto, UpdateRoomDto } from "../dtos/room.dtos";

export class RoomService {
    constructor(private readonly repository: RoomRepository) { }

    public getAll(): Promise<RoomEntity[]> {
        return this.repository.getAll();
    }

    public save(room: RoomEntity, transaction: Transaction): Promise<void> {
        return this.repository.save(room, transaction);
    }

    public getById(id: BaseId): Promise<RoomEntity | null> {
        return this.repository.getById(id)
    }

    public delete(id: BaseId, transaction: Transaction): Promise<void> {
        return this.repository.delete(id, transaction)
    }
}