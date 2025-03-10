import { BaseId, BaseStatus } from "../values-objects/base.ov";
import { NumberSeatRow, NumberSeat } from "../values-objects/seat-ob";
import { BaseEntity } from "./base.entity";
import { RoomEntity } from "./room.entity";

export class SeatEntity extends BaseEntity {
    private numberSeat: NumberSeat;
    private numberSeatRow: NumberSeatRow;
    private room: RoomEntity;

    constructor (idSeat: BaseId, statusSeat: BaseStatus, numberSeat: NumberSeat, numberSeatRow: NumberSeatRow, room: RoomEntity) {
        super(idSeat, statusSeat);

        this.numberSeatRow = numberSeatRow;
        this.numberSeat = numberSeat;
        this.room = room;
    }

    public getNumberSeat():NumberSeat {
        return this.numberSeat;
    }

    public getNumberSeatRow():NumberSeatRow {
        return this.numberSeatRow;
    }

    public getRoom():RoomEntity {
        return this.room
    }
}