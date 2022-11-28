import { ValidationError } from 'express-validator';
import { CustomErrorClass } from './CustomErrorClass';
import { ErrorListSchema } from './ErrorsSchema';

export class BadRequestError extends CustomErrorClass {
    statusCode = 400;

    constructor(private reason: string) {
        super(reason);
    }

    serializeErrors = (): ErrorListSchema => {
        return [{ message: this.reason }];
    }
}