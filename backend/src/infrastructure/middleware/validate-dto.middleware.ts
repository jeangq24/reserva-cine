import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";

export const validateDto = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const dtoInstance = plainToInstance(DtoClass, req.body);
    const errors = await validate(dtoInstance);
    
    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        field: err.property,
        message: Object.values(err.constraints || {}).join(", "),
      }));
      
      return next(new CustomException("Error de validación DTO", ErrorCodes.VALIDATION_ERROR_DTO, HttpStatus.BAD_REQUEST, formattedErrors))
    }
    return next();
  };
}
