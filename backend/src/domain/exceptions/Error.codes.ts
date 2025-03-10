export enum ErrorCodes {
    // Errores de Validación
    VALIDATION_ERROR_DTO = "VALIDATION_ERROR_DTO",
    INVALID_INPUT = "INVALID_INPUT",
    MISSING_FIELDS = "MISSING_FIELDS",
    INCORRECT_FORMAT = "INCORRECT_FORMAT",
    OUT_RANGE = "OUT_RANGE",
    // Errores de Autenticación
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",

    // Errores de Base de Datos
    RECORD_DUPLICATE_DATA = "RECORD_DUPLICATE_DATA",
    RECORD_NOT_FOUND = "RECORD_NOT_FOUND",
    UNPROCESSABLE_ENTITY= "UNPROCESSABLE_ENTITY",
    // Errores HTTP
    NOT_FOUND = "NOT_FOUND",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    CONFLICT="CONFLIC"
}
