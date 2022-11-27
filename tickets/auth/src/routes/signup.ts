import express from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/RequestValidationError';

const signup = (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);

    if(errors.isEmpty() === false) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    res.send({});
};

export { signup };