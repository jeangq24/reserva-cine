import { Transaction } from "sequelize";
import { BookingEntity } from "../../domain/entities/booking.entity";
import { BookingRepository } from "../../domain/repositories/booking.repositrory";
import { BookingResponseDto } from "../../application/dtos/booking.dto";
import { BookingModel } from "../models/booking.model";

export class SequelizeBookingRepositorio implements BookingRepository {

    public async save(booking: BookingEntity, transaction: Transaction): Promise<void> {
        const bookingDto = new BookingResponseDto(booking);
        const dateBooking = new Date(bookingDto.dateBooking)
        await BookingModel.upsert({ ...bookingDto, dateBooking }, { transaction });
    }
}