import express, { NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/RequestValidationError'

export const validateRequest = (req: express.Request, res: express.Response, next: NextFunction): void => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array())
  }

  next()
}
