import { BaseId, BaseStatus } from "../values-objects/base.ov";
import {DateValueBillboard, HourValue} from "../values-objects/billboard.ov"
import { BaseEntity } from "./base.entity";
import { MovieEntity } from "./movie.entity";
import { RoomEntity } from "./room.entity";

export class BillboardEntity extends BaseEntity {
    private dateBillboard: DateValueBillboard;
    private starTimeBillboard: HourValue;
    private endTimeBillboard: HourValue;
    private movie: MovieEntity;
    private room: RoomEntity;

    constructor(idBillboard: BaseId, statusBillboard: BaseStatus, dateBillboard: DateValueBillboard, starTimeBillboard: HourValue, endTimeBillboard: HourValue, movie: MovieEntity, room: RoomEntity) {
        super(idBillboard, statusBillboard);
        this.dateBillboard = dateBillboard;
        this.starTimeBillboard = starTimeBillboard;
        this.endTimeBillboard = endTimeBillboard;
        this.movie = movie;
        this.room = room;
    }
    
    public getDateBillboard():DateValueBillboard {
        return this.dateBillboard;
    }

    public getStarTimeBillboard():HourValue {
        return this.starTimeBillboard;
    }

    public getEndTimeBillboard():HourValue {
        return this.endTimeBillboard;
    }

    public getMovie():MovieEntity {
        return this.movie;
    }

    public getRoom():RoomEntity {
        return this.room;
    }

}

