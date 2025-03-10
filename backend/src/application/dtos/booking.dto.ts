import { BookingEntity } from "../../domain/entities/booking.entity";
import {
    IsString,
    Matches,
    IsNumber,
    IsEmail,
    IsNumberString,
    IsPhoneNumber,
    IsArray,
    
    
} from "class-validator"; // 
import { SeatEntity } from "../../domain/entities/seat.entity";

export class CreateBookingDto {
    @IsString()
    public dateBooking!:string;    

    @IsArray()
    public seats!: Array<string>;

    @IsString()
    public billboardId!:string;

    @IsString()
    public name!: string;

    @IsString()
    public lastName!: string;

    
    @IsNumberString()
    @Matches(/^[1-9]{1}[0-9]{9}$/)
    public documentNumber!: string 

    @IsString()
    @IsEmail()
    public email!: string;

    
    @IsNumber()
    public age!: number

    @IsNumberString()
    public phone!:string
}


export class BookingResponseDto {

    id: string;
    status: boolean;
    dateBooking: Date;
    customerId: string;
    seats: string[];
    billboardId: string;
   
    constructor(entity: BookingEntity) {
        this.id = entity.getId().value;
        this.status = entity.getStatus().value;
        this.dateBooking = entity.getDateBooking().value;
        this.customerId = entity.getCustomer().getId().value;
        this.seats = entity.getSeats().map(seat=>seat.getId().value);
        this.billboardId = entity.getBillboard().getId().value;
        
    }

}