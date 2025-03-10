import { Transaction, where } from "sequelize";
import { SeatResponseDto } from "../../application/dtos/seat.dtos";
import { RoomEntity } from "../../domain/entities/room.entity";
import { SeatEntity } from "../../domain/entities/seat.entity";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { SeatRepository } from "../../domain/repositories/seat.rrepository";
import { BaseId, BaseStatus } from "../../domain/values-objects/base.ov";
import { NameRoom, NumberRoom } from "../../domain/values-objects/room.ov";
import { NumberSeat, NumberSeatRow } from "../../domain/values-objects/seat-ob";
import { RoomModel } from "../models/room.model";
import { SeatModel } from "../models/seat.model";
import { ParseEntities } from "../../application/services/parse-entity.service";
import { RoomRepository } from "../../domain/repositories/room.repository";
import { BillboardModel } from "../models/billboard.model";

export class SequelizeSeatRepository implements SeatRepository {

    public async create(seat: SeatEntity, transaction: Transaction): Promise<SeatEntity> {
        const seatDto = new SeatResponseDto(seat)
        await SeatModel.create({ ...seatDto, roomId: seatDto.roomId }, { transaction })
        return seat
    }

    public async update(seat: SeatEntity, transaction: Transaction): Promise<void> {
        const seatDto = new SeatResponseDto(seat);
        await SeatModel.update(
            {
                ...seatDto,
                roomId: seatDto.roomId
            },
            {
                where: {
                    id: seatDto.id
                },
                transaction
            }
        )
    }

    public async getByIdRoom(id: BaseId): Promise<SeatEntity[]> {
        this.validIdCorrect(id.value);
        const room = await RoomModel.findByPk(id.value)
        if (!room) {
            throw new CustomException(`La sala no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        const roomEntity = ParseEntities.toRoomEntity(room)
        const seats = await SeatModel.findAll({ where: { roomId: id.value } });
        if (seats.length) {

            return seats.map((seat) => {
                return ParseEntities.toSeatEntity(seat, roomEntity);
            })
        } else {
            throw new CustomException(`No se encontraron sillas vinculadas a esta sala`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

    }

    public async getById(id: BaseId): Promise<SeatEntity> {
        this.validIdCorrect(id.value);
        const seat = await SeatModel.findByPk(id.value);
        if (!seat) {
            throw new CustomException(`La silla no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        const room = await RoomModel.findByPk(seat.roomId)

        if (!room) {
            throw new CustomException(`La sala no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        const roomEntity = ParseEntities.toRoomEntity(room);
        return ParseEntities.toSeatEntity(seat, roomEntity);
    }

    public async delete(id: BaseId, transaction: Transaction): Promise<void> {
        this.validIdCorrect(id.value)
        const response = await SeatModel.destroy({ where: { roomId: id.value }, transaction })
        if (!response) {
            throw new CustomException(`La silla no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
    };

    public async countSeats(id: BaseId): Promise<number[]> {
        this.validIdCorrect(id.value)
        
        const billboardModel = await BillboardModel.findByPk(id.value);
       
        if(!billboardModel) {
            throw new CustomException(`La cartelera no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const seats = await SeatModel.findAll({where: { roomId: billboardModel.roomId }})

        const total = seats.length
        const enabled = seats.filter(seat=>seat.status).length
        const disabled = seats.filter(seat=>!seat.status).length
        return [total, enabled , disabled]
    }

    private validIdCorrect(id: string) {
        if (typeof id !== "string" || id.length <= 0) {
            throw new CustomException(`Envie un "ID" de registro correcto`, ErrorCodes.INVALID_INPUT, HttpStatus.BAD_REQUEST)
        }
    }
}