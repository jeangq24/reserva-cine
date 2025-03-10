import { Transaction } from "sequelize";
import { BookingEntity } from "../../domain/entities/booking.entity";
import { BookingRepository } from "../../domain/repositories/booking.repositrory";
import { BookingResponseDto } from "../../application/dtos/booking.dto";
import { BookingModel } from "../models/booking.model";
import { BookingSeatModel } from "../models/booking-seat.model";

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
}