import { Transaction } from "sequelize";
import { CustomerEntity } from "../entities/customer.entity";
import { BaseId } from "../values-objects/base.ov";

export interface CustomerRepository {
    getAll(): Promise<CustomerEntity[]>; 
    save(customer: CustomerEntity, transaction: Transaction):  Promise<void>;
    getById(id: BaseId): Promise<CustomerEntity | null>
    delete(id: BaseId, transaction: Transaction): Promise<void>
}