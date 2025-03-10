import { CreateRoomDto, RoomResponseDto, UpdateRoomDto } from "../../application/dtos/room.dtos";
import { ParseEntities } from "../../application/services/parse-entity.service";
import { RoomEntity } from "../../domain/entities/room.entity";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { RoomRepository } from "../../domain/repositories/room.repository";
import { BaseId, BaseStatus } from "../../domain/values-objects/base.ov";
import { NameRoom, NumberRoom } from "../../domain/values-objects/room.ov";
import { RoomModel } from "../models/room.model";
import { Op, Transaction } from "sequelize";


export class SequelizeRoomRepository implements RoomRepository {


    async getAll(): Promise<RoomEntity[]> {
        const rooms = await RoomModel.findAll();
        return rooms.map(ParseEntities.toRoomEntity);
    }


    async getById(id: BaseId): Promise<RoomEntity | null> {
        this.validIdCorrect(id.value);
        const room = await RoomModel.findByPk(id.value);
        if (!room) {
            throw new CustomException(`La sala no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)   
        }
        const roomEntity =  ParseEntities.toRoomEntity(room);
        return roomEntity
    }


    async delete(id: BaseId, transaction: Transaction): Promise<void> {
        this.validIdCorrect(id.value);
        const response = await RoomModel.destroy({ where: { id: id.value }, transaction })
        if (!response) {
            throw new CustomException(`La sala no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
    }


    public async save(room: RoomEntity, transaction?: Transaction): Promise<void> {
        const roomDto = new RoomResponseDto(room);
        this.validIdCorrect(roomDto.id);
        await this.validateUniqueRoomData(roomDto);
        await RoomModel.upsert({ ...roomDto }, {transaction});
    }



    private validIdCorrect(id: string) {
        if (typeof id !== "string" || id.length <= 0) {
            throw new CustomException(`Envie un "ID" de registro correcto`, ErrorCodes.INVALID_INPUT, HttpStatus.BAD_REQUEST)
        }
    }


    private async validateUniqueRoomData(room: RoomResponseDto): Promise<void> {

        const whereCondition: any = {
            [Op.and]: [

                { nameRoom: room.nameRoom },
                { numberRoom: room.numberRoom }
            ]
        };

        const roomExists = await RoomModel.findOne({
            where: whereCondition
        });

        if (roomExists) {
            let messagge = "El nombre de sala ya está registrado."
            throw new CustomException(messagge, ErrorCodes.RECORD_DUPLICATE_DATA, HttpStatus.CONFLICT);
        }
    }
}