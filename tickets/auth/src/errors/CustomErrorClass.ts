import { ErrorListSchema } from "./ErrorsSchema";

export abstract class CustomErrorClass extends Error {
    public abstract statusCode: number;
    public abstract serializeErrors(): ErrorListSchema;

    constructor(message: string) {
        super(message);

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, CustomErrorClass.prototype);
    }
}