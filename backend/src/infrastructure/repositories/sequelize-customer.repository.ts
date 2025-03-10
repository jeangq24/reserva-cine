import { Op, Transaction } from "sequelize";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { BaseId } from "../../domain/values-objects/base.ov";
import { CustomerModel } from "../models/customer.model";
import { CustomException } from "../../domain/exceptions/CustomException";
import { CustomerResponseDto } from "../../application/dtos/customer.dto";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { ParseEntities } from "../../application/services/parse-entity.service";

export class SequelizeCustomerRepository implements CustomerRepository {

    async getAll(): Promise<CustomerEntity[]> {
        const customers = await CustomerModel.findAll();
        return customers.map(ParseEntities.toCustomerEntity);
    }

    async save(customer: CustomerEntity, transaction: Transaction): Promise<void> {
        const customerDto = new CustomerResponseDto(customer);
        await this.validateUniqueCustomerData(customerDto);
        await CustomerModel.upsert({ ...customerDto }, { transaction })
    }

    async getById(id: BaseId): Promise<CustomerEntity | null> {
        const customer = await CustomerModel.findByPk(id.value);
        if (!customer) {
            new CustomException("No se encuentra consumidor en la base de datos", ErrorCodes.RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const customerEntity = ParseEntities.toCustomerEntity(customer)
        return customerEntity
    }


    async delete(id: BaseId, transaction: Transaction): Promise<void> {
        this.validIdCorrect(id.value);
        const response = await CustomerModel.destroy({ where: { id: id.value }, transaction })
        if (!response) {
            throw new CustomException(`El consumidor no existe en la base de datos.`, ErrorCodes.RECORD_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
    }

    private validIdCorrect(id: string) {
        if (typeof id !== "string" || id.length <= 0) {
            throw new CustomException(`Envie un "ID" de registro correcto`, ErrorCodes.INVALID_INPUT, HttpStatus.BAD_REQUEST)
        }
    }

    private async validateUniqueCustomerData(customerDto: CustomerResponseDto): Promise<void> {

        const whereCondition: any = {
            [Op.or]: [
                { documentNumber: customerDto.documentNumber },
                { phone: customerDto.phone },
                { email: customerDto.email }
            ]
        };
        if (customerDto.id) {
            whereCondition.id = { [Op.ne]: customerDto.id };
        }

        const customerExists = await CustomerModel.findOne({
            where: whereCondition
        });

        if (customerExists) {
            if (customerExists.documentNumber === customerDto.documentNumber) {
                throw new CustomException("El número de documento ya está registrado.", ErrorCodes.RECORD_DUPLICATE_DATA, HttpStatus.CONFLICT);
            }
            if (customerExists.phone === customerDto.phone) {
                throw new CustomException("El número de celular ya está registrado.", ErrorCodes.RECORD_DUPLICATE_DATA, HttpStatus.CONFLICT);
            }
            if (customerExists.email === customerDto.email) {
                throw new CustomException("La dirección de correo ya está registrada.", ErrorCodes.RECORD_DUPLICATE_DATA, HttpStatus.CONFLICT);
            }
        }
    }
}