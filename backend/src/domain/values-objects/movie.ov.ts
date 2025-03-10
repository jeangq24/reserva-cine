import { CustomException } from "../exceptions/CustomException";
import { ErrorCodes } from "../exceptions/Error.codes";
import { HttpStatus } from "../exceptions/HttpStatus";

export class nameMovie {
    public value: string

    constructor(value: string) {
        this.value = value
    }
}



export class allowedAgeMovie {

    public value: number;
    private static readonly MAX_AGE = 100;
    private static readonly MIN_AGE = 0;

    constructor(value: number) {
        if (this.isValidAge(value)) {
            this.value = value
        } else {
            throw new CustomException("Esta edad no corresponde al rango establecido: 10 a 100", ErrorCodes.OUT_RANGE, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    private isValidAge(value: number): boolean {
        if (value < allowedAgeMovie.MIN_AGE || value > allowedAgeMovie.MAX_AGE) {
            return false
        }

        return true
    }

}

export class lengthMinutesMovie {

    public value: number;
    private static readonly MIN_MINUTES = 0;

    constructor(value: number) {
        if (this.isValidMinutes(value)) {
            this.value = value
        } else {
            throw new CustomException("Los minutos de duracion no pueden ser 0 o menor a 0", ErrorCodes.OUT_RANGE, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    private isValidMinutes(value: number): boolean {
        if (value <= lengthMinutesMovie.MIN_MINUTES) {
            return false
        }

        return true
    }
}