import { BillboardService } from "../../application/services/billboard.service";
import { Request, Response, NextFunction } from "express";
import { database } from "../database/connection";
import { IdGenerator } from "../../application/services/id-generate.service";
import { ParseEntities } from "../../application/services/parse-entity.service";
import { BillboardResponseDto } from "../../application/dtos/billboard.dto";
import { RoomService } from "../../application/services/room.service";
import { MovieService } from "../../application/services/movie.service";
import { BaseId } from "../../domain/values-objects/base.ov";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { SeatService } from "../../application/services/seat.service";
import { Transaction } from "sequelize";
import { SeatResponseDto } from "../../application/dtos/seat.dtos";
import { RoomEntity } from "../../domain/entities/room.entity";
import { BookingService } from "../../application/services/booking.service";
import { BookingResponseDto } from "../../application/dtos/booking.dto";
import { CustomerResponseDto } from "../../application/dtos/customer.dto";


export class BillboardController {
    constructor(private readonly billboardService: BillboardService, private readonly roomService: RoomService, private readonly movieService: MovieService, private readonly seatService: SeatService, private readonly bookingService: BookingService) { };

    //CREA UNA CARTELERA, PELICULA Y SE SINCRONIZA CON LA SALA EXISTENTE
    public async create(req: Request, res: Response, next: NextFunction) {
        const transaction = await database.getSequelizeInstance().transaction()
        try {
            const requestBody = req.body;
            const roomEntity = await this.roomService.getById(new BaseId(requestBody.roomId));
            if (!roomEntity) {
                throw new CustomException("Sala no encontrada en la base de datos", ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const movieData = {
                id: IdGenerator.generate(),
                status: true,
                nameMovie: requestBody.nameMovie,
                genreMovie: requestBody.genreMovie,
                allowedAgeMovie: requestBody.allowedAgeMovie,
                lengthMinutesMovie: requestBody.lengthMinutesMovie
            }

            await this.movieService.save(ParseEntities.toMovieEntity(movieData), transaction);
            const movieEntity = await this.movieService.getById(new BaseId(movieData.id));
            if (!movieEntity) {
                throw new CustomException("Pelicula no encontrada en la base de datos", ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            const billboardId = IdGenerator.generate();
            const billboardData = {
                id: billboardId,
                status: true,
                dateBillboard: requestBody.dateBillboard,
                starTimeBillboard: requestBody.starTimeBillboard,
                endTimeBillboard: requestBody.endTimeBillboard,
                roomId: requestBody.roomId,
                movieId: requestBody.movieId
            }

            const billboardEntity = ParseEntities.toBillboardEntity(billboardData, roomEntity, movieEntity)
            await this.billboardService.save(billboardEntity, transaction);
            await transaction.commit();
            res.status(HttpStatus.CREATED).json({ message: "Cartelera creada correctamente.", data: billboardEntity })
        } catch (error) {
            await transaction.rollback()
            next(error)
        }
    }

    //OBTENEMOS TODAS LAS PELICULAS CON SU RELACIONES DE PELICULA Y SALA
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const billboards = await this.billboardService.getAll();
            res.status(HttpStatus.OK).json({ message: "Carteleras obtenidas correctamente.", data: billboards })
        } catch (error) {
            next(error)
        }
    }


    //ELIMINAR CARTELERAS INCLUYENDO (TAMBIEN ELIMINA LAS PELICULAS)
    public async delete(req: Request, res: Response, next: NextFunction) {
        const transaction = await database.getSequelizeInstance().transaction();
        try {

            const requestBody = req.body
            const billboardBaseId = new BaseId(requestBody.id);
            const billboardEntity = await this.billboardService.getById(billboardBaseId);
            await this.billboardService.delete(billboardBaseId, transaction);
            await this.movieService.delete(billboardEntity.getMovie().getId(), transaction)
            await transaction.commit();
            res.status(HttpStatus.OK).json({ message: "Cartelera eleminada correctamente", data: null })
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }


    //CANCELAR LA CARTELERA
    public async cancelBillboard(req: Request, res: Response, next: NextFunction) {
        const transaction = await database.getSequelizeInstance().transaction();
        try {
            const requestBody = req.body
            const billboardBaseId = new BaseId(requestBody.id);
            const billboardEntity = await this.billboardService.getById(billboardBaseId);
            if(!billboardEntity.getStatus().value) {
                throw new CustomException("La cartelera ya se encuentra inhabilitada", ErrorCodes.CONFLICT, HttpStatus.CONFLICT)
            }
            await this.billboardService.cancel(billboardEntity, transaction);
            const roomEntity = billboardEntity.getRoom();
            await this.updateSeatCancelBillboard(roomEntity, transaction);
            await this.updateBookingCancelBillboard(billboardEntity.getId(), transaction)
            await transaction.commit();
            res.status(HttpStatus.OK).json({message: "Cartelera cancelada correctamente", data: null})
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    //TODAS SILLA SON HABILITADAS AL CANCELAR UNA CARTELERA
    private async updateSeatCancelBillboard(room: RoomEntity, transaction: Transaction) {
        const seatsByRoomId = await this.seatService.getByIdRoom(room.getId());
        const promisesUpdateSeat = []
        for (let index = 0; index < seatsByRoomId.length; index++) {
            const seatEntity = seatsByRoomId[index];
            const seatDto = new SeatResponseDto(seatEntity);
            const newSeatData = {
                
                ...seatDto,
                status: true
            };
            promisesUpdateSeat.push(
                this.seatService.update(ParseEntities.toSeatEntity(newSeatData, room), transaction)
            );
        }

        if (promisesUpdateSeat.length > 0) {
            await Promise.all(promisesUpdateSeat);
        }
    }

    private async updateBookingCancelBillboard (billboardId: BaseId, transaction: Transaction) {
      
        const promisesUpdateBooking = [];
        const affectedCustomer = []
        const bookinsBillboardEntities = await this.bookingService.getByIdBillboard(billboardId);
        for (let index = 0; index < bookinsBillboardEntities.length; index++) {
            const bookingEntity = bookinsBillboardEntities[index];
            const bookingDto = new BookingResponseDto(bookingEntity)
            const bookingData = {
                ...bookingDto,
                status: false
            }
            promisesUpdateBooking.push(
                this.bookingService.save(
                    ParseEntities.toBookingEntity(
                        bookingData, 
                        bookingEntity.getCustomer(),
                        bookingEntity.getBillboard(),
                        bookingEntity.getSeats()
                    ),
                    transaction
                )
            )
            affectedCustomer.push(new CustomerResponseDto(bookingEntity.getCustomer()))
        }

        if (promisesUpdateBooking.length > 0) {
            await Promise.all(promisesUpdateBooking);
            
        }

        //IMPRIME EN CONSOLA LOS CONSUMIDORES AFECTADOS
        console.log("CONSUMIDORES AFECTADO: ", affectedCustomer);
    }
}