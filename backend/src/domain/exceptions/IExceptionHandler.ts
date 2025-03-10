import { CustomException } from "./CustomException";

export interface IExceptionHandler {
    handle(error: unknown): void;
}

export class GlobalExceptionHandler implements IExceptionHandler {
    public handle(error: unknown) {
       
        if (error instanceof CustomException) {
            
            return {
                message: error.message,
                code: error.code,
                status: error.status,
                name: error.name,
                errors: error.errors
            };
        } else if (error instanceof Error) {
            return {
                message: error.message,
                code: "INTERNAL_SERVER_ERROR",
                status: 500,
                name: error.name || "UnknownError"
            };
        } else {
            return {
                message: "Error desconocido",
                code: "UNKNOWN_ERROR",
                status: 500,
                name: "UnknownError"
            };
        }
    }
}