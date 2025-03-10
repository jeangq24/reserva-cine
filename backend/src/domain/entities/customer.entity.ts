import { BaseId, BaseStatus } from "../values-objects/base.ov";
import { AgeCustomer, DocumentNumberCustomer, EmailCustomer, NameValueCustomer, PhoneCustomer } from "../values-objects/customer.ov";
import { BaseEntity } from "./base.entity";

export class CustomerEntity extends BaseEntity {
    private documentNumberCustomer: DocumentNumberCustomer;
    private nameCustomer: NameValueCustomer;
    private lastNameCustomer: NameValueCustomer;
    private ageCustomer: AgeCustomer;
    private phoneCustomer: PhoneCustomer;
    private emailCustomer: EmailCustomer;

    constructor (idCustomer: BaseId, statusCustomer: BaseStatus, documentNumberCustomer: DocumentNumberCustomer, nameCustomer: NameValueCustomer, lastNameCustomer: NameValueCustomer, ageCustomer: AgeCustomer, phoneCustomer: PhoneCustomer, emailCustomer: EmailCustomer  ) {
        super(idCustomer, statusCustomer);
        this.documentNumberCustomer = documentNumberCustomer;
        this.nameCustomer = nameCustomer;
        this.lastNameCustomer = lastNameCustomer;
        this.ageCustomer = ageCustomer;
        this.phoneCustomer = phoneCustomer;
        this.emailCustomer = emailCustomer;
    }


    public getDocumentNumberCustomer():DocumentNumberCustomer {
        return this.documentNumberCustomer;
    }

    public getNameCustomer():NameValueCustomer {
        return this.nameCustomer;
    }

    public getLastNameCustomer():NameValueCustomer {
        return this.lastNameCustomer;
    }

    public getAgeCustomer():AgeCustomer {
        return this.ageCustomer;
    }

    public getPhoneCustomer():PhoneCustomer {
        return this.phoneCustomer;
    }


    public getEmailCustomer():EmailCustomer {
        return this.emailCustomer;
    }
}