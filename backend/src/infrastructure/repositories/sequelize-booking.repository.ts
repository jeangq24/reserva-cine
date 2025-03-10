import { Transaction, where } from "sequelize";
import { BookingEntity } from "../../domain/entities/booking.entity";
import { BookingRepository } from "../../domain/repositories/booking.repositrory";
import { BookingResponseDto } from "../../application/dtos/booking.dto";
import { BookingModel } from "../models/booking.model";
import { BookingSeatModel } from "../models/booking-seat.model";
import { BaseId } from "../../domain/values-objects/base.ov";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ParseEntities } from "../../application/services/parse-entity.service";
import { CustomerModel } from "../models/customer.model";
import { BillboardModel } from "../models/billboard.model";
import { RoomModel } from "../models/room.model";
import { MovieModel } from "../models/movie.model";
import { SeatModel } from "../models/seat.model";

export class SequelizeBookingRepositorio implements BookingRepository {

    public async save(booking: BookingEntity, transaction: Transaction): Promise<void> {
        const bookingDto = new BookingResponseDto(booking);
        const dateBooking = new Date(bookingDto.dateBooking)
        await BookingModel.upsert({ ...bookingDto, dateBooking }, { transaction });
        const seats = booking.getSeats();
        await BookingSeatModel.destroy({
            where: { bookingId: booking.getId().value },
            transaction,
        });

        for (const seat of seats) {
            await BookingSeatModel.create(
                {
                    bookingId: booking.getId().value,
                    seatId: seat.getId().value
                },
                { transaction }
            );
        }
    }

    public async getByIdBillboard(id: BaseId): Promise<BookingEntity[]> {
        this.validIdCorrect(id.value);
        const billboardModel = await BillboardModel.findByPk(id.value);
        
        if (!billboardModel) {
            throw new CustomException(`La cartelera no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        
        const roomModel = await RoomModel.findByPk(billboardModel.roomId);
    
        if (!roomModel) {
            throw new CustomException(`La sala no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const movieModel = await MovieModel.findByPk(billboardModel.movieId);
        if (!movieModel) {
            throw new CustomException(`La pelicula no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        const bookingsModels = await BookingModel.findAll({
            where: {
                billboardId: id.value
            }
        })


        
        const bookingEntities = await Promise.all(

            bookingsModels.map(

                async (bookingModel) => {

                    const customerModel = await CustomerModel.findByPk(bookingModel.customerId);
                    if (!customerModel) {
                        throw new CustomException(`El consumidor no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
                    }
                    const customerEntity = ParseEntities.toCustomerEntity(customerModel);
                    const roomEntity = ParseEntities.toRoomEntity(roomModel);
                    const movieEntity = ParseEntities.toMovieEntity(movieModel);
                    const billboardEntity = ParseEntities.toBillboardEntity(billboardModel, roomEntity, movieEntity);
                    const bookingSeatsModels = await BookingSeatModel.findAll({
                        where: {
                            bookingId: bookingModel.id
                        }
                    })
                    
                    const seatsEntites = await Promise.all(

                        bookingSeatsModels.map(

                            async (bookingSeatModel) => {
                                const seatModel = await SeatModel.findByPk(bookingSeatModel.seatId);
                                if (!seatModel) {
                                    throw new CustomException(`la silla no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
                                }
                                console.log("seatModelsdsds", seatModel.id)
                                const roomModel = await RoomModel.findByPk(seatModel.roomId);
                                const roomEntity = ParseEntities.toRoomEntity(roomModel);
                                return ParseEntities.toSeatEntity(seatModel, roomEntity)
                            }));

                    return ParseEntities.toBookingEntity(bookingModel, customerEntity, billboardEntity, seatsEntites)
                })


        )
        return bookingEntities
    }

    private validIdCorrect(id: string) {
        if (typeof id !== "string" || id.length <= 0) {
            throw new CustomException(`Envie un "ID" de registro correcto`, ErrorCodes.INVALID_INPUT, HttpStatus.BAD_REQUEST)
        }
    }
}