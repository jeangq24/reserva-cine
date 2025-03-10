import { NextFunction, Request, Response } from "express";
import { GlobalExceptionHandler } from "../../domain/exceptions/IExceptionHandler";
import{ CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";

export const handleError = (error: unknown, req: Request, res: Response, next: NextFunction)=>{
    console.debug(error)
    const response = new GlobalExceptionHandler().handle(error);
    res.status(response.status).json(response);
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    next(new CustomException(`La ruta ${req.originalUrl} no existe`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND));
};