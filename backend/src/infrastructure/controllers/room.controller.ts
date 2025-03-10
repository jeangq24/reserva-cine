import { RoomResponseDto } from "../../application/dtos/room.dtos";
import { RoomService } from "../../application/services/room.service";
import { Request, Response, NextFunction } from "express";
import { RoomEntity } from "../../domain/entities/room.entity";
import { NameRoom, NumberRoom } from "../../domain/values-objects/room.ov";
import { BaseId, BaseStatus } from "../../domain/values-objects/base.ov";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { IdGenerator } from "../../application/services/id-generate.service";
import { SeatEntity } from "../../domain/entities/seat.entity";
import { NumberSeat, NumberSeatRow } from "../../domain/values-objects/seat-ob";
import { SeatService } from "../../application/services/seat.service";
import { database } from "../database/connection";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { Transaction } from "sequelize";
import { SeatResponseDto } from "../../application/dtos/seat.dtos";
import { ParseEntities } from "../../application/services/parse-entity.service";

export class RoomController {

    constructor(private readonly roomService: RoomService, private readonly seatService: SeatService) { }

    // OBTENER TODAS LAS SALAS
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const rooms = await this.roomService.getAll();
            const response = rooms.map(room => new RoomResponseDto(room));
            res.status(HttpStatus.OK).json({ message: "Salas obtenidas corractamente.", data: response });
        } catch (error) {
            next(error);
        }

    }


    // CREAR UNA SALA CON SU SILLAS
    public async create(req: Request, res: Response, next: NextFunction) {
        const transaction = await database.getSequelizeInstance().transaction();

        try {
            const requestBody = req.body;
            const rommId = IdGenerator.generate();
            const roomData = {
                id: rommId,
                nameRoom: requestBody.nameRoom,
                numberRoom: requestBody.numberRoom,
                status: true
            }
            const roomEntity = this.toRoom(roomData);
            await this.roomService.save(roomEntity, transaction)
            const seatData = {
                numberRows: requestBody.numberRows,
                numberSeatsRows: requestBody.numberSeatRows,
                room: roomEntity
            }
            await this.generateSeats(seatData, transaction);
            const roomDto = new RoomResponseDto(roomEntity);
            await transaction.commit()
            res.status(HttpStatus.CREATED).json({ message: "Sala creada correctamente.", data: roomDto });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    // ACTUALIZA UNA SALA (NO EDITA SILLAS)
    public async update(req: Request, res: Response, next: NextFunction) {
        const transaction = await database.getSequelizeInstance().transaction();
        try {

            const requestBody = req.body;
            const roomData = {
                id: requestBody.id,
                nameRoom: requestBody.nameRoom,
                numberRoom: requestBody.numberRoom,
                status: requestBody.status
            }
            const roomEntity = this.toRoom(roomData);
            await this.roomService.getById(new BaseId(requestBody.id));
            await this.roomService.save(roomEntity, transaction);
            const roomDto = new RoomResponseDto(roomEntity);
            await transaction.commit();
            res.status(HttpStatus.CREATED).json({ message: "Sala actualizada correctamente", data: roomDto });

        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }


    //OBTENE UNA SALA POR ID
    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const requestParams = req.params;
            const roomEntity = await this.roomService.getById(new BaseId(requestParams.id));
            if (roomEntity) {
                const roomDto = new RoomResponseDto(roomEntity)
                res.status(HttpStatus.OK).json({ message: "Sala obtenida correctamente.", data: roomDto });
            }
        } catch (error) {
            next(error);
        }
    }


    //CAMBIA EL ESTADO DE UNA SILLA
    public async updateSeat(req: Request, res: Response, next: NextFunction) {
        const transaction = await database.getSequelizeInstance().transaction();
        try {
            const requestParams = req.params;
            const seatEnttity = await this.seatService.getById(new BaseId(requestParams.id))

            if (!seatEnttity) {
                throw new CustomException("la silla no existe en la base de datos", ErrorCodes.RECORD_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            const seatDto = new SeatResponseDto(seatEnttity);
            const newSeatData = {
                ...seatDto,
                status: !seatEnttity.getStatus().value
            }
            const roomEntity = await this.roomService.getById(new BaseId(seatDto.roomId));

            if (!roomEntity) {
                throw new CustomException("La sala no existe en la base de datos", ErrorCodes.RECORD_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const newSeatEntity = ParseEntities.toSeatEntity(newSeatData, roomEntity)
            await this.seatService.update(newSeatEntity, transaction);
            await transaction.commit()
            res.status(HttpStatus.OK).json({ message: "Silla editada correctamente.", data:newSeatEntity });
        } catch (error) {
            await transaction.rollback();
            next(error)
        }

    }


    //ELIMINA UNA SALA CON SUS SILLAS ASOCIADAS
    public async delete (req: Request, res: Response, next: NextFunction) {
    const transaction = await database.getSequelizeInstance().transaction();
    try {
        const requestBody = req.body;
        const baseId = new BaseId(requestBody.id);
        await this.roomService.delete(baseId, transaction);
        await this.seatService.delete(baseId, transaction);
        transaction.commit()
        res.status(HttpStatus.OK).json({ message: "Sala eliminada correctamente.", data: null });

    } catch (error) {
        transaction.rollback();
        next(error)
    }
}


    //PARSEA DATOS A UNA ROOM ENTIDAD
    private toRoom(data: { id: string, status: boolean, nameRoom: string, numberRoom: number }): RoomEntity {
    return new RoomEntity(
        new BaseId(data.id),
        new BaseStatus(data.status),
        new NameRoom(data.nameRoom),
        new NumberRoom(data.numberRoom)
    );
}


    //PARSEA DATOS A UNA SEAT ENTIDAD
    private toSeat(data: { id: string, status: boolean, numberSeat: number, numberSeatRow: number, room: RoomEntity }): SeatEntity {
    return new SeatEntity(
        new BaseId(data.id),
        new BaseStatus(data.status),
        new NumberSeat(data.numberSeat),
        new NumberSeatRow(data.numberSeatRow),
        data.room
    )
}


    //LOGICA PARA RECREAR EL NUMERO Y FILA DE SILLA A CREAR
    private async generateSeats(data: { numberRows: number, numberSeatsRows: number, room: RoomEntity }, transaction: Transaction): Promise < void> {
    let seatCreatePormises =[];
    for(let row = 1; row <= data.numberRows; row++) {
    for (let seat = 1; seat <= data.numberSeatsRows; seat++) {

        const seatEntity = this.toSeat({
            id: IdGenerator.generate(),
            status: true,
            numberSeat: seat,
            numberSeatRow: row,
            room: data.room
        })
        seatCreatePormises.push(this.seatService.create(seatEntity, transaction))
    }
}

if (seatCreatePormises.length) {
    await Promise.all(seatCreatePormises);
} else {

    throw new CustomException("No se ha podido crear la sala, valores: numeros de filas y numero de sillas por filas debe ser validos.", ErrorCodes.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY);

}

    }

} 