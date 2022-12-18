import { CustomErrorClass } from './CustomErrorClass'
import { ErrorListSchema } from './ErrorsSchema'

export class NotFoundError extends CustomErrorClass {
  statusCode = 404

  constructor () {
    super('Route not found')
  }

  serializeErrors = (): ErrorListSchema => {
    return [{ message: 'Not found' }]
  }
}
