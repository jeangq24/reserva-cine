import { BillboardEntity } from "../../domain/entities/billboard.entity";
import {
    IsString,
    IsNotEmpty,
    Matches,
    IsNumber,
    Min,
    Max,
    IsEmail,
    IsBoolean,
    IsUUID
} from "class-validator"; // 


export class CreateBillboardDto {
    
    @IsString()
    public dateBillboard!:string
    @IsString()
    @IsUUID(4)
    public roomId!:string 
    @IsString()
    public nameMovie!: string;
    @IsString()
    public genreMovie!: string;
    
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
    public starTimeBillboard!: string;
    @IsString()
    @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
    public endTimeBillboard!:string

    @IsNumber()
    public allowedAgeMovie!: number;
    @IsNumber()
    public lengthMinutesMovie!: number;
}

export class DeleteBillboardDto {
    @IsString()
    @IsUUID(4)
    public id!:string
}

export class CancelBillboardDto {
    @IsString()
    @IsUUID(4)
    public id!:string
}

export class BillboardResponseDto {

    id: string;
    status: boolean;
    dateBillboard: Date;
    starTimeBillboard: string;
    endTimeBillboard: string;
    roomId: string;
    movieId: string
    constructor(entity: BillboardEntity) {
        this.id = entity.getId().value;
        this.status = entity.getStatus().value;
        this.dateBillboard = entity.getDateBillboard().value;
        this.starTimeBillboard = entity.getStarTimeBillboard().value;
        this.endTimeBillboard = entity.getEndTimeBillboard().value;
        this.roomId = entity.getRoom().getId().value;
        this.movieId = entity.getMovie().getId().value
    }

}