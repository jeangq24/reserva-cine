// infrastructure/database/model-relations.ts
import { CustomerModel } from '../models/customer.model';
import { BookingModel } from '../models/booking.model';
import { BillboardModel } from '../models/billboard.model';
import { SeatModel } from '../models/seat.model';
import { MovieModel } from '../models/movie.model';
import { RoomModel } from '../models/room.model';
import { BookingSeatModel } from '../models/booking-seat.model';

export function defineModelRelations() {
    // Relaciones de Customer
    CustomerModel.hasMany(BookingModel, {
        foreignKey: 'customerId',
        as: 'bookings',
    });

    // Relaciones de Booking
    BookingModel.belongsTo(CustomerModel, { foreignKey: 'customerId' });
    BookingModel.belongsTo(BillboardModel, { foreignKey: 'billboardId' });
    BookingModel.belongsToMany(SeatModel, {
        through: BookingSeatModel,
        foreignKey: "bookingId",
        as: "seats",
    });

    
    // Relaciones de Billboard
    BillboardModel.belongsTo(MovieModel, { foreignKey: 'movieId' });
    BillboardModel.belongsTo(RoomModel, { foreignKey: 'roomId' });

    // Relaciones de Seat
    SeatModel.belongsTo(RoomModel, { foreignKey: 'roomId' });
    SeatModel.belongsToMany(BookingModel, {
        through: BookingSeatModel,
        foreignKey: "seatId",
        as: "bookings",
    });

    // Relaciones de Room
    RoomModel.hasMany(SeatModel, { foreignKey: 'roomId' });
    RoomModel.hasMany(BillboardModel, { foreignKey: 'roomId' });

    // Relaciones de Movie
    MovieModel.hasMany(BillboardModel, { foreignKey: 'movieId' });
}