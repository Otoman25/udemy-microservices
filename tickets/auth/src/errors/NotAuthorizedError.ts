import { CustomErrorClass } from './CustomErrorClass'
import { ErrorListSchema } from './ErrorsSchema'

export class NotAuthorizedError extends CustomErrorClass {
  statusCode = 401

  constructor () {
    super('Not Authorized')
  }

  serializeErrors = (): ErrorListSchema => {
    return [{ message: 'Not Authorized' }]
  }
}
