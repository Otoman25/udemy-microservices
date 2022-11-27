import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../errors/CustomErrorClass";
import { RequestValidationError } from "../errors/RequestValidationError";

export const errorHandler = (
    err: Error,
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
        if(err instanceof CustomErrorClass) {
            console.log(err.message);
            res.status(err.statusCode).send(err.serializeErrors());
        } else {
            res.status(400).send({
                errors: [ 
                    { 
                        message: 'Something went wrong' 
                    } 
                ]
            });
        }

        next();
};