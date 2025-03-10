import { NextFunction, Request, Response } from "express";
import { BillboardService } from "../../application/services/billboard.service";
import { BookingService } from "../../application/services/booking.service";
import { CustomerService } from "../../application/services/customer.service";
import { SeatService } from "../../application/services/seat.service";
import { database } from "../database/connection";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { BaseId } from "../../domain/values-objects/base.ov";
import { IdGenerator } from "../../application/services/id-generate.service";
import { ParseEntities } from "../../application/services/parse-entity.service";
import { Transaction } from "sequelize";
import { SeatResponseDto } from "../../application/dtos/seat.dtos";
import { RoomService } from "../../application/services/room.service";
import { SeatEntity } from "../../domain/entities/seat.entity";

export class BookingController {
    constructor(private readonly bookinService: BookingService, private readonly seatService: SeatService, private readonly billboardService: BillboardService, private readonly customerService: CustomerService, private readonly roomService: RoomService) { }

    public async create(req: Request, res: Response, next: NextFunction) {
        const transaction = await database.getSequelizeInstance().transaction();
        try {
            const requestBody = req.body;
            const billboardEntity = await this.billboardService.getById(new BaseId(requestBody.billboardId));
            if (!billboardEntity) {
                throw new CustomException("La Cartelera no existe en la base de datos", ErrorCodes.RECORD_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customerData = {
                id: IdGenerator.generate(),
                status: true,
                name: requestBody.name,
                lastName: requestBody.lastName,
                documentNumber: requestBody.documentNumber,
                phone: requestBody.phone,
                age: requestBody.age,
                email: requestBody.email
            }

            const customerEntity = ParseEntities.toCustomerEntity(customerData);
            await this.customerService.save(customerEntity, transaction);
            const seatEntities = await this.updateBookingSeats(requestBody.seats, transaction);
            console.log("seatEntitiesssss",seatEntities)
            const bookingData = {
                id: IdGenerator.generate(),
                status: true,
                dateBooking: requestBody.dateBooking
            }
            const bookingEntity = ParseEntities.toBookingEntity(bookingData, customerEntity, billboardEntity, seatEntities);
            await this.bookinService.save(bookingEntity, transaction);
            await transaction.commit();
            res.status(HttpStatus.CREATED).json({ message: "Reserva creada correctamente.", data: bookingEntity })
        } catch (error) {
            await transaction.rollback();
            next(error)
        }
    }


    private async updateBookingSeats(seatsId: string[], transaction: Transaction): Promise<SeatEntity[]> {
        const Seats = [];
        for (let index = 0; index < seatsId.length; index++) {
            const seatId = seatsId[index];
            const seatEntity = await this.seatService.getById(new BaseId(seatId))
            const seatDto = new SeatResponseDto(seatEntity)
            const roomEntity = await this.roomService.getById(new BaseId(seatDto.roomId));
            
            if (!roomEntity) {
                throw new CustomException("No se encontro la sala en la base de datos", ErrorCodes.RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)
            }
            const newSeatData = {
                ...seatDto,
                status: false

            }
            await this.seatService.update(
                ParseEntities.toSeatEntity(newSeatData, roomEntity),
                transaction
            );
            
            const SeatUpdate = await this.seatService.getById(new BaseId(seatId))
            Seats.push(SeatUpdate)

        }


       
        if (!Seats.length) {
            throw new CustomException("No se encontraron sillas para la reserva.", ErrorCodes.CONFLICT, HttpStatus.CONFLICT)
        }

       return Seats 

    }
}