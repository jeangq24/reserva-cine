import { CustomException } from "../exceptions/CustomException";
import { ErrorCodes } from "../exceptions/Error.codes";
import { HttpStatus } from "../exceptions/HttpStatus";

export class DateValueBillboard {
    public value: Date;

    constructor(value: Date) {
        this.value = value;
    }
}

export class HourValue {
    public value: string;

    constructor(value: string) {
        const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!regex.test(value)) {
            throw new CustomException('Formato de hora incorrecto. (Formato HH:mm).', ErrorCodes.INCORRECT_FORMAT, HttpStatus.BAD_REQUEST);
        }

        this.value = value;
    }
}
