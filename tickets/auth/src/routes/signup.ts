import express from 'express';
import { BadRequestError } from '../errors/BadRequestError';
import { environment } from '../utils/environment';
import { User } from '../models/users';
import * as jwt from 'jsonwebtoken';

const signup = async (req: express.Request, res: express.Response) => {
    
    const { email, password } = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new BadRequestError('Email in use');
    }

    const user = User.build({email, password});
    await user.save();

    // User should now be logged in
    // Generate JWT
    const userJWT = jwt.sign({
        id: user.id,
        email: user.email
    }, environment.jwt.JWT_KEY);

    req.session = {
        jwt: userJWT,
    };

    return res.status(200).send(user);
};

export { signup };