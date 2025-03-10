import { BaseId, BaseStatus } from "../values-objects/base.ov";
import { NameRoom, NumberRoom } from "../values-objects/room.ov";
import { BaseEntity } from "./base.entity";

export class RoomEntity extends BaseEntity {

    private nameRoom: NameRoom;
    private numberRoom: NumberRoom;

    constructor(idRoom: BaseId, statusRoom: BaseStatus, nameRoom: NameRoom, numberRoom: NumberRoom) {
        super(idRoom, statusRoom);
        this.nameRoom = nameRoom;
        this.numberRoom = numberRoom
    }

    public getNameRoom(): NameRoom {
        return this.nameRoom;
    }

    public getNumberRoom(): NumberRoom {
        return this.numberRoom;
    }
}