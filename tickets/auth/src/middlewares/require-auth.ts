import { NextFunction, Request, Response } from 'express'
import { NotAuthorizedError } from '../errors/NotAuthorizedError'

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.currentUser == null) {
    throw new NotAuthorizedError()
  }

  next()
}
