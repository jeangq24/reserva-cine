import { CustomException } from "../exceptions/CustomException";
import { ErrorCodes } from "../exceptions/Error.codes";
import { HttpStatus } from "../exceptions/HttpStatus";
export class DocumentNumberCustomer {

    public value: string;

    //Expresion regular: Valida un ducumento ecuatoriano El primer dígito debe ser entre 1 y 9. Los siguientes 9 dígitos deben ser números.
    private static readonly REGEX_EC_DOCUMENT: RegExp = /^[1-9]{1}[0-9]{9}$/;

    constructor(value: string) {

        if (this.isValidDocument(value)) {
            this.value = value
        } else {
            throw new CustomException("No es un formato correcto para un numero de identididad Ecuatoriano.", ErrorCodes.INCORRECT_FORMAT, HttpStatus.BAD_REQUEST);
        }
    }

    private isValidDocument(value: string): boolean {

        if (!DocumentNumberCustomer.REGEX_EC_DOCUMENT.test(value)) {
            return false;
        }

        return true;
    }
}


export class NameValueCustomer {

    public value: string;
    //Expresion regular: valida una cadena de texto con letras unicamente, pueden contener hacentos y "Ñ".
    private static readonly REGEX_LETTERS_ONLY: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s]+$/;

    constructor(value: string) {

        if (this.isValidName(value)) {
            this.value = value
        } else {
            throw new CustomException("No es formato correcto para un nombre o apellido.", ErrorCodes.INCORRECT_FORMAT, HttpStatus.BAD_REQUEST);    
        }
    }

    private isValidName(value: string): boolean {

        if (!NameValueCustomer.REGEX_LETTERS_ONLY.test(value)) {
            return false;
        }
        return true;
    }
}


export class AgeCustomer {

    public value: number;
    private static readonly MAX_AGE = 100;
    private static readonly MIN_AGE = 10;

    constructor(value: number) {
        if (this.isValidAge(value)) {
            this.value = value
        } else {
            throw new CustomException("Esta edad no corresponde al rango establecido: 10 a 100", ErrorCodes.OUT_RANGE, HttpStatus.UNPROCESSABLE_ENTITY);
        }

    }

    private isValidAge(value: number): boolean {
        if (value < AgeCustomer.MIN_AGE || value > AgeCustomer.MAX_AGE) {
            return false
        }

        return true
    }


}


export class PhoneCustomer {

    public value: string;
    //Expresion regular: valida un numero de celular ecuatoriano: 10 digitos numericos y inicio con "09...".
    private static readonly REGEX_EC_PHONE_NUMBER: RegExp = /^09\d{8}$/;

    constructor(value: string) {

        if (this.isValidPhone(value)) {
            this.value = value;

        } else {

            throw new CustomException("No es formato correcto para un numero de telefono ecuatoriano.", ErrorCodes.INCORRECT_FORMAT, HttpStatus.BAD_REQUEST);  
        }
    }

    private isValidPhone(value: string): boolean {

        if (!PhoneCustomer.REGEX_EC_PHONE_NUMBER.test(value)) {
            return false;
        }

        return true;
    }
}


export class EmailCustomer {
    public value: string;
    //Expresion regular: valida un correo electronico.
    private static readonly REGEX_EMAil: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    constructor(value: string) {
        if (this.isValidEmail(value)) {
            this.value = value;
        } else {
            throw new CustomException("No es formato correcto para un correo electronico.", ErrorCodes.INCORRECT_FORMAT, HttpStatus.BAD_REQUEST);  
        }
    }

    private isValidEmail(value: string): boolean {
        if (!EmailCustomer.REGEX_EMAil.test(value)) {
            return false;
        }

        return true;
    }
}




