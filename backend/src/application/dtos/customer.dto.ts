import {
    IsString,
    IsNotEmpty,
    Matches,
    IsNumber,
    Min,
    Max,
    IsEmail,
    IsBoolean
} from "class-validator"; // 
import { CustomerEntity } from "../../domain/entities/customer.entity";

//DTO de entrada
export class CreateCustomerDto {
  
    @IsBoolean()
    @IsNotEmpty()
    public status!: boolean;

    @IsString()
    @IsNotEmpty()
    public documentNumber!: string;

    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsString()
    @IsNotEmpty()
    public lastName!: string;

    @IsNumber()
    @Min(10)
    @Max(100)
    public age!: number;

    @IsString()
    @Matches(/^09\d{8}$/)
    public phone!: string;

    @IsEmail()
    public email!: string;
}

export class UpdateCreateDto extends CreateCustomerDto {
    @IsString()
    public id!: string; // ID obligatorio para actualizaciones
}

// DTO de salida
export class CustomerResponseDto {

    id: string;
    documentNumber: string;
    name: string;
    lastName: string;
    age: number;
    phone: string;
    email: string;

    constructor(entity: CustomerEntity) {
        this.id = entity.getId().value;
        this.documentNumber = entity.getDocumentNumberCustomer().value;
        this.name = entity.getNameCustomer().value;
        this.lastName = entity.getLastNameCustomer().value;
        this.age = entity.getAgeCustomer().value;
        this.phone = entity.getPhoneCustomer().value;
        this.email = entity.getEmailCustomer().value;
    }


}