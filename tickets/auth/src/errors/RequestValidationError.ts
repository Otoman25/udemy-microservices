import { ValidationError } from 'express-validator';
import { CustomErrorClass } from './CustomErrorClass';
import { ErrorListSchema } from './ErrorsSchema';

export class RequestValidationError extends CustomErrorClass {
    statusCode = 400;

    constructor(private reasons: ValidationError[]) {
        super('Request validation error');
    }

    serializeErrors = (): ErrorListSchema => {
        const formattedErrors = this.reasons.map(error => { 
            return { message: error.msg, field: error.param };
        });

        return formattedErrors;
    }
}