import { BillboardEntity } from "../../domain/entities/billboard.entity";
import { BookingEntity } from "../../domain/entities/booking.entity";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { MovieEntity, MovieGenreEnum } from "../../domain/entities/movie.entity";
import { RoomEntity } from "../../domain/entities/room.entity";
import { SeatEntity } from "../../domain/entities/seat.entity";
import { BaseId, BaseStatus } from "../../domain/values-objects/base.ov";
import { DateValueBillboard, HourValue } from "../../domain/values-objects/billboard.ov";
import { DateValueBooking } from "../../domain/values-objects/booking.ov";
import { AgeCustomer, DocumentNumberCustomer, EmailCustomer, NameValueCustomer, PhoneCustomer } from "../../domain/values-objects/customer.ov";
import { allowedAgeMovie, lengthMinutesMovie, nameMovie } from "../../domain/values-objects/movie.ov";
import { NameRoom, NumberRoom } from "../../domain/values-objects/room.ov";
import { NumberSeat, NumberSeatRow } from "../../domain/values-objects/seat-ob";

export class ParseEntities {

    public static toRoomEntity(model: any): RoomEntity {

        const roomEntity = new RoomEntity(
            new BaseId(model.id),
            new BaseStatus(model.status),
            new NameRoom(model.nameRoom),
            new NumberRoom(model.numberRoom),
        )

        return roomEntity;
    }

    public static toMovieEntity(model: any): MovieEntity {

        const movieEntity = new MovieEntity(
            new BaseId(model.id),
            new BaseStatus(model.status),
            new nameMovie(model.nameMovie),
            this.parseGenre(model.genreMovie) ?? MovieGenreEnum.OTHER,
            new allowedAgeMovie(model.allowedAgeMovie),
            new lengthMinutesMovie(model.lengthMinutesMovie)
        )

        return movieEntity;
    }


    public static toSeatEntity(seat: any, room: RoomEntity): SeatEntity {
        return new SeatEntity(
            new BaseId(seat.id),
            new BaseStatus(seat.status),
            new NumberSeat(seat.numberSeat),
            new NumberSeatRow(seat.numberSeatRow),
            room
        )
    }

    public static toBillboardEntity(model: any, room: RoomEntity, movie: MovieEntity): BillboardEntity {

        const billboardEntity = new BillboardEntity(
            new BaseId(model.id),
            new BaseStatus(model.status),
            new DateValueBillboard(model.dateBillboard),
            new HourValue(model.starTimeBillboard),
            new HourValue(model.endTimeBillboard),
            movie,
            room
        )

        return billboardEntity;
    }

    public static toBookingEntity(model:any, customer: CustomerEntity, billboard: BillboardEntity, seats: SeatEntity[]) {
        const bookingEntity = new BookingEntity(
            new BaseId(model.id),
            new BaseStatus(model.status),
            new DateValueBooking(model.dateBooking),
            customer,
            seats,
            billboard
        )

        return bookingEntity
    }


    public static toCustomerEntity(model:any) {
        const customerEntity = new CustomerEntity(
            new BaseId(model.id),
            new BaseStatus(model.status),
            new DocumentNumberCustomer(model.documentNumber),
            new NameValueCustomer(model.name),
            new NameValueCustomer(model.lastName),
            new AgeCustomer(model.age),
            new PhoneCustomer(model.phone),
            new EmailCustomer(model.email)
        )
        return customerEntity
    }

    public static parseGenre(genre: string): MovieGenreEnum | undefined {

        const genreEnum: MovieGenreEnum = MovieGenreEnum[genre as keyof typeof MovieGenreEnum];
        return genreEnum
    }

}