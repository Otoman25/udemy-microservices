import express from 'express';
import { NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/RequestValidationError";

export const validateRequest = (req: express.Request, res: express.Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(errors.isEmpty() === false) {
        throw new RequestValidationError(errors.array());
    }
    
    next();
};