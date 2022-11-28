import express from 'express';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../errors/BadRequestError';
import { RequestValidationError } from '../errors/RequestValidationError';
import { User } from '../models/users';

const signup = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);

    if(errors.isEmpty() === false) {
        throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new BadRequestError('Email in use');
    }

    const user = User.build({email, password});
    await user.save();

    return res.status(200).send(user);
};

export { signup };