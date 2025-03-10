import {
    IsString,
    IsNumber,
    IsBoolean,
    IsUUID,
    IsNotEmpty,
    IsPositive
} from "class-validator"; // 
import { RoomEntity } from "../../domain/entities/room.entity";


// application/dtos/room.dtos.ts
export class CreateRoomDto {
   
    @IsString()
    public nameRoom!: string;

    @IsNumber()
    public numberRoom!: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    public numberRows!: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    public numberSeatRows!:number;

}

export class UpdateRoomDto {
    @IsString()
    @IsUUID()
    public id!: string; 

    @IsBoolean()
    public status!: boolean;

    @IsString()
    public nameRoom!: string;

    @IsNumber()
    public numberRoom!: number;
};

export class DeleteRoomDto {
    @IsString()
    public id!: string; 
}

// DTO de salida
export class RoomResponseDto {

    id: string;
    status: boolean;
    nameRoom: string;
    numberRoom: number;

    constructor(entity: RoomEntity) {
        this.id = entity.getId().value;
        this.status = entity.getStatus().value;
        this.nameRoom = entity.getNameRoom().value;
        this.numberRoom = entity.getNumberRoom().value
    }

}