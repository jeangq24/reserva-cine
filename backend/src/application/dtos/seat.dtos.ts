import { SeatEntity } from "../../domain/entities/seat.entity";
import { RoomEntity } from "../../domain/entities/room.entity";


// DTO de salida
export class SeatResponseDto {

    id: string;
    status: boolean;
    numberSeat: number;
    numberSeatRow: number;
    roomId: string;
    constructor(entity: SeatEntity) {
        this.id = entity.getId().value;
        this.status = entity.getStatus().value;
        this.numberSeat = entity.getNumberSeat().value
        this.numberSeatRow = entity.getNumberSeatRow().value;
        this.roomId = entity.getRoom().getId().value
    }

}