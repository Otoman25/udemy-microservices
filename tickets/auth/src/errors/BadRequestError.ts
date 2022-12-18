import { CustomErrorClass } from './CustomErrorClass'
import { ErrorListSchema } from './ErrorsSchema'

export class BadRequestError extends CustomErrorClass {
  statusCode = 400

  constructor (private readonly reason: string) {
    super(reason)
  }

  serializeErrors = (): ErrorListSchema => {
    return [{ message: this.reason }]
  }
}
