import { NextFunction, Request, Response } from 'express'
import { CustomErrorClass } from '../errors/CustomErrorClass'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof CustomErrorClass) {
    res.status(err.statusCode).send(err.serializeErrors())
  } else {
    res.status(400).send({
      errors: [
        {
          message: 'Something went wrong'
        }
      ]
    })
  }

  next()
}
