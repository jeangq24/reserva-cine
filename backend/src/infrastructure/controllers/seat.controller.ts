import { SeatService } from "../../application/services/seat.service";
import {Response, Request, NextFunction} from "express"
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { BaseId, BaseStatus } from "../../domain/values-objects/base.ov";
import { database } from "../database/connection";
import { SeatEntity } from "../../domain/entities/seat.entity";
import { IdGenerator } from "../../application/services/id-generate.service";
import { NumberSeat, NumberSeatRow } from "../../domain/values-objects/seat-ob";
import { RoomService } from "../../application/services/room.service";
export class SeatController  {
    constructor (private readonly seatService:SeatService, private readonly roomService: RoomService) {}

    // OBTENER TODAS LAS SILLAS
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const seats = await this.seatService.getAll();
            res.status(HttpStatus.OK).json({ message: "Sillas obtenidas correctamente.", data: seats });
        } catch (error) {
            next(error);
        }
    }

    // OBTENER UNA SILLA POR ID
    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const seat = await this.seatService.getById(new BaseId(req.params.id));
            res.status(HttpStatus.OK).json({ message: "Silla obtenida correctamente.", data: seat });
        } catch (error) {
            next(error);
        }
    }

    // OBTENER TODAS LAS SILLAS POR ROOM ID
    public async getByRoomId(req: Request, res: Response, next: NextFunction) {
        try {
            const roomId = new BaseId(req.params.id);
            const seats = await this.seatService.getByIdRoom(roomId);
            res.status(HttpStatus.OK).json({ message: "Sillas obtenidas correctamente.", data: seats });
        } catch (error) {
            next(error);
        }
    }

}