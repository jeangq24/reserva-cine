import { BaseId, BaseStatus } from "../values-objects/base.ov";
import { DateValueBooking } from "../values-objects/booking.ov";
import { BaseEntity } from "./base.entity";
import { BillboardEntity } from "./billboard.entity";
import { CustomerEntity } from "./customer.entity";
import { SeatEntity } from "./seat.entity";

export class BookingEntity extends BaseEntity {

    private dateBooking: DateValueBooking;
    private customer: CustomerEntity;
    private seats: SeatEntity[];
    private billboard: BillboardEntity;

    constructor (idBooking:BaseId, statusBooking: BaseStatus, dateBooking: DateValueBooking, customer: CustomerEntity, seats: SeatEntity[], billboard: BillboardEntity) {
        super(idBooking, statusBooking);
        this.dateBooking = dateBooking;
        this.customer = customer;
        this.seats = seats;
        this.billboard = billboard;
    }

    public getDateBooking():DateValueBooking {
        return this.dateBooking;
    }

    public getCustomer(): CustomerEntity {
        return this.customer
    }

    public getSeats(): SeatEntity[] {
        return this.seats
    }

    public getBillboard(): BillboardEntity {
        return this.billboard
    }
}