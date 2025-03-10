import { Transaction } from "sequelize";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { BaseId } from "../../domain/values-objects/base.ov";


export class CustomerService {
    constructor(private readonly repository: CustomerRepository) { }

    public getAll(): Promise<CustomerEntity[]> {
        return this.repository.getAll();
    }

    public save(customer: CustomerEntity, transaction: Transaction): Promise<void> {
        return this.repository.save(customer, transaction);
    }

    public getById(id: BaseId): Promise<CustomerEntity | null> {

        return this.repository.getById(id)
    }

    public delete(id: BaseId, transaction: Transaction): Promise<void> {
        return this.repository.delete(id, transaction)
    }
}